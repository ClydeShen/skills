# Architecture Diagram evaluation

Date: 2026-10-28. Updated: 2026-10-29. Status: prototype, deterministic checks, an existing-L1 pilot and four fresh full chains completed; critical/noncritical semantic drift found, Desktop integration and candidate behavior unverified.

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

Initial author inspection found a failure-response label covering the AWS boundary title. Routes were moved until text-collision checks passed. That did not establish architecture correctness: subsequent owner feedback rejected the internal authorization path because it left and re-entered API enforcement. The original checks missed this, and the rerouting prioritized text avoidance over boundary meaning. The owner also clarified that native connector labels should interrupt their own lines. The initial prototype is preserved in Git at `31ca399`; it is not an accepted layout.

### Boundary feedback correction, 2026-10-28

The revised prototype rearranges nodes, uses direct request, forward and policy-query paths, and keeps the authorization path within API enforcement. Native connector labels sit on their strokes with opaque backgrounds. Labels are moved along their host segments or wrapped rather than causing unnecessary detours; they do not cover boundary outlines.

The validator now derives permitted inside/outside sequences from each endpoint's nested domain membership. It checks declared XML waypoints and actual browser-resolved routes, rejects shared-domain escape, unnecessary re-entry, unrelated-domain transit and ambiguous boundary-following, and checks child containment. Render metrics include parent membership, endpoints and exact domain bounds. Inline-label hosting and boundary masking are checked separately from node-text collisions. Regression mutations recreate the rejected detour in both XML and rendered geometry. These checks target rectangular domains and this uncompressed, orthogonal prototype format; they do not infer real transit services, prove vendor capabilities or establish that declared domain membership is architecturally true.

The corrected file was rendered again using the same pinned local runtime. Author inspection found clear captions, inline labels and no internal authorization escape. A first correction put some labels over boundary outlines; their positions and wrapping were adjusted and the file rendered again. Owner acceptance, Desktop verification and independent blind review remain open.

### Annotation feedback correction, 2026-10-29

The owner described the corrected routing as much better, then identified scattered explanatory text. The owner authorized subject-based placement, nearby sticker comments and explanatory tables. That feedback is not acceptance of every visual detail or the subsequent revision.

The requirement is now one line below the title. The token-claims example is a native folded note beside Cognito, inside AWS but outside API enforcement; its text names Step 1 and its editable metadata references Cognito. The legend is one grouped, editable two-column grid in a reserved area outside the architectural boundaries. It explains the folded-note notation as well as architecture symbols and line styles. No call arrow connects the comment. Trial caveats and assumptions were removed from the image, not from the evidence record.

Fixture assumptions retained here: generic Web app and REST API, HTTPS on external calls, generic AWS invocation for the authorizer, and Cognito rather than the page verifying the password. These are synthetic test resolutions, not owner-confirmed architecture or an executed service. The token example remains the approved client-neutral scenario data.

The validator checks comment targets, rejects annotations as architectural call endpoints, and detects paths through annotation backgrounds and rendered comments covering elements or captions. Tests retain the boundary-routing and inline-label regressions. The pinned local browser rendered the revised folded note and editable grid for author inspection; Desktop behavior and independent readout remain unverified.

### Native Note clarification, 2026-10-29

The owner clarified that the intended component is the built-in `Misc > Note`, and explicitly allowed its automatic text fitting for a more natural result. The previous comment used `shape=note` with a custom fixed-size style; it was not the complete Misc preset. The generator now uses the exact preset style from `Sidebar.prototype.addMiscPalette` in the pinned `src/main/webapp/js/grapheditor/Sidebar.js`, including `autosizeText=1`, HTML labels, west-facing fold, default colors, gradient, shadow and base font size 20. Only dimensions, placement, annotation metadata and content are customized. Newlines are encoded as HTML line breaks.

The font-size validator exempts only an auto-sized native Note comment, not architectural elements, the legend or relationships. Regression checks reject disabling fitting while keeping the larger Note font and reject enabling fitting on an architectural element. The actual browser render was inspected with the native preset; text is legible without covering elements, paths or boundaries. This verifies rendering and preserved settings, not a live editor resize or text-edit interaction. Desktop and interactive auto-fit behavior remain host-verification work.

## Reproduce and interpret

Initial repository verification on 2026-10-28 passed: 153-file inventory with the two existing authored packages, 34 regression tests (including six architecture prototype checks), 42 default fixture assertions, and generic/NVIDIA loopback transport. The architecture suite separately passed 4/4 synthetic assertions. A second catalog extraction matched the committed generated metadata byte-for-byte. The original XML hash was `fddfcde8de8a79047708f16dd09dcd480d1ae0acc7851a4c0133857ddee01178`; those passes did not detect the owner's boundary failure.

Boundary-correction target SHA-256: draw.io XML `0461148363ba837bd34223e2b2feb460b70590cd6234183e6af73665885c0ae4`; unchanged catalog `d567841c18435af41a9ee8ce7de82783e222e91c8f76161c553adf9e3e141b77`. Local verification passed the repository gate (36 regression tests, including eight architecture checks, and 42 default fixture assertions), four architecture fixture assertions and both loopback provider contracts. The new validator also ran against the original `31ca399` XML and reported `Boundary route mismatch enforcement: authorize (inside -> outside -> inside; expected inside)`. No model calls were made. [measured]

Annotation revision target SHA-256: draw.io XML `14df0e5e40f3e0b5e2e3487eacccdfeec8038a11b2183cac5f67708caf022c68`. The catalog and architectural nodes, memberships and calls are unchanged; the revision changes annotations only. Local checks passed 37 regression tests (including nine architecture checks), 42 default fixture assertions, four architecture fixture assertions and both loopback provider contracts. Author inspection of the actual render found a readable folded note and table, with unchanged valid routing. Mutation tests reject missing comment subjects, calls to comments/table cells, annotation backgrounds hiding calls, and notes covering elements or boundaries. No model was evaluated. [measured]

Native Note target SHA-256: draw.io XML `9ed170f4927bad424c9cff025891f8cddc252037f2d05de78a5634034ceb90cf`. The comment's style and line-break encoding change; architectural nodes, call paths and the catalog do not. Local verification passed 38 regression tests (including ten architecture checks), 42 default fixture assertions, four architecture fixture assertions and both loopback provider contracts. No model was evaluated. [measured]

Commands and runtime setup are maintained in the [initiative README](./README.md#reproduce). The root `npm test` includes initiative `.test.mjs` files, so the deterministic regression checks run in CI. Default repository evaluation remains its existing synthetic smoke; the architecture suite also runs explicitly through the shared runner.

The clarification grader checks a few expected concepts and nonempty recommendations/disclosures. Keyword checks cannot establish semantic correctness, recommendation quality, or whether a tool-enabled agent actually waits before drawing. Inspect real traces and artifacts in a later model/host trial.

## Primary semantic evaluation: two round trips

The owner specified L0 description -> L1 diagram -> fresh image-only L2 description -> L3 diagram -> another fresh image-only L4 description, with L0/L2, L2/L4 and L0/L4 cross-comparisons. The [protocol](./evals/roundtrip.md) owns the dimensions, input isolation, semantic alignment contract and interpretation. Static geometry, catalog checks and clarification fixture replay are auxiliary, not substitutes.

On 2026-10-29, the [Scenario 01 pilot](./evals/roundtrip-pilot-2026-10-29/README.md) used the existing L1 at `db8d125`, two separately launched image-only readers, a new L2-only generator and a separate semantic judge. Workers used `fork_turns: none`; the host's standing instructions and shared filesystem still existed. The initial L0 was normalized from the approved case and declared fixture resolutions after L1 already existed. This was not a new L0-to-L1 model generation or a complete skill evaluation. No separately configured NVIDIA or other remote endpoint was called. Exact host model identity/parameters were not exposed.

The calibrated extraction contains 74 L0 facts and 63 each at L2/L4. Eleven explicit qualifiers were omitted in L0/L2 and remain missing in L0/L4, including credential/password handling, ID-token type, per-request token frequency, request-specific decision querying and error-message content. L2/L4 has no drift found among extracted architecture facts. Broad elements, call directions, protocols, domain memberships and allow/403 outcomes survive. No established critical change or unresolved alignment remains in the selected judgment; extraction completeness is still a judgment, and the overall result is negative `drift`, not a skill pass rate. [measured host-agent pilot]

Judge calibration removed false positives about comment placement, readout-only absence observations and literal-word differences. The parent did not modify any measured diagram or description. Full-chain reproducibility, repeated runs, other scenarios and cross-model robustness remain unknown. L3 passed XML and rendered geometry checks, but author inspection found that its Note style does not match the exact Misc preset. That conformance gap is separate from semantic drift and was not repaired during the experiment.

[`roundtrip.mjs`](./evals/roundtrip.mjs) now provides a minimal-packet adapter runner and a grounded, full-coverage semantic-ledger comparator. Mock-adapter regression tests verify orchestration, PNG-only readers, distinct reported fresh contexts, rejected source rewrites and negative findings. The actual pilot was launched through the app's agent tools rather than a configured unattended local adapter. Replaying its saved judgment validates the report, not a fresh model run. Selected descriptions, diagrams, hashes and fact-level alignments are retained with the [pilot](./evals/roundtrip-pilot-2026-10-29/README.md).

Local implementation verification passed the repository gate with 44 regression tests, 42 default fixture assertions, four architecture clarification fixture assertions and both loopback provider contracts. These engineering checks correctly preserve the pilot's negative drift result; they do not turn it into an all-green architecture-quality test. [measured]

## Four fresh full chains, 2026-10-29

The [completed report](./evals/full-roundtrip-2026-10-29/README.md) contains the four L0-to-L4 chains, problems and prioritized proposed improvements. Twenty fresh host-agent contexts were used: eight generators, eight raster-only readers and four semantic judges. Frozen L0 fixtures and one common authoring policy preceded generation. Both generations are new for each case; this is not the earlier existing-L1 pilot. Exact model identity/parameters were not exposed, workers shared filesystem access, and no separately configured NVIDIA/external endpoint was invoked.

Scenarios 01/04 have no drift found among extracted facts in all three comparisons. Scenario 02 introduces a critical account-membership assertion for AWS Site-to-Site VPN in L2 and carries it into L3/L4; the later readout also makes the forwarding-ruleset attachment ambiguous. Scenario 03 adds JSON to the internal Gateway-to-Lambda response contract, absent from L0, and carries it forward. These negative/uncertain outcomes remain in the frozen records. The parent audited the relevant XML after judgment: the VPN changes from `region` parent in L1 to `network` in L3; the Lambda internal-response JSON qualifier is already present in L1. No measured artifact was repaired in response. [measured host-agent chains]

The parent also identified a fixture-admission gap: the raw Scenario 03 draft's explicit solid authorization-delegation expectation was not clearly retained in normalized L0, so a clean L0 ledger would not prove raw-draft conformance. The report distinguishes that benchmark gap, source-fidelity findings, bounded engineering checks and unresolved real-world architecture validation.

All eight diagrams pass current static and actual rendered-geometry checks; checked native Note preset properties match. Azure SVG rendering and bounded variable page sizes were implemented and smoke-tested so readers received real portable raster/vector output rather than missing icons or a fixed-size clipped canvas. Exact-match catalog gaps use truthful fallbacks. The [collector](./evals/collect-roundtrips.mjs) verifies immutable descriptions/raster signatures and regenerates [hashes, findings and check results](./evals/full-roundtrip-2026-10-29/summary.json) without model calls. A saved-result test must reproduce the mixed/negative outcomes, not reinterpret engineering success as semantic success.

Only one chain per case was run. No pass percentage, population reliability, cross-model robustness, actual deployed correctness or candidate/release effectiveness is inferred. The app agent performed live orchestration; a standalone one-command model adapter remains unconfigured. Proposed runtime changes are ownership admission, explicit unknowns and exact-hop contracts; proposed evaluation changes are raw-to-L0 auditing, controlled mutations, repeats and held-out coverage. The full report owns the detailed plan and acceptance criteria.

Local verification passed 47 regression tests, 42 default fixture assertions, four architecture clarification fixture assertions and both loopback provider contracts. The new collection checks preserve exact description/image hashes and the mixed semantic outcomes, including critical failure and uncertainty. These engineering passes are not four architecture-quality passes. [measured]

## Fidelity and layout repairs, 2026-10-29

The owner authorized repair of actual architecture defects and research into intuitive layout. The [repair report](./evals/layout-revision-2026-10-29/README.md) owns new Scenario 02/03 diagrams, explicit input corrections, two fresh image-only readouts and measured geometry. Official AWS research resolves the VPN-attachment account constraint; the old fidelity result remains negative, but it does not prove the added account placement was invalid AWS architecture. The internal Lambda JSON qualifier was removed, outbound-ruleset association named, and original solid delegation restored.

The main flow is aligned, and rendered bend counts fall from 13 to 11 and 21 to 13 respectively without additional node, endpoint or undeclared parent changes. The prototype policy now applies [layout guidance](../../knowledge/diagrams/architecture-layout.md). A renderer metadata fix makes user-object Note annotations visible to collision checks. Both revised artifacts pass actual render checks and Note-text containment checks. This is author repair plus blind readout verification, not a fresh L0-to-L4 chain or controlled prompt comparison. Existing Scenario 01/04 artifacts and all frozen round-trip measurements remain unchanged.

Local repair verification passed 51 regression tests, 42 default fixture assertions, four architecture clarification fixture assertions and the loopback provider contracts. The two selected blind readouts recover the targeted ownership, association and contract distinctions; this is not a full independent semantic-ledger audit. [measured]

## Open verification

- Owner acceptance of icon size, element descriptions and layout density.
- Offline draw.io Desktop at the pinned version; browser evidence does not settle Desktop support.
- Broader Azure catalog/viewer coverage and actual GCP3/Kubernetes rendering; participating Azure symbols are verified for these browser runs only.
- Repeated isolated full chains and held-out/controlled-mutation cases; four fresh chains now exist, one per Scenario 01-04.
- Verify the repaired policy and corrected baselines with complete new same-information chains and controlled prompt comparisons; artifact repairs and initial blind readouts are complete.
- Actual unattended generation/vision adapter integration, with explicit service authority and budget.
- Coverage of Docker/Argo CD/Red Hat and adopted F1-F6 criteria beyond the explicit fallback; no separate icon service is built.
- Scenario 05 when the owner is available.
- Real-model and installed-client behavior, package creation and release readiness.

The original full-chain run did not research vendor correctness during its frozen translations. The later repair researched the relevant AWS account constraint and Azure ruleset association before revising the synthetic baseline. No actual client deployment was validated. Private sample images, identifiers and paths are absent.
