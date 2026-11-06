---
status: accepted
---

# Keep skill authoring sources and publish verified snapshots

Date: 2026-11-06. Decision authority: the owner approved recording the researched maintenance principles as the standard workflow for all future skills. This amends ADR 0001's move-on-release choice and ADR 0003's comparison guidance; it does not claim publication tooling is implemented.

## Context

Authors need to improve a skill after publication without exposing users to unfinished changes. Urgent corrections must target an identifiable release and survive in future development. Two independently edited packages create drift; moving the only source out of the incubator conflicts with the owner's continued-authoring workflow.

## Decision

- Retain one incubator authoring source and generate controlled publication snapshots in `skills/`. Authoring merges do not publish automatically.
- Follow the shared [skill maintenance procedure](../../../docs/HARNESS.md#skill-maintenance): reproduce and diagnose, change the owning layer, compare actual behavior, promote deliberately and preserve provenance.
- Include baseline-comparison evidence for public/released package changes. Follow the declared protocol, identify missing runs and let the owner judge; scores never approve or block automatically.
- Isolate hotfixes against the released source, publish only the needed correction and forward-port it. Preserve published history; restore only the affected skill when recovering.
- Keep published status distinct from next-version evaluation. Require package-local first-use documentation, snapshot installation checks and matching external audit evidence before release acceptance.

## Alternatives and consequences

Maintaining only `skills/` is simpler but does not provide the requested incubator/stable-publication separation. Independently copying and editing both trees is rejected. Full GitFlow is unnecessary: retain short task branches and immutable version references, not permanent branches per skill.

Snapshot generation, provenance-aware paired-package validation and real discovery/install checks are prerequisites. Existing uniqueness checks remain unchanged until that support is implemented and verified. This decision publishes no skill and adds no release command. Exact version/tag syntax must be verified with the chosen CLI before use.

The [structure contract](../../../docs/REPOSITORY-STRUCTURE.md#package-progression) owns placement and evidence; the harness owns the procedure. Supporting facts and limits remain in the [maintenance research](../skill-repository/0001-published-skills-need-versioned-feedback-loops.md).
