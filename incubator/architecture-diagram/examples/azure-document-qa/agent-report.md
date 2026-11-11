# Companion account: Document Q&A on Azure

Files: `diagram.drawio` (editable), `diagram.png` (plus `diagram.svg` and `diagram.render.json` from the renderer).

## Scope and pages

One page, "Document Q&A runtime", read left to right. It has no split: it is 1400 units wide, uses two line kinds (solid main flow, dashed supporting flow) and nests one outline.
The Microsoft Azure outline carries "region westeurope" in its title. The source places only the web app in that region. I put the other Azure resources there too, because they serve that workload (inference, see below).
Outside the outline: Employees, Staff, Microsoft Entra ID and Azure DevOps. They are people or services that are not regional resources.
Steps 1 to 3 (search, answer, store) are numbered as in the source list. The ingestion path has no stated order, so it is labelled but not numbered.

## Source facts versus inference

- **Stated in the source:** all services and flows in the diagram, and the region of the web app.
- **Inferred:**
  - Employees send questions to the web app. The source implies this hop; I drew it as the start of the main path.
  - Employees sign in against Entra ID (dashed "sign-in"). The source does not say which hop does the authentication.
  - The Azure OpenAI, AI Search, Cosmos DB, Blob Storage, Key Vault, Application Insights and Function resources all sit in westeurope.
  - Staff upload directly to Blob Storage, with no intermediate component.
  - Blob Storage triggers the Function. The source says "each upload triggers an Azure Function" but not by which mechanism (for example Event Grid or a blob trigger), so I drew one connector labelled "triggers".
  - "Write index" and "embed" are my labels for the Function's two calls.
  - Secrets are read from Key Vault by the web app and the function, so arrows point from the vault to them.
  - Telemetry points from the web app and the function to Application Insights.
- **Not specified, so not drawn:** networking (VNet integration, private endpoints), authentication method between services (keys or managed identity), SKUs, zones and redundancy, the pipeline's stages and trigger, and which Entra ID tenant or app registration is used.

## Left out

Business rules, document formats, chunking and embedding details, and the content of the stored conversations.

## Deviations and design risks (not drawn on the canvas)

- Every resource shown is a single instance in a single region, so a westeurope outage would stop both flows. The source states no zone or region redundancy.
- The Function and the web app both call the same Azure OpenAI resource. Embedding and chat traffic would compete for its quota, because the source says it is "the same Azure OpenAI resource".
- Whether the web app validates Entra ID tokens, or App Service authentication does, is not stated.

## Icons

- Icons come from `find-icon.mjs`. Azure DevOps, Cosmos DB and OpenAI use the catalog's current product artwork.
- "AI Search" uses the catalog's "Cognitive Search" icon, which is the former name of Azure AI Search.
- "Microsoft Entra ID" uses the "Entra Identity" icon. It is the closest Entra mark, but I could not confirm that it is the Entra ID product icon rather than a generic Entra mark.
- Employees and Staff are plain boxes, because the catalog has no person icon.
- The Entra ID caption sits above its icon so that the sign-in arrow can enter from below.

## Checks run

- `finalize.mjs` ran after each edit.
- `check-text.mjs` passes.
- `check-layout.mjs`: 0 errors, 7 items to check. I kept them because only a change of meaning would clear them:
  - The "upload" label touches the Azure outline on the Staff to Blob Storage line, which crosses it once.
  - The two telemetry lines run toward Application Insights close to its caption, and their labels sit near each other.
  - The telemetry lines and the Cosmos DB line use two bends where the checker finds a one-bend route. A one-bend route would need the web app's top or bottom ports, which carry the secrets, telemetry and deploy lines.
- `check-steps.mjs` reported 0 items to check.
- `render.mjs` produced `diagram.png`, and I inspected it. The main path (Employees, web app, AI Search, Azure OpenAI, Cosmos DB), the ingestion path (Staff, Blob Storage, Function, Azure OpenAI and AI Search) and the dashed supporting lines are all readable.
- Not verified: opening the file in draw.io Desktop. The render used the pinned draw.io viewer only.

## Recommendation

A second page showing deployment detail (networking, identity and managed identities, pipeline stages) would fit once the source states them. This page is the logical and flow view only.
