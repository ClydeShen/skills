# Research: NVIDIA-hosted evaluation model entry point

Date: 2026-10-25. Question: After the user configures `NVIDIA_API_KEY`, which NVIDIA-hosted endpoint is suitable as an overridable default for prompt evaluation? Context: The local evaluation runner needs a real model entry point compatible with cloud environments, Windows, macOS, and WSL.

Recommendation: [inference] Use `nvidia/nemotron-3.5-super-vl-120b-a12b` as the initial default candidate and retain a model override. The catalog on the research date marks its free endpoint as available, and the hosted API explicitly documents disabling reasoning and using JSON schema. This repository has no measured model-quality or latency results for it. It is not established as universally best or guaranteed to remain available.

Markers: `[official]` means NVIDIA's official catalog, API documentation, or terms were read; `[inference]` means a configuration recommendation. No API key was used and no real inference request was sent during this research.

Translation and source recheck: 2026-10-25. The Super 3.5 hosted schema, Super and Lightning Build pages, Qwen3.5-397B and Nemotron3 Super catalog pages, and trial terms were reopened. This was a public-documentation check, not an authenticated endpoint test. The historical no-inference status remains unchanged.

## Overview

| Question | Recommendation | Evidence and limits | Confidence |
| --- | --- | --- | --- |
| Default model | Nemotron 3.5 Super VL, with an override | Catalog availability and API documentation; no service test | Medium, J1 |
| Disable reasoning and request concise JSON | `reasoning_effort: none` and a bounded output budget | Explicitly supported by the POST schema; actual endpoint behavior still governs | Medium, J2 |
| Is permanent free access guaranteed? | Treat it as a limited trial service | Official terms allow limits and termination; account-specific quota is unknown | High, J3 |
| Can older recommendations still be used? | Check current catalog availability first | Qwen3.5-397B and Nemotron3 Super free endpoints are marked deprecated on the research date | Medium, J4 |

## 1. Select against the catalog on the research date

### Evidence

[official] The Build page for `nvidia/nemotron-3.5-super-vl-120b-a12b` shows Free Endpoint Available and supplies an example using `NVIDIA_API_KEY` and `https://integrate.api.nvidia.com/v1`. It also describes the model as early-access.[S1]

[official] The page for `nvidia/nemotron-3.5-lightning-30b-a3b` also shows Free Endpoint Available. Its model card positions it for agentic workloads and recommends temperature 1.0 and top_p 0.95.[S3][S4]

[official] The pages for `qwen/qwen3.5-397b-a17b` and `nvidia/nemotron-3-super-120b-a12b` both show Free Endpoint Deprecated. The Kimi K2.5 page redirects to K2.6. The Kimi K3 and DeepSeek V4 Pro0813 pages also show deprecated free endpoints. Model names or older examples alone are not sufficient selection evidence.[S5–S9]

### Recommendation for the project

[inference · J1/J4] Use Super 3.5 as the default candidate with explicit API documentation, and keep the model ID configurable. Lightning can be a later efficiency-comparison candidate; its smaller parameter count does not establish faster hosted latency. On a 404, permission denial, or quota limit, return an actionable error rather than silently switching models.

### Relation to existing constraints

Cross-platform access requires the runner to reach a hosted HTTPS API, not a local NVIDIA GPU. Catalog availability and the user's actual account permissions are separate questions.

## 2. Parameters and structured output

### Evidence

[official] The Super 3.5 hosted POST schema specifies `https://integrate.api.nvidia.com/v1/chat/completions`. Its default model ID matches the catalog. `reasoning_effort` supports `none`, `low`, and `high`; `none` disables reasoning tokens. `response_format` supports JSON schema, and `stream` can be false.[S2]

[official] The model card also describes controlling reasoning through the chat template's `enable_thinking` setting and recommends temperature 1.0 and top_p 0.95 for text sampling. The catalog snippet enables reasoning by default, but it does not require reasoning for every evaluation.[S10]

### Recommendation for the project

[inference · J2] The NVIDIA preset can use the documented `reasoning_effort: none`, non-streaming output, and an explicit budget. The output schema should describe the structure the evaluation actually needs. Check results through JSON parsing and assertions rather than assuming the model always follows the format.

[inference] Do not unconditionally inherit these model-specific parameters when overriding the model. Changing only the model ID does not establish that the same reasoning field or JSON schema mechanism applies. Declare the preset's supported model or allow explicit parameter configuration.

### Relation to existing constraints

The framework should read `NVIDIA_API_KEY` without requiring the user to copy the credential into another variable. Cloud and local shells may configure it differently; the runner reads the process environment consistently.

## 3. Trial and verification boundaries

### Evidence

[official] NVIDIA's API Trial Terms limit the service to restricted trials, internal testing, and evaluation. Restrictions may concern time, request counts, or credits; prerelease services may change or end. The terms do not give this project a fixed, guaranteed free quota.[S11]

### Recommendation for the project

[inference · J3] Describe it as a free trial endpoint offered by the catalog on the research date, with account quota and access limitations. Use synthetic test cases rather than automatically reading and uploading real user profiles. Real results should identify the model ID, parameters, and run date; they must remain separate from fixture smoke results.

### Relation to existing constraints

Report connectivity, semantic model effectiveness, and long-term availability separately. This research does not replace a small authenticated connectivity check and case evaluation.

## Judgment confidence

J1, J2, and J4 are medium, 3.0: Owner 1, Research 1, Reasoning 0.5, Project history 0.5. J3 is high, 3.5: Owner 1, Research 1, Reasoning 1, Project history 0.5. Scores record support for the recommendations, not probabilities of model reliability.

## Not verified

- No real NVIDIA endpoint was called. Account permissions, quotas, latency, and case pass rates were not verified.
- Super 3.5 was not shown to suit this repository better than other available models. It is an initial choice based on catalog availability and API documentation.
- Other models' reasoning-disable parameters or JSON schema support were not verified.
- API catalogs change. Recheck them before changing the default model.

## Decisions for the owner

No decision is required now. After configuring a key, the user can explicitly run a small set of synthetic cases. Purchasing a service is not required.

## Sources

- [S1 — Super 3.5 Build page](https://build.nvidia.com/nvidia/nemotron-3.5-super-vl-120b-a12b): catalog availability, model ID, API base, and early-access status.
- [S2 — Super 3.5 POST schema](https://docs.api.nvidia.com/nim/reference/nvidia-nemotron-3_5-super-vl-120b-a12b-infer): hosted endpoint, reasoning_effort, response_format, and stream.
- [S3 — Lightning 3.5 Build page](https://build.nvidia.com/nvidia/nemotron-3.5-lightning-30b-a3b): Free Endpoint Available on the research date.
- [S4 — Lightning 3.5 model card](https://docs.api.nvidia.com/nim/reference/nvidia-nemotron-3-5-lightning-30b-a3b): workload positioning and sampling recommendations.
- [S5 — Qwen3.5-397B Build page](https://build.nvidia.com/qwen/qwen3.5-397b-a17b): deprecated free endpoint.
- [S6 — Nemotron3 Super Build page](https://build.nvidia.com/nvidia/nemotron-3-super-120b-a12b): deprecated free endpoint.
- [S7 — Old Kimi K2.5 entry point](https://build.nvidia.com/moonshotai/kimi-k2.5): redirected to K2.6 on the research date.
- [S8 — Kimi K3 Build page](https://build.nvidia.com/moonshotai/kimi-k3): deprecated free endpoint.
- [S9 — DeepSeek V4 Pro entry point](https://build.nvidia.com/deepseek-ai/deepseek-v4-pro): redirected to Pro0813, with a deprecated free endpoint.
- [S10 — Super 3.5 model card](https://docs.api.nvidia.com/nim/reference/nvidia-nemotron-3_5-super-vl-120b-a12b): reasoning configuration and sampling recommendations.
- [S11 — NVIDIA API Trial Terms](https://assets.ngc.nvidia.com/products/api-catalog/legal/NVIDIA%20API%20Trial%20Terms%20of%20Service.pdf): targeted reading of trial, usage-limit, and prerelease clauses.
