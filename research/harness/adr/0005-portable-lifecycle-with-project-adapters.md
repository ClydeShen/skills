---
status: accepted
---

# Separate the portable skill lifecycle from project adapters

Date: 2026-11-06. Decision authority: the owner requested a reusable, independently transplantable SOP/checklist in knowledge after project remediation research. Publication platform is a replaceable example, not the purpose of the process.

## Decision

Keep the platform-neutral procedure, evidence checklist/schema, minimal records and reference tool roles in `knowledge/skill-lifecycle/`. The folder is self-contained. Preserve the owner's six maturity stages and the single-source/snapshot maintenance model from [ADR 0004](./0004-versioned-skill-maintenance.md).

`docs/HARNESS.md` owns this project's command/control profile and implementation status. `docs/REPOSITORY-STRUCTURE.md` retains local paths, discovery constraints and release requirements. The [remediation plan](../skill-repository/0003-portable-skill-lifecycle-remediation-plan.md) owns proposed implementation packages, not current gate completion.

Keep skills.sh as this project's default adapter, including required matching audit approval. Do not impose it on every project adopting the SOP. Missing artifact-bound audit evidence remains unresolved, not waived. Keep unapproved artifacts outside default stable exposure; labeling an exposed artifact pending is insufficient.

## Alternatives and consequences

A universal skills.sh/Node/GitHub pipeline would be less portable. Separate SOP copies in project docs would drift. A large publication framework is premature, so this change adds documents and checklist verification only. It does not implement exporters, migration engines, audit provenance or release approval automation.

Portable adoption and actual release effectiveness remain unverified beyond structural tests. Snapshot/provenance prerequisites and existing uniqueness checks remain intact. Receiving projects must select and verify their own tool and publication profiles.
