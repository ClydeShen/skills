import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

export const nvidiaDefaultModel = 'nvidia/nemotron-3.5-super-vl-120b-a12b';
export const nvidiaApiBaseUrl = 'https://integrate.api.nvidia.com/v1';

export const responseContract = `For this evaluation only, return one JSON object with:
approach: continue | reframe | explore | design
memory: skip | record | revise | unavailable
cause: unknown | tentative | supported
explanation: a brief evidence-based explanation in the user's language
next_action: a concrete response or artifact that advances the request.
These fields describe your proposed behavior, not actions already executed.
Do not claim to read or write files. No filesystem tools are available in this evaluation.`;

export async function readSkill(directory) {
  const main = await readFile(new URL('SKILL.md', directory), 'utf8');
  const match = main.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error('Skill frontmatter is missing.');
  const description = match[1].match(/^description:\s*(.+)$/m)?.[1];
  if (!description) throw new Error('Skill description is missing.');
  const resources = await Promise.all([
    'references/interaction-options.md',
    'references/memory.md',
  ].map(async (name) => `## ${name}\n${await readFile(new URL(name, directory), 'utf8')}`));
  return { description, full: [match[2], ...resources].join('\n\n') };
}

export function renderPrompt(instructions, vars) {
  return JSON.stringify([
    { role: 'system', content: `Help the user complete their task.\n${instructions}\n\n${responseContract}` },
    { role: 'user', content: vars.conversation },
  ]);
}

export function gradeDecision(output, expected) {
  let decision;
  try {
    decision = JSON.parse(output);
  } catch {
    return { pass: false, score: 0, reason: 'Expected a JSON decision object.' };
  }
  if (!decision || typeof decision !== 'object' || Array.isArray(decision)) {
    return { pass: false, score: 0, reason: 'Expected a JSON decision object.' };
  }
  const errors = [];
  for (const key of ['approach', 'memory', 'cause']) {
    if (!expected[key].includes(decision[key])) {
      errors.push(`${key}: expected ${expected[key].join(' or ')}, received ${String(decision[key])}`);
    }
  }
  for (const key of ['explanation', 'next_action']) {
    if (typeof decision[key] !== 'string' || !decision[key].trim()) errors.push(`${key} is empty.`);
  }
  return { pass: errors.length === 0, score: errors.length ? 0 : 1, reason: errors.join('; ') || 'Decision checks passed; inspect the response quality manually.' };
}

export function parseArgs(args) {
  const options = { mode: 'fixture', provider: 'auto', suite: 'incubator/meta-thinking/evals/suite.mjs' };
  for (let i = 0; i < args.length; i += 2) {
    if (!['--mode', '--suite', '--provider', '--case'].includes(args[i]) || !args[i + 1]) throw new Error('Usage: npm run eval -- [--mode fixture|model] [--provider auto|generic|nvidia] [--suite path/to/suite.mjs] [--case case-id]');
    options[args[i].slice(2)] = args[i + 1];
  }
  if (!['fixture', 'model'].includes(options.mode)) throw new Error('Mode must be fixture or model.');
  if (!['auto', 'generic', 'nvidia'].includes(options.provider)) throw new Error('Provider must be auto, generic, or nvidia.');
  return options;
}

export function modelProvider(env, selection = 'auto') {
  if (!['auto', 'generic', 'nvidia'].includes(selection)) throw new Error('Unknown provider selection.');
  const useNvidia = selection === 'nvidia' || (selection === 'auto' && env.NVIDIA_API_KEY && !env.EVAL_API_BASE_URL && !env.EVAL_MODEL);
  if (useNvidia) {
    if (!env.NVIDIA_API_KEY) throw new Error('NVIDIA evaluation requires NVIDIA_API_KEY.');
    const model = env.NVIDIA_MODEL || nvidiaDefaultModel;
    const effort = env.NVIDIA_REASONING_EFFORT || (model === nvidiaDefaultModel ? 'none' : undefined);
    if (effort && !['none', 'low', 'high'].includes(effort)) throw new Error('NVIDIA_REASONING_EFFORT must be none, low, or high.');
    const maxTokens = env.EVAL_MAX_TOKENS ? Number(env.EVAL_MAX_TOKENS) : effort && effort !== 'none' ? 16384 : 4096;
    if (!Number.isInteger(maxTokens) || maxTokens < 1 || maxTokens > 131072) throw new Error('EVAL_MAX_TOKENS must be an integer from 1 to 131072.');
    return {
      id: `openai:chat:${model}`,
      config: {
        apiBaseUrl: nvidiaApiBaseUrl,
        apiKey: env.NVIDIA_API_KEY,
        useDefaultApiKey: false,
        temperature: 1,
        top_p: 0.95,
        max_tokens: maxTokens,
        passthrough: { stream: false, ...(effort ? { reasoning_effort: effort } : {}) },
      },
    };
  }
  if (!env.EVAL_MODEL || !env.EVAL_API_BASE_URL) throw new Error('Model mode requires EVAL_MODEL and EVAL_API_BASE_URL in .env.evaluation or the environment.');
  const base = new URL(env.EVAL_API_BASE_URL);
  if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password || base.search || base.hash) {
    throw new Error('Use an HTTP(S) API base URL without credentials, query parameters, or a fragment.');
  }
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(base.hostname);
  if (!local && !env.EVAL_API_KEY) throw new Error('A remote endpoint requires an explicit EVAL_API_KEY.');
  return {
    id: `openai:chat:${env.EVAL_MODEL}`,
    config: {
      apiBaseUrl: base.href.replace(/\/$/, ''),
      apiKey: env.EVAL_API_KEY || 'local-evaluation',
      useDefaultApiKey: false,
      temperature: 0,
      max_tokens: 2048,
    },
  };
}

export function digest(text) {
  return createHash('sha256').update(text).digest('hex');
}
