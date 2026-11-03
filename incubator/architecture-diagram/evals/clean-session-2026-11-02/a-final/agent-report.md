# Companion account: Support assistant on AWS

Files: `diagram.drawio` (editable), `diagram.png` and `diagram.svg` (rendered).

## Scope
One logical and deployment view of the scenario in `scenario.md`. Runtime request path runs left to right: Customers, Cloudflare, ALB, Assistant. The Assistant fans out to Pinecone, Bedrock and the MCP server, then Salesforce. The CI and ingestion flow is on the top band. Telemetry goes to the right and bottom.

## Source-stated facts drawn
- Customers, then Cloudflare (`help.example.com`), then ALB in `us-east-1`, then the assistant on EKS.
- Assistant steps 1 to 3: Pinecone retrieval, Claude via Bedrock, MCP server (on EKS) reading Salesforce.
- Langfuse Cloud traces, Grafana Cloud receives cluster metrics.
- GitHub repo, then a GitHub Actions workflow that embeds with OpenAI and writes to Pinecone; Terraform runs from the same workflow and manages AWS resources.

## Inferences and assumptions
- **Customers as origin:** the source implies this hop and does not draw it as a separate step. The Customers to Cloudflare line is therefore inferred from "Customers open the support site".
- **Region membership:** the source places only the ALB in `us-east-1`. I also put the EKS cluster inside the region because an ALB's targets must be in its region. This is an inference. Bedrock is drawn inside the AWS Cloud boundary but outside the region, because the source does not state its region. It is a regional service in practice.
- **Step numbers 1 to 3:** these follow the source's list order. Logically the case lookup could come before answer generation, but the source does not say so. Lookup and generation are not ordered by the drawing beyond the numbers.
- **GitHub repo to workflow:** the "articles" line attaches to the workflow frame, since the source does not say how changes trigger it. No trigger mechanism is claimed.
- **Terraform:** the workflow frame groups Terraform with GitHub Actions to show "run from the same workflow". The "manages" line ends on the AWS Cloud frame because the source names no specific resources.
- **Metrics:** the Grafana line starts at the EKS cluster frame because the source says "the cluster's metrics". Any collector or agent is unspecified and not drawn.
- **Langfuse trace:** the line starts at the Assistant, which the source says is traced per run.
- **Symbols:** the EKS icon marks the cluster frame, and Pinecone, Langfuse and the others are drawn as external SaaS outside AWS. Bedrock's caption names Claude, and the exact Claude icon was not used.

## Left unspecified (not drawn)
Protocols and ports, ALB scheme and listeners, VPC, subnets and zones, the number of pods or replicas, how Cloudflare authenticates to the ALB, and how Cloudflare reaches AWS. Failure and fallback paths are not stated.

## Design risks to note (not on the canvas)
- The EKS, ALB and any single-region components are a single failure domain. The source names one region and gives no standby.
- The Assistant depends on four external or SaaS services (Pinecone, Bedrock, Salesforce through MCP, Langfuse). The source states no timeouts or degradation behavior.
- Terraform runs from the same workflow that handles content. A content change and an infrastructure change share one pipeline.

## Deviations
- The scenario text is a single scenario with nothing struck out. Nothing was excluded.
- No numeric weights, counts or sizes were invented.

## Checks performed
- `finalize.mjs`: ran, embedded 11 vendor icons.
- `check-text.mjs`: clean.
- `check-layout.mjs`: 0 errors, 1 item. Connectors "1 retrieve" (Assistant to Pinecone) and "read" (MCP to Salesforce) cross once. I left it, because Pinecone and Salesforce sit on the right and the retrieval line has to cross the MCP line to reach the CI band's Pinecone. Moving either element would break its true region or the CI lane.
- `render.mjs`: rendered with the pinned draw.io viewer, and I read the PNG at overview scale. Captions, labels and frames are clear of each other. The main path is the heaviest line.
- Not verified: opening in draw.io Desktop, and the technical plausibility of the real deployment.
