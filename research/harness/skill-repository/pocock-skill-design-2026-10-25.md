# Research: Matt Pocock's skill design and implications for Meta Thinking

Date: 2026-10-25. Question: excluding distribution effects, which design mechanisms make `mattpocock/skills` concise and transferable, and what can this project learn? Context: the owner wants to advance Meta Thinking and learn how to keep producing compact, useful skills.

Conclusion: [inference] the most useful lessons are to design repeatable behavior around common failures, give important judgments clear completion criteria, organize material by branch, and use real runs to remove instructions that do not change behavior. Word count is part of maintenance cost, not the main optimization target. Short entry points may depend on other skills and host capabilities. This research did not establish the causes of popularity or prove that Matt's methods work equally well across all models, tasks, or this project.

Evidence markers: `[official]` means the author's repository or article was read; `[measured]` records readings and counts from the original research round; `[inference]` identifies project recommendations. The author's effectiveness claims remain experience reports, not controlled experimental results merely because they are first-party. The original round recorded research without changing candidate behavior or adopting repository rules. Translation and source review do not rerun those historical measurements.

Subsequent status (2026-10-25): in the next discussion, the owner endorsed this direction and authorized combining it with other sources into a project method. Adopted guidance was synthesized in [Skill design principles](../../../knowledge/skill-design/skill-design-principles.md). This note preserves the original judgments; subsequent adoption is not evidence that the method is effective.

## Overview

| Question | Recommendation | Evidence and limits | Judgment |
| --- | --- | --- | --- |
| Why can a short skill be useful? | Find the few instructions that change default behavior; retain required dependencies | Source behavior is inspectable; actual gains need trials | J1, medium |
| Where does generality come from? | Extract the task structure and get project facts from the environment at runtime | The author explicitly calls for deliberate generalization beyond a single run | J2, medium |
| How can skills stay compact? | Add rules for observed failures; delete lines through behavior comparisons | Maintenance policy and writing guidance agree | J3, medium |
| What should Meta Thinking improve first? | Verify intervention quality and burden, then ablate instructions; do not prioritize word-count reduction | A short body and layered references already exist, but effectiveness remains unverified | J4, medium |

## 1. Research scope and version

### Evidence

[measured] The original round read `mattpocock/skills` main at fixed commit `5beb35b040e3de97e54fa9e386d7e42d15c295c2`, dated 2026-10-19. Source facts below refer to that version. Files were enumerated through the GitHub tree API, and the listed source bodies were read.[S1][S2]

[official] At that version, the writing method lives in `writing-for-agents`. The release notes record that `writing-great-skills` replaced `write-a-skill`, then was renamed `writing-for-agents`. Specification and ticket entry points are `to-spec` and `to-tickets`. Old files preserved in mirrors cannot describe the current implementation.[S3][S4][S12][S13]

[measured] Git blob `size` was counted for every `SKILL.md` under `skills/engineering/` and `skills/productivity/`: 27 files, minimum 157 bytes, median 4123 bytes, maximum 12594 bytes; six files were below 1024 bytes. Counts include frontmatter and exclude supporting resources, `in-progress`, and frozen `misc`. They are neither token counts nor total runtime loading costs.[S2]

| Sample | Main file size (bytes) | Additional structure or dependencies |
| --- | ---: | --- |
| `grill-me` | 157 | Entry point invokes `grilling` |
| `grilling` | 2049 | Conversation rounds; requires subagents for fact-finding |
| `tdd` | 3629 | `tests.md`, `mocking.md`, and conditional `codebase-design` invocation |
| `to-spec` | 3043 | Configured issue tracker and domain context |
| `to-tickets` | 5812 | Tracker configuration, dependencies, and output templates |
| `improve-codebase-architecture` | 6000 | HTML reference, other skills, subagent, browser, and CDN |
| `writing-for-agents` | 10886 | Reads `SKILL-MECHANICS.md` when writing a skill |

### Recommendation for the project

[inference · J1] Compare the content and execution cost needed for the complete behavior. Do not compare the length of an invocation entry point directly with a standalone candidate package. A useful skill may be short instructions or a longer, well-organized reference. What matters is what the current task needs to read and which behavior each passage changes.

### Relation to existing constraints

This agrees with the [document formats](../../../docs/DOCUMENT-FORMATS.md) rules for focused bodies, on-demand resources, and package-local dependencies. Meta Thinking does not need multiple installable packages merely to imitate another repository.

## 2. Transferable design mechanisms

### Evidence

[official] The README explains skills through failures such as misunderstood requirements, verbose exchanges, missing execution feedback, and deteriorating architecture. It emphasizes small, editable, composable units. The writing reference defines the goal as a predictable execution process rather than identical answers.[S3][S5]

[official] The main mechanisms in `writing-for-agents` are as follows.[S5][S6]

- Trigger descriptions and document pointers explain what material is and which distinct situations require it. If required material sits behind a vague pointer, improve the pointer first.
- The body retains actions needed by every branch; references used by only some branches move behind conditional pointers. Usage conditions, not merely line count, determine the split.
- Completion criteria need both clarity and sufficient demand. Sharpen a vague criterion first; consider an actual context split only after observing later steps pull the agent into premature completion.
- Organize behavior around compact concepts the model already knows. Terms must stay stable; a new name alone does not supply operational meaning.
- Remove duplicate meanings, stale material, and instructions the model already follows by default. Easily queried environment facts do not need a second cached copy.
- Whether a line is a no-op depends on the model's default behavior. Settle disagreements by running the document, not only by an editor's reading impression.

[official] `grilling` turns open-ended interviewing into a dependency-aware decision tree. Each round asks questions whose prerequisites are settled and supplies recommended answers; user answers update the next frontier. Agents investigate environmental facts; users decide values and trade-offs. `tdd` specifies one test and one minimal implementation per cycle, with tests observing public-interface behavior. These skills constrain the important process while leaving project content to runtime investigation.[S7][S8]

[official] The maintenance policy requires a reported problem to come from an actual session failure and fit the repository philosophy. Configuration options, host-specific branches, and personal workflow preferences do not automatically enter the shared skills. Behavior composed from existing skills does not automatically justify a new skill.[S9]

### Recommendation for the project

[inference · J1–J3] Review candidates through these questions rather than add a large runtime checklist:

1. What specifically does the agent do wrong without the skill?
2. Which instruction changes that behavior?
3. How does the agent know this intervention is sufficient?
4. Which facts should be investigated at runtime, and which experience must the skill supply?
5. Does behavior on representative tasks change when a sentence is removed?

[inference] Generality comes from retaining stable task relationships while removing incidental project names, paths, tool brands, and single-example details. Abstracting to “think carefully about any task” loses operational meaning. Distinguishing unverified assumptions from facts, then testing a key assumption through an action, remains usable across domains.

### Relation to existing constraints

This agrees with the repository's existing single-authority, investigate-first, and shared-knowledge-versus-package boundaries. Analytical terms introduced by research do not automatically enter `GLOSSARY.md`, and author experience does not automatically become universal policy.

## 3. Limits of brevity, transferability, and effectiveness

### Evidence

[official] The author's early `grill-me` article preserves a very short prompt and reports interviews often lasting about 45 minutes. The repository explicitly rejects a fixed question cap: depth is intentional, low-value repetition should be addressed through instruction quality, and users can request an end at any point.[S10][S11]

[official] The invocation design separates user-invoked orchestration from model-reachable shared rules. The v1 announcement's 63% token reduction concerns skill descriptions; it does not mean total execution tokens fell by 63% or quality improved by that amount. Invocation semantics still depend on the host; this research did not test them across clients.[S6][S12]

[official] `to-spec` and `to-tickets` require repository configuration. An author ADR distinguishes these hard dependencies from soft dependencies that only sharpen output. `improve-codebase-architecture` also uses other skills, subagents, and HTML output. The methods can transfer across projects, but not every package operates independently without tools.[S13][S14][S15][S16]

[official] The writing guide acknowledges that extracting a skill from one run can overfit; incidental repository and file details must be deliberately removed. The author uses manual runs to discover problems and does not claim an automated effectiveness evaluation for the method.[S4]

### Recommendation for the project

[inference] Borrow the mechanisms without copying the product trade-offs. Meta Thinking's confirmed goals are low frequency, low burden, and returning to the task once progress resumes. It should not inherit exhaustive grilling or require user confirmation at every step. Actual blockers and artifacts provide a better basis for another question than a uniform question-count limit.

[inference] Familiar terms, positive instructions, and clear pointers are worth testing, but the author's explanations are not verified laws of model cognition. In particular, reducing negative wording must not remove necessary boundaries for profile access, corrupted data, or unauthorized actions.

### Relation to existing constraints

Retain the low-frequency direction and evidence limits in the [Meta Thinking guidance](../../../knowledge/meta-thinking/meta-thinking-guidance.md). This research does not change the initial host, persistent-profile location, or authorization requirements.

## 4. Implications for the existing Meta Thinking candidate

### Evidence

[official · local] The [candidate body](../../../incubator/meta-thinking/candidate/meta-thinking/SKILL.md) already has a focused objective, small actions, exit conditions, and on-demand references. The [interaction reference](../../../incubator/meta-thinking/candidate/meta-thinking/references/interaction-options.md) maps obstacles to actions and evidence of progress. The [evaluation guide](../../../docs/prompt-evaluation.md) distinguishes fixture checks from effectiveness, structured JSON from natural interaction, and memory-policy judgments from actual file writes.

[measured] In the original round, `wc -w` at local commit `5e503e6` counted 452 words in the candidate `SKILL.md` and 380 and 648 in its two references, totaling 1480 including frontmatter. These are not token counts. A direct C6 probe of [gradeDecision](../../../evals/lib.mjs) set `approach`, `memory`, and `cause` to `design`, `skip`, and `unknown`. Its explanation meant “This is a design task,” and its action meant “Please conduct a comprehensive, in-depth, careful review” (English translations of the original Chinese probe text). The result was `pass: true`, `score: 1`. This was a constructed grader probe, not a model call. By design, the grader checks classifications and nonempty text and asks for manual quality review. The result shows that the automatic score cannot distinguish a concrete design from a vague slogan.

[official · local] In the same file, `readSkill` concatenates both references into the full-candidate condition. That condition can test the full instructions, but not whether a real host loads references on demand correctly.

### Recommendation for the project

[inference · J4] The immediate gap is evidence that a few instructions produce behavioral gains worth their cost, not further shortening. The next validation should proceed as follows:

1. Use C1 and C2 to check continued work when intervention is unnecessary; C3 and C4 to check evidence-based causal hypotheses and correction of agent errors; C6 to check actual progress on reviewer-skill design.
2. Compare no skill, the current candidate, and an ablated version on the same case. Retain the original as the control. Remove one functionally related group at a time so attribution is not confounded by several simultaneous mechanism changes.
3. Observe whether the next action is different and useful, whether relevant evidence increases, how many extra questions and how much time are spent, and whether meta-discussion ends after progress. A stated intention is not observed execution.
4. Test transfer with different domains sharing the same problem structure, such as copy with an unclear audience, plans with conflicting constraints, and agent designs lacking evidence. Do not repeatedly optimize only writing examples.
5. Separately test conditional reference loading and whether profiles improve later interaction. Once the main task produces value, evaluate the additional gains and costs of persistent profiles.

[inference] The candidate's core behavior can be framed as a research hypothesis: find an evidence-supported assumption or interaction worth changing; choose the smallest action that tests it; return to the task after progress, or revise the explanation otherwise. This summarizes the existing direction, not approved replacement text. Explicit agent-design requests must still produce the requested artifact rather than being absorbed into stall diagnosis.

[inference] New rules should correspond to observed failures; deletion should preserve behavior in comparisons. This avoids both putting every research conclusion into runtime instructions and deleting important mechanisms merely to resemble a short prompt.

### Relation to existing constraints

Verification records remain in `incubator/meta-thinking/evaluation.md`, and run outputs remain in ignored local directories. Research does not create a second status directory, change the candidate, or describe this external design analysis as verified project effectiveness.

## Judgment confidence

J1–J4 have medium confidence, 3.0: Owner 1 (explicit request to research this direction); Research 0.5 (author statements and source, but no project behavior experiment); Reasoning 1 (mechanisms can become checkable comparisons); Project history 0.5 (compatible design and cases, but no real trial). This score describes support for the recommendation, not an effectiveness probability.

## Not verified

- Distribution, reputation, model, host, and user-selection effects were not isolated, so popularity's causes were not established.
- The author's token reduction was not reproduced, and the complete workflow was not run.
- This research did not prove that shorter text is better, all skills generalize extremely well, or these recommendations achieve the same results.
- Candidate gains, activation, profile benefits, and long-term learning were not tested across models, hosts, or repeated samples.
- Analysis covers only the listed source files and articles. Historical skill names and behaviors are not interchangeable with the current interface.

## Decisions for the owner

The original round required no new product decision. Continue validating the confirmed low-frequency Meta Thinking direction. Candidate revision and release should follow behavior evidence, not only another author's style.

## Sources

- [S1 — Fixed commit](https://github.com/mattpocock/skills/commit/5beb35b040e3de97e54fa9e386d7e42d15c295c2): SHA and date checked through the commit API.
- [S2 — Fixed-version file tree](https://api.github.com/repos/mattpocock/skills/git/trees/5beb35b040e3de97e54fa9e386d7e42d15c295c2?recursive=1): paths and Git blob byte counts.
- [S3 — README](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/README.md): goals, common failures, composition, and installation.
- [S4 — The /writing-for-agents Skill](https://www.aihero.dev/skills-writing-for-agents): pruning, manual validation, generalization, and renaming.
- [S5 — writing-for-agents](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/skills/productivity/writing-for-agents/SKILL.md): the complete writing reference was read.
- [S6 — Skill mechanics](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/skills/productivity/writing-for-agents/SKILL-MECHANICS.md): invocation and splitting conventions.
- [S7 — grilling](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/skills/productivity/grilling/SKILL.md): the complete interview loop and same-version `grill-me/SKILL.md` entry point were read.
- [S8 — tdd](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/skills/engineering/tdd/SKILL.md): the body was read; supporting-file existence came from the tree, not an effectiveness reproduction.
- [S9 — SCOPE](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/SCOPE.md): observed-failure and maintenance-scope admission criteria.
- [S10 — My 'Grill Me' Skill Went Viral](https://www.aihero.dev/my-grill-me-skill-has-gone-viral): the author's 2026-03-23 short prompt and usage experience.
- [S11 — Question limits](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/.out-of-scope/question-limits.md): reasons for not setting a fixed question cap.
- [S12 — v1 announcement](https://www.aihero.dev/skills/skills-changelog-v1-announcement): invocation reorganization, description-token reduction, and replacement of `write-a-skill`.
- [S13 — to-spec](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/skills/engineering/to-spec/SKILL.md): specification synthesis, test interfaces, and tracker dependencies.
- [S14 — to-tickets](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/skills/engineering/to-tickets/SKILL.md): vertical slices, dependencies, and the mechanical-refactor exception.
- [S15 — improve-codebase-architecture](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/skills/engineering/improve-codebase-architecture/SKILL.md): architecture analysis, reports, and shared-skill dependencies.
- [S16 — Setup dependency ADR](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/.agents/adr/0001-explicit-setup-pointer-only-for-hard-dependencies.md): hard versus soft configuration dependencies.
