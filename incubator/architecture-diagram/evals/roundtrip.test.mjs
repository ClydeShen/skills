import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { compareLedgers, evaluateDescriptions, executeRoundTrip } from './roundtrip.mjs';

const ledger = (claim = 'Caller invokes API.', critical = false, dimension = 'relationships') => ({ description: claim, facts: [{ id: 'f1', dimension, claim, critical, evidence: claim }] });
const preserved = [{ before: ['f1'], after: ['f1'], status: 'preserved', reason: 'Same architectural fact, not literal wording.' }];
const judged = descriptions => ({ levels: Object.fromEntries(Object.entries(descriptions).map(([level, text]) => [level, ledger(text)])), pairs: Object.fromEntries(['0-2', '2-4', '0-4'].map(pair => [pair, preserved])) });

test('semantic comparison distinguishes omissions, additions, changes, uncertainty and critical failures', () => {
  assert.equal(compareLedgers(ledger(), ledger('The API is called by the caller.'), preserved).status, 'no-drift-found');
  const changed = preserved.map(r => ({ ...r, status: 'changed', reason: 'Direction reversed.' }));
  assert.equal(compareLedgers(ledger(), ledger(), changed).status, 'drift');
  assert.equal(compareLedgers(ledger('Caller invokes API.', true, 'directions'), ledger('API invokes caller.', true, 'directions'), changed).status, 'hard-fail');
  assert.equal(compareLedgers(ledger(), ledger(), preserved.map(r => ({ ...r, status: 'uncertain' }))).status, 'incomplete');
  const replaced = [{ before: ['f1'], after: [], status: 'omitted', reason: 'Missing call.' }, { before: [], after: ['f1'], status: 'added', reason: 'New call.' }];
  const r = compareLedgers(ledger(), ledger('Another call.'), replaced);
  assert.equal(r.counts.relationships.omitted, 1); assert.equal(r.counts.relationships.added, 1);
});

test('comparison rejects ungrounded evidence, duplicate/incomplete mappings and invalid dimensions', () => {
  for (const mutate of [
    x => { x.facts[0].evidence = 'Not in the source.'; },
    x => { x.facts[0].dimension = 'wording'; },
    x => { delete x.facts[0].critical; },
    x => { x.facts.push({ ...x.facts[0] }); },
  ]) { const x = ledger(); mutate(x); assert.throws(() => compareLedgers(x, ledger(), preserved)); }
  assert.throws(() => compareLedgers(ledger(), ledger(), []));
  assert.throws(() => compareLedgers(ledger(), ledger(), [...preserved, ...preserved]));
  assert.throws(() => compareLedgers(ledger(), ledger(), [{ ...preserved[0], after: ['unknown'] }]));
  assert.throws(() => compareLedgers(ledger(), ledger('Caller invokes API.', false, 'directions'), preserved));
});

test('all three pairs are required; stable later rounds cannot conceal initial critical drift', () => {
  const j = judged({ 0: 'Inside domain.', 2: 'Outside domain.', 4: 'Outside domain.' });
  for (const l of Object.values(j.levels)) l.facts[0].critical = true;
  j.pairs['0-2'] = preserved.map(r => ({ ...r, status: 'changed' }));
  j.pairs['0-4'] = preserved.map(r => ({ ...r, status: 'changed' }));
  assert.equal(evaluateDescriptions(j).status, 'hard-fail');
  assert.equal(evaluateDescriptions(j).comparisons['2-4'].status, 'no-drift-found');
  delete j.pairs['0-4']; assert.throws(() => evaluateDescriptions(j));
});

test('runner passes only images to distinct fresh readers and L2 to the second generator', async () => {
  const calls = []; let n = 0;
  const adapter = {
    generate: async packet => { calls.push(['generate', packet]); return { context: { id: `g${++n}`, fresh: true }, output: 'diagram' + n }; },
    render: async packet => { calls.push(['render', packet]); return { mimeType: 'image/png', image: 'raster:' + packet.diagram }; },
    read: async packet => { calls.push(['read', packet]); return { context: { id: `r${++n}`, fresh: true }, output: 'description' + n }; },
    judge: async packet => { calls.push(['judge', packet]); return judged(packet.descriptions); },
  };
  const result = await executeRoundTrip({ description: 'Source description.', policy: 'Drawing conventions.', adapter });
  assert.equal(result.mode, 'full-chain');
  assert.deepEqual(calls.map(c => c[0]), ['generate', 'render', 'read', 'generate', 'render', 'read', 'judge']);
  for (const [, packet] of calls.filter(c => c[0] === 'read')) assert.deepEqual(Object.keys(packet), ['image']);
  assert.deepEqual(calls[3][1], { description: 'description2', policy: 'Drawing conventions.' });
  assert.equal(calls[3][1].description.includes('Source'), false);
  const pilot = await executeRoundTrip({ description: 'Source description.', policy: 'Drawing conventions.', adapter, initialDiagram: 'existing' });
  assert.equal(pilot.mode, 'existing-L1-pilot');
});

test('runner refuses reused/nonfresh contexts and judge source rewrites', async () => {
  const adapter = { generate: async () => ({ context: { id: 'same', fresh: true }, output: 'diagram' }), render: async () => ({ mimeType: 'image/png', image: 'image' }), read: async () => ({ context: { id: 'same', fresh: true }, output: 'description' }) };
  await assert.rejects(executeRoundTrip({ description: 'source', adapter }), /distinct fresh/);
  adapter.read = async () => ({ context: { id: 'reader', fresh: false }, output: 'description' });
  await assert.rejects(executeRoundTrip({ description: 'source', adapter }), /distinct fresh/);
  let n = 0;
  for (const role of ['generate', 'read']) adapter[role] = async () => ({ context: { id: String(++n), fresh: true }, output: 'output' });
  adapter.judge = async () => judged({ 0: 'changed', 2: 'output', 4: 'output' });
  await assert.rejects(executeRoundTrip({ description: 'source', adapter }), /Judge changed source/);
  adapter.render = async () => ({ mimeType: 'image/svg+xml', image: '<svg>source text</svg>' });
  await assert.rejects(executeRoundTrip({ description: 'source', adapter }), /must supply a PNG/);
  await assert.rejects(executeRoundTrip({ description: 'source', adapter, initialDiagram: '' }), /Missing L1/);
});

test('saved live pilot reproduces observed drift, not a fabricated all-green quality score', () => {
  const input = JSON.parse(readFileSync(new URL('./roundtrip-pilot-2026-10-29/judged.json', import.meta.url), 'utf8'));
  const result = evaluateDescriptions(input);
  assert.equal(result.status, 'drift');
  for (const key of ['0-2', '0-4']) {
    assert.equal(result.comparisons[key].alignments.filter(r => r.status === 'omitted').length, 11);
    assert.equal(result.comparisons[key].hardFailures.length, 0);
  }
  assert.equal(result.comparisons['2-4'].status, 'no-drift-found');
  const provenance = JSON.parse(readFileSync(new URL('./roundtrip-pilot-2026-10-29/provenance.json', import.meta.url), 'utf8'));
  const hash = value => createHash('sha256').update(value).digest('hex');
  assert.equal(hash(input.levels[0].description), provenance.baseline.sha256);
  for (const level of [2, 4]) assert.equal(hash(input.levels[level].description), provenance.levels[level].sha256);
  assert.equal(hash(readFileSync(new URL('./roundtrip-pilot-2026-10-29/l3.drawio', import.meta.url))), provenance.levels[3].xml_sha256);
});
