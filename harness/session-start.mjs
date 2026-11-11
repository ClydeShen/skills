import { spawnSync } from 'node:child_process';
import { appendFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { proxyEnvironmentLines } from './session-env.mjs';

// Claude and Codex call this when a session starts. It stays silent on stdout because clients treat
// that stream as session context; a failure reaches the agent through the later gates.
const root = fileURLToPath(new URL('../', import.meta.url));
// Claude Code reads this file to set the environment of the session's later commands.
const lines = proxyEnvironmentLines(process.env);
if (process.env.CLAUDE_ENV_FILE && lines.length) appendFileSync(process.env.CLAUDE_ENV_FILE, `${lines.join('\n')}\n`);
const installed = existsSync(path.join(root, 'node_modules', '@biomejs', 'biome', 'package.json'));
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
