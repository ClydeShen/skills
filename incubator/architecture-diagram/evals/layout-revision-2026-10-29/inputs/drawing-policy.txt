# Prototype drawing decisions

Date: 2026-10-29. Current prototype guidance; no installable skill. Use alongside the accepted [house-style requirements](../../../research/diagrams/architecture-diagram/requirements-and-observed-style-2026-10-28.md). Load [layout guidance](../../../knowledge/diagrams/architecture-layout.md) when planning or repairing a dense layout.

1. Resolve architectural meaning before coordinates. Preserve user intent, corrections, exclusions, multiplicity and main/auxiliary/failure distinctions.
2. Research accessible platform constraints before asking about ownership or capability. Record consequential derived facts and their sources. Ask about unresolved project choices that change the architecture.
3. Give each meaningful boundary an evidenced membership. A connection or nearby position does not establish ownership.
4. Attach each protocol, payload, response and security qualifier to its actual hop. Keep unspecified implementation details unspecified.
5. Name both sides of important associations. A note's location or a pronoun must not carry the whole binding.
6. Choose a dominant direction for the diagram's question. Align the main path and peer branches; continue that direction inside houses where practical.
7. Allocate room for captions and notes before routing. Try facing ports and a straight line first. Keep only bends justified by obstacles, distinct parallel paths or domain semantics.
8. Preserve the meaning of every domain crossing. Improve node placement, spacing or ports before adding a detour. Native inline labels interrupt their own stroke.
9. Inspect the actual render and the source-to-artifact facts separately. A clean geometry report does not establish fidelity or real deployment correctness.

For controlled round trips, freeze a resolved L0 first. Research and corrections happen before that freeze; generators and readers must not independently enrich the architecture during the measured chain. Use the [evaluation protocol](../evals/roundtrip.md). Preserve failed attempts and distinguish repaired baselines from same-input comparisons.
