# Architecture Diagram evaluation

Date: 2026-10-28. Status: prototype and deterministic checks implemented; model behavior, desktop integration and owner visual acceptance pending.

## Scope and target

- Stage: pre-candidate prototype, no installable skill.
- Cases: four owner-approved drafts migrated from the requirements handoff, owned by [the scenario manifest](./evals/cases.json) and its linked Markdown files. Scenario 05 is deferred.
- Prototype: [Scenario 01 draw.io XML](./prototype/scenario-01.drawio), using explicitly stated fixture assumptions. It is not a model's response to the contradictory raw input.
- Upstream: draw.io `v32.6.1`, commit `84487b4891cbc0f32d7e30f34cf878c87cb1f414`, freshly resolved from the release tag. [measured]
- Generated metadata: [catalog](./prototype/catalog.json), with source file SHA-256 values and exact lookup IDs.

## Executed evidence

The catalog extractor ran against the pinned source and checked stencil names, registered wrapper shapes and exact-case image paths. It produced 1,793 unique entries: AWS4 956, Azure2 714, GCP3 45 and Kubernetes 78. Entries are deduplicated by full style and title, so these counts differ from the earlier raw factory-call counts. Four Azure entries are marked unusable: IP Address Manager, Database Instance for SAP, Solutions and Arc Data Services. The output contains no SVG artwork or remote image URLs. [measured]

Scenario 01 was generated from exact catalog entries. The static XML validator checks syntax, one uncompressed page, IDs/parents, C4 type/technology metadata, catalog provenance, vendor matching, icon transformations, fonts, single-direction arrows, relationship protocols and declared orthogonal routes. It detects declared line/element and estimated caption intersections and shared path segments. These are bounded checks, not proof of architecture correctness or complete layout quality.

The six initiative regression tests passed, including deliberately broken XML, icons, vendor metadata, bidirectional arrows, routes, rendered geometry and vague or malformed clarification answers. The four-case Promptfoo fixture suite passed 4/4. Its expected values stay out of model inputs. This is synthetic harness replay; no model was evaluated and no user confirmation was fabricated. [measured]

A local browser loaded the pinned draw.io viewer, stencil bundle and AWS/Kubernetes wrapper code from loopback. External DNS was blocked and background networking disabled. It produced the [SVG](./prototype/scenario-01.svg) and a local PNG, plus [render geometry](./prototype/scenario-01.render.json). Environment: Linux, Node.js 24, Chromium 154.0.8037.57. Browser CLI dumping did not finish in this host; local DevTools export succeeded. The browser route uses temporary writable configuration/cache directories and requires loopback access. [measured]

Author inspection found a failure-response label covering the AWS boundary title in the first render. The route was moved and rendered again; the final AWS title and type are visible. The token-authorizer route was adjusted to provide a longer horizontal label segment. A subsequent check of actual browser text bounds detected the request and failure paths crossing the enforcement-group title. Entry/exit ports and waypoints were moved; the final rendered-geometry check passes. This is author inspection and geometric evidence, not owner approval or independent blind review.

## Reproduce and interpret

Repository verification on 2026-10-28 passed: 153-file inventory with the two existing authored packages, 34 regression tests (including six architecture prototype checks), 42 default fixture assertions, and generic/NVIDIA loopback transport. The architecture suite separately passed 4/4 synthetic assertions. A second catalog extraction matched the committed generated metadata byte-for-byte. SHA-256: draw.io XML `fddfcde8de8a79047708f16dd09dcd480d1ae0acc7851a4c0133857ddee01178`; catalog `d567841c18435af41a9ee8ce7de82783e222e91c8f76161c553adf9e3e141b77`.

Commands and runtime setup are maintained in the [initiative README](./README.md#reproduce). The root `npm test` includes initiative `.test.mjs` files, so the deterministic regression checks run in CI. Default repository evaluation remains its existing synthetic smoke; the architecture suite also runs explicitly through the shared runner.

The clarification grader checks a few expected concepts and nonempty recommendations/disclosures. Keyword checks cannot establish semantic correctness, recommendation quality, or whether a tool-enabled agent actually waits before drawing. Inspect real traces and artifacts in a later model/host trial.

## Open verification

- Owner acceptance of icon size, element descriptions and layout density.
- Offline draw.io Desktop at the pinned version; browser evidence does not settle Desktop support.
- Real rendering of Azure, GCP3 and Kubernetes styles, including viewer/version differences.
- Independent image-only architectural readout against the approved checklist.
- Coverage of Docker/Argo CD/Red Hat and adopted F1-F6 criteria beyond the explicit fallback; no separate icon service is built.
- Scenario 05 when the owner is available.
- Real-model and installed-client behavior, package creation and release readiness.

No vendor source was reread to validate the scenario's actual deployed architecture. This prototype tests the accepted synthetic fixture, not any client system. Private sample images, identifiers and paths are absent.
