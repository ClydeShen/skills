# Architecture Diagram full round trips: report

Date: 2026-10-29. Scope: four fresh L0-to-L4 chains, one attempt per resolved synthetic scenario. Stage: pre-candidate; no installable or released skill.

## Conclusion

Follow-up, 2026-10-29: [official-source research and artifact repairs](../layout-revision-2026-10-29/README.md) refine F1's interpretation. AWS requires the VPN attachment in the Transit Gateway owner's account. The measured source/visual drift below remains unchanged; the later account placement is not thereby an invalid AWS architecture. The follow-up repairs source admission and diagrams without rewriting this run's inputs, images, readouts or judgments.

The four full chains are complete. Scenarios 01 and 04 have no drift found among the extracted architectural facts. Scenario 02 has a critical unsupported account-membership assertion and an unresolved ruleset-attachment qualifier. Scenario 03 adds an unsupported internal response-format detail. The result is not an all-green quality assessment, despite all eight diagrams passing the current XML/rendered-geometry checks.

The main lesson is that local diagram consistency does not establish source fidelity. A readout can introduce an ownership assumption, and a subsequent faithful redraw can turn that assumption into explicit geometry. A stable later round can preserve an earlier invention just as it can preserve an earlier omission.

## Method and input boundaries

Each case ran fresh L0 -> L1 diagram -> image-only L2 -> L2-only L3 diagram -> another image-only L4, followed by separate L0/L2, L2/L4 and L0/L4 semantic judgments. There were 20 fresh task contexts: eight generators, eight readers and four judges. Readers saw PNGs, not XML/SVG, source text or expected facts. Generators shared the same [frozen general policy](./inputs/policy.txt), catalog and generic tools, not hidden answers. Diagrams could receive geometry repairs before freezing, but no measured diagram/description was repaired after readout or semantic feedback. See [protocol](../roundtrip.md), [execution record](./execution.json) and [derived summary with hashes/findings](./summary.json).

These are declared test fixtures, not real deployment approvals. The [original case drafts](../scenario-01.md) and their sibling Scenario 02-04 documents retain raw contradictions/questions. The frozen L0 files state the bounded test choices; raw-input clarification behavior is separate from this fidelity experiment.

| Case | Frozen L0 | Declared choices / limits |
| --- | --- | --- |
| 01 | [API authorization](./inputs/l0-01.txt) | Generic Web app/REST backend, external HTTPS and generic AWS invocation; Cognito rather than the page verifies passwords. These remain synthetic resolutions. |
| 02 | [Private cross-cloud API](./inputs/l0-02.txt) | Remove Route 53 outbound endpoint; associate the hosted zone with ingress VPC; DNS also passes Network Firewall; representative Function App with Logic Apps alternative; region/resolver IPs remain parameters. AWS VPN account ownership is not supplied, a material baseline gap exposed by the run. |
| 03 | [SOAP amendments](./inputs/l0-03.txt) | Per-method roles and amend-profile requirement; deleted scope excluded; exact AWS operation/schema and identity exchange remain unspecified. Basic/bearer input does not assert native B2C Basic support. |
| 04 | [Metadata/retrieval](./inputs/l0-04.txt) | Three queue/listener pairs, generic unknown producer, public HTTPS rather than assumed VPN, one temporary-blob save; retention duration unknown; business/status/schema/alarm details intentionally excluded. |

## Results

"No drift found" is conditional on fact extraction and semantic interpretation, not proof of completeness or architecture correctness. Fact counts depend on granularity and are not pass percentages.

| Case | Facts L0 / L2 / L4 | L0 -> L2 | L2 -> L4 | L0 -> L4 |
| --- | --- | --- | --- | --- |
| 01 | 52 / 52 / 52 | No drift found | No drift found | No drift found |
| 02 | 65 / 66 / 66 | Hard failure: 1 critical addition | Incomplete: 1 ambiguous qualifier | Hard failure: addition persists; qualifier ambiguous |
| 03 | 62 / 66 / 66 | Drift: 1 response-format addition | No new drift found | Same addition persists |
| 04 | 40 / 40 / 40 | No drift found | No drift found | No drift found |

The older [existing-L1 pilot](../roundtrip-pilot-2026-10-29/README.md) remains a separate negative measurement with 11 omissions. This new Scenario 01 run generates a new L1 from the fuller frozen L0; it is not a claim that the old displayed prototype was silently repaired or that a candidate skill improved statistically.

### F1. Unsupported VPN account ownership — P0

L0 places Transit Gateway in the network services account but does not state the account ownership of AWS Site-to-Site VPN. L2 explicitly assigns the VPN to that account. L3 then actually parents the VPN under the account, and L4 repeats that ownership. The added claim is critical because a domain/ownership assertion has been created without source authority.

The parent audited the frozen diagrams after the chain: L1's `awsvpn` is a child of `region`, outside `network`; L3's `aws-vpn` becomes a child of `network`. Thus the discrepancy is not merely wording: the inferred readout becomes new nesting. This audit was not supplied to the blind readers or judge. L1's top-level placement also does not safely communicate "ownership unknown": outside a known account boundary is not a general substitute for an unspecified owner. The input-admission gap and the readout inference both deserve attention; the result cannot be blamed solely on one generation prompt.

Improvement: require explicit ownership, or resolve a blocking ownership question, before placing a resource relative to a material account/trust boundary. Keep unspecified ownership as an explicit unknown rather than completing it from attachment, proximity or familiar cloud conventions. Add a pre-generation ownership ledger and an image-readout check for each critical domain. Acceptance: no unstated membership is asserted; a later redraw cannot introduce a new parent without supported source evidence.

### F2. Forwarding-ruleset attachment loses precision — P1, unresolved

L2 explicitly attaches the execute-api forwarding ruleset to the outbound endpoint. L4 says "Its DNS forwarding ruleset" after mentioning the DNS extension VNet and both endpoints. The wildcard/target IPs and forwarding behavior survive, but the attachment is not unambiguous. This is not a confirmed attachment transfer or a proved vendor error; the judgment is `uncertain`, not a fabricated pass/failure.

Improvement: use explicit subject/action/object phrasing for ownership and attachment facts in captions, notes and readouts. In this case, name the outbound endpoint rather than "its". Acceptance: an independent reader can name the ruleset's attachment without relying on vendor priors or grammatical guesswork.

### F3. External JSON contract spreads to an internal hop — P1

L0 specifies the AWS amend API's JSON response back to the sub-workflow. It does not specify the response format on the internal API Gateway-to-Lambda invocation. L1 nevertheless labels the internal `invoke` relationship "JSON response"; L2 reads it faithfully, L3 retains the label and L4 repeats it. The parent confirmed the frozen L1/L3 labels after judgment. This is an unsupported implementation detail, not a lost endpoint or an established access-control change.

Improvement: attach protocol/payload/response facts to their exact source relationship. Do not distribute an external API contract over internal edges merely because the implementation looks familiar. Use the known broad invocation technology without inventing a payload contract; leave unspecified facts unspecified. Acceptance: every edge-level format/security qualifier has evidence for that particular hop.

### F4. Baseline and ontology admission need tighter review — P1

The normalized L0 is itself an evaluation artifact. The parent found that the original Scenario 03 draft explicitly expects a solid route-processor-to-authorization-handler call, while the frozen L0's broad auxiliary-auth/query wording does not preserve that edge-specific style requirement clearly. The measured diagrams/readouts classify the delegation as auxiliary. This is a raw-draft-to-fixture conformance gap outside the reported L0/L2 comparisons; it must not be hidden by a clean ledger. Do not revise the frozen run to retroactively fix it.

C4 type labels and APIM internal policy decomposition also require an explicit interpretation policy: faithful notation is not automatically a new deployed unit, but a new lifecycle/hosting/ownership assertion would be drift. Judges received that scope clarification; extraction/alignment remains a judgment.

Improvement: version a raw-input-to-resolved-L0 change log and a checklist of required edge semantics before running a chain. Distinguish allowed notation from new architecture; classify split/merged representations by their meaning, not literal node-count or keyword equality. Acceptance: every intentional omission/correction and every meaningful original assertion is accounted for before L0 is frozen.

## Engineering and visual findings

All eight outputs pass the current static XML and actual browser-geometry checks. Native Note key appearance/auto-fit properties also match the checked preset. These are bounded conformance checks, not source-truth validation; they did not catch F1 or F3.

Local engineering verification passed 47 regression tests, 42 default fixture assertions, four architecture clarification fixture assertions and both loopback provider contracts. The saved full-chain test explicitly expects Scenario 02's hard failure and Scenario 03's drift. Passing that regression test preserves negative evidence; it is not a semantic pass for those scenarios.

The renderer was extended and actually smoke-tested for exact catalog SVG resources, including Azure Function Apps. Azure assets are loaded from the pinned local draw.io checkout and embedded into the rendered evidence. This prevents missing-image exports or loopback-relative SVG references; upstream artwork is not added as an icon library to the skill repository. Page dimensions now follow bounded declared page sizes rather than clipping everything to 1900 x 1040. Unknown/noncatalogued images, unsafe paths and oversized pages are rejected. This covers participating icons only, not the whole Azure catalog or every viewer.

The exact-match catalog does not provide a verified Blob Storage service entry or a verified Azure cloud-brand badge. The experiment uses truthful plain-box/text fallbacks rather than borrowing a related product's icon. This is a catalog/alias/provenance gap, not proof that draw.io or Azure lacks an appropriate icon. Before candidate packaging, verify official aliases/badges and their terms, or explicitly retain the fallback. Desktop rendering and interactive Note auto-fit remain untested.

## Prioritized improvement plan

The changes below are proposals informed by this run, not claims that the remaining skill/runtime issues are already fixed. Rendering support needed to execute this run was implemented; the other items require separate implementation and validation.

| Priority | Layer | Change | Verification |
| --- | --- | --- | --- |
| P0 | Runtime decisions | Resolve material account/trust membership before grouping; never infer ownership from connection/proximity | Add ambiguous-ownership cases; verify no invented parent in image readout and redraw |
| P1 | Runtime decisions | Bind each protocol/payload/response qualifier to its actual hop; preserve unknowns explicitly | Mutate external/internal contracts and check F3 is detected/prevented |
| P1 | Input/evaluation | Audit raw draft -> resolved L0, including main/auxiliary/failure classification and exclusions | Freeze change log and required-fact checklist before generation |
| P1 | Evaluation | Add controlled image mutations and negative controls for ownership, arrow direction, multiplicity and label omission | Confirm readers/judge detect actual changes rather than reconstructing standard vendor patterns |
| P1 | Tooling | Keep catalog-allowlisted asset rendering, bounded pages and exact native Note checks; verify Azure aliases/badges | Test affected icons/renderers without substituting lookalike symbols |
| P2 | Evaluation | Repeat chains, use held-out cases and compare old/new instructions under the same model/budget | Report variability and retained failures, not one aggregate similarity score |
| P2 | Integration | Configure a standalone generation/vision adapter with explicit provider, model metadata and budget | One command launches genuinely fresh contexts and reproduces the recorded input boundaries |
| P2 | Host coverage | Test offline Desktop and later Scenario 05 (GCP/Kubernetes) | Record actual host/vendor results; do not infer them from AWS/Azure browser tests |

Keep the eventual skill short: ownership/contract/unknown decision rules belong in runtime instructions; version pinning, rendering mechanics and multi-round evaluation belong in authoring tools/harness. Do not require two full round trips for every ordinary user diagram merely because they are valuable incubation tests. No `SKILL.md` or release is created by this report.

## Evidence and reproduction

Each case retains the exact generated PNGs used for reading, both editable diagrams, SVGs, browser geometry, both readouts and a grounded semantic judgment. These are synthetic generated diagrams, not private source screenshots. The [summary](./summary.json) includes source/diagram/image hashes, all three pair results and bounded conformance checks.

| Case | L1 image / editable | L3 image / editable | Readouts and judgment |
| --- | --- | --- | --- |
| 01 | [PNG](./case-01/l1.png), [draw.io](./case-01/l1.drawio) | [PNG](./case-01/l3.png), [draw.io](./case-01/l3.drawio) | [L2](./case-01/l2.txt), [L4](./case-01/l4.txt), [judgment](./case-01/judged.json) |
| 02 | [PNG](./case-02/l1.png), [draw.io](./case-02/l1.drawio) | [PNG](./case-02/l3.png), [draw.io](./case-02/l3.drawio) | [L2](./case-02/l2.txt), [L4](./case-02/l4.txt), [judgment](./case-02/judged.json) |
| 03 | [PNG](./case-03/l1.png), [draw.io](./case-03/l1.drawio) | [PNG](./case-03/l3.png), [draw.io](./case-03/l3.drawio) | [L2](./case-03/l2.txt), [L4](./case-03/l4.txt), [judgment](./case-03/judged.json) |
| 04 | [PNG](./case-04/l1.png), [draw.io](./case-04/l1.drawio) | [PNG](./case-04/l3.png), [draw.io](./case-04/l3.drawio) | [L2](./case-04/l2.txt), [L4](./case-04/l4.txt), [judgment](./case-04/judged.json) |

Recollect the checked evidence and comparison reports without model calls:

```text
node incubator/architecture-diagram/evals/collect-roundtrips.mjs incubator/architecture-diagram/evals/full-roundtrip-2026-10-29
```

This replays evidence validation, not live model generation. The live chains were orchestrated through the app's agent tools; a configured one-command unattended model launcher is still absent. All workers had fresh conversation contexts but shared filesystem access and likely model priors. Exact host model identity/sampling parameters were not exposed; no cross-model diversity or statistical reliability is claimed. No separately configured NVIDIA/external model endpoint was invoked. Source-fidelity testing does not replace current vendor-capability research or validate an actual deployed architecture. Scenario 05, Desktop integration and repeated/held-out trials remain outside this completed run.
