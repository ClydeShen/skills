import { spawnSync } from 'node:child_process';
import { repositoryRoot } from './repository.mjs';

// Use the npm executable JS entry point rather than a platform-specific .cmd shim.
const npm = process.env.npm_execpath;
if (!npm) throw new Error('Use npm run check so npm_execpath is available.');
for (const script of ['check:repo', 'test', 'eval']) {
  const result = spawnSync(process.execPath, [npm, 'run', script], {
    cwd: repositoryRoot, stdio: 'inherit', timeout: 120_000,
  });
  if (result.error || result.status !== 0) {
    console.error(`Gate ${script} did not pass${result.error ? `: ${result.error.message}` : ''}.`);
    process.exit(result.status || 1);
  }
}
