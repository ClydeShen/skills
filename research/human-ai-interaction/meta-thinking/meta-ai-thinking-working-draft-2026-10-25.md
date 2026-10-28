# Meta Thinking for Human-AI Interaction — Original exploratory draft

Archived: 2026-10-25. Original writing date: not supplied.

Source: the user-supplied `meta_ai_thinking_prd_working_draft-2.docx`.

Status: original exploratory material, not externally verified at archival time. The judgments, theoretical mappings and hierarchy below preserve the draft's claims; they are not adopted repository conclusions or standards. The initial archival operation converted format only. On 2026-10-25, this record was translated into English under the owner's repository-language requirement; it is not a verbatim reproduction of the original language. Earlier repository text remains in Git history. Subsequent research and revisions should explicitly cite this draft.

---

Meta Thinking for Human-AI Interaction

PRD-style Working Draft / Requirements and conceptual review

Status: Exploration Draft - not a final taxonomy

> Positioning: The aim is not to quickly define a fixed Level 1–6 system, but to record current requirements, assumptions, open questions and possible structures for further exploration, challenge and validation.

## 1. Background

Many people interact with AI in a default “vibe anything” mode: state a goal, let AI generate content, then keep revising by feel. This works well for low-risk exploratory tasks, but can bypass a more important question: before answering, which way of thinking should we use?

This project aims to establish a meta thinking framework. It is neither a prompt library nor a fixed workflow, but a framework that helps people and AI choose a thinking approach before solving a problem.

## 2. Problem Statement

- Users usually ask questions they already know to ask, making unknown unknowns difficult to discover.
- AI readily answers within the user's framing instead of first assessing whether that framing is reasonable.
- Interaction concepts such as Vibe, Centaur, Socratic, Critic and Delegation are mixed together, although they may be different kinds of concepts.
- Classical philosophy, thought, algorithms and systems theory offer established thinking principles that have not yet been systematically mapped to human-AI interaction.
- Existing prompt engineering emphasizes how to ask rather than why to choose a way of thinking or what alternatives exist.
- Without an explicit reasoning-strategy choice, vibe can become an unconscious default rather than a deliberate mode.

## 3. Product Vision

Establish a cross-domain Human-AI Meta Thinking Framework. Whether the problem concerns architecture, investment, management, learning or cooking, users can identify its deeper structure and relevant thinking principles, choose an appropriate AI interaction pattern, then move down to methods and prompts.

Question -> Reason upward -> Select principles -> Reason downward -> Methods -> Interaction

## 4. Core User Intent

The user wants executable meta thinking, not a static knowledge tree. Ideally, a new problem prompts a choice of thinking mode rather than immediate answer generation.

1. Start from the problem and identify whether a better interaction pattern exists instead of defaulting to vibe.
2. Reason upward toward problem structure, general thinking principles, classical thought or philosophical foundations.
3. Reconsider framing, assumptions and potentially omitted perspectives at a higher level.
4. Reason downward toward methods, techniques, tools and prompts.
5. Observe execution feedback and allow a return to higher levels rather than repeatedly editing only at the bottom.

> Key point: This reasoning is neither one-way top-down nor simply bottom-up. It moves between abstraction levels.

## 5. Working Level Model

The following levels are working hypotheses for discussion, not a settled taxonomy.

| Level | Provisional meaning | Typical content | Current confidence |
| --- | --- | --- | --- |
| L1 | Worldview / Philosophy / Foundational thought | Epistemology, Pragmatism, Holism, Reductionism, Dialectics, Stoicism, Systems philosophy | Medium |
| L2 | General thinking principles / reusable mental models | First Principles, Occam's Razor, Bayesian Updating, Emergence, Feedback Loop, Second-order Thinking | Low to medium |
| L3 | Problem structure / abstract problem class | Decision under uncertainty, Search, Constraint satisfaction, Coordination, Causal inference, Principal-agent problem | Low |
| L4 | AI reasoning / interaction pattern | Unknown Discovery, Socratic, Critic, Simulation, Verification-first, Cyborg, Centaur, Mixed Initiative, Vibe | Medium |
| L5 | Method / technique | Premortem, Red Team, Blind Spot Scan, Assumption Inventory, What-if Analysis, 5 Whys | Medium |
| L6 | Concrete interaction / action | Specific prompt, tool call, workflow step, approval gate, checklist | High |

> Important reservation: The L2/L3 boundary is the least stable. First Principles, Goodhart's Law, Prisoner's Dilemma, Bayesian Updating and Dunning-Kruger are often grouped as mental models, but may be different concept types. Do not force them into one level for the sake of a tree.

## 6. Examples

### 6.1 First Principles

Current judgment: a cross-domain reasoning principle, possibly L2, rather than a specific method. It describes how to think without specifying the user's next sentence to AI.

- Possible higher-level origins: Aristotelian first principles, rational inquiry, reductionist reasoning.
- Possible downstream interactions: Challenge assumptions, Reframe, Progressive decomposition.
- Possible L5 methods: Fact vs convention, Assumption decomposition, 5 Whys, reconstruction.
- Possible L6 prompt: Before proposing a solution, separate the current proposal's facts, constraints, conventions and assumptions.

### 6.2 “The whole is greater than the sum of its parts”

This expression may cross levels. Holism may be an L1 worldview, while emergence, system interaction and local versus global optimization may be L2 thinking principles. A term does not necessarily belong naturally to one level.

- L1: Holism / Systems philosophy
- L2: Emergence / Interaction effects / Global optimization
- L3: Complex system / dependency network / bottleneck problem
- L4: System-level review / multi-perspective analysis / simulation

### 6.3 Unknown Discovery

One of the clearest current L4 interaction-principle candidates. Its purpose is not to answer a question but to turn unknown unknowns into known unknowns.

- Possible higher-level connections: Epistemology, Metacognition, Information gain, Active learning, Problem finding.
- Downstream methods: Blind spot scan, Missing-question generation, Hidden-assumption discovery, Boundary analysis.

### 6.4 Vibe Interaction

Vibe should not be defined as a bad mode. It is an interaction strategy that uses frequent feedback and rapid iteration instead of extensive upfront specification. The problem is its unconscious adoption as the default.

- Possible theoretical sources: Feedback loop, Hill climbing, Iterative design, Exploration/exploitation.
- Suitable for: low-risk, reversible, creative tasks with quickly observable results.
- Unsuitable as an automatic default for: high-risk, hard-to-verify, irreversible tasks or hidden dependencies.

## 7. Interaction Principles Identified So Far

These are provisional L4 candidates, not necessarily concepts that ultimately belong at the same level. Investigate whether they mix relationship models, reasoning methods, workflow models and governance patterns.

| Candidate | Core idea |
| --- | --- |
| Vibe Interaction | Generate, observe, revise and repeat rapidly. |
| Cyborg Interaction | Human and AI alternate thinking frequently in a tight feedback loop. |
| Centaur Interaction | Human and AI divide work explicitly, each handling suitable parts. |
| Delegation / Self-Automation | Delegate a relatively complete task to AI; the human mainly sets goals and acceptance. |
| Mixed-Initiative Interaction | AI may ask, remind or change the next step, not merely respond. |
| Socratic Interaction | Questions help users expose assumptions and develop understanding. |
| Critic / Adversarial Interaction | Attack the current proposal and seek counterexamples and failure modes. |
| Unknown Discovery | Find questions the user does not realize need asking. |
| Simulation Interaction | Run scenarios, roles, future states or failure paths. |
| Co-learning | Human and AI adapt together through long-term feedback. |
| Verification-first Interaction | Couple generation with verification; generation is not the endpoint. |
| Progressive Specification | Add constraints and definition progressively rather than specify everything at once. |
| Human Checkpoint | Human approval or intervention controls consequential risk points. |
| Multi-perspective Interaction | Analyze independently from multiple roles, objectives or specialties, then combine. |
| Exploration Switching | Deliberately switch between exploiting the current route and exploring new ones. |

## 8. Functional Requirements

| ID | Requirement | Assessment |
| --- | --- | --- |
| FR-01 | Framework must help the user avoid defaulting immediately to vibe interaction. | Keep |
| FR-02 | Framework must support reasoning upward from a concrete question to more abstract principles, problem structures, or worldview assumptions. | Keep |
| FR-03 | Framework must support reasoning downward from abstract principles to interaction patterns, methods, tools and concrete prompts. | Keep |
| FR-04 | Framework must expose multiple plausible reasoning paths instead of forcing one canonical path too early. | Keep |
| FR-05 | Framework must actively surface unknown unknowns, hidden assumptions, missing stakeholders, missing constraints and alternative framings. | Keep |
| FR-06 | Framework must support challenge and falsification of its own selected reasoning approach. | Keep |
| FR-07 | Framework must distinguish between different concept types even when popular literature groups them together as mental models. | Keep |
| FR-08 | Framework must work across domains, including technical design, business decisions, learning, everyday tasks and creative work. | Keep |
| FR-09 | Framework must allow loops. A user may move from L6 back to L4, L3, L2 or L1 when feedback shows the framing is wrong. | Keep |
| FR-10 | Framework should explain why a particular interaction pattern is suitable, not only recommend a prompt. | Keep |
| FR-11 | Framework should preserve vibe interaction as a valid strategy when conditions make it suitable. | Keep |
| FR-12 | Framework should be extensible as new AI interaction concepts and classical thinking models are discovered. | Keep |

## 9. Non-Goals

- Do not define a final, unique, closed Level 1–6 taxonomy at this stage.
- Do not force every philosopher or school of thought into one tree.
- Do not reduce the framework to a prompt collection.
- Do not assume each concept has only one parent.
- Do not attempt to cover all human philosophy and algorithmic theory at once.
- Do not assume more complex thinking is better. Simple questions may still receive direct answers.

## 10. Design Principles for the Framework

- Do not converge too early: explore, compare and challenge before converging.
- Use the framework on itself: use Unknown Discovery, Critic, Reframing and Verification when designing it.
- Separate concept type from abstraction level: kind and depth are different dimensions.
- Prefer a graph internally, with a tree as a view: underlying relationships may be a graph while the UI shows a projection.
- Make upward reasoning explicit: show why a practical question leads to a principle.
- Make downward reasoning actionable: high-level thought must affect methods and interaction.
- Preserve optionality: retain plausible paths when information is insufficient.
- Avoid philosophical decoration: mappings need a real mechanistic relationship, not names attached to AI patterns to sound profound.

## 11. Requirement Review

### 11.1 Why I think the current direction is sound

- The goal has moved from collecting AI interaction tips to a meta framework for choosing ways of thinking, a more stable and durable objective.
- Abstracting upward and returning to action can prevent local optimization within the initial framing.
- Making vibe a conscious choice rather than rejecting it is reasonable.
- Mapping philosophy, thought and algorithms to AI interaction is valuable when mappings connect mechanisms, not names.
- Graphs and cross-links are necessary alternatives to forcing a single parent for every concept.

### 11.2 Unstable or potentially problematic assumptions

| Open assumption / risk | Why it matters |
| --- | --- |
| Is L1 = philosophy too broad? | Philosophy, scientific method, control theory, information theory and economic models differ. L1 may become Foundations with multiple types. |
| Can L2 thinking principles form one category? | First Principles, Goodhart's Law, Bayesian Updating and Emergence are different kinds of concepts; subtypes or a second dimension may be needed. |
| Is L3 problem structure necessary? | A principle may directly suggest an interaction pattern. L3 may be an optional routing layer, not mandatory on every path. |
| Are L4 concepts homogeneous? | Centaur is a division-of-labor model, Critic a reasoning mode, Human Checkpoint a governance pattern, and Vibe a workflow style. Type labels may be needed. |
| Is a fixed number of levels necessary? | The structure may be a graph with typed edges; levels may be human-readable abstraction bands. |
| Is upward reasoning always valuable? | Simple, low-risk problems should not be overanalyzed to use the framework. A judgment of whether abstraction is worth it is needed. |
| Could classical-theory mapping create false depth? | Saying Vibe = cybernetics without a feedback mechanism is labeling. Require explainable mapping criteria. |

## 12. Key Open Questions

- Should the underlying structure be a tree, DAG, knowledge graph, matrix or multiple views?
- Should levels represent abstraction depth or concept type? Should these be separate?
- What is the smallest set of cognitive operators, such as expand, narrow, challenge, simulate, verify, act and reflect? Are they more fundamental than interaction principles?
- Should a general principle such as First Principles share a level with a mechanism such as Bayesian Updating?
- Which L4 patterns are independent and which combine more basic patterns?
- Could a multidimensional structure resembling a periodic table describe human-AI interaction better than a tree?
- How should we decide whether to answer directly or trigger upward reasoning?
- How can meta thinking avoid causing analysis paralysis?
- What makes an interaction pattern better: accuracy, coverage, decision quality, explainability, cost, speed or learning value?
- Should AI proactively recommend a reasoning mode, or should the user explicitly select it?
- Is the eventual framework a knowledge system, agent policy, UI interaction model or a combination?

## 13. Candidate Meta Flow

This is a current description of the intended workflow, not a final process.

| Stage | Meaning |
| --- | --- |
| 0. Question arrives | The user raises a practical problem. |
| 1. Mode check | Decide whether a direct answer suffices or a deeper reasoning strategy is needed. |
| 2. L4 candidate discovery | Suggest suitable patterns such as Unknown Discovery, Critic, Simulation, Socratic or Vibe. |
| 3. Reason upward | Ask why the patterns fit, what structure underlies the problem, and which principles or worldview assumptions matter. |
| 4. Reframe if needed | Redefine an overly narrow or mistaken framing. |
| 5. Reason downward | Reselect L4 from higher-level principles and move to L5 methods. |
| 6. Concrete interaction | Produce a prompt, tool, workflow, checklist or action. |
| 7. Observe and loop | Use results to continue execution or return to a higher level. |

## 14. Success Criteria

- The framework reveals more than one reasonable thinking path for a given problem.
- The user understands why an interaction pattern was chosen, rather than receiving only a prompt.
- It surfaces some previously unrecognized questions, assumptions or perspectives.
- Higher-level principles actually affect method selection instead of decorating it with philosophical names.
- It works for technical and everyday problems without overcomplicating simple ones.
- Vibe, First Principles, Critic and Simulation fit into an explainable but flexible relationship network.
- New interaction concepts can be added without breaking the entire structure.

## 15. Current Product Hypothesis

As an AI feature rather than a purely theoretical system, it may be a Meta Reasoning Router rather than a prompt-template selector: identify the problem and uncertainty, suggest two to five reasoning or interaction paths, help the user examine higher-level framing, then produce concrete interactions.

> Still to verify: Meta Reasoning Router is only one possible product expression and should not constrain the theoretical framework.
