import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  chmodSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
import { parse as parseYaml } from 'yaml';
import { stripInternal } from './skill-quality.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const manifestName = '.publication.json';
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const git = (repository, args, encoding = 'utf8') =>
  execFileSync('git', args, { cwd: repository, encoding, maxBuffer: 32 * 1024 * 1024 });
const validName = (name) => typeof name === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name);

// macOS may expose the system temporary directory through /var or /tmp aliases.
// Canonicalize only that trusted base; user-created symlinks below it still fail.
function temporaryPath(directory) {
  const absolute = path.resolve(directory);
  const relative = path.relative(path.resolve(tmpdir()), absolute);
  if (relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative))
    return path.resolve(realpathSync(tmpdir()), relative);
  return absolute;
}

function assertNoSymlinks(directory) {
  let current = path.resolve(directory);
  while (true) {
    if (existsSync(current) && lstatSync(current).isSymbolicLink()) throw new Error('Symlinked paths are forbidden.');
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
}

function inventory(files) {
  return [...files]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([file, bytes]) => ({
      path: file,
      size: bytes.length,
      sha256: hash(bytes),
    }));
}

export function snapshotAtRef(repository, skill, ref) {
  if (!validName(skill) || typeof ref !== 'string' || !ref || ref.startsWith('-'))
    throw new Error('Provide a skill name and explicit source revision.');
  const commit = git(repository, ['rev-parse', '--verify', `${ref}^{commit}`]).trim();
  const entries = git(repository, ['ls-tree', '-rz', '--full-tree', commit, '--', 'incubator/'])
    .split('\0')
    .filter(Boolean)
    .map((entry) => {
      const match = entry.match(/^(\d+) (\w+) ([a-f0-9]+)\t(.+)$/);
      if (!match) throw new Error('Invalid Git tree entry.');
      return { mode: match[1], type: match[2], oid: match[3], file: match[4] };
    });
  const candidates = entries.filter(({ file }) =>
    new RegExp(`^incubator/[a-z0-9-]+/candidate/${skill}/SKILL\\.md$`).test(file),
  );
  if (candidates.length !== 1) throw new Error('Source revision must contain exactly one matching authoring package.');
  const directory = path.posix.dirname(candidates[0].file);
  const files = new Map();
  const modes = new Map();
  for (const entry of entries.filter(({ file }) => file.startsWith(`${directory}/`))) {
    const relative = entry.file.slice(directory.length + 1);
    if (!['100644', '100755'].includes(entry.mode) || entry.type !== 'blob')
      throw new Error('Source package must contain regular files only.');
    if (
      /[^\x20-\x7e]|\\|(?:^|\/)\.\.(?:\/|$)|(?:^|\/)(?:\.git|\.env(?:\.[^/]*)?|profile\.json)(?:\/|$)/.test(relative) ||
      relative === manifestName
    )
      throw new Error('Unsafe or reserved source package path.');
    files.set(relative, git(repository, ['cat-file', 'blob', entry.oid], 'buffer'));
    modes.set(relative, entry.mode);
  }
  for (const required of ['SKILL.md', 'README.md', 'LICENSE'])
    if (!files.get(required)?.toString('utf8').trim()) throw new Error(`Source package requires ${required}.`);
  const source = files.get('SKILL.md').toString('utf8');
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const metadata = frontmatter && parseYaml(frontmatter[1], { uniqueKeys: true });
  if (metadata?.name !== skill || metadata?.metadata?.internal !== true)
    throw new Error('Source must be the named candidate with metadata.internal: true.');
  files.set('SKILL.md', Buffer.from(stripInternal(source)));
  const outputFiles = inventory(files);
  const manifest = {
    schema_version: 1,
    skill,
    source: { commit, directory },
    transformations: ['remove-candidate-internal-marker-v1'],
    digest_method: 'sha256-json-file-inventory-v1',
    digest: hash(JSON.stringify(outputFiles)),
    files: outputFiles,
  };
  return { manifest, files, modes };
}

function readSnapshot(directory) {
  directory = temporaryPath(directory);
  assertNoSymlinks(directory);
  if (!lstatSync(directory).isDirectory()) throw new Error('Snapshot must be a directory.');
  const files = new Map();
  const walk = (relative) => {
    const current = path.join(directory, relative);
    for (const name of readdirSync(current)) {
      const local = relative ? `${relative}/${name}` : name;
      const absolute = path.join(directory, local);
      const stat = lstatSync(absolute);
      if (stat.isSymbolicLink()) throw new Error('Snapshot symlinks are forbidden.');
      if (stat.isDirectory()) walk(local);
      else if (stat.isFile()) files.set(local, readFileSync(absolute));
      else throw new Error('Snapshot must contain regular files only.');
    }
  };
  walk('');
  return files;
}

export function verifySnapshot(repository, directory, expectedSource) {
  const actual = readSnapshot(directory);
  const manifest = JSON.parse(actual.get(manifestName)?.toString('utf8') ?? 'null');
  if (!manifest || !validName(manifest.skill) || !/^[a-f0-9]{40}$/.test(manifest.source?.commit ?? ''))
    throw new Error('Snapshot requires an explicit immutable source manifest.');
  if (path.basename(path.resolve(directory)) !== manifest.skill)
    throw new Error('Snapshot directory name must match the skill.');
  const expected = snapshotAtRef(repository, manifest.skill, manifest.source.commit);
  if (
    !isDeepStrictEqual(manifest, expected.manifest) ||
    (expectedSource && expectedSource !== manifest.source.directory)
  )
    throw new Error('Manifest does not match the declared source and transformations.');
  actual.delete(manifestName);
  if (!isDeepStrictEqual(inventory(actual), manifest.files))
    throw new Error('Snapshot content differs from its source manifest.');
  if (process.platform !== 'win32')
    for (const [file, mode] of expected.modes)
      if (Boolean(lstatSync(path.join(directory, file)).mode & 0o111) !== (mode === '100755'))
        throw new Error('Snapshot executable permissions differ from the source.');
  return manifest;
}

export function stageSnapshot(repository, skill, ref, destination) {
  const target = temporaryPath(destination);
  const relative = path.relative(realpathSync(tmpdir()), target);
  const repositoryRelative = path.relative(temporaryPath(repository), target);
  const inRepository =
    !path.isAbsolute(repositoryRelative) &&
    repositoryRelative !== '..' &&
    !repositoryRelative.startsWith(`..${path.sep}`);
  if (
    !relative ||
    relative.split(path.sep).length < 2 ||
    relative === '..' ||
    relative.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relative) ||
    inRepository
  )
    throw new Error('Stage only in an isolated temporary directory outside the repository.');
  if (path.basename(target) !== skill) throw new Error('Stage directory name must match the skill.');
  assertNoSymlinks(target);
  if (existsSync(target)) throw new Error('Stage destination already exists; do not overwrite it.');
  const snapshot = snapshotAtRef(repository, skill, ref);
  mkdirSync(path.dirname(target), { recursive: true });
  mkdirSync(target);
  for (const [file, bytes] of snapshot.files) {
    const output = path.join(target, file);
    mkdirSync(path.dirname(output), { recursive: true });
    writeFileSync(output, bytes, { flag: 'wx' });
    chmodSync(output, snapshot.modes.get(file) === '100755' ? 0o755 : 0o644);
  }
  writeFileSync(path.join(target, manifestName), `${JSON.stringify(snapshot.manifest, null, 2)}\n`, { flag: 'wx' });
  return verifySnapshot(repository, target);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const [operation, ...args] = process.argv.slice(2);
    let manifest;
    let directory;
    if (operation === 'stage' && [2, 3].includes(args.length)) {
      directory = args[2]
        ? temporaryPath(args[2])
        : path.join(mkdtempSync(path.join(realpathSync(tmpdir()), 'skill-publication-')), args[0]);
      manifest = stageSnapshot(root, args[0], args[1], directory);
    } else if (operation === 'verify' && args.length === 1)
      manifest = verifySnapshot(root, path.resolve(root, args[0]));
    else
      throw new Error(
        'Usage: npm run skill:publication -- stage <skill> <source-ref> [external-temporary-directory] | verify <snapshot-directory>',
      );
    console.log(
      JSON.stringify(
        {
          skill: manifest.skill,
          directory: directory ?? path.resolve(args[0]),
          source: manifest.source,
          digest: manifest.digest,
          file_count: manifest.files.length,
          acceptance: 'Not evaluated: provenance verification is not release approval.',
        },
        null,
        2,
      ),
    );
  } catch (error) {
    console.error(`Publication: ${error.message}`);
    process.exitCode = 1;
  }
}
