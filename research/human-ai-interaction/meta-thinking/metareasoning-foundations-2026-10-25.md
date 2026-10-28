# Research: Computational, collaboration, and automation foundations for Meta Thinking

Date: 2026-10-25. Research question: Which established theories can help test the initial draft, and where does it need mechanisms rather than more concepts? Context: [original exploration draft](./meta-ai-thinking-working-draft-2026-10-25.md). This is an initial, targeted investigation; all product recommendations remain hypotheses to test.

Current finding: [inference] The draft can first investigate whether another thinking step is worthwhile, when to intervene with the user, and how to allocate particular subtasks. Relevant theories offer foundations, but these sources do not validate the draft's fixed number of levels, cross-domain effectiveness, or recommendation algorithm.

Evidence markers follow the [research template](../../../knowledge/harness/templates/research-note-template.md): [official] means relevant primary-source text was read; [official · summary only] means only an abstract or author overview was read; [inference] means this investigation's interpretation. Evidence type does not mean a conclusion has been experimentally confirmed.

## Overview

| Question | Current recommendation | Evidence strength and scope | Judgment confidence |
| --- | --- | --- | --- |
| Is there a foundation for choosing how to think? | Investigate rational metareasoning: treat computation as a resource-consuming decision | Strong theoretical connection; project implementation remains untested | Medium, 3.0 |
| When should analysis stop? | Record each candidate action's expected change, cost, and stopping condition | Supported by resource-constraint theory; thresholds need experiments | Medium, 3.0 |
| When should AI proactively ask or change direction? | Consider goal uncertainty, intervention benefit, and interruption cost together | Supported by primary mixed-initiative research; conversational adaptation remains untested | Medium, 3.0 |
| Can Centaur, Critic, and Checkpoint be parallel categories? | Describe function, allocation, reasoning operation, and control authority separately | Automation research directly supports separating function and degree; other dimensions are inferences | Medium, 3.0 |

Scores follow the [judgment practices](../../../knowledge/harness/judgment-practices.md): owner 1 (exploration authorized), research 0.5 (relevant primary theory, indirect evidence for this project), reasoning 1 (recommendations imply inspectable mechanisms), project history 0.5 (direction exists in the draft, without measurements), totaling 3.0. This records support for the recommendations, not statistical probability or product effectiveness.

## 1. Treat the next thinking step as a costly action

### Evidence

[official · summary only] Russell's research overview describes rational metareasoning as choosing computations for their expected improvement to the next real-world decision. It also notes that exact metalevel decisions can be harder to compute than the original task. Only the author's overview was verified; the full 1991 paper was not read. [S1]

### Recommendation for the project

[inference] The draft's instruction to choose a thinking approach first can become a researchable question: What candidate actions are available, and which judgments might each change? Examples include checking a critical fact, finding a counterexample, generating another framing, or conducting a reversible experiment.

[inference] Record the following fields for each candidate action, then observe actual effects:

| Field | Question to answer |
| --- | --- |
| Current decision | What exactly must be decided next? |
| Key uncertainty | Which unknown could change the choice? |
| Candidate action | Which query, clarification, challenge, simulation, or experiment? |
| Expected change | What result would cause a switch to another option? |
| Cost | How much time, computation, and user attention are required? |
| Stopping condition | What result is sufficient to take the next step? |

[inference] This makes philosophical mappings testable: if invoking a principle changes neither candidate actions, information needs, nor stopping conditions, there is not yet evidence to count it as a framework benefit.

### Relation to existing constraints

Corresponds to the draft's FR-02, FR-03, FR-06, and Avoid philosophy decoration. Retain upward and downward movement without requiring every abstraction level to be traversed. This recommendation does not define a new hierarchy.

## 2. Control the cost of metareasoning itself

### Evidence

[official] Lieder and Griffiths's resource-rational analysis combines goals, environments, and finite cognitive resources to investigate feasible cognitive mechanisms. The introduction and resource-constraint discussion were read. This is a cognitive-modeling framework, not evidence that any particular AI reasoning process achieves optimal resource allocation. [S2]

### Recommendation for the project

[inference] Measure both premature action when deeper investigation is needed and overanalysis of simple problems. Begin with small, manually labeled comparisons rather than immediately implementing a complex optimal router.

[inference] Candidate stopping rules include satisfying critical constraints, a low likelihood that another query changes the choice, exhausting the analysis budget, or finding a cheaper, reversible real-world experiment. Their value requires testing; a theory's name cannot determine it.

[inference] Include mode-selection overhead in total time. A strategy may be inappropriate when output gains are small but user-attention costs are large, even if its explanation is richer.

### Relation to existing constraints

Corresponds to the draft's allowance for directly answering simple questions and its open question about analysis paralysis. Add budgets and exit conditions to Mode check rather than requiring deep abstraction for every question.

## 3. Proactive intervention must account for interruption and correction

### Evidence

[official] Horvitz's mixed-initiative UI principles discuss uncertain user goals, timing, costs and benefits, and clarification. Users should be able to start and terminate services, and systems should reduce precision under uncertainty. The research example is the LookOut scheduling assistant. [S3]

### Recommendation for the project

[inference] An AI-recommended mode should be revisable. Compare continuing directly, asking one decision-relevant question, and offering a skippable alternative route. Do not turn every uncertainty into a question for the user.

[inference] Evaluate questions by whether the answer changes the next action. Evaluate proactive reframing by whether users accept it and whether subsequent rework decreases. Also record when users skip, correct, or terminate an intervention.

[inference] This reveals an easily missed unknown unknown: the framework may misunderstand the user's task. A user may want a quick usable draft while the system assumes rigorous decision-making; their definitions of better differ.

### Relation to existing constraints

Corresponds to the Mixed-Initiative, Socratic, and Human Checkpoint candidates and the open question of AI recommendation versus user choice. The paper informs intervention mechanisms; it does not validate the draft's mode menu or its 2–5 recommended paths.

## 4. Describe work allocation and reasoning operations separately

### Evidence

[official · summary only] Parasuraman, Sheridan, and Wickens's abstract distinguishes information acquisition, information analysis, decision and action selection, and action implementation. Each function can have a different degree of automation. Automation changes human activity and coordination demands. Only the abstract was read. [S4]

### Recommendation for the project

[inference] Test the draft's L4 candidates through concrete combinations: AI collects evidence, human and AI critique options, the human decides, and AI executes. Critic, a Centaur allocation, and a Human Checkpoint can coexist; mutually exclusive categories lose information.

[inference] Describing examples along the following candidate dimensions enables comparison before assigning every term a unique level. These are working hypotheses, not additions to the shared glossary.

| Candidate dimension | Example question |
| --- | --- |
| Work function | Are we collecting, analyzing, deciding, or executing? |
| Human–AI allocation | Who proposes, verifies, and completes the work? |
| Reasoning operation | Are we expanding options, challenging assumptions, or checking evidence? |
| Control authority | Who can decide, pause, modify, or revoke? |

### Relation to existing constraints

Directly relates to FR-07 and Separate concept type from abstraction level. The evidence supports describing distinct questions separately; it does not establish that a knowledge graph is better than a tree or that these four dimensions are sufficient.

## Tests for the next round

[inference] Select real examples of low-risk creation, constrained design, evidence judgment, and learning. Compare direct answers, fixed reflection, and task-signal-based next-action selection. Define quality criteria in advance and, where possible, judge without knowing the generation condition. Record time, cost, user burden, and traceable errors.

[inference] Track the causal chain of a strategy change: the observed signal, changed action, new evidence, and any changed final judgment. More theoretical explanation without an identifiable practical difference does not support a framework benefit.

## Not verified

- The full 1991 Russell and Wefald paper was not read; the publisher page failed to load. Related claims are limited to the author's research overview.
- Resource-rational analysis received targeted reading, not a comprehensive review of the article, commentaries, and later empirical work.
- Only the Parasuraman et al. abstract was read; the complete levels table and application details were not verified.
- Thinking-mode recommendations have not been shown to outperform the base model's default behavior.
- Shared trigger rules across domains have not been established; budgets, stopping thresholds, and user-burden measures remain undecided.
- The draft's fixed levels, minimal set of cognitive operations, knowledge-graph choice, and unknown-unknown discovery rate remain unvalidated.

## Decisions for the owner

No product or architecture decision is required in this round. Experiments will require choosing initial real tasks and their primary goal: completion quality, learning benefit, or time cost. These are later choices, not blockers to the current research.

## Sources

All sources were opened on 2026-10-25. Reading scopes are distinguished in the text.

- [S1 — Stuart Russell: Foundations, Rationality and Intelligence](https://aima.cs.berkeley.edu/~russell/research-bo.html): the author's overview of rational metareasoning, metalevel complexity, and bounded optimality.
- [S2 — Lieder and Griffiths: Resource-rational analysis](https://cocosci.princeton.edu/papers/liederresource.pdf): paper hosted by the author's laboratory; targeted reading on resource constraints and cognitive-strategy modeling.
- [S3 — Horvitz: Principles of Mixed-Initiative User Interfaces](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/11/chi99horvitz.pdf): full paper hosted by Microsoft Research; mixed-initiative principles and the LookOut scenario were read.
- [S4 — Parasuraman, Sheridan, and Wickens: A model for types and levels of human interaction with automation](https://pubmed.ncbi.nlm.nih.gov/11760769/): abstract distinguishing automation functions and degrees.
