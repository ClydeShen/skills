import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gradeDecision, modelProvider, nvidiaDefaultModel, nvidiaApiBaseUrl, parseArgs, readSkill, renderPrompt } from './lib.mjs';
import { createSuite } from '../incubator/meta-thinking/evals/suite.mjs';

const expected = { approach: ['continue'], memory: ['skip'], cause: ['unknown'] };
const good = { approach: 'continue', memory: 'skip', cause: 'unknown', explanation: 'Clear task', next_action: 'Translate the sentence.' };

test('grading rejects malformed responses and unsafe decision substitutions', () => {
  assert.equal(gradeDecision(JSON.stringify(good), expected).pass, true);
  for (const output of ['null', '[]', 'not JSON', JSON.stringify({ ...good, memory: 'record' }), JSON.stringify({ ...good, cause: 'supported' }), JSON.stringify({ ...good, next_action: '' })]) {
    assert.equal(gradeDecision(output, expected).pass, false, output);
  }
});

test('all 14 cases reach assertions without leaking grading labels or fixtures into prompts', async () => {
  const suite = await createSuite({ mode: 'fixture' });
  assert.equal(suite.tests.length, 14);
  for (const t of suite.tests) {
    assert.deepEqual(Object.keys(t.vars).sort(), ['case_id', 'conversation']);
    const response = await suite.providers[0]('', { vars: t.vars });
    assert.equal(t.assert[0].value(response.output).pass, true);
    assert.equal(t.assert[0].value(JSON.stringify({ ...JSON.parse(response.output), approach: 'invalid' })).pass, false);
    for (const prompt of suite.prompts) {
      const messages = JSON.parse(await prompt.function({ vars: t.vars }));
      assert.equal(messages[1].content, t.vars.conversation);
      assert.equal(messages.length, 2);
    }
  }
});

test('current skill and both runtime references are included only in the full candidate', async () => {
  const skill = await readSkill(new URL('../incubator/meta-thinking/candidate/meta-thinking/', import.meta.url));
  assert.match(skill.full, /# User profile memory/);
  assert.match(skill.full, /# Interaction options/);
  const suite = await createSuite({ mode: 'model' });
  assert.equal(suite.providers.length, 0);
  const fullMessages = JSON.parse(suite.prompts[2].function({ vars: suite.tests[0].vars }));
  assert.ok(fullMessages[0].content.includes(skill.full));
  assert.ok(!JSON.parse(suite.prompts[0].function({ vars: suite.tests[0].vars }))[0].content.includes(skill.full));
});

test('model mode requires explicit settings and never silently selects a paid provider', () => {
  assert.throws(() => modelProvider({}), /requires/);
  assert.throws(() => modelProvider({ EVAL_MODEL: 'example', EVAL_API_BASE_URL: 'https://example.com/v1' }), /explicit EVAL_API_KEY/);
  assert.throws(() => modelProvider({ EVAL_MODEL: 'example', EVAL_API_BASE_URL: 'https://secret@example.com/v1' }), /without credentials/);
  const local = modelProvider({ EVAL_MODEL: 'local-model', EVAL_API_BASE_URL: 'http://localhost:11434/v1' });
  assert.equal(local.config.apiBaseUrl, 'http://localhost:11434/v1');
  assert.equal(local.config.useDefaultApiKey, false);
});

test('portable options accept suite paths with spaces and reject unknown flags', () => {
  assert.equal(parseArgs([]).mode, 'fixture');
  assert.equal(parseArgs(['--suite', 'a folder/suite.mjs']).suite, 'a folder/suite.mjs');
  assert.throws(() => parseArgs(['--mode', 'unknown']));
  assert.throws(() => parseArgs(['--typo', 'value']));
  assert.throws(() => parseArgs(['--mode']));
  assert.equal(parseArgs(['--provider', 'nvidia']).provider, 'nvidia');
  assert.equal(parseArgs(['--case', 'C6']).case, 'C6');
  assert.throws(() => parseArgs(['--provider', 'unknown']));
  assert.equal(JSON.parse(renderPrompt('', { conversation: 'line 1\nline 2' }))[1].content, 'line 1\nline 2');
});

test('NVIDIA preset uses only its key at the fixed endpoint and records explicit model parameters', () => {
  const env = { NVIDIA_API_KEY: 'synthetic-nvidia-key' };
  const nvidia = modelProvider(env);
  assert.equal(nvidia.id, `openai:chat:${nvidiaDefaultModel}`);
  assert.equal(nvidia.config.apiBaseUrl, nvidiaApiBaseUrl);
  assert.equal(nvidia.config.apiKey, env.NVIDIA_API_KEY);
  assert.equal(nvidia.config.passthrough.reasoning_effort, 'none');
  assert.equal(nvidia.config.max_tokens, 4096);
  assert.equal(modelProvider({ ...env, NVIDIA_REASONING_EFFORT: 'low' }).config.max_tokens, 16384);
  assert.equal(modelProvider({ ...env, NVIDIA_MODEL: 'another-model' }).id, 'openai:chat:another-model');
  assert.equal(modelProvider({ ...env, NVIDIA_MODEL: 'another-model' }).config.passthrough.reasoning_effort, undefined);
  assert.throws(() => modelProvider({ EVAL_API_KEY: 'not-nvidia' }, 'nvidia'), /NVIDIA_API_KEY/);
  assert.throws(() => modelProvider({ ...env, NVIDIA_REASONING_EFFORT: 'invalid' }), /NVIDIA_REASONING_EFFORT/);
  assert.throws(() => modelProvider({ ...env, EVAL_MAX_TOKENS: 'NaN' }), /EVAL_MAX_TOKENS/);
  const other = { ...env, EVAL_MODEL: 'local', EVAL_API_BASE_URL: 'http://localhost:11434/v1' };
  assert.equal(modelProvider(other).config.apiKey, 'local-evaluation');
  assert.equal(modelProvider(other, 'nvidia').config.apiBaseUrl, nvidiaApiBaseUrl);
  assert.throws(() => modelProvider({ ...env, EVAL_MODEL: 'incomplete' }), /requires/);
});

test('empty profile template remains empty; evaluation reads no actual user profile', async () => {
  const data = JSON.parse(await readFile(new URL('../incubator/meta-thinking/candidate/meta-thinking/assets/profile.empty.json', import.meta.url), 'utf8'));
  assert.deepEqual(data, { version: 1, episodes: [], patterns: [] });
});
