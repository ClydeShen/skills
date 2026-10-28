# Architecture Diagram

Date: 2026-10-28. Stage: prototype (before candidate packaging). Decision authority: owner-authorized work that can proceed while Scenario 05 is deferred and the owner is offline.

## Goal and scope

Turn an English scenario description into one editable `.drawio` dynamic diagram in a deployment view. Preserve the team's visual style, C4 information and correct vendor responsibilities. Raise consequential gaps and contradictions with recommendations before drawing. Initial input is text; overviews, infrastructure plans, code/IaC input, automatic redraw and exported images as product deliverables are later scope.

## Sources and active artifacts

- Accepted requirements and decisions: [research handoff](../../research/diagrams/architecture-diagram/requirements-and-observed-style-2026-10-28.md).
- Evidence: [vendor/C4 conventions](../../research/diagrams/architecture-diagram/vendor-diagram-conventions-2026-10-28.md) and [draw.io libraries](../../research/diagrams/architecture-diagram/drawio-builtin-icon-libraries-2026-10-28.md).
- Authoring philosophy: [skill design principles](../../knowledge/skill-design/skill-design-principles.md).
- Active package: none. There is no `SKILL.md` and no installable skill yet.
- Approved evaluation scenarios: [01](./evals/scenario-01.md), [02](./evals/scenario-02.md), [03](./evals/scenario-03.md), [04](./evals/scenario-04.md).
- Evaluation suite and checks: [suite](./evals/suite.mjs), [manifest/assertion data](./evals/cases.json), [tests](./evals/checks.test.mjs).
- Prototype: [editable draw.io file](./prototype/scenario-01.drawio), [rendered evidence](./prototype/scenario-01.svg), [catalog](./prototype/catalog.json).
- Verification and limitations: [evaluation record](./evaluation.md).
- Remaining tasks and owner-dependent follow-up: [GitHub Issue #7](https://github.com/ClydeShen/skills/issues/7).

## Design choices

Start from the four approved scenarios, not a new taxonomy. The prototype uses explicit synthetic resolutions for Scenario 01; these are fixture assumptions, not new owner approvals or a model interaction. It demonstrates exact catalog lookup, vendor-matching checks, typography, captions, auxiliary calls and a separate failure response.

The catalog is generated from draw.io `v32.6.1`, commit `84487b4891cbc0f32d7e30f34cf878c87cb1f414`. It contains metadata and style strings for `aws4`, `azure2`, `gcp3` and `kubernetes`, not icon artwork. Four upstream Azure paths have case mismatches and are marked unusable. Palette titles are not a complete service-name alias map; duplicate titles require an explicit palette or entry ID. Unsupported vendor icons retain the accepted plain-box fallback.

The XML checks validate the prototype's uncompressed format, declared references and route geometry. Caption bounds are estimates; actual render inspection remains necessary. The local renderer uses Chromium with the pinned draw.io viewer, not draw.io Desktop. Generated SVG and render metrics are sanitized evaluation evidence, not a change to the `.drawio` product deliverable.

## Reproduce

Use Node.js 24 and run `npm ci` from the repository root. Core checks work without a draw.io installation or model key:

```text
node --test incubator/architecture-diagram/evals/checks.test.mjs
npm run eval -- --suite incubator/architecture-diagram/evals/suite.mjs
node incubator/architecture-diagram/tools/validate.mjs incubator/architecture-diagram/prototype/scenario-01.drawio
```

The suite is a clarification smoke test. Synthetic replay checks grading and input isolation, not model quality. No model calls were made.

To regenerate, obtain a local checkout at the pinned upstream commit. Downloading upstream is a separate setup step; keep the checkout outside this repository. Extraction may need network access for missing Git objects in a partial clone. Generated metadata must not be manually edited.

```text
node incubator/architecture-diagram/tools/catalog.mjs /path/to/pinned-drawio incubator/architecture-diagram/prototype/catalog.json
node incubator/architecture-diagram/tools/prototype.mjs
```

For the optional local browser render, check out `src/main/webapp/js/viewer-static.min.js`, `src/main/webapp/js/stencils.min.js`, `src/main/webapp/shapes/mxAWS4.js` and `src/main/webapp/shapes/mxKubernetes.js` from that commit. Chromium and loopback socket access are needed; set `DIAGRAM_BROWSER` to its executable if necessary. The renderer serves only local resources, uses a temporary browser profile, disables background networking and blocks external DNS resolution. It does not install a browser or fetch runtime assets.

```text
node incubator/architecture-diagram/tools/render.mjs /path/to/pinned-drawio incubator/architecture-diagram/prototype/scenario-01.drawio incubator/architecture-diagram/prototype/scenario-01.svg /path/to/preview.png
```

## Next step

Review the rendered prototype when the owner is available: 72-unit icons, caption density and practical readability. Test the same file in offline draw.io Desktop at the pinned version. Then refine from that evidence and package the minimum useful runtime instructions and tools. Scenario 05 remains deferred, not rejected or invented. Azure/GCP/Kubernetes runtime rendering and independent blind readout remain open; the first prototype exercises AWS only.
