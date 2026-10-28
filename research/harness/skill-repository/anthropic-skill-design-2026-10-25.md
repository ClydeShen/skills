# Research: Anthropic's skill design philosophy and model collaboration

Date: 2026-10-25. Question: How does Anthropic use existing model capabilities, set degrees of freedom, and create effective skills through human-AI feedback? Context: the owner has accepted Matt Pocock's design direction and requested a project philosophy informed by representative organizations' first-party practices.

Conclusion: [inference] Anthropic's most useful contribution is to identify whether a skill adds capability or encodes preference, then allocate freedom according to task variability and error cost. Check the gain through actual artifacts, execution traces, and a no-skill baseline. This complements Matt's pruning discipline without requiring every skill to be extremely short, fully autonomous, or subject to a complete evaluation process on every use.

Evidence markers: `[official]` means first-party engineering guidance, product documentation, or source code was read; `[measured]` means a tool observation in this investigation; `[inference]` means project synthesis. Vendor descriptions of model understanding are engineering judgments, not established psychological mechanisms or universal experimental laws. This investigation did not execute external skills or modify the Meta Thinking candidate.

## Overview

| Question | Recommendation | Evidence and limits | Judgment |
| --- | --- | --- | --- |
| What does the skill add? | Distinguish capability gaps from user workflow preferences | An explicit official distinction; task-specific verification remains necessary | J1, medium |
| How detailed should instructions be? | Adjust freedom to variability, fragility, and error consequences | Official authoring guidance agrees with the source implementation | J2, medium |
| How can the model understand the task? | Give necessary reasons and representative examples, without enumerating every situation | Official engineering guidance; effects depend on the model | J3, medium |
| How can useful simplification be identified? | Compare artifacts and traces, including quality, cost, and triggering | An inspectable evaluation implementation, not run in this project | J4, medium |
| What should humans contribute? | Decide intent and preferences and assess artifacts; the model investigates and executes | Current skill-creator explicitly supports two-way collaboration | J5, medium |

## 1. Reading scope and version

[measured] The inspected `main` of `anthropics/skills` was `dbd4588f9e1033efb41dad4bef2f7947c8993d44`, committed at 2026-10-09T18:45:49Z. The complete `skills/skill-creator/SKILL.md` and `agents/grader.md`, `agents/comparator.md`, and `agents/analyzer.md` were read at that version.[S1–S5]

[official] Additional reading covered the concision, freedom, and cross-model testing sections of the official authoring best practices; context selection, abstraction, and examples in context engineering; architecture choices, feedback, and human participation in Building effective agents; the Agent Skills launch article; and the skill-creator update dated 2026-03-03.[S6–S10]

[inference] These sources have different roles: authoring guides advise, source code defines a tool's behavior, engineering articles describe experience, and product articles report internal observations. Their shared Anthropic origin does not make them a single set of proven universal rules. The inspected source includes more complete evaluation tools than early introductions; capability claims must be tied to the relevant version.

## 2. Identify capability gains and user preferences first

### Evidence

[official] Anthropic distinguishes two uses: filling gaps in what the base model can do or do consistently, and arranging capabilities the model already has into a user or team's desired workflow. The first may become unnecessary as models improve; the second is valuable only insofar as it faithfully represents the actual workflow.[S10]

[official] `skill-creator` first extracts intent, actions, user corrections, and inputs and outputs from the existing conversation, then asks for missing information. It can enter creation or evaluation according to the user's progress and allows lightweight exploration instead of imposing the full process.[S2]

### Recommendation for the project

[inference · J1] Each candidate should explain which behavior compensates for a model's default limitations and which expresses an explicit user preference. The model's ability to perform an action does not make the preference redundant. Instructions that compensate for older model limitations should, however, be retested periodically.

[inference] Meta Thinking's ability to identify an assumption worth changing and produce an effective action is an unverified capability gain. Infrequent intervention, low burden, and lazy memory maintenance are confirmed user constraints. Evaluate these separately rather than relying on one aggregate score.

### Relation to existing constraints

This agrees with the [current knowledge guide](../../../knowledge/meta-thinking/meta-thinking-guidance.md), which distinguishes confirmed direction, research support, and synthesis. It requires no new terminology or change to the owner's direction.

## 3. Let task properties determine constraint strength

### Evidence

[official] The authoring guide assumes Claude already has broad knowledge and recommends adding only missing context. It adjusts freedom to task fragility and variability: principles when several approaches are valid, configurable procedures when a stable pattern is useful, and exact scripts or steps when errors are costly or order matters. It requires testing on intended models; the amount of guidance suitable for a stronger model may not suit a weaker one.[S6]

[official] Context engineering places useful prompts between two extremes: detailed branching logic can be brittle, while broad goals provide too little direction. It recommends starting with minimal but sufficient information, then adding instructions or representative examples in response to observed failures. Minimal does not mean shortest.[S7]

[official] Current `skill-creator` encourages explaining why requirements matter instead of patching generalization problems with forceful wording. The same source still imposes strict requirements on output presentation, paths, and execution order. It does not classify all explicit requirements as bad design.[S2]

### Recommendation for the project

[inference · J2–J3] For judgment tasks, state goals, evidence, and trade-offs. At boundaries such as damaged data, unauthorized actions, and fixed protocols, retain precise constraints. Do not make an entire skill uniformly strict or uniformly permissive.

[inference] A useful reason helps the model choose in unlisted situations. Explaining that current statements take precedence over a profile because the profile contains older, contextual inferences may transfer better than enumerating many possible user corrections. A reason that merely repeats the action should still be pruned.

### Relation to existing constraints

This is compatible with package-local resources, data integrity, and permission rules. Reducing instruction load does not authorize removing the preservation rule for a damaged profile, nor does it require explaining every sentence.

## 4. Author through iteration with the user, model, and environment

### Evidence

[official] `skill-creator` places quantitative checks alongside user judgment of actual artifacts. It calls for understanding intent, using realistic tasks, presenting outputs, and receiving feedback. Subjective quality should not be forced into mechanical assertions. Improvements should generalize from a few cases rather than patch only those cases.[S2]

[official] It requires reading execution traces for unproductive actions. When different tasks repeatedly generate similar helper scripts, it suggests bundling the script. The Agent Skills launch article likewise assigns suitable deterministic computation to code while retaining model judgment about tasks and context.[S2][S9]

[official] Building effective agents recommends starting simply and adding orchestration only when results justify its cost. Once the task is clear, an agent can execute independently, inspect progress through tools and execution results, and return to the user for missing information or judgment. Iterative improvement requires clear evaluation criteria and useful feedback.[S8]

### Recommendation for the project

[inference · J5] Users primarily provide goals, preferences, and choices that cannot be looked up, and assess whether the result solves their problem. Agents should investigate available facts and carry out authorized work. Co-creation should not become a question at every step; confidence in model ability should not become permission to decide the user's values.

[inference] Skill creation may require research, comparisons, and detailed retrospectives while the installed skill remains lightweight. Putting the author's full quality process into every execution converts development cost into recurring user burden.

### Relation to existing constraints

This follows the project's separation of research, knowledge, incubation, and trials, and Meta Thinking's goal of returning to the task once progress resumes.

## 5. Evaluate task completion and the evaluator

### Evidence

[official] The current implementation compares new skills with a no-skill baseline and can compare revisions with an older version. It records time and tokens and calls for examining high variance, non-discriminating assertions, and cost changes hidden by averages.[S2][S5]

[official] The grader inspects traces and actual files: a claim of generation is not evidence that a file exists, and existence is not evidence of correct contents. It must flag assertions that wrong artifacts could pass and important outcomes that are untested. The comparator assesses artifacts without knowing version identity, prioritizing task completion quality over the number of mechanical assertions passed.[S3][S4]

[official] Trigger testing is separate from artifact testing. `skill-creator` uses realistic positive and negative requests, especially confusing near misses. Its recommendation for more assertive descriptions addresses observed undertriggering in the product; it is not a universal recommendation to broaden every skill's scope.[S2]

### Recommendation for the project

[inference · J4] Retain the current decision smoke tests and add review of the actual C3 intervention and C6 artifact. Compare value with and without the skill, including added time and questions. Productive exploration and smoothly progressing tasks are important negative cases.

[inference] Check triggering, execution quality, and real host capabilities separately. Tune Meta Thinking's description according to observed costs of missed and false triggers rather than copying a vendor's recommendation for more aggressive triggering. Model grading can be a useful sensor, but requires calibration and is not an authority on correctness.

### Relation to existing constraints

Preserve the distinction between fixtures, model outputs, and host integration in the [local evaluation guide](../../../docs/prompt-evaluation.md). This investigation added or ran no paid model experiments.

## 6. Synthesis with Matt and retained differences

| Topic | Shared direction | Project choice |
| --- | --- | --- |
| Concision | Trust existing model knowledge and remove content without added value | Judge necessity through behavior comparisons; retain essential constraints |
| Generalization | Extract transferable mechanisms from cases instead of accumulating exceptions | Test the same problem structure in different domains |
| Completion | Use observable completion conditions | Meta Thinking stops when it can advance the next step; do not copy exhaustive interviewing |
| Explanation | Matt emphasizes compression and familiar concepts; Anthropic emphasizes useful reasons | Keep reasons that change contextual judgment; remove background teaching and restatement |
| Evaluation | Revise through real usage and feedback | Use lightweight comparisons and expand with risk; do not require a large benchmark for every skill |
| Initiative | Discovery and selection affect usage cost | Preserve confirmed infrequent intervention and test explicit and natural activation separately |

[inference] Matt contributes strong editing discipline; Anthropic adds capability hypotheses, freedom allocation, and feedback experiments. Together they support using as little instruction as is sufficient to change behavior reliably. They do not establish one optimal writing style for every model.

## Judgment confidence

J1–J5 are medium, 3.0: Owner 1 (the owner explicitly requested this direction); Research 0.5 (official source and engineering guidance, without project-specific effectiveness measurements); Reasoning 1 (the recommendations can become behavioral comparisons); Project history 0.5 (compatible constraints and cases exist, but real behavior remains unverified). These scores record support, not success probabilities.

## Not verified

- Anthropic's skill-creator, blind comparison, and description optimization scripts were not run; source availability does not establish executability in this environment.
- Reported triggering or PDF improvements were not independently reproduced.
- The vendor's mechanism-level explanations of intent understanding, reasons, and contextual attention were not fully verified.
- Transfer across Claude, other models, and hosts was not tested.
- The description-optimization instructions repeatedly use a split test set to select versions. The scripts were not audited in this investigation, so the final score cannot be treated as a fully independent generalization estimate. A rigorous comparison should retain final tasks that did not participate in selection.

## Decisions for the owner

No further decision is required for this investigation. The authorized synthesis can use these design judgments while retaining model- and context-dependent effectiveness hypotheses. Candidate revisions and behavioral verification belong to the incubator initiative.

## Sources

- [S1 — Pinned commit](https://github.com/anthropics/skills/commit/dbd4588f9e1033efb41dad4bef2f7947c8993d44): version and commit time.
- [S2 — skill-creator](https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/skill-creator/SKILL.md): full body, including intent capture, writing, improvement, evaluation, and host-specific branches.
- [S3 — grader](https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/skill-creator/agents/grader.md): full text, especially artifact evidence and weak assertions.
- [S4 — comparator](https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/skill-creator/agents/comparator.md): full text on blind artifact and task-quality comparison.
- [S5 — analyzer](https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/skill-creator/agents/analyzer.md): full text on traces, variance, cost, and discrimination.
- [S6 — Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices): Core principles, including concision, freedom, and target-model testing.
- [S7 — Effective context engineering for AI agents](https://www.anthropic.com/research/effective-context-engineering-for-ai-agents): context, abstraction, examples, and on-demand retrieval sections.
- [S8 — Building effective agents](https://www.anthropic.com/research/building-effective-agents): simplicity, workflows and dynamic agents, environmental feedback, human judgment, and tool interfaces; the article notes changes in the tooling landscape.
- [S9 — Equipping agents for the real world with Agent Skills](https://www.anthropic.com/research/equipping-agents-for-the-real-world-with-agent-skills): capability composition, script execution, development, and evaluation sections.
- [S10 — Improving skill-creator](https://claude.com/resources/articles/improving-skill-creator-test-measure-and-refine-agent-skills): official 2026-03-03 discussion of capability gains and preferences, evaluation, model upgrades, and triggering.
