# Companion account: Document Q&A on Azure

Files: `diagram.drawio` (editable, finalized), `diagram.png` (rendered with the pinned draw.io viewer and inspected). `diagram.svg` and `diagram.render.json` are render by-products.

## Scope
Logical/flow view, left to right. Question path (Employees, chat web app, Search / OpenAI / Cosmos DB) is heavy and numbered 1 to 3 from the source list. Ingestion (Staff, Blob Storage, function, OpenAI, Search) runs right to left. Key Vault, Application Insights and Azure DevOps are drawn as dotted auxiliary lines, explained in the key.

## Inferred or unspecified (not stated in scenario.md)
- Employees reaching the web app, and Staff uploading to Blob Storage, are implied initiators. The sign-in connector goes Employees to Entra ID; token flow to the web app is not drawn.
- Only the web app's region is stated. I placed Search, OpenAI, Cosmos DB, Blob Storage, the function, Key Vault and Application Insights inside `westeurope` as standard practice for one workload. This is an inference. Azure OpenAI availability in that region is not verified.
- Entra ID and Azure DevOps are drawn outside the region (global/SaaS).
- The "Cognitive Search" catalog icon is used for Azure AI Search (the former product name). The "Entra Identity" icon is used for Microsoft Entra ID. Neither was checked against Microsoft's current branding.
- Blob-to-function is labelled "trigger" as the source says an upload triggers it. The mechanism (Event Grid or blob trigger) is not specified and not drawn.
- Not drawn because not stated: VNets, private endpoints, managed identities, the function's hosting plan, auth method for Key Vault reads.

## Source deviations
- Steps are numbered 1 to 3 as in the source, following the question flow. Source step 2 sends "question and passages" to OpenAI, so the label says that.
- Entra ID sign-in is unnumbered (not a numbered source step).

## Design risks (not drawn)
- Single region: no standby or failover shown. Search, OpenAI, Cosmos DB and Key Vault are each a single point on the question path.
- Secrets and telemetry paths are drawn for the two compute apps only, as stated.

## Checks performed
- `finalize.mjs`, `check-text.mjs`: clean. `check-steps.mjs`: no unnumbered stated steps.
- `check-layout.mjs`: 0 errors, 5 items remain (e5, e10 to e13: "connector runs through caption of web/fn"). I judge these false positives: the web app and function captions are set beside the icon (right-below and left-below), and the PNG shows no connector crossing them. The checker assumes captions sit directly below.
- PNG inspected after each iteration. Earlier versions had dotted lines that enclosed the diagram as a frame; I moved Key Vault and Application Insights to a bottom lane and offset the ports. Some dotted lines still run near each other at the web app and function, but they no longer line up into a frame.
- Desktop draw.io was not available; the render used the pinned viewer only.
