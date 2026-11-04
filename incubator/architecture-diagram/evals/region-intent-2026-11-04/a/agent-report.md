# Companion account: Support assistant on AWS

Files: `diagram.drawio` (editable), `diagram.png` (render), `diagram.svg`.

## Scope
Deployment/flow view, left to right. Main path (heavy line): Customer, Cloudflare, ALB, LangGraph assistant. Steps 1-3 numbered from the scenario's list (retrieve, Claude, cases); the order in the list matches the order the agent runs. Observability is dotted and runs downward; the article build/ingestion flow runs on the right in a separate GitHub group.

## Inferences (not stated in the source)
- Amazon Bedrock is drawn inside `us-east-1`. The source says only "through Amazon Bedrock"; it is regional and placed with the workload by standard practice.
- Customer to Cloudflare is drawn as the entry hop, since the source implies it ("customers open the site").
- Terraform's "manages AWS resources" is drawn as one dotted line to the Region frame, not to individual resources, because the source names none.
- Pinecone, Salesforce, Langfuse Cloud, Grafana Cloud, OpenAI and GitHub are SaaS and sit outside the Region. Their own hosting regions and connection paths (public, PrivateLink) are unspecified.
- Claude is shown as the label "2 Claude" on the Bedrock edge; Bedrock has no separate Claude node.
- "Actions workflow" is drawn inside a GitHub group. The repository itself is not drawn as a node; the group title stands for it.

## Not drawn / unspecified
VPC, subnets, zones, node groups, ALB type or exposure, the Cloudflare-to-ALB protocol or origin lock-down, authentication for MCP/Salesforce, how metrics and traces are shipped. The source gives none of these.

## Design risks (not drawn on canvas)
- The assistant, MCP server and ALB targets sit in one EKS cluster. The source shows no zones, so zone or cluster failure resilience is unknown.
- Bedrock model access is regional, so a us-east-1 outage stops the answer path.
- Pinecone, Salesforce and Langfuse are runtime dependencies on the request path; the source shows no fallback. Whether tracing failures block a run is unspecified.
- Terraform and the workflow have authority over AWS; the credential mechanism is unspecified.

## Deviations
- Two connectors use two bends where the layout check suggests one (assistant to Bedrock). I kept them so they leave the assistant from their own ports without sharing a segment with the Pinecone line.
- Customer to Cloudflare carries no domain label. The domain `help.example.com` is in the Cloudflare caption instead.
- No source text was struck out, so none was excluded.

## Checks performed
`finalize.mjs` (10 vendor icons embedded), `check-text.mjs` (clean), `check-layout.mjs` (0 errors; 1 advisory, the two-bend route above), `check-steps.mjs` run (output above in transcript). PNG rendered with the pinned draw.io viewer and inspected by eye. Desktop draw.io was not tested. Icons are exact catalog or vendor matches; EKS has the AWS catalog icon only as a 24-unit house marker.
