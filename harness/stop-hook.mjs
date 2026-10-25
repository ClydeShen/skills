import { spawnSync } from 'node:child_process';
import { existsSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export function stopDecision(input, result) {
  if (input.hook_event_name !== 'Stop') return {};
  if (!result.error && result.status === 0) return {};
  const details = String(result.error?.message || result.stderr || result.stdout || 'Unknown check failure').slice(-5000);
  const reason = `Repository checks did not pass. Run npm run check:repo from the repository root. Fix only issues within the authorized task; report pre-existing failures or missing tools instead of expanding scope. Do not weaken checks to finish.\n${details}`;
  // One repair opportunity, then surface the remaining failure instead of looping.
  return input.stop_hook_active === true
    ? { systemMessage: `Verification remains incomplete; report this blocker in the handoff.\n${details}` }
    : { decision: 'block', reason };
}

// Node normally resolves module URLs to physical paths; argv can retain an alias
// (notably /var -> /private/var on macOS). Compare both physical paths.
if (process.argv[1] && existsSync(process.argv[1]) && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) {
  let input;
  try {
    let raw = '';
    for await (const chunk of process.stdin) {
      raw += chunk;
      if (raw.length > 1024 * 1024) throw new Error('Hook input exceeds 1 MiB');
    }
    input = JSON.parse(raw);
    if (!input || Array.isArray(input) || typeof input !== 'object' || input.hook_event_name !== 'Stop' || (input.stop_hook_active !== undefined && typeof input.stop_hook_active !== 'boolean')) throw new Error('Expected Stop event object with optional boolean stop_hook_active');
  } catch (error) {
    console.error(`Harness hook input invalid: ${error.message}. No repository validation was performed.`);
    process.exit(1); // Protocol failure, not a successful validation or unbounded block.
  }
  const result = spawnSync(process.execPath, [fileURLToPath(new URL('./check.mjs', import.meta.url))], {
    cwd: fileURLToPath(new URL('../', import.meta.url)), encoding: 'utf8', timeout: 20_000, maxBuffer: 1024 * 1024,
  });
  if (result.error || result.status !== 0) console.error('Harness Stop check failed; this is feedback, not a security boundary.');
  console.log(JSON.stringify(stopDecision(input, result)));
}
