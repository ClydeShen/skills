# Companion account: Document Q&A on Azure

Files: `diagram.drawio` (editable), `diagram.png` and `diagram.svg` (rendered).

## Scope
Logical/flow view, left to right. Main path: Employees, then chat web app, then Azure OpenAI.
Steps 1-4 are the numbered chat flow from the source. The ingestion flow is lettered A-D
(upload, trigger, embed, index) so it is not mistaken for the chat order.
Region `westeurope` encloses the Azure resources. Employees, Staff, Entra ID and Azure DevOps sit outside it.
Key Vault and Application Insights links are thin dotted lines; deployment links are labeled `Deploy`.

## Assumptions and source gaps
- Source says "sign in with Entra ID" but not the mechanism (redirect, token, who validates). Drawn only as Employees to Entra, dotted, labeled "Sign in". No web app to Entra token flow was invented.
- Staff to Blob upload and the Function trigger are drawn as stated. The trigger mechanism is not specified.
- Source steps 2 and 3 order (search, then OpenAI) is kept. Step 4 (store conversation) is drawn from the web app.
- Key Vault and App Insights are each drawn once, shared by the web app and the function. Source does not say whether they are single shared instances.
- Placing the Azure DevOps pipeline outside the region is an inference (it is a SaaS service). No agents, service connections or networking are drawn.
- Placement of Azure OpenAI and AI Search in the middle band is for routing only; it does not imply a network boundary. No VNet, subnet, private endpoint or exposure is drawn because none was given.
- Icons: no exact "Blob container" icon exists, so the Storage Accounts icon is used with caption "Blob Storage container". AI Search uses the catalog's "Cognitive Search" entry (older name of the same service); this is the closest match, please confirm. Entra uses "Entra Identity".

## Design risks (not drawn)
Single web app and single function instance, no zone redundancy shown, and OpenAI/Search/Cosmos shared by both flows. The source specifies none of these, so none is asserted.

## Checks performed
- `finalize.mjs`, `check-text.mjs` ran clean. `render.mjs` produced the PNG and I inspected it.
- `check-layout.mjs`: 0 errors but **22 items still open**. I did not clear them. Main ones:
  - The two `Deploy` connectors from DevOps cross the Blob/Function row and share a segment with the Employees to web app and Blob to Function arrows. In the image they look like they merge into those arrows. This is a real readability defect; DevOps needs a cleaner lane (for example a dedicated top or bottom band).
  - Web app and Function reach Key Vault and Application Insights over shared trunks (bus-like), so the exact per-service lines overlap.
  - Some connector labels (`2 Search`, `D Index`) sit on or near other dotted lines, and the Entra caption is crossed by the Sign in line.
  - A few connectors bend twice where a one-bend route would be possible.
- Source fidelity was checked against scenario.md: all stated components and links are present. Technical correctness of the real deployment was not verified.
