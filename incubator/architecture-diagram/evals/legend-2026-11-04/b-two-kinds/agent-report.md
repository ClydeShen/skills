# Companion account: Document Q&A on Azure

Files: `diagram.drawio` (editable), `diagram.png` (render of it; `diagram.svg` was also produced by the renderer).

## Scope
One logical/flow view, left to right. Runtime Q&A path through the middle row; document ingestion on the right, flowing right to left; secrets, telemetry and deployment as dashed lines. Sign-in is drawn as an unnumbered line. Steps 1 to 3 of the source are numbered on the web app's connectors.

## Source-stated vs. inferred
- Stated: all services and connections drawn.
- Inferred: "Employees to web app" (question) is the implied start of the main path. The Blob upload by "Staff" is also drawn as an actor-to-Blob hop. "Trigger" is the source's "each upload triggers".
- Region: the source places only the web app in `westeurope`. I drew the other Azure resources inside the same region, since they are normally deployed with the workload. This is an inference, not stated. Entra ID is global and sits outside. Azure DevOps sits outside the region as a control-plane service, and its deploy lines cross the region edge once.
- Numbering follows the source order (1 search, 2 answer, 3 store). The source's step 2 includes "send question and passages". It is drawn as one connector to OpenAI, and the answer returns on the same connector.

## Unresolved / not drawn
- How the web app uses Entra ID (token validation, built-in App Service authentication or a library) is unspecified. Only the user's sign-in is drawn. There is no web app to Entra connector.
- Authentication mechanism to Key Vault, Search, OpenAI and Cosmos (managed identity or keys) is unspecified. The source says only that secrets come from Key Vault.
- Networking (VNet integration, private endpoints), zones and redundancy are not in the source and not drawn.
- Which of the Function's "same Azure OpenAI resource" deployments is used (an embedding model deployment versus the chat deployment) is not shown. Both are one resource, drawn once.
- Exact upload mechanism and the trigger type (Blob trigger or Event Grid) are unspecified.

## Icon choices
- No icon for Azure AI Search under that name. I used the catalog's "Cognitive Search" entry (`app_services/Search_Services.svg`), the same artwork, captioned "Azure AI Search".
- Blob Storage uses the "Storage Accounts" icon, captioned "Blob Storage container". There is no exact container icon.
- Entra ID uses the "Entra Identity" icon. Azure DevOps, Function Apps, App Services, Cosmos DB, Key Vaults, Application Insights and OpenAI are exact matches. All come from `find-icon.mjs`.

## Design risks (not drawn on the canvas)
- Single region, single instance of each service. A westeurope outage stops everything.
- The web app and the function both depend on one Key Vault and one OpenAI resource, which are shared single points of failure.
- Ingestion and Q&A share the OpenAI quota, so bulk uploads could throttle user answers.

## Checks performed
- `finalize.mjs`: ran; it reported 0 vendor icons embedded, because all icons are the draw.io built-in Azure SVG paths.
- `check-text.mjs`: clean.
- `check-layout.mjs`: 0 errors and 2 advisory items remaining, which I left:
  1. "All connectors have the same weight". This is deliberate, because the skill's guidance says to use one weight.
  2. "e8 bends twice". The Function-to-OpenAI route could enter the top of OpenAI with one bend, but I kept the side entry so it stays clear of the Function-to-Search line.
- `check-steps.mjs`: not run, because the scenario's steps are listed in prose and I numbered them by hand.
- Rendering: `render.mjs` succeeded and I looked at the PNG after each edit. Final image has no collisions I could see.
- Not done: no verification in draw.io Desktop. The "Key" table shows a stray extra line under it in the renderer, which I believe is a renderer artefact of the table layout but did not confirm in the editor.
- Layout deviations: the web app and function captions sit above the icon so the dashed lines can leave from the bottom. The tall layout (about 1400 by 1050) comes from stacking Key Vault, Application Insights and DevOps in one support lane.
