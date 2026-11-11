import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import test from 'node:test';

test('the test setup removes the variables that Git exports to a hook', () => {
  const setup = new URL('./test-setup.mjs', import.meta.url).href;
  const out = execFileSync(
    process.execPath,
    [
      '--import',
      setup,
      '-e',
      'process.stdout.write(String(process.env.GIT_DIR) + "|" + String(process.env.GIT_INDEX_FILE))',
    ],
    {
      encoding: 'utf8',
      env: { ...process.env, GIT_DIR: '/nonexistent/git-dir', GIT_INDEX_FILE: '/nonexistent/index' },
    },
  );
  assert.equal(out, 'undefined|undefined');
});
