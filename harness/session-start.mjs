import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Claude and Codex call this when a session starts. It stays silent on stdout because clients treat
// that stream as session context; a failure reaches the agent through the later gates.
const root = fileURLToPath(new URL('../', import.meta.url));
const installed = existsSync(new URL('../node_modules/.bin/biome', import.meta.url));
const [command, args] = installed
  ? [process.execPath, ['harness/prepare.mjs']]
  : ['npm', ['ci', '--no-audit', '--no-fund']];
// npm is a .cmd shim on Windows, which needs a shell. The command and arguments here are constant.
const result = spawnSync(command, args, {
  cwd: root,
  stdio: ['ignore', 'ignore', 'inherit'],
  shell: !installed && process.platform === 'win32',
});
if (result.error || result.status !== 0)
  console.error('Repository setup did not finish. Run npm ci from the repository root.');
