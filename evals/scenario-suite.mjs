import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { packages } from '../harness/skill-quality.mjs';
import { agentProvider, installSkill } from './agents.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));

// A scenario case gives a skill one source and an unchanged prompt; a context-free reviewer scores the result.
export function readScenarios(skill) {
  const directory = path.join(root, 'incubator', skill, 'evals');
  const file = path.join(directory, 'scenarios.json');
  if (!existsSync(file)) throw new Error(`No scenarios for ${skill}. Add incubator/${skill}/evals/scenarios.json.`);
  const config = JSON.parse(readFileSync(file, 'utf8'));
  for (const key of ['prompt', 'input_file', 'review', 'cases'])
    if (!config[key]) throw new Error(`scenarios.json needs ${key}.`);
  if (!config.review.prompt || !config.review.files || !config.review.score)
    throw new Error('scenarios.json review needs prompt, files and score.');
  const ids = config.cases.map((c) => c.id);
  if (new Set(ids).size !== ids.length) throw new Error('Scenario case IDs must be unique.');
  const baseline = config.baseline ? JSON.parse(readFileSync(path.join(directory, config.baseline), 'utf8')) : null;
  const cases = config.cases.map((c) => {
    if (!c.id || !c.source) throw new Error(`Invalid scenario case: ${c.id}`);
    const input = inputOf(readFileSync(path.join(directory, c.source), 'utf8'), c.input);
    if (!input.trim()) throw new Error(`No input in ${c.source}.`);
    const scores = c.baseline ? baseline?.scenarios?.[c.baseline]?.scores : undefined;
    if (c.baseline && !scores) throw new Error(`No baseline scores for ${c.id}.`);
    return { id: c.id, input, baseline: scores ?? null };
  });
  return {
    ...config,
    reviewPrompt: readFileSync(path.join(directory, config.review.prompt), 'utf8'),
    tolerance: baseline?.tolerance ?? null,
    baselineRef: baseline?.commit ?? null,
    cases,
  };
}

// "quoted" gives the session only the source's block quote, such as a case whose file also holds expected findings.
export function inputOf(source, mode = 'whole') {
  if (mode === 'whole') return source;
  if (mode !== 'quoted') throw new Error(`Unknown input mode ${mode}.`);
  return source
    .split('\n')
    .filter((line) => line.startsWith('>'))
    .map((line) => line.replace(/^> ?/, ''))
    .join('\n');
}

export function scoreOf(review, pattern) {
  const match = String(review ?? '').match(new RegExp(pattern, 'm'));
  return match ? Number(match[1]) : null;
}

// Copies only what the reviewer may see: a file by name, or every file with a suffix into a folder.
function prepareReview(workspace, files, directory) {
  mkdirSync(directory, { recursive: true });
  const copied = [];
  for (const [target, source] of Object.entries(files)) {
    if (target.endsWith('/')) {
      mkdirSync(path.join(directory, target), { recursive: true });
      for (const name of readdirSync(workspace).filter((n) => n.endsWith(source))) {
        copyFileSync(path.join(workspace, name), path.join(directory, target, name));
        copied.push(target + name);
      }
    } else if (existsSync(path.join(workspace, source))) {
      copyFileSync(path.join(workspace, source), path.join(directory, target));
      copied.push(target);
    }
  }
  return copied;
}

function runAfter(commands, workspace, skill) {
  return commands.map((command) => {
    const [program, ...args] = command.map((part) => part.replace('{package}', `.claude/skills/${skill}`));
    const run = spawnSync(program === 'node' ? process.execPath : program, args, {
      cwd: workspace,
      encoding: 'utf8',
      timeout: 600000,
    });
    const last = (text = '') => text.trim().split('\n').at(-1) ?? '';
    // A command's result line is its last line of standard output; its findings go to standard error.
    return {
      command: command.join(' '),
      status: run.status,
      summary: last(run.stdout) || last(run.stderr),
      output: `${run.stdout}${run.stderr}`.trim(),
    };
  });
}

// One run: a fresh project with the package and the source, then a fresh folder with only what the reviewer may see.
function scenarioProvider({ item, config, agent, env, base }) {
  let count = 0;
  return {
    id: () => `scenario-${agent}`,
    label: `${agent}-current`,
    async callApi(prompt, context) {
      const run = path.join(base, `${context.vars.case_id}-${++count}`);
      const workspace = installSkill(item, undefined, path.join(run, 'work'));
      writeFileSync(path.join(workspace, config.input_file), context.vars.input);
      const generator = await loadApiProvider(
        ...providerArgs(
          agentProvider(agent, { skill: item.name, directory: workspace, label: 'generate', env, access: 'write' }),
        ),
      );
      const generated = await generator.callApi(prompt);
      const after = runAfter(config.after ?? [], workspace, item.name);
      const reviewDirectory = path.join(run, 'review');
      const shown = prepareReview(workspace, config.review.files, reviewDirectory);
      const reviewer = await loadApiProvider(
        ...providerArgs(agentProvider(agent, { directory: reviewDirectory, label: 'review', env })),
      );
      const review = await reviewer.callApi(config.reviewPrompt);
      const details = {
        run,
        generation_error: generated.error ? 'Generation failed.' : undefined,
        review_error: review.error ? 'Review failed.' : undefined,
        after: after.map(({ command, status, summary }) => ({ command, status, summary })),
        reviewed: shown,
      };
      writeFileSync(path.join(run, 'review.md'), review.output ?? '');
      writeFileSync(path.join(run, 'after.txt'), after.map((a) => `$ ${a.command}\n${a.output}`).join('\n\n'));
      writeFileSync(path.join(run, 'details.json'), `${JSON.stringify(details, null, 2)}\n`);
      return {
        output: review.output ?? '',
        error: generated.error || review.error ? 'Generation or review failed.' : undefined,
        cost: (generated.cost ?? 0) + (review.cost ?? 0),
        metadata: { details },
      };
    },
  };
}

const providerArgs = ({ id, label, config }) => [id, { options: { label, config } }];
const loadApiProvider = async (...args) => (await import('promptfoo')).default.loadApiProvider(...args);

export function gradeScenario(output, { pattern, baseline, tolerance }) {
  const score = scoreOf(output, pattern);
  if (score === null) return { pass: false, score: 0, reason: 'The review gave no score.' };
  // The owner judges a comparison; a low score is reported, not failed.
  const reference = baseline?.length ? baseline.reduce((a, b) => a + b, 0) / baseline.length : null;
  return {
    pass: true,
    score: score / 10,
    reason:
      reference === null ? `Score ${score}.` : `Score ${score}; baseline mean ${reference}, tolerance ${tolerance}.`,
  };
}

// Per case: the mean of this run's scores beside the baseline mean.
export function summarize(results, config) {
  return config.cases
    .map(({ id, baseline }) => {
      const scores = results.filter((r) => r.case_id === id && r.success).map((r) => Math.round(r.score * 100) / 10);
      const mean = (values) => values.reduce((a, b) => a + b, 0) / values.length;
      const now = scores.length ? mean(scores).toFixed(2) : 'none';
      if (!baseline) return `${id}: ${scores.join(', ') || 'no score'} (mean ${now})`;
      const reference = mean(baseline);
      const below = scores.length && mean(scores) < reference - config.tolerance ? '; below the baseline' : '';
      return `${id}: ${scores.join(', ') || 'no score'} (mean ${now}); baseline ${baseline.join(', ')} (mean ${reference.toFixed(2)})${below}`;
    })
    .join('\n');
}

export async function createSuite({ mode, env = {}, options = {} }) {
  const { skill, agent = 'claude' } = options;
  if (!skill) throw new Error('Name the skill: --skill <name>.');
  if (!['claude', 'codex'].includes(agent)) throw new Error('Agent must be claude or codex.');
  const item = packages().find(({ name }) => name === skill);
  if (!item) throw new Error(`Unknown skill: ${skill}.`);
  const config = readScenarios(skill);
  const tests = config.cases.map((c) => ({
    description: c.id,
    options: { disableVarExpansion: true },
    vars: { case_id: c.id, input: c.input },
    assert: [
      {
        type: 'javascript',
        value: (output) =>
          gradeScenario(output, { pattern: config.review.score, baseline: c.baseline, tolerance: config.tolerance }),
      },
    ],
  }));
  const prompts = [{ label: 'scenario', raw: config.prompt }];
  const summary = (results) => summarize(results, config);
  if (mode === 'fixture') {
    return {
      description: `${skill} scenario checks: synthetic replay, no agent ran.`,
      prompts,
      providers: [async () => ({ output: 'Synthetic review.\nSCORE: 7' })],
      tests,
      summary,
    };
  }
  mkdirSync(path.join(root, 'evals/.local'), { recursive: true });
  const base = mkdtempSync(path.join(root, 'evals/.local', `scenario-${skill}-`));
  return {
    description: `${skill} clean scenario runs with ${agent}, reviewed without context. Outputs: ${base}`,
    prompts,
    providers: [scenarioProvider({ item, config, agent, env, base })],
    tests,
    summary,
  };
}
