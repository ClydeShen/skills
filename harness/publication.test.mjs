import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  chmodSync,
  cpSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { snapshotAtRef, stageSnapshot, verifySnapshot } from './publication.mjs';
import { checkRepository, repositoryFiles } from './repository.mjs';

const source = 'incubator/example/candidate/example';
const skill = '---\nname: example\ndescription: A concrete task.\nmetadata:\n  internal: true\n---\n\n# Example\n';
const git = (root, ...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();

function fixture(t, extras = {}) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'skill-publication-'));
  const staging = mkdtempSync(path.join(os.tmpdir(), 'skill-stage-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  t.after(() => rmSync(staging, { recursive: true, force: true }));
  for (const [file, content] of Object.entries({
    '.gitignore': 'evals/.local/\n',
    [`${source}/SKILL.md`]: skill,
    [`${source}/README.md`]: '# Example\n\nTry the concrete task.\n',
    [`${source}/LICENSE`]: 'Fixture license, not a grant for real artifacts.\n',
    [`${source}/references/context.md`]: '# Context\n',
    ...extras,
  })) {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    writeFileSync(path.join(root, file), content);
  }
  git(root, 'init', '--quiet');
  git(root, 'add', '.');
  git(
    root,
    '-c',
    'user.name=Fixture',
    '-c',
    'user.email=fixture@example.invalid',
    '-c',
    'core.hooksPath=/dev/null',
    'commit',
    '--quiet',
    '-m',
    'fixture',
  );
  const commit = git(root, 'rev-parse', 'HEAD');
  return { root, commit, stage: (name) => path.join(staging, name, 'example') };
}

test('publication is reproducible from committed source and never exports working edits', (t) => {
  const f = fixture(t);
  writeFileSync(path.join(f.root, source, 'references/context.md'), '# Unfinished change\n');
  const first = stageSnapshot(f.root, 'example', f.commit, f.stage('one'));
  const second = stageSnapshot(f.root, 'example', f.commit, f.stage('two'));
  assert.deepEqual(first, second);
  assert.equal(readFileSync(path.join(f.stage('one'), 'references/context.md'), 'utf8'), '# Context\n');
  assert.equal(
    readFileSync(path.join(f.stage('one'), 'SKILL.md'), 'utf8'),
    skill.replace('metadata:\n  internal: true\n', ''),
  );
  assert.equal(first.source.commit, f.commit);
  assert.deepEqual(first.transformations, ['remove-candidate-internal-marker-v1']);
  assert.equal(verifySnapshot(f.root, f.stage('one'), source).digest, first.digest);
});

test('publication verification detects changed, extra, missing and forged content', (t) => {
  const mutations = [
    (directory) => writeFileSync(path.join(directory, 'README.md'), '# Changed\n'),
    (directory) => writeFileSync(path.join(directory, 'extra.txt'), 'unexpected\n'),
    (directory) => rmSync(path.join(directory, 'LICENSE')),
    (directory) => {
      const file = path.join(directory, '.publication.json');
      const manifest = JSON.parse(readFileSync(file, 'utf8'));
      manifest.digest = '0'.repeat(64);
      writeFileSync(file, JSON.stringify(manifest));
    },
    (directory) => {
      const file = path.join(directory, '.publication.json');
      const manifest = JSON.parse(readFileSync(file, 'utf8'));
      manifest.source.directory = 'incubator/other/candidate/example';
      writeFileSync(file, JSON.stringify(manifest));
    },
  ];
  const f = fixture(t);
  for (const [index, mutate] of mutations.entries()) {
    const destination = f.stage(`mutation-${index}`);
    stageSnapshot(f.root, 'example', f.commit, destination);
    mutate(destination);
    assert.throws(() => verifySnapshot(f.root, destination));
  }
});

test('staging refuses stable paths, overwrites, ambiguous names and missing first-use files', (t) => {
  const f = fixture(t);
  assert.throws(() => stageSnapshot(f.root, 'example', f.commit, path.join(f.root, 'skills/example')), /Stage only/);
  assert.throws(
    () => stageSnapshot(f.root, 'example', f.commit, path.join(path.dirname(f.stage('one')), 'wrong-name')),
    /directory name/,
  );
  assert.throws(
    () => stageSnapshot(f.root, 'example', f.commit, path.join(f.root, 'evals/.local/publication/example')),
    /outside the repository/,
  );
  stageSnapshot(f.root, 'example', f.commit, f.stage('one'));
  assert.throws(() => stageSnapshot(f.root, 'example', f.commit, f.stage('one')), /already exists/);
  assert.throws(() => snapshotAtRef(f.root, '../example', f.commit), /skill name/);
  assert.throws(() => snapshotAtRef(f.root, 'example', '--help'), /revision/);
  const duplicate = fixture(t, { 'incubator/another/candidate/example/SKILL.md': skill });
  assert.throws(() => snapshotAtRef(duplicate.root, 'example', duplicate.commit), /exactly one/);
  const missing = fixture(t, { [`${source}/README.md`]: '' });
  assert.throws(() => snapshotAtRef(missing.root, 'example', missing.commit), /README/);
});

test('pair verification accepts an unchanged snapshot when authoring later advances', (t) => {
  const f = fixture(t);
  stageSnapshot(f.root, 'example', f.commit, f.stage('one'));
  const released = path.join(f.root, 'skills/example');
  cpSync(f.stage('one'), released, { recursive: true });
  writeFileSync(path.join(f.root, source, 'references/context.md'), '# Next revision\n');
  assert.equal(verifySnapshot(f.root, released, source).source.commit, f.commit);
  assert.throws(() => verifySnapshot(f.root, released, 'incubator/wrong/candidate/example'), /source/);
});

test('publication rejects source symlinks and source files that look like private data', (t) => {
  const privateFile = fixture(t, { [`${source}/profile.json`]: '{}\n' });
  assert.throws(() => snapshotAtRef(privateFile.root, 'example', privateFile.commit), /Unsafe/);
  if (process.platform === 'win32') return;
  const f = fixture(t);
  symlinkSync('README.md', path.join(f.root, source, 'linked.md'));
  git(f.root, 'add', '.');
  git(
    f.root,
    '-c',
    'user.name=Fixture',
    '-c',
    'user.email=fixture@example.invalid',
    '-c',
    'core.hooksPath=/dev/null',
    'commit',
    '--quiet',
    '-m',
    'link',
  );
  assert.throws(() => snapshotAtRef(f.root, 'example', 'HEAD'), /regular files/);
});

test('duplicate-name allowance requires the exact verified publication pair', (t) => {
  const f = fixture(t);
  stageSnapshot(f.root, 'example', f.commit, f.stage('one'));
  const released = path.join(f.root, 'skills/example');
  cpSync(f.stage('one'), released, { recursive: true });
  const pairErrors = () =>
    checkRepository(f.root, repositoryFiles(f.root)).errors.filter((error) => /duplicate authored name/.test(error));
  assert.deepEqual(pairErrors(), []);
  writeFileSync(path.join(released, 'README.md'), '# Independently edited\n');
  assert.ok(pairErrors().some((error) => error.includes('unverified publication pair')));
});

test('stage preserves executable source files and verifies permissions where supported', (t) => {
  if (process.platform === 'win32') return;
  const f = fixture(t, { [`${source}/scripts/helper.sh`]: '#!/bin/sh\nexit 0\n' });
  chmodSync(path.join(f.root, source, 'scripts/helper.sh'), 0o755);
  git(f.root, 'add', '.');
  git(
    f.root,
    '-c',
    'user.name=Fixture',
    '-c',
    'user.email=fixture@example.invalid',
    '-c',
    'core.hooksPath=/dev/null',
    'commit',
    '--quiet',
    '-m',
    'executable',
  );
  stageSnapshot(f.root, 'example', 'HEAD', f.stage('one'));
  const script = path.join(f.stage('one'), 'scripts/helper.sh');
  assert.ok(lstatSync(script).mode & 0o111);
  chmodSync(script, 0o644);
  assert.throws(() => verifySnapshot(f.root, f.stage('one')), /permissions/);
});
