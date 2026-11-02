import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { missingSections } from './pr-check.mjs';
import { repositoryRoot } from './repository.mjs';
import { packages, sizeRow, stripInternal } from './skill-quality.mjs';
import { affectedSkills, formatPlan } from './staged.mjs';
import { verifyDigest } from './tools.mjs';

const commitlint = path.join(repositoryRoot, 'node_modules/@commitlint/cli/cli.js');
const lint = (input) => spawnSync(process.execPath, [commitlint], { cwd: repositoryRoot, input, encoding: 'utf8' });

test('commit policy rejects the messages that reached main and accepts long bodies and trailers', () => {
  for (const bad of ['Improve architecture diagram semantics (#20)', 'update stuff', 'feat:missing space']) {
    assert.notEqual(lint(bad).status, 0, bad);
  }
  const body = `feat: add a check\n\n${'A long prose line. '.repeat(20)}\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`;
  for (const good of ['fix: resolve a hook path', 'docs(harness): describe the gate (#3)', body]) {
    assert.equal(lint(good).status, 0, good);
  }
});

test('pull request descriptions need every template section', () => {
  assert.deepEqual(missingSections('## Summary\n\nx\n\n## Evidence\n\ny\n\n## Merge Danger\n\nz\n'), []);
  assert.deepEqual(missingSections('## Summary\n'), ['Evidence', 'Merge Danger']);
  assert.deepEqual(missingSections('### Summary mention\nEvidence'), ['Summary', 'Evidence', 'Merge Danger']);
  assert.deepEqual(missingSections(undefined), ['Summary', 'Evidence', 'Merge Danger']);
});

test('validators receive a package without the candidate marker, and nothing else changes', () => {
  const body = '\n# Title\n\nmetadata:\n  internal: true\n';
  assert.equal(stripInternal(`---\nname: a\nmetadata:\n  internal: true\n---\n${body}`), `---\nname: a\n---\n${body}`);
  const mixed = '---\nname: a\nmetadata:\n  internal: true\n  owner: b\n---\n';
  assert.equal(stripInternal(mixed), '---\nname: a\nmetadata:\n  owner: b\n---\n');
  const other = '---\nname: a\nmetadata:\n  internal: false\n---\n';
  assert.equal(stripInternal(other), other);
  assert.equal(
    stripInternal('---\r\nname: a\r\nmetadata:\r\n  internal: true\r\n---\r\n'),
    '---\r\nname: a\r\n---\r\n',
  );
});

test('a file with unstaged changes is never rewritten by the pre-commit step', () => {
  assert.deepEqual(formatPlan(['a.md', 'b.mjs'], ['c.md']), { write: true, partial: [] });
  assert.deepEqual(formatPlan(['a.md', 'b.mjs'], ['b.mjs']), { write: false, partial: ['b.mjs'] });
});

test('pre-commit validates only the skills that a commit touches', () => {
  const all = [
    { directory: 'incubator/a/candidate/a', name: 'a' },
    { directory: 'skills/b', name: 'b' },
  ];
  assert.deepEqual(affectedSkills(['incubator/a/candidate/a/SKILL.md', 'docs/x.md'], all), ['a']);
  assert.deepEqual(affectedSkills(['incubator/a/evals/cases.json', 'skills/bb/SKILL.md'], all), []);
});

test('the package inventory finds authored skills and excludes imported tools', () => {
  const found = packages().map(({ name }) => name);
  assert.ok(found.includes('meta-thinking'));
  assert.ok(!found.includes('domain-modeling'));
});

test('skill size is reported as a change against the base', () => {
  assert.equal(sizeRow('a', { body: 12, total: 30 }, { body: 10, total: 40 }), '| a | 12 | +2 | 30 | -10 |');
  assert.equal(sizeRow('a', { body: 12, total: 30 }), '| a | 12 | new | 30 | new |');
});

test('a downloaded tool with a wrong checksum is rejected', () => {
  const bytes = Buffer.from('tool');
  assert.throws(() => verifyDigest(bytes, '0'.repeat(64)), /Checksum mismatch/);
  verifyDigest(bytes, createHash('sha256').update(bytes).digest('hex'));
});

test('the real commit-msg hook rejects a bad message from a file', (t) => {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'commit-msg-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const file = path.join(directory, 'COMMIT_EDITMSG');
  const run = (text) => {
    writeFileSync(file, text);
    return spawnSync('sh', [path.join(repositoryRoot, '.githooks/commit-msg'), file], {
      cwd: repositoryRoot,
      encoding: 'utf8',
    });
  };
  assert.notEqual(run('Improve things\n').status, 0);
  assert.equal(run('docs: improve things\n').status, 0);
});
