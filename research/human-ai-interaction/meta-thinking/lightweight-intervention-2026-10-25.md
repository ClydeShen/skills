# Research: Triggers, goal exploration, and complexity in low-frequency Meta Thinking

Date: 2026-10-25. Question: With the newly specified use cases, how can substantial help coexist with few steps and low burden? Context: after the original draft and initial investigation, the user further clarified the intended use. This record preserves those requirements and investigates them through targeted research.

Conclusion: [inference] A lightweight intervention worth testing is to identify a concrete obstacle, change one important condition, and observe whether progress follows. Distinguish preference formation from unproductive repetition, and examine user goals, agent behavior, and environmental constraints together. These were research recommendations only; this investigation implemented no skill, monitoring, or user-profile functionality.

Evidence markers follow the [research template](../../../knowledge/harness/templates/research-note-template.md). `[official]` means relevant first-party source text was read, not that effectiveness for this project was established. `[inference]` means project-specific reasoning. No experiments were reproduced. User requirements and quoted examples below are translated from the original Chinese record.

## Requirements from this conversation

The following came from the user's explicit statements in this conversation on 2026-10-25. They are requirements, not literature findings:

- Use should be infrequent. Activation is usually unnecessary when the user's goal is clear and the interaction is effective.
- Explicit entry points include: "Use metathinking to help me design an agent skill, system prompt, or agentic workflow."
- The agent may identify stalled progress from conversation history, or situations where the user has not yet clarified their own goal.
- Step back to examine the problem and its assumptions, then return to a different way of interacting, helping the user become more effective at a philosophical level.
- Store a structured profile in the user directory, recording thinking patterns, reasons for stalled progress, and breakthrough experiences. Update lazily: consider a write only when an event is worth retaining.
- Keep the skill simple and avoid a large number of operational steps.

These statements narrow the product assumptions behind the general Meta Reasoning Router in the [original draft](./meta-ai-thinking-working-draft-2026-10-25.md). That draft remains available for traceability. Specific formats, paths, and activation thresholds had not been decided.

## Overview

| Question | Finding and candidate direction | Evidence and limits | Judgment |
| --- | --- | --- | --- |
| Does changing one's mind mean going in circles? | Preferences may be forming; check for new trade-offs and understanding | Preference-construction research provides adjacent evidence | J1, medium |
| Is additional reflection necessarily helpful? | Observe effectiveness and user burden together | A specific AI-assisted decision experiment supports a trade-off | J2, medium |
| How can agent design require fewer steps? | Identify the flexibility and feedback the task requires before choosing patterns | First-party engineering guidance, not a controlled experiment | J3, medium |
| How can a skill proactively detect stalled progress? | Activation descriptions must be visible; deeper diagnosis follows activation | The standard explains loading, not activation accuracy | J4, medium |

## 1. User goals may form through interaction

### Evidence

[official] Slovic's The Construction of Preference discusses how preferences vary with elicitation method and context, arguing that some preferences form during their expression. The introduction and discussion of preference-reversal research were read. The original research does not directly establish how best to guide an agent conversation.[S1]

### Recommendation for the project

[inference · J1] Do not diagnose stalled progress solely from a changing goal or the number of revisions. Ask whether the conversation has introduced new constraints, distinguished candidate goals, or clarified trade-offs. A changing goal accompanied by these advances may be normal exploration.

[inference] When a user cannot articulate a goal, offer a few meaningfully different examples and ask what attracts or repels them, then revise the understanding from their feedback. This is a proposal to test, not a best procedure established by S1. Allow goals outside the offered menu; the agent's options must not be treated as the complete choice space.

### Relation to existing constraints

This addresses the entry point where the user does not know what they want, while respecting the requirement for few steps. If preferences are still forming, turning a provisional choice directly into a lasting profile loses its context.

## 2. Effective reflection can still frustrate users

### Evidence

[official] In an AI-assisted decision-making experiment with 199 participants, Buçinca and colleagues found that cognitive forcing reduced overreliance, but the more effective designs received worse subjective ratings. The introduction and study overview were read. This does not mean that all reflection increases burden.[S2]

### Recommendation for the project

[inference · J2] Make "few steps" an observable outcome: how much extra user time was spent, how many questions actually changed the next step, and whether a usable action was found sooner. Shortening the skill text alone does not establish lightweight interaction.

[inference] Start by testing the most important assumption with one brief intervention. For example: "We keep revising the wording, but have we decided who it is for? Let's write one version for each of two audiences and compare." If progress follows, return to the original task. If not, revise the diagnosis; persistence in reflection is not itself success.

[inference] Diagnosis should include repetitive agent answers, misunderstandings, capability limits, and missing tools or evidence. Apparent circling by the user must not automatically be attributed to a flaw in their thinking.

### Relation to existing constraints

This supports infrequent use, stepping back and then returning to action, and avoiding many operational steps. There is no need to promise a fixed level of abstraction for every reflection.

## 3. Task conditions should justify design-pattern choices

### Evidence

[official] Anthropic's engineering article recommends starting with the simplest approach that meets the need. It distinguishes workflows from agents according to whether steps can be predefined or need dynamic adjustment, and emphasizes feedback and evaluation criteria. The complexity guidance, workflow patterns, and feedback passages were read. This is vendor engineering experience, not controlled evidence for this project.[S3]

### Recommendation for the project

[inference · J3] When asked to design a skill or system prompt, derive the design from task conditions: whether the goal is clear, whether the path can be determined in advance, and what feedback indicates progress. Consult relevant patterns and theories when a concrete design difficulty arises.

[inference] For example, when designing a reviewer skill, first identify the errors it should detect and the evidence available. Stable, automatically verifiable criteria can justify explicit checks. Add multiple perspectives or adversarial checks when different explanations need exploration. These examples are design inferences, not validated solutions.

### Relation to existing constraints

This supports a simple main body with deeper material loaded when needed. The coverage of a general pattern catalog was not validated, and no additional orchestration system or multiple agents are required.

## 4. Infrequent loading and automatic activation are different problems

### Evidence

[official] The Agent Skills specification separates loading of names and descriptions, activated instructions, and on-demand resources. The integration guide explains that models judge relevance from a visible catalog and that users can activate skills explicitly. The specification's progressive-disclosure section and the integration guide's activation sections were read.[S4][S5]

### Recommendation for the project

[inference · J4] Signals of stalled progress must appear in a description or host rule visible before activation. Placing "activate when progress stalls" only inside an unloaded body cannot ensure discovery. Keep explicit invocation as a reliable entry point and test natural activation separately.

[inference] A short main body can carry necessary judgments, with pattern knowledge and examples read on demand. An infrequently used skill can be discovered through a continuously available short description. That does not mean it independently monitors activity in the background.

[inference] Persistence across sessions, access across projects, and sharing between cloud and local user directories are host capabilities and deployment choices. Skill text alone cannot guarantee them. This investigation selected no actual profile path and performed no profile writes.

### Relation to existing constraints

This addresses implicit activation, user-level memory, and lightweight interaction. This section verifies mechanisms; it changes no skill installation, publication, or host configuration.

## Minimal next validation

[inference] Start with a few anonymized or synthetic conversations to evaluate these boundaries, without building a complete system:

| Conversation | Desired behavior | Failure signal |
| --- | --- | --- |
| The goal is clear and progress continues | Complete the task normally | Introduce unnecessary reflection |
| The user keeps comparing options and gradually clarifies preferences | Help form trade-offs | Misdiagnose normal exploration as a thinking problem |
| Several turns return to the same obstacle without new information | Offer a testable diagnosis and a different next step | Continue repeating, or assert an unsupported root cause |
| Failure comes from repetitive agent behavior or tool limits | Correct agent behavior or supply missing conditions | Record it as a negative user habit |

[inference] First compare lightweight intervention with the existing interaction, recording false triggers, task improvement, extra questions, and user burden. Long-term learning benefits and profile effectiveness require separate later validation.

## Judgment confidence

The four-dimensional scores record support for recommendations, not statistical probabilities. J1–J4 each receive Owner 1 (the user explicitly requested the direction), Research 0.5 (adjacent evidence, without project measurements), Reasoning 1, and Project history 0.5 (an existing but unvalidated draft): total 3, medium. These judgments do not establish specific activation thresholds, the best intervention form, or storage choices.

## Not verified

- No automatic stall detector was tested, and no profile was shown to improve subsequent interactions.
- No fixed set of steps, levels, or philosophical foundations was established as suitable for all situations.
- Schön's reflection-in-action is a relevant lead, but the author's chapter timed out and the book PDF exceeded the reading size limit during the original investigation. No substantive conclusion relies on it.
- This was a targeted investigation, not a systematic review of research available through 2026-10-25.
- The engineering article includes later updates. Only design principles actually read during this investigation are cited; the note does not retrospectively assert that all its content existed in 2024.

## Decisions for the owner

No decision was required at this stage. The first host and profile storage location can be selected during implementation; both remained open in this investigation.

## Sources

- [S1 — Slovic: The Construction of Preference](https://bear.warrington.ufl.edu/brenner/mar7588/Papers/slovic-ampsy1995.pdf): the author's paper, hosted by a university; relevant body text was read.
- [S2 — Buçinca and colleagues: To Trust or to Think](https://arxiv.org/pdf/2102.09692): the authors' paper; passages on cognitive intervention and burden trade-offs were read.
- [S3 — Anthropic: Building effective agents](https://www.anthropic.com/research/building-effective-agents): first-party engineering experience; simple design, pattern conditions, and feedback guidance were read.
- [S4 — Agent Skills specification](https://agentskills.io/specification): official format and progressive-loading specification.
- [S5 — Adding skills support](https://agentskills.io/client-implementation/adding-skills-support): official integration guide; catalog visibility and both activation mechanisms were read.
