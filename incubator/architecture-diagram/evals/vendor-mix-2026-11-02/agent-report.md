# Companion account

The editable architecture is [diagram.drawio](diagram.drawio), authored for draw.io 32.6.1 from [scenario.md](scenario.md). [diagram-view.html](diagram-view.html) contains a browser link with the complete diagram embedded, for viewing and PNG export.

## Scope and source fidelity

The main customer path reads left to right: Customers, Cloudflare at `help.example.com`, Application Load Balancer, and the assistant service. The assistant and MCP server are nested in the same Amazon EKS cluster, within AWS `us-east-1`. Amazon Bedrock is inside the region and outside EKS. External services remain outside AWS.

Numbered runtime relationships preserve the scenario's sequence: retrieve help articles from Pinecone, write an answer using Anthropic Claude through Amazon Bedrock, then look up cases through the MCP server. The server reads Salesforce. Numbers express the stated order; they do not indicate parallel broadcast. Normal responses are folded into the request relationships.

The top light region groups article ingestion and infrastructure activities; it is a logical grouping, not a hosting or security boundary. Changed GitHub articles enter GitHub Actions, which calls OpenAI's embeddings API and writes embeddings to the same Pinecone index queried by the assistant. Actions also runs Terraform. Terraform's management arrow terminates at AWS scope rather than an invented service endpoint. API responses, including returned embeddings, are implicit.

The assistant sends every run's traces to Langfuse Cloud. An explicit port on the EKS boundary represents cluster metrics going to Grafana Cloud without inventing a collector. Heavy solid arrows distinguish the customer path, normal solid arrows show runtime calls, and labeled dashed arrows show workflow, management and telemetry relationships.

No source facts were intentionally excluded. The source has no struck-out material, business-rule appendix, schemas, sample data or unrelated alerting to omit.

## Assumptions and unresolved details

- Customer initiation of the site request is implicit in “Customers open the support site.” The customer node makes that origin visible.
- The AWS region is applied to the described AWS resources. Exact Bedrock model ID, regional model availability and any cross-region inference configuration are not supplied or asserted.
- Cloudflare origin access, ALB exposure, VPCs, subnets, availability zones, EKS compute, replicas, targets, ingress integration, protocols and TLS termination are unspecified and are not invented.
- MCP transport, Salesforce authentication, customer identity and authorization, secret handling, and AWS permissions are unspecified. The diagram asserts the source's logical calls, not a validated deployed configuration.
- The source puts answer generation before the open-case lookup. This order is preserved; whether case data should influence that same answer remains unresolved.
- The source names OpenAI embeddings for ingestion only. Query embedding generation, embedding model compatibility, article chunking and deletion handling remain unspecified; no runtime OpenAI call is added.
- One symbol represents each named logical service. Replica and node counts, SaaS hosting regions, and failover behavior are unknown.

## Engineering review and design risks

Traffic visibly enters through the customer, Cloudflare and ALB. Runtime calls cross EKS, AWS or external-service boundaries only where their endpoints require it; the management association targets AWS scope, while telemetry originates at the assistant or cluster scope.

Only one AWS region and one EKS cluster are described. Region or cluster unavailability could interrupt the assistant. Zone resilience, replica redundancy and actual single points of failure cannot be established from the source. Pinecone, Bedrock and Salesforce are dependencies whose failures need defined application behavior; no retries, fallback or failure response is invented. Customer cases and run traces also require an explicit authorization and data-handling design before implementation.

No recommendations have been promoted into deployed components. Source fidelity was checked separately from technical plausibility. No uncertain vendor-specific operational capability was added, and no external documentation lookup was required to transcribe these logical relationships.

## Checks actually performed

- Read the architecture-diagram skill and its composition, relationships, notation, AWS conventions and draw.io authoring references.
- Queried exact catalog matches and used their supplied symbol styles and sizes. The MCP server and customer use plain boxes; the EKS cluster uses an enclosure rather than an extra service symbol.
- Embedded all 10 external vendor icons; the editable file contains their artwork.
- Parsed the XML and checked unique IDs and parent/source/target references.
- Ran `check-text.mjs`: passed.
- Ran `check-layout.mjs`: zero errors and zero items to check on the final diagram.
- Ran `render.mjs`: exited with code 3 because the sandbox denied the renderer's local server (`listen EPERM: operation not permitted 127.0.0.1`). No PNG was produced. The renderer's browser link is preserved in `diagram-view.html`.

The PNG, whole-view readability, detailed routing and offline draw.io Desktop compatibility were **not visually verified**. Geometry checks do not replace that inspection. Open the browser link or import `diagram.drawio` into draw.io to inspect and export the PNG. No application code was changed, so no implementation verification task was required.
