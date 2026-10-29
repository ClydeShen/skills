# Architecture semantics: fresh text-only generations

The owner reviewed the preceding restrained-layout outputs at 8.0/10 for Case A and 6.5/10 for Case B. These subjective architecture-expression scores are distinct from the earlier overall 85/100 feedback and do not rate the new outputs below.

## Compare

| Scenario | Previous | New preview | Editable | Scope and unresolved source claims |
| --- | --- | --- | --- | --- |
| Two-AZ, six-subnet application | [Previous A](../restrained-layout-2026-10-29/case-a/diagram.png) | [New A](./case-a/diagram.png) | [draw.io](./case-a/diagram.drawio) | [Assumptions A](./case-a/assumptions.md) |
| Application with supporting services | [Previous B](../restrained-layout-2026-10-29/case-b/diagram.png) | [New B](./case-b/diagram.png) | [draw.io](./case-b/diagram.drawio) | [Assumptions B](./case-b/assumptions.md) |

## Method

Two new agents received only the current package, neutral authoring tools and their respective unchanged source documents ([A](../three-tier-2026-10-29/source.md), [B](../three-tier-supporting-2026-10-29/source.md)). They received no conversation history, previous diagrams, reference images or scores. Filesystem access is shared, so isolation is procedural, not enforced access control. The parent has seen prior references and is not an independent judge.

The skill now selects a view supported by the available evidence, separates source claims from technical facts, labels relationship meaning and keeps unconfirmed operational paths in a companion record. It does not infer ALB type, exposure, subnet attachments, protocols or security configuration to make a high-level view look implementation-ready. This is a modest behavior revision, not a new modelling framework.

Before freezing delivery, the parent requested semantic/catalog repairs: explicit shared ELB scope, an exact S3 icon, ASG membership that does not enclose the ELBs, separate client traffic and DNS, and retained DynamoDB bidirectionality. These are fresh-context generations followed by supervised correction, not untouched blind outputs or independent review. No reference layout was supplied to the generators.

## Result and checks

Case A preserves six subnet CIDRs, both AZs, shared ELBs, separate fleet management and synchronous primary/standby replication without inferring ALB subtype, exposure or subnet attachments. Case B moves the implied Web → App and undefined Cache → RDS / standby → S3 paths into its companion record, separates client requests from DNS, and labels monitoring as an association. Missing implementation detail remains unresolved rather than filled with recommendations.

The integrator inspected both final PNGs and reran static, actual rendered-route and pairwise-text checks. Frozen source/package/artifact hashes and limitations are in [verification.json](./verification.json); rerun `node incubator/architecture-diagram/evals/semantic-clarity-2026-10-29/verify.mjs` from the repository root. Local verification passed 63 regression tests, 42 synthetic assertions, the loopback provider check, pinned package validation and explicit candidate discovery. Older frozen cases remain unchanged.

Owner comparison is pending. Browser checks, source fidelity and technical plausibility are separate evidence; one run per case cannot prove general effectiveness or deployed correctness. No new external model endpoint was invoked, and the second reference image is not archived. Offline Desktop support remains unverified.
