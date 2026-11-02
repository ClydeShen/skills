import { execFileSync, spawnSync } from 'node:child_process';
import {
  appendFileSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { requireTool } from './tools.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const git = (args, options = {}) =>
  execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...options });
const list = (text) => text.split('\n').filter(Boolean);
const packagePattern = /^((?:incubator\/[^/]+\/candidate|skills)\/([^/]+))\/SKILL\.md$/;

export function packages() {
  return list(git(['ls-files', '--cached', '--others', '--exclude-standard', '--', '*SKILL.md']))
    .map((file) => file.match(packagePattern))
    .filter(Boolean)
    .map(([, directory, name]) => ({ directory, name }));
}

// The skills CLI needs boolean metadata.internal to hide a candidate, while the Agent Skills format requires
// string metadata values. harness/repository.mjs validates the marker; validators see the package without it.
export function stripInternal(text) {
  return text
    .replace(/^(---\r?\n[\s\S]*?)\r?\n[ \t]+internal:[ \t]*true[ \t]*(?=\r?\n)/, '$1')
    .replace(/^(---\r?\n[\s\S]*?)\r?\nmetadata:[ \t]*(?=\r?\n(?:---|\S))/, '$1');
}

function writeStripped(directory) {
  const file = path.join(directory, 'SKILL.md');
  writeFileSync(file, stripInternal(readFileSync(file, 'utf8')));
}

export function exportWorkingPackage({ directory, name }, destination) {
  const target = path.join(destination, name);
  for (const file of list(git(['ls-files', '--cached', '--others', '--exclude-standard', '--', directory]))) {
    if (!existsSync(path.join(root, file))) continue;
    const output = path.join(target, path.relative(directory, file));
    mkdirSync(path.dirname(output), { recursive: true });
    copyFileSync(path.join(root, file), output);
  }
  return target;
}

export function exportPackageAtRef({ directory, name }, ref, destination) {
  const files = list(git(['ls-tree', '-r', '--name-only', ref, '--', directory]));
  if (!files.length) return null;
  const target = path.join(destination, name);
  for (const file of files) {
    const output = path.join(target, path.relative(directory, file));
    mkdirSync(path.dirname(output), { recursive: true });
    writeFileSync(output, git(['show', `${ref}:${file}`], { encoding: 'buffer' }));
  }
  return target;
}

function validate(directory) {
  const result = spawnSync(
    requireTool('skill-validator'),
    ['check', '--allow-dirs=agents', '--skip', 'links', '-o', 'json', directory],
    {
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
    },
  );
  if (result.error) throw result.error;
  let report;
  try {
    report = JSON.parse(result.stdout);
  } catch {
    throw new Error(`skill-validator returned no report: ${result.stderr.slice(-500)}`);
  }
  // Exit 1 means errors and 2 means warnings only; warnings do not block.
  return { status: result.status, report };
}

function runAgnix(directory) {
  const bin = path.join(root, 'node_modules/agnix/index.js');
  if (!existsSync(bin)) return { unavailable: true };
  const result = spawnSync(process.execPath, [bin, directory], { cwd: root, encoding: 'utf8' });
  if (result.error || result.stdout.includes('binary not found')) return { unavailable: true };
  return { status: result.status, output: result.stdout };
}

function tokens(report) {
  const counts = report.token_counts ?? { files: [], total: 0 };
  return { body: counts.files.find((file) => file.file === 'SKILL.md body')?.tokens ?? 0, total: counts.total ?? 0 };
}

function selectPackages(names) {
  const all = packages();
  const selected = names.length ? all.filter(({ name }) => names.includes(name)) : all;
  const unknown = names.filter((name) => !all.some((item) => item.name === name));
  if (unknown.length) throw new Error(`Unknown skill: ${unknown.join(', ')}.`);
  return selected;
}

export function checkSkills(names = []) {
  const temp = mkdtempSync(path.join(os.tmpdir(), 'skill-quality-'));
  let passed = true;
  try {
    for (const item of selectPackages(names)) {
      const directory = exportWorkingPackage(item, temp);
      writeStripped(directory);
      const { status, report } = validate(directory);
      for (const entry of report.results ?? []) {
        if (entry.level === 'error' || entry.level === 'warning')
          console.error(`${item.name}: ${entry.level}: ${entry.message}`);
      }
      if (status === 1) passed = false;
      const agnix = runAgnix(directory);
      if (agnix.unavailable) console.error(`${item.name}: agnix unavailable; that check did not run.`);
      else if (agnix.status !== 0) {
        console.error(agnix.output.replaceAll(temp, ''));
        passed = false;
      }
      const size = tokens(report);
      console.log(
        `Skill ${item.name}: ${status === 1 ? 'failed' : 'ok'}; SKILL.md ${size.body} tokens, ${size.total} with references.`,
      );
    }
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
  return passed;
}

function baseRef() {
  const target = process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : 'origin/main';
  return git(['merge-base', 'HEAD', target]).trim();
}

export function sizeRow(name, current, base) {
  const delta = (now, old) => (old === undefined ? 'new' : `${now - old >= 0 ? '+' : ''}${now - old}`);
  return `| ${name} | ${current.body} | ${delta(current.body, base?.body)} | ${current.total} | ${delta(current.total, base?.total)} |`;
}

// Efficiency evidence for a reviewer. It never decides a merge: a score used as a gate rewards adding rules.
function reportSizes(names) {
  const temp = mkdtempSync(path.join(os.tmpdir(), 'skill-size-'));
  try {
    const ref = baseRef();
    const rows = selectPackages(names).map((item) => {
      const directory = exportWorkingPackage(item, path.join(temp, 'current'));
      writeStripped(directory);
      const old = exportPackageAtRef(item, ref, path.join(temp, 'base'));
      if (old) writeStripped(old);
      return sizeRow(item.name, tokens(validate(directory).report), old ? tokens(validate(old).report) : undefined);
    });
    const table = [
      '## Skill size',
      '',
      `Compared with \`${ref.slice(0, 7)}\`. Explain any growth in the pull request.`,
      '',
      '| Skill | SKILL.md tokens | Change | With references | Change |',
      '| --- | ---: | ---: | ---: | ---: |',
      ...rows,
      '',
    ].join('\n');
    console.log(table);
    if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, table);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
}

if (
  process.argv[1] &&
  existsSync(process.argv[1]) &&
  realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))
) {
  try {
    const args = process.argv.slice(2);
    const names = args.filter((arg) => arg !== '--report');
    if (args.includes('--report')) reportSizes(names);
    else process.exitCode = checkSkills(names) ? 0 : 1;
  } catch (error) {
    console.error(`Skill quality: ${error.message}`);
    process.exitCode = 1;
  }
}
