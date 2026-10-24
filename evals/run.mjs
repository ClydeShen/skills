import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';
import { digest, modelProvider, parseArgs } from './lib.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const local = resolve(root, 'evals/.local');
const envFile = resolve(root, '.env.evaluation');

async function main() {
  const { mode, provider: selection, suite: suitePath, case: caseId } = parseArgs(process.argv.slice(2));
  // Offline repository gates must not load the user's model credentials.
  if (mode === 'model' && existsSync(envFile)) process.loadEnvFile(envFile);
  const provider = mode === 'model' ? modelProvider(process.env, selection) : null;
  process.env.PROMPTFOO_DISABLE_TELEMETRY = '1';
  process.env.PROMPTFOO_DISABLE_UPDATE = '1';
  process.env.PROMPTFOO_CACHE_ENABLED = 'false';
  process.env.PROMPTFOO_CONFIG_DIR = resolve(local, 'promptfoo');
  const { createSuite } = await import(pathToFileURL(resolve(root, suitePath)).href);
  const suite = await createSuite({ mode });
  if (caseId) {
    suite.tests = suite.tests.filter((test) => test.vars?.case_id === caseId);
    if (!suite.tests.length) throw new Error('No test matches the requested case ID.');
  }
  const { default: promptfoo } = await import('promptfoo');
  const record = await promptfoo.evaluate({
    ...suite,
    ...(provider ? { providers: [provider] } : {}),
    writeLatestResults: false,
    sharing: false,
  }, { cache: false, maxConcurrency: 1 });
  const summary = await record.toEvaluateSummary();
  const packageInfo = JSON.parse(await readFile(resolve(root, 'node_modules/promptfoo/package.json'), 'utf8'));
  // Select report fields: SDK configs may contain provider credentials.
  const report = {
    created_at: new Date().toISOString(),
    mode,
    scope: mode === 'fixture' ? 'Synthetic replay: harness and assertions only; no model was evaluated.' : 'Prompt decision checks; no agent tools or persistent memory execution.',
    suite: suitePath,
    case_filter: caseId || null,
    suite_sha256: digest(await readFile(resolve(root, suitePath), 'utf8')),
    framework: { name: 'promptfoo', version: packageInfo.version },
    runtime: { node: process.version, platform: process.platform, arch: process.arch },
    model: provider ? provider.id.replace(/^openai:chat:/, '') : null,
    parameters: provider ? {
      endpoint: provider.config.apiBaseUrl,
      temperature: provider.config.temperature,
      top_p: provider.config.top_p,
      max_tokens: provider.config.max_tokens,
      reasoning_effort: provider.config.passthrough?.reasoning_effort,
    } : null,
    stats: summary.stats,
    results: summary.results.map((r) => ({
      case_id: r.vars?.case_id,
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
  await writeFile(file, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
  const failures = report.results.filter((r) => !r.success).length;
  console.log(`\n${report.scope}\n${report.results.length - failures}/${report.results.length} checks passed.\nReport: ${file}`);
  process.exitCode = failures ? 1 : 0;
}

main().catch((error) => {
  // Do not echo provider request bodies or credentials on an SDK error.
  console.error(error instanceof Error && !error.message.includes('Bearer') ? error.message : 'Evaluation failed. Check configuration.');
  process.exitCode = 1;
});
