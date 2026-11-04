# Companion account: Support assistant on AWS

Files: `diagram.drawio` (editable), `diagram.png` (rendered with the pinned draw.io viewer).

## Scope
Single runtime view (left to right) with the article-ingestion and infrastructure pipeline in a lane along the top and telemetry as dashed lines. All 11 source systems are drawn. Source-listed steps 1 to 3 are numbered on the Assistant's connectors.

## Inferences and assumptions
- **Customers to Cloudflare:** the source implies this hop ("Customers open the site"). I drew it as the start of the main path.
- **EKS in the region:** the source says the ALB is in us-east-1 and the cluster is on AWS. I placed the EKS cluster and Bedrock inside the us-east-1 region. The source does not say Bedrock's region. Standard practice puts it with the workload, so this is an inference.
- **No VPC, subnets or zones drawn:** the source gives none. ALB exposure, listener protocol and target-group wiring are unspecified and not drawn. The ALB sits in the region outside the EKS frame.
- **Cloudflare, Pinecone, Salesforce, Langfuse, Grafana, OpenAI, GitHub:** drawn outside AWS as external SaaS. Their hosting regions are unspecified.
- **Numbering:** I kept the source's order (retrieve, Bedrock, MCP lookup). The logic could differ, for example the case lookup may feed the answer prompt. The source does not say, so I did not reorder.
- **Terraform:** the source says it is "run from the same workflow" and manages AWS resources. I drew Actions to Terraform ("run") and Terraform to the region frame ("manage"), both dashed. The target is the region edge because the exact managed resources are not named.
- **Langfuse traces and Grafana metrics:** drawn from the Assistant (traces) and from the EKS cluster frame (metrics), as the source states. The metrics collector is not named, so I did not invent one.
- **MCP server to Salesforce ("read"):** protocol and auth are unspecified.
- **Bedrock:** drawn with the Bedrock icon, captioned "(Claude)". There is no separate Anthropic node because the call goes through Bedrock.

## Design risks (not drawn on the canvas)
- A single ALB and a single Assistant/MCP drawn once. The source gives no replica counts or zones, so redundancy is unknown.
- The assistant depends on four external SaaS services in series (Pinecone, Salesforce, plus Bedrock). The source states no failure behaviour.
- Terraform runs from the same workflow that publishes articles, so the ingestion workflow also carries AWS change rights.

## Deviations and layout notes
- Page is about 1500 x 1200, taller than the guideline 3:2. The three flow lanes (pipeline on top, runtime in the middle, telemetry below) forced the height.
- Connectors all use one weight (1.5), per the skill's composition rule. The layout checker's "make the main path the heaviest" item conflicts with that rule, so I left it. It is the only remaining item.
- Captions for Terraform, Langfuse and OpenAI sit beside their icons because connectors enter from below or above.
- The EKS group is a generic light-filled group with the EKS icon at 24 units, since the catalog has no EKS group style.

## Checks performed
- `finalize.mjs`: ran, 11 vendor icons embedded.
- `check-text.mjs`: clean.
- `check-layout.mjs`: 0 errors, 1 item (same-weight note above).
- `check-steps.mjs`: not run, because scenario.md's list is the only numbered source and I verified its three steps by hand against the connector labels.
- `render.mjs`: ran, and I inspected the PNG twice. No clipped labels, no crossings, and no connector passes through a caption.
- Not verified: opening in draw.io Desktop, and the real deployment's correctness.
