# Research: Event-triggered experience memory and lightweight user profiles

Date: 2026-10-25. Question: How can a low-frequency Meta Thinking skill remember stalls and breakthroughs without continuous profiling, fixed attribution or complex procedures? Context: the [original draft](./meta-ai-thinking-working-draft-2026-10-25.md) and subsequent user requirements for low-frequency use, structured profiles and lazy updates.

Current finding: [inference] Start with a few concrete events and their consequences, then form revisable pattern hypotheses from recurring evidence. Sparse updates suit short instructions, but recording only stalls and breakthroughs has no direct experimental validation here. Distinguish remembered experience, causal inference and generalized habits in meaning; separate files or workflows are not necessarily needed.

Markers: `[official]` means the relevant primary-paper text was read; `[inference]` means a project inference. No experiments were reproduced. Recommendations were unverified at this research stage; this note creates no profile, formal schema or released skill. Translated into English on 2026-10-28, preserving the historical findings and limits.

## Overview

| Question | Recommendation | Evidence strength | Judgment confidence |
| --- | --- | --- | --- |
| Record user types or specific experience first? | Traceable events, then contextual pattern hypotheses | Medium: related memory mechanisms and evaluation, not direct product validation | Medium, J1 |
| Can updates skip turns? | Consider writes only for important new information | Weak: threshold-triggered precedents use different signals | Medium, J2 |
| Does a breakthrough establish the root cause? | Separate observed change, causal hypotheses and verification | Medium: attribution difficulty is discussed; the project strategy is inferred | Medium, J3 |
| How can profiles stay revisable? | Retain time, context, evidence and correction paths; abstain when evidence is insufficient | Medium: long-term memory tasks support temporal reasoning, updating and abstention | Medium, J4 |

## 1. Reusable experience need not start with fixed user types

### Evidence

[official] Reflexion generates linguistic reflections from task feedback and places them in episodic memory to influence later attempts. Useful reflection requires correct attribution, depends on evaluation capability and does not guarantee success; experimental memory windows were limited. Methods, introduction and limitations were read. [S1]

### Recommendation for the project

[inference · J1] Build profiles around context, the stall, the attempted change and its outcome. “Comparing two concrete examples helped form preferences during an unclear design discussion” more directly informs action than “the user has a particular thinking type.”

[inference] One JSON or YAML file can distinguish event observations from pattern hypotheses. Leave the data structure open; first test the minimum information needed to avoid repeated failures in similar tasks. Extensive research does not imply loading every source or executing every method at runtime.

### Relation to existing constraints

Fits structured profiles and few steps. This note neither promotes candidate fields into shared terminology nor writes to a user directory.

## 2. Infrequent writes have precedents, but new information needs definition

### Evidence

[official] Generative Agents separates observations from abstract reflections, triggers reflection using accumulated importance of recent events, and stores pointers to cited observations. The paper also reports memory embellishment errors. Its aim is believable simulated behavior, not real-user efficiency. Architecture, reflection and error-analysis sections were read. [S2]

### Recommendation for the project

[inference · J2] Interpret “be lazy” as important events prompting consideration, not mandatory writes. Skip when experience is already recorded, causes remain unclear without new evidence, or the event has no visible future use. Do not transplant the source's numerical thresholds or reflection frequency.

[inference] Do not score the user every turn. Save a short lesson when a reusable change occurs. Extend an existing record with support, counterexamples or applicability instead of accumulating near-duplicates.

[inference] Recording only stalls and breakthroughs creates a selected event sample. It can retrieve important experience, not estimate usual thinking-pattern frequencies. Repeated “unclear goal” entries do not establish that the user usually lacks goals; many successful contexts may never be recorded.

### Relation to existing constraints

The user explicitly requested low-frequency maintenance after meaningful stalls or breakthroughs. This research supports a plausible direction, not an optimal threshold or update algorithm.

## 3. Attribution after a breakthrough should remain revisable

### Evidence

[official] Reflexion identifies error attribution as a difficulty in generating useful feedback. A coding ablation without test feedback produced harmful changes. That ablation and the limitations were read. [S1]

### Recommendation for the project

[inference · J3] “Progress followed a perspective change” initially records a sequence, not a uniquely established root cause. New facts, changed constraints or another generation attempt may explain the result. Record observed changes, candidate explanations and supporting evidence separately.

[inference] Agents may cause stalls by misreading goals, repeating answers or failing to check evidence. Recording only user problems can repeatedly misclassify system failures as user traits. One success suggests another attempt; repeated effectiveness across contexts better supports broader pattern hypotheses.

### Relation to existing constraints

Extends the distinction between feedback, criticism and verification in the [evidence-boundary record](./interaction-evidence-and-evaluation-2026-10-25.md). It does not require an additional formal root-cause process.

## 4. Memory includes updating and admitting uncertainty

### Evidence

[official] LongMemEval evaluates knowledge updates, temporal reasoning and abstention on unanswerable questions. In its tested settings, further compression into isolated user facts lost information; structured formats alone were not always better than natural language. Task definitions, memory granularity and retrieval experiments were read. [S3]

### Recommendation for the project

[inference · J4] Structured storage does not guarantee accuracy. Preserve when evidence arose, applicable tasks and counterexamples. Reduce confidence or revise when current observations conflict; avoid personalization when relevant profile evidence is absent.

[inference] Test whether a summary-only profile misuses stale experience more often than a short pattern linked to event evidence. Begin with a few historical cases testing traceability, bad transfer and correction, without first building a large memory system.

### Relation to existing constraints

Supports structured but revisable profiles. The benchmark primarily tests questions about interaction history; it does not establish reliable inference of thinking habits or causal mechanisms.

## Judgment confidence

Scores are Owner / Research / Reasoning / Project history, each 0–1. Totals record project support, not statistical probabilities.

| Judgment | Four scores | Total and level | Main gap |
| --- | --- | --- | --- |
| J1 Event evidence supports pattern hypotheses | 0.5 / 0.5 / 1 / 0.5 | 2.5, medium | No user-profile trial |
| J2 Event-triggered rather than per-turn writes | 1 / 0.5 / 1 / 0.5 | 3, medium | Optimal trigger unknown |
| J3 Separate causal hypotheses and observed outcomes | 0.5 / 0.5 / 1 / 0.5 | 2.5, medium | No causal comparison |
| J4 Preserve context, time and correction | 0.5 / 1 / 1 / 0.5 | 3, medium | Transfer from history QA to behavioral profiles unverified |

## Not verified

- Event-triggered updates have not been shown superior to periodic updates; fewer events do not necessarily improve results.
- Reliable stable-pattern inference from limited conversation is unverified; personality-inference research was not used as direct support.
- User-directory location, format, capacity, retrieval and expiry rules were not selected in this research.
- Long-term user efficiency is unproven. Evaluate memory accuracy separately from subsequent-action benefit.
- Only relevant paper sections were read; later research and code were not comprehensively reviewed. The Generative Agents PDF exceeded size limits, so the author's arXiv HTML was read instead.

## Decisions for the owner

No immediate decision was required in this round. Select directory location and maintenance mechanisms with the implementation host, rather than fixing them in this research note.

## Sources

These primary sources were opened on 2026-10-25; reading scope is stated above.

- [S1 — Reflexion, NeurIPS 2023 paper](https://papers.nips.cc/paper_files/paper/2023/file/1b44b878bb782e6954cd888628510e90-Paper-Conference.pdf): feedback, episodic memory, attribution difficulty and limits.
- [S2 — Generative Agents, author arXiv v2 text](https://arxiv.org/html/2304.03442v2): observations, reflections, importance triggers, evidence links and embellishment errors.
- [S3 — LongMemEval, ICLR 2025 paper](https://proceedings.iclr.cc/paper_files/paper/2025/file/d813d324dbf0598bbdc9c8e79740ed01-Paper-Conference.pdf): temporal updates, abstention, memory granularity and retrieval experiments.
