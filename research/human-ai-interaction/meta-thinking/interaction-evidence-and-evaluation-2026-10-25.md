# Research: Evidence boundaries for abstraction, critique, and human–AI collaboration

Date: 2026-10-25. Question: Which mechanisms in the original draft have supporting evidence, and which should be tested first? Context: identify testable directions for further Meta Thinking exploration.

Current conclusion: [inference] Prioritize when to switch, what constitutes verification, and when to stop. Abstraction and critique have conditional experimental support, but adding steps or humans does not automatically improve results. These recommendations remain research hypotheses, not adopted architecture or rules.

Evidence markers: `[official]` means relevant paper text was read; `[official · summary only]` means only the authors' abstract was read; `[inference]` means project-level interpretation. Here, official identifies source ownership, not an uncontested conclusion. No paper code was run and no experiments were reproduced.

## Overview

| Question | Recommendation | Evidence strength and limits | Judgment confidence |
| --- | --- | --- | --- |
| Is upward abstraction useful? | Test one relevant abstraction step, then return to the original problem | Medium: experimental support for particular models and tasks | Medium; see J1 |
| Does Critic mean verification? | Separate generating critique, verifying critique, and revising answers | Medium: both negative and positive conditional results exist | Medium; see J2 |
| Is human–AI collaboration inherently better? | Retain human-only, AI-only, and collaboration baselines | Medium: cross-experiment synthesis with limited scope | Medium; see J3 |
| How can framework value be established? | Compare adaptive selection with fixed workflows at equal budgets | Weak: no project experiments yet | Medium; see J4 |

## 1. Upward abstraction: adjacent evidence does not establish a complete hierarchy

### Evidence

[official] Step-Back Prompting poses a higher-level question, then uses relevant concepts to solve the original problem. It reports improvements in physics, chemistry, and knowledge QA, alongside new errors, incorrect principles, and context loss. The methods, results, and error analysis were read. [S1]

### Recommendation for the project

[inference · J1] Test the draft's reason upward / downward as a local operation: extract a useful principle from a concrete problem, then check that the answer still meets the original constraints. This does not require fixing Levels 1–6 first or establish a need to trace back to philosophical foundations.

### Relation to existing constraints

Corresponds to FR-02, FR-03, and Avoid philosophy decoration. Preserve the original draft without presenting adjacent research as validation of the entire framework.

## 2. Critique and verification: feedback determines what an experiment means

### Evidence

[official] Huang et al. investigate intrinsic self-correction without external feedback. It can fail to improve or degrade performance on the reasoning tasks tested; comparisons should use equal inference-cost baselines. Definitions, the introduction, and baseline discussions were read. [S2]

[official] CRITIC verifies and revises outputs using feedback from tools such as search and execution, improving performance on the authors' tested tasks, including QA and mathematical program synthesis. The method, feedback process, and experimental overview were read. [S3]

[official · summary only] ProCo reports improved correction without external feedback by masking a key condition and predicting it back to verify an answer. Only the authors' abstract was read, not the full experiments. [S4]

### Recommendation for the project

[inference · J2] Do not treat switching to Critic as a correctness guarantee. Record checkable counterexamples, feedback used, and whether revisions pass verification. Avoid the absolute claim that correction without external feedback never works; ProCo offers a conditional counterexample requiring further examination.

[inference] Test ordinary self-critique, structured condition verification, and external tool verification separately. They should not share an undifferentiated verification label.

### Relation to existing constraints

Corresponds to FR-06 and the Verification-first candidate. The papers concern the models and tasks tested at the time, not a direct evaluation of 2026 model capabilities.

## 3. Does human participation add value? Specify the comparison

### Evidence

[official] Vaccaro et al. synthesize 106 experiments and distinguish outperforming humans alone from outperforming the better of humans and AI alone. On average, the sample supports the former, not the latter. Creation tasks are relatively more favorable than decision tasks, but the creation subgroup's synergy gain versus zero is not significant. Results, methods, and limitations were read. The inclusion window ends on 2023-06-30. [S5]

### Recommendation for the project

[inference · J3] Human Checkpoint, Centaur, and Cyborg should specify which subtask gains what value, while measuring participation cost. Human confirmation can express authorization or preferences; claims that it detects errors need separate evidence of error-detection effectiveness.

### Relation to existing constraints

Corresponds to the draft's concern about heterogeneous L4 concepts. This evidence supports neither a universally optimal allocation nor the claim that fewer humans is better.

## 4. The most valuable next tests

### Evidence

[inference] These sources do not establish the original cross-domain framework's effectiveness or directly demonstrate reliable discovery of unknown unknowns.

### Recommendation for the project

[inference · J4] Build a small controlled case set before expanding the concept catalog. The following are proposed experiments, not completed tests:

| Case | Comparison | What to observe |
| --- | --- | --- |
| Simple task with a clear goal | Direct execution vs. framework | Unnecessary questions and added time |
| Choice with hidden constraints | Direct answer vs. proactive investigation | Whether discovered constraints change the final choice |
| Repeated unsuccessful revisions | Further iteration vs. reframing | Detection of a wrong goal or critical assumption |
| Reasoning with a known answer | Self-critique vs. condition verification vs. tools | Proportions of corrected and newly introduced errors |
| Open-ended creation | Fast iteration vs. abstraction first | Blind-rated quality, user effort, and completion time |

[inference] Record discoverable hidden factors and their effects beforehand. Distinguish evidence-backed discoveries, reasonable questions for investigation, and unsupported guesses. Controlled hidden factors test local discovery, not coverage of all real-world unknown unknowns.

[inference] Compare at least direct answers, fixed workflows, and adaptive selection. Control the model, tools, and total budget; report user time separately. Add human-only and AI-only baselines when collaboration effectiveness is at issue. Success means better outputs or decisions at acceptable cost, not more steps or longer explanations.

### Relation to existing constraints

Corresponds to the draft's Success Criteria and its requirement not to overcomplicate simple questions. Evaluation designs remain research recommendations in this directory.

## Judgment confidence

Scores express how well each recommendation fits current project evidence, not statistical probabilities. The order is Owner / Research / Reasoning / Project history, with each dimension scored 0–1.

| Judgment | Four-dimensional scores | Total and level | Main limitation |
| --- | --- | --- | --- |
| J1 Test abstraction locally | 0.5 / 0.5 / 1 / 0.5 | 2.5, medium | No project tests yet |
| J2 Distinguish critique and verification mechanisms | 0.5 / 1 / 1 / 0.5 | 3, medium | Transfer across models and tasks is unverified |
| J3 Retain distinct collaboration baselines | 0.5 / 1 / 1 / 0.5 | 3, medium | Historical samples do not represent current systems |
| J4 Build a controlled case set first | 0.5 / 0.5 / 1 / 0.5 | 2.5, medium | Specific cases and budgets remain unselected |

## Not verified

- No paper result was reproduced and no current model was evaluated.
- This preliminary, targeted investigation is not a systematic search of all research through 2026-10-25.
- The necessity and effectiveness of the complete hierarchy, graph structure, or Meta Reasoning Router remain unproven.
- Only ProCo's abstract was verified; its method strength and comparison fairness require further reading of the body.
- The Nature and PMC full-text entry points encountered a redirect restriction and CAPTCHA respectively; S5 was read through the authors' arXiv v2 text instead.

## Decisions for the owner

No immediate decision is required. Selecting the next case set requires deciding whether task quality, user learning, or reduced effort is the main goal; this is a product tradeoff.

## Sources

- [S1: Take a Step Back, ICLR 2024 paper](https://proceedings.iclr.cc/paper_files/paper/2024/file/592da1445a51e54a3987958b5831948f-Paper-Conference.pdf): abstraction, experiments, and failure types.
- [S2: Large Language Models Cannot Self-Correct Reasoning Yet, ICLR 2024 paper](https://proceedings.iclr.cc/paper_files/paper/2024/file/8b4add8b0aa8749d80a34ca5d941c355-Paper-Conference.pdf): negative results for correction without external feedback and comparison conditions.
- [S3: CRITIC, ICLR 2024 paper](https://proceedings.iclr.cc/paper_files/paper/2024/file/fef126561bbf9d4467dbb8d27334b8fe-Paper-Conference.pdf): verification and revision using tool feedback.
- [S4: ProCo, EMNLP 2024 abstract](https://aclanthology.org/2024.emnlp-main.714/): positive report on structured condition verification; abstract only.
- [S5: When Are Combinations of Humans and AI Useful?, authors' arXiv v2 paper](https://arxiv.org/html/2405.06087v2): collaboration baselines, heterogeneity, and research-scope limitations.

Starting point: [original exploration draft](./meta-ai-thinking-working-draft-2026-10-25.md).
