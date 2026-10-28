# Meta Thinking guidance

Meta Thinking helps people and AI examine goals, assumptions, evidence standards and interaction at consequential obstacles, then choose a more promising action. It suits low-frequency, on-demand use: persistent stalls, emerging intent, or selecting mechanisms for agent behavior.

The central question is: **Which goal, assumption or interaction is worth changing, and what small attempt would test it?** Abstract only far enough to change the next action; return to the task when progress resumes. Thinking and recording both consume resources.

## Basis and maturity

Date: 2026-10-25. Terms follow the root [glossary](../../GLOSSARY.md).

This guidance distinguishes three kinds of content:

- **Confirmed direction**: requirements in the [clarification record](../../research/human-ai-interaction/meta-thinking/lightweight-intervention-2026-10-25.md#requirements-from-this-conversation), confirmed in subsequent conversation. These are design constraints.
- **Research support**: related mechanisms and limits from primary research. Original sources, reading scope and counterexamples remain in the research records.
- **Synthesis recommendations**: reusable guidance combining direction and evidence, still requiring real-interaction validation.

This topic can inform skills, system prompts, collaboration workflows and memory. A fixed hierarchy, complete philosophical taxonomy and universally optimal router remain unverified.

## Applicability

Confirmed direction: use when explicitly requested or when interaction provides a worthwhile signal. Complete clear, progressing tasks normally.

| Context | Signal worth investigating | Useful result |
| --- | --- | --- |
| Stalled interaction | The same obstacle returns without new evidence or usable progress | A testable causal hypothesis and a different attempt |
| Intent exploration | The user cannot yet identify what matters, or candidate goals conflict | Clearer trade-offs and a next step |
| Agent design | A skill, system prompt or agentic workflow is requested | Task conditions explain the reasoning, division of work and feedback selected |

Round counts, rejections, changed goals and discussion length are only clues. Research indicates that preferences sometimes form through expression and comparison; changing direction may reflect growing understanding. [R3]

Recommendation: check whether the conversation adds relevant facts, constraints, trade-offs or actionable understanding. New wording alone does not establish progress; a new counterexample may constitute progress without immediately yielding a solution. Thresholds need case-based validation.

## From philosophical examination to action

The philosophical dimension examines what is worth pursuing, what is treated as fact, what counts as evidence, and why judgment and action are allocated as they are. These questions can change the solution space, acceptance criteria or next action. Theory names are useful when they explain the mechanism.

These relationships are a knowledge index, not required stages.

| Question | Researched basis | What it can affect |
| --- | --- | --- |
| Is further thought worth its cost? | Rational metareasoning and resource-rational analysis [R1] | Retrieval, experiments versus action, time and stopping conditions |
| Has the user's goal formed yet? | Preference construction [R3] | Concrete comparison, emerging trade-offs and goal revision |
| Does the original framing hide a key relationship? | Local Step-Back Prompting experiments [R2] | Extracting relevant principles, then returning to original constraints |
| Who should handle each part? | Automation functions and levels, mixed initiative [R1] | Evidence collection, analysis, decision and execution |
| What supports this criticism? | Positive and negative self-correction findings, tool feedback [R2] | Separating criticism, verification and answer revision |
| Which experiences deserve reuse? | Episodic memory, reflection and long-term memory evaluation [R4] | Preserving context and outcomes, revising stale or conflicting generalizations |

First Principles, Holism and other draft concepts remain research leads; no reliable mapping to all interaction methods has been established. Investigate a relevant theory and its counterexamples when a concrete problem calls for it.

## Lightweight intervention

Recommendation: form a tentative explanation from specific conversational facts, and propose a change sufficient to test it. The change may be a decisive question, comparison, evidence check or reversible experiment. Quality depends on advancing the problem, not the number of concepts used.

For example, repeated unsatisfactory copy edits with no identified audience may justify comparing short versions for two audiences. This tests whether an undecided audience contributes to the stall; it is not a universal diagnosis for repeated revision.

Consider the whole interaction: user goals, agent understanding and responses, evidence, tools and environment. Retrieve missing facts, resolve conflicting constraints and change repeated agent behavior. Do not default to attributing failure to a defect in the user's thinking.

End the meta-level discussion when the action restores progress; otherwise revise the hypothesis. Meeting key constraints, low likelihood that more information will change the choice, budget limits, or a cheaper reversible test are possible stopping reasons, judged in context. [R1]

Research support: cognitive interventions can improve some decisions while increasing subjective burden. Few steps should therefore mean fewer wasted questions, reasonable time and acceptable user effort. [R3]

## Choosing mechanisms for agent behavior

Confirmed direction: an explicit skill, system-prompt or agentic-workflow design request is an entry point independent of stall diagnosis. Start from goals and task structure; a failure history is unnecessary.

Recommendation: explain how task conditions influence mechanism selection. A clear workflow may suffice when paths and standards are stable; dynamic selection is more justified when next steps depend on environmental feedback. Before adding evaluation-driven improvement, identify the feedback basis. [R3]

| Design object | What the reasoning should produce |
| --- | --- |
| Skill | Applicability, necessary judgments, evidence and completion conditions |
| System prompt | Persistent goals, decision principles and intervention boundaries |
| Agentic workflow | Division of work, feedback, handoffs and stopping conditions |

A reviewer design needs target error types and available evidence before choosing deterministic checks, exploratory criticism or tool verification. Adding a Critic role alone does not establish effective detection. [R2]

Division of work, reasoning operations and control authority can describe one instance simultaneously: AI collects evidence, human and AI question a proposal, the human decides, and AI executes. Centaur, Critic and Human Checkpoint may therefore combine. They are not currently mutually exclusive categories, and the number of conceptual layers is not fixed. [R1]

## User profiles and event experience

Confirmed direction: persist a structured profile in the user directory, recording observed thinking and collaboration patterns, causes of stalls and breakthrough experience. Be lazy: consider updates after important stalls or breakthroughs.

Recommendation: support future judgment with traceable, contextual experience. For example, “Comparing concrete candidates helped clarify trade-offs in a design discussion with an unclear goal.” This preserves applicability and the useful change while allowing counterexamples to revise it. [R4]

A useful experience typically identifies the context, observation, attempted change, subsequent result and certainty of the causal explanation. Dates, evidence sources and counterexamples support correction. These are information needs, not a prescribed schema.

Distinguish observations, causal hypotheses and supported explanations. Progress after a change of perspective initially establishes sequence; new facts or changed constraints may also explain the result. One breakthrough cannot establish a unique root cause. Root-cause inquiry here seeks actionable explanations and permits multiple causes and uncertainty. [R4]

Important events trigger consideration, not mandatory writes. New lessons, counterexamples or changed applicability justify updates. Extend evidence or revise existing records instead of duplicating them; keep unknowns unknown. Check current relevance before applying a pattern, and avoid personalized claims without relevant evidence.

Recording only stalls and breakthroughs yields a selected sample. Repeated obstacles in that record do not establish frequencies in everyday behavior. Profiles should retrieve useful experience, not turn exceptional events into general habits. [R4; synthesis inference]

Verify paths, formats, capacity and cross-session availability after choosing a host. Structured files alone do not guarantee accurate memory or useful personalization.

## Brevity and activation

Confirmed direction: low-frequency use and few operational steps. On-demand references can provide depth without making this guide a runtime checklist.

Recommendation: retain applicability, action-changing criteria and stopping boundaries in the main prompt. Retrieve patterns or experience only when relevant. Usually communicate the key observation, proposed change and reason.

Agent Skills describes a small catalog, a body loaded at activation and on-demand resources. Implicit activation clues must be visible before activation; hiding them in the body cannot ensure discovery. Test explicit invocation and natural activation separately, and verify client-specific capabilities during implementation. [R3]

## Convergence and unresolved questions

On 2026-10-25, under the owner's authorization, the agent recommended ending broad divergence and synthesizing knowledge. Existing sources cover cost, abstraction, feedback, work allocation, preference formation, memory and lightweight interaction. The main gap is task-specific effectiveness; more concepts alone cannot resolve it.

Confidence in that convergence recommendation was medium, 3.0: Owner 1 (explicit discretion to converge), Research 0.5 (related sources, no full-method validation), Reasoning 1, Project history 0.5 (research and requirements, no trials). This is not a probability of product success.

| Open question | Evidence needed next | When more research is useful |
| --- | --- | --- |
| Is implicit activation accurate? | Conversations covering steady progress, normal exploration and actual stalls | Stable categories of false or missed activation |
| Does intervention provide net benefit? | Quality, time and user burden compared with existing interaction | Repeated ineffective interventions with unclear causes |
| Are the resulting agents better? | Inspect design rationale, then compare target-task behavior | Missing applicable design methods or reliable feedback |
| Do profiles improve later interaction? | No-profile versus relevant-profile comparisons, including stale, conflicting and irrelevant records | Bad transfer, distorted attribution or retrieval problems |
| Does the user develop thinking skills? | Longitudinal evidence of independent application to new problems | Short-term efficiency with unclear learning or dependence |

These questions inform evaluation; cases, thresholds and experiments belong to the initiative. Low-frequency activation value, long-term learning and profile net benefit remain unverified.

## Research provenance

- [R0 — Exploratory draft](../../research/human-ai-interaction/meta-thinking/meta-ai-thinking-working-draft-2026-10-25.md): initial vision, candidate layers and open questions; retained as a translated historical record.
- [R1 — Computation, collaboration and automation](../../research/human-ai-interaction/meta-thinking/metareasoning-foundations-2026-10-25.md): metareasoning, resources, mixed initiative, automation functions and levels. Some sources were read only as overviews or abstracts; see the record.
- [R2 — Evidence limits for abstraction, criticism and collaboration](../../research/human-ai-interaction/meta-thinking/interaction-evidence-and-evaluation-2026-10-25.md): Step-Back, correction findings, collaboration baselines and experimental limits.
- [R3 — Lightweight intervention and intent exploration](../../research/human-ai-interaction/meta-thinking/lightweight-intervention-2026-10-25.md): user requirements, preference construction, burden, agent design and activation.
- [R4 — Event-triggered memory and profiles](../../research/human-ai-interaction/meta-thinking/event-driven-memory-2026-10-25.md): experiential memory, lazy updates, causal hypotheses, temporal revision and selection bias.

## Revision record

- 2026-10-25: Initial synthesis under the owner's authorization. Recommendations are agent proposals, revisable by the owner or subsequent evidence. Retained low-frequency, lightweight and event-triggered-memory direction; fixed layers, storage schema and optimal trigger thresholds remained open at the knowledge layer.
- 2026-10-25: Translated into English under the repository-language requirement. The candidate's concrete storage contract and prompt revisions remain owned by its initiative.
