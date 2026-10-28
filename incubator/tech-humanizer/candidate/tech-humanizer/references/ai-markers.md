# AI Writing Marker Reference

This reference distills the practical signals from Wikipedia's "Signs of AI writing" guidance for technical documents, emails, chat messages, release notes, PR text, and collaborative writing.

Use the markers to locate concrete editing opportunities. Judge each passage against its purpose, technical meaning, and the user's voice.

## Contents

- Operating rules
- Severity levels
- Content markers
- Language markers
- Style and formatting markers
- Communication intent markers
- Markup, citation, and source markers
- Wikipedia/comment-style markers
- Code markers
- Humanization strategy
- Detection notes

## Operating Rules

- Treat clusters as stronger evidence than isolated words. One "robust" in a technical design doc is weak; "robust, intricate, pivotal, showcasing" in the same paragraph is strong.
- Preserve domain language before applying AI-vocabulary rules. Check [technical-terms.json](technical-terms.json).
- Do not invent facts to replace vague claims. If the source text lacks evidence, rewrite the sentence to be narrower or ask for the missing detail.
- Separate "AI-shaped" from "bad writing." Some human writing is vague, formal, or promotional; report the risk and improve the prose without accusing the writer.
- Prefer concrete edits over labels. "Replace 'stands as a testament' with the actual outcome" is more useful than "this sounds AI."

## Severity Levels

Use severity to decide how aggressively to rewrite.

### High

Repair artifacts that obstruct the target document:

- assistant service language in a final document;
- knowledge-cutoff or training-data disclaimers;
- leaked source/search tokens such as `turn0search0`, `oaicite`, `contentReference`;
- placeholder residue such as `[Your Name]`;
- fake or malformed citation syntax;
- Markdown/HTML/source markup leaking into prose;
- decorative list glyphs or typography that conflict with the target format.

Apply S4 and S5 according to the user's punctuation preferences and the document's typography.

### Medium

Strong AI-writing tells when repeated:

- grand importance claims with no evidence;
- vague attribution;
- high-density AI vocabulary;
- dangling participial commentary;
- formulaic balanced paragraphs;
- decorative formatting;
- rigid inline-header lists;
- excessive hedging;
- trivial code comments that restate what the line already says.

Action: rewrite when the text has more than one signal, or when the passage is meant to sound like a human author.

### Low

Weak signals that depend heavily on context:

- one formal transition word;
- one em dash;
- one three-item list;
- one "note that" in documentation;
- a table used for real comparison.

Action: preserve when useful. Rewrite only when it contributes to an artificial pattern.

## Content Markers

### C1. Unsupported Importance or Legacy Claims

Signals:

- "stands as a testament"
- "pivotal moment"
- "enduring legacy"
- "underscores its importance"
- "landmark achievement"
- "of paramount importance"
- "defining moment"
- "speaks to the significance"

Why it reads AI-shaped:

The sentence asserts significance instead of demonstrating it. LLMs often add historical weight when they do not have a specific fact to anchor the claim.

Fix:

- Replace the claim with a specific fact, consequence, metric, date, shipped behavior, or observable result.
- Delete the grand framing when no evidence is available.

Example:

- AI-shaped: "The release stands as a testament to our engineering excellence."
- Humanized: "The release cut median API latency from 280 ms to 140 ms."

### C2. Vague Attribution

Signals:

- "Experts argue"
- "Observers note"
- "Industry reports suggest"
- "Studies show"
- "Research suggests"
- "Many believe"
- "It is widely accepted"
- "Analysts say"
- "Some have noted"

Why it reads AI-shaped:

It borrows authority without naming the authority. Wikipedia specifically treats vague expert framing as suspect because it resembles generated filler and weak sourcing.

Fix:

- Name the source, date, and finding if the source is real.
- Otherwise rewrite as the author's own reasoned position.

Example:

- AI-shaped: "Experts argue that retries improve reliability."
- Humanized: "Retries reduce transient failures when the upstream service recovers quickly."

### C3. Promotional or Tourism-Like Framing

Signals:

- "boasts"
- "vibrant"
- "nestled"
- "groundbreaking"
- "revolutionary"
- "cutting-edge"
- "state-of-the-art"
- "world-class"
- "game-changing"
- "unparalleled"
- "renowned"
- "rich history"
- "charming"
- "bustling"

Why it reads AI-shaped:

Generated prose often defaults to tourism, marketing, or brochure language when it lacks concrete details.

Fix:

- Replace hype with concrete details: what changed, who uses it, how much, how fast, where, or under what constraint.
- If no concrete detail is known, use neutral description.

### C4. Dangling Participial Commentary

Signals:

- Sentence-final commentary beginning with "highlighting", "showcasing", "demonstrating", "underscoring", "reflecting", "emphasizing", "illustrating", "signalling", "marking", or "cementing".

Why it reads AI-shaped:

The trailing phrase often restates the sentence and adds interpretive gloss instead of information.

Fix:

- Delete the trailing phrase when it restates the sentence.
- If it adds useful meaning, rewrite it as a separate concrete claim.

### C5. Template Openers and Essay Structure

Signals:

- "In the realm of..."
- "In today's fast-paced landscape..."
- "At its core..."
- "It is worth noting that..."
- "This article will explore..."
- "This section will discuss..."
- "Despite its X, Y faces challenges..."
- "In conclusion..."
- "Looking ahead..."
- "From X to Y, ..."

Why it reads AI-shaped:

The structure announces a generic essay frame before making the point. In technical or collaborative writing, humans usually start with the claim, request, risk, or decision.

Fix:

- Start with the actual claim or action.
- Remove meta-commentary about what the text will do.

### C6. Elegant Variation

Signals:

- Artificial synonyms used to avoid repetition: "software artisan" for developer, "data persistence repository" for database, "application programming interface entrypoint" for API, "keyboard wrangler" for developer, "digital tapestry" for system, "computational engine" for server.

Why it reads AI-shaped:

LLMs often avoid repeating nouns by rotating synonyms. In technical writing, repeated precise terms are usually clearer.

Fix:

- Standardize on the simplest accurate term.
- Repeat the technical noun when repetition is clearer than synonym-chasing.

### C7. Generic Balance Without Judgment

Signals:

- "While X offers many advantages, it also presents challenges..."
- "X has both benefits and drawbacks..."
- "There are several factors to consider..."
- Paragraphs that list pros and cons without choosing a position or naming criteria.

Why it reads AI-shaped:

Generated text often hedges toward balanced neutrality even when the task needs a decision, recommendation, or specific tradeoff.

Fix:

- Name the actual tradeoff, affected user, and decision criteria.
- If the user asked for a recommendation, make one.

### C8. Shallow Exhaustiveness

Signals:

- Broad category sweeps such as "history, culture, economy, and society" or "performance, reliability, scalability, and security" without detail.
- Lists that try to cover every angle at the same depth.
- Paragraphs that mention many concepts once and explain none.

Why it reads AI-shaped:

LLMs often optimize for completeness-shaped coverage rather than relevance. The prose feels like an outline expanded into sentences.

Fix:

- Choose the one or two dimensions that matter to the user's purpose.
- Replace survey-style breadth with specific depth.

### C9. Over-Contextualized Background

Signals:

- Opening with generic history before the requested topic.
- Explaining obvious background to an expert audience.
- Long setup before a small operational answer.

Why it reads AI-shaped:

Generated answers tend to pad with context to sound comprehensive.

Fix:

- Start at the user's level of knowledge.
- Keep only context that changes the decision or action.

### C10. False Specificity

Signals:

- Precise-sounding but unsupported facts.
- Named entities, dates, or rankings that appear without source or context.
- "The first", "the largest", "the most popular", "widely regarded" without evidence.

Why it reads AI-shaped:

This is a dangerous failure mode: the prose sounds concrete but may be hallucinated.

Fix:

- Verify the claim before preserving it.
- If verification is unavailable, soften the claim to what is actually supported or ask for a source.

## Language Markers

### L1. High-Density AI Vocabulary

Common markers:

- additionally
- align with
- bolster / bolstered
- crucial
- delve
- emphasizing
- enduring
- enhance
- foster / fostering
- garner
- highlight
- interplay
- intricate / intricacies
- key
- landscape
- meticulous / meticulously
- pivotal
- robust
- showcase
- tapestry
- testament
- underscore
- valuable
- vibrant

Why it reads AI-shaped:

These words are not wrong individually. The problem is density: generated text often stacks abstract evaluative words instead of giving specifics.

Fix:

- Replace abstract words with specific action verbs, measurable qualities, or direct nouns.
- Delete importance adjectives when the sentence still works without them.
- Preserve a word if it is a legitimate technical term in context.

### L2. Copula Avoidance

Signals:

- "serves as" where "is" works.
- "features" where "has" or "includes" works.
- "represents" where "is" works.
- "functions as" where "is" works.
- "acts as a" where "is a" works.

Fix:

- Use the simpler verb unless the longer phrase adds meaning.

### L3. Negative Parallelism

Signals:

- "Not only X, but also Y"
- "Not just X, but Y"
- "Not X, but Y" where no real correction is being made.

Fix:

- State the positive claim directly.
- Use "and" if both clauses matter.

### L4. Rule-of-Three Padding

Signals:

- Three adjectives or nouns used rhythmically: "fast, reliable, and scalable"; "simple, powerful, and intuitive".
- Exactly three parallel bullets where one or two would do.
- Repeated triads across a page.

Fix:

- Keep only distinct, meaningful items.
- Replace vague triples with concrete constraints or outcomes.

### L5. Over-Polished Transition Chains

Signals:

- "Moreover", "Furthermore", "Additionally", "Consequently", "Ultimately" stacked across adjacent paragraphs.
- Every paragraph begins with a transition.

Why it reads AI-shaped:

The text sounds smoothed by a template rather than paced by a person.

Fix:

- Remove transitions that do not clarify logic.
- Use direct sentence order instead of connective padding.

### L6. Inflated Formal Register

Signals:

- "utilize" for "use"
- "facilitate" for "help" or "enable"
- "commence" for "start"
- "prior to" for "before"
- "subsequent to" for "after"
- "in order to" where "to" works
- "at this point in time" for "now"

Fix:

- Prefer the shorter word unless the formal term is expected in the domain.
- Apply user profile preferences first.

### L7. Synthetic Caution

Signals:

- "may", "might", "could potentially", "generally", "often", "typically" stacked in one sentence.
- Caution that avoids taking a position when the evidence is already in the prompt.

Fix:

- Keep uncertainty when it is real.
- Remove hedging that only protects the sentence from being useful.

### L8. Repetition With Slight Rephrasing

Signals:

- The same claim repeated in adjacent sentences using different wording.
- A summary sentence that adds no new information after a paragraph.

Fix:

- Keep the clearest version once.
- Merge repeated sentences only when each contributes a distinct detail.

## Style and Formatting Markers

### S1. Title Case on Ordinary Words

Signal:

- Mid-sentence capitalization of common nouns, verbs, or adjectives.

Fix:

- Lowercase non-proper nouns, preserving acronyms, product names, headings, and sentence starts.

### S2. Decorative Bold

Signal:

- Bold applied to ordinary adjectives, verbs, or whole phrases just to add emphasis.
- Multiple bold phrases in short prose where none are warnings, labels, or UI names.

Fix:

- Keep bold only for warnings, UI labels, field names, commands, or genuinely important terms.

### S3. Inline-Header Lists

Signal:

- Three or more bullets in the form `- **Label**: description`.

Fix:

- Convert to prose, a plain list, or a table when comparison is the real goal.

### S4. Em Dash

Signals:

- Repeated dash interruptions obscure the main sentence.
- Dash use conflicts with the user's punctuation preferences.

Fix:

- Use the user's preferred punctuation.
- Split an overloaded sentence or join its clauses directly.
- Preserve quoted source material and code.

### S5. Curly Quotes

Signal:

- Quote typography conflicts with the target format or established document style.

Fix:

- Match the target's typography: ASCII quotes for code and plain-text conventions; typographic quotes where the publication uses them.
- Preserve quoted source material.

### S6. Skipped Heading Levels

Signal:

- Markdown jumps from `#` to `###`, or from `##` to `####`.

Fix:

- Adjust heading levels so they increase one level at a time.

### S7. Redundant Thematic Breaks

Signal:

- `---` immediately before headings.
- Repeated horizontal rules used as decorative separators.

Fix:

- Delete the break and use normal spacing.

### S8. Table Overuse

Signal:

- Tables used for simple lists or explanations where prose is easier to scan.
- A table with one row or one meaningful column.

Fix:

- Keep tables only for comparison, matrices, structured data, or repeated fields.

### S9. Over-Sectioned Output

Signal:

- Too many headings for a short answer.
- "Overview", "Key Takeaways", "Conclusion" around two paragraphs of content.

Fix:

- Remove headings unless they help scanning.
- Use paragraphs for short content.

### S10. Formulaic Summary Blocks

Signal:

- "Key takeaways" or "In summary" sections that repeat the preceding content.
- TL;DR blocks added when the user did not ask for one and the text is already short.

Fix:

- Delete summaries that do not add a decision, next step, or constraint.

### S11. Intra-Document Register Shift

Signal:

- Abrupt change in writing quality, vocabulary level, or tone between sections of the same document.
- One paragraph reads like a senior engineer wrote it; the next reads like generated filler.
- Sudden shift from specific, grounded language to abstract or promotional phrasing.

Why it reads AI-shaped:

Mixed-register documents often indicate sections written at different times, by different prompts, or with different context windows. Humans writing a single document maintain a consistent register even when switching topics.

Fix:

- Identify the dominant register of the document (the sections that read most naturally).
- Rewrite the outlier sections to match that register.
- Do not flatten style variation -- vary sentence length and structure -- but keep the vocabulary level and tone consistent.

### S12. Decorative Unicode Enumeration Glyphs

Severity: **High** for decorative glyphs that conflict with the target format.

Signal:

- Bullet dots (`●`, `▪`, `◦`) used as list markers instead of Markdown `-` or `*`.
- Circled or enclosed numbers (`①②③`) used for ordered lists.
- Geometric arrows (`➤`, `▶`) used as list markers.

Why it reads AI-shaped:

These glyphs are a decorative substitute for standard list syntax, not a deliberate typographic choice. New variants (a different bullet, a different number style) are the same marker, not a new one -- treat any glyph from this category the same way rather than relearning it one symbol at a time.

Fix:

- Replace with a standard Markdown `-` bullet or `1.` numbered list.
- Glyphs quoted from source material are exempt.

## Communication Intent Markers

### I1. Assistant Service Language

Signals:

- "Certainly!"
- "Of course!"
- "Absolutely!"
- "I hope this helps"
- "Happy to help"
- "Would you like me to..."
- "Is there anything else I can help you with?"
- "Feel free to ask"
- "Don't hesitate to reach out"
- "Let me know if you need anything else"

Why it reads AI-shaped:

It reveals the stance of a helpful assistant instead of the stance of the actual author.

Fix:

- Delete service framing.
- Keep only the substantive message.
- In emails, replace generic help offers with a concrete next step only if one is needed.

### I2. Knowledge-Cutoff Disclaimers

Signals:

- "As of my last knowledge update"
- "As of my knowledge cutoff"
- "Based on my training data"
- "I do not have information beyond..."
- "My knowledge only extends to..."
- "I may not have the most current information"

Fix:

- Replace with a dated, verifiable statement if needed.
- Otherwise remove the disclaimer.

### I3. Placeholder Residue

Signals:

- `[Your Name]`
- `[Company Name]`
- `[Project Name]`
- `[Date]`
- `[Insert details]`
- "Insert X here"
- "Replace this with..."
- "Add relevant details..."

Fix:

- Replace with actual details.
- If details are unknown, rewrite to avoid the placeholder or ask for the missing value.

### I4. Hedging and Meta-Commentary

Signals:

- "It is important to note that"
- "It is worth mentioning that"
- "Please note that"
- "Keep in mind that"
- "It should be noted that"
- "Notably,"
- "Importantly,"
- "Crucially,"
- "Needless to say"

Fix:

- Start with the substantive claim.
- Use a structured note or warning only when the content is genuinely a note or warning.

### I5. Compliance-Like Neutrality

Signals:

- "It is advisable to..."
- "One should consider..."
- "Users may wish to..."
- "Care should be taken to..."

Why it reads AI-shaped:

The sentence avoids naming the actor or decision owner.

Fix:

- Name the actor: "Platform owners should...", "Run...", "Review..."
- Keep neutral voice only when the document style requires it.

## Markup, Citation, and Source Markers

Wikipedia's AI-writing guidance puts heavy emphasis on residue that appears when generated text is pasted into an encyclopedia or editing workflow. The same family of issues appears in agent-written docs, emails, and technical notes.

### M1. Raw Markdown or HTML Leaks

Signals:

- `**bold**` in a target format that does not use Markdown.
- Raw `<ref>`, `<br>`, `<span>`, `<div>`, or HTML entities in plain prose.
- Unclosed Markdown links or images.
- Markdown tables copied into email or chat where they render poorly.

Fix:

- Convert markup to the target format.
- Remove formatting when it is only decorative.

### M2. Broken Wiki or Citation Markup

Signals:

- `[[link]]` or `{{template}}` residue in non-wiki text.
- Broken footnotes such as `<ref>` without `</ref>`.
- Citation placeholders not connected to real sources.

Fix:

- Convert to natural text or a valid citation.
- Ask for the source when the claim depends on it.

### M3. Internal Retrieval and Citation Token Leaks

Signals:

- `turn0search0`
- `oaicite`
- `oai_citation`
- `contentReference`
- `attached_file`
- `[attachment: ...]`
- `grok_card`
- raw search-result labels
- tracking URLs such as `utm_source=chatgpt.com`

Fix:

- Strip internal markers.
- Name the source naturally if a real source exists.
- Remove tracking parameters unless they are part of an example about tracking.

### M4. Hallucinated or Unusable Sources

Signals:

- Source title sounds plausible but cannot be verified.
- Citation does not support the sentence.
- Dead link used as the only support for a strong claim.
- A source is named without author, publication, date, or URL when those are required.

Fix:

- Do not polish unsupported claims into a more confident form.
- Mark the claim as needing a source or rewrite it as an uncited opinion/observation.

### M5. Source-Laundering Language

Signals:

- "According to sources" with no source.
- "Based on available data" with no data.
- "Reports indicate" with no report.
- "It has been documented" with no document.

Fix:

- Name the source or remove the authority signal.

## Wikipedia and Comment-Style Markers

These markers matter when humanizing issue comments, PR comments, review notes, wiki edits, or encyclopedia-like prose.

### W1. Talk-Page Assistant Tone

Signals:

- "I understand your concern"
- "Thank you for your contribution"
- "You raise a valid point"
- "Let's work together to improve..."
- "I appreciate your perspective"

Fix:

- Use the actual review stance: accept, reject, request evidence, or propose a concrete edit.

### W2. Over-Polite Conflict Avoidance

Signals:

- Long conciliatory openings before a simple disagreement.
- "While I see where you're coming from..." followed by a direct policy point.

Fix:

- Keep a brief respectful opening if needed, then state the reason.

### W3. Policy Name-Dropping Without Application

Signals:

- Mentions of policy, best practices, guidelines, or consensus without applying them to the concrete text.

Fix:

- State the actual rule and how it affects the sentence, claim, or edit.

### W4. Generic Edit Summaries

Signals:

- "Improved clarity and readability"
- "Enhanced article quality"
- "Updated content for accuracy"
- "Made various improvements"

Fix:

- Name the exact change: "Removed unsourced claim about adoption", "Replaced vague attribution with CNCF survey citation."

## Code Markers

### K1. Over-Commented Trivial Code

Signals:

- A comment that restates what the next line already says (`// increment i` above `i++`).
- Comments on nearly every line of straightforward code, including simple assignments and returns.
- Narrating the change instead of the code: "only in X" or "original logic" language describing what was modified, left in the code or commit message rather than in the PR description.

Why it reads AI-shaped:

Human authors comment where intent is not obvious from the code; generated code often comments every step regardless of whether the step needs explaining.

Fix:

- Delete comments that add no information beyond the line itself.
- Keep comments that explain why, not what: a non-obvious constraint, a workaround, an invariant.
- Move narration about the change itself (what was modified and why) to the commit message or PR description, not a code comment.

## Humanization Strategy

Follow the rewrite workflow in [SKILL.md](../SKILL.md#rewrite). Use severity to prioritize repairs and the transformation examples in [rewrite-playbook.md](rewrite-playbook.md) to choose replacements.

## Detection Notes

- A sentence with multiple markers counts once for density.
- When requested, report density as flagged sentences divided by total sentences, rounded to an integer percentage.
- A passage can be human-written and still contain markers; report it as a style risk, not proof of authorship.
- For technical documents, protect accepted technical terms before applying vocabulary rules.
- For user-facing reports, prioritize actionable fixes over exhaustive marker lists.
- For source-related markers, distinguish "rewrite needed" from "verification needed." Some problems cannot be solved by style editing alone.
