# Companion account: Document Q&A on Azure

Files: `diagram.drawio` (editable) and `diagram.png` (render).

## Scope and pages
- One page, one view, drawn left to right. Runtime flows are solid lines. Secrets, telemetry and deployment are dashed lines in the same view. None of the split limits in the skill was reached, so there is no second page.
- The query path is the middle row: Employees, Chat web app, Azure OpenAI. The ingestion path mirrors it from the right: Staff, Blob, Function, Azure OpenAI. Azure OpenAI sits between the two flows because both use it.
- Steps 1 to 3 are numbered because the source numbers them. Ingestion has no stated order, so it carries labels only.
- Left out: nothing in the source was struck out. The source has no business rules, schemas or alerting, so none were left out.

## What the source states
Every connector below is stated in `scenario.md`, apart from the inferences in the next section.
- Sign-in with Entra ID (Employees to Entra ID).
- The web app calls AI Search, Azure OpenAI and Cosmos DB.
- Staff upload to Blob Storage, an upload triggers the Function, and the Function calls Azure OpenAI and writes to AI Search.
- Both compute services read from Key Vault and send telemetry to Application Insights.
- The Azure DevOps pipeline deploys both.

## Inferences and gaps (not stated by the source)
- **Region placement.** Only the web app is stated to be in `westeurope`. I drew the Function, AI Search, Azure OpenAI, Cosmos DB, Blob Storage, Key Vault and Application Insights inside the region, following the normal practice that one workload's services share a region. This is an inference. Azure OpenAI and Application Insights in particular could be elsewhere.
- **Entra ID and Azure DevOps** sit outside the region as global or SaaS services.
- **Employees to web app.** The source does not say how the user reaches the app. I drew a plain "question" connector, because a main path starts at the user.
- **Sign-in path.** I drew Employees to Entra ID. I did not draw the web app calling Entra ID, because the source does not say how the token exchange works.
- **Staff.** I drew a separate Staff actor for uploads. The source does not say whether staff are the same people as employees.
- **"trigger" connector.** It runs from Blob to Function, as an event. The source does not say which mechanism is used (Event Grid or a blob trigger). The Function's read of the uploaded document is implied by "splits the document" but not stated, so I did not draw it.
- **Not specified, so not drawn:** networking (VNet integration, private endpoints), authentication to the data services (managed identity or keys), and the number of instances or zones.

## Icons
- **Plain white boxes** (no exact catalog match):
  - Azure OpenAI.
- **Closest catalog icons:**
  - AI Search uses the catalog icon titled "Cognitive Search", which is the former name of the same service.
  - Blob Storage uses the "Storage Accounts" icon, because the catalog's "Blob Block" and "Blob Page" are not the service.
  - Microsoft Entra ID uses the "Entra Identity" icon.
- Please confirm those three are acceptable.

## Design risks (for your review, not drawn)
- Every service is shown once, so I can see no redundancy. I cannot tell from the source whether any of them is zone-redundant, so the diagram makes no resilience claim.
- Key Vault is a shared dependency of the web app and the Function. If it is unavailable, both lose access to their secrets.
- Azure OpenAI is shared by the query and ingestion paths, so heavy ingestion can use up the quota that answers need. This is a general risk of the shared resource, not something the source states.

## Checks run
- `finalize.mjs`: passed.
- `check-text.mjs`: passed.
- `check-layout.mjs`: 0 errors and 0 items after layout fixes. An earlier layout had connectors crossing the captions of the web app and the Function, so I moved secrets and telemetry to a top lane.
- `render.mjs`: rendered with the pinned draw.io viewer. I read the PNG and traced every connector.
- `check-steps.mjs`: not run. I did not save the source as a separate numbered file, and the three query steps are numbered 1 to 3 on the connectors by hand.
- Not verified: opening the file in draw.io Desktop, or importing it into Lucidchart.

## Minor visual notes
- The Application Insights icon and the Key Vault caption sit close together in the top lane.
- The long "deploy" line to the Function runs along the top, outside the region, and crosses its outline once.
