# Research: Evidence behind the tech-humanizer AI-writing markers

Date: 2026-11-12. Subject: Which primary-source evidence supports or contradicts the AI-writing markers that `tech-humanizer` uses, and how far the skill's own wording goes beyond that evidence. Context: The candidate skill rewrites technical documents, emails and chat messages to remove AI-shaped prose. Its marker references cite one editorial source and no measurement. The note feeds a decision on which claims to keep, soften or tag in `incubator/tech-humanizer/candidate/tech-humanizer/references/`.

Confidence markers:

- **[official]**: the relevant part of official docs, a specification, a tool's README, or a paper page was read.
- **[official · summary only]**: only an abstract or overview was read, or the page does not cover the detail.
- **[secondhand]**: a third-party description, such as a search result summary; not traced to a primary source.
- **[inference]**: the author's judgment, with no direct evidence.
- **[measured]**: the result of a command run on the stated date (here, 2026-11-12).

Two further labels apply in this note only:

- **unverified**: a claim from the author's prior knowledge of the literature. The owning source could not be opened in this session. Treat it as a lead to check, not as evidence.
- **[measured · local]**: a count taken from the skill's own files on 2026-11-12.

## Source access limit

No primary source could be opened in this session. `WebFetch` for `arxiv.org` and `en.wikipedia.org` failed with a DNS error, and a `curl` request to `arxiv.org` through the session proxy was refused with HTTP 403 (`CONNECT tunnel failed`). The proxy reported that the host is not allowed for this session. [measured] Both hosts must be allowed in the session network settings before the checks in "Not verified" can run. No web search was run, because search results are secondhand and the harness permits them only as leads.

Consequence: every statement about a paper below is **unverified**. Only the audit of the skill's own files (counts and wording) rests on read material. The note therefore cannot answer "is the evidence good". It answers "what the skill claims, what kind of source each claim needs, and where the skill's wording is already out of line with any plausible source".

## Overview

| Question                                          | Recommendation                                                                                                                                                                                                        | Strength of evidence                                    | Confidence                      |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------- |
| 1. Empirical studies of LLM lexical/style overuse | Not assessed against sources. Re-run once the hosts are allowed. Candidate studies are listed in "Not verified".                                                                                                      | none read                                               | unverified                      |
| 2. Evidence status of markers and lexicon entries | Treat 37 of 45 markers and all 28 `high_density_ai_vocabulary` terms as editorial or unsupported until a source is read. Tag the 5 residue markers as deterministic. Remove or source the `era` labels.               | strong for the counts; none for the evidence            | [measured · local], [inference] |
| 3. Reliability of detection and marker judgement  | Keep the skill's "style risk, not proof of authorship" rule. Add the false-positive and model-drift limits in plain words. Drop "Strong AI-writing tells" and "Why it reads AI-shaped" causal phrasing, or source it. | none read; the skill's own wording is checked           | [measured · local], [inference] |
| 4. Genre coverage (technical docs, email, chat)   | The skill extrapolates. It says it is distilled from an encyclopedia guideline and applies it to six other channels without any study of those channels. State this once in `ai-markers.md`.                          | strong that the skill extrapolates; none for the genres | [measured · local], [inference] |

## 1. Empirical studies of LLM lexical and stylistic overuse

### Evidence

No study was read. The list below names the studies the skill's claims would need to be checked against. Each description is **unverified** and written from prior knowledge; do not copy any number from it without opening the source.

| Study (owning source to open)                                                                                                                        | What it measured (unverified)                                                                                                                                 | Likely limit (unverified)                                                                                                                    |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Kobak et al., "Delving into ChatGPT usage in academic writing through excess vocabulary" (arXiv 2406.07016; later in a journal)                      | Words whose frequency in PubMed abstracts rose after 2022 against a counterfactual trend; reports excess words such as "delves", "showcasing", "underscores". | One domain (biomedical abstracts); frequency shift is not authorship; the paper's own list should be compared word by word with the lexicon. |
| Liang et al., "Mapping the increasing use of LLMs in scientific papers" and "Monitoring AI-modified content at scale" (arXiv 2404.01268, 2403.07183) | Population-level estimate of the share of LLM-modified text in papers and some other genres, using a distributional method, not per-document detection.       | Estimates a corpus fraction; cannot label one passage. Genre list must be read to see whether it includes anything like email or chat.       |
| Reinhart et al., "Do LLMs write like humans? Variation in grammatical and rhetorical styles" (arXiv 2410.16107)                                      | Grammatical and rhetorical feature frequencies in human text and in base and instruction-tuned model text.                                                    | Particular models and prompts; features that differ may not be the skill's markers.                                                          |
| Juzek and Ward, "Why does ChatGPT 'delve' so much?" (arXiv 2412.11385)                                                                               | Tests whether preference tuning explains the overuse of words such as "delve".                                                                                | Explains one family of words; says nothing about structure markers.                                                                          |
| Muñoz-Ortiz et al., "Contrasting Linguistic Patterns in Human and LLM-Generated News Text" (arXiv 2308.09067)                                        | Linguistic differences between human and LLM news text.                                                                                                       | News genre; older models.                                                                                                                    |

Whether each paper's stated corpus, dates, effect size and limits match this table is not known. [inference]

### Recommendation for the project

- Add a short evidence ledger to the research folder after the sources are readable: one row per paper with corpus, date range, measure, effect and stated limits, each marked [official].
- Until then, do not cite any of these papers in the skill package. The skill is not allowed to rely on an unread source.

### Relation to existing constraints

`AGENTS.md` requires time-sensitive claims to be verified against current official sources before a layout or release change. A lexicon with era labels is time-sensitive. It also requires reporting unavailable checks; this section is that report.

## 2. Evidence status of markers and lexicon entries

### Evidence

The skill states its source in `ai-markers.md`: it "distills the practical signals from Wikipedia's 'Signs of AI writing' guidance". That guidance is an editorial page written by volunteers to help editors. It is a field guide to what editors noticed, not a measurement, and a page like it has no stated sample, error rate or date-bounded corpus (not re-read in this session; this description of the page type is **unverified**). The skill cites no empirical paper anywhere in the five audited files. [measured · local]

Counts from the skill's files on 2026-11-12. [measured · local]

| Item                                                                        | Count | Note                                                                  |
| --------------------------------------------------------------------------- | ----- | --------------------------------------------------------------------- |
| Markers in `ai-markers.md` (C1-C10, L1-L8, S1-S12, I1-I5, M1-M5, W1-W4, K1) | 45    | Count of level-3 headings after removing the three severity headings. |
| `high_density_ai_vocabulary` terms                                          | 28    | 15 labelled era `2023-2024`, 8 `2024-2025`, 5 `ongoing`.              |
| `assistant_service_language` phrases                                        | 10    |                                                                       |
| `knowledge_cutoff_disclaimers` phrases                                      | 6     |                                                                       |
| `source_laundering_phrases`                                                 | 10    |                                                                       |
| `internal_reference_leaks` tokens                                           | 11    |                                                                       |
| `placeholder_patterns`                                                      | 10    |                                                                       |
| `inflated_formality` terms                                                  | 7     |                                                                       |
| `colloquial_jargon.map` pairs                                               | 7     | Slang-to-term map; a house style choice, not an AI marker.            |

Classification of the 45 markers. Evidence classes are the author's judgment from what each marker asserts [inference]; no class is confirmed by a source read in this session.

| Class                                                                                                                               | Markers                                                                                                                               | Count |
| ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| Deterministic residue: the string or token is itself the evidence that a tool produced the text, and no statistical claim is needed | I2 (knowledge-cutoff disclaimers), I3 (placeholder residue), M1 (raw markup), M2 (broken citation markup), M3 (retrieval-token leaks) | 5     |
| Plausible direct evidence in the literature; must be checked word by word or feature by feature                                     | L1 (AI vocabulary), C4 (dangling participial commentary), L5 (transition chains)                                                      | 3     |
| Editorial support only (a Wikipedia-style observation); no measurement known                                                        | C1-C3, C5-C10, L2-L4, L6-L8, S1-S12, I1, I4, I5, W1-W4, M4, M5, K1                                                                    | 37    |

The 37 editorial markers are listed by class in the table, not by hand-picked examples: that group includes `S4` (em dash), `S2` (decorative bold), `L4` (rule of three), `L3` (negative parallelism), `C7` (generic balance), `I1` (assistant service language) and `W1` (talk-page assistant tone). A reader may find some of them accurate. Accurate is not the same as evidenced.

Specific entries and what is wrong or unknown with them:

- `high_density_ai_vocabulary`: all 28 terms are **unverified**. At least five are ordinary technical vocabulary (`robust`, `key`, `enhance`, `highlight`, `landscape`; `robust` is also a statistics and systems term). The skill protects accepted technical terms through `technical-terms.json` but does not state which of the 28 have a measured excess and which came from the editorial list. The `align with` entry has the same ambiguity.
- `era` labels (`2023-2024`, `2024-2025`, `ongoing`): no source for any of the 28 labels exists in the audited files, and none was found in this session. Treat them as unsupported. An era label implies a dated, measured shift; that is a stronger claim than the skill can back. [inference]
- `assistant_service_language` and `knowledge_cutoff_disclaimers` (16 phrases): these are characteristic of chat-assistant output pasted into a document. They are residue, which is a sounder claim than style. They are also normal human phrases: "Happy to help", "Feel free to ask" and "Let me know if you need anything else" appear in ordinary customer-service and business email. Presence is not evidence of generation. [inference]
- `source_laundering_phrases` (10): "studies show", "experts argue" and "many believe" are long-standing human rhetoric problems. Flagging them as a writing-quality issue (no named source) is defensible; calling them AI-shaped is not shown. [inference]
- `internal_reference_leaks` (11) and `placeholder_patterns` (10): deterministic residue; they need no statistical source. The set of tracking strings (`utm_source=chatgpt.com`, `referrer=grok.com`) is product-specific and will age; a vendor change makes an entry stale without notice. [inference]
- `bucket-quickref.md` weights (5, 2, 2, 1 points) and thresholds (5 per paragraph, 12 per document): no source and no calibration run appears in the audited files. The Structure bucket (5 points) lists no marker IDs, so its weight is attached to nothing checkable. These numbers are heuristics, and the file does call them guides. [measured · local], [inference]

### Recommendation for the project

- Tag each marker in `ai-markers.md` with an evidence class: `residue`, `measured` (with a source link once read) or `editorial`. The five residue markers keep their High severity. The 37 editorial markers should not be described as "strong tells".
- Split the 28-term vocabulary list into two arrays when sources are read: terms with a measured excess (with source) and terms that come only from the editorial list. Drop the `era` field, or replace it with the study's measured date range.
- Add marker IDs to the Structure bucket or lower its weight to match its checkability.

### Relation to existing constraints

`technical-terms.json` protects domain words and is covered in the [terminology audit](technical-terminology-audit-2026-10-19.md). The two notes do not overlap: that audit is about not paraphrasing terms, this one is about whether a flagged word deserves a flag.

## 3. Reliability of AI-text detection and marker-based judgement

### Evidence

No study was read, so the following are **unverified** leads from prior knowledge:

- Studies of automated detectors (for example Liang et al., "GPT detectors are biased against non-native English writers", arXiv 2304.02819; Sadasivan et al., "Can AI-Generated Text be Reliably Detected?", arXiv 2303.11156; Weber-Wulff et al., "Testing of detection tools for AI-generated text", arXiv 2306.15666) are reported to find false positives on human text, a higher false-positive rate for non-native English writers, and loss of accuracy after paraphrasing. The OpenAI classifier was withdrawn for low accuracy (the publisher's own page should be opened to confirm).
- Whether human readers' marker judgement is reliable is a separate question. One line of work (Russell et al., arXiv 2501.15654) reports that heavy ChatGPT users judge better than non-users, which would not support the claim that a marker list works for everyone. Not read.
- Model style drifts. A fixed lexicon dated to 2023-2025 is likely to decay as models are retrained. No measurement of drift was read.

What the skill itself says, read from its files. [measured · local]

- `ai-markers.md` "Detection Notes": "A passage can be human-written and still contain markers; report it as a style risk, not proof of authorship." This is correct and is the most important sentence in the audited set.
- `SKILL.md` line 32: "Report marker density only when requested; it measures flagged sentences, not authorship."
- "Operating Rules": "Treat clusters as stronger evidence than isolated words." This is a claim about evidential strength with no source. It is also the only support for density scoring. [inference]
- "Operating Rules": "Separate 'AI-shaped' from 'bad writing'... improve the prose without accusing the writer." Aligned with the false-positive risk.
- The "Why it reads AI-shaped" paragraphs (C1-C10 and others) state causes as fact: "LLMs often add historical weight when they do not have a specific fact to anchor the claim", "LLMs often avoid repeating nouns by rotating synonyms". These are hypotheses about model behaviour. None is sourced. [inference]
- The "Medium" severity heading says "Strong AI-writing tells when repeated". This wording makes a claim about discriminating power that no read source supports. [inference]
- The skill does not mention non-native writers, formal-register writers, or the effect of new model versions. `L6` (inflated formal register) and `L1` target vocabulary that non-native and formal writers use often; the false-positive risk is highest exactly there. [inference]

The skill does not state that marker density is proof of authorship. The only authorship statements in the audited files deny it. The risk is indirect: scored output (points, density percent, "Strong AI-writing tells") will read as a verdict to a person who never reads the disclaimer.

### Recommendation for the project

- Keep "style risk, not proof of authorship" and the density sentence in `SKILL.md`. Put the same sentence in the template named in `SKILL.md` (`assets/detection-report-template.txt`) so it travels with any density figure.
- Add one sentence to "Detection Notes": markers can appear in human text, especially formal and non-native English; model styles change; the marker list is a prioritised editing aid and cannot be used to judge who wrote a text.
- Reword "Strong AI-writing tells" to "Patterns that read as generic when repeated", and reword each "Why it reads AI-shaped" to "Why it weakens the text" (vague, unsupported, padded). This keeps the editing value, removes the causal claim, and costs nothing: every fix in the file is a plain editing fix.

### Relation to existing constraints

`docs/prompt-evaluation.md` and `npm run eval` are the only permitted route to a quality score; a marker-density number is not an evaluation score. The [evaluation framework note](eval-framework-selection-2026-10-19.md) covers how to measure rewrite quality; this note covers whether the diagnosis is sound.

## 4. Genre coverage: technical documents, email, chat

### Evidence

The skill's own text sets its scope: technical documents, emails, chat messages, release notes, PR text and collaborative writing (`ai-markers.md`, first paragraph). Its only named source is an encyclopedia editing guide, so its markers come from encyclopedia and talk-page prose. Visible signs: sections W1-W4 (talk page and edit summaries), S12 (list glyphs), M2 (wiki markup) and several C-markers framed around history, tourism and legacy (C1, C3). [measured · local]

Likely genre of the studies named in section 1 (all **unverified**): academic and biomedical abstracts, scientific papers, news text. Whether any study covers technical documentation, email or chat could not be checked and was not searched. This note does not claim "not found", because no search was possible. [inference]

Where the skill extrapolates (all [inference]):

| Skill claim                                                                       | Source genre it likely rests on   | Gap                                                                                                   |
| --------------------------------------------------------------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------- |
| C1/C3 importance and promotional framing applies to release notes and design docs | Encyclopedia, tourism-style prose | Release notes and design docs are not read as encyclopedia entries; the effect is unmeasured.         |
| L1 vocabulary applies to technical design documents                               | Abstracts and encyclopedia        | Technical writing legitimately uses "robust", "key", "enhance", "highlight"; base rates unknown.      |
| I1 service language marks AI output in email and chat                             | Chat-assistant transcripts        | The same phrases are common human business-email closings.                                            |
| W1-W4 comment and edit-summary markers apply to PR and issue comments             | Wikipedia talk pages              | Code-review tone differs; no source.                                                                  |
| K1 over-commented code                                                            | Editorial observation             | No source named in the files.                                                                         |
| S1-S12 formatting markers apply across all channels                               | Chat-assistant output style       | Formatting is a property of the assistant interface, not of a genre; it also varies by model version. |

### Recommendation for the project

- In `ai-markers.md`, add a "Scope of evidence" paragraph: the markers come from an editorial guide and were not validated for technical documents, email or chat.
- Prefer rewrites justified by the text's own failure (vague, unsupported, padded, wrong register for the channel) over rewrites justified by AI resemblance. The five residue markers are the only ones where "AI-made" is itself the reason.
- Where `channel-style.md` sets channel defaults, label them as house style choices, not findings.

### Relation to existing constraints

`SKILL.md` already requires claims to stay within supplied evidence and the final rubric requires "Evidence" to pass. Applying the same rule to the skill's own references is consistent with that.

## Not verified

- Every statement about a paper, dataset or publisher page: corpora, dates, effect sizes, limits, and the results of detector studies. The owning pages could not be opened (arXiv and Wikipedia are not reachable from this session).
- The content of the Wikipedia page "Signs of AI writing": its stated status, its caveats, its vocabulary list and whether it cites studies. The page type is described from prior knowledge only. Whether each of the 28 lexicon terms appears on that page was not checked, nor was the origin of the `era` labels.
- Whether any of the studies in section 1 covers email, chat or technical documentation.
- Whether the OpenAI classifier withdrawal page says what section 3 attributes to it.
- Whether newer models have changed the frequency of any of the 28 terms.
- The evidence class of each of the 37 editorial markers beyond the author's judgment.
- No claim of the form "no evidence exists" is made; only "none was read".

## Decisions for the owner

- Allow `arxiv.org` and `en.wikipedia.org` in the session network settings so the checks above can run, or supply the papers as local files.
- Decide whether a marker without a read source may stay in the skill as `editorial`, or whether editorial markers should be removed from the default pass and kept only as optional hints. This is a preference about aggressiveness.

## Sources

- No page was successfully opened for this note. The audited material is local:
- `incubator/tech-humanizer/candidate/tech-humanizer/references/ai-markers.md`: the 45 markers, severity levels, operating rules and detection notes (read in full).
- `incubator/tech-humanizer/candidate/tech-humanizer/references/ai-style-lexicon.json`: the 28-term vocabulary list with era labels and the phrase lists (read in full; counts by `jq`).
- `incubator/tech-humanizer/candidate/tech-humanizer/references/bucket-quickref.md`: bucket weights and thresholds (read in full).
- `incubator/tech-humanizer/candidate/tech-humanizer/references/rewrite-playbook.md`: transformation patterns (read in full).
- `incubator/tech-humanizer/candidate/tech-humanizer/references/final-rubric.md`: completion criteria (read in full).
- `incubator/tech-humanizer/candidate/tech-humanizer/SKILL.md`: the density statement on line 32 (searched for claim wording only).
