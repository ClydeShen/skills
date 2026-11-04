# Companion account: Support assistant on AWS

Files: `diagram.drawio` (editable), `diagram.png` and `diagram.svg` (render). The generator script is outside the work directory.

## Scope
A logical and deployment overview, drawn left to right. The runtime path is Customers, Cloudflare, ALB, assistant agent, then Bedrock. The assistant's other calls go to Pinecone, the MCP server and Salesforce. Telemetry goes to Langfuse and Grafana along the bottom. The content pipeline (GitHub, Actions, OpenAI, Terraform, Pinecone) runs along the top.

## Assumptions and inferences
- **Customers to Cloudflare:** drawn as the entry hop, inferred from "customers open the site". The domain `help.example.com` is in the Cloudflare caption.
- **Region membership:** the source names `us-east-1` only for the ALB. I placed the EKS cluster in the region as well, since the ALB targets it. This is an inference.
- **Bedrock placement:** no region is stated, so Bedrock sits in the AWS Cloud boundary but outside the Region box.
- **Claude:** shown as the label on the Bedrock connector, not as a separate node, because it is a model served through Bedrock.
- **Telemetry:** Langfuse traces are drawn from the agent. The Grafana metrics connector starts at the EKS cluster boundary. The collection mechanism is not stated and is not drawn.
- **Terraform:** Actions runs Terraform, which then manages the AWS Cloud boundary. The specific resources are not stated. I did not draw the ALB, EKS or Bedrock as individual targets.
- **Salesforce:** the MCP server reads from it (the source says "reads from Salesforce"). Protocol and auth are unspecified.
- **Not shown:** the Pinecone index details, the exact trigger from GitHub to Actions, and networking (subnets, ingress type, ALB exposure). None were given.

## Source deviations
- The numbered agent steps are not numbered on the diagram. They are branches of one agent run, and the source gives no strict order between steps 1 and 3. The layout shows the three calls as separate paths.
- The "Assistant" node is the LangGraph agent running in EKS. EKS pods or replicas are not shown, because the source gives no counts.

## Design risks (not drawn)
- Single cluster and one region: an outage there stops the whole path. The source states no redundancy.
- Cloudflare, Pinecone, Salesforce, Langfuse and Grafana are all external SaaS, so the assistant depends on their availability.
- The ALB and cluster exposure and security are not described.

## Checks performed
- `finalize.mjs`: vendor icons embedded, with 11 exact icons used (AWS, Cloudflare, Pinecone, Salesforce, Langfuse, Grafana, LangGraph, MCP, OpenAI, GitHub, Terraform).
- `check-text.mjs`: clean.
- `check-layout.mjs`: 0 errors and 1 item. Connector Actions to Pinecone has 2 bends, where the tool suggests entering Pinecone's left side. That side is already used by the retrieval connector from the assistant. I kept the two-bend route so the two flows enter Pinecone separately and do not overlap.
- Rendered with `render.mjs` and inspected the PNG. There are no collisions or crossings, and the main path reads at a glance.
- Not verified: opening in draw.io Desktop or importing into Lucidchart.
- Note: two icons were intentionally given a different caption position (left or top) so that connectors could attach to the free side.
