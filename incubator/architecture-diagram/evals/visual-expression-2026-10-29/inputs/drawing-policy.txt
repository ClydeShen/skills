# Prototype drawing decisions

Date: 2026-10-29. Current prototype guidance; no installable skill. Use alongside the accepted [house-style requirements](../../../research/diagrams/architecture-diagram/requirements-and-observed-style-2026-10-28.md). Load [layout guidance](../../../knowledge/diagrams/architecture-layout.md) when planning or repairing a dense layout.

1. Resolve architectural meaning before coordinates. Preserve user intent, corrections, exclusions, multiplicity and main/auxiliary/failure distinctions.
2. Research accessible platform constraints before asking about ownership or capability. Record consequential derived facts and their sources. Ask about unresolved project choices that change the architecture.
3. Give each meaningful boundary an evidenced membership. A connection or nearby position does not establish ownership.
4. Attach each protocol, payload, response and security qualifier to its actual hop. Keep unspecified implementation details unspecified.
5. Encode facts where they belong: membership in boundaries, interactions in directed edges, transformations on the responsible node or hop. Name both sides of important associations.
6. Choose a dominant direction for the diagram's question. Align peers and preserve distinct instances in their actual domains. Reuse drawing patterns, not entity identity; visual repetition is not a reason to replace components with prose.
7. Make the graph explain the architecture without detached prose. Each Note is a visual-design cost: replace it with supported structure, a concise local label or a genuine relational matrix where possible. Do not hide paragraphs in captions or remove facts to reach zero Notes.
8. Allocate label space before routing. Try facing ports and a straight line first. Keep only bends justified by obstacles, distinct parallel paths or domain semantics.
9. Preserve the meaning of every domain crossing. Improve node placement, spacing or ports before adding a detour. Native inline labels interrupt their own stroke.
10. Inspect fidelity, geometry and visual communication separately. Verify that the reader can trace the main path, distinguish branches and locate controls without explanatory paragraphs. Disclose any retained Note and why its fact cannot be encoded naturally.

For controlled round trips, freeze a resolved L0 first. Research and corrections happen before that freeze; generators and readers must not independently enrich the architecture during the measured chain. Use the [evaluation protocol](../evals/roundtrip.md). Preserve failed attempts and distinguish repaired baselines from same-input comparisons.
