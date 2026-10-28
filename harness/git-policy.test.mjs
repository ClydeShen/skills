import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, chmodSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { taskBranch, ciBranch, checkGit, checkPush, setupHooks } from './git-policy.mjs';

const source = fileURLToPath(new URL('../', import.meta.url));
const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
function fixture(t) {
  const cwd = mkdtempSync(path.join(os.tmpdir(), 'skills-git-policy-'));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  git(cwd, 'init', '-q', '-b', 'main');
  git(cwd, 'config', 'user.name', 'Policy test');
  git(cwd, 'config', 'user.email', 'policy@example.invalid');
  mkdirSync(path.join(cwd, '.githooks'));
  mkdirSync(path.join(cwd, 'harness'));
  for (const f of ['.githooks/pre-commit', 'harness/git-policy.mjs']) writeFileSync(path.join(cwd, f), readFileSync(path.join(source, f)));
  writeFileSync(path.join(cwd, '.githooks/pre-push'), '#!/bin/sh\nexit 0\n');
  for (const name of ['pre-commit', 'pre-push']) chmodSync(path.join(cwd, '.githooks', name), 0o755);
  git(cwd, 'add', '.');
  git(cwd, 'commit', '-qm', 'Initial fixture');
  return cwd;
}

test('Git names and detached CI events distinguish main, task PRs and release tags', () => {
  for (const name of ['work/meta-thinking-prompt', 'work/memory-knowledge', 'work/skill2']) assert.ok(taskBranch(name));
  for (const name of ['', 'work', 'codex/topic', 'develop', 'work/Bad', 'work/a/b', 'work/a--b', 'work/-a']) assert.ok(!taskBranch(name));
  assert.equal(ciBranch({ GITHUB_EVENT_NAME: 'pull_request', GITHUB_BASE_REF: 'main', GITHUB_HEAD_REF: 'work/topic' }), 'work/topic');
  assert.equal(ciBranch({ GITHUB_EVENT_NAME: 'push', GITHUB_REF: 'refs/heads/main' }), 'main');
  assert.equal(ciBranch({ GITHUB_EVENT_NAME: 'push', GITHUB_REF: 'refs/tags/v1' }), 'refs/tags/v1');
  for (const env of [
    { GITHUB_EVENT_NAME: 'pull_request', GITHUB_BASE_REF: 'develop', GITHUB_HEAD_REF: 'work/topic' },
    { GITHUB_EVENT_NAME: 'pull_request', GITHUB_BASE_REF: 'main', GITHUB_HEAD_REF: 'codex/topic' },
    { GITHUB_EVENT_NAME: 'push', GITHUB_REF: 'refs/heads/develop' },
    { GITHUB_EVENT_NAME: 'workflow_dispatch' },
  ]) assert.throws(() => ciBranch(env));
});

test('setup protects existing hooks; policy permits clean main but blocks main edits and commits', t => {
  const cwd = fixture(t);
  assert.throws(() => checkGit(cwd, { env: {} }), /hooks are inactive/);
  git(cwd, 'config', 'core.hooksPath', 'custom-hooks');
  assert.throws(() => setupHooks(cwd), /Existing core.hooksPath/);
  git(cwd, 'config', '--unset', 'core.hooksPath');
  writeFileSync(path.join(cwd, '.git/hooks/pre-commit'), '# existing hook\n');
  assert.throws(() => setupHooks(cwd), /Existing default Git hooks/);
  rmSync(path.join(cwd, '.git/hooks/pre-commit'));
  setupHooks(cwd);
  assert.equal(checkGit(cwd, { env: {} }), 'main');
  assert.throws(() => checkGit(cwd, { commit: true, env: {} }), /main is for integration/);
  writeFileSync(path.join(cwd, 'change.txt'), 'A change\n');
  assert.throws(() => checkGit(cwd, { env: {} }), /main is for integration/);
  git(cwd, 'add', 'change.txt');
  const blocked = spawnSync('git', ['commit', '-m', 'Blocked'], { cwd, encoding: 'utf8' });
  assert.notEqual(blocked.status, 0);
  assert.match(blocked.stderr, /main is for integration/);
  git(cwd, 'switch', '-qc', 'work/topic');
  git(cwd, 'commit', '-qm', 'Allowed');
  assert.equal(checkGit(cwd, { env: {} }), 'work/topic');
  git(cwd, 'checkout', '--detach', '-q');
  assert.throws(() => checkGit(cwd, { env: {} }), /detached/);
});

test('push policy checks actual destination, every ref, ancestry, deletions and immutable tags', t => {
  const cwd = fixture(t);
  const first = git(cwd, 'rev-parse', 'HEAD');
  git(cwd, 'switch', '-qc', 'work/topic');
  git(cwd, 'commit', '--allow-empty', '-qm', 'Second');
  const second = git(cwd, 'rev-parse', 'HEAD');
  const zero = '0'.repeat(40);
  const update = (local, oid, remote, old = zero) => `${local} ${oid} ${remote} ${old}\n`;
  const ref = 'refs/heads/work/topic';
  const valid = update(ref, second, ref, first);
  assert.doesNotThrow(() => checkPush('', cwd));
  assert.doesNotThrow(() => checkPush(valid, cwd));
  assert.doesNotThrow(() => checkPush(update('(delete)', zero, ref, first), cwd));
  assert.doesNotThrow(() => checkPush(update('refs/tags/v1', first, 'refs/tags/v1'), cwd));
  for (const input of ['bad input', update(ref, first, ref, second), update(ref, second, 'refs/heads/main'),
    update('(delete)', zero, 'refs/heads/main', first), update(ref, second, 'refs/heads/work/renamed'),
    valid + update(ref, second, 'refs/heads/main'), update('refs/tags/v1', second, 'refs/tags/v1', first),
    update('(delete)', zero, 'refs/tags/v1', first), update(ref, second, 'refs/notes/test')]) {
    assert.throws(() => checkPush(input, cwd));
  }
});

test('linked worktrees share hook setup while committing only their own task branch', t => {
  const cwd = fixture(t);
  setupHooks(cwd);
  const linked = path.join(cwd, 'linked task');
  git(cwd, 'worktree', 'add', '-qb', 'work/other-task', linked, 'main');
  assert.equal(checkGit(linked, { env: {} }), 'work/other-task');
  writeFileSync(path.join(linked, 'task.txt'), 'Independent task\n');
  git(linked, 'add', 'task.txt');
  git(linked, 'commit', '-qm', 'Task change');
  assert.equal(git(cwd, 'branch', '--show-current'), 'main');
  assert.equal(git(linked, 'branch', '--show-current'), 'work/other-task');
});
