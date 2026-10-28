# Source and Markup Integrity

Use this file whenever the text contains citations, links, wiki markup, Markdown, HTML, source claims, dates, statistics, or named authorities.

The core rule: do not turn unsupported text into polished unsupported text. If evidence is missing, the outcome should show that boundary.

## Source Integrity Outcomes

For every source-like claim, choose one outcome:

- **Verified**: keep the claim and source because the source is named and supports it.
- **Needs source**: preserve the claim only as a flagged item or ask for the source.
- **Narrowed**: rewrite the claim to what the text actually supports.
- **Removed**: delete the claim because it is decorative, irrelevant, or unsupported.

## High-Risk Source Patterns

### Vague Source Authority

Signals: [ai-style-lexicon.json](ai-style-lexicon.json) `source_laundering_phrases` ("according to sources", "reports indicate", "research shows", and similar).

Outcome:

- Name the source, or remove the authority signal.
- Do not keep the phrase as a stylistic flourish.

### Plausible but Unverifiable Specifics

Signals:

- "first", "largest", "most widely adopted", "millions of users", "leading", "widely regarded";
- exact years, rankings, or statistics without a source;
- source title sounds real but lacks author, publisher, date, URL, DOI, ISBN, or page.

Outcome:

- Ask for verification or rewrite to a narrower claim.
- In detection mode, mark this as source integrity risk.

### Citation Does Not Support Claim

Signals:

- source is about a broad topic but used for a specific claim;
- book citation has no page number for a page-specific claim;
- DOI/ISBN/link resolves but points to unrelated material;
- repeated citation after every sentence.

Outcome:

- Keep the citation only if it supports the claim.
- Otherwise flag it as verification-needed, not merely formatting-needed.

## Markup Cleanup

### Markdown in Non-Markdown Targets

Signals:

- `**bold**`, `### Heading`, Markdown tables, or backtick formatting in email/plain text.

Outcome:

- Convert formatting to the target channel or remove it.

### Broken Wikitext or HTML

Signals:

- `<ref>` without closing tag;
- `{{template}}` where the target is not wikitext;
- `[[link]]` in normal prose;
- raw `<span>`, `<div>`, `<br>`, or HTML entities;
- accidental maintenance-template transclusions.

Outcome:

- Convert to natural text or valid target markup.
- If the markup is a template name being discussed, escape it or describe it plainly.

### Internal Retrieval Tokens and Tracking Parameters

Signals: [ai-style-lexicon.json](ai-style-lexicon.json) `internal_reference_leaks` (`turn0search`, `oaicite`, `contentReference`, `utm_source=chatgpt.com`, and similar), plus `+1` used as citation residue.

Outcome:

- Remove the token or tracking parameter.
- If it stood in for a real source, ask for or name the source.
- Keep a tracking parameter only if the text is specifically about tracking URLs.

## Citation Placeholder Patterns

Signals: [ai-style-lexicon.json](ai-style-lexicon.json) `placeholder_patterns` (`INSERT_SOURCE_URL`, `SOURCE_PUBLISHER`, `2025-XX-XX`, and similar), plus a bare `URL` token and `[citation needed]` in non-Wikipedia prose.

Outcome:

- Do not leave placeholders in final prose.
- Ask for missing source details or remove the citation scaffolding.

## Detection Report Guidance

When reporting source/markup issues, distinguish:

- "style issue" for formatting residue;
- "source integrity issue" for unsupported or unverifiable claims;
- "target-format issue" for Markdown/wikitext/HTML mismatch.

Do not assign a clean humanized rewrite that makes a source-integrity issue look solved. The correct fix may be "verify this before publishing."
