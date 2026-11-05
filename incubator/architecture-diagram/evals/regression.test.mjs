import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { judge, parseArguments, reviewScore, scenarioInput } from './regression.mjs';

const read = (name) => readFileSync(new URL(name, import.meta.url), 'utf8');

test('a scenario file with a marked input block gives only that block, without quote marks', () => {
  const input = scenarioInput(read('./scenarios/02.md'));
  assert.ok(input.startsWith('Integration workloads in Azure need private access'));
  assert.ok(!input.includes('Natural errors'));
  assert.ok(!input.startsWith('>'));
});

test('a scenario file without a marked block is the input as it stands', () => {
  assert.equal(scenarioInput(read('./scenarios/a.md')), read('./scenarios/a.md'));
});

test('the reviewer score is the number on the last SCORE line', () => {
  assert.equal(reviewScore('Overall 7/10.\nSCORE: 7.5'), 7.5);
  assert.equal(reviewScore('SCORE: 6\n'), 6);
  assert.equal(reviewScore('no score here'), null);
});

test('a scenario passes when the mean of its runs is within the tolerance of the baseline mean', () => {
  assert.equal(judge([7, 7], 'b').pass, true);
  assert.equal(judge([7, 6.5], 'b').pass, false);
  assert.equal(judge([6.5], 'c').pass, true);
  assert.equal(judge([], 'a').pass, false);
});

test('options name known scenarios only', () => {
  assert.deepEqual(parseArguments(['--scenarios', 'a,02', '--runs', '3']).scenarios, ['a', '02']);
  assert.throws(() => parseArguments(['--scenarios', 'z']), /Unknown scenario/);
  assert.throws(() => parseArguments(['--nope', '1']), /Unknown option/);
});
