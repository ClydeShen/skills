# Research: Cross-platform local prompt evaluation framework

Date: 2026-10-25. Question: How should the repository configure prompt testing for managed Linux cloud environments, native Windows, macOS, and WSL? Context: The Meta Thinking candidate has test cases and needs a repeatable evaluation entry point.

Recommendation: [inference] Use a project-pinned promptfoo dependency through a Node.js entry point. Separate infrastructure checks that make no model calls from real model evaluations. Infrastructure checks validate configuration, templates, and assertions, not the skill's semantic effectiveness.

Markers: `[official]` means primary documentation or source code was read; `[measured]` means an actual command result; `[inference]` means a project recommendation. This research did not run the program on Windows or macOS.

Translation and source recheck: 2026-10-25. The installation, Node SDK, evaluation source, and telemetry documentation were reopened. Their relevant documented interfaces remain consistent with this note. The registry measurement below is retained from the original research; a fresh registry query was stopped after the shell proxy proved unavailable. No model evaluation was run during translation.

## Overview

| Question | Recommendation | Evidence strength | Confidence |
| --- | --- | --- | --- |
| Is it suitable for multiple platforms? | Use Node.js 24 and an npm project dependency | Strong: official installation guidance and upstream three-platform CI; project-specific platform runs remain unverified | Medium, J1 |
| Is a hosted service required? | Use the local SDK, file results, and a replaceable provider | Strong: official SDK and custom-provider documentation | Medium, J2 |
| How can paid calls be excluded by default? | Use an explicitly labeled local fixture/smoke provider; provide a separate entry point for real models | Strong: providers are customizable; the proposed separation is an inference | Medium, J3 |
| How can fixture success be kept distinct from skill effectiveness? | Report pipeline checks, real outputs, and human evaluation separately | Methodological recommendation without project effectiveness evidence | Medium, J3 |

## 1. Runtime and platform boundaries

### Evidence

[official] The installation documentation requires Node.js `>=22.22.0` and recommends Node.js 24 LTS. It provides npm/npx installation methods and Windows data-directory guidance.[S1]

[measured] On 2026-10-25, the original research ran `npm view promptfoo version engines --json` in the current environment. The registry returned version `0.125.0` and Node.js requirement `>=22.22.0`. The project lockfile should still pin the selected version.

[official] Upstream CI includes Linux, macOS, and Windows tests and package-consumption checks, with caches separated by OS and Node version. The source package.json includes `@libsql/client`; dependency descriptions from older versions should not be copied unchanged.[S2][S3]

### Recommendation for the project

[inference · J1] Use Node.js scripts for environment loading, path resolution, and subprocess calls. npm scripts should invoke those scripts rather than requiring Bash environment-variable syntax, `cp`, `rm`, `grep`, or platform-specific commands. Cloud environments can direct logs, caches, and results to writable directories.

[inference] Run `npm ci` on each target system. Do not share `node_modules` across Windows, WSL, and macOS. Upstream coverage supports the cross-platform choice, but this repository still needs its own platform execution evidence.

### Relation to existing constraints

Keep the framework separate from the candidate skill's runtime package. The project maintains tool dependencies; released skill packages need not carry the entire evaluation toolchain.

## 2. Local SDK, providers, and result control

### Evidence

[official] The Node SDK's `evaluate()` returns an Eval record. Calling `toEvaluateSummary()` obtains the results. The source documents the suite's `writeLatestResults` setting for persistence and the options' `cache` setting for call caching.[S4][S5]

[official] A custom JavaScript provider implements at least `id()` and `callApi()`; `.mjs` is supported. This permits fixed input/output pipeline checks or integration with a custom API.[S6]

[official] Telemetry and update checks can be disabled with `PROMPTFOO_DISABLE_TELEMETRY=1` and `PROMPTFOO_DISABLE_UPDATE=1`, respectively. Default data, configuration, and cache directories are configurable.[S1][S7]

### Recommendation for the project

[inference · J2] Set required environment options before importing the SDK. Infrastructure checks should use a provider that makes no network calls, disable unnecessary caching and sharing, and write results to a project-ignored local directory. Start real model calls through an explicit entry point. Keep credentials out of cases and committed files.

[inference] The reviewed source and documentation do not provide sufficient support for the older `options.write: false` example. Follow the installed version's actual API, configure `writeLatestResults` explicitly, and inspect the files produced. Sharing, caching, and result persistence are separate controls.

### Relation to existing constraints

The cloud environment's home directory may be read-only. A writable local results directory is more reliable than assuming global `~/.promptfoo` is writable. Implementation configuration determines the actual directory.

## 3. Model entry points and evaluation meaning

### Evidence

[official] promptfoo provides an Ollama provider and supports `OLLAMA_BASE_URL`. Its documentation discusses IPv4/IPv6 differences for `localhost`.[S8]

[official] The OpenAI-compatible provider supports `apiBaseUrl` and a custom credential variable. Local endpoints that need no authentication can use the corresponding configuration. Graders for model-scored assertions need separate configuration.[S9]

[official] Assertions include string, JSON, custom JavaScript, and model-scored checks. Some assertions call another model or service.[S10]

### Recommendation for the project

[inference · J3] Use deterministic assertions by default; do not introduce an LLM judge by default. Infrastructure checks should demonstrate that positive cases pass, negative cases fail, and errors produce a nonzero exit status. Fixed fixtures do not contribute to real model effectiveness statistics.

[inference] Real evaluations can connect to local Ollama, a compatible endpoint, or a user-selected model. A local framework means the runner runs locally; a remote provider still receives the prompt. In a cloud environment, `localhost` means the cloud machine, not the user's Windows or macOS host.

[inference] Structured responses simplify automated checking, but output-format constraints can alter the behavior being measured. Retain outputs and case rationale, and supplement checks with human judgment. Prompt-level evaluation cannot establish that the host actually wrote files, activated a skill naturally, or retrieved information across sessions.

### Relation to existing constraints

Meta Thinking's infrequent activation and lightweight intervention can first be tested through cases. Profile writes, permission fallback, and real agent tool use require subsequent host-integration testing.

## Judgment confidence

J1–J3 have medium support, 3.0: Owner 1 (the user explicitly requested a cross-platform local framework); Research 1 (primary API and platform sources); Reasoning 0.5 (the architecture choice is an inference); Project history 0.5 (cases exist, without a complete trial at the time of research). These scores are not probabilities of cross-platform success.

## Not verified

- This repository's suite was not installed or run on Windows, macOS, or WSL during this research.
- Availability of a local model, sufficient resources, or usable credentials on the user's machine was not verified.
- Long-term skill benefits were not evaluated. Passing fixture or output-structure checks does not establish behavioral effectiveness.
- Reading covered upstream main and the documentation available on the research date, not an item-by-item comparison with the released package implementation. Implementation should verify the pinned version and actual execution results.

## Decisions for the owner

No immediate model selection or service purchase is required. Paid model calls are excluded by default; a real model remains an explicit configuration choice.

## Sources

- [S1 — Installation](https://www.promptfoo.dev/docs/installation/): runtime requirements, installation, directory controls, and Windows paths.
- [S2 — Upstream CI](https://raw.githubusercontent.com/promptfoo/promptfoo/main/.github/workflows/main.yml): platform matrix and package-consumption tests were read.
- [S3 — package.json](https://raw.githubusercontent.com/promptfoo/promptfoo/main/package.json): engines, exports, and dependencies were read.
- [S4 — Using the node package](https://www.promptfoo.dev/docs/usage/node-package/): evaluate, provider, and assertion-function usage were read.
- [S5 — Node evaluate source](https://raw.githubusercontent.com/promptfoo/promptfoo/main/src/node/evaluate.ts): parameter and result documentation were read.
- [S6 — JavaScript provider](https://www.promptfoo.dev/docs/providers/custom-api/): minimum interface and module formats were read.
- [S7 — Telemetry](https://www.promptfoo.dev/docs/configuration/telemetry/): telemetry and update-check controls were read.
- [S8 — Ollama provider](https://www.promptfoo.dev/docs/providers/ollama/): local connections and host-address boundaries were read.
- [S9 — OpenAI provider](https://www.promptfoo.dev/docs/providers/openai/): only compatible endpoints, authentication, and grader configuration were reviewed; no model prices or lifecycle claims are made.
- [S10 — Assertions](https://www.promptfoo.dev/docs/configuration/expected-outputs/): assertion types and provider-dependent metrics were read.
