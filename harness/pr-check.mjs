import { spawnSync } from 'node:child_process';
import { existsSync, realpathSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const sections = ['Summary', 'Evidence', 'Merge Danger'];

export function missingSections(body = '') {
  return sections.filter((section) => !new RegExp(`^##\\s+${section}\\s*$`, 'm').test(body));
}

if (
  process.argv[1] &&
  existsSync(process.argv[1]) &&
  realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))
) {
  // Titles arrive through the environment, so CI never interpolates user text into a shell command.
  const { PR_TITLE: title = '', PR_BODY: body = '' } = process.env;
  const lint = spawnSync(process.execPath, [path.join(root, 'node_modules/@commitlint/cli/cli.js')], {
    cwd: root,
    input: title,
    stdio: ['pipe', 'inherit', 'inherit'],
  });
  if (lint.error || lint.status !== 0) {
    console.error('The pull request title becomes the squash commit on main. Use a Conventional Commits title.');
    process.exitCode = 1;
  }
  const missing = missingSections(body);
  if (missing.length) {
    console.error(`Pull request description is missing: ${missing.join(', ')}. See .github/pull_request_template.md.`);
    process.exitCode = 1;
  }
}
