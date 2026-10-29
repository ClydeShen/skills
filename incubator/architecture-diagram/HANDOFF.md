# Architecture Diagram handoff

Updated: 2026-10-29. Integration: [PR #20](https://github.com/ClydeShen/skills/pull/20). This is a continuation guide for the current initiative, not a parallel task tracker. Read root [AGENTS.md](../../AGENTS.md) before making changes.

## Start here

- Active package: [candidate/architecture-diagram](./candidate/architecture-diagram/SKILL.md). It remains an installable public-stage candidate, not a release in `skills/`. The [initiative README](./README.md) owns installation and lifecycle status.
- Latest diagrams and comparison links: [semantic-clarity trial](./evals/semantic-clarity-2026-10-29/README.md). Each case includes PNG, SVG, editable draw.io, generation/check scripts and `assumptions.md`.
- Evidence history and outstanding verification: [evaluation.md](./evaluation.md). Preserve frozen earlier cases when improving subsequent outputs.

## Current behavior and owner direction

Optimize information accuracy and readable architecture expression. Keep the skill concise and allow contextual layout choices. Avoid mechanical symmetry, fixed service positions, excessive frames, labels or explanatory Notes. Preserve distinct instances, real boundary membership and essential relationships.

Select a view supported by the input. Source-stated connections, technical capabilities, inferences and design recommendations have different evidential strength. Keep unconfirmed operational paths in a concise companion record, preserving the source claim and why it is absent from runtime flows. Do not invent ALB type/exposure, subnet attachments, protocols, security settings or full-application high availability.

Latest Case A preserves two AZs, six CIDRs, shared logical ELBs, separate shared compute scaling groups and synchronous RDS primary/standby replication. The parent's final repair replaces ASG enclosures around ELBs with compute-member markers and management associations. ELB subnet attachments remain unknown.

Latest Case B separates DNS resolution from direct client requests, preserves DynamoDB's two directions, and treats monitoring as an association. Implied Web → App, undefined Cache → RDS and standby → S3 operations are recorded in its companion assumptions, without operational arrows.

## Evidence and limitations

The two latest diagrams began in separate fresh contexts with only their respective original text and current skill. Parent review then requested semantic/catalog corrections. They are independently initiated generations with supervised repairs, not untouched blind evaluations. Shared filesystem isolation was procedural. No new external model endpoint was called. The second supplied reference image was not archived, as requested.

The prior layout outputs received subjective owner review scores of 8.0/10 (A) and 6.5/10 (B). Earlier overall simple-diagram feedback was 85/100. None of these scores evaluates the latest semantic-clarity outputs; owner comparison remains pending. Source fidelity, technical plausibility, rendering and aesthetics must be assessed separately.

Local checks passed: 63 regression tests, 42 synthetic assertions, loopback provider contracts, pinned package validation/discovery and bounded diagram checks. Browser rendering uses draw.io 32.6.1 at commit `84487b4891cbc0f32d7e30f34cf878c87cb1f414`. Offline Desktop behavior and actual deployed correctness are unverified. GitHub CI and merged status should be checked on the linked PR rather than inferred from this document.

## Continue

1. Obtain owner comparison of the two latest images before further stylistic changes. Review ASG member/management markings and unresolved logical endpoints for possible remaining ambiguity.
2. Use a new result directory for repairs; retain frozen trial evidence. Record parent intervention and distinguish sourced facts from recommendations.
3. Recheck the saved latest artifacts with `node incubator/architecture-diagram/evals/semantic-clarity-2026-10-29/verify.mjs`. For new diagrams, run static/render checks and inspect the actual image. Finish repository changes with `npm run check`.
4. Broader verification still needs repeated independent generations, image-only readouts and source/technical review. Scenario 05 and Desktop integration remain open; do not infer release readiness from synthetic checks.

All repository content stays English. Keep task tracking in GitHub issues, evaluation evidence in its existing records, and runtime behavior in the single active package. Update this handoff by consolidation when the continuation state changes.
