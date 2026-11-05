// Runs the baseline scenarios against the working package, or against a git ref, and applies the pass rule of
// baseline/README.md. Each run is a clean Claude Code session; a reviewer with only the scenario and the images scores it.
//   node incubator/architecture-diagram/evals/regression.mjs [--scenarios a,b,02,c] [--runs 2] [--ref <git ref>] [--parallel 2]
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exportPackageAtRef, exportWorkingPackage, packages } from '../../../harness/skill-quality.mjs';

const here = fileURLToPath(new URL('./', import.meta.url));
const root = fileURLToPath(new URL('../../../', import.meta.url));
const baseline = JSON.parse(readFileSync(path.join(here, 'baseline/baseline.json'), 'utf8'));
const reviewPrompt = readFileSync(path.join(here, 'baseline/review-prompt.md'), 'utf8');
const SKILL = 'architecture-diagram';
const GENERATE = `Use the ${SKILL} skill to create diagram.drawio from scenario.md. Write your companion account to agent-report.md.`;
const claudeBin = process.env.CLAUDE_BIN || 'claude';
// The session sees the network and the credentials it needs, and nothing else of this machine.
const PASS_THROUGH = [
  'PATH',
  'SystemRoot',
  'TEMP',
  'TMP',
  'HTTPS_PROXY',
  'HTTP_PROXY',
  'NO_PROXY',
  'SSL_CERT_FILE',
  'NODE_EXTRA_CA_CERTS',
  'ANTHROPIC_API_KEY',
  'ANTHROPIC_AUTH_TOKEN',
  'ANTHROPIC_BASE_URL',
  'DRAWIO_CHECKOUT',
  'DIAGRAM_BROWSER',
];

export function parseArguments(argv) {
  const options = { scenarios: Object.keys(baseline.scenarios), runs: 2, parallel: 2, ref: undefined };
  for (let i = 0; i < argv.length; i += 2) {
    const [flag, value] = [argv[i], argv[i + 1]];
    if (flag === '--scenarios') options.scenarios = value.split(',');
    else if (flag === '--runs') options.runs = Number(value);
    else if (flag === '--parallel') options.parallel = Number(value);
    else if (flag === '--ref') options.ref = value;
    else throw new Error(`Unknown option: ${flag}`);
  }
  for (const id of options.scenarios) if (!baseline.scenarios[id]) throw new Error(`Unknown scenario: ${id}`);
  if (!(options.runs >= 1) || !(options.parallel >= 1))
    throw new Error('--runs and --parallel are numbers of 1 or more.');
  return options;
}

// A scenario file either is the input, or marks the input with a bold "Input text given to the skill:" line.
export function scenarioInput(text) {
  const lines = text.split('\n');
  const start = lines.findIndex((line) => line.startsWith('**Input text given to the skill:**'));
  if (start < 0) return text;
  const block = [];
  for (const line of lines.slice(start + 1)) {
    if (line.startsWith('**')) break;
    block.push(line.replace(/^> ?/, ''));
  }
  return `${block.join('\n').trim()}\n`;
}

export function reviewScore(text) {
  const match = text.match(/SCORE:\s*([0-9]+(?:\.[0-9]+)?)\s*$/m);
  return match ? Number(match[1]) : null;
}

const mean = (numbers) => numbers.reduce((sum, n) => sum + n, 0) / numbers.length;

export function judge(scores, scenario) {
  const required = mean(baseline.scenarios[scenario].scores) - baseline.tolerance;
  const got = scores.length ? mean(scores) : null;
  return { scenario, required, got, pass: got !== null && got >= required };
}

function cleanEnvironment(home) {
  const env = { HOME: home, USERPROFILE: home };
  for (const name of PASS_THROUGH) if (process.env[name] !== undefined) env[name] = process.env[name];
  return env;
}

function run(command, args, cwd, env, timeout) {
  return spawnSync(command, args, { cwd, env, encoding: 'utf8', timeout, maxBuffer: 64 * 1024 * 1024 });
}

function summary(result) {
  try {
    const parsed = JSON.parse(result.stdout);
    return {
      error: parsed.is_error === true,
      turns: parsed.num_turns,
      seconds: Math.round(parsed.duration_ms / 1000),
      text: parsed.result ?? '',
    };
  } catch {
    return { error: true, text: `${result.stderr || result.stdout || ''}`.slice(0, 300) };
  }
}

function oneRun({ scenario, number, packageDirectory, output }) {
  const directory = path.join(output, `${scenario}-${number}`);
  const home = path.join(directory, 'home');
  const work = path.join(directory, 'work');
  const skills = path.join(work, '.claude/skills');
  mkdirSync(skills, { recursive: true });
  mkdirSync(home, { recursive: true });
  cpSync(packageDirectory, path.join(skills, SKILL), { recursive: true });
  const cache = path.join(homedir(), '.cache/architecture-diagram');
  if (existsSync(cache)) cpSync(cache, path.join(home, '.cache/architecture-diagram'), { recursive: true });
  const input = scenarioInput(readFileSync(path.join(here, 'scenarios', `${scenario}.md`), 'utf8'));
  writeFileSync(path.join(work, 'scenario.md'), input);
  run('git', ['init', '-q'], work, process.env, 60_000);
  const env = cleanEnvironment(home);
  const model = process.env.EVAL_CLAUDE_MODEL ? ['--model', process.env.EVAL_CLAUDE_MODEL] : [];
  const generated = summary(
    run(
      claudeBin,
      [
        '-p',
        GENERATE,
        '--permission-mode',
        'acceptEdits',
        '--allowedTools',
        'Bash',
        'Read',
        'Write',
        'Edit',
        'Glob',
        'Grep',
        'Skill',
        '--output-format',
        'json',
        ...model,
      ],
      work,
      env,
      45 * 60_000,
    ),
  );
  const diagram = path.join(work, 'diagram.drawio');
  const record = {
    scenario,
    run: number,
    generated: { turns: generated.turns, seconds: generated.seconds },
    score: null,
  };
  if (generated.error || !existsSync(diagram))
    return { ...record, failure: `generation failed: ${generated.text.slice(0, 200)}` };
  const scripts = path.join(skills, SKILL, 'scripts');
  const layout = run(process.execPath, [path.join(scripts, 'check-layout.mjs'), diagram], work, env, 120_000);
  record.layout = `${layout.stdout}${layout.stderr}`.trim().split('\n').at(-1);
  const images = path.join(directory, 'review/images');
  mkdirSync(images, { recursive: true });
  cpSync(diagram, path.join(images, 'diagram.drawio'));
  const rendered = run(
    process.execPath,
    [path.join(scripts, 'render.mjs'), path.join(images, 'diagram.drawio')],
    work,
    env,
    300_000,
  );
  const pictures = readdirSync(images).filter((name) => name.endsWith('.png'));
  if (rendered.status !== 0 || !pictures.length) return { ...record, failure: 'no image could be rendered' };
  cpSync(path.join(work, 'scenario.md'), path.join(directory, 'review/scenario.md'));
  const review = summary(
    run(
      claudeBin,
      ['-p', reviewPrompt, '--allowedTools', 'Read', '--output-format', 'json', ...model],
      path.join(directory, 'review'),
      env,
      20 * 60_000,
    ),
  );
  const score = reviewScore(review.text);
  writeFileSync(path.join(directory, 'review/review.md'), review.text);
  return {
    ...record,
    pages: pictures.length,
    score,
    ...(score === null ? { failure: 'the reviewer gave no score' } : {}),
  };
}

async function pool(items, size, task) {
  const results = [];
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      while (next < items.length) {
        const index = next++;
        results[index] = await Promise.resolve().then(() => task(items[index]));
      }
    }),
  );
  return results;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const item = packages().find(({ name }) => name === SKILL);
  const staging = mkdtempSync(path.join(tmpdir(), 'diagram-regression-'));
  const packageDirectory = options.ref
    ? exportPackageAtRef(item, options.ref, path.join(staging, 'package'))
    : exportWorkingPackage(item, path.join(staging, 'package'));
  if (!packageDirectory) throw new Error(`The package does not exist at ${options.ref}.`);
  const output = path.join(
    root,
    'evals/.local',
    `diagram-regression-${new Date().toISOString().replace(/[:.]/g, '-')}`,
  );
  mkdirSync(output, { recursive: true });
  const jobs = options.scenarios.flatMap((scenario) =>
    Array.from({ length: options.runs }, (_, i) => ({ scenario, number: i + 1, packageDirectory, output })),
  );
  console.log(`Running ${jobs.length} clean sessions, ${options.parallel} at a time. Output: ${output}`);
  const results = await pool(jobs, options.parallel, (job) => {
    const result = oneRun(job);
    console.log(
      `  ${job.scenario} run ${job.number}: ${result.failure ?? `score ${result.score}`}${result.layout ? `; ${result.layout}` : ''}`,
    );
    return result;
  });
  const verdicts = options.scenarios.map((scenario) =>
    judge(
      results.filter((r) => r.scenario === scenario && r.score !== null).map((r) => r.score),
      scenario,
    ),
  );
  console.log('\nScenario  Required  Got   Result');
  for (const v of verdicts)
    console.log(
      `${v.scenario.padEnd(9)} ${v.required.toFixed(2).padEnd(9)} ${v.got === null ? 'none' : v.got.toFixed(2).padEnd(5)} ${v.pass ? 'pass' : 'FAIL'}`,
    );
  writeFileSync(
    path.join(output, 'result.json'),
    `${JSON.stringify({ ref: options.ref ?? 'working tree', baseline: baseline.commit, results, verdicts }, null, 2)}\n`,
  );
  const failed = verdicts.some((v) => !v.pass) || results.some((r) => r.failure);
  console.log(
    failed ? '\nNot at the baseline. Read the reviews and images in the output folder.' : '\nAt or above the baseline.',
  );
  process.exitCode = failed ? 1 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
