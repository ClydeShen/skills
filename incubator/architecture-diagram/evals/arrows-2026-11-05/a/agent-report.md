# Companion account: Support assistant on AWS

Files: `diagram.drawio` (editable) and `diagram.png` (render of the single page).

## Scope and pages
- One page, "Support assistant". It shows the runtime path left to right and the ingestion and telemetry flows in the top and bottom lanes. No limit in the composition rules forced a split. The page is about 1340 units wide, uses two kinds of line and has two nested outlines.
- Solid lines are main flows (requests and data, including ingestion). Dashed lines are supporting flows (deployment and telemetry). A Key is in the lower-right corner.
- Steps 1 to 3 follow the source's list. The drawn architecture executes them in that order, so I did not renumber them.

## Left out
No business rules, schemas or sample data were in the source, so none were omitted.

## Inferences, not stated in the source
- **Customers to Cloudflare.** The source implies this first hop. I drew it and labelled it `help.example.com`.
- **Amazon Bedrock in us-east-1.** The source does not place Bedrock. I put it in the same region as the workload, following the usual practice that a workload's services share its region.
- **Application Load Balancer and EKS in the region.** The source places the load balancer in us-east-1, and the cluster is its target. I drew the load balancer and the cluster inside the region and did not draw a VPC or subnets.
- **Terraform "manages" the region.** The source says Terraform manages "the AWS resources". I drew it to the Region boundary. This is a boundary-level arrow, not a call to a specific resource.
- **Grafana metrics.** The source says "the EKS cluster's metrics". I drew the arrow from the cluster boundary, since every member is measured at cluster level.
- **Langfuse traces.** The source says every agent run is traced. I drew the arrow from the assistant service. This is the acting component, though the source does not name it.
- **Actions to Terraform.** The source says Terraform runs "from the same workflow". I drew a dashed "runs" line from the workflow to Terraform.
- **Pinecone, OpenAI, Salesforce, Langfuse Cloud, Grafana Cloud and Cloudflare.** All sit outside the AWS Region as external SaaS.
- **Pinecone placement.** Pinecone's own region or cloud is not stated.
- **Icons.**
  - "Customers" uses the AWS "Users" icon.
  - "Amazon Bedrock (Claude)" uses the Bedrock icon only. The Claude artwork is not drawn separately, so the caption carries the model.

## Not shown, because the source does not state it
- Load balancer type and exposure, target group configuration, VPC, subnets and zones.
- Protocols between components. The `help.example.com` TLS and the MCP transport are not stated.
- How the assistant authenticates to Pinecone, Bedrock or Salesforce. How GitHub Actions authenticates to AWS is also not stated.
- The Salesforce read is drawn as a call from the MCP server.
- Replica counts for the assistant and the MCP server. I drew single icons because no counts are given.

## Design risks (not drawn on the canvas)
- One region and no stated zone redundancy. A us-east-1 outage stops the whole runtime path.
- The assistant depends on four external services: Pinecone, Salesforce through MCP, Bedrock and Cloudflare. The source states no fallback.
- Terraform and the article embedding job share one workflow.

## Layout notes
- `check-layout` ends with 0 errors and 2 advisory items, which I kept:
  - **`e4`, assistant to Pinecone.** The route has two bends. The one-bend alternative from the top of the assistant would cross the EKS title and the ingress lane. It also lets the Bedrock and MCP lines leave from separate ports.
  - **`e9`, workflow to OpenAI.** The route has one bend. The straight route would put OpenAI on the row of the Pinecone and Terraform lines, which would then cross it.
- The Langfuse "traces" line leaves the left side of the assistant, below the incoming load balancer line. A downward exit would run through the caption.

## Checks run
- `finalize.mjs`: ran and embedded the 11 vendor icons.
- `check-text.mjs`: passed.
- `check-layout.mjs`: 0 errors and the 2 items above.
- `render.mjs`: ran and I inspected `diagram.png`.
- `check-steps.mjs`: not run. The source's list is numbered, but I did not save it as a separate file for the script.
- Not verified in draw.io Desktop. The render used the pinned viewer.

Source fidelity and technical plausibility were judged separately. A faithful drawing does not prove that the deployment is correct.
