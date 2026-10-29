# Architecture fidelity and layout repairs

Date: 2026-10-29. Stage: prototype, no installable skill. The owner requested repairs to real defects and researched layout improvements before further skill incubation.

Scenario 02/03 now have revised editable diagrams. The changes correct evidenced membership and contract problems, make the ruleset association explicit, restore the original authorization-call style and remove avoidable bends. The old four-case run remains frozen. These are artifact repairs with two fresh image-only readouts, not a new complete round-trip experiment or measured prompt superiority.

## Review the results

| Scenario | Preview | Editable diagram | Blind readout |
| --- | --- | --- | --- |
| 02: private cross-cloud API | [PNG](./case-02/diagram.png), [SVG](./case-02/diagram.svg) | [draw.io](./case-02/diagram.drawio) | [Description](./case-02/readout.txt) |
| 03: partner amendments | [PNG](./case-03/diagram.png), [SVG](./case-03/diagram.svg) | [draw.io](./case-03/diagram.drawio) | [Description](./case-03/readout.txt) |

## Repairs and their evidence

| Finding | Repair | Observed check |
| --- | --- | --- |
| F1: VPN account changes during translation | Research establishes that a Site-to-Site VPN attachment belongs to the Transit Gateway owner's account. The revised symbol explicitly represents that attachment inside the network services account. | The blind reader identifies the attachment in that account and outside the three VPCs. |
| F2: ruleset association becomes ambiguous | The local native Note names the Private Resolver outbound endpoint as the associated endpoint. | The blind reader states that association and preserves the namespace, destination IP parameters and port 53. |
| F3: external JSON contract spreads to Lambda invocation | Remove the JSON response qualifier only from the internal invocation. External HTTPS/JSON request/response labels remain. | The blind reader explicitly observes that the Lambda invocation does not state a response format. |
| F4: source normalization loses the solid delegation | Restore the original draft's solid API-Route-Processor → Common-Authx-Handler workflow call. Keep the Cosmos role query dashed. | XML comparison verifies the style correction; the image reader retains the workflow delegation and distinguishes the dashed authentication/query paths. |

F1 refines the previous interpretation: the measured drift was real, but the later account membership was not proved wrong. The [admission record](./admission.md) identifies the two revised input statements, their authority and unchanged exclusions. Layout-only changes were checked against old node identities, responsibilities, parents and directed edge contracts, with only the declared semantic repairs allowed. That comparison does not establish completeness of the old diagrams against every original requirement.

## Layout choices

The [research](../../../../research/diagrams/architecture-diagram/layout-and-fidelity-2026-10-29.md) supports deliberate direction, grouping, alignment and lower crossing complexity. It does not establish universal compass rules. The current [short prototype policy](../../prototype/drawing-policy.md) and [reusable layout guidance](../../../../knowledge/diagrams/architecture-layout.md) record the decisions.

Scenario 02 retains a left-to-right cross-cloud backbone and consistent dev/test/prod ordering. Its DNS entry now shares a row with the inbound/outbound endpoints. The resolver-to-zone upper route is retained because straightening it introduced a crossing with the incoming DNS leg. Necessary separation between DNS and HTTPS remains; the inspection-to-ingress route stays outside the unrelated egress VPC.

Scenario 03 aligns the main order-processing path, VPN, API Gateway and Lambda. The document method remains a separate lower branch, and authentication/role-query helpers remain above the request path. This removes small steps between the VPN and gateway and longer unnecessary bends in the main path. Notes retain local subjects; authorization remains a structured mapping. The declared page height decreases from 2400 to 2160 without shrinking architectural typography.

| Rendered geometry | Original L1 | Revised |
| --- | --- | --- |
| Scenario 02 bends | 13 | 11 |
| Scenario 03 bends | 21 | 13 |

These counts are diagnostics, not quality scores or proof of optimal routing. The [metrics tool](../../tools/layout-metrics.mjs) reports bends, length and aligned-endpoint detours. Its lower bound ignores obstacles and domain constraints; a flagged detour requires inspection, never automatic straightening. The hosted-zone upper route is a retained, justified example. A first repair attempt had 9 bends but introduced an extra crossing; it and its readout are retained in ignored local evidence. The selected revision restores that route and uses a new blind reader. No semantic feedback was used to change the revised image.

## Verification and limitations

Both revised artifacts passed the existing static, real Chromium geometry and native Note checks. All rendered Note text fits its background. An actual renderer defect was fixed: annotation attributes encoded on draw.io user objects were missing from exported metrics. The renderer now reads both supported locations; a regression exercises the browser-serialized function. Old render evidence is preserved and must not be assumed to have that expanded coverage.

Local repository verification passed 51 regression tests, 42 default fixture assertions, four architecture clarification fixture assertions and the loopback provider contracts. The revised routes do not increase counted segment-interior crossings. These are bounded engineering checks, not a skill success rate.

The two reader contexts were launched with `fork_turns: none`, received only neutral-named PNGs and generic transcription instructions, and attested to reading only their assigned image. They did not receive source descriptions, XML/SVG, findings or the repair plan. Exact host model identity/parameters were not exposed; contexts share filesystem access. The parent compared the readouts with the targeted fixes after freezing the diagrams. There was no independent full fact-ledger judge, L3 redraw or L4 readout in this repair verification. No NVIDIA endpoint was used.

The [summary](./summary.json) records artifact hashes, reader provenance, checks and geometry. Scenarios 01/04 were not redrawn; their frozen round-trip regression records remain. General layout effectiveness, cross-model reliability, complete new same-input L0/L2/L4 chains, held-out cases and Desktop behavior remain unverified. The initiative is not release-ready on this evidence alone.

## Reproduce

From the repository root, regenerate the two editable files with the checked-in `generate-02.mjs` and `generate-03.mjs` in this directory. These generators adapt the earlier synthetic artifact authoring sources; they are not general-purpose skill generators.

Render each file with the initiative's pinned renderer and upstream checkout, using `case-02/diagram.svg` / `case-02/diagram.png` (and the corresponding Case 03 paths) as outputs. Run `node --test incubator/architecture-diagram/evals/layout-revision.test.mjs`. Run `node incubator/architecture-diagram/evals/layout-revision-2026-10-29/collect.mjs` to refresh the derived summary. Replaying these commands does not rerun the blind readers.
