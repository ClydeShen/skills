# Architecture description/diagram round-trip evaluation

Date: 2026-10-29. Decision authority: owner-specified evaluation method and semantic comparison dimensions. This is the primary behavioral evaluation protocol, not the existing clarification-fixture replay.

## Chain and isolation

```text
L0 resolved description -> L1 diagram -> L2 image-only description
L2 description         -> L3 diagram -> L4 image-only description
```

Freeze the resolved L0 and the drawing-policy version before a full run. Preserve the raw input, clarifications, declared fixture assumptions and intentional exclusions separately. Never erase a meaningful qualifier from L0 merely because the current diagram omits it. Synthetic resolutions are not owner confirmations. A pilot starting with an existing L1 must be labeled `existing-L1-pilot`, not a fresh L0-generation result.

Use a new generation context for L1 and L3. Each generator receives only its immediate description and the same general drawing conventions, catalog and tools. L3 does not receive L0, L1, expected facts or comparison feedback. Use different new reader contexts for L2 and L4. Each reader receives only its immediate rendered raster image and a generic transcription instruction. Readers must not inspect XML, SVG, filenames containing answers, case documents, source text or earlier descriptions. Ordinary host instructions may still exist; "fresh" means no inherited task conversation or scenario context, not removal of system instructions.

Freeze each diagram after bounded authoring checks and before reading it. A generator may inspect its own output to fix geometry before that freeze; it must not receive semantic comparison feedback. Keep architecture validity and formatting checks separate from the round-trip result. Do not repair intermediate artifacts during a measured chain. Treat retries as new attempts and retain failed results.

After L4, compare L0/L2, L2/L4 and L0/L4. The judge may see those three descriptions but should use a separate context. Do not feed its findings back into the chain being measured. Shared filesystem access is not a security sandbox: record allowed inputs, actual worker launch settings and the worker's source attestation. `fork_turns: none` establishes no inherited conversation, not OS-level access isolation.

## Semantic dimensions

| Dimension | Facts to preserve |
| --- | --- |
| Elements | Identity, type, technology, presence and environment/count distinctions |
| Responsibilities | Who authenticates, verifies, routes, authorizes, stores or transforms; qualifiers that change that responsibility |
| Relationships | Which parties interact, the action, request/response and main/auxiliary/failure meaning |
| Directions | Initiator and callee; polling versus publishing; a folded response is not a reversed call |
| Protocols | Named transport/API, private connectivity and security mechanisms where specified |
| Boundaries | Domain ownership, nesting, membership and domains crossed by each interaction |
| Conditions | Per-request behavior, prerequisites, allowed/denied alternatives and failure outcomes |
| Notes | Architecture-bearing examples and constraints; not incidental placement or decoration |

Extract atomic propositions with exact supporting text. Align paraphrases semantically, not by literal wording, matching keywords or shared service names. Preserve unknown/uncertain distinctions; do not invent standard vendor behavior. Mark each aligned item `preserved`, `omitted`, `added`, `changed` or `uncertain`, with source evidence and a reason. Multi-fact alignments may account for split/merged phrasing within one dimension. Every extracted fact must be accounted for in each pair. Complete coverage of an extracted ledger does not prove extraction completeness; inspect the source descriptions as well.

Do not confuse readout-only observations ("not explicitly drawn") with assertions about the real system. A comment's incidental location is not architectural domain ownership. Interpret whole nested enumerations and examples semantically; absence of the exact word "only" or "attributes" is not automatically a loss. Calibrate questionable judge findings without changing any measured description or diagram, and retain the review reason.

Apply the frozen authoring policy when distinguishing notation from new facts. Added C4 type/technology lines, a title or a legend are not inventions when they faithfully express the source's service/role and the accepted conventions. A type/grouping that changes hosting, ownership, lifecycle or architectural scope is still meaningful drift. Do not classify every C4 label as an addition merely because L0 uses natural language.

Critical changes include domain ownership, essential call existence/direction, invented connectivity and changed access-control outcomes. They are hard failures, not errors averaged away by a high total similarity. Other meaningful drift remains a negative result, with uncertainty reported explicitly. Stable L2/L4 does not cancel a loss already present in L2. Semantic stability also does not prove that the original architecture is valid.

## Implementation and result semantics

### Separate visual communication from information survival

Owner clarification, 2026-10-29: a diagram covered in explanatory Notes can preserve text while failing to communicate visually. Keep the L0/L2/L4 fidelity judgment intact and report visual communication independently. Each Note is a design cost requiring justification, even if its content is accurate. A zero count is not an automatic pass; inspect disguised paragraphs, oversized captions and tables that merely repackage prose.

For visual review, identify the visible encoding of domain membership, main/auxiliary/failure paths, branch conditions, transformations and repeated mappings. The reader should trace the essential architecture without detached explanations. Short node/edge labels and a notation key remain legitimate vocabulary. Keep unknowns and meaningful qualifiers; do not invent graph structure or discard information to reduce text. Any comment-removal or other ablation is a separate diagnostic artifact and must not replace an already frozen measured image.

The [visual-expression revision](./visual-expression-2026-10-29/README.md) records the initial application and its limits. The [three-tier reference case](./three-tier-2026-10-29/README.md) adds owner-calibrated review of region hierarchy, multiplicity, selective labels and readability. Neither is a completed new round-trip experiment. Reference images and comparison feedback remain evaluator-only inputs during text-to-diagram runs; reference-informed redraws are calibration, not blind generation evidence.

### Runner and comparator

[`roundtrip.mjs`](./roundtrip.mjs) exports `executeRoundTrip`, with explicit `generate`, `render`, `read` and `judge` host adapters. The runner passes minimal stage-specific packets, requires distinct reported fresh generation/reader contexts, delays judging until after L4, and refuses judge rewrites of source descriptions. Adapters must actually launch the isolated workers and use a vision-capable reader; context labels alone do not establish that. There is no default remote provider, credential discovery, hidden model call or automatic fallback.

Generation/read adapters return `{output, context: {id, fresh: true}}`. The render adapter returns `{image, mimeType: "image/png"}`; SVG/XML inputs are rejected before reading. The judge returns the ledger object below. An adapter may report additional provenance, but must not substitute a context ID for observed isolation. Reject an empty existing-L1 input rather than silently generating a replacement.

The judge returns `levels` keyed by `0`, `2`, `4`, each containing the untouched `description` and `facts`. Facts contain `id`, `dimension`, `claim`, `critical` and an exact source `evidence` quotation. `pairs` contains `0-2`, `2-4` and `0-4` alignment arrays. Rows contain `before`/`after` fact-ID arrays, `status` and `reason`. [`roundtrip.test.mjs`](./roundtrip.test.mjs) demonstrates the contract, including rejected evidence/mapping/context cases.

`evaluateDescriptions` validates evidence and mapping coverage and derives the three reports. It does not decide semantics from strings. Status is `hard-fail`, `drift`, `incomplete` or `no-drift-found`, conditional on the judge's extraction/alignment. Counts are alignment rows per dimension, not a semantic pass percentage. The CLI evaluates a saved judged run without making model calls:

```text
node incubator/architecture-diagram/evals/roundtrip.mjs /path/to/judged-roundtrip.json
```

Generic unit tests use injected mock adapters to check orchestration and grading only. They are not round-trip quality evidence. The current app pilot launches workers through the host's agent tools; no turnkey local unattended agent launcher is configured. Preserve this distinction rather than presenting adapter tests or saved-output replay as live model execution. The existing four-case Promptfoo suite remains a clarification-harness smoke test, not this primary evaluation.

## Evidence and follow-up

Keep ordinary run files in ignored `evals/.local/` or task scratch. Commit only selected sanitized evidence and concise conclusions under the initiative. Record source/target hashes, renderer version, launch/isolation mode, available model identity and parameters, retries, assumptions and uncertainty. Do not invent a model version if the host does not expose it. Different readers reduce inherited-context leakage but may still share model biases. Repeated runs and additional scenarios are needed before estimating reliability.

The [initiative evaluation](../evaluation.md) owns current results and limitations. Scenario 05 remains deferred. Scenarios 02-04 require the necessary input resolutions before a full L0 chain; do not fabricate owner confirmation to increase coverage.
