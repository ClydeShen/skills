import { setupHooks } from './git-policy.mjs';
import { installTool, toolNames } from './tools.mjs';

// npm runs this after install. A problem here must surface in the shared check, not fail dependency installation.
function warn(step, error) {
  console.warn(`Repository setup: ${step} skipped: ${error.message}`);
}

try {
  setupHooks();
} catch (error) {
  warn('Git hooks', error);
}
for (const name of toolNames) {
  try {
    await installTool(name);
  } catch (error) {
    warn(name, error);
  }
}
