import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { referenceCheck, referenceRevision } from './reference-validator.mjs';

test('reference check pins official source and never counts missing tools or failure as pass', (t) => {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'skill-reference-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const calls = [];
  const result = referenceCheck(directory, (command, args, options) => {
    calls.push({ command, args, options });
    return { status: 0, stdout: 'Skill is valid!\n' };
  });
  assert.equal(result.revision, referenceRevision);
  assert.ok(calls[0].args[1].includes(`@${referenceRevision}#subdirectory=skills-ref`));
  assert.deepEqual(calls[0].args.slice(2), ['skills-ref', 'validate', directory]);
  assert.equal(calls[0].options.shell, false);
  assert.throws(() => referenceCheck(directory, () => ({ status: 1, stdout: 'Invalid.' })), /did not pass/);
  assert.throws(() => referenceCheck(directory, () => ({ error: new Error('missing') })), /unavailable/);
});
