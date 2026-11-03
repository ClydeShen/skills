# Companion account: Document Q&A on Azure

Files: `diagram.drawio` (editable), `diagram.png` and `diagram.svg` (rendered with the pinned draw.io viewer).

## Scope
- Logical/flow view, left to right. Query path: Employees to chat web app to AI Search, Azure OpenAI and Cosmos DB. Ingestion path: Staff to Blob Storage to Function, which writes to Azure OpenAI (embeddings) and AI Search.
- The `westeurope` region is drawn as a dashed boundary around the web app, data/AI services, Blob Storage, Function, Key Vault and Application Insights.
- Entra ID, Azure DevOps and the people are outside the region. Entra ID is global; Azure DevOps is a SaaS service, which I assumed rather than the source stating it.
- Thick solid lines are the main query and ingestion flows. Thin solid is sign-in. Thin dashed is secrets, telemetry and deployment.
- Nothing from the source was left out.

## Assumptions and unresolved points
- **Sign-in:** the source says employees sign in with Entra ID but not how. I drew one `sign in` connector from Employees to Entra ID and no token flow between Entra ID and the web app.
- **Blob container:** it is drawn with the Storage Accounts icon, captioned "Blob Storage policy documents". There is no exact container icon, and "Blob Block" is a different resource.
- **Ingestion order:** the "split" step is part of the Function and not drawn separately. The source gives no order between embedding and indexing, so both connectors leave the Function.
- **Function trigger:** the source says "each upload triggers" the Function. I labelled the Blob to Function arrow `trigger` and did not name a mechanism such as Event Grid.
- **Key Vault access:** the source says the apps "read secrets". I drew dashed arrows from the web app and the Function to Key Vault. Managed identity and private access are not stated, so they are not drawn.
- **Telemetry:** dashed arrows from the web app and the Function to Application Insights.
- **Deployment:** the pipeline's target is described only as "deploys". The two dashed arrows from DevOps do not say whether App Service and Functions use slots, zip deploy or anything else.
- **Networking:** no VNet, subnet, private endpoint or zone is drawn, because none is in the source.

## Deviations and design risks
- **Icons:** Entra ID, App Service, Search, Cosmos DB, Storage, Functions, Key Vault, Application Insights, OpenAI and DevOps all use exact catalog matches. Entra ID's catalog title is "Entra Identity"; I captioned it "Microsoft Entra ID". Azure AI Search uses the "Search Services" icon, which is the same artwork as the "Cognitive Search" entry.
- **Ingestion direction:** the ingestion lane (Staff, Blob, Function) reads right to left. I did this so the Function could sit beside both AI Search and OpenAI without a crossing. It breaks the left-to-right default.
- **Remaining layout-check reports (19 geometry items, 0 errors).** I did not silence them:
  - Several connectors cross the region's own outline or title: the DevOps deploy line to the web app crosses the region title, and `e11`/`e13` (Function to Key Vault and Application Insights) run long dashed detours. These come from placing the region around the support services and DevOps outside it.
  - Fork segments are shared by design: the web app's fan-out to Cosmos DB, AI Search and OpenAI (`e3`/`e4`/`e5`), the two shared-port dashed pairs (`e10`/`e12` and `e11`/`e13`), and the two deploy lines (`e14`/`e15`).
  - A few small jogs (4 to 7 units) come from icon connection points that do not sit exactly on the same row. The Entra connector bends twice.
- **Label placement:** the `embeddings` label sits on a short bend, and the `sign in` line passes near the Entra ID caption.
- **Connector weight:** I made query and ingestion flows heavier than support lines, as the skill's weight check asked.

## Checks performed
- `finalize.mjs`, `check-text.mjs` (clean) and `check-layout.mjs` (0 errors, the 19 items above) run after each edit.
- The PNG was rendered and viewed after each layout change, and the last render was inspected in full.
- The draw.io Desktop application was not available, so Desktop compatibility is unverified; only the pinned viewer was used.
- I checked the connectors against the source by reading the scenario again. I did not check any vendor capability against official documentation.
