import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { armSummary, digest, evaluationCache, modelProvider, nvidiaApiBaseUrl, parseArgs } from './lib.mjs';
import { isNvidiaProvider, limitedProvider, requestsPerMinute, sharedNvidiaLimiter } from './rate-limit.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const local = resolve(root, 'evals/.local');
const envFile = resolve(root, '.env.evaluation');

async function main() {
  const {
    mode,
    provider: selection,
    suite: suitePath,
    case: caseId,
    skill,
    agent,
    baseline,
    repeat,
    cache,
  } = parseArgs(process.argv.slice(2));
  // Offline repository gates must not load the user's model credentials.
  if (mode === 'model' && existsSync(envFile)) process.loadEnvFile(envFile);
  process.env.PROMPTFOO_DISABLE_TELEMETRY = '1';
  process.env.PROMPTFOO_DISABLE_UPDATE = '1';
  process.env.PROMPTFOO_CONFIG_DIR = resolve(local, 'promptfoo');
  const { createSuite } = await import(pathToFileURL(resolve(root, suitePath)).href);
  // A suite may add a summary of its results, printed after the run; Promptfoo does not receive it.
  const { summary: summarize, ...suite } = await createSuite({
    mode,
    env: process.env,
    options: { skill, agent, baseline },
  });
  // A suite that supplies its own providers, such as the image judge or a real agent, keeps them in model mode.
  const suiteProviders = Boolean(suite.providers?.length);
  const useCache = evaluationCache({ mode, repeat, cache, suiteProviders });
  process.env.PROMPTFOO_CACHE_ENABLED = String(useCache);
  const provider = mode === 'model' && !suiteProviders ? modelProvider(process.env, selection) : null;
  if (caseId) {
    suite.tests = suite.tests.filter((test) => test.vars?.case_id === caseId);
    if (!suite.tests.length) throw new Error('No test matches the requested case ID.');
  }
  const { default: promptfoo } = await import('promptfoo');
  // Every request to the NVIDIA endpoint takes its start time from the schedule shared by all processes.
  const nvidia = isNvidiaProvider(provider, nvidiaApiBaseUrl);
  const limited = nvidia
    ? limitedProvider(
        await promptfoo.loadApiProvider(provider.id, { options: { config: provider.config } }),
        sharedNvidiaLimiter(process.env),
      )
    : null;
  const record = await promptfoo.evaluate(
    {
      ...suite,
      ...(provider && !suiteProviders ? { providers: [limited ?? provider] } : {}),
      writeLatestResults: false,
      sharing: false,
    },
    { cache: useCache, maxConcurrency: 1, repeat },
  );
  const summary = await record.toEvaluateSummary();
  const packageInfo = JSON.parse(await readFile(resolve(root, 'node_modules/promptfoo/package.json'), 'utf8'));
  // Select report fields: SDK configs may contain provider credentials.
  const report = {
    created_at: new Date().toISOString(),
    mode,
    scope:
      mode === 'fixture'
        ? 'Synthetic replay: harness and assertions only; no model was evaluated.'
        : suiteProviders && suite.description
          ? suite.description
          : 'Prompt decision checks; no agent tools or persistent memory execution.',
    suite: suitePath,
    case_filter: caseId || null,
    cache: { requested: cache, enabled: useCache, repeat },
    suite_sha256: digest(await readFile(resolve(root, suitePath), 'utf8')),
    framework: { name: 'promptfoo', version: packageInfo.version },
    runtime: { node: process.version, platform: process.platform, arch: process.arch },
    model: provider && !suiteProviders ? provider.id.replace(/^openai:chat:/, '') : null,
    suite_providers:
      mode === 'model' && suiteProviders
        ? suite.providers.map((p) => (typeof p.id === 'function' ? p.id() : null)).filter(Boolean)
        : undefined,
    parameters:
      provider && !suiteProviders
        ? {
            endpoint: provider.config.apiBaseUrl,
            temperature: provider.config.temperature,
            top_p: provider.config.top_p,
            max_tokens: provider.config.max_tokens,
            reasoning_effort: provider.config.passthrough?.reasoning_effort,
            requests_per_minute: nvidia ? requestsPerMinute(process.env) : undefined,
          }
        : null,
    stats: summary.stats,
    results: summary.results.map((r) => ({
      case_id: r.vars?.case_id,
      provider_label: r.provider?.label,
      skill_calls: r.response?.metadata?.skillCalls,
      details: r.response?.metadata?.details,
      cost: r.cost,
      latency_ms: r.latencyMs,
      token_usage: r.tokenUsage ?? r.response?.tokenUsage,
      cached: r.response?.cached === true,
      prompt_label: r.prompt?.label,
      prompt_sha256: digest(r.prompt?.raw || ''),
      prompt: r.prompt?.raw,
      success: r.success,
      score: r.score,
      output: r.response?.output,
      error: r.response?.error ? 'Provider request failed. Check endpoint configuration.' : undefined,
      grading: r.gradingResult,
    })),
  };
  const file = resolve(local, `${mode}-${report.created_at.replace(/[:.]/g, '-')}.json`);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' });
  const failures = report.results.filter((r) => !r.success).length;
  console.log(
    `\n${report.scope}\n${report.results.length - failures}/${report.results.length} checks passed.\nReport: ${file}`,
  );
  if (suiteProviders && mode === 'model') console.log(armSummary(report.results));
  if (summarize) console.log(summarize(report.results));
  process.exitCode = failures ? 1 : 0;
}

main().catch((error) => {
  // Do not echo provider request bodies or credentials on an SDK error.
  console.error(
    error instanceof Error && !error.message.includes('Bearer')
      ? error.message
      : 'Evaluation failed. Check configuration.',
  );
  process.exitCode = 1;
});
