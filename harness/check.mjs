import { checkRepository, repositoryRoot } from './repository.mjs';

try {
  const result = checkRepository(repositoryRoot);
  for (const warning of result.warnings) console.warn(`WARN ${warning}`);
  for (const error of result.errors) console.error(`FAIL ${error}`);
  console.log(`Repository: ${result.files} files; ${result.packages.length} authored package(s); ${result.errors.length} error(s).`);
  process.exitCode = result.errors.length ? 1 : 0;
} catch (error) {
  console.error(`Repository check unavailable: ${error.message}. Run npm ci with Node.js 24 and Git installed.`);
  process.exitCode = 1;
}
