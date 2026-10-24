---
status: accepted
---

# Use one source per responsibility and promote packages by moving them

Date: 2026-10-25. Decision authority: agent decision under the owner's explicit request to research and determine the repository's SOT, folder and format system. This records the selected plan; automated enforcement and migration tasks are not claimed complete.

The repository contains evidence, reusable knowledge, concrete initiatives, installable packages and development tools. Codex and Claude must maintain the same durable model. Duplicate client instructions and copied runtime packages create drift; skills CLI discovery alone can hide duplicate names or expose development dependencies.

## Decision

1. Keep root `AGENTS.md` as shared operating instructions and `CLAUDE.md` as a thin import adapter.
2. Define authoritative content locations in `docs/REPOSITORY-STRUCTURE.md` and document shapes in `docs/DOCUMENT-FORMATS.md`.
3. Preserve the existing research → knowledge → incubator → external trial → skills lifecycle.
4. Maintain one active authored package per skill name.
5. Promote the candidate by moving it into `skills/`, updating evaluation targets and links in the same change.
6. Keep initiative evaluation suites stable in the initiative workspace after release.
7. Keep imported authoring helpers separate from released products; synchronize client projections from one installed tree and preserve dependency provenance.
8. Use filesystem invariants and actual CLI discovery as independent checks; do not treat name deduplication as uniqueness verification.
9. Derive installation listings from packages. Do not add a second manually maintained catalog.
10. Retain historical evidence and decisions while updating the current owning artifact.

## Considered Options

- Put every draft directly in `skills/` with visibility metadata: stable source paths, but changes the established released-only meaning and makes more clients depend on discovery extensions.
- Copy candidates into release directories: easy promotion, but creates competing authoring sources.
- Move evaluation suites to the root at release: aligns tests with a released package, but creates another avoidable migration. Initiative ownership can remain stable.
- Keep separate Codex and Claude instruction systems: allows client details, but duplicates the shared repository rules. Thin adapters retain necessary differences.
- Add a catalog duplicating frontmatter and README status: improves centralized browsing, but requires another synchronization mechanism before the repository has that need.

## Consequences

The public install surface stays small and predictable. Promotion changes package paths once; the evaluation target and navigation must change atomically. Historical and test materials remain associated with the initiative.

At the time of this decision, `.agents/skills/` and `.claude/skills/` copies were equivalent, but no deterministic sync check was installed and package validation was not a complete structural gate. These follow-up engineering tasks were subsequently implemented under [ADR 0002](./0002-shared-delivery-harness.md); the [harness guide](../../../docs/HARNESS.md) records actual coverage and verification limits. No skill is released by this decision.

Evidence and CLI-specific limitations are recorded in the [research note](../skill-repository/sot-layout-installability-2026-10-25.md). Current standards own the operative rules; this ADR owns the decision history.
