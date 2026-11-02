import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, realpathSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkSkills, packages } from './skill-quality.mjs';
import { requireTool } from './tools.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const biome = path.join(root, 'node_modules/@biomejs/biome/bin/biome');
const prettier = path.join(root, 'node_modules/prettier/bin/prettier.cjs');
const lines = (args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean);

// A file with both staged and unstaged changes cannot be rewritten safely: re-adding it would stage the unstaged part.
export function formatPlan(staged, unstaged) {
  const dirty = new Set(unstaged);
  const partial = staged.filter((file) => dirty.has(file));
  return { write: partial.length === 0, partial };
}

export function affectedSkills(staged, all) {
  return all.filter(({ directory }) => staged.some((file) => file.startsWith(`${directory}/`))).map(({ name }) => name);
}

function run(file, args, label) {
  const [command, list] =
    file.endsWith('gitleaks') || file.endsWith('.exe') ? [file, args] : [process.execPath, [file, ...args]];
  const result = spawnSync(command, list, { cwd: root, stdio: 'inherit' });
  if (result.error || result.status !== 0) throw new Error(`${label} did not pass.`);
}

function main() {
  const staged = lines(['diff', '--cached', '--name-only', '--diff-filter=ACMR']);
  if (staged.length) {
    if (!existsSync(biome) || !existsSync(prettier)) throw new Error('Format tools are unavailable. Run npm ci.');
    const plan = formatPlan(staged, lines(['diff', '--name-only']));
    const biomeArgs = ['--no-errors-on-unmatched', '--files-ignore-unknown=true', ...staged];
    const prettierArgs = ['--ignore-unknown', '--no-error-on-unmatched-pattern', ...staged];
    if (plan.write) {
      run(biome, ['check', '--write', ...biomeArgs], 'Biome');
      run(prettier, ['--write', '--log-level=warn', ...prettierArgs], 'Prettier');
      execFileSync('git', ['add', '--', ...staged], { cwd: root });
    } else {
      console.error(`Checking without rewriting; these files also have unstaged changes: ${plan.partial.join(', ')}`);
      run(biome, ['check', ...biomeArgs], 'Biome');
      run(prettier, ['--check', '--log-level=warn', ...prettierArgs], 'Prettier');
    }
    const names = affectedSkills(staged, packages());
    if (names.length && !checkSkills(names)) throw new Error('Skill validation did not pass.');
  }
  run(
    requireTool('gitleaks'),
    ['git', '--staged', '--pre-commit', '--redact', '--no-banner', '--log-level=warn', '.'],
    'Gitleaks',
  );
}

if (
  process.argv[1] &&
  existsSync(process.argv[1]) &&
  realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))
) {
  try {
    main();
  } catch (error) {
    console.error(
      `Pre-commit: ${error.message} Fix the cause, or record the reason for an exception before using --no-verify.`,
    );
    process.exitCode = 1;
  }
}
