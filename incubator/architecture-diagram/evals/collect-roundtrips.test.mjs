import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { collectRoundTrips } from './collect-roundtrips.mjs';

test('collection validates immutable descriptions, actual raster signatures and required full stages', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'diagram-collection-'));
  const description = 'Caller invokes API.';
  const ledger = { description, facts: [{ id: 'f', claim: description, evidence: description, critical: true, dimension: 'directions' }] };
  const pairs = Object.fromEntries(['0-2', '2-4', '0-4'].map(p => [p, [{ before: ['f'], after: ['f'], status: 'preserved', reason: 'Same call direction.' }]]));
  try {
    mkdirSync(path.join(dir, 'inputs')); mkdirSync(path.join(dir, 'case-01'));
    writeFileSync(path.join(dir, 'inputs/policy.txt'), 'Generic drawing policy.');
    writeFileSync(path.join(dir, 'inputs/l0-01.txt'), description);
    for (const n of [2, 4]) writeFileSync(path.join(dir, `case-01/l${n}.txt`), description);
    writeFileSync(path.join(dir, 'case-01/judged.json'), JSON.stringify({ levels: { 0: ledger, 2: ledger, 4: ledger }, pairs }));
    for (const n of [1, 3]) {
      for (const ext of ['drawio', 'svg', 'render.json']) writeFileSync(path.join(dir, `case-01/l${n}.${ext}`), readFileSync(new URL(`../prototype/scenario-01.${ext}`, import.meta.url)));
      writeFileSync(path.join(dir, `case-01/l${n}.png`), Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a+msAAAAASUVORK5CYII=', 'base64'));
    }
    const r = collectRoundTrips(dir, ['01']);
    assert.equal(r.cases['01'].mode, 'full-chain');
    assert.equal(r.cases['01'].status, 'no-drift-found');
    assert.deepEqual(r.cases['01'].evidence[1].checks.staticErrors, []);
    writeFileSync(path.join(dir, 'case-01/l2.txt'), 'Changed source.');
    assert.throws(() => collectRoundTrips(dir, ['01']), /source mismatch/);
    writeFileSync(path.join(dir, 'case-01/l2.txt'), description);
    writeFileSync(path.join(dir, 'case-01/l3.png'), '<svg/>');
    assert.throws(() => collectRoundTrips(dir, ['01']), /Invalid raster/);
    assert.throws(() => collectRoundTrips(dir, ['02']));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
