# AWS three-tier reference case

The owner rated the text-only first output **60/100**: the main architecture survived, but redundant frames, repeated information and verbose edge labels weakened the result. The subsequently supplied reference establishes the desired visual direction. This is now a calibration case, not held-out evidence.

## Evidence

- [Source description](./source.md): the submitted English content, with heading/list formatting normalized; no architectural facts removed or added.
- [First diagram](./baseline.drawio), [PNG](./baseline.png) and [render metrics](./baseline.render.json): frozen before the reference image was seen. [Original verification](./baseline-verification.json) retains the original three static diagnostics.
- [Revised diagram](./revised/diagram.drawio), [PNG](./revised/diagram.png) and [verification](./revised/verification.json): same source, updated skill, reference already seen. Owner comparison pending.
- [Case manifest](./case.json): source paths, frozen hashes, baseline structural assertions and reference-image provenance.
- Reference: user-supplied Lucid-hosted PNG, viewed in the conversation. Its URL is recorded in the manifest; local archiving is pending because the cloud proxy refused the download. Do not claim a locally reproduced reference-image comparison.

The baseline used the candidate at `96a9ec0c045c0a18803142cdaea97048024e642b` in the existing conversation, with explicit skill/reference loading and author render repairs before delivery. It was not a fresh-context activation test. Exact host model identity and parameters were not exposed. The owner's score is an overall judgment, not a calibrated dimension score or pass rate.

## What the reference teaches

| Aspect | First output | Useful reference principle |
| --- | --- | --- |
| Structure | Aligned tiers/AZs, but a tall, caption-heavy view | Use two stable axes and consistent repeated arrangements so the structure is visible immediately |
| Regions | AWS, Region, VPC, AZ and subnet outlines plus service cards | Make each enclosure earn its place; combine meaningful outlines with quiet filled regions |
| Multiplicity | One EC2 icon and the word “multiple” | Show representative repeated instances visually without asserting fleet capacity |
| Labels | Type tags, numbered forwarding text and repeated unknown protocols | Keep names and distinctions; annotate the exceptional relation, such as synchronous replication |
| Color | Correct vendor icons, little hierarchy between regions | Use a restrained, consistent palette to separate regions and keep components prominent |

Preserve semantics while learning from the image. Its visual Users–DNS–CDN chain must not imply application payloads traverse Route 53. Lock symbols do not resolve the description's unspecified subnet exposure or security configuration. Few arrowheads in a reference do not remove the need to express initiator/destination clearly. The image is a visual reference, not authority to override the text.

## Evaluation

For generation, supply only `source.md` and the versioned skill package with its ordinary tools. Withhold this README, the manifest's grading data, the baseline and the reference. Freeze the resulting editable file and actual render before evaluation. Use [the round-trip protocol](../roundtrip.md) for L0/L2/L4 fidelity; this case is separate from the four-case clarification smoke suite.

Evaluate two outcomes separately:

1. **Architecture fidelity:** preserve the six CIDRs and their AZ/tier memberships, distinct Web/App scaling groups, both ELBs, per-AZ server multiplicity, both App paths to the primary, synchronous replication and standby semantics. Reject invented security/protocol details, DNS forwarding, standby read traffic or boundary escapes regardless of visual appeal.
2. **Visual communication:** compare at the same useful viewing scale. Can the reader see the tiers, AZs, shared groups and main path before reading captions? Do frames, colors and labels each add a distinction? Are multiplicity, primary/standby and replication visible? Is it compact without tiny text, missing paths or hidden facts? Use concrete observations; fewer boxes or words is not an automatic improvement.

The original score remains unchanged. Record new human judgments, source/skill revisions, host/model where exposed, attempts and limitations alongside new artifacts. Any redraw made after viewing the reference is reference-informed refinement. Fresh text-only runs of old/new skill versions and unseen scenarios are still needed to assess prompt improvement and generalization.

## Status

The updated skill produced a new diagram from the unchanged source in the existing conversation. It retains all 13 directed relationships, six CIDRs, both shared scaling groups and primary/standby roles. It uses native multi-instance symbols, light subnet fills and selective labels; the unspecified Region enclosure is omitted. Static, rendered-route and text-overlap checks pass. The generator had already seen the reference: this is reference-informed generation, not a blind test or evidence of generalization. Owner scoring and fresh image-only readout remain pending.

The [collector](./revised/collect.mjs) verifies unchanged source/baseline hashes and records the skill/artifact hashes, checks and descriptive counts. Run it with Node.js from any working directory. Keep the delivered revision frozen; record further changes separately. The validator's earlier Auto Scaling heading correction does not change the baseline's saved diagnostics or 60/100 score.

Local verification on 2026-10-29 passed: repository checks, 63 regressions including the saved revision, 42 default synthetic assertions, four architecture clarification assertions and loopback transport. The Agent Skills reference validator at `69ef37e9424c0a7ea9dd2293b559e43ec8176379` passed; that revision was confirmed as upstream HEAD. Skills CLI 1.7.4 found no released skills and exactly one explicit internal candidate. These checks establish implementation/package compatibility, not improved diagram quality.
