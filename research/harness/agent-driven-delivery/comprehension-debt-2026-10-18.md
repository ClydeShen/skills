# Research: Comprehension debt in agent-driven delivery

Date: 2026-10-18. Subject: What independent external sources say about comprehension debt: its definition and origin, the evidence that it is real, why it matters more in a harness, and how to manage and reduce it. Context: The repository already defines the term ([GLOSSARY.md](../../../GLOSSARY.md)) and has agreements F8 and F9 ([human-team-in-loop.md](../../../knowledge/harness/human-team-in-loop.md)). This note checks which external practices the repository covers, where it has gaps, and where it conflicts.

Confidence markers:
- **[official]**: the relevant part of official docs, a specification, a tool's README, or a paper page was read.
- **[official · summary only]**: only an abstract or overview was read, or the page does not cover the detail.
- **[secondhand]**: a third-party description, such as a search result summary; not traced to a primary source.
- **[inference]**: the author's judgment, with no direct evidence.
- **[measured]**: the result of a command run on the stated date (for example, a package registry API).

Reading note: [official] here means the author's own page (blog post, paper page, lab report page) was opened with a fetch tool. The fetch tool returns a model summary of the page, so quotes are as the tool reported them and were not compared against the raw page.

## Overview

| Question | Recommendation | Strength of evidence | Confidence |
|---|---|---|---|
| 1. Definition, origin, difference from neighbours | Keep "comprehension debt" as the canonical term. Jason Gorman used it first (2025-09-30); Addy Osmani popularized it (2026-03-14). It is a practitioner term with no formal definition or measure. Treat "cognitive debt" (Storey) as the team-level sibling, not a synonym. | medium (term origin is documented; the concept is not standardized) | [official] |
| 2. Is it real? | The mechanism has direct experimental support (Anthropic trial, MIT preprint) and one qualitative field study. No study measures comprehension debt in a professional agent-driven team. Say "plausible and partly supported", not "proven". | weak to medium | [official] |
| 3. Why it matters more in a harness | Review throughput, not generation speed, is the limit. Green checks give false confidence. The cause is structural, so address it in the workflow, not by exhortation. | medium for the review bottleneck (vendor telemetry); weak for the effect on comprehension | [official] for sources; [inference] for the link |
| 4. How to manage and reduce it | Use three groups: prevention (intent first, active use of AI, one person owns understanding), detection (comprehension checks, experiential signals, review share), repayment (rationale records, walkthroughs, hand-written work). Most practices come from essays; none has outcome data. | weak | [official · summary only] |
| 5. Fit with the repository | Covered: accountability, review sampling, review capacity, tests are not enough. Gaps: comprehension is never tested, intent and rationale capture, key-person dependence, how people use agents. One tension: F8 samples non-critical changes, while Storey asks for one person to understand every change. | n/a (comparison) | [inference] |

## 1. Definition, origin, and neighbouring concepts

### Evidence
- **Jason Gorman, "Comprehension Debt: The Ticking Time Bomb of LLM-Generated Code", Codemanship blog, 2025-09-30** (the page also shows an update dated 2026-04-14). Opened. He writes that when teams produce code faster than they can understand it, it creates "comprehension debt", the extra time it takes "to understand it first" before changing it. Claims: time saved by an assistant is often cancelled by downstream effort; some teams commit unread, lightly tested code; "doom loops" are common; humans will have to edit the code at some point. The post is diagnostic and gives no explicit prescriptions. No data is given. [official]
- **Addy Osmani, "Comprehension Debt - the hidden cost of AI generated code", 2026-03-14.** Opened. Definition: "the growing gap between how much code exists in your system and how much of it any human being genuinely understands." He says it differs from technical debt because it gives false confidence: the codebase looks clean and the tests are green until the cost comes due. The page does not mention Gorman. Some popular articles credit Osmani with coining the term; the Gorman post predates his by about five months. [official]
- **Margaret-Anne Storey, "cognitive debt", 2026-02-09, and "cognitive debt revisited", 2026-02-18.** Opened. Cognitive debt is understanding lost in developers' minds, not defects in code: "Technical debt lives in the code; cognitive debt lives in developers' minds." The revisited post defines it as the "accumulated gap between a system's evolving structure and a team's shared understanding." The unit is the team's shared theory, not an individual's reading of code. She builds on Naur. [official]
- **Ahmad, "Comprehension Debt in GenAI-Assisted Software Engineering Projects", arXiv 2604.13277, submitted 2026-04-14** (EASE 2026 Companion). Abstract page opened. Defines the term as the growing gap between what a team knows about its codebase and what it needs to understand to maintain and change it. It says the debt "resides in the collective cognition of development teams rather than in the codebase itself". The page cites no source for the term's origin. A search result states the paper attributes the term to Gorman; that was not confirmed on the page. [official · summary only] for the abstract; [secondhand] for the attribution.
- **Kosmyna et al., "Your Brain on ChatGPT: Accumulation of Cognitive Debt when Using an AI Assistant for Essay Writing Task", arXiv 2506.08872** (v1 2025-06-10, v2 2025-12-31 per a search result). Abstract page opened. This is "cognitive debt" in an essay-writing setting, not in software. It is a different use of the word "debt": reduced engagement and recall, not a maintenance gap. [official · summary only]
- **Peter Naur, "Programming as Theory Building" (1985).** The PDF fetch failed. A reader's notes page that quotes Naur was opened. Thesis as reported: working on a program depends on a "theory" in the developers' minds (the ability to explain the program and reason about changes), which code and documents "seldom" supply alone. [secondhand] Storey's post cites Naur directly [official for her citation]. The "death and revival" ideas were not confirmed from a source that quotes Naur [secondhand].
- **Ward Cunningham, the debt metaphor for technical debt.** Both attempts to open a primary page failed (a video page and the c2 wiki). Not verified (see below).
- **Cognitive load** (Sweller). Not searched and not opened. Not verified. [inference]: cognitive load is a momentary demand on working memory; comprehension debt is an accumulated, deferred gap.

Distinctions, as supported by the sources above:

| Concept | Where the gap sits | Visible to tools? | Source |
|---|---|---|---|
| Technical debt | In the code | Partly (static analysis, tests) | Storey; Osmani |
| Comprehension debt | Between the code that exists and what any person understands | No | Gorman; Osmani |
| Cognitive debt (Storey) | Between the system and the team's shared theory | No | Storey |
| Cognitive debt (Kosmyna) | In an individual's recall and engagement after LLM use | EEG and recall tests in a lab | Kosmyna et al. |

Osmani calls comprehension debt "also called cognitive debt". Storey's definition is about shared team understanding, and the MIT use is about individual cognition. The labels overlap in use but do not mean the same thing. [inference]

### Recommendation for the project
- Keep the canonical term in [GLOSSARY.md](../../../GLOSSARY.md). Credit Gorman as first use and Osmani as popularizer if a source line is ever added. Do not change the glossary without the owner's approval (see Decisions).
- Do not treat the term as a measured quantity. No source gives a unit.

### Relation to existing constraints
The glossary definition says "code that the team has read and can explain". Osmani and Gorman use "understand"; Storey uses "shared understanding". "Read" is a proxy for "understand" (see section 5).

## 2. Evidence that it is real

### Evidence
- **Anthropic, "AI assistance and coding skill formation" (research page, published 2026-01-29 per a search result; Osmani cites it as arXiv 2601.20245).** Page opened. Randomized controlled trial, 52 software engineers (mostly junior; Python weekly for over a year; unfamiliar with the Trio library). The AI group scored 50% against 67% on a quiz (Cohen's d = 0.738, p = 0.01), about two letter grades. The speed gain of about two minutes was not statistically significant. The largest gap was on debugging questions. Low scorers (below 40%) delegated code writing or relied on AI to debug. High scorers (65% or more) generated code and then asked follow-up questions, asked for explanations with the code, or asked only conceptual questions. The pattern groups cover 24 of 52 participants and the authors say the pattern analysis does not show causation. Limits: small sample; quiz measured soon after the task; coding tasks only; the AI was a chat sidebar, not an agent (the authors expect agentic tools to give "more pronounced" effects). It measures learning a new library, not understanding of a team's own codebase. [official]
- **Osmani's "below 40% / above 65%" figures** are his summary of the pattern groups above; he gives no source for them on the page. They are small-n subgroups (4 and 2 to 7 people per pattern). [official] for what he wrote; weak evidence.
- **Kosmyna et al. (MIT Media Lab).** 54 participants completed sessions 1 to 3; 18 completed session 4. EEG connectivity was weakest for LLM users; self-reported ownership was lowest; LLM users had trouble quoting their own essays. A search result gave "83% could not quote a sentence against 11%"; that was not on the abstract page. Preprint status, essay task, small sample. The abstract gives no effect sizes. [official · summary only]; the 83% figure is [secondhand].
- **Ahmad (arXiv 2604.13277).** Qualitative study of 621 reflective diaries from 207 undergraduate students over eight weeks. Four accumulation patterns: AI as black box, context mismatch, dependency-induced atrophy, verification bypass. One mitigating pattern: using the AI as a comprehension scaffold. Students, self-reported diaries, no outcome measure. [official · summary only]
- **Storey's field example:** a student team could not make simple changes by week 7 or 8 because "the theory of the system" had fragmented. Anecdote from one course. Willison reports the same experience on his own projects after prompting features without reviewing the code ("getting lost in my own projects"). Anecdote. [official]
- **METR, early-2025 trial (2025-07-10).** 16 experienced developers, 246 issues, mature repositories. With AI allowed they took 19% longer, while expecting a 24% speedup and afterwards believing in a 20% speedup. The authors report similar PR quality with and without AI. This is evidence about the gap between perceived and measured effect, not about comprehension. [official]
- **METR update (2026-02-24).** Second study: 57 developers, 143 repositories, over 800 tasks. Point estimates of -18% (returning developers) and -4% (new developers), where negative means speedup; both intervals include zero. METR calls its own data "an unreliable signal" because of selection effects. Useful here only as a warning: self-reported speed is unreliable, and speed data says nothing about comprehension. [official]
- **Not found:** no study that measures comprehension debt, or a proxy for it, in a professional team that uses coding agents. [inference] from the searches run; absence is not proven.

### Recommendation for the project
Describe the evidence as follows in any shared document: "One randomized trial (52 engineers, chat assistant, new library) shows lower comprehension and no significant time saving when AI was used for passive delegation. The effect in agent-driven teams is not measured."

### Relation to existing constraints
The repository's rationale in F8, F9, and the delivery-health signal ([issue-workflow-standard.md](../../../knowledge/harness/issue-workflow-standard.md), section 8) states the risk without a source. This note supplies sources and limits for it.

## 3. Why it matters more in a harness

### Evidence
- **Generation outruns evaluation.** Osmani: "AI generates code far faster than humans can evaluate it" and "What used to be a quality gate is now a throughput problem." [official] Storey: "As AI reduces technical friction, shared understanding may become the bottleneck on performance." [official]
- **Review is where load shows up.** Faros Research, "The AI Productivity Paradox Report 2025" (2025-07-23): for high-adoption teams, PR review time rose 91%, average PR size rose 154%, bugs per developer rose 9%. Telemetry from over 10,000 developers in 1,255 teams. Correlational (Spearman); no company-level effect found; most developers used only autocomplete; the publisher is a vendor that sells engineering analytics. The report page was opened. [official]; strength weak to medium. A figure from a 2026 Faros edition appeared in search results and was not opened [secondhand].
- **Green checks mislead.** Osmani: "Tests are necessary. They are not sufficient." He says velocity, DORA metrics, PR counts, and coverage cannot see a comprehension deficit. Specs help but cannot capture every implicit decision. [official] Storey: documents "are not sufficient if they are not living artifacts." [official]
- **Overall delivery effect is mixed.** DORA 2025 (Google Cloud blog summary opened; the full report was not): 90% AI adoption; over 80% report higher productivity; AI adoption is linked to higher throughput; 24% have a great deal or a lot of trust in AI output; AI is "a mirror and a multiplier". The blog page gives no instability figure. [official · summary only]
- **Doom loops.** Gorman: repeated failed fixes by the LLM are common, and humans must eventually edit the code. [official]
- **Tools in the Anthropic study were a chat sidebar.** The authors expect agentic tools such as Claude Code to give more pronounced effects. This is a hypothesis, not a finding. [official]

Mechanism, as the author's judgment [inference]: in a harness, agents add code at a rate set by compute, while understanding is added at a rate set by human attention. Checks (tests, linters, verifier agents) pass or fail code; they do not transfer understanding to people. A growing share of passing but unread code produces false confidence. The existing playbook already names human attention as the limit (F6); this note adds that the unread remainder is the debt.

### Recommendation for the project
State in the playbook that checks do not reduce comprehension debt. The rationale for the human-reading item in [setup-checklist.yaml](../../../knowledge/harness/setup-checklist.yaml) already says so; keep it.

### Relation to existing constraints
Consistent with F6, F8, F9 and the "Work that waits for human verification" signal.

## 4. Systematic management and reduction practices

Strength rating: **strong** = tested in a controlled study with outcome data; **medium** = supported by a study of related behavior, or by several independent practitioner sources; **weak** = one practitioner essay or an inference; none is rated strong because no practice has outcome data in this domain.

### Prevention

| Practice | Source | Strength |
|---|---|---|
| Use AI for conceptual questions and for explanation with the code, not for passive delegation ("just make it work"). | Anthropic trial: the high-scoring patterns; Osmani | medium (randomized trial for the overall effect; the pattern link is not causal) |
| Do not skip the struggle when learning something new; errors that people resolve themselves may build debugging skill. | Anthropic trial (authors' hypothesis) | weak |
| Define intent before code: say what a change should do before the agent writes it. | Osmani | weak |
| Require at least one person to fully understand each AI-generated change before it ships. | Storey | weak |
| Pair programming, refactoring, and test-driven development to slow down and keep a mental model. | Storey | weak |
| Keep writing and reading code by hand: "write code every day". | Gorman (quoted in a search result; not in the opened post) | weak [secondhand] |
| Deploy AI deliberately and add learning modes so engineers can still oversee AI-written code. | Anthropic trial: manager recommendation | weak |
| Treat prototypes as disposable. | Storey | weak |

### Detection and measurement

| Practice | Source | Strength |
|---|---|---|
| Test comprehension directly: a quiz on debugging, code reading, and concepts after the task. | Anthropic trial (research instrument, not a team practice); Ahmad recommends "active learning assessments" | weak as a team practice [inference] |
| Watch experiential signals: hesitation to change code, dependence on one or two experts, a "black box" feeling, loss of confidence in changes, heavier review burden, debugging friction, slower onboarding, stress and fatigue. | Storey (both posts) | weak (no data; she proposes no metrics) |
| Separate "the tests passed" from "I understand what this does and why". | Osmani | weak |
| Do not rely on velocity, DORA metrics, PR counts, or coverage as evidence of understanding. | Osmani | weak |
| Verification-bypass and black-box acceptance as patterns to look for in retrospectives. | Ahmad | weak |
| Measure review share: the portion of agent changes that a person read. | Not named by any external source opened. It is the repository's own signal. | none (see section 5) |

Both Osmani and Storey say that measurement is open. Storey lists "research how to measure cognitive debt" as future work. [official]

### Repayment

| Practice | Source | Strength |
|---|---|---|
| Document the reasoning behind changes, not only the changes. | Storey | weak |
| Write tests that capture intent. Keep design documents current. | Storey (revisited post) | weak |
| Hold regular checkpoints: code reviews, retrospectives, knowledge-sharing sessions to rebuild shared understanding. | Storey; Ahmad (structured retrospectives) | weak |
| Use agents to summarize and explain changes, while noting that human memory and capacity stay the limit. | Storey; Ahmad (AI as comprehension scaffold) | weak to medium (Ahmad's mitigating pattern comes from student diaries) |
| Keep and value engineers with deep system context who know the reasons behind past decisions. | Osmani | weak |
| Keep review discipline from distributed-team practice, even when the author is a model. | Osmani | weak |
| Keep specs, with the limit that they cannot capture every implicit decision. | Osmani | weak |

### Recommendation for the project
Ordered by cost and fit [inference]:
1. Add the "explain, not only generate" rule to agent working instructions (conceptual inquiry and follow-up explanation after generation). Source: Anthropic trial.
2. Require rationale capture for changes to contracts, core logic, security, and data (a short "why" in the issue or ADR). Source: Storey.
3. Add the experiential signals to retrospectives as questions (who can change X without fear; is there a single expert for Y). Source: Storey.
4. Do not claim any measure of comprehension. The review-share signal measures reading, not understanding.

### Relation to existing constraints
See section 5.

## 5. Comparison with the repository's treatment

### Evidence (what the repository says)
Searched with `grep -rniI "comprehension debt"` outside `.git` and `confluence/`. Hits:
- [GLOSSARY.md](../../../GLOSSARY.md): "The gap between the code that agents produced and the code that the team has read and can explain. It grows when people accept agent output without reading it" (F8 and F9).
- [human-team-in-loop.md](../../../knowledge/harness/human-team-in-loop.md): F8 (Recommended): read agent changes to contracts, core logic, security, and data before accepting them; read a sample of the other changes. F9 (Good to know): do not accept an agent change you cannot explain (what changed, why it is safe, how to undo it). F1, F2, and F6 (do not send more work than others can review) are related.
- [issue-workflow-standard.md](../../../knowledge/harness/issue-workflow-standard.md), section 8: the delivery-health signal "review sampling".
- [setup-checklist.yaml](../../../knowledge/harness/setup-checklist.yaml): a check that a person read the agents' changes to contracts, core logic, security, and data; "Checks prove that code passes; they do not make the team understand it".
- [harness-playbook-validation-2026-10-17.md](./harness-playbook-validation-2026-10-17.md): lists comprehension debt as a gap and cites Osmani's articles as [official · summary only]; it records that the Anthropic trial was not opened. This note opened it.
- [knowledge/harness/README.md](../../../knowledge/harness/README.md): change log entry of 2026-10-18.

### Mapping

| External practice | Status | Where |
|---|---|---|
| A person is accountable for agent output | Covered | F1, F2, F9 |
| Read changes to critical areas; sample the rest | Covered (no external source opened gives a sampling rule; Osmani and Storey do not state one) | F8 |
| Review capacity limits agent output | Covered; supported by Osmani and Faros | F6 |
| Tests and checks are not proof of understanding | Covered | setup-checklist item rationale |
| Review-share signal | Repository original; no external source found | issue-workflow-standard.md section 8 |
| Explain-back: be able to say what, why, and how to undo | Covered in part | F9 (Storey's "at least one person fully understands" is similar) |
| Use AI for conceptual inquiry and explanation after generation | Gap | Not in agent instructions |
| Test comprehension directly (quiz, walkthrough) | Gap | F9 is self-assessed |
| Record rationale and intent; keep it current | Gap in the comprehension context (the repository has ADRs and the handoff, but they are not tied to comprehension debt) | [project-document-map.md](../../../knowledge/harness/project-document-map.md) |
| Experiential signals (fear of change, single expert, slower onboarding) | Gap | No team health question |
| Key-person dependence and shared team theory | Gap | The glossary defines the debt for the team but no agreement addresses spreading it |
| Keep hand-writing code to keep skill | Gap (and probably out of scope for a delivery harness) [inference] | none |
| Disposable prototypes | Not examined in the repository | none |

### Tensions and contradictions
- **F8 sampling against Storey's "at least one person fully understands each AI-generated change".** F8 requires reading only critical changes and a sample of the rest. Storey's rule is stricter. This is a tension, not a contradiction, because F8 is scoped by risk; the owner decides the level (see Decisions). [inference]
- **"Read" against "understand".** The glossary and the review-share signal use reading as the measure. The Anthropic trial's low-scoring patterns include users who read or verified AI output without building understanding ("iterative AI debugging"). Reading is necessary but may not be sufficient. The trial tested participants on a chat assistant and a new library, so the transfer to reviewing agent diffs is [inference].
- **Level of F9.** F9 is "Good to know", F8 is "Recommended". Osmani and Storey treat understanding as non-negotiable. The levels are the owner's choice.
- **Team against individual.** The glossary frames the debt at team level ("the team has read"). Storey stresses shared theory in the team; Naur and Ahmad place the debt in people. F8 puts the duty on the person who starts the agent. No agreement covers sharing understanding between members. [inference]
- No external source opened contradicts a repository rule outright.

### Recommendation for the project
Smallest changes that would close the gaps, if the owner agrees [inference]:
1. In [human-team-in-loop.md](../../../knowledge/harness/human-team-in-loop.md) or the agent instructions: add an agreement to ask the agent to explain a change, and to ask conceptual questions, before accepting it.
2. In [issue-workflow-standard.md](../../../knowledge/harness/issue-workflow-standard.md), section 8: add a note that review share measures reading, not understanding, and add Storey's experiential signals as retrospective questions.
3. In [GLOSSARY.md](../../../GLOSSARY.md): consider an `_Avoid_` entry for "cognitive debt" (see Decisions).
Do not edit these files from this note without owner approval.

## Not verified
- Ward Cunningham's own definition of the debt metaphor: both attempts to open a primary page failed.
- Naur's 1985 paper: the PDF fetch failed; only a reader's notes page that quotes Naur was read. The "death and revival" statements are secondhand.
- Sweller's cognitive load theory: not searched.
- The full DORA 2025 report: only the Google blog summary was read. Review time and instability figures are not verified.
- Faros 2026 edition ("Acceleration Whiplash") and the LinearB figure: seen only in search summaries.
- The MIT paper's full text: only the abstract page. The 83% against 11% quote recall figure and the peer-review status are secondhand.
- Whether Ahmad (arXiv 2604.13277) credits Gorman: the abstract page does not say.
- Gorman's SE Radio 732 interview and the "write code every day" quote: seen in search results only.
- Osmani's "Loop Engineering" and "Own the Outer Loop" articles: not opened in this note; the earlier validation note records them as summary only.
- Latent Space "How to Kill the Code Review" and Simon Willison's other writing: not opened.
- Any study that measures comprehension debt in professional agent-driven teams: not found.
- Fetch results are model summaries of pages; exact wording was not checked against raw HTML.

## Decisions for the owner
- **Term scope:** keep "comprehension debt" alone, or add an entry or `_Avoid_` line to distinguish it from Storey's team-level "cognitive debt"? The glossary change needs your approval (AGENTS.md, item 5).
- **Strictness:** is F8's risk-scoped reading enough, or do you want Storey's "one person understands every agent change" for all changes? Also, should F9 move from "Good to know" to "Recommended"?
- **File location:** the request named `research/comprehension-debt-2026-10-18.md`. The existing notes live in `research/harness/agent-driven-delivery/`, so this note was placed there. Move it if you meant the research root.

## Sources
- https://codemanship.wordpress.com/2025/09/30/comprehension-debt-the-ticking-time-bomb-of-llm-generated-code/: Gorman's post; first use of the term found; opened.
- https://addyosmani.com/blog/comprehension-debt/: Osmani's definition, citations, and practices; opened.
- https://margaretstorey.com/blog/2026/02/09/cognitive-debt/: Storey's cognitive debt, warning signs, recommendations; opened.
- https://margaretstorey.com/blog/2026/02/18/cognitive-debt-revisited/: Storey's team-level definition and mitigations; opened.
- https://simonwillison.net/2026/Feb/15/cognitive-debt: Willison's first-hand experience; opened.
- https://www.anthropic.com/research/AI-assistance-coding-skills: the randomized trial, with numbers and limits; opened.
- https://arxiv.org/abs/2604.13277: Ahmad, diary study of 207 students; abstract page opened.
- https://arxiv.org/abs/2506.08872: Kosmyna et al., cognitive debt in essay writing; abstract page opened.
- https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/: METR 2025 trial; opened.
- https://metr.org/blog/2026-02-24-uplift-update/: METR 2026 update; opened.
- https://blog.google/technology/developers/dora-report-2025/: Google summary of DORA 2025; opened.
- https://www.faros.ai/blog/ai-software-engineering: Faros AI Productivity Paradox Report 2025 page; opened.
- https://www.ratfactor.com/papers/naur1: a reader's notes on Naur's paper; opened (secondhand for Naur).
