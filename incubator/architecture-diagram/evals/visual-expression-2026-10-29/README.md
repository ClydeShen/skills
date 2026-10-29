# Visual expression without explanatory Notes

Date: 2026-10-29. Stage: prototype, no installable skill. These are iterative artifact revisions following owner review, not a controlled prompt comparison or a new complete L0-to-L4 experiment.

The owner rejected Note-heavy diagrams and the replacement of repeated components with prose. The revised examples remove eight Notes from Scenario 02 and five from Scenario 03. Facts move to their responsible nodes, directed interactions and explicit relation matrices. Distinct environment instances stay visible; reducing visual repetition is not a reason to erase architectural entities. Zero Notes is a diagnostic, not evidence of good design by itself.

## Selected artifacts

| Scenario | Preview | Editable source | Image-only evidence |
| --- | --- | --- | --- |
| 02: private cross-cloud API | [PNG](./case-02/diagram.png), [SVG](./case-02/diagram.svg) | [draw.io](./case-02/diagram.drawio) | [Readout](./case-02/readout.txt), [visual review](./case-02/visual-review.txt) |
| 03: partner amendments | [PNG](./case-03/diagram.png), [SVG](./case-03/diagram.svg) | [draw.io](./case-03/diagram.drawio) | [Readout](./case-03/readout.txt), [visual review](./case-03/visual-review.txt) |

The architecture baseline is the previous repair's resolved [Scenario 02 input](../layout-revision-2026-10-29/inputs/l0-02.txt) and [Scenario 03 input](../layout-revision-2026-10-29/inputs/l0-03.txt). Their account and exact-hop corrections remain intact. All earlier architectural node identities and memberships, and all existing directed edge endpoints, are retained. Two representative workload symbols restore the already-described test/prod instances; they do not assert physical fleet cardinality. Two new directed failure edges express an existing generic-error requirement, not a newly invented outcome.

## Communication audit

| Former explanation | Current encoding | Guardrail |
| --- | --- | --- |
| 02 caller alternative and repeated environments | A representative workload in each dev/test/prod VNet, aligned with the matching AWS account; local alternative label | Same icon does not mean same entity. A representative symbol does not specify replica count. |
| 02 outbound forwarding rule | A3 connector names the outbound ruleset, namespace and destination IP/port | The association belongs to the actual outbound endpoint, not a floating caption. |
| 02 Azure connections and environment mapping | Editable relation matrix names each spoke, hub, DNS VNet and matching account; B7 branches say dev/test/prod only | Matrix summarizes repeated connections, not component existence. One environment is selected per request, not broadcast. |
| 02 TGW attachments | VPC-to-CIDR matrix; routing unknown stays on TGW | No invented per-VPC packet path. |
| 02 private entry and DNS responsibility | VPCE entry label, distinct DNS/HTTPS paths, DNS-only resolver label and zone-local namespace/association | No outbound Route 53 component added. Omission from this view is not proof of absence from a real deployment. |
| 02 firewall allowances | Source-by-destination/protocol matrix explicitly applies to both firewalls | Unlisted rules remain unspecified, not denied by inference. |
| 02 deployment parameters and unknowns | Local region, endpoint and namespace parameters; Lambda runtime and TGW routing marked unspecified | No fabricated deployment values or runtime. |
| 03 APIM controls | Policy node lists roles/profile; step 4 states authentication and APIM controls precede routing | Does not invent a denial response. |
| 03 identity | Basic/Bearer on entry hops; identity exchange unknown on B2C | No added identity protocol. |
| 03 validation and conversion | Each method processor names validation, wrapping decoded XML in JSON and the JSON/Liquid/XML response transformation; role/profile conditions stay on its branch | Wrapping is not generic XML-to-JSON conversion. Transformations belong to processors, not network hops. |
| 03 failure behavior | Two reverse arrows to the originating callers, with bold internal-error/timeout condition and generic-only result | No expanded authentication/authorization-failure behavior. |
| 03 AWS operation and responsibility | Gateway operation/schema unknown on Gateway; business-rule validation on Lambda | No JSON claim on the internal Lambda invocation. |

Names, type labels, protocols, conditions and a compact notation legend remain necessary vocabulary. The matrices contain actual repeated relations, not paragraphs disguised as tables. Case 02 still draws the shared A/B route once and summarizes its other environment connections; this is a declared compression of routes, not permission to replace those environments' components with text.

## Iteration and evidence limits

The first Scenario 02 zero-Note attempt received a fresh image-only readout from `/root/visual_read_a`. Its review identified weak hosted-zone label attachment and possible environment fan-out ambiguity. The author revised the zone's own caption and made each B7 branch environment-specific. The owner's subsequent correction restored test/prod workload symbols instead of the previous prose placeholders. The first attempt and its readout remain in ignored `evals/.local/visual-expression-first-read/`; they are not overwritten or counted as a selected success.

Scenario 03's first readout used `/root/visual_read_b`. Subsequent author review found that `Decoded XML → JSON` was too loose for the source's specific wrapping operation. Both processors now say `Wrap decoded XML in JSON`; the earlier image and readout remain in ignored `evals/.local/visual-expression-03-first-read/`. This is a separate artifact revision, not a change to a frozen measurement.

The selected images were read in fresh contexts `/root/visual_read_c` (02) and `/root/visual_read_d` (03), using neutral-named raster-only inputs and generic transcription/visual-review instructions. They received neither the source text nor the expected fixes. Their unchanged outputs and attestations are linked above. This is conversation isolation on a shared filesystem, not an OS-enforced input sandbox. Exact host model identity and sampling parameters are unavailable. No separately configured NVIDIA or other model endpoint was called.

Scenario 02's reader identifies all three visible callers in their own VNets and the matching account alternatives, recovers the outbound ruleset and zone association, and distinguishes DNS from private API entry. Its review also identifies residual dependence on the connection/attachment matrices and legend: test/prod paths are compressed, and the three destination edges require their conditions to distinguish selection from fan-out. The source-side route compression is still less visually explicit than the repeated destination structure. B7 labels are dense, and the shared traffic corridor needs close inspection. A follow-up should test explicit source-side connections and locally placed attachment relations against the same facts, without adding crossings or implying new routing details.

Scenario 03's reader recovers local controls, method roles, the precise XML-in-JSON wrapping, separate generic-error returns and the unspecified internal contract. It also flags small text, tight multiline labels and close parallel VPN paths. It reads `Common-Authx-Handler` but explicitly marks one character visually uncertain; exact-name readability is therefore not a clean pass. Normal responses still use the accepted folded-response notation rather than a complete reverse-path drawing. These are remaining readability tradeoffs, not a perfect visual-quality result.

The parent checks targeted facts against the readouts; there is no independent complete fact-ledger judgment, L3 redraw or L4 readout. The earlier full-chain failures remain frozen. Repeated complete chains, held-out cases, controlled same-input prompt comparisons, Desktop behavior and owner acceptance remain open. Do not infer general skill reliability or release readiness.

## Checks and reproduction

The [collector](./collect.mjs) records hashes, Note counts, actual rendered geometry and bounded conformance in [summary.json](./summary.json). Three new [regression tests](../visual-expression.test.mjs) protect component identity/membership, local fact placement, existing endpoints, the declared failure edges and zero-Note geometry. They cannot prove aesthetic quality or complete semantic fidelity.

Both selected diagrams pass static XML, actual browser-render geometry and catalog checks. Counted proper crossings remain zero; bend counts remain 11 (02) and 13 (03). No bend-count improvement is claimed for this revision. Local verification passed 54 regression tests, 42 default fixture assertions, four architecture clarification fixture assertions and both loopback provider contracts. Advisory agnix still reports the two existing candidate `metadata.internal` incompatibilities; it is not a clean lint scan. These are engineering results, not a semantic or visual-quality pass rate.

From the repository root, run the two `generate-02.mjs` / `generate-03.mjs` files in this directory. Render each with the [pinned local browser setup](../../tools/README.md#render-locally), targeting its `diagram.svg` and `diagram.png`. Then run:

```text
node --test incubator/architecture-diagram/evals/visual-expression.test.mjs
node incubator/architecture-diagram/evals/visual-expression-2026-10-29/collect.mjs
```

Generators reproduce these fixtures; they are not a general-purpose drawing skill. The collector does not rerun image readers. The policy used here is frozen as [plain-text input](./inputs/drawing-policy.txt). The prior layout-revision collector now also reads an exact snapshot of its historical policy instead of the mutable current policy; its existing summary remains byte-for-byte unchanged.
