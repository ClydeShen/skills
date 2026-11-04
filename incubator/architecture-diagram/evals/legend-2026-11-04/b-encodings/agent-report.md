# Companion account: Document Q&A on Azure

Files: `diagram.drawio` (editable), `diagram.png` (rendered), `diagram.svg`.

## Scope
Logical/flow view of the single scenario in `scenario.md`. Nothing was excluded. The scenario has no struck-out text, schemas or alerting.

## Drawn
- Question path (heavy): Employees → chat web app → AI Search (1), Azure OpenAI (2), Cosmos DB (3). Steps 1–3 are numbered because the source numbers them. Sign-in and the user's question are unnumbered.
- Ingestion: Staff → Blob Storage → Azure Function → AI Search (index) and Azure OpenAI (embed). This flow runs right to left. Both apps use the shared services in the centre column, which keeps the drawing free of crossings.
- Key Vault (secrets) and Application Insights (telemetry) connect to both the web app and the function. Azure DevOps (deploy) connects to both.

## Inferences and assumptions
- **Region membership.** The source places only the web app in `westeurope`. The other Azure resources are drawn inside the region frame, following the vendor practice that a workload's services share its region. Azure OpenAI model availability and the regions of Search, Cosmos DB and Storage are not confirmed. Entra ID (global) and Azure DevOps (SaaS) are outside the frame.
- **Employee to web app.** The employee-to-web-app request is drawn although the source states it only implicitly ("use a chat web app").
- **Sign-in.** Sign-in is drawn as Employees → Entra ID. The source does not say whether the web app redirects or validates tokens, so no web-app-to-Entra link is drawn.
- **Blob trigger.** The blob "trigger" label is the source's "each upload triggers an Azure Function". The mechanism (Event Grid or blob trigger binding) is unspecified and not drawn.
- **Staff upload.** Staff are shown as the actor for the upload, as the source states.
- **Secrets, telemetry and deploy.** Direction is drawn from the app toward Key Vault and Application Insights, and from DevOps toward the apps. The access method (managed identity, Key Vault references, SDK) is unspecified.
- **Icons.** "Cognitive Search" is the catalog's icon for Azure AI Search (the service was renamed). The Blob container uses the "Storage Accounts" icon because the catalog has no exact Blob container icon. Both are captioned with the source names.
- **Stated but not drawn.** No networking was drawn (VNet integration, private endpoints), because the source states none.

## Design risks (not drawn on the canvas)
- Single region: no failover or DR is stated, so a `westeurope` outage stops every path.
- The web app, function and Search/OpenAI/Cosmos have no stated redundancy, and each is a single point of failure.
- Azure OpenAI is shared by interactive answers and bulk embedding, so ingestion can use up the quota and slow answers.
- The scenario does not say whether the services are exposed publicly.

## Checks performed
- `finalize.mjs` ran after every edit.
- `check-text.mjs` is clean.
- `check-layout.mjs` reports 0 errors and 2 advisory items. Both are on the long connectors to AI Search (web app → Search, function → Search). They leave from the side ports, which keeps them separate from the deploy lines that enter the top ports. I kept this routing deliberately.
- `check-steps.mjs` was not run, because it requires the source as a numbered list in a separate file; I checked steps 1–3 against `scenario.md` by hand.
- `render.mjs` produced the PNG with the pinned draw.io viewer, and I read the image. No label collisions or accidental shared segments are visible.
- Desktop draw.io was not available, so offline Desktop rendering is unverified. Source fidelity was checked by hand, but this does not prove the real deployment is correct.
