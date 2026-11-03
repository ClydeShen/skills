# Companion account: Document Q&A on Azure

Files: `diagram.drawio` (editable), `diagram.png` (rendered; `diagram.svg` also written by the renderer). The generator script is `gen/make.py`.

## Scope
One view, flow-oriented, left to right. It shows the question path (web app to Search, OpenAI and Cosmos DB, numbered 1 to 3 as in the source list), the ingestion path (Staff, Blob, Function, OpenAI embeddings, Search index), Entra sign-in, Key Vault and Application Insights as shared services, and the Azure DevOps pipeline above the region. Everything except Employees, Staff, Entra ID and DevOps sits inside a dashed `westeurope` region. The source gives no VNet, subnet or resource-group detail, so none is drawn.

## Icons
Exact catalog matches were used for Employees and Staff (Users), Entra ID (Entra Identity), App Service, AI Search (listed as Cognitive Search), Azure OpenAI, Cosmos DB, Function Apps, Blob (Blob Block), Key Vault, Application Insights and Azure DevOps. No plain-box fallbacks were needed. Where the catalog had duplicate titles (App Services, Function Apps) I picked one arbitrarily, because they are the same service.

## Assumptions and source deviations
- **Secrets and telemetry:** the source says both apps use Key Vault and Application Insights. I drew one dashed connector from each app to a "Shared services" band instead of four lines. The web-app connector has no label because its label would cross the region outline. Read it as the same relationship as the labelled Function connector. The band does not say which service carries secrets and which carries telemetry.
- **Deploy:** dashed lines from the pipeline to the web app and the function. The source gives no deployment mechanism.
- **Entra sign-in:** drawn as Employees to Entra ID. The source does not say whether the web app redirects or validates tokens, so no token or app-to-Entra hop is shown.
- **Blob trigger:** "trigger" is drawn from Blob to Function, as the source states. The trigger mechanism (such as Event Grid) is not given and is not drawn.
- **Placement:** I placed Entra ID and the pipeline outside the `westeurope` frame. Entra is a tenant-level service, and the pipeline is a control-plane tool. The source does not state either one's region.
- **Numbering:** only the three per-question steps are numbered. The order matches both the source list and the logic: search, then answer, then store.
- **Not drawn:** the scenario has no unstated services to leave out. Nothing from the source was omitted.

## Design risks
- Both shared-services connectors end at the band edge, not at an icon, so a reader may not see that both apps use both services.
- Main-path weight: all connectors have the same weight. The layout checker asked for a heavier main path. I did not do this.
- The deploy connectors run a long way across the top, and they cross the region outline. That crossing is required, since the pipeline is outside the region.

## Checks performed
- `finalize.mjs` ran after each edit.
- `check-text.mjs` is clean.
- `check-layout.mjs` reports 0 errors and 4 items. Three are "connector passes over region" for the band connectors and the Cosmos connector. These are intentional, because the band and Cosmos sit inside the region. The fourth is the uniform-weight note above.
- I rendered the PNG with `render.mjs` and inspected it after each of three layout rounds. In the final image, no connector crosses a caption or another connector, and labels sit on straight segments.
- Visual verification was done only in the pinned viewer render. I did not open the file in draw.io Desktop.
- Source fidelity was checked by tracing each sentence of `scenario.md` to a drawn element or connector. Technical plausibility of the real deployment was not assessed.
