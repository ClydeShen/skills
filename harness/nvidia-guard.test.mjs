import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { directNvidiaCommand, nvidiaAccessError, reason, toolDecision } from './nvidia-guard.mjs';
import { checkRepository } from './repository.mjs';

const bash = (command) => ({ hook_event_name: 'PreToolUse', tool_name: 'Bash', tool_input: { command } });
const write = (file_path, content) => ({
  hook_event_name: 'PreToolUse',
  tool_name: 'Write',
  tool_input: { file_path, content },
});

test('a shell command that connects to the NVIDIA inference host is denied; reading about it is not', () => {
  for (const command of [
    'curl -s https://integrate.api.nvidia.com/v1/chat/completions -H "Authorization: Bearer $NVIDIA_API_KEY"',
    'node -e "fetch(\'https://integrate.api.nvidia.com/v1/models\')"',
    'python3 -c "import requests; requests.get(\'https://ai.api.nvidia.com/v1/x\')"',
    'wget https://api.nvcf.nvidia.com/v2/nvcf/pexec/status',
    'npm run eval:nvidia && curl https://integrate.api.nvidia.com/v1/models',
  ])
    assert.equal(toolDecision(bash(command)), reason, command);
  for (const command of [
    'npm run eval:nvidia -- --case C6',
    'npm run eval:scenario -- --skill architecture-diagram',
    'grep -rn integrate.api.nvidia.com evals docs',
    'grep -rn "api.nvidia.com" --include=*.mjs . | grep -v node_modules',
    'curl -sS https://build.nvidia.com/faq',
    'curl -sS https://example.com/',
  ])
    assert.equal(toolDecision(bash(command)), null, command);
  assert.equal(directNvidiaCommand(undefined), false);
});

test('writing a script that names the host or key is denied outside the shared modules', () => {
  const script = "const r = await fetch('https://integrate.api.nvidia.com/v1/chat/completions');";
  assert.equal(toolDecision(write('/home/user/skills/probe.mjs', script)), reason);
  assert.equal(toolDecision(write('/tmp/scratch/probe.mjs', 'const k = process.env.NVIDIA_API_KEY;')), reason);
  const edit = {
    hook_event_name: 'PreToolUse',
    tool_name: 'Edit',
    tool_input: { file_path: '/x/a.mjs', new_string: script },
  };
  assert.equal(toolDecision(edit), reason);
  assert.equal(toolDecision(write('/home/user/skills/evals/lib.mjs', script)), null);
  assert.equal(toolDecision(write('/home/user/skills/docs/notes.md', script)), null);
  assert.equal(toolDecision(write('/home/user/skills/evals/rate-limit.test.mjs', script)), null);
  assert.equal(toolDecision(write('/home/user/skills/probe.mjs', 'console.log(1)')), null);
});

test('other events and tools are not judged', () => {
  assert.equal(toolDecision({ hook_event_name: 'Stop' }), null);
  assert.equal(
    toolDecision({ hook_event_name: 'PreToolUse', tool_name: 'Read', tool_input: { file_path: 'x' } }),
    null,
  );
  assert.equal(toolDecision(undefined), null);
});

test('the hook blocks with exit code 2 and the reason, and fails visibly on malformed input', () => {
  const run = (input) =>
    spawnSync(process.execPath, [fileURLToPath(new URL('./nvidia-guard.mjs', import.meta.url))], {
      input,
      encoding: 'utf8',
    });
  const denied = run(JSON.stringify(bash('curl https://integrate.api.nvidia.com/v1/models')));
  assert.equal(denied.status, 2);
  assert.match(denied.stderr, /npm run eval:/);
  assert.equal(run(JSON.stringify(bash('npm run eval:nvidia'))).status, 0);
  const broken = run('not json');
  assert.equal(broken.status, 1);
  assert.match(broken.stderr, /was not checked/);
});

test('code outside the shared modules may not name the inference host or read the key', () => {
  assert.match(
    nvidiaAccessError('scripts/probe.mjs', "fetch('https://integrate.api.nvidia.com/v1')"),
    /shared evaluation runner/,
  );
  assert.match(
    nvidiaAccessError('tools/x.sh', 'curl -H "Authorization: Bearer $NVIDIA_API_KEY"'),
    /shared evaluation runner/,
  );
  for (const file of [
    'evals/lib.mjs',
    'evals/rate-limit.mjs',
    'harness/nvidia-guard.mjs',
    'evals/x.test.mjs',
    'docs/a.md',
  ])
    assert.equal(nvidiaAccessError(file, 'integrate.api.nvidia.com NVIDIA_API_KEY'), null, file);
  assert.equal(nvidiaAccessError('scripts/ok.mjs', 'console.log(1)'), null);
  assert.equal(nvidiaAccessError('image.png', 'integrate.api.nvidia.com'), null);
});

test('the repository itself passes the check', () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  assert.deepEqual(
    checkRepository(root).errors.filter((e) => e.includes('NVIDIA')),
    [],
  );
});
