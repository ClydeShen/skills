# Companion account: Document Q&A on Azure

Files: `diagram.drawio` (editable), `diagram.png`, `diagram.svg` (render output).

## Scope
A logical, left-to-right view of the one scenario in `scenario.md`.
- The question path runs through the middle row: Employees, chat web app, then Azure OpenAI. Heavy lines mark it.
- Numbered steps 1 to 3 are the source's list: search, answer, store.
- The upload and indexing path runs right to left: Staff, Blob Storage, Function, then OpenAI and AI Search.
- Key Vault, Application Insights and the DevOps pipeline are thin dashed lines.
- Only `westeurope` is drawn as a boundary. Employees, Staff, Entra ID and Azure DevOps sit outside it.

## Source-stated vs inferred
- **Stated:** every service and every connector, plus the region. The region is stated for the web app only.
- **Inferred:**
  - Users and Staff as the origins of their flows.
  - Entra ID, Key Vault, Application Insights and DevOps placed outside or inside the region.
  - A `sign in` line from Employees to Entra ID.
  - The Function triggered by Blob Storage ("each upload triggers"), drawn as `trigger`.
  - The `embed` and `index` labels.

## Unresolved assumptions
- The source does not say where Entra ID, Azure DevOps or the other services are deployed. Only the web app is placed in `westeurope`. The other PaaS services are drawn inside it, which is an assumption.
- Entra ID, DevOps and the human actors are drawn outside the region as global or external. This was my choice.
- No networking is drawn (VNet integration, private endpoints, exposure). The source has none.
- No authentication line is drawn from the web app to Entra ID, because the source does not state how the token is validated.
- The Function's hosting plan and trigger mechanism (Event Grid or blob trigger) are unspecified. I drew `trigger` only.
- The secrets, telemetry and deploy lines are summarised in the key. I did not assume which secrets are read.

## Icons
- Entra ID and Azure AI Search had no exact catalog icon, so they are plain boxes. The generic `Search` icon is not AI Search.
- Blob Storage uses the Storage Accounts icon, because no blob-specific icon exists. Its caption names the Blob service.
- The Function uses the Function Apps icon.

## Design risks (not drawn)
- Everything is in one region, so a regional outage stops both flows.
- One Azure OpenAI resource serves both Q&A and embedding, so they share its quota.
- Cosmos DB, Search and OpenAI are single instances with no redundancy shown.

## Source deviations
- The numbering covers only the three stated query steps. Ingestion steps are labeled but not numbered, because the source does not give them an order.

## Checks performed
- `finalize.mjs`: ran after each edit.
- `check-text.mjs`: clean.
- `check-layout.mjs`: 0 errors. 5 items remain, and I left them in place:
  - Connectors `e3`, `a1` and `d1` are reported as running through the web app's caption box.
  - Connectors `a2` and `d2` are reported as running through the function's caption box.
  - I moved the web caption to the right of its icon and the function caption to the left. The lines now pass beside the visible text, though the checker still counts the wide 160-unit caption box. I judged this on the rendered PNG.
- Render: `render.mjs` produced the PNG, and I inspected it. I did not open the file in draw.io Desktop.
