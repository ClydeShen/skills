# Companion account: Document Q&A on Azure

Files: `diagram.drawio` (editable), `diagram.png` and `diagram.svg` (rendered).

## Scope
- One logical view, left to right. It shows the chat path (Employees, web app, AI Search, Azure OpenAI, Cosmos DB), the ingestion path (Staff, Blob, Function, OpenAI, AI Search), shared Key Vault and Application Insights, and the Azure DevOps deployment.
- Everything is inside a dashed `westeurope` region, except people, Entra ID and DevOps. Entra ID is a global service and DevOps is SaaS.
- Steps 1 to 3 are numbered because the source numbers them: search, answer, store. Sign-in and the ingestion path are labelled but not numbered.
- The 1, 2, 3 numbers follow the source list. The chat path is drawn as a fork from the web app, so the numbers show intended order, not a call chain.
- Thick lines mark the chat path. The ingestion path is medium weight. Dashed thin lines are secrets (Key Vault), telemetry (Application Insights) and deployment.

## Unresolved assumptions
- The source says Staff "upload" to Blob and the upload "triggers" the Function. The trigger mechanism (Event Grid or a blob trigger) is not stated, so it is drawn as a plain "Trigger" connector with no intermediary.
- Sign-in is drawn as Employees to Entra ID only. The source does not say how the web app validates tokens, so no web app to Entra connector is drawn.
- Secrets access is shown as a dashed connector from each app to Key Vault. Whether it uses managed identity or Key Vault references is not stated.
- No networking (VNet integration, private endpoints), zones, redundancy or ingress path (front door or gateway) is stated, and none is drawn.
- Whether the web app's question-to-answer step is "OpenAI answers with passages" in one call is taken from the source wording. Call 2 is labelled "Answer".

## Icons
- Used exact catalog matches for App Services, Function Apps, Key Vaults, Application Insights, Cognitive Search (the AI Search icon), Azure OpenAI, Cosmos DB and Azure DevOps.
- Plain boxes are used for Microsoft Entra ID, Blob Storage container, Employees and Staff.
  - Entra ID: the catalog only has the older "Active Directory" icon. I did not borrow it.
  - Blob Storage: there is no Blob-specific entry. The Storage Accounts icon is a different resource.

## Design risks and known layout items
- The `check-layout` run still reports 12 items. They are intentional or accepted:
  - Forks drawn as shared trunks: Web to Search/OpenAI/Cosmos, Function to Search/OpenAI, and the Key Vault/Insights dashed lines.
  - One crossing between the dashed Web to Application Insights line and the Function to Key Vault line.
  - Both Deploy lines leave DevOps through one shared segment, and the Function deploy line is long.
  - I stopped here because the remaining fixes would split fan-outs into separate lines, which hurt readability more than the shared trunks do.
- The DevOps to Function line is long because DevOps targets two apps on opposite sides of the AI services. Moving the Function next to the web app would make the AI services cross.
- The page-level check "all connectors have the same weight" no longer applies, since the main path is now heavier.

## Source deviations
- None intentional. No source detail was excluded.
- The source says the Function and web app use the "same Azure OpenAI resource". This is drawn as one OpenAI node used by both, and it is not repeated on the canvas.

## Checks performed
- `finalize.mjs`, `check-text.mjs`, `check-layout.mjs` and `render.mjs` were run after each edit, and the PNG was inspected after each render.
- `check-steps.mjs` was not run.
- Desktop draw.io verification was not available. Rendering used the pinned viewer.
- Source fidelity was checked by tracing every sentence of `scenario.md` to a node or connector. This confirms the drawing matches the text. It does not confirm the real deployment is correct.
