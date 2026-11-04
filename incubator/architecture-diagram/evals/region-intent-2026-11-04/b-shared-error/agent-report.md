# Companion account: Document Q&A on Azure

Files: `diagram.drawio` (editable, finalized), `diagram.png` (rendered with the pinned draw.io viewer, and I inspected it), `diagram.svg`.

## Scope
Logical and flow view. Everything in `scenario.md` is drawn: Entra sign-in, chat app, AI Search, Azure OpenAI, Cosmos DB, the Blob to Function ingestion path, Key Vault, Application Insights, and the DevOps deployment. Region `westeurope` is drawn as a dashed boundary. Users, Staff, Entra ID and Azure DevOps sit outside it as external actors and services. Nothing was excluded from the source.

## Numbering
Only the three per-question steps are numbered (1 Search, 2 Answer, 3 Store). The source lists them in that order and the logic agrees. Upload, Trigger, Embed and Index are labelled but not numbered, because the source gives no order for them.

## Assumptions and unresolved points
- **Entra ID to the web app:** the source says employees sign in with Entra ID but gives no token or redirect flow. I drew Employees to Entra ("Sign in") and Employees to the app. I did not draw an Entra to app connector.
- **Function reads the blob:** the source says an upload triggers the Function, which splits the document. I drew only the Trigger arrow, Blob to Function, and no separate read connector.
- **Embed and Index:** these are drawn as Function to OpenAI and Function to Search, as the source says. The source does not state the protocol.
- **Secrets, Telemetry, Deploy:** these are dashed connectors for the stated relationships. The source gives no mechanism, such as managed identity, references or SDK, so none is shown.
- **Placement of Key Vault and Application Insights:** the source does not say where they are deployed. I drew them inside the region as regional resources, without inventing subnets or VNet integration.
- **Placement of Entra ID and Azure DevOps:** they are outside the region as global or SaaS services.
- **Deployment detail:** no SKU, plan, networking, private endpoint or zone detail was given, so none is drawn.

## Icons
Exact catalog icons were used for App Services, Cognitive Search (the catalog title for AI Search), Azure OpenAI, Cosmos DB, Function Apps, Key Vaults, Application Insights, Azure DevOps, Entra Identity and Users. Blob Storage uses the `Blob Block` icon, which is the nearest exact blob entry. If a stricter reading wants a plain box, that is the only icon call I would reconsider. The AI Search icon is the older "Cognitive Search" artwork, as the catalog has no newer entry.

## Design risks (not drawn)
- Single region and no standby are shown, so a `westeurope` outage stops everything.
- The Function App and web app are each a single instance in the drawing, because the source states no scale.
- The web app is a single point of failure on the question path.
- Key Vault is a shared dependency of both compute components.

## Checks run
- `finalize.mjs` and `check-text.mjs` pass.
- `check-layout.mjs` reports 0 errors in its final run. It still lists 14 items to check, which I did not fully clear:
  - Some connectors are reported as crossing or running through captions. Several of these did not look like crossings in the PNG.
  - The Deploy connector to the Function is long, and the layout check flags it as crossing the Index and Secrets connectors.
  - e3 and e9 each bend twice where a one-bend route might exist.
  - The `Upload` label sits on the region outline.
  - The diagram is wider than the checker's suggested page width.
- I did not suppress these by deleting or relabelling anything. They are layout compromises from the number of connectors on the Function App.
- `check-steps.mjs` was not run.
- The PNG was inspected visually. I did not open the file in draw.io Desktop.
- I checked the diagram against the source for missing instances and wrong directions. I did not independently verify technical plausibility against vendor documentation.
