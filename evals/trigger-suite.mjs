import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exportPackageAtRef, exportWorkingPackage, packages } from '../harness/skill-quality.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));

export function readTriggerCases(skill) {
  const file = path.join(root, 'incubator', skill, 'evals/trigger.json');
  if (!existsSync(file)) throw new Error(`No trigger cases for ${skill}. Add incubator/${skill}/evals/trigger.json.`);
  const { cases } = JSON.parse(readFileSync(file, 'utf8'));
  for (const test of cases) {
    if (!test.id || !test.request || !['trigger', 'skip'].includes(test.expect))
      throw new Error(`Invalid trigger case: ${test.id}`);
  }
  if (!cases.some((test) => test.expect === 'skip'))
    throw new Error('Add a near-miss case: a skill that always triggers would pass otherwise.');
  return cases;
}

// Each arm is a throwaway project holding one version of the skill in both clients' native locations.
function createArm(item, ref, base) {
  const directory = path.join(base, ref ?? 'current');
  const exported = ref
    ? exportPackageAtRef(item, ref, path.join(directory, '.export'))
    : exportWorkingPackage(item, path.join(directory, '.export'));
  if (!exported) throw new Error(`${item.name} does not exist at ${ref}.`);
  for (const location of ['.claude/skills', '.agents/skills']) {
    mkdirSync(path.join(directory, location), { recursive: true });
    cpSync(exported, path.join(directory, location, item.name), { recursive: true });
  }
  rmSync(path.join(directory, '.export'), { recursive: true, force: true });
  return directory;
}

export function agentProvider(agent, { skill, directory, label, env }) {
  if (agent === 'claude') {
    return {
      id: 'anthropic:claude-agent-sdk',
      label,
      config: {
        working_dir: directory,
        setting_sources: ['project'],
        skills: [skill],
        append_allowed_tools: ['Read', 'Glob', 'Grep'],
        max_turns: 6,
        persist_session: false,
        // Without an API key the SDK uses the existing Claude Code login.
        apiKeyRequired: Boolean(env.ANTHROPIC_API_KEY),
        ...(env.EVAL_CLAUDE_MODEL ? { model: env.EVAL_CLAUDE_MODEL } : {}),
      },
    };
  }
  return {
    id: 'openai:codex-sdk',
    label,
    config: {
      working_dir: directory,
      skip_git_repo_check: true,
      sandbox_mode: 'read-only',
      // Promptfoo infers Codex skill use from streamed SKILL.md reads.
      enable_streaming: true,
      ...(env.EVAL_CODEX_MODEL ? { model: env.EVAL_CODEX_MODEL } : {}),
    },
  };
}

export async function createSuite({ mode, env = {}, options = {} }) {
  const { skill, agent = 'all', baseline } = options;
  if (!skill) throw new Error('Name the skill: --skill <name>.');
  if (!['all', 'claude', 'codex'].includes(agent)) throw new Error('Agent must be all, claude, or codex.');
  const item = packages().find(({ name }) => name === skill);
  if (!item) throw new Error(`Unknown skill: ${skill}.`);
  const cases = readTriggerCases(skill);
  const tests = cases.map((test) => ({
    description: test.id,
    vars: { case_id: test.id, request: test.request, expect: test.expect },
    assert: [{ type: test.expect === 'trigger' ? 'skill-used' : 'not-skill-used', value: skill }],
  }));
  const description = `${skill} trigger checks with real agents. skill-used on Codex is a heuristic; spot check the records.`;
  const prompts = [{ label: 'request', raw: '{{request}}' }];
  if (mode === 'fixture') {
    const provider = async (_prompt, context) => ({
      output: 'synthetic',
      metadata: { skillCalls: context.vars.expect === 'trigger' ? [{ name: skill }] : [] },
    });
    return {
      description: `${skill} trigger checks: synthetic replay, no agent ran.`,
      prompts,
      providers: [provider],
      tests,
    };
  }
  const base = mkdtempSync(path.join(os.tmpdir(), 'skill-trigger-'));
  process.once('exit', () => rmSync(base, { recursive: true, force: true }));
  const arms = [
    { label: 'current', directory: createArm(item, undefined, base) },
    ...(baseline ? [{ label: `baseline-${baseline}`, directory: createArm(item, baseline, base) }] : []),
  ];
  const agents = agent === 'all' ? ['claude', 'codex'] : [agent];
  const providers = agents.flatMap((name) =>
    arms.map(({ label, directory }) => agentProvider(name, { skill, directory, label: `${name}-${label}`, env })),
  );
  return { description, prompts, providers, tests };
}
