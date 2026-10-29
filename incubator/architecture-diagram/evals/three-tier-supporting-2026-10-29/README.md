# AWS web application with supporting services

First delivery from the owner's second [text scenario](./source.md), before seeing its reference image. The current skill was used without modification. The earlier case remains in conversation context; this is not a fresh-context evaluation.

## Compare

- [PNG preview](./first.png), [editable draw.io](./first.drawio), [SVG](./first.svg).
- [Frozen verification](./verification.json): input, package and output hashes; source assertions and measured browser checks.
- [Generator](./generate.mjs) and [verification script](./verify.mjs) preserve the first delivery for later comparison. Do not overwrite it after seeing the reference.

Owner score and reference comparison are pending. Static, rendered route/boundary, pairwise text and icon/caption checks pass. The author inspected the actual image; no independent reviewer or image-only readout was used. Engineering checks do not establish visual quality or production correctness.

## Interpretation limits

The deployment outline is logical, not an invented VPC. Small boundary ports preserve unknown callers for supporting services. S3 remains regional, outside both AZs. Web and App each show two instances; only Web has Auto Scaling. The standby receives no application-read path.

DNS is separate from payload traffic. CloudFront's arrow points to its S3 origin as a retrieval request; the media domain is its caption. No media DNS record, Web-to-App path, internal load balancer or CloudWatch-to-SNS path is invented. Replication is not labelled synchronous because this source leaves its mode unspecified.

The two qualified source connections, Cache → RDS and standby-side → S3, retain their direction without asserting native database fetching, backup or export. Their operation remains unresolved. Unspecified network, security and capacity details stay in the source, not repeated on every edge.

## Recheck

From the repository root, run `node incubator/architecture-diagram/evals/three-tier-supporting-2026-10-29/verify.mjs`. It checks the saved output against its frozen hashes without regenerating it. Browser provenance is in the verification file; Desktop compatibility remains unverified.
