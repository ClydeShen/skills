# Scenario 01 round-trip pilot

Date: 2026-10-29. Result: semantic drift found. Scope: existing-L1 pilot, not a new full L0-to-L1 generation run or an effectiveness estimate for a released skill.

## Artifacts and provenance

- [Protocol and comparison dimensions](../roundtrip.md).
- [Frozen descriptions, fact ledgers and semantic alignments](./judged.json): L0, L2 and L4 source text is retained in `levels`.
- [Provenance and hashes](./provenance.json): measured versions, isolation, input boundaries, limitations and calibration.
- L1: [measured source XML](https://github.com/ClydeShen/skills/blob/db8d1258d61edcdf7a7dcd3d1077fedb176cf8cb/incubator/architecture-diagram/prototype/scenario-01.drawio) and [SVG](https://github.com/ClydeShen/skills/blob/db8d1258d61edcdf7a7dcd3d1077fedb176cf8cb/incubator/architecture-diagram/prototype/scenario-01.svg). The readers saw raster renders, not these source files.
- L3: [independently reconstructed XML](./l3.drawio), [SVG](./l3.svg) and [browser geometry](./l3.render.json).

The parent normalized L0 from the approved case and declared fixture resolutions. It retains credentials, password responsibilities, ID-token type, per-request frequency, decision-endpoint specificity and error content; it was not shortened to match the existing image. L1 already existed, so mismatches may be shortcomings of that authored prototype rather than errors from a new automated generation. No owner confirmation of fixture assumptions is implied.

Two different readers were launched without inherited task conversation and received only neutral-named PNGs. The intermediate generator received L2 and generic drawing conventions/tools, not L0, L1, expected facts or comparison feedback. A separate judge saw only the three descriptions and the generic grading contract. The chain was frozen before judgment. Shared filesystem access was not separately sandboxed; the input restrictions are host launch settings, instructions and source attestations, not an OS security guarantee.

## Results

| Pair | Finding | Omissions | Additions/changes | Unresolved or hard failures |
| --- | --- | --- | --- | --- |
| L0 -> L2 | Drift | 11 | 0 | 0 |
| L2 -> L4 | No drift found in extracted facts | 0 | 0 | 0 |
| L0 -> L4 | Drift remains | 11 | 0 | 0 |

The calibrated ledgers contain 74, 63 and 63 facts respectively. Counts depend on atomic fact extraction; they are not a universal score or pass percentage. Broad elements, technology/type labels, responsibilities, call directions, protocols, domain memberships, allow/403 outcomes and token example values survive both readouts.

Eleven explicit details do not survive the first readout: username input; password input; page credential collection; credential submission; the page not verifying passwords; Cognito verifying passwords; ID-token type; sending a token with every API request; the decision-endpoint qualifier; the request-specific target of the policy query; and authorization error-message content. The later diagram/readout does not restore them. Generic "Authenticate" and "Query policy" labels preserve the broad flow but not every qualifier. Thus a stable L2/L4 can crystallize an earlier loss.

The initial judge also counted note placement and readout-only comments as architecture and required literal "only"/"attributes" wording. The parent challenged that against the declared scope. The judge recalibrated semantic alignment without touching any measured input. No corrected diagram was fed back into this chain. Extraction completeness and semantic equivalence remain judgments, not machine-proved facts.

## Other checks and limits

L3 passed the current static XML and actual browser-geometry checks. Its geometry differs from L1, as expected; visual similarity is not the semantic criterion. The parent's inspection also found a style-conformance gap: L3 keeps automatic text fitting but uses a custom Note style rather than the exact Misc preset. Static checks do not currently prove exact Note preset provenance. This does not alter the semantic result and was not repaired during the chain. The legend is arranged differently but preserves its meanings.

Run the deterministic comparator again without model calls:

```text
node incubator/architecture-diagram/evals/roundtrip.mjs incubator/architecture-diagram/evals/roundtrip-pilot-2026-10-29/judged.json
```

The negative `drift` result is a valid evaluation finding; the CLI exits successfully when its inputs and mappings validate. Unit tests assert that finding rather than treating it as a skill success. Source hashes and selected evidence permit reinspection; rereading or regenerating with models may produce different results.

Only Scenario 01 was tried once, from an existing L1. Scenarios 02-04, a fresh complete L0 generation, repeated trials, cross-model diversity, Desktop integration and a configured unattended model adapter remain open. The host did not expose exact model identity/parameters; no separately configured NVIDIA or other remote endpoint was used. This experiment does not establish general reliability or release readiness.
