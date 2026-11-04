# Companion account: Support assistant on AWS

Files: `diagram.drawio` (editable), `diagram.png` (rendered with the pinned draw.io viewer), `diagram.svg`.

## Scope
A left-to-right runtime view. The main path (heaviest line) is Customer, Cloudflare, ALB, then the LangGraph assistant on EKS. The assistant reaches Pinecone (1), Bedrock (2) and the MCP server (3), which reads Salesforce. The GitHub, Actions, OpenAI, Pinecone and Terraform flow runs along the top. Telemetry runs along the bottom.

## Assumptions and source gaps
- **Customer to Cloudflare** is implied by "customers open the site". It is drawn as a solid connector and no protocol is named.
- **Region membership.** The source places only the ALB in `us-east-1`, so only the ALB is inside the region outline. EKS and Bedrock sit in the AWS Cloud but outside it, because their location is unstated. This probably looks odd to a reader, since they likely are in us-east-1. Move them in if you confirm that.
- **Bedrock** is drawn as the AWS service with "(Claude)" in its caption. I did not add a separate Anthropic icon, because the model runs inside Bedrock.
- **Pinecone, Langfuse Cloud, Grafana Cloud, Salesforce, OpenAI, GitHub and Cloudflare** are drawn outside AWS. The source gives no cloud hosting for them.
- **Terraform** is drawn as a dashed "manage" connector to the AWS Cloud frame, since the source says only "manages the AWS resources". The specific resources are not stated. It is run from Actions.
- **Grafana metrics** leave the EKS frame, because the source says the cluster's metrics go to Grafana. **Langfuse traces** leave the assistant, because the source says agent runs are traced.
- **Step numbering.** Steps 1 to 3 follow the source order. The assistant-to-MCP hop is labelled "3 lookup", and the MCP-to-Salesforce hop is labelled "read" without a number. `check-steps` reports no unnumbered stated steps.
- **Not drawn, because the source does not state them:** subnets, availability zones, replica counts, protocols, load-balancer exposure, and how the workflow is triggered.
- **Count:** the assistant and MCP server are each one icon. The source gives no replica count.

## Design risks (not drawn on the canvas)
- The ALB, EKS cluster and Bedrock are each a single regional dependency in the diagram. The source mentions no redundancy.
- The assistant depends in series on Pinecone, Bedrock and Salesforce, through the MCP server for Salesforce.
- External SaaS (Cloudflare, Pinecone, Langfuse, Grafana, Salesforce, OpenAI) sit on the request or telemetry path. The source does not say what happens if one of them fails.

## Deviations and tooling notes
- **EKS:** no exact catalog icon exists for the cluster as a group. EKS is drawn as a generic group with the catalog's EKS service icon at 24 units in the corner. The assistant and MCP server sit inside it.
- **Caption placement:** the assistant's caption is placed left and below the icon, so that the telemetry connector can leave its bottom. The layout check reports "e13 runs through the caption of asst". I judged this a false positive, because the check assumes a centred caption, and the render shows the line clear of the text.
- **Terraform and Actions** captions sit beside the icon, for the same reason.

## Checks performed
- `finalize.mjs` ran (11 vendor icons embedded).
- `check-text.mjs` is clean.
- `check-layout.mjs` shows 0 errors and the single false-positive item above.
- `check-steps.mjs` shows nothing outstanding.
- I rendered the PNG and inspected it.
- Not done: opening in draw.io Desktop. Rendering used the pinned viewer only.
- Source fidelity was checked against `scenario.md`. I did not check technical plausibility against the real deployment.
