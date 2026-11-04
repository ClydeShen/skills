# Companion account: Support assistant on AWS

Files: `diagram.drawio` (editable), `diagram.png` (rendered).

## Scope
One view, left to right. The main path (heavy line) runs Customers, Cloudflare, ALB, then the assistant. Support services sit on the right: Pinecone, Bedrock, Salesforce, Langfuse and Grafana. The article-ingestion and Terraform pipeline runs along the top.

## Inferred or placed by judgment
- **Customers → Cloudflare:** the source only implies this hop. I drew it and labelled the site `help.example.com` on the Cloudflare caption.
- **Region placement:**
  - The ALB, the EKS cluster and its two workloads sit in `us-east-1`, as the source states.
  - Bedrock is placed in the region as a regional service used by that workload. The source does not name Bedrock's region.
  - Cloudflare, Pinecone, Langfuse Cloud, Grafana Cloud, Salesforce, OpenAI and GitHub are SaaS and sit outside the region. The source gives no region for any of them.
- **Step numbers:**
  - Steps 1, 2 and 3 follow the source list order: retrieve, answer, look up cases.
  - The source does not say the cases lookup comes after the answer, so that order is the list's, not a stated dependency.
- **Terraform:** drawn as run by the GitHub Actions workflow and managing the region's resources, shown as a dotted "manages" line to the region boundary. The source does not name which resources Terraform manages.
- **GitHub Actions → Pinecone:** I drew "upsert" as a direct call from the workflow, with OpenAI called separately for embeddings. The source says the workflow embeds with OpenAI and writes to Pinecone, but not the exact call sequence.

## Not drawn / unresolved
- **Assistant and MCP server:** both are drawn once inside the cluster. The source gives no replica counts, namespaces or subnets.
- **Network details:** ALB scheme, exposure, protocols and subnets are not stated and not drawn. Edges carry no protocol labels except the `read` and `embed` verbs.
- **Cloudflare to ALB:** the source does not say how the ALB restricts origin traffic, so nothing is implied.
- **Salesforce access:** the MCP server is drawn as the only caller, as stated. No authentication path is shown.
- **Telemetry:** the source says traces go to Langfuse and metrics to Grafana, but not the exporter. The Langfuse line starts at the assistant, which is the traced component. The Grafana line starts at the cluster boundary, because the source says the cluster's metrics go there.

## Design risks (not drawn)
- Everything runs in one region, so the path has no regional failover. Cloudflare, Pinecone, Bedrock and Salesforce are single dependencies on the answer path.
- Bedrock is a runtime dependency of every answer.
- Pinecone sits on the answer path (step 1), and the source does not say what the assistant does if retrieval fails.

## Source deviations
None intended. No struck-out text was present. Unstated details, such as exposure, subnets and replica counts, were left out rather than guessed.

## Checks performed
- `finalize.mjs` ran on every edit and embedded 11 vendor icons.
- `check-text.mjs` passes.
- `check-layout.mjs` ends with 0 errors and 2 items to check:
  - The "3 open cases" label lies on the segment near the cluster outline.
  - The case-lookup connector is a two-bend loop (the checker reports a 116-unit detour). I kept it because the assistant's caption occupies the space directly below its icon, so a straight line down would run through the caption.
- `check-steps.mjs` was not run, because the source's steps are not in a form I could pass to it. I confirmed by hand that steps 1, 2 and 3 are numbered on their connectors.
- I rendered the PNG with `render.mjs` and viewed it. Labels, captions and routes are legible. I did not open the file in draw.io Desktop.
