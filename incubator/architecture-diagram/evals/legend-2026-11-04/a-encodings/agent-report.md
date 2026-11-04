# Companion account: Support assistant on AWS

Files: `diagram.drawio` (editable), `diagram.png` and `diagram.svg` (rendered). The generator script is outside the work directory.

## Scope
One left-to-right view. The runtime path (customers, Cloudflare, ALB, assistant, Bedrock) runs through the middle. Content ingestion and provisioning run along the top. Telemetry runs along the bottom. Source numbering of the agent steps is kept (1 retrieve, 2 write answer, 3 look up cases).

## Source-stated, drawn
- Customers, then Cloudflare, then the ALB in us-east-1, then the assistant on EKS.
- The LangGraph agent calls Pinecone, Bedrock (Claude) and the MCP server. The MCP server is on EKS and reads Salesforce.
- Traces go to Langfuse Cloud. EKS metrics go to Grafana Cloud.
- GitHub repository, then GitHub Actions. Actions embeds with OpenAI and writes to Pinecone. Actions runs Terraform, which manages the AWS resources.

## Inferences
- The customer-to-Cloudflare hop is implied by "customers open the site".
- Bedrock sits inside the Region and outside the EKS cluster. Bedrock is regional and the source gives no other location.
- The ALB sits in the Region and outside the EKS cluster.
- The Terraform "manage" line ends on the Region outline. The source says only "AWS resources", so I attached it to the smallest boundary that holds all of them. The ALB, the EKS cluster and the Bedrock access could all be in scope, but the source does not say which.
- The Grafana line starts at the cluster frame, because the source says "the cluster's metrics". The Langfuse line starts at the assistant, because the source says "every agent run".
- Dashed lines have one shared meaning in the key: auxiliary telemetry and provisioning. They are labelled individually.

## Not drawn or unresolved
- Pinecone, Salesforce, Langfuse Cloud, Grafana Cloud and OpenAI are SaaS and drawn outside AWS. The source gives no private connectivity, so none is shown.
- No protocols are labelled, because the source states none. The hostname `help.example.com` is on the first hop.
- The Region contains no VPC, subnets or zones, because the source has none. How the ALB reaches EKS (exposure, subnets) is unknown.
- Terraform state and credentials, how the workflow is triggered, and how the assistant authenticates to Bedrock, Pinecone and the MCP server are unspecified.
- The source does not say what the MCP server does besides reading Salesforce, nor whether the ALB targets the assistant directly.
- Salesforce has no direct line from the assistant, as the source routes it through MCP.

## Design risks (not drawn)
- Single Region with no standby, so a us-east-1 outage stops the whole path.
- Zones are not shown, so there is no information on redundancy of the ALB or EKS nodes.
- Cloudflare is a single entry. The assistant depends on four external SaaS services (Pinecone, Salesforce, Langfuse, Grafana), and the source does not say how failures degrade the answer.

## Deviations and layout notes
- The AWS Cloud outline is folded into the Region title, because it holds only one Region.
- Step numbers follow the source order and match the logical order (retrieve, then generate, then case lookup is the source's order, which I kept). The agent may in practice look up cases before it writes the answer, but the source does not say, so numbering is the source's.
- The Assistant caption sits above its icon, so its bottom port is free for the Langfuse line.
- The Pinecone retrieval line crosses the EKS and Region outlines once each. Salesforce's line does the same.
- The diagram is 1500 wide, within the document limit.

## Checks performed
- `finalize.mjs` was run after each edit and embedded 11 vendor icons.
- `check-text.mjs` and `check-layout.mjs` give zero errors and zero items.
- I rendered the PNG with `render.mjs` and inspected it twice. The first pass found a caption overlapping the embed line, which I fixed by moving the GitHub caption. I also moved Pinecone so the retrieval line no longer hugs the EKS frame.
- `check-steps.mjs` was not run. The scenario's numbered steps are in a markdown list, and I confirmed by eye that connectors 1, 2 and 3 are numbered.
- I did not open the file in draw.io Desktop. The vendor viewer rendered it.
- Fidelity to the scenario text was checked by eye. Technical plausibility of the real deployment was not checked.
