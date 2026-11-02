# Companion account: Support assistant on AWS

Files: `diagram.drawio` (editable), `diagram.png`, `diagram.svg`.

## Scope
Left-to-right runtime view: Customers, Cloudflare, ALB, the EKS-hosted LangGraph assistant and MCP server, with Bedrock, Pinecone, Salesforce, Langfuse and Grafana. A top lane shows the content/infrastructure pipeline (GitHub repo, GitHub Actions, OpenAI embeddings, Pinecone writes, Terraform). Steps 1 to 3 are numbered per the source order, which matches the drawn execution.

## Inferences and unspecified details
- Customers to Cloudflare is drawn as the main-path start (source says customers open the site). No protocol is labelled; none was specified.
- The assistant, MCP server and EKS cluster sit inside the region, as the source says. VPC, subnets, AZs and ALB exposure are unspecified, so none are drawn.
- Langfuse traces and Grafana metrics are drawn from the EKS cluster boundary (dashed), not from a specific pod; the source names the cluster for metrics and "every agent run" for traces. Traces could be tightened to the assistant only.
- Terraform is drawn to the Region boundary as "manage", because the source says only "AWS resources", not which. It is shown as run from GitHub Actions.
- The GitHub repository is an assumed node: "maintained in a GitHub repository" triggers the workflow, though the trigger is not specified.
- Bedrock is drawn with the Bedrock icon and caption "Anthropic Claude"; I did not add a separate Claude icon.
- The EKS cluster is a plain dashed frame, with no EKS icon.

## Design risks (not on canvas)
- Single region, no standby shown. The source does not say, so nothing is implied.
- Pinecone, OpenAI, Salesforce, Langfuse and Grafana are external SaaS, so the assistant path depends on the internet or private links, whichever applies. The source does not say.
- Assistant and MCP replica counts are unspecified, so each is one symbol and not a fleet.
- The ALB sits outside the EKS frame, and the source does not say how it reaches the cluster (for example, ingress controller or IP targets). That hop is a plain arrow.

## Deviations
- The Cloudflare caption is `help.example.com` (role/hostname), because the wordmark already shows the name.
- Retrieval, generate and lookup labels carry step numbers.

## Checks performed
- `finalize.mjs`, `check-text.mjs` and `check-layout.mjs` all report no issues on the final file. Earlier runs flagged a label overlap, a jog and a label on a bend; I fixed these by moving ports and the frame, not by removing content.
- Rendered with `render.mjs` and inspected the PNG. Not opened in draw.io Desktop.
- Icons came from `find-icon.mjs` (AWS ALB, Bedrock, Cloudflare, Pinecone, LangGraph, MCP, Langfuse, Grafana, GitHub, GitHub Actions, OpenAI, Terraform, Salesforce).
- Source fidelity was checked against scenario.md. Technical plausibility of the real deployment was not checked.
