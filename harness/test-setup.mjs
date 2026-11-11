// Preloaded by `npm test` (node --import). Git sets GIT_DIR, GIT_INDEX_FILE and similar variables when it
// runs a hook. A test that builds a temporary repository would otherwise inherit them and write its commits,
// index and configuration into the real repository that is being pushed.
import { execFileSync } from 'node:child_process';

const names = execFileSync('git', ['rev-parse', '--local-env-vars'], { encoding: 'utf8' }).split('\n').filter(Boolean);
for (const name of names) delete process.env[name];
