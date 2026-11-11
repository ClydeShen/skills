import { existsSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Every request to NVIDIA's hosted inference endpoints goes through the shared evaluation runner, which spaces
// requests below the endpoint's rate limit for the whole machine. A direct call, from a shell command or from a
// script, would spend the same rate limit without that schedule. Like the other hooks, this guards against
// accidents and unaware sessions; it is feedback, not a security boundary.

// Inference hosts only. Documentation and catalog pages on build.nvidia.com and docs.nvidia.com are not limited.
export const nvidiaHost = /(?:integrate|ai)\.api\.nvidia\.com|api\.nvcf\.nvidia\.com/i;

// A command only reads about the host unless something in it can open a connection.
const connects =
  /\b(?:curl|wget|nc|ncat|socat|node|deno|bun|python3?|ruby|perl|php|openssl|invoke-webrequest|invoke-restmethod|iwr|irm)\b|\bfetch\(/i;

// The only code that may name the host or read the key: the shared runner's own modules and their tests.
const allowedFiles = new Set(['evals/lib.mjs', 'evals/rate-limit.mjs', 'harness/nvidia-guard.mjs']);
const allowed = (file) => allowedFiles.has(file) || /\.test\.mjs$/.test(file) || /\.md$/.test(file);

export const reason =
  'Direct calls to the NVIDIA API are not allowed. Use `npm run eval:nvidia`, `npm run eval:model` or another `npm run eval:*` command, which space requests below the endpoint rate limit shared by the whole machine. See docs/prompt-evaluation.md.';

export function directNvidiaCommand(command) {
  return typeof command === 'string' && nvidiaHost.test(command) && connects.test(command);
}

// A file outside the shared modules that names the inference host or reads the key can call the API on its own.
export function nvidiaAccessError(file, source) {
  if (allowed(file) || !/\.(?:mjs|js|sh|json|ya?ml|toml)$/.test(file)) return null;
  if (!nvidiaHost.test(source) && !source.includes('NVIDIA_API_KEY')) return null;
  return 'names the NVIDIA inference host or NVIDIA_API_KEY outside the shared evaluation runner; route the request through evals/lib.mjs so the shared rate limit applies';
}

// Decides one PreToolUse event. A denial carries the reason the session reads.
export function toolDecision(input) {
  if (input?.hook_event_name !== 'PreToolUse') return null;
  const { tool_name: tool, tool_input: args = {} } = input;
  if (tool === 'Bash') return directNvidiaCommand(args.command) ? reason : null;
  if (['Write', 'Edit', 'MultiEdit'].includes(tool)) {
    const file = String(args.file_path ?? '').replaceAll('\\', '/');
    const { file_path: _path, ...content } = args;
    const text = JSON.stringify(content);
    if (
      !allowed(file.replace(/^.*?(evals|harness)\//, '$1/')) &&
      (nvidiaHost.test(text) || text.includes('NVIDIA_API_KEY'))
    )
      return reason;
  }
  return null;
}

if (
  process.argv[1] &&
  existsSync(process.argv[1]) &&
  realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))
) {
  let input;
  try {
    let raw = '';
    for await (const chunk of process.stdin) {
      raw += chunk;
      if (raw.length > 4 * 1024 * 1024) throw new Error('Hook input exceeds 4 MiB');
    }
    input = JSON.parse(raw);
  } catch (error) {
    console.error(`NVIDIA guard input invalid: ${error.message}. The call was not checked.`);
    process.exit(1);
  }
  const denial = toolDecision(input);
  if (denial) {
    console.error(denial);
    process.exit(2); // Exit code 2 blocks the tool call and shows this message to the session.
  }
}
