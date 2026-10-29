# Architecture Diagram

Date: 2026-10-29. Stage: candidate. Decision authority: the owner requested standard skill packaging and further diagram repairs. Scenario 05 remains deferred; packaging is not release approval.

## Goal and scope

Turn an English scenario description into one editable `.drawio` dynamic diagram in a deployment view. Preserve the team's visual style, C4 information and correct vendor responsibilities. Raise consequential gaps and contradictions with recommendations before drawing. Initial input is text; overviews, infrastructure plans, code/IaC input, automatic redraw and exported images as product deliverables are later scope.

## Sources and active artifacts

- Accepted requirements and decisions: [research handoff](../../research/diagrams/architecture-diagram/requirements-and-observed-style-2026-10-28.md).
- Evidence: [vendor/C4 conventions](../../research/diagrams/architecture-diagram/vendor-diagram-conventions-2026-10-28.md) and [draw.io libraries](../../research/diagrams/architecture-diagram/drawio-builtin-icon-libraries-2026-10-28.md).
- Authoring philosophy: [skill design principles](../../knowledge/skill-design/skill-design-principles.md).
- Active package: [Architecture Diagram](./candidate/architecture-diagram/SKILL.md), with package-local notation, draw.io authoring guidance, a text-only icon catalog and lookup/regeneration helpers. It is an experimental candidate, not a released skill.
- Approved evaluation scenarios: [01](./evals/scenario-01.md), [02](./evals/scenario-02.md), [03](./evals/scenario-03.md), [04](./evals/scenario-04.md).
- Evaluation suite and checks: [suite](./evals/suite.mjs), [manifest/assertion data](./evals/cases.json), [tests](./evals/checks.test.mjs).
- Primary semantic evaluation: [two-round-trip protocol](./evals/roundtrip.md), [adapter runner/comparator](./evals/roundtrip.mjs), [regression tests](./evals/roundtrip.test.mjs), and [Scenario 01 existing-L1 pilot](./evals/roundtrip-pilot-2026-10-29/README.md).
- Completed four-case full chains: [report, findings and improvement plan](./evals/full-roundtrip-2026-10-29/README.md), [frozen results](./evals/full-roundtrip-2026-10-29/summary.json), and [evidence collector](./evals/collect-roundtrips.mjs).
- Current behavior: the active package and its [notation](./candidate/architecture-diagram/references/notation.md), informed by [layout guidance](../../knowledge/diagrams/architecture-layout.md) and [research](../../research/diagrams/architecture-diagram/layout-and-fidelity-2026-10-29.md).
- Revised problem diagrams: [Scenario 02/03 repairs, previews and verification](./evals/layout-revision-2026-10-29/README.md). These preserve the frozen failures and record baseline corrections separately.
- Earlier visual revisions: [Scenario 02/03 visual expression, restored environment instances and blind reviews](./evals/visual-expression-2026-10-29/README.md).
- Latest revisions: [candidate packaging, explicit environment paths and readable typography](./evals/candidate-layout-2026-10-29/README.md). This is authored repair and package verification, not a fresh model-generation trial.
- Historical prototype: [editable draw.io file](./prototype/scenario-01.drawio), [rendered evidence](./prototype/scenario-01.svg), [catalog snapshot](./prototype/catalog.json) and [superseded drawing policy](./prototype/drawing-policy.md).
- Verification and limitations: [evaluation record](./evaluation.md).
- Remaining tasks and owner-dependent follow-up: [GitHub Issue #7](https://github.com/ClydeShen/skills/issues/7).

## Design choices

The candidate is the relocatable runtime package. `SKILL.md` owns behavior; `references/` owns conditionally loaded notation and draw.io guidance; `scripts/` owns exact icon lookup and catalog regeneration; `assets/` contains generated metadata. Nothing at runtime imports the initiative's tools, evaluation files or repository guidance. The catalog implementation moved into the package; the old tool path is a compatibility entry for historical fixture generators, not a second implementation. The prototype catalog is retained as evidence at its original pin, not as a second current catalog.

Keep evaluation scripts and saved evidence outside the candidate. Retire obsolete scratch work and duplicate instructions during iteration; preserve the frozen round-trip failures needed for comparison. Authorized release moves this directory to `skills/`, removes `metadata.internal: true`, and updates repository-side targets and discovery. It should not require runtime rewrites. The boolean marker is a verified skills CLI extension, not portable Agent Skills metadata. Package format and design standards are identical before and after release.

Start from the four approved scenarios, not a new taxonomy. The prototype uses explicit synthetic resolutions for Scenario 01; these are fixture assumptions, not new owner approvals or a model interaction. It demonstrates exact catalog lookup, vendor-matching checks, typography, captions, auxiliary calls and a separate failure response.

The catalog is generated from draw.io `v32.6.1`, commit `84487b4891cbc0f32d7e30f34cf878c87cb1f414`. It contains metadata and style strings for `aws4`, `azure2`, `gcp3` and `kubernetes`, not icon artwork. Four upstream Azure paths have case mismatches and are marked unusable. Palette titles are not a complete service-name alias map; duplicate titles require an explicit palette or entry ID. Unsupported vendor icons retain the accepted plain-box fallback.

The owner's [boundary and label clarification](../../research/diagrams/architecture-diagram/requirements-and-observed-style-2026-10-28.md#210-boundary-semantics-and-connector-labels-owner-2026-10-28) governs routing: domain meaning comes before readability and visual economy. Layout changes must preserve it. Connector labels interrupt their own lines; they do not require routing around the label.

The earlier [annotation placement decision](../../research/diagrams/architecture-diagram/requirements-and-observed-style-2026-10-28.md#211-annotation-placement-owner-2026-10-29) governs the preserved Scenario 01 prototype. The later [visual-expression correction](../../research/diagrams/architecture-diagram/requirements-and-observed-style-2026-10-28.md#214-visual-information-before-explanatory-notes-owner-2026-10-29) narrows Note use: each explanatory Note is a visual-design cost, so prefer supported structure, local labels and genuine relational matrices. Do not replace distinct instances with prose merely because their symbols repeat. If a Note remains necessary, use the native `Misc > Note` preset with automatic text fitting; it is a comment, not a service or flow endpoint. Fixture assumptions and evaluation caveats remain in the evaluation record rather than the diagram.

The XML checks validate the prototype's uncompressed format, declared references and route geometry. Both declared and rendered routes are checked against nested boundary membership: no shared-domain escape, unnecessary re-entry or unrelated-domain transit. Render checks also keep native inline labels on their host segments and off boundary outlines. Caption bounds are estimates; actual render inspection remains necessary. The local renderer uses Chromium with the pinned draw.io viewer, not draw.io Desktop. Generated SVG and render metrics are sanitized evaluation evidence, not a change to the `.drawio` product deliverable.

## Reproduce

Use Node.js 24 and run `npm ci` from the repository root. Core checks work without a draw.io installation or model key:

```text
node --test incubator/architecture-diagram/evals/checks.test.mjs
npm run eval -- --suite incubator/architecture-diagram/evals/suite.mjs
node incubator/architecture-diagram/tools/validate.mjs incubator/architecture-diagram/prototype/scenario-01.drawio
```

The suite is a clarification smoke test. Synthetic replay checks grading and input isolation, not model quality, and makes no model calls.

The primary behavioral evaluation crosses L0/L2/L4 from two isolated description/diagram round trips. The first [host-agent pilot](./evals/roundtrip-pilot-2026-10-29/README.md) found detail loss from the existing prototype. The subsequent [four fresh full chains](./evals/full-roundtrip-2026-10-29/README.md) found no drift in extracted Scenario 01/04 facts, a critical unsupported VPN-account assertion in Scenario 02, and an internal response-format addition in Scenario 03. Engineering checks still pass for all eight diagrams; fidelity and local layout consistency are distinct. The app agent orchestrated the live workers; a standalone vision/generation adapter is not silently configured. See the [protocol](./evals/roundtrip.md) for input boundaries and limits.

To regenerate, obtain a local checkout at the pinned upstream commit. Downloading upstream is a separate setup step; keep the checkout outside this repository. Extraction may need network access for missing Git objects in a partial clone. Generated metadata must not be manually edited.

```text
node incubator/architecture-diagram/candidate/architecture-diagram/scripts/catalog.mjs /path/to/pinned-drawio incubator/architecture-diagram/candidate/architecture-diagram/assets/catalog.json
node incubator/architecture-diagram/candidate/architecture-diagram/scripts/find-icon.mjs --vendor AWS --title Lambda
```

For the optional local browser render, check out `src/main/webapp/js/viewer-static.min.js`, `src/main/webapp/js/stencils.min.js`, `src/main/webapp/shapes/mxAWS4.js` and `src/main/webapp/shapes/mxKubernetes.js` from that commit. Also check out any catalog-referenced SVG assets used by the diagram (for these Azure fixtures, under `src/main/webapp/img/lib/azure2/`). Chromium and loopback socket access are needed; set `DIAGRAM_BROWSER` to its executable if necessary. The renderer serves only local scripts, embeds allowlisted pinned SVG resources, respects bounded declared page sizes, uses a temporary browser profile and disables external/background networking. It does not install a browser or fetch missing runtime assets.

```text
node incubator/architecture-diagram/tools/render.mjs /path/to/pinned-drawio incubator/architecture-diagram/prototype/scenario-01.drawio incubator/architecture-diagram/prototype/scenario-01.svg /path/to/preview.png
```

## Next step

Review the latest [Scenario 02/03 candidate-layout revisions](./evals/candidate-layout-2026-10-29/README.md), then test the candidate in fresh same-input generation/translation chains. Earlier ownership, hop-contract and edge-style repairs retain their provenance. The [remaining evaluation plan](./evals/full-roundtrip-2026-10-29/README.md#prioritized-improvement-plan) still calls for controlled comparisons, repetitions and held-out cases. Owner visual review, offline Desktop, GCP/Kubernetes rendering and standalone model-adapter integration remain open. Participating Azure symbols were actually browser-rendered. Scenario 05 stays deferred. The candidate is available for explicit internal discovery; it is not released or evidence of installed-client effectiveness.
