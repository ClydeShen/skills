import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { packages } from '../harness/skill-quality.mjs';
import { agentProvider, installSkill } from './agents.mjs';

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

// Each arm is a throwaway project holding one version of the skill.
function createArm(item, ref, base) {
  return installSkill(item, ref, path.join(base, ref ?? 'current'));
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
