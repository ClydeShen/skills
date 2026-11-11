# Companion account: Support assistant on AWS

## Files

- `diagram.drawio` (editable, one page "Support assistant on AWS"), `diagram.png`, `diagram.svg`.

## Scope and page

One page, one view (request path plus build/telemetry as solid and dashed lines). No split was needed: two line kinds, width about 1400, two nested outlines.

## Source states

- Customers, then Cloudflare (help.example.com), then an ALB in us-east-1, then the assistant on EKS.
- The assistant (LangGraph) calls Pinecone, Claude through Bedrock, and an MCP server on the same cluster. The MCP server reads Salesforce.
- Agent runs are traced to Langfuse Cloud. EKS metrics go to Grafana Cloud.
- A GitHub Actions workflow embeds changed articles with OpenAI and writes them to Pinecone. Terraform, run from the same workflow, manages the AWS resources.

## Inferences (not stated)

- Customers are the origin of the first hop.
- Amazon Bedrock is drawn inside the us-east-1 Region (regional service, same Region as its caller). The source does not name its Region.
- The ALB sits inside the Region boundary but I drew no VPC or subnets, since the source gives none. ALB type, exposure and target configuration are not shown.
- The Terraform "manages" line ends on the Region boundary because the source does not say which resources it manages. I did not draw it to individual resources.
- Metrics leave from the cluster boundary because the source gives no collector or agent.
- "Runs" from GitHub Actions to Terraform expresses "run from the same workflow". GitHub to Actions is drawn as the workflow consuming changed articles; the trigger mechanism is not stated.

## Deviations and notes

- Steps 1 to 3 are numbered in source order. Source order has the answer written (2) before the case lookup (3); a real agent may look up cases before generating. I kept the stated order. Step 3 is on the assistant-to-MCP hop; the MCP-to-Salesforce hop is labelled "reads".
- No AWS Cloud outer boundary: it would add no distinction (Region already named).
- Terraform and Grafana Cloud have no catalog icon, so they are plain labelled boxes (Grafana lookup only offers Prometheus). Anthropic's Claude is shown by the Bedrock icon with caption "Claude", not a separate Claude icon.
- Left out: no business rules, schemas or sample data in the source.

## Design risks (not drawn)

- Single Region and a single assistant path; ALB/EKS zone spread is not given, so zone failure behaviour is unknown.
- Several third-party SaaS dependencies (Pinecone, Salesforce, Langfuse, Grafana) are outside AWS; their connectivity (public internet vs private link) is not stated.
- Terraform running from CI with AWS-wide management implies a privileged credential; how it authenticates is not stated.

## Checks run

- `finalize.mjs`, `check-text.mjs`, `check-layout.mjs`: all clean (0 errors, 0 items) on the final file. After earlier runs reported label and short-dash items, I fixed them by moving labels and elements.
- `check-steps.mjs` was not run (I did not save the source as a separate file for it); I verified manually that steps 1 to 3 are labelled.
- `render.mjs` rendered the PNG; I inspected it. Desktop draw.io was not opened.
