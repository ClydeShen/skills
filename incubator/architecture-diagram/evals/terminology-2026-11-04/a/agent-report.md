# Companion account: Support assistant on AWS

Files: `diagram.drawio` (editable, two pages), `diagram-1.png` (Runtime), `diagram-2.png` (Operations).

## Scope and pages
- **Runtime**: Customers, Cloudflare, ALB, EKS (assistant, MCP server), Pinecone, Bedrock, Salesforce, plus telemetry to Langfuse Cloud and Grafana Cloud. Steps 1-3 from the source are numbered on the connectors.
- **Operations**: GitHub repository, GitHub Actions, OpenAI embeddings, Pinecone, Terraform and the AWS resources it manages. I split it from Runtime by concern so that neither page needs a third kind of line.
- Both pages share one key (solid = call or data flow, dashed = telemetry, management).

## Inferences and assumptions
- Customers to Cloudflare is inferred from the source's "customers open the site". The source doesn't give a protocol, so the hop is unlabeled.
- **Region placement**: the source places only the ALB in us-east-1. I drew the EKS cluster and Bedrock inside the Region boundary because an ALB's targets share its Region and a workload's Bedrock endpoint is normally in the same Region. This is an inference, not a source statement. Bedrock sits outside the cluster, since it is a regional service.
- **Bedrock**: shown as one Bedrock icon captioned "Anthropic Claude". The source says Claude is reached through Bedrock, so I didn't draw a separate Claude node.
- **Step order**: I numbered the steps in the source's order: 1 retrieve, 2 answer, 3 look up cases. In a real run the case lookup could feed the answer, but the source doesn't say, so I kept its order. Worth confirming.
- **Telemetry**: "traces" runs from the assistant to Langfuse. "metrics" runs from the EKS cluster boundary to Grafana Cloud, because the source says the cluster's metrics go there. I drew no collector or agent between them since the source names none.
- **Terraform**: the source says only "the AWS resources". I drew a plain box named "AWS resources" (not a specific VPC, EKS or ALB) and did not claim which resources Terraform manages. The Actions to Terraform hop is labeled "run" and Terraform to AWS "manage" (dashed). I didn't draw Terraform inside the Actions boundary.
- **Pinecone**: the same Pinecone index is shown on both pages as one external SaaS, outside AWS, since the source gives no AWS placement.
- **Not drawn (unspecified)**: Salesforce credentials or auth for the MCP server, how Terraform authenticates to AWS, Bedrock networking (public endpoint or private), and the ALB's exposure.

## Design risks (not drawn on the canvas)
- Cloudflare to ALB: nothing in the source says the ALB only accepts Cloudflare traffic, so the entry could be bypassed.
- The assistant has no stated failure path: if Pinecone, Bedrock or Salesforce is unreachable, the source doesn't say what happens, and I drew none.
- The Region is drawn without zones: the source gives no AZ or node detail, so I can't tell whether one zone loss would stop the path.

## Deviations from the source
- Nothing was dropped. Captions add roles ("Proxy", "LangGraph agent", "MCP server"), all from the source wording.
- Connector labels are shortened forms of the source's step wording ("2 answer", "1 retrieve articles", "3 look up cases").

## Checks performed
- `finalize.mjs`: embedded 12 vendor icons.
- `check-text.mjs`: clean.
- `check-layout.mjs`: 0 errors, 0 items after I fixed the label placements, a boundary-colour mismatch, a title collision and a two-bend route that had a one-bend alternative.
- `check-steps.mjs`: run against `scenario.md`; it reported 0 unnumbered steps.
- `render.mjs`: both PNGs rendered with the pinned draw.io viewer and I looked at each. Not verified in draw.io Desktop.
- Source fidelity and technical plausibility were checked separately; a clean render doesn't prove the real deployment matches.
