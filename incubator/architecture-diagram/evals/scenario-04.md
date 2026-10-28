# Scenario 04 (owner-approved draft)

Approved by the owner on 2026-10-28, including G2 (no assumed private connectivity) and B1 drawn dashed under the query rule. Migrated from the requirements handoff on 2026-10-28; this file now owns the scenario.

**Name:** Event-driven document metadata sync from AWS to Azure, with on-demand retrieval.

**Input text given to the skill (Markdown kept):**

> ## Requirements
> Cosmos DB in the Azure integration layer decouples Azure from AWS. If the connection between the two clouds fails, the integration platform can still serve some requests, for example finding documents.
>
> ## High level flow
> 1. When a document is published or a template version is approved, it is saved into Amazon S3 and, at the same time, an event with its metadata is added to Amazon SQS. In Azure, an SQS listener is set up in the outbound Logic App workflows to listen for new events.
> 2. The SQS listener inserts or updates the metadata in Cosmos DB, in the database and container that match the record type.
> 3. During document or template retrieval, a processing workflow queries Cosmos DB.
> 4. The processing workflow extracts the S3 reference from the metadata and passes it to the retrieving workflow.
> 5. The retrieving workflow retrieves the document from S3 using the reference and saves it into temporary blob storage.
> 6. The retrieving workflow saves the retrieved document into temporary blob storage and sends its blob reference back to the processing workflow.
>
> ## Components
> | Component | Description |
> |--|--|
> | Azure Logic Apps workflows | Orchestrate the tasks |
> | Azure Blob Storage | Temporary storage with a retention policy |
> | Azure Cosmos DB | NoSQL database for document metadata |
>
> ## Workflows
> **SQS-Document-Cosmos** is triggered by the documents queue and upserts metadata by document number:
> - *Published*: upsert and set `isAvailableForCollection = true`.
> - *Withdrawn*: if not yet sent or collected, set `isAvailableForCollection = false`; otherwise upsert `status = withdrawn` and `isAvailableForCollection = true`.
> - *Replaced*: for destination A or B, hide the original if it has not been sent, otherwise upsert the replacement; for destination C, always upsert the replacement.
> - Always update the timestamp on upsert.
>
> **SQS-Template-Cosmos** uses a separate SQS queue for templates and persists metadata by template ID. **SQS-Bundle-Cosmos** uses a separate SQS queue for bundles and persists metadata by bundle ID.
>
> ## Cosmos DB
> Database `Exports`, containers `Documents` (unique key `/documentNumber`), `Bundles` (`/bundleId`) and `Templates` (`/templateId`). Sample item:
> `{"isAvailableForCollection": true, "isSendOrCollected": false, "retryCount": 0, "documentNumber": "DOC.2025", "document": {"status": "Published"}}`
>
> ## Error handling
> | Scenario | Handling |
> |--|--|
> | Connection to S3 fails | Default HTTP retry; after retries the workflow terminates and an alarm is raised for the dev team |
> | Document not found in S3 | Alarm for the dev team |
> | Cannot connect to SQS | Alarm for the platform team |
>
> ## Upstream configuration
> | System | Notes |
> |--|--|
> | AWS SQS | TBD: how many SQS instances? One per record type, or one for all? |
> | AWS S3 | Authentication: AWS Signature |

**Natural inconsistencies and gaps the skill must raise with a recommendation:**

| # | Content | Recommendation |
|---|---|---|
| E1 | The workflows section gives each record type its own SQS queue; the upstream table says the number of queues is TBD. | Read it as three queues, drawn as "SQS queue (x3: documents, templates, bundles)" with the listeners also x3. Ask the user to confirm. |
| E2 | Steps 5 and 6 both describe saving into temporary blob storage. | Merge into one step: retrieve from S3, save to temporary blob storage, return the blob reference. |
| G1 | No producer of the S3 objects and SQS events is named. | A plain box in AWS, "Document publishing service [Software system]"; ask the user for its name. |
| G2 | No network path from Azure to S3 and SQS is stated. | Do not assume private connectivity. Recommend public HTTPS endpoints with AWS Signature authentication; ask the user to confirm. |

**Content the skill lists as not drawn:** the status rules, the Cosmos DB container and key structure, the sample item, the error and alarm table.

**Expected elements:** AWS Cloud with the document publishing service (plain box), Amazon S3 (document store) and Amazon SQS (x3, stacked); an Azure boundary (light-blue, Azure logo) with a boundary "Outbound workflows" (bold title) holding the SQS listener workflows (x3), the processing workflow and the retrieving workflow, all Logic Apps; Azure Cosmos DB (metadata store); Azure Blob Storage (temporary, retention policy); a note on the decoupling purpose.

**Expected relationships:**

| Flow | # | From → to | Line | Label content |
|---|---|---|---|---|
| A, write | A1 | Publishing service → S3 | solid | Save document [HTTPS] |
| | A2 | Publishing service → SQS | solid | Publish metadata event [async, SQS] |
| | A3 | SQS listener → SQS | solid | Poll for new messages [SQS API/HTTPS], returns events |
| | A4 | SQS listener → Cosmos DB | solid | Upsert metadata by record ID |
| B, read | B1 | Processing workflow → Cosmos DB | dashed (query) | Query metadata, returns S3 reference |
| | B2 | Processing workflow → Retrieving workflow | solid | Pass S3 reference, returns blob reference |
| | B3 | Retrieving workflow → S3 | solid | Get document [HTTPS, AWS Signature] |
| | B4 | Retrieving workflow → Blob Storage | solid | Save document temporarily |

**Gates:** the five layout gates and C4 notation; flow colours A and B and `[async]` explained in the legend; polling drawn from listener to SQS; no status rules, schemas or alarms in the diagram.

**Information checklist for the blind readout (13 items, architectural only):** the AWS publishing service stores documents in S3 and publishes events to SQS; one queue per record type; Azure listeners poll SQS; listeners upsert metadata into Cosmos DB; Cosmos DB decouples the clouds so documents can still be found when the link fails; the processing workflow gets the S3 reference from Cosmos DB; it passes the reference to the retrieving workflow; the retrieving workflow gets the document from S3; the document goes to temporary blob storage with a retention policy; the blob reference returns to the processing workflow; write and read are separate paths; S3 access uses AWS Signature; the workflows are Logic Apps in the outbound workflows group.
