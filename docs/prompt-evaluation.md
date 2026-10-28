# Local prompt evaluation

This repository uses Promptfoo as its local evaluation library and Node.js 24 as the shared runtime. Dependencies are pinned in `package.json` and `package-lock.json`. Commands use Node.js and npm, without requiring Bash, global installations, Docker or a hosted evaluation service.

Selection on 2026-10-25: the npm registry returned Promptfoo `0.125.0`. It fits prompt regression, version comparison and replaceable model endpoints. GitHub pages then showed approximately 26.4k stars for [Promptfoo](https://github.com/promptfoo/promptfoo), 19.1k for [DeepEval](https://github.com/confident-ai/deepeval), and 3.1k for [Inspect AI](https://github.com/UKGovernmentBEIS/inspect_ai). These observations compare attention to three projects, not ecosystem-wide usage. Local execution and task fit were the primary selection criteria.

## Install and run

Install Node.js 24 on cloud Linux, native Windows PowerShell, macOS or WSL. From the repository root, run:

```text
npm ci
npm test
npm run eval
```

`npm test` checks the shared harness, grading logic and fixture isolation. `npm run eval` sends synthetic answers through Promptfoo to check rendering, assertions and reports; it neither calls models nor loads `.env.evaluation`. Initial installation needs network access; basic checks then need no model API or credentials. Use `npm run check` for the full repository gate; see the [delivery harness](./HARNESS.md).

`npm run test:transport` separately checks HTTP transport against a temporary loopback service, not a real model. Restricted hosts must permit local socket binding; basic checks do not require this permission.

Run `npm ci` separately on each operating system. Do not share `node_modules` between Windows and WSL because dependencies may be platform-specific. Version managers may use `.nvmrc`; native Windows can also install Node.js 24 directly.

Local results go to `evals/.local/`, with a separate JSON report per run. Dependencies, local settings, caches and reports are Git-ignored. Reports contain synthetic inputs, model output, assertions, prompt hashes and runtime details. Inspect real-model reports before sharing them.

## Real-model evaluation

### NVIDIA trial endpoint

Configure `NVIDIA_API_KEY` in the cloud or local environment, then run:

```text
npm run eval:nvidia -- --case C6
```

This runs one case under three prompt conditions. Omit `-- --case C6` for the full suite. Configuration in `.env.evaluation` also works; do not paste keys into chat or commit them.

The NVIDIA catalog review on 2026-10-25 selected `nvidia/nemotron-3.5-super-vl-120b-a12b` at the fixed endpoint `https://integrate.api.nvidia.com/v1`. At that review, the catalog marked it Free Endpoint Available and suitable for agentic workloads; its API documented reasoning controls and structured responses. This is an initial capability-based choice, not measured superiority on this suite.

Defaults are `reasoning_effort: none`, `stream: false` and a 4096-output-token limit so reasoning does not crowd out short JSON answers. Temperature 1 and top-p 0.95 follow the model documentation; parameters are recorded with results. Set `NVIDIA_REASONING_EFFORT` to `low` or `high` to enable reasoning, with a default limit of 16384. Override the limit with `EVAL_MAX_TOKENS`.

Set `NVIDIA_MODEL` to select another model, such as `nvidia/nemotron-3.5-lightning-30b-a3b`, also listed with a free endpoint at that review. Switching models does not automatically send Super-specific reasoning parameters; check the selected model's supported parameters. The Super endpoint was early access. Trial eligibility, limits and availability depend on the account and current NVIDIA service. Failures never automatically switch to another model or a paid endpoint.

`npm run eval:model` automatically selects NVIDIA only when no generic endpoint is configured and `NVIDIA_API_KEY` is available. Explicit `eval:nvidia` always uses NVIDIA's fixed address and key; it never forwards that key to `EVAL_API_BASE_URL`. Environment variables and `.env.evaluation` work across target platforms.

See the [NVIDIA provider research](../research/harness/prompt-evaluation/nvidia-hosted-provider-2026-10-25.md) for selection and deprecated endpoints. A catalog availability label does not establish successful access with the user's account. Start with one case after configuration.

### Generic compatible endpoints

Copy `.env.evaluation.example` to `.env.evaluation`. Uncomment and configure `EVAL_API_BASE_URL` and `EVAL_MODEL`. A local compatible endpoint may use `http://127.0.0.1:11434/v1`; the model name must exist on that endpoint. Remote endpoints also require an explicit `EVAL_API_KEY`.

```text
npm run eval:model
```

The endpoint must support Chat Completions. Use a local service or an explicitly authorized remote service. Remote runs send cases and prompts and may incur charges. Missing configuration produces an error; the runner does not silently use other host credentials. This project neither installs models nor starts a local model server.

Variables come from `.env.evaluation` or the host environment, avoiding OS-specific assignments in npm commands. Existing environment variables take precedence. Evaluation disables Promptfoo telemetry, update checks, caching and result sharing; the local runner writes reports.

## Meta Thinking suite

The initiative owns its [cases](../incubator/meta-thinking/evals/cases.json) and [suite](../incubator/meta-thinking/evals/suite.mjs); `evals/` owns the shared runner.

The same cases compare a baseline assistant, the skill description alone, and the full candidate with references. Every condition receives the same JSON response contract. Rules check proposed interaction direction, memory policy and causal confidence, plus nonempty explanations and next actions. Expected values and synthetic answers stay on the grading side, outside model inputs.

The JSON contract influences output; this is not natural conversation or full agent execution. Passing rules establishes only the limited checked properties. Inspect explanations and actual artifacts manually. The description-only condition offers activation-related clues, not proof that a client loaded the skill. Profile cases check proposed policy without user-directory reads or writes.

Fixture mode sends authored synthetic answers through the grading pipeline. All three conditions receive the same answer, so fixture scores cannot compare prompts or establish model effectiveness or working memory.

## Adding suites

Add a module under `incubator/<initiative>/evals/`. Export `createSuite({ mode })` returning a Promptfoo test configuration. Fixture mode supplies a provider without external calls; model mode receives the explicitly configured endpoint from the runner. Keep cases and domain assertions in the initiative and reusable utilities in `evals/`.

```text
npm run eval -- --suite incubator/meta-thinking/evals/suite.mjs
```

Reports show prompts, outputs and grading reasons. New rules should include rejected counterexamples so successful execution is not mistaken for quality. No additional paid LLM judge is required. If semantic judging is added, explicitly select its model and budget.

## Verification status

See [candidate evaluation](../incubator/meta-thinking/evaluation.md) for local Linux runs. The [CI workflow](../.github/workflows/prompt-evaluation.yml) runs identical checks on Linux, Windows and macOS without model credentials or paid evaluation. Subsequent successful three-platform evidence is recorded in [HARNESS.md](./HARNESS.md); WSL-specific execution and current candidate behavior remain separate checks.

See the [framework research](../research/harness/prompt-evaluation/local-evaluation-framework-2026-10-25.md) for selection evidence and reading scope. Recheck runtime requirements and report structure when upgrading dependencies.
