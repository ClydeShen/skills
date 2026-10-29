import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { collectRoundTrips } from './collect-roundtrips.mjs';

test('four saved full chains reproduce mixed semantic results and immutable image evidence', () => {
  const directory = fileURLToPath(new URL('./full-roundtrip-2026-10-29/', import.meta.url));
  const actual = collectRoundTrips(directory);
  const saved = JSON.parse(readFileSync(new URL('./full-roundtrip-2026-10-29/summary.json', import.meta.url), 'utf8'));
  assert.deepEqual(actual, saved);
  assert.equal(actual.cases['01'].status, 'no-drift-found');
  assert.equal(actual.cases['02'].status, 'hard-fail');
  assert.equal(actual.cases['02'].pairs['2-4'].status, 'incomplete');
  assert.equal(actual.cases['03'].status, 'drift');
  assert.equal(actual.cases['04'].status, 'no-drift-found');
  for (const c of Object.values(actual.cases)) {
    assert.equal(c.mode, 'full-chain');
    for (const n of [1, 3]) {
      assert.deepEqual(c.evidence[n].checks.staticErrors, []);
      assert.deepEqual(c.evidence[n].checks.renderErrors, []);
      assert.deepEqual(c.evidence[n].checks.nativeNoteFindings, []);
    }
  }
});
