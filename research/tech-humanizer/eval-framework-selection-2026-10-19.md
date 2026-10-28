# Research: Local evaluation framework for tech-humanizer

Date: 2026-10-19. Subject: Select a current, popular framework for evaluations that run locally and may call model APIs. Context: `tech-humanizer` needs evidence for prose quality, terminology preservation, and learning user preferences across writing contexts.

Use Promptfoo as the evaluation runner. It has the most GitHub stars among the four candidates checked and provides a current guide for testing actual Agent Skills with agent SDKs. Start with deterministic checks and explicit quality rubrics; verify profile persistence separately through an agent with a real filesystem. This is a recommendation, not a completed evaluation. [inference]

Confidence markers: **[official]** means primary documentation was read; **[measured]** means a first-party API or registry was queried on the date above; **[inference]** means a project recommendation derived from that evidence.

## Overview

| Question | Recommendation | Strength of evidence | Confidence |
|---|---|---|---|
| Which runner best fits this skill? | Promptfoo: local CLI, configurable assertions, and documented agent-skill comparisons. | Strong capability evidence; fit is a judgment. | [official], [inference] |
| Which candidate is most popular? | Promptfoo leads these four by GitHub stars. Treat stars as interest, not usage or quality. | Strong for this limited metric. | [measured], [inference] |
| Does a prose test verify self-improvement? | Test profile decisions with fixtures, then test actual writes and later-session reuse with an agent SDK. | Strong distinction between model outputs and filesystem effects. | [official], [inference] |

## 1. Current candidates

### Evidence

The GitHub repository APIs and package registries returned the following snapshot. Dates are UTC. Registry versions describe the main evaluation package; a GitHub repository's latest release can belong to a separate component. [measured]

| Framework | GitHub stars | Repository last push | Current package | Project fit |
|---|---:|---|---|---|
| Promptfoo | 26,127 | 2026-10-19 | npm `promptfoo` 0.124.1 | Local configuration, comparison UI, deterministic and model graders, agent SDK providers. |
| DeepEval | 18,942 | 2026-10-16 | PyPI `deepeval` 4.3.1; uploaded 2026-10-16 | Python test suites and trace-based component or agent evaluation. |
| Ragas | 16,068 | 2026-02-24 | PyPI `ragas` 0.4.3; uploaded 2026-01-13 | Prompt, RAG, workflow, and agent evaluation; useful when retrieval metrics are central. |
| Inspect AI | 3,041 | 2026-10-17 | PyPI `inspect-ai` 0.3.281; uploaded 2026-10-15 | Python tasks, datasets, solvers, scorers, tool-using agents, and sandbox execution. |

The first four columns are measured. The fit descriptions summarize the official guides listed below. Ragas moved from `explodinggradients/ragas` to `vibrantlabsai/ragas`; the API redirect was followed. [measured], [official]

DeepEval's agent quickstart instruments an agent with traces and runs evaluation through its test CLI; cloud login is optional. Inspect's introduction demonstrates a tool-using agent in a Docker sandbox and local result inspection. Ragas documents applications beyond RAG, including prompts, workflows, and agents. These are viable candidates, not disqualified by their specialization. [official]

### Recommendation for the project

Select Promptfoo for its direct skill-testing support and accessible comparison workflow. DeepEval is the closest alternative if the repository adopts Python and pytest as its main development workflow. Inspect is a good alternative when custom agent environments become the primary evaluation problem. Ragas is less directly matched to the current prose-editing requirements. [inference]

Confidence: medium, 3.0/4 (owner 1.0, research 1.0, reasoning 0.8, project history 0.2). The owner specified local execution with API models permitted; the framework's behavior has not yet been exercised in this repository. [inference]

### Relation to existing constraints

The runner belongs to repository development tooling. Runtime references needed by the released skill remain inside its package. The evaluation should consume the current package so it detects instruction changes. [inference]

## 2. Actual skill execution and state

### Evidence

Promptfoo's official skill-testing guide compares versions by changing the skill in separate fixture directories while holding the model and task constant. It supports Claude Agent SDK, OpenAI Codex SDK, and OpenCode SDK providers. It documents assertions for skill use, output quality, cost, and latency. [official]

Skill-use evidence differs by provider. Claude and OpenCode expose skill tool calls. Codex skill detection is a heuristic based on successful direct reads of the matching `SKILL.md`, requiring streaming evidence. This signal establishes file access, not complete instruction adherence. [official], [inference]

The Codex provider documents only partial multi-turn persistence: `persist_threads` pools threads by prompt template and configuration rather than rendered variable values. `deep_tracing` disables persistence. A shared persistence setting therefore needs deliberate scenario isolation. [official]

Promptfoo also supports JavaScript assertions and model-graded rubrics. A rubric can judge prose against a supplied source, writing context, and user preferences. A JavaScript assertion can check exact protected strings or inspect structured results. Neither proves that a real profile file was written unless the evaluated execution provides that evidence. [official], [inference]

### Recommendation for the project

Use three distinct evidence levels:

1. Local checks: validate fixtures, exact terminology, facts represented as protected strings, and rubric rejection examples.
2. Model behavior: evaluate the current skill instructions against source prose, contextual preferences, corrections, and profile-state examples. Score AI-style removal, natural wording, fidelity, and contextual fit independently.
3. Agent behavior: install the complete package in an isolated temporary workspace. Run preference learning, inspect the saved profile, start a fresh session, and verify that a later rewrite uses the saved preference in the appropriate context.

Keep deterministic conditions separate from judgments about natural prose. Supply the original text and relevant preferences to each judge. Include plausible bad outputs to establish that the graders reject terminology damage, generic flattening of voice, context leakage, and unsupported profile updates. [inference]

For stateful scenarios, give each case a separate workspace and session lifecycle. Test corrections and context-specific preferences across business documents, technical documents, email, and messages. The ASD-STE100 branch needs explicit mode-selection and output checks. [inference]

Confidence: medium, 3.0/4 (owner 1.0, research 1.0, reasoning 0.8, project history 0.2). This design follows documented capabilities but still needs an actual run against the selected API model and agent runtime. [inference]

### Relation to existing constraints

A local framework check can pass without a model call. Report it as infrastructure verification. Report model and agent outcomes only after their respective runs finish. This keeps the repository's distinction between logic-done and live-done visible. [inference]

## Implementation follow-up, 2026-10-19

The local suite now lives in [incubator/tech-humanizer/evals](../../incubator/tech-humanizer/evals/README.md). Promptfoo 0.124.1 is pinned with a lockfile. Its configuration and six harness checks passed with Node.js 24.22.0. The suite loads the current skill sources and defines 20 synthetic behavior cases with deterministic and model-graded assertions. [measured]

This supersedes the framework-execution uncertainty below for installation and configuration only. No API-model quality evaluation or real-agent persistence evaluation has run. The current process has no configured target, grader, or model API credentials. [measured]

## Not verified

- Global adoption, download-adjusted popularity, or market share. GitHub stars rank only the four repositories sampled.
- Promptfoo 0.124.1 execution in this repository, API-model results, or compatibility of every documented agent-provider feature with that package version.
- End-to-end profile writes and reuse across fresh agent sessions.
- Whether any candidate's built-in style metric agrees with this user's writing preferences. Project examples must establish that agreement.

## Decisions for the owner

None required for this framework recommendation. Model choice and run budget can be configured when the evaluation is executed.

## Sources

- [Promptfoo skill-testing guide](https://www.promptfoo.dev/docs/guides/test-agent-skills/): actual skill fixtures, SDK providers, invocation evidence, comparisons, and repeat runs.
- [Promptfoo Codex SDK provider](https://www.promptfoo.dev/docs/providers/openai-codex-sdk/): capability boundaries and thread-persistence behavior.
- [Promptfoo Claude Agent SDK provider](https://www.promptfoo.dev/docs/providers/claude-agent-sdk/): agent provider configuration.
- [Promptfoo JavaScript assertions](https://www.promptfoo.dev/docs/configuration/expected-outputs/javascript/): custom deterministic grading.
- [Promptfoo model-graded assertions](https://www.promptfoo.dev/docs/configuration/expected-outputs/model-graded/): rubric and trajectory grading.
- [DeepEval agent quickstart](https://deepeval.com/docs/getting-started-agents): local tests, optional cloud login, and trace-based evaluation.
- [Ragas getting started](https://docs.ragas.io/en/stable/getstarted/index.html): prompt, RAG, workflow, and agent evaluation paths.
- [Inspect introduction](https://inspect.aisi.org.uk/): task composition, tool-using agents, sandboxing, and local logs.
- [Promptfoo GitHub API](https://api.github.com/repos/promptfoo/promptfoo), [DeepEval GitHub API](https://api.github.com/repos/confident-ai/deepeval), [Ragas GitHub API](https://api.github.com/repos/vibrantlabsai/ragas), [Inspect GitHub API](https://api.github.com/repos/UKGovernmentBEIS/inspect_ai): measured stars and last-push times.
- [Promptfoo npm registry](https://registry.npmjs.org/promptfoo/latest), [DeepEval PyPI registry](https://pypi.org/pypi/deepeval/json), [Ragas PyPI registry](https://pypi.org/pypi/ragas/json), [Inspect PyPI registry](https://pypi.org/pypi/inspect-ai/json): measured current package versions and Python package upload dates.
