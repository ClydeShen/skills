# Companion account: Support assistant on AWS

Files: `diagram.drawio` (editable), `diagram.png` (rendered), `diagram.svg`.

## Scope
Logical/deployment view, left to right. Main path (heavy): Customers, Cloudflare, ALB, assistant, Bedrock. Ingestion/IaC flow sits in a band across the top; telemetry runs to the right, dashed.

## Inferences (not stated in the scenario)
- Customers were drawn as the origin of the main path (the source only implies it).
- ALB, EKS and Bedrock are placed in the us-east-1 region box, per the source for the ALB/EKS and by platform practice for Bedrock (regional service used by the workload).
- Pinecone, Salesforce, Langfuse Cloud, Grafana Cloud, OpenAI, GitHub and Cloudflare are SaaS and sit outside the region.
- Terraform's "manages" arrow ends at the region frame: the source gives no specific resources. Terraform and GitHub Actions are drawn outside AWS (GitHub-hosted workflow assumed); the scenario does not say where it runs.
- Grafana metrics arrow starts at the EKS cluster frame (source: "the cluster's metrics").
- MCP server to Salesforce is drawn as a read ("reads from Salesforce").

## Unresolved / not drawn
- No VPC, subnets, zones, ALB scheme (public/internal), protocols or Cloudflare-to-ALB security were stated, so none are drawn. Connectors carry no protocol labels.
- Step numbers 1, 2, 3 follow the source list order. The sequence is the source's; the architecture does not prove that retrieval, generation and case lookup occur in that order (the case lookup could precede generation).
- Terraform's target is shown at region level only.
- Which Claude model, and how the agent authenticates to each SaaS, are unspecified.

## Design risks (not on canvas)
- Single region, no standby shown; an us-east-1 outage stops the whole path.
- Several SaaS dependencies (Pinecone, Salesforce, Langfuse) sit outside AWS; whether the traffic uses public or private connectivity is unknown.
- The agent is a hub with five outbound relations; a failure of Pinecone or Salesforce behavior is not specified.

## Deviations from the skill defaults
- The key is placed at the lower right, partly under the region's right edge corner area but clear of its outline.
- Telemetry is the only dashed meaning; Terraform "manages" and "Write index" are solid.
- The Customers node is a plain box (no person icon was looked up).
- Bedrock's caption includes "Claude" in place of a separate Anthropic icon.
- Three label tweaks: "1 Retrieve articles" label was slid along its line to clear the Bedrock icon.

## Checks performed
- `finalize.mjs` (11 vendor icons embedded), `check-text.mjs` (clean), `check-layout.mjs` (0 errors, 0 items), `check-steps.mjs` (0 items; the source's numbered steps are all numbered on connectors).
- `render.mjs` ran successfully with the pinned draw.io viewer; I read the PNG twice (before and after the label fix). No desktop draw.io verification.
- Source fidelity was checked by hand against each sentence of `scenario.md`; technical plausibility of the real deployment is not established by this.
