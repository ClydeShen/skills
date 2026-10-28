# Weighted marker review

Use this optional heuristic to prioritize edits within a draft. Scores rank editing work; report the observed passages and repairs.

| Bucket | Points per occurrence | What to check |
| --- | --- | --- |
| Structure | 5 | Repeated sentence templates, passive clusters with a known actor, identical paragraph shapes, transition chains. |
| Tone | 2 | Buried points, assistant framing, empty caution, and generic balance: C5, C7, C9, I1, I4, I5. |
| Vocabulary | 2 | Inflated terms, synonym rotation, vague authority, and unsupported importance: C1, C2, C6, L1, L2, L6. |
| Formatting | 1 | Unnecessary capitalization, emphasis, labels, headings, rules, tables, summaries, register shifts, or decorative glyphs: S1–S12. |

Use [ai-markers.md](ai-markers.md) for definitions and [ai-style-lexicon.json](ai-style-lexicon.json) for phrase lookup. Count each occurrence in the bucket that best describes its effect.

Review a paragraph at 5 points or a document at 12 points. Repair the bucket with the highest score first. These thresholds guide attention; use the final rubric to judge completion.

Repair source and markup artifacts as they occur. Apply punctuation and formatting choices through the user's profile and target conventions.

Make up to three focused passes. Report any unresolved issue that needs source evidence or a user decision.
