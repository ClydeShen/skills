# Companion account: Document Q&A on Azure

Files: `diagram.drawio` (editable, 3 pages), `diagram-1.png`, `diagram-2.png`, `diagram-3.png`.

## Pages and why
1. **Question answering**: sign-in, the user's question and the three numbered steps from the source (search, generate, store).
2. **Document ingestion**: upload, trigger, embeddings and index write.
3. **Operations**: Azure DevOps deployment, Key Vault secrets and Application Insights telemetry.

I split by flow and concern because one page would have mixed two reading directions and put three kinds of dashed line across the runtime path. Every page keeps the same names and symbols. Pages 1 and 2 use solid lines only. Page 3 uses dashed lines only, each labelled with one word, so none needs a key.

## Scope and source fidelity
All source elements and relationships are drawn. Steps 1 to 3 are numbered in the source's order. That order matches the logical order (retrieve, then generate, then store).

## Inferences and unresolved points
- **Region placement.** The source places only the web app in `westeurope`. I drew the other Azure services (AI Search, OpenAI, Cosmos DB, Blob Storage, Function, Key Vault, Application Insights) in the same region, since a workload's services are normally co-located. This is an inference, and Azure OpenAI and Cosmos DB may be elsewhere.
- **Outside the region.** Entra ID is global, and Azure DevOps is a SaaS service. Both are drawn outside it.
- **Sign-in.** The source says employees sign in with Entra ID. It does not say how the web app validates the token, so I drew only the Employees to Entra ID hop and the Employees to web app request. The page is unnumbered there because the source does not number it.
- **Blob trigger.** The source says each upload triggers the function. The mechanism (blob trigger or Event Grid) is not stated, so the line is labelled "Triggers".
- **Secrets and telemetry.** Both are drawn as arrows from the consumer (web app, function) to Key Vault and Application Insights. The source does not give the mechanism.
- **Ingestion function.** "Splits the document" is internal to the function and is not drawn separately.
- **Not drawn.** There is no network detail (VNet, private endpoints), no managed identity and no auth method for service-to-service calls. The source gives none.
- **Icon choices.** The "Cognitive Search" icon is used for AI Search (same Azure icon, older name). "Storage Container" is used for the Blob container, and "Entra Identity" for Entra ID. The App Service and Function icons are the draw.io compute ones.

## Design risks
- Page 3 has dashed lines running around Key Vault and Application Insights. They stay straight and do not close into a shape, but the layout is a compromise: it avoids crossings while letting DevOps reach both apps.
- Several connectors use two bends, such as the fan-out to Search and Cosmos DB and the secrets and telemetry routes. The layout check suggests one-bend alternatives, which would leave from a caption side or add crossings. I kept the two-bend routes on purpose.

## Checks performed
- `finalize.mjs`: done. No vendor artwork was embedded because the icons are draw.io built-ins.
- `check-text.mjs`: clean.
- `check-layout.mjs`: 0 errors and 7 items. All 7 are the two-bend hints above.
- `check-steps.mjs`: not run. The source's three steps are numbered on page 1 by inspection.
- Rendered all three pages with the pinned draw.io viewer and viewed each PNG. Labels, captions and routes were readable, with no collisions.
- Not verified: opening in the draw.io Desktop app, and technical correctness of the real deployment.
