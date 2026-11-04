# Companion account: Document Q&A on Azure

Files: `diagram.drawio` (editable), `diagram.png` (rendered, and `diagram.svg`).

## Scope
A logical and deployment view of the chat flow (steps 1 to 3), the document ingestion flow, and the supporting services. It has one scenario and no excluded text. The numbered steps 1 to 3 are numbered on the connectors in the order the architecture runs them, which matches the source list.

## Inferences (not stated in the source)
- The `westeurope` boundary holds the web app, Function, AI Search, Azure OpenAI, Cosmos DB, Blob Storage, Key Vault and Application Insights. The source gives the region only for the web app. Placing the others there follows the practice of deploying a workload's services in its own region. Real regions for these resources are unconfirmed.
- Entra ID, Azure DevOps and the people (Employees, Staff) are drawn outside the region. Entra ID is global and DevOps is a SaaS service.
- The Employees to Web App request is implied by the source rather than stated. The "sign in" arrow goes from Employees to Entra ID. The source does not say how the web app validates tokens, so there is no Web App to Entra ID line.
- The Blob Storage to Function arrow, labelled "trigger", reflects "each upload triggers an Azure Function". The trigger mechanism, such as Event Grid or a blob trigger, is not stated and is not drawn.
- The Function's "writes them to the AI Search index" is drawn as Function to AI Search ("index"), and the embeddings call as Function to Azure OpenAI ("embed"). Both go to the same OpenAI and Search resources the web app uses, as the source says.
- "Reads secrets" is drawn as an arrow from each app to Key Vault. Telemetry is drawn as an arrow from each app to Application Insights. The authentication method, such as managed identity, is unspecified.
- The pipeline deploys to the web app and the Function. I drew an arrow from DevOps to each. The deployment mechanism is not stated.

## Unspecified, not drawn
Networking (VNet integration, private endpoints, public exposure), SKUs, zones, counts of instances, protocols, the Function's trigger type, the Azure OpenAI model deployment names, and the Cosmos DB API.

## Icon choices
- AI Search uses draw.io's "Cognitive Search" icon (`Search_Services.svg`). No icon named "AI Search" exists in the pinned catalog, so this is the closest official entry for the renamed service.
- Entra ID uses the "Entra Identity" icon. Employees and Staff use the "Users" icon.
- All other icons were exact matches (App Services, Function Apps, Cosmos DB, Storage Accounts, Key Vaults, Application Insights, OpenAI, DevOps). No plain-box fallbacks were needed.
- Blob Storage is drawn with the Storage Accounts icon, because there is no blob-container icon. The caption says Blob Storage.

## Design risks (not drawn on the canvas)
- One Azure OpenAI deployment serves both question answering and ingestion, so heavy ingestion could throttle user answers.
- The web app, Function, Search, OpenAI and Cosmos DB are each drawn once, with no zone or region redundancy shown. Whether they are single points of failure depends on SKUs and zone settings the source does not give.
- The source does not mention how the secrets are accessed or how the apps reach the data services privately. Network isolation is therefore unknown.

## Layout decisions and deviations
- Left-to-right main path (Employees to Web App to Search, OpenAI and Cosmos DB). The ingestion flow runs right to left, so that AI Search and OpenAI sit between the two flows and both reach them directly. That second direction is a deliberate trade-off.
- Dashed lines have one meaning, supporting links (secrets, telemetry, deploy). The key explains this.
- The page is about 1500 units wide, slightly over the 1400 guideline. It is under 1600, so I did not split it.
- Entra ID's caption sits to the right of its icon so that the sign-in arrow can enter from below.

## Checks performed
- `finalize.mjs` ran. The report says 0 vendor icons were embedded, because all icons are draw.io built-in Azure shapes.
- `check-text.mjs` passed.
- `check-layout.mjs` reported 0 errors and 0 items to check on the final file. Earlier runs flagged the Staff upload label crossing the region outline and overlapping telemetry labels. I fixed those by moving the Staff icon and moving labels onto longer segments.
- `check-steps.mjs` was not run. The source's numbered list is simple, and steps 1 to 3 are numbered on the diagram.
- `render.mjs` produced the PNG, and I inspected it. All connectors, labels and captions are readable, with no lines through icons or captions.
- I did not verify the result in draw.io Desktop. The render used the pinned draw.io viewer.
- Source fidelity and technical plausibility were checked separately. I did not verify against a real deployment.
