# Research: Design philosophies of Superpowers, Vercel, and Evals Skills

Date: 2026-10-25. Question: Beyond Matt Pocock, Anthropic, and OpenAI, which public skill practices can deepen this project's understanding of model behavior and human–AI collaboration? Context: the user endorsed Matt's design philosophy and requested a synthesis of other representative authors to establish a skill-design philosophy for this project.

Conclusion: [inference] Three groups offer complementary perspectives. Superpowers uses baselines and pressure scenarios to uncover workflow failures. Vercel combines domain expertise, impact priorities, and actual retrieval behavior. Hamel Husain and Shreya Shankar place expert judgment of real data before automated scoring. Borrow their methods for identifying failures, choosing suitable interventions, and checking results; do not merge all their strict workflows, numerical thresholds, or host requirements into universal rules.

Evidence markers: `[official]` means maintainer source code or the author's text was read; `[measured]` means version information actually obtained in this investigation; `[inference]` means project-level interpretation. Author-reported experiments and experience were not reproduced here.

## Overview

| Sample | Main contribution | Limit to retain | Judgment |
| --- | --- | --- | --- |
| Jesse Vincent / Superpowers | Observe unguided behavior, then choose instruction form by failure type | Mandatory workflows and pressure tests serve specific delivery goals, not every low-burden interaction | J1, medium |
| Vercel | Prioritize expertise by impact; check whether skills are actually read; constrain advice with operational signals | Technical stack, version, tools, and experimental setting have explicit scopes | J2, medium |
| Hamel Husain / Shreya Shankar | Real traces, expert judgment, and evolving evaluation criteria | Automated suggestions are not human labels; discovery samples do not establish prevalence | J3, medium |

## 1. Scope and pinned versions

[measured] The latest-commit APIs for these repositories were read, then the returned SHAs were used to read the listed files. Dates are commit dates from the API, not project founding or method publication dates.

| Repository | Pinned SHA | Commit date | Main reading scope |
| --- | --- | --- | --- |
| `obra/superpowers` | `2ce8aa15d05bd57213e6f746f953aafb7ded7a8b` | 2026-10-21 | Bodies of `writing-skills` and `brainstorming` |
| `vercel-labs/agent-skills` | `063bee94c3f4df8453406c830b0a7df0f2860278` | 2026-08-28 | README and bodies of `react-best-practices` and `vercel-optimize` |
| `ai-evals-course/evals-skills` | `80d5f7b0127c7572ed9e9339937adbfd7240ffeb` | 2026-09-24 | `evals-start`, `error-discovery`, its review loop, and `validate-evaluator` |

These are purposively selected samples with public methods and inspectable implementations, not a star ranking or exhaustive survey. No external skills were installed or executed, and no models were called to compare effectiveness.

## 2. Superpowers: treat process instructions as behavioral interventions to test

### Evidence

[official] `writing-skills` compares skill authoring to test-driven development for process documentation: observe how an agent fails without the skill, record its behavior and explanation, write minimal guidance targeting those failures, and rerun. [S1]

[official] It distinguishes test targets. Discipline skills test adherence under pressure; technique skills test transfer to new situations; pattern skills test recognition, application, and counterexamples where they should not apply; reference skills test finding and correctly using information. Reciting a rule is not the same as executing it. [S1]

[official] The current version further distinguishes failure shapes. Violating a known rule under pressure may call for explicit prohibitions and prompts addressing common rationalizations. Incorrect output shape favors a positive construction recipe; missing elements can become required output slots; conditional behavior should depend on observable conditions. The author reports wording comparisons, but their raw trial data were neither obtained nor rerun here; the effects are not universal laws for all models. [S1]

[official] Its wording-test guidance calls for realistic context, an unguided control, multiple independent samples, and human inspection of automatically flagged results. Variation across runs is also an observation target. Compliance in one run does not establish stable instruction behavior. [S1]

[official] `brainstorming` recognizes that users may not yet have fully formed intentions, while agents may overestimate their understanding. It requires reading existing material first, asking questions that can change the solution, and separating user statements from agent-added choices. The current version also permits direct execution of clear small tasks, lets users opt out of questions, and allows authorized throwaway prototypes to develop understanding. Other design paths retain written designs and approval. [S2]

### Recommendation for the project

[inference · J1] Meta Thinking is closer to a thinking pattern and interaction technique. Test appropriate use, changes to action, and non-intervention during healthy exploration. Add discipline constraints only when there is evidence of skipping a known necessary rule; do not add approvals, roles, or pressure-oriented language to every task just to imitate one authoring style.

[inference] Pressure tests should address our real risks: repeated questioning when the user wants fast progress; failure to respect a current correction because an old profile appears authoritative; or presenting a causal hypothesis as established fact when rushing toward an answer. Observe task outcomes and user burden, not just compliance with the written workflow.

### Relation to existing constraints

Retain the low frequency, low burden, and authorization boundaries in the [Meta Thinking guidance](../../../knowledge/meta-thinking/meta-thinking-guidance.md). Superpowers' full mandatory process reflects its product choices; this note does not import it into repository operating rules.

## 3. Vercel: domain value, priorities, and available evidence

### Evidence

[official] Vercel's React practices draw on production performance problems and prioritize impact: address request waterfalls and bundle costs before local optimizations. Conditional rules, explanations, and contrasting code examples help agents choose what to do first. This supplies domain judgment, not merely a generic instruction to write high-quality code. [S3][S4]

[official] The current `vercel-optimize` more explicitly requires production signals first, script-filtered investigation candidates, bounded code reading, framework-version and citation checks, and verification of recommendations. Conclusions must be downgraded when traffic, permissions, or observability are missing. Only the body was read; scripts and actual cost-benefit were not audited. [S5]

[official] Vercel's Next.js 16 evaluation reports 53% for both the no-documentation baseline and default skill, 79% when explicit instructions prompted skill use, and 100% for an always-present compressed documentation index. The skill was not invoked in 56% of default-condition cases. This tests access to version-matched documentation, not whether all skills are inferior to `AGENTS.md`. The numbers are author-reported, not reproduced here. [S6]

[official] The same article emphasizes behavioral assertions, removing test leakage, and invocation-order sensitivity. In its examples, exploring the project before consulting documentation outperformed applying documentation before understanding the project. The author treats persistent indexes and on-demand skills as complementary mechanisms. [S6]

### Recommendation for the project

[inference · J2] Knowing how to perform a task and obtaining guidance at the right moment are different problems. Test value after explicit loading, natural triggering, reference retrieval, and actual action separately. An offline evaluation with the complete package injected cannot establish reliable natural activation in a host.

[inference] Meta Thinking's interaction options should state selection criteria and expected observable changes. Identify an obstacle that matters to the next action before choosing an intervention; do not traverse every philosophical concept. When evidence cannot establish the cause, fact-checking or a reversible experiment may be more valuable than further discussion.

[inference] Domain skills can add value through specialized knowledge, version facts, or tools. Not every skill must change general model reasoning. Conversely, a skill offering only general reminders cannot borrow domain expertise's reputation as evidence of its own benefit.

### Relation to existing constraints

This aligns with the repository's separation of format checks, model behavior, and host integration. It does not recommend always loading the whole Meta Thinking text to improve triggering or importing Vercel's specialized data pipeline into this candidate.

## 4. Hamel and Shreya: involve human judgment in forming evaluation criteria

### Evidence

[official] The release article argues against selecting generic metrics or fully automated evaluation before examining actual data. Skills route according to the user's situation: audit an existing pipeline, or discover errors when traces exist but have not been analyzed. The authors explicitly require adaptation to one's own data and domain. [S7]

[official] `error-discovery` first understands the data, then helps people record free-text observations. Diverse and random samples help discover failure types, explicitly not estimate their frequency. The implementation includes substantial UI design guidance; it is not an example of achieving all its capabilities with a tiny prompt. [S8]

[official] The review loop assigns people concrete problem identification, while agents organize categories, find more examples, and extend sampling. Agent suggestions remain separate from human annotations and require acceptance. As people inspect more examples, criteria may change, requiring earlier records to be revisited. When new discoveries slow, the agent may suggest stopping or narrowing scope. [S9]

[official] `validate-evaluator` calibrates model judges against domain-expert labels, separates development and held-out test data, examines disagreements, and recalibrates after model or prompt changes. Its sample sizes and statistical thresholds are implementation choices, not fixed requirements for all skills in this project. [S10]

### Recommendation for the project

[inference · J3] An agent's own assertion cannot establish that an intervention helped. Initially inspect real answers, subsequent actions, and user feedback. Let users progressively articulate useful versus unhelpful behavior through comparison; agents organize patterns, not fabricate user preferences or successful outcomes.

[inference] For initial Meta Thinking trials, manually inspect C3 and C6 outputs before turning stable observed errors into repeatable checks. If an LLM judge is introduced later, first check its alignment with these judgments rather than immediately adding an apparently objective aggregate score.

[inference] Profiles and evaluations must both separate observation, inference, and confirmation. Profiles containing only stalled events and deliberately selected failure samples cannot establish everyday prevalence. Automatically generated suggestions must not silently become purported user feedback.

### Relation to existing constraints

This supports the existing [candidate evaluation](../../../incubator/meta-thinking/evaluation.md) rule against inventing follow-up feedback and aligns with the selective-sample limits of event profiles. This note creates no new scoring service or UI.

## 5. Boundaries of a synthesis with Matt's design philosophy

| Tradeoff | Shared concern | Project synthesis |
| --- | --- | --- |
| Concise or detailed | Content should change behavior or supply needed capability | Preserve necessary depth and load by task need; do not optimize only main-file length |
| Freedom or process | Reduce repeated failures | Constrain known failures and high-cost boundaries; retain freedom for exploration and reversible action |
| Positive guidance or prohibition | Instructions must work in practice | Default to stating what to do; retain necessary prohibitions; choose by failure type and tests |
| General or domain-specific | Reuse across instances | Generalize task relationships while obtaining concrete facts from the environment; domain skills may have explicit technical scope |
| Human decision or agent execution | Solve real user problems | Humans handle intent, values, and quality judgments; agents check facts, generate options, and organize evidence; authority remains task-specific |
| Automated scoring or human trials | Effectiveness claims require evidence | Machines check determinate rules; people inspect immature quality criteria; automated judgments need calibration |

[inference] Matt's pruning, Superpowers' pressure testing, Vercel's evidence constraints, and Evals Skills' human error discovery can form a shared authoring feedback loop. They do not require a large, complete evaluation process for every skill. Effort should match reuse value, failure cost, and current uncertainty.

## Judgment confidence

J1–J3 are all medium, 3.0: Owner 1 (explicit authorization to research and synthesize); Research 0.5 (public primary implementations and author research, without reproduction); Reasoning 1 (recommendations can become behavioral comparisons); Project history 0.5 (existing candidates and cases provide connections, but no new trial evidence). These scores express support, not success probabilities.

## Not verified

- No causal relationship was established between popularity, installation counts, instruction length, and task effectiveness.
- External skills were not run, and Superpowers' or Vercel's reported experiments were not reproduced.
- Not all referenced resources, scripts, or host integrations were audited; reading scopes are limited to those stated.
- No single human–AI allocation, test threshold, or mandatory workflow was shown to fit all domains.
- Meta Thinking's real triggering, intervention benefit, profile benefit, and long-term learning effects were not tested in this round.

## Decisions for the owner

No new product decision is required. This note supplies synthesis evidence; Meta Thinking retains the confirmed low-frequency, lightweight direction.

## Sources

- [S1 — Superpowers writing-skills](https://github.com/obra/superpowers/blob/2ce8aa15d05bd57213e6f746f953aafb7ded7a8b/skills/writing-skills/SKILL.md): body read for baselines, pressure tests, failure categories, and wording-test requirements.
- [S2 — Superpowers brainstorming](https://github.com/obra/superpowers/blob/2ce8aa15d05bd57213e6f746f953aafb7ded7a8b/skills/brainstorming/SKILL.md): intent clarification, direct execution, opt-out, prototypes, and design-approval branches.
- [S3 — Introducing React Best Practices](https://vercel.com/blog/introducing-react-best-practices): production experience, impact priorities, and example organization.
- [S4 — React best practices](https://github.com/vercel-labs/agent-skills/blob/063bee94c3f4df8453406c830b0a7df0f2860278/skills/react-best-practices/SKILL.md): current body's applicability, rule categories, and reference organization.
- [S5 — Vercel optimize](https://github.com/vercel-labs/agent-skills/blob/063bee94c3f4df8453406c830b0a7df0f2860278/skills/vercel-optimize/SKILL.md): body read; scripts neither executed nor audited.
- [S6 — AGENTS.md outperforms skills in our agent evals](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals): Next.js 16 evaluation design, results, order sensitivity, and author interpretation.
- [S7 — Evals Skills for Coding Agents](https://hamel.dev/blog/posts/evals-skills/index.html): Hamel Husain and Shreya Shankar's release article, read in full.
- [S8 — Error discovery](https://github.com/ai-evals-course/evals-skills/blob/80d5f7b0127c7572ed9e9339937adbfd7240ffeb/skills/error-discovery/SKILL.md): data understanding, interface, sampling, and interaction boundaries.
- [S9 — Review loop](https://github.com/ai-evals-course/evals-skills/blob/80d5f7b0127c7572ed9e9339937adbfd7240ffeb/skills/error-discovery/review-loop.md): human annotations, agent suggestions, changing criteria, and stopping judgments.
- [S10 — Validate evaluator](https://github.com/ai-evals-course/evals-skills/blob/80d5f7b0127c7572ed9e9339937adbfd7240ffeb/skills/validate-evaluator/SKILL.md): human calibration, data separation, disagreement analysis, and revalidation; statistical code was not verified.
- [S11 — Evals start](https://github.com/ai-evals-course/evals-skills/blob/80d5f7b0127c7572ed9e9339937adbfd7240ffeb/skills/evals-start/SKILL.md): routing based on existing traces, error understanding, and evaluation pipelines.
- [S12 — Superpowers pinned commit](https://github.com/obra/superpowers/commit/2ce8aa15d05bd57213e6f746f953aafb7ded7a8b): commit API used to verify version and time.
- [S13 — Vercel pinned commit](https://github.com/vercel-labs/agent-skills/commit/063bee94c3f4df8453406c830b0a7df0f2860278): commit API used to verify version and time.
- [S14 — Evals Skills pinned commit](https://github.com/ai-evals-course/evals-skills/commit/80d5f7b0127c7572ed9e9339937adbfd7240ffeb): commit API used to verify version and time.
