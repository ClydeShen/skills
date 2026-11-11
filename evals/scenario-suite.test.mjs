import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { agentProvider } from './agents.mjs';
import { createSuite, gradeScenario, inputOf, readScenarios, scoreOf, summarize } from './scenario-suite.mjs';

test('scenario cases read their source, baseline scores and reviewer prompt', () => {
  const config = readScenarios('architecture-diagram');
  assert.equal(new Set(config.cases.map((c) => c.id)).size, config.cases.length);
  assert.ok(config.cases.every((c) => c.input.trim() && c.baseline?.length));
  assert.match(config.reviewPrompt, /SCORE:/);
  assert.equal(config.tolerance, 0.5);
  // A quoted case gets only the source's block quote, not the expected findings beside it.
  const quoted = config.cases.find((c) => c.id === 'cross-cloud-private-api');
  assert.doesNotMatch(quoted.input, /Natural errors|Recommendation/);
  assert.throws(() => readScenarios('absent'), /No scenarios for absent/);
});

test('a block-quote source keeps only the quoted lines', () => {
  assert.equal(inputOf('# Title\n> one\n>\n> two\nafter'), '# Title\n> one\n>\n> two\nafter');
  assert.equal(inputOf('# Title\n> one\n>\n> two\nafter', 'quoted'), 'one\n\ntwo');
  assert.throws(() => inputOf('x', 'other'), /Unknown input mode/);
});

test('a review score is read from its last line; a low score is reported, never failed', () => {
  const pattern = 'SCORE:\\s*([0-9.]+)\\s*$';
  assert.equal(scoreOf('Notes\nSCORE: 6.5', pattern), 6.5);
  assert.equal(scoreOf('No score here', pattern), null);
  assert.deepEqual(gradeScenario('Text', { pattern, baseline: [7], tolerance: 0.5 }), {
    pass: false,
    score: 0,
    reason: 'The review gave no score.',
  });
  const low = gradeScenario('SCORE: 3', { pattern, baseline: [7], tolerance: 0.5 });
  assert.equal(low.pass, true);
  assert.equal(low.score, 0.3);
});

test('the summary puts each case beside its baseline and marks a mean below the tolerance', () => {
  const config = {
    tolerance: 0.5,
    cases: [
      { id: 'kept', baseline: [7] },
      { id: 'dropped', baseline: [7.5] },
      { id: 'new', baseline: null },
    ],
  };
  const results = [
    { case_id: 'kept', success: true, score: 0.7 },
    { case_id: 'kept', success: true, score: 0.65 },
    { case_id: 'dropped', success: true, score: 0.65 },
    { case_id: 'dropped', success: false, score: 0 },
  ];
  const lines = summarize(results, config).split('\n');
  assert.equal(lines[0], 'kept: 7, 6.5 (mean 6.75); baseline 7 (mean 7.00)');
  assert.equal(lines[1], 'dropped: 6.5 (mean 6.50); baseline 7.5 (mean 7.50); below the baseline');
  assert.equal(lines[2], 'new: no score (mean none)');
});

test('the generating agent may write and run scripts; the reviewer reads only and loads no skill', () => {
  const writer = agentProvider('claude', { skill: 'a', directory: '/tmp/a', label: 'w', env: {}, access: 'write' });
  assert.ok(writer.config.append_allowed_tools.includes('Write'));
  assert.ok(writer.config.append_allowed_tools.includes('Bash'));
  assert.deepEqual(writer.config.setting_sources, ['project']);
  const reviewer = agentProvider('claude', { directory: '/tmp/r', label: 'r', env: {} });
  assert.deepEqual(reviewer.config.setting_sources, []);
  assert.equal(reviewer.config.skills, undefined);
  assert.ok(!reviewer.config.append_allowed_tools.includes('Write'));
  assert.equal(
    agentProvider('codex', { directory: '/tmp/a', label: 'c', env: {}, access: 'write' }).config.sandbox_mode,
    'workspace-write',
  );
  assert.throws(
    () => agentProvider('claude', { directory: '/tmp/a', label: 'x', env: {}, access: 'admin' }),
    /Access must be/,
  );
});

test('suite options are validated, and synthetic replay grades and summarizes without an agent', async () => {
  await assert.rejects(createSuite({ mode: 'fixture', options: {} }), /Name the skill/);
  await assert.rejects(
    createSuite({ mode: 'fixture', options: { skill: 'architecture-diagram', agent: 'all' } }),
    /Agent must be/,
  );
  const run = spawnSync(
    process.execPath,
    ['evals/run.mjs', '--suite', 'evals/scenario-suite.mjs', '--skill', 'architecture-diagram'],
    { encoding: 'utf8' },
  );
  assert.equal(run.status, 0, run.stdout + run.stderr);
  assert.match(run.stdout, /4\/4 checks passed/);
  assert.match(run.stdout, /azure-document-qa: 7 \(mean 7\.00\); baseline 7\.5 \(mean 7\.50\)/);
});
