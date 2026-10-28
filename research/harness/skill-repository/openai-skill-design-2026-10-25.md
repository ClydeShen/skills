# Research: OpenAI skill design, model changes, and human–agent responsibilities

Date: 2026-10-25. Question: How do OpenAI's public skills and guidance address model capability, behavioral constraints, user intent, and verification, and what should this project adopt? Context: The user endorsed Matt Pocock's design philosophy and requested a synthesis of other representative sources to establish this project's skill design principles.

Conclusion: [inference] OpenAI's direction is compatible with Matt's emphasis on pruning. It makes preserving user intent, matching constraints to actual risk, and revisiting scaffolding as models change more explicit. The useful pattern is non-obvious guidance, necessary boundaries, and observable feedback—not treating every step in an official skill as a universal requirement. This research did not execute the external skills or verify their effect on Meta Thinking.

Evidence markers: `[official]` means the relevant official repository or documentation text was read; `[measured]` means version information returned by an API during the original research; `[inference]` means this project's interpretation. Vendor judgments about models are first-party guidance, not experimental findings reproduced here.

Translation and source recheck: 2026-10-25. The pinned Codex sample, both commit pages, and the model-migration article were reopened. The recorded versions remain the original research snapshots, not a newly established latest-version claim. A fresh branch-head API check was unavailable through the browser and the shell proxy. No external skill or model was run.

## Overview

| Question | Useful direction | Evidence and limits | Judgment |
| --- | --- | --- | --- |
| Should instructions teach what the model already knows? | Include information that changes decisions or artifacts | Explicit in the current skill-creator; redundancy must be observed for the target model | J1, medium |
| Strict steps or goals? | Outcomes and criteria for open tasks; deterministic steps for fragile operations | The guidance distinguishes by risk rather than choosing one approach universally | J2, medium |
| How is human control preserved? | Preserve expressed intent and scope; ask when an important decision is genuinely missing | Automatic discovery does not grant execution permission | J3, medium |
| How can usefulness be assessed? | Inspect execution, artifacts, and efficiency; retain negative trigger cases | Official behavioral evaluation guidance exists; it was not executed here | J4, medium |

## 1. Reading scope and version differences

### Evidence

[measured] During the original research, `openai/skills` main resolved to commit `49f948faa9258a0c61caceaf225e179651397431`, dated 2026-06-24. Reading covered the core principles of `.system/skill-creator` and the complete main instructions of three representative packages: `define-goal`, `pdf`, and `gh-fix-ci`.[S1][S2][S6][S7][S8]

[measured] `openai/codex` main resolved to commit `970111f6cb62cc02fe36a82ea7d71b37a2889c97`, dated 2026-10-23. The complete `codex-rs/skills/src/assets/samples/skill-creator/SKILL.md` in that tree was read. It includes more guidance on scope, overconstraint, and behavioral verification than the other repository's version. They must not be treated as the same version.[S3][S4]

[official] The official article dated 2026-09-11 addresses obsolete skill and prompt scaffolding for stronger models. The evaluation article dated 2026-01-22 addresses actual execution records and artifacts. Both article bodies and the principles in Build skills were read.[S5][S9][S10]

### Recommendation for the project

[inference] Record the source, model context, and version when adopting an external method. An older catalog example, the current skill-creator, and model-migration guidance may reflect different stages. Shared OpenAI authorship does not establish that all their rules agree.

### Relation to existing constraints

This follows the [document formats](../../../docs/DOCUMENT-FORMATS.md) requirements for evidence, target versions, and unverified conclusions. This note does not update installed development dependencies.

## 2. Assume model capability and supply incremental value

### Evidence

[official] The earlier `openai/skills` skill-creator already assumes model capability and requires instructions to justify their context cost. Specificity should vary with task fragility and the range of valid approaches.[S2]

[official] The current Codex sample requires retaining only information that changes decisions or improves work. It calls for removing generic advice, repeated instructions, speculative edge cases, and examples that do not clarify the task. Open tasks should describe outcomes and decision criteria. Fixed sequences, scripts, or absolute language belong where a concrete operational risk requires them. Necessary non-obvious constraints still need to remain.[S4]

[official] The Astra migration article warns that elaborate itineraries, repeated encouragement to test, and broad approval requirements needed by older models can cause newer models to overtest or stop prematurely. Contributors may use different models in the same repository, so assumptions need rechecking. Overbroad descriptions can also route ordinary adjacent tasks into specialized workflows.[S5]

### Recommendation for the project

[inference · J1–J2] Identify the knowledge or judgment gap each skill addresses. Preserve purpose, key constraints, available evidence, and completion conditions. Let the model choose noncritical operational details. Trust in capability does not justify removing authorization or data-protection boundaries, and one new model's default capability cannot be assumed for all models.

[inference] After a model upgrade, use representative tasks to check the contribution of existing instructions, then remove parts covered by stable default capability. Before turning a failure into a permanent rule, distinguish instruction, model, tool, environment, and task-clarity causes.

### Relation to existing constraints

This is compatible with behavioral pruning in the [Matt research](./pocock-skill-design-2026-10-25.md). Meta Thinking should preserve evidence-based checks of changes without assuming every task needs a complete abstract process, several roles, or the same number of questions.

## 3. Organize collaboration around intent and actual decisions

### Evidence

[official] The current Codex skill-creator requires preserving user choices and task scope. A single example, personal preference, or past failure must not become a universal requirement. Clarification is for important missing information that cannot reasonably be inferred; an already clear task does not need extra examples from the user. Execution permissions and scope remain separate constraints.[S4]

[official] The current sample preserves automatic discovery by default and switches to explicit invocation only when the user requests it. It distinguishes discoverability from permission to perform an action, rather than hiding every skill involving sensitive work. This is a Codex product convention, not a universal host specification.[S4]

[official] `define-goal` expresses goals through outcomes, evidence, boundaries, and stopping conditions. Ordinary implementation requests proceed without forced goal creation. Quantification should represent real success rather than decorative numbers. Questions are warranted when misunderstanding the outcome poses a real risk.[S6]

### Recommendation for the project

[inference · J3] Use human input for goals, preferences, trade-offs, and authorization that the environment cannot supply. Investigate missing facts. When a choice needs feedback, make an authorized reversible attempt. For task clarification, ask only when the answer changes action and cannot reasonably be obtained otherwise. Preserving user control does not mean requesting confirmation at every step.

[inference] Matt's preference for manual orchestration and Codex's automatic-discovery default cannot simply be combined. Decide separately which events can trigger a skill, which actions need permission, and how the user can stop or correct it. Meta Thinking already supports explicit requests and infrequent natural activation; this research does not justify converting everything to explicit invocation.

### Relation to existing constraints

Preserve the infrequent, low-burden direction of the [Meta Thinking guidance](../../../knowledge/meta-thinking/meta-thinking-guidance.md). Current user intent takes precedence over an old profile. Intervention must not replace the user's actual task.

## 4. Provide real feedback, not only more instructions

### Evidence

[official] `pdf` requires rendering pages for visual inspection when layout matters. Text extraction cannot replace layout verification. Its value is that the agent observes what the user will see, rather than only checking whether generated code or text exists.[S7]

[official] `gh-fix-ci` connects log collection and failure excerpts to subsequent fixes, using scripts for repetitive API and field-compatibility work. That pinned version also includes local workflow requirements such as mandatory plan approval. This does not establish that every repair task needs the same human checkpoint.[S8]

[official] The current sample uses scripts when repeated logic or deterministic execution materially improves reliability. It recommends independent forward-testing for complex or risky cases when authorized. The evaluator receives the real request, the skill, and necessary raw materials—not the expected answer, suspected bug, or proposed fix in advance.[S4]

[official] The official evaluation article separates outcome, process, style, and efficiency checks, using traces and artifacts for comparison. It recommends small targeted cases covering explicit requests, natural activation, noisy context, and negative controls. Deterministic checks and quality rubrics answer different questions. Verification deepens incrementally instead of starting with a large benchmark.[S9]

### Recommendation for the project

[inference · J4] Give the skill a feedback path that can correct errors: execution for code, rendering for documents, user responses and subsequent progress for interaction, and concrete artifacts against goals for design. Logs establish what happened, not whether it was good. Model grading also needs explicit criteria and calibration through human spot checks.

[inference] Meta Thinking's JSON strategy fields can remain smoke checks, but actual action quality and user burden require separate observation. Profile writes, natural activation, and cross-session retrieval need real host evidence; a model's stated intention cannot substitute for it.

### Relation to existing constraints

This follows the fixture, model, and host-integration boundaries in the [local evaluation documentation](../../../docs/prompt-evaluation.md). This research does not authorize paid model calls or experiments with real user profiles.

## 5. Synthesis with Matt's philosophy

| Topic | Shared principle | Difference to preserve |
| --- | --- | --- |
| Concision | Remove information that does not change behavior; protect task context | Fixed word counts do not define quality; necessary boundaries remain |
| Abstraction | Retain reusable relationships; remove incidental details from one example | Capability and defaults depend on the model rather than remaining constant |
| Control | People decide goals and important trade-offs; agents provide evidence and action | Manual orchestration is not the only design; automatic discovery is not authorization |
| Constraints | Clear outcomes and boundaries make behavior more predictable | Open exploration should not inherit fixed sequences from fragile operations |
| Verification | Improve through real use and inspect instructions' behavioral contribution | OpenAI supplies trace/artifact evaluation methods; an author's manual experience is not automatic proof of quality |

[inference] The project can synthesize these ideas as follows: provide the minimum guidance sufficient to improve decisions, preserve the freedom needed to complete the task, test results against real evidence, and match interaction cost to task needs. This is a cross-source project recommendation, not an OpenAI quotation or a completed effectiveness evaluation.

## Judgment confidence

J1–J4 are medium, 3.0: Owner 1 (the user explicitly requested research and design principles); Research 0.5 (official source and guidance, without project-specific comparisons); Reasoning 1 (recommendations can become behavioral checks); Project history 0.5 (candidates and cases exist, but no real effectiveness results for this synthesis). Scores describe support for the recommendations, not success probabilities.

## Not verified

- External skills were not run; official claims about models, triggering, and efficiency were not reproduced.
- This does not establish that fewer instructions are always better, or that one vendor's capability judgments apply to other models.
- The entire OpenAI skill catalog was not reviewed. Selected examples illustrate mechanisms, not catalog-wide quality.
- Portability of scripts, tools, installation paths, and permissions to this project's target hosts was not tested.
- Meta Thinking, evaluators, and installed development skills were not changed. This note creates no execution permissions.

## Decisions for the owner

No new product choice must be resolved before proceeding. Preserve the existing low-frequency Meta Thinking goal in the synthesis. Specific candidate changes should still follow task needs and behavioral evidence.

## Sources

- [S1 — Pinned openai/skills commit](https://github.com/openai/skills/commit/49f948faa9258a0c61caceaf225e179651397431): the original research checked the main SHA and date through the API.
- [S2 — openai/skills skill-creator](https://github.com/openai/skills/blob/49f948faa9258a0c61caceaf225e179651397431/skills/.system/skill-creator/SKILL.md): core principles, degrees of freedom, and resource purposes; not the same version as the current Codex sample.
- [S3 — Pinned openai/codex commit](https://github.com/openai/codex/commit/970111f6cb62cc02fe36a82ea7d71b37a2889c97): the original research checked the main SHA and date through the API.
- [S4 — Current Codex skill-creator sample](https://github.com/openai/codex/blob/970111f6cb62cc02fe36a82ea7d71b37a2889c97/codex-rs/skills/src/assets/samples/skill-creator/SKILL.md): the complete instructions on incremental guidance, intent, scope, risk, and behavioral testing were read.
- [S5 — Rethinking skills and prompts for GPT-6 Astra](https://learn.chatgpt.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra): the 2026-09-11 article body on model migration, broad triggering, excessive scaffolding, and completion boundaries was read.
- [S6 — define-goal](https://github.com/openai/skills/blob/49f948faa9258a0c61caceaf225e179651397431/skills/.curated/define-goal/SKILL.md): complete main instructions on verifiable outcomes, ordinary-task exclusions, and clarification conditions.
- [S7 — pdf](https://github.com/openai/skills/blob/49f948faa9258a0c61caceaf225e179651397431/skills/.curated/pdf/SKILL.md): complete main instructions on rendering feedback and visual checks.
- [S8 — gh-fix-ci](https://github.com/openai/skills/blob/49f948faa9258a0c61caceaf225e179651397431/skills/.curated/gh-fix-ci/SKILL.md): complete main instructions on logs, scripts, and local approval workflow; scripts were not run.
- [S9 — Testing Agent Skills Systematically with Evals](https://developers.openai.com/blog/eval-skills): sections on success criteria, case types, JSONL, rubrics, and incremental verification were read; examples were not executed.
- [S10 — Build skills](https://learn.chatgpt.com/docs/build-skills): best practices on a single task, scripts for deterministic needs, and trigger testing were read.
