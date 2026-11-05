# Companion account: Document Q&A on Azure

Files: `diagram.drawio` (editable), `diagram.png` (and `diagram.svg`) rendered from it.

## Scope and pages
One page, "Document Q&A runtime and ingestion". Everything fits in under 1400 units with two line kinds (solid main flow, dashed supporting flow), so no split was needed. Direction is left to right. The employee question path runs through the middle row. Ingestion runs right to left into the same shared Azure OpenAI and AI Search. Deployment sits on a top lane, and secrets and telemetry sit on a bottom lane.

## Source facts drawn
- Employees sign in with Entra ID, then ask the chat web app (App Service).
- Steps 1 to 3 are numbered as in the source: query AI Search, send question and passages to Azure OpenAI, store the conversation in Cosmos DB.
- Staff upload to Blob Storage. The upload triggers the Function, which calls Azure OpenAI for embeddings and writes to AI Search.
- Web app and Function read secrets from Key Vault and send telemetry to Application Insights.
- Azure DevOps deploys both.

## Inferences (not stated by the source)
- The Employees to web app request is implied. I drew it as the start of the main path.
- Sign-in is drawn as Employees to Entra ID only. The source does not say whether the web app redirects or validates tokens, so I drew no web app to Entra connector.
- All Azure resources except Entra ID and DevOps are placed inside `westeurope`. The source names the region for the web app only. I placed the other resources there by regional co-location practice. Entra ID is tenant-wide and Azure DevOps is a SaaS service, so both are outside the region.
- The Function reading the uploaded document from Blob Storage is not drawn separately. The source only says the upload triggers it, and the diagram shows that trigger.
- Step labels follow the source order. The drawn execution order matches it.

## Left out
Nothing was struck out in the source. I did not draw the document-splitting detail inside the Function, because it is a processing step, not an architecture relationship. I did not draw subnets, VNet integration or private endpoints, or a resource group, because the source gives none of them.

## Icons
Exact catalog matches were used for Users, Entra Identity, App Services, Cognitive Search, OpenAI, Cosmos DB, Storage Accounts, Function Apps, Key Vaults, Application Insights and DevOps. Two points need a decision:
- The AI Search icon is the catalog's "Cognitive Search" entry (`Search_Services.svg`), the pinned catalog's only search icon. The service has since been renamed Azure AI Search, and the caption uses the current name.
- "Entra Identity" is the closest Entra icon the catalog offers for "Microsoft Entra ID". The caption reads "Entra ID" so it fits left of the region boundary.

## Design risks (for you, not drawn)
- There is a single region and no standby, so a westeurope outage stops both the query and ingestion paths.
- Both flows share one Azure OpenAI resource and one AI Search index. Heavy ingestion could compete with interactive queries, and a failure in either shared service affects both flows.
- The source does not say whether any service is reached over private networking. The diagram implies nothing about exposure.

## Checks run
- `finalize.mjs`: ran and wrote the draw.io file layout. It reported 0 embedded vendor icons, since all icons are built-in Azure SVG references.
- `check-text.mjs`: clean.
- `check-layout.mjs`: 0 errors and 0 items to check on the final run. Earlier runs flagged three label placements and an Entra caption crossing the region outline. I fixed these by moving label positions, widening the gap to Staff, shifting the left column and shortening the Entra caption.
- `render.mjs`: rendered, and I inspected the final PNG. I traced every connector against the source.
- `check-steps.mjs`: not run. The source numbers its steps, so it should have been. I labelled steps 1 to 3 by hand and checked them visually.
- Not verified: opening the file in draw.io Desktop.
