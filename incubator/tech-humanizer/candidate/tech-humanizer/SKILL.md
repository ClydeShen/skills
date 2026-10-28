---
name: tech-humanizer
description: Remove AI writing patterns from prose and adapt it to the user's voice. Use for humanization, AI-style reviews, rewrites in the user's voice, and learning writing preferences from conversation and samples.
metadata:
  internal: true
---

# Tech Humanizer

Remove AI writing patterns, write naturally, then adapt the result to the user's habits and the occasion.

## Rewrite

1. Identify the language, purpose, audience, relationship, and format: business document, technical document, email, or message.
2. Load the profiles using [profile.md](references/profile.md) and the matching section of [channel-style.md](references/channel-style.md).
3. Protect technical vocabulary with [technical-terms.json](references/technical-terms.json). Preserve domain terms absent from the catalog when used technically.
4. Check all relevant categories in [ai-markers.md](references/ai-markers.md). Use [ai-style-lexicon.json](references/ai-style-lexicon.json) for vocabulary and phrase lookup.
5. Apply [rewrite-playbook.md](references/rewrite-playbook.md): remove residue and padding, clarify the point, and express the same meaning naturally.
6. Apply the user's global voice and matching context voice. Use channel defaults where profile evidence is sparse.
7. Check [final-rubric.md](references/final-rubric.md) and resolve each failed criterion.
8. Capture learning evidence through **Learn** below.

Return the rewritten text. Add an explanation when requested. Return clean passages unchanged.

For claims, citations, links, or markup, read [source-and-markup-integrity.md](references/source-and-markup-integrity.md).
For requested or project-required ASD-STE100 output, read [asd-ste100.md](references/asd-ste100.md).

## Review

Read the marker reference, lexicon, technical vocabulary, and applicable profiles. Report observable patterns with their marker IDs, quoted passages, reader impact, and suggested edits.

Keep source problems distinct from style problems. Report marker density only when requested; it measures flagged sentences, not authorship.

Use [bucket-quickref.md](references/bucket-quickref.md) for a weighted review and [detection-report-template.txt](assets/detection-report-template.txt) for a structured report.

## Learn

During each use, inspect available user-authored conversation for wording, sentence structure, rhythm, punctuation, and ways of requesting, explaining, or disagreeing. Also capture explicit preferences, corrections, reverts, and identified writing samples.

Follow [profile.md](references/profile.md) for evidence, promotion, storage, and precedence. Save concise style observations in the user profile and project terminology in the project profile.

After a profile update, briefly state what was learned alongside the requested output.

## Completion

The result preserves meaning and technical precision, resolves identified AI writing patterns, and fits the user's evidenced voice and target occasion.
