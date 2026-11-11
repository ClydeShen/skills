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

In a hosted workspace, prepare Node.js 24 and the network allowlist first; see [cloud environment setup](./HARNESS.md#cloud-environment-setup).

### NVIDIA trial endpoint

Configure `NVIDIA_API_KEY` in the cloud or local environment, then run:

```text
npm run eval:nvidia -- --case C6
```

This runs one case under three prompt conditions. Omit `-- --case C6` for the full suite. Configuration in `.env.evaluation` also works; do not paste keys into chat or commit them.

The NVIDIA catalog review on 2026-10-25 selected `nvidia/nemotron-3.5-super-vl-120b-a12b` at the fixed endpoint `https://integrate.api.nvidia.com/v1`. At that review, the catalog marked it Free Endpoint Available and suitable for agentic workloads; its API documented reasoning controls and structured responses. This is an initial capability-based choice, not measured superiority on this suite.

Defaults are `reasoning_effort: none`, `stream: false` and a 4096-output-token limit so reasoning does not crowd out short JSON answers. Temperature 1 and top-p 0.95 follow the model documentation; parameters are recorded with results. Set `NVIDIA_REASONING_EFFORT` to `low` or `high` to enable reasoning, with a default limit of 16384. Override the limit with `EVAL_MAX_TOKENS`.

The trial endpoint answers HTTP 429 above about 40 requests per minute and to a quick burst. Every request to it, from any skill, any suite and any process on the machine, therefore takes its start time from one shared schedule in `evals/.local/nvidia-rate.json` (guarded by a lock file next to it), at least `60000 / NVIDIA_RPM` milliseconds after the previous one. The runner applies it to Promptfoo calls through `evals/rate-limit.mjs`, and the image judge takes every attempt, retries included, through the same schedule. `NVIDIA_RPM` defaults to 36 and can only lower the rate: the largest accepted value is 40, the endpoint's limit. A 429 is retried after the larger of its `Retry-After` header and a 2, 4 and 8 second backoff. A cached response takes a place in the schedule too, because it cannot be told from a request before the call. See the [rate-limit research](../research/harness/prompt-evaluation/0001-nvidia-trial-limit-is-about-forty-requests-per-minute.md) for the evidence and its limits.

Never call the NVIDIA API directly, from a shell command or a script of your own: that spends the same rate limit outside the schedule. Use `npm run eval:nvidia`, `npm run eval:model` or another `npm run eval:*` command. A `PreToolUse` hook for Claude Code and Codex (`harness/nvidia-guard.mjs`) denies shell commands that connect to the inference host and writes of scripts that name it, and the repository check fails on code outside the shared modules that names the host or reads `NVIDIA_API_KEY`. The schedule is shared by processes on one machine. Separate cloud sessions have separate filesystems and do not share it, so sessions that use one key at the same time can still exceed the limit; the default rate leaves four requests per minute of margin for that.

Set `NVIDIA_MODEL` to select another model, such as `nvidia/nemotron-3.5-lightning-30b-a3b`, also listed with a free endpoint at that review. Switching models does not automatically send Super-specific reasoning parameters; check the selected model's supported parameters. The Super endpoint was early access. Trial eligibility, limits and availability depend on the account and current NVIDIA service. Failures never automatically switch to another model or a paid endpoint.

`npm run eval:model` automatically selects NVIDIA only when no generic endpoint is configured and `NVIDIA_API_KEY` is available. Explicit `eval:nvidia` always uses NVIDIA's fixed address and key; it never forwards that key to `EVAL_API_BASE_URL`. Environment variables and `.env.evaluation` work across target platforms.

See the [NVIDIA provider research](../research/harness/prompt-evaluation/nvidia-hosted-provider-2026-10-25.md) for selection and deprecated endpoints. A catalog availability label does not establish successful access with the user's account. Start with one case after configuration.

### Generic compatible endpoints

Copy `.env.evaluation.example` to `.env.evaluation`. Uncomment and configure `EVAL_API_BASE_URL` and `EVAL_MODEL`. A local compatible endpoint may use `http://127.0.0.1:11434/v1`; the model name must exist on that endpoint. Remote endpoints also require an explicit `EVAL_API_KEY`.

```text
npm run eval:model
```

The endpoint must support Chat Completions. Use a local service or an explicitly authorized remote service. Remote runs send cases and prompts and may incur charges. Missing configuration produces an error; the runner does not silently use other host credentials. This project neither installs models nor starts a local model server.

Variables come from `.env.evaluation` or the host environment. Existing environment variables take precedence. Evaluation disables telemetry, update checks and result sharing; the local runner writes reports.

### Regression cost and caching

Run deterministic checks and targeted Promptfoo regressions before requesting another full agent generation. For single-run model suites whose complete input is in the prompt, the runner enables Promptfoo response caching by default. Identical provider settings and prompts can reuse responses; changed prompt content is evaluated again. Reports record the requested/effective cache mode and each response's cache status. Use `--cache off` for a fresh measurement.

Fixture runs, `--repeat` greater than one and suites that supply providers (including agents and image/tool suites) always bypass response caching. A cached answer cannot recreate generated files or count as an independent sample. Cache reuse does not establish a new live pass, and cached latency/cost is not fresh execution performance. Keep model/agent changes separate from prompt changes when comparing a baseline.

Clean scenario evaluation is agent-neutral: isolate the selected client's settings, memory and global skills, provide only the package and scenario, and give the reviewer only the scenario and outputs. [Clean scenario runs](#clean-scenario-runs) do this through Promptfoo. The historical Architecture Diagram baseline used Claude Code.

## Image judge

For skills whose deliverable is an image, [`evals/vision-judge.mjs`](../evals/vision-judge.mjs) provides a Promptfoo provider that reads one image and checks a list of claims against what is visible. It uses `NVIDIA_JUDGE_MODEL`, which defaults to `mistralai/mistral-large-4-1t-a52b`, so the judge differs from the generation model and never inherits its reasoning or token settings.

A suite supplies `image_path` and `claims` as test vars. Each claim is `{ id, text, critical?, expect? }`. The judge never sees `critical` or `expect`. A `not_drawn` claim is a planted false claim: a strict majority of runs confirming it fails the case, and a lone confirmation is reported as a flag. A critical claim needs a strict majority of runs to confirm it. Give the judge neutral claim ids in shuffled order; an id such as `x-...` that reveals a planted claim inflates its accuracy. Add planted false claims for each kind of error the skill can make, such as reversed direction, wrong boundary, wrong count and wrong responsibility, so a judge that agrees with everything is caught.

The provider asks each run in a different claim order, retries transient HTTP errors with backoff, and reports an error without credentials when no run succeeds. A suite that returns its own `providers` keeps them in model mode; the report lists them as `suite_providers`. Calibration on 2026-10-30 used one image and four candidate judges with a handful of runs each; treat the judge as a noisy instrument and spot-check its evidence.

## Meta Thinking suite

The initiative owns its [cases](../incubator/meta-thinking/evals/cases.json) and [suite](../incubator/meta-thinking/evals/suite.mjs); `evals/` owns the shared runner.

The same cases compare a baseline assistant, the skill description alone, and the full candidate with references. Every condition receives the same JSON response contract. Rules check proposed interaction direction, memory policy and causal confidence, plus nonempty explanations and next actions. Expected values and synthetic answers stay on the grading side, outside model inputs.

The JSON contract influences output; this is not natural conversation or full agent execution. Passing rules establishes only the limited checked properties. Inspect explanations and actual artifacts manually. The description-only condition offers activation-related clues, not proof that a client loaded the skill. Profile cases check proposed policy without user-directory reads or writes.

Fixture mode sends authored synthetic answers through the grading pipeline. All three conditions receive the same answer, so fixture scores cannot compare prompts or establish model effectiveness or working memory.

## Skill trigger and version comparison

Real-agent checks run Claude Code and Codex through Promptfoo's agent providers and use `skill-used` and `not-skill-used`. They use your existing Claude Code and Codex login when no API key is set, consume its quota, and never run from hooks or the default gate.

```text
npm run eval:agents:setup
npm run eval:trigger -- --skill meta-thinking --agent claude
npm run eval:trigger -- --skill meta-thinking --repeat 3 --baseline main
```

Each initiative keeps its cases in `incubator/<initiative>/evals/trigger.json`, with at least one near miss the skill must leave alone. `--baseline <git-ref>` adds the skill at that ref as a second arm. The run prints passes, mean cost and mean time per arm, and the report records skill calls for each run.

Limits: Promptfoo infers Codex skill use from `SKILL.md` reads, so spot check the records. Agents run on the host, in a temporary project with read-only tools, not in a container. Claude loads project settings only; Codex still reads your own `CODEX_HOME`, so your global skills can influence it. These checks have only run as synthetic replay so far.

## Clean scenario runs

A scenario run gives an agent one source and an unchanged prompt, then gives a separate reviewer only what it may see. It is how a package change is compared with its baseline.

```text
npm run eval:agents:setup
npm run eval:scenario -- --skill architecture-diagram --agent claude --repeat 2
npm run eval:scenario -- --skill architecture-diagram --case azure-document-qa
```

Each initiative declares its runs in `incubator/<initiative>/evals/scenarios.json`: the fixed prompt, the file the source is written to, commands to run after generation, what the reviewer sees, its prompt and score pattern, the baseline file and the cases. A case reads its source whole, or only its block quote when the file also holds expected findings.

Every run starts in a new folder under `evals/.local/scenario-<skill>-*/`, with the working package in the client's project skill location and the source as its only other file. The agent may write files and run the package's scripts there. The reviewer runs in another new folder that holds only the listed files, with read-only tools and no skill. Claude loads project settings only, so no user memory, settings or global skills reach either session; Codex still reads your own `CODEX_HOME`. Both use your existing login and quota.

A run passes when the reviewer gives a score. The run prints each case's scores beside its baseline scores and marks a mean below the baseline minus its tolerance. The owner judges the comparison; no score merges or blocks a change by itself. The report records each run's folder, the result line of each after-command and the reviewed files; the folder also keeps their full output. Promptfoo's cache is off for these runs.

## Adding suites

From the `internal` stage, every initiative's evaluation cases run through this runner; see the [stage rule](./REPOSITORY-STRUCTURE.md#incubation-stages). Add a module under `incubator/<initiative>/evals/`. Export `createSuite({ mode })` returning a Promptfoo test configuration. Fixture mode supplies a provider without external calls; model mode receives the explicitly configured endpoint from the runner. Keep cases and domain assertions in the initiative and reusable utilities in `evals/`.

```text
npm run eval -- --suite incubator/meta-thinking/evals/suite.mjs
```

Reports show prompts, outputs and grading reasons. New rules should include rejected counterexamples so successful execution is not mistaken for quality. No additional paid LLM judge is required. If semantic judging is added, explicitly select its model and budget.

## Verification status

See [candidate evaluation](../incubator/meta-thinking/evaluation.md) for local Linux runs. The [CI workflow](../.github/workflows/prompt-evaluation.yml) runs identical checks on Linux, Windows and macOS without model credentials or paid evaluation. Dated three-platform evidence is in [the verification record](../research/harness/skill-repository/harness-verification-2026-10-28.md); WSL-specific execution and current candidate behavior remain separate checks.

See the [framework research](../research/harness/prompt-evaluation/local-evaluation-framework-2026-10-25.md) for selection evidence and reading scope. Recheck runtime requirements and report structure when upgrading dependencies.
