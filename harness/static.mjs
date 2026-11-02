import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkSkills } from './skill-quality.mjs';
import { requireTool } from './tools.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const local = (file) => path.join(root, 'node_modules', file);

try {
  const steps = [
    ['Knip', process.execPath, [local('knip/bin/knip.js'), '--no-progress']],
    [
      'dependency-cruiser',
      process.execPath,
      [
        local('dependency-cruiser/bin/dependency-cruiser.mjs'),
        'harness',
        'evals',
        'incubator',
        'skills',
        '--output-type',
        'err',
      ],
    ],
    ['Gitleaks', requireTool('gitleaks'), ['git', '--redact', '--no-banner', '--log-level=warn', '.']],
  ];
  for (const [label, command, args] of steps) {
    const result = spawnSync(command, args, { cwd: root, stdio: 'inherit' });
    if (result.error || result.status !== 0) throw new Error(`${label} did not pass.`);
  }
  if (!checkSkills()) throw new Error('Skill validation did not pass.');
} catch (error) {
  console.error(`Static checks: ${error.message}`);
  process.exitCode = 1;
}
