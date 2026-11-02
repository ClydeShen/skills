import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { checkGit } from './git-policy.mjs';
import { checkRepository, repositoryRoot } from './repository.mjs';

try {
  console.log(`Git policy: ${checkGit(repositoryRoot)}`);
  const result = checkRepository(repositoryRoot);
  for (const warning of result.warnings) console.warn(`WARN ${warning}`);
  for (const error of result.errors) console.error(`FAIL ${error}`);
  console.log(
    `Repository: ${result.files} files; ${result.packages.length} authored package(s); ${result.errors.length} error(s).`,
  );
  const local = (file) => path.join(repositoryRoot, 'node_modules', file);
  const format = [
    ['@biomejs/biome/bin/biome', 'ci', '.'],
    ['prettier/bin/prettier.cjs', '--check', '--log-level=warn', '.'],
  ].map(([bin, ...args]) =>
    spawnSync(process.execPath, [local(bin), ...args], { cwd: repositoryRoot, stdio: 'inherit' }),
  );
  const formatted = format.every((run) => !run.error && run.status === 0);
  if (!formatted) console.error('FAIL format or lint. Run npm run fix; report what it cannot fix.');
  process.exitCode = result.errors.length || !formatted ? 1 : 0;
} catch (error) {
  console.error(`Repository check unavailable: ${error.message}. Run npm ci with Node.js 24 and Git installed.`);
  process.exitCode = 1;
}
