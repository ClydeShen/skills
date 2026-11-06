import { spawnSync } from 'node:child_process';
import { lstatSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const referenceRevision = '83021e2be457a9b6679148719c1f6074f0ad975e';

export function referenceCheck(directory, run = spawnSync) {
  const target = path.resolve(directory);
  if (!lstatSync(target).isDirectory() || lstatSync(target).isSymbolicLink())
    throw new Error('Reference validation requires a regular package directory.');
  const result = run(
    'uvx',
    [
      '--from',
      `git+https://github.com/agentskills/agentskills.git@${referenceRevision}#subdirectory=skills-ref`,
      'skills-ref',
      'validate',
      target,
    ],
    { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024, shell: false },
  );
  if (result.error) throw new Error('skills-ref is unavailable; install uv with network access. This is not a pass.');
  if (result.status !== 0) throw new Error(`skills-ref did not pass: ${result.stdout || result.stderr || 'no report'}`);
  return { revision: referenceRevision, output: result.stdout.trim() };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length !== 3)
      throw new Error('Usage: npm run skill:reference -- <publication-snapshot-directory>');
    console.log(JSON.stringify(referenceCheck(process.argv[2]), null, 2));
  } catch (error) {
    console.error(`Reference validation: ${error.message}`);
    process.exitCode = 1;
  }
}
