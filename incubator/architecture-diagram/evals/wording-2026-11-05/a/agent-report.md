# Companion account: Support assistant on AWS

Files: `diagram.drawio` (editable) and `diagram.png` (rendered). `diagram.svg` was also written by the renderer.

## Scope and pages
- One page, "Support assistant on AWS". It carries runtime and auxiliary flows together as solid and dashed lines. None of the split limits applied: two line kinds, about 1300 units wide, two nested outlines (Region, EKS), one main direction.
- Left to right: Customers, Cloudflare, load balancer, assistant, MCP server, Salesforce.
- Lanes:
  - Top: the help-article pipeline (GitHub, GitHub Actions, OpenAI, Pinecone) and Langfuse.
  - Bottom: Grafana.
- Left out: the AWS Cloud outer boundary (folded into the Region title), subnets and zones (the source gives none), and the numbering of the pipeline (the source states no order).

## Facts, inferences, unknowns
- Stated and drawn:
  - Request path, with steps 1 to 3 numbered in the source's order.
  - Langfuse traces and Grafana metrics (dashed).
  - Pipeline: GitHub Actions embeds with OpenAI, writes to Pinecone, and runs Terraform.
- Inferred:
  - The Customers to Cloudflare hop; the source only implies it.
  - Bedrock inside Region us-east-1. Bedrock is regional and the source gives no other region.
  - The MCP server's Salesforce read is drawn as a solid call.
  - The GitHub to Actions arrow means "articles flow to the workflow". The source does not say whether a push triggers the workflow or the workflow pulls.
  - The Terraform dashed arrow ends at the Region boundary, because the source says only "AWS resources" and names none. This does not claim that Terraform manages every Region member.
  - "Run" from Actions to Terraform is taken from "run from the same workflow".
- Not specified, and not drawn:
  - Load balancer type and exposure.
  - How the assistant's traces reach Langfuse. The arrow starts at the assistant, as the source says "every agent run is traced".
  - How metrics leave the cluster. The arrow starts at the EKS boundary because the source says "the cluster's metrics".
  - Protocols such as HTTPS, and the cloud or region of Pinecone, Langfuse, Grafana, Salesforce and OpenAI. These are drawn outside AWS.
  - Whether the Claude call actually passes the retrieved articles or the case data. Only the stated hops are drawn.

## Numbering
Steps 1, 2 and 3 follow the source list (retrieve, generate, open cases). The source does not state whether the case lookup precedes answer generation. A real agent may run the lookup first, so confirm the order.

## Design risks (not drawn)
- Everything runs in a single Region, with no zone or standby detail. Region loss stops the path.
- Cloudflare, Pinecone, Langfuse and Bedrock are single dependencies on the answer path. Langfuse and Grafana are not on the answer path.
- The source does not show whether the assistant fails closed if Pinecone or Salesforce is down.

## Layout notes
- The Assistant's three upward lines (Bedrock, Pinecone, Langfuse) leave one icon edge. This is why the ports are close together and the retrieve and generate labels sit between the lines.
- Several captions sit beside icons (left or right) so that connectors keep the bottom or side clear.

## Checks run
- `finalize.mjs`: passed, 11 vendor icons embedded.
- `check-text.mjs`: clean.
- `check-layout.mjs`: 0 errors, 0 items, after fixing two earlier reports by moving elements (EKS title crossings, a two-bend route).
- `render.mjs`: I read the final PNG.
- Not run: `check-steps.mjs`, because the source's steps are a plain list. I checked by eye that steps 1 to 3 are numbered. No Desktop draw.io check was done. The browser rendering is not proof of Desktop behaviour.
- Icons come from `find-icon.mjs`. Bedrock, EKS, ELB, Users and the Region group are draw.io AWS icons; the others are vendor icons. The EKS boundary uses the EKS icon at 24 units, and that service is not repeated inside it.
- Technical plausibility was not checked against live documentation. Faithfulness to the source and plausibility are separate questions.
