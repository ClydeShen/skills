import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { packages } from '../harness/skill-quality.mjs';
import { agentProvider } from './agents.mjs';
import { armSummary } from './lib.mjs';
import { createSuite, readTriggerCases } from './trigger-suite.mjs';

const skills = packages().map(({ name }) => name);

test('every authored skill has positive and near-miss trigger cases', () => {
  for (const skill of skills) {
    const cases = readTriggerCases(skill);
    assert.ok(
      cases.some((item) => item.expect === 'trigger'),
      skill,
    );
    assert.ok(
      cases.some((item) => item.expect === 'skip'),
      skill,
    );
    assert.equal(new Set(cases.map((item) => item.id)).size, cases.length, skill);
  }
});

test('a near-miss case asserts that the skill stayed unused', async () => {
  const suite = await createSuite({ mode: 'fixture', options: { skill: 'meta-thinking' } });
  const types = new Set(suite.tests.flatMap((item) => item.assert.map(({ type }) => type)));
  assert.deepEqual([...types].sort(), ['not-skill-used', 'skill-used']);
});

test('suite options are validated before anything runs', async () => {
  await assert.rejects(createSuite({ mode: 'fixture', options: {} }), /Name the skill/);
  await assert.rejects(createSuite({ mode: 'fixture', options: { skill: 'absent' } }), /Unknown skill/);
  await assert.rejects(
    createSuite({ mode: 'fixture', options: { skill: 'meta-thinking', agent: 'other' } }),
    /Agent must be/,
  );
});

test('agents load only project settings, cannot write, and do not need an API key', () => {
  const shared = { skill: 'a', directory: '/tmp/a', label: 'x', env: {} };
  const claude = agentProvider('claude', shared).config;
  assert.deepEqual(claude.setting_sources, ['project']);
  assert.equal(claude.apiKeyRequired, false);
  assert.ok(!claude.append_allowed_tools.includes('Write'));
  const codex = agentProvider('codex', shared).config;
  assert.equal(codex.sandbox_mode, 'read-only');
  assert.equal(codex.enable_streaming, true);
});

test('the real assertions separate triggered from skipped runs in synthetic replay', () => {
  const run = spawnSync(
    process.execPath,
    ['evals/run.mjs', '--suite', 'evals/trigger-suite.mjs', '--skill', 'meta-thinking', '--repeat', '2'],
    { encoding: 'utf8' },
  );
  assert.equal(run.status, 0, run.stdout + run.stderr);
  assert.match(run.stdout, /12\/12 checks passed/);
});

test('the arm summary lets two versions of a skill be compared', () => {
  const summary = armSummary([
    { provider_label: 'claude-current', success: true, cost: 0.2, latency_ms: 2000 },
    { provider_label: 'claude-current', success: false, cost: 0.4, latency_ms: 4000 },
    { provider_label: 'claude-baseline-main', success: true },
  ]);
  assert.match(summary, /claude-current: 1\/2 passed; mean cost 0\.3000; mean time 3\.0s/);
  assert.match(summary, /claude-baseline-main: 1\/1 passed/);
});
