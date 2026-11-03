# Companion account

Files: `diagram.drawio` (editable), `diagram.png` (rendered and inspected; also `diagram.svg`, `diagram.render.json`).

## Scope
Left-to-right view of the metadata decoupling flow: AWS (SQS, S3) to Azure (Logic Apps workflows, Cosmos DB, temporary Blob Storage). Steps 1-6 are numbered on the connectors in the order the architecture executes them. Dashed dotted line = the blob reference returned to the processing workflow (step 6).

## Left out of the drawing (disclosed)
- Business rules of SQS-Document-Cosmos (Published / Withdrawn / Replaced, destinations A/B/C, timestamp updates).
- Cosmos container names, unique keys and the sample item (only the database name `Exports` is shown).
- Error-handling table (S3 retries, alarms for dev and platform teams): no alarm component or caller is specified, so none is drawn.
- Requirement text (resilience when the cross-cloud link fails) is not drawn as a path.

## Unresolved / assumptions
- SQS instance count is TBD in the source. One SQS symbol is drawn; the source also mentions separate queues for documents, templates and bundles, so this is a simplification.
- The three listener workflows (document, template, bundle) are one symbol with a combined caption, not three instances.
- Source step 1 says the document is saved to S3 and an event is added to SQS at the same time, but names no publisher. No publisher is drawn, so the S3 write has no incoming arrow.
- The caller of the Processing workflow (the retrieval requester) is not stated and not drawn.
- Source steps 5 and 6 both mention saving to blob storage. I drew one save (6 save) and the returned reference (6 blob reference).
- No Azure or AWS region, network or resource-group boundaries were stated, so only cloud-level frames are drawn.
- The SQS listener is drawn as the arrow from SQS to the Azure workflows labelled `1 event`. Source does not say whether it polls; protocol and SQS authentication are not shown.

## Icon notes
- No exact Azure Blob Storage service icon exists in the catalog. I used the "Storage Accounts" icon with the caption "Temporary Blob Storage"; this is the closest exact catalog Azure storage entry, not a Blob-specific one.
- The Cosmos DB, Logic Apps, SQS and S3 icons are exact catalog matches.

## Design risks (not drawn)
- Single SQS-to-Azure ingestion path and one Cosmos DB account drawn; the source does not describe redundancy, so failure-domain behaviour is unknown.
- Retrieval (steps 4-6) still depends on S3, so only Cosmos-served requests survive a cross-cloud failure, as the requirements say.

## Checks performed
- `finalize.mjs`, `check-text.mjs`, `check-layout.mjs` run after the last layout edit. Text check clean. Layout check: 0 errors, 2 items remaining ("caption of sqs/s3 covers aws"): the 160-wide caption box touches the AWS frame's footprint estimate; in the render the captions sit inside the frame. I left them.
- Rendered with `render.mjs` and inspected the PNG (earlier iteration, before a final 30-unit frame height increase so the blob caption clears the frame edge); the final PNG was re-rendered but I did not re-read it after that last change.
- Not verified in draw.io Desktop. Source fidelity was checked by hand against scenario.md; technical plausibility of the real deployment was not.
