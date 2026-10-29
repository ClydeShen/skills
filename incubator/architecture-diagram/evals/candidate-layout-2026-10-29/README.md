# Candidate packaging and visual repairs

Date: 2026-10-29. Mode: authored artifact repair, package checks and local browser rendering. Baseline: `ca4a53561f2a67a4e5a4fdbc162b4d07de07f04f`. The owner requested accurate, visually informative diagrams without additional conceptual machinery, and standard skill packaging throughout incubation.

## Result

The [candidate](../../candidate/architecture-diagram/SKILL.md) now contains the runtime instructions and resources. It uses the same format as a released skill, with a candidate-only discovery marker. Evaluation generators and historical evidence remain outside it. The existing catalog implementation moved into the package; its old entry point only re-exports it. No second runtime implementation or release copy was added.

| Case | Preview | Editable source | Main repair |
| --- | --- | --- | --- |
| 02 | [PNG](./case-02/diagram.png), [SVG](./case-02/diagram.svg) | [draw.io](./case-02/diagram.drawio) | Draw test/prod DNS and HTTPS paths explicitly; remove the substitute environment-mapping matrix |
| 03 | [PNG](./case-03/diagram.png), [SVG](./case-03/diagram.svg) | [draw.io](./case-03/diagram.drawio) | Enlarge text, open label spacing, separate authorization caption from the sub-workflow boundary |

Both diagrams use a uniform 16-unit architectural font instead of 12, with unchanged 72-unit icons. Labels remain native edge labels. There are no explanatory Notes. Distinct instances, boundary memberships and all previous relationship endpoints remain intact. Branch conditions still select one environment; adding source paths does not imply broadcast. Case 03 retains exact `Common-Authx-Handler` spelling, XML wrapping rather than conversion, explicit generic failure returns and the unspecified internal Lambda payload contract.

## Verification and trade-offs

The [regressions](../candidate.test.mjs) check package relocation, exact icon selection, active-candidate prompt loading, retained architectural identity, new source paths, uniform typography and pairwise rendered-text collisions. The latest actual renders pass static, boundary-route, inline-label and native-Note checks. Targeted visual self-review led to moving authentication text, lifting the authorization component, and separating nearby VPN/DNS/HTTPS labels. This is author inspection, not independent visual judgment.

Case 02 now has 25 edges rather than 21. It has 17 bends and three proper crossings rather than 11 bends and no crossings. The additional connections make the earlier count an unequal-information baseline; reducing counts by hiding paths would be a regression. Crossing routes do not share segments, and the legend states that crossings are not junctions. The Route 53 upper route remains a small justified detour to avoid the incoming DNS leg. Case 03 retains 17 edges, 13 bends and no proper crossings. Both canvases are still wide; use the vector/editable view or zoom for detailed reading. These are diagnostics and trade-offs, not proof of an optimal layout.

The [summary](./summary.json) records package/source/artifact hashes and geometry. Earlier full-chain failures and blind readouts are unchanged. No new model-generation trial, image-only readout or L0-to-L4 chain was run here. Browser rendering with pinned draw.io `32.6.1` is not Desktop verification. Candidate effectiveness, installed-client behavior, broader vendor rendering and Scenario 05 remain open; no release is authorized by these checks.

## Reproduce

Use the initiative's documented Node.js 24 setup, pinned draw.io checkout and browser renderer. Run from the repository root:

```text
node incubator/architecture-diagram/evals/candidate-layout-2026-10-29/generate-02.mjs
node incubator/architecture-diagram/evals/candidate-layout-2026-10-29/generate-03.mjs
node incubator/architecture-diagram/tools/render.mjs /path/to/pinned-drawio incubator/architecture-diagram/evals/candidate-layout-2026-10-29/case-02/diagram.drawio incubator/architecture-diagram/evals/candidate-layout-2026-10-29/case-02/diagram.svg incubator/architecture-diagram/evals/candidate-layout-2026-10-29/case-02/diagram.png
node incubator/architecture-diagram/tools/render.mjs /path/to/pinned-drawio incubator/architecture-diagram/evals/candidate-layout-2026-10-29/case-03/diagram.drawio incubator/architecture-diagram/evals/candidate-layout-2026-10-29/case-03/diagram.svg incubator/architecture-diagram/evals/candidate-layout-2026-10-29/case-03/diagram.png
node incubator/architecture-diagram/evals/candidate-layout-2026-10-29/collect.mjs
node --test incubator/architecture-diagram/evals/candidate.test.mjs
```

Use a new evidence directory for subsequent design revisions. Do not overwrite these artifacts to repair the original frozen round-trip measurements.
