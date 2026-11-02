# Companion account: Document Q&A on Azure

Files: `diagram.drawio` (editable), `diagram.png` (rendered), `diagram.svg`, `diagram.render.json`.

## Scope
A left-to-right logical and flow view of `scenario.md`. Two flows are drawn.
- **Question flow (numbered 1 to 5, heavier lines):** an employee signs in with Entra ID, then asks the web app. The web app searches AI Search, sends the question and passages to Azure OpenAI, and stores the chat in Cosmos DB.
- **Ingestion flow:** staff upload to Blob Storage, which triggers the Function. The Function calls Azure OpenAI for embeddings and writes them to AI Search.
- **Shared services (thin dashed lines):** Key Vault (secrets), Application Insights (telemetry) and Azure DevOps (deploy).

All Azure PaaS resources sit in a `westeurope` region outline. Entra ID, Azure DevOps and the people sit outside it. No virtual network, subnet, resource group or zone is drawn, because the source gives none.

## Source fidelity and deviations
- **Numbering:** only the question flow is numbered, because the source lists it as steps. Sign in (1) and the question (2) are my reading of the sequence, not source steps. The ingestion flow is unnumbered.
- **Order of storing the chat:** the source lists "stores the conversation" as step 3. I drew it as step 5, after the answer is generated, because a conversation can only be stored once the answer exists. This is an inference.
- **Labels I added:**
  - `question + passages` is the source's wording for what goes to OpenAI.
  - `store chat` is shorthand for storing the conversation.
  - `trigger` and `upload` come from the source.
  - `embeddings` and `index` are shorthand for the Function's calls to OpenAI and AI Search.
- **Entra ID placement:** it is drawn outside the region as a global service. The source does not say which service validates the sign-in token. The connector therefore shows only employee to Entra ID, not the web app validating the token.
- **Azure DevOps placement:** it is drawn outside the region as a SaaS control service. The source says it deploys both apps and nothing more.
- **Dashed lines:** these are a visual choice for auxiliary relationships (secrets, telemetry, deploy). The source says "read secrets" and "send telemetry". The arrows run from the app to Key Vault and to Application Insights.
- **Labels in the source but not on the canvas:** none dropped.
- **Names:** the labels say "Azure Function" and "Chat web app (App Service)" where the source uses the generic terms.

## Unspecified, not drawn
- Authentication protocol and token validation path.
- Network isolation, such as private endpoints or VNet integration.
- Whether Key Vault is read through managed identity.
- The queue or event mechanism behind the blob trigger. A direct "trigger" connector is drawn, as the source says an upload triggers the Function.
- Whether the Function and the web app share an App Service plan.
- Counts or scaling.

## Icons
Exact Azure icons from `find-icon.mjs` were used for every service (Entra Identity, App Services, Cognitive Search, OpenAI, Cosmos DB, Storage Accounts, Function Apps, Key Vaults, Application Insights, DevOps, Users).
- "Azure AI Search" uses the catalog's "Cognitive Search" icon, the catalog's only entry for it.
- "Blob Storage" uses the Storage Accounts icon. No blob-container icon matched.

## Checks performed
- `finalize.mjs`, `check-text.mjs` and `check-layout.mjs` were run after every edit. The text check is clean. The layout check reports 0 errors and 6 items to check:
  1. The title and the DevOps icon share a band. They do not overlap visually.
  2. The `2 question` label crosses the region outline. This is a required crossing.
  3. The `1 sign in` label sits on a bend.
  4. The `1 sign in` line grazes the Entra caption.
  5. The `1 sign in` line has a 36-unit jog.
  6. The `1 sign in` line has two bends where one would do. I did not fix items 3 to 6 and left that connector as drawn.
- The PNG was rendered and inspected after each iteration.
  - Remaining visual issues: the index and embeddings lines pass close to the Azure Function caption, and the sign-in line is slightly crooked beside the Entra caption.
  - Other crossings are the DevOps and secrets lines crossing the region outline. All are required crossings.
- Verification was with the pinned draw.io viewer only. I did not open the file in draw.io Desktop.

## Design risks
- The diagonal fan-out from the web app is readable but not orthogonal. Straight diagonal lines were chosen over detours.
- Both the web app and the Function connect to Key Vault, Application Insights and DevOps. That is six dashed lines in the upper half of the diagram, which is busy.
