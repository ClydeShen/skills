# Companion account: Knowledge and data platform on Azure

Files: `diagram.drawio` (editable, one page "Overview"), `diagram.png` (render), plus `diagram.svg` and `diagram.render.json` from the renderer.

## Scope and page

- One page, logical view with a deployment outline (Microsoft Azure, region westeurope). The main request path runs left to right: Employees, Front Door, API Management, then the three backends and their data stores.
- Supporting flows are dashed: sign-in, WAF policy, image push and pull, deployment, secrets and telemetry. The telemetry pipeline (Devices to Machine Learning) is a solid vertical lane on the right.
- No split was needed. One kind of solid line and one kind of dashed line, with a key.
- Steps 1 to 3 are numbered on the API Management connectors, in the order the source lists them. Other interactions carry labels without numbers.
- Left out: nothing was struck out in the source, and it contains no business rules, schemas or alerting.

## Stated in the source versus inferred

Stated and drawn as given: every service and connection in `scenario.md`.

Inferred (not in the source):

- **Employees to Front Door:** the entry hop starts at the employees. Sign-in to Entra ID is drawn as a separate dashed line.
- **WAF policy to Front Door:** drawn as a dashed "policy" association.
- **Devices:** a source icon for "device telemetry arrives", sitting outside Azure.
- **Placement:** everything except Front Door, WAF policy, Entra ID and DevOps is placed in westeurope, by platform practice. Front Door is global. I put Entra ID and Azure DevOps outside the Azure boundary because they are Microsoft SaaS or identity services. That is a presentation choice, not a source statement.
- **Group connectors:** "all: secrets", "all: telemetry" and "all: deploy" attach to the Backends group, since the source says all three backends use them. The source says Azure DevOps "deploys the services" without naming them, so I took that to mean all three.
- **Functions:** one Function Apps icon covers both the upload handler and the split-and-index function. The source says "Azure Functions" and "an Azure Function". Whether they are one app is not stated.
- **Function to Blob:** drawn as "upload", Function to Blob, because the source does not say who writes the upload.
- **Service Bus:** the "exchange messages" relationship is drawn as separate send and receive connectors. The source gives no topology.

## Not drawn as connectors (source silent)

- Azure Monitor and Log Analytics "collect logs and metrics" from an unspecified set of sources. They sit in the Observability group with Application Insights and have no connector. Application Insights to Log Analytics is not stated.
- Entra ID token flow to API Management or the apps is not stated, so only sign-in is shown.
- Calls from the chat service to the search index at ingestion time, and Cosmos DB or Redis access from other services, are not stated and not drawn.

## Icon notes

- **Azure Data Lake Storage:** the catalog's only match is "Data Lake Storage Gen1" (a retired product). Gen2 normally uses the Storage Accounts icon, which is also used for Blob Storage. I used the Gen1 icon for the data lake to keep it distinct, and the caption says "Data Lake Storage".
- **AI Search:** the icon is the catalog's "Search Services" artwork (Cognitive Search entries map to it).
- **Cache for Redis:** the "Cache Redis" icon.
- **WAF policy:** drawn as its own icon, associated with Front Door.

## Design risks (not corrected on the canvas)

- The API Management, Front Door, Redis, Cosmos DB, SQL and Service Bus paths are each a single instance as drawn. Whether zonal or regional redundancy exists is not stated. The whole workload sits in one region, which is a single failure domain.
- Front Door is the only drawn entry. The source does not say whether API Management is reachable directly or restricted to Front Door; check this.
- Secrets, telemetry and deployment lines to the Backends group assume every member uses them.

## Checks run

- `finalize.mjs`: passed (vendor icon embedded).
- `check-text.mjs`: passed.
- `check-layout.mjs`: **0 errors, 11 items to check**. These remain and are deliberate:
  - Page is taller than wide (1365 by 1395). Putting the data stores in one column keeps the Chat fan-out free of crossings but makes the page near square. A wider layout would exceed the 1400-unit width limit.
  - Six connectors from Chat, AKS and Functions to their data stores (Redis, OpenAI, Cosmos DB, SQL, Blob, Search) have jogs or two bends. Icon heights (72) are larger than the port spacing available on one icon side, so these targets cannot all line up straight. Straightening them would need targets stacked on one line, which would overlap.
- `check-steps.mjs`: 0 items.
- `render.mjs`: rendered with the pinned draw.io viewer. I inspected the PNG. No collisions with captions or outlines. Connector labels sit on straight segments.
- Not verified: opening in draw.io Desktop, or import into Lucidchart.

## Recommendation

For a wiki, consider a second page "Operations" (build, deploy, secrets, telemetry) to shorten the main page. I did not split because one page met the stated limits (two line kinds, under 1400 wide).
