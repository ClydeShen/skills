# Companion account: Order and analytics platform on AWS

Files: `diagram.drawio` (editable), `diagram.png` and `diagram.svg` (render of the single page).

## Scope and pages

One page. The main flow, the analytics path and the supporting relationships (DNS, token check, secrets, telemetry, deployment) fit together with two line kinds (solid, dashed) at 1420 units wide, so there was no limit that required a split. Direction is left to right.
Left out: no business rules, schemas or sample data were in the source, so nothing was removed for that reason.

## What the source states, drawn as stated

- Shoppers, Route 53 (dashed DNS), WAF, CloudFront, S3 web app (CloudFront to S3 labelled "origin"), Cognito sign-in.
- API Gateway checks the Cognito token (dashed "token") and invokes the Lambda functions.
- Steps 1 to 3 are numbered on their connectors: orders writes DynamoDB and enqueues to SQS; fulfilment reads SQS, reads Aurora and publishes `OrderShipped` to EventBridge; EventBridge starts Step Functions, which notifies through SNS to shoppers and operators. The numbering follows the source order, which matches the execution logic.
- The Lambda functions use ElastiCache, secrets from Secrets Manager (which uses KMS), CloudWatch, X-Ray and the CodePipeline/CodeBuild deployment. The catalog function queries OpenSearch and recommendations calls Bedrock.
- Clickstream goes to Kinesis; an enrichment Lambda writes to the S3 data lake; Glue catalogs the lake and Athena queries it.

## Inferences (not stated in the source)

- **Shoppers to API Gateway, Cognito and Kinesis.** The source says the web app calls these. The browser app is drawn as the Shoppers actor, so the hops start there.
- **Region placement.** Only API Gateway is stated to be in `eu-west-1`. I placed every other service of the backend in that Region by standard practice (a workload's services share its Region). Route 53, WAF and CloudFront are global and sit outside it. The S3 web app bucket, CodePipeline and CodeBuild have no stated Region, so they sit outside the Region box.
- **Lambda group.** The source says "the Lambda functions" use the cache, secrets, logs, traces and deployment, so those connectors attach to one light-filled "AWS Lambda functions" boundary. The Lambda functions as drawn are five: orders, fulfilment, catalog, recommendations and clickstream enrichment. Catalog, recommendations and enrichment are named only by role in the source.
- **API Gateway to the Lambda group.** The source says it invokes "Lambda functions" without naming which, so the connector ends on the group edge, not on one function. The fulfilment function is shown reading the queue. How the catalog, recommendations and enrichment functions are triggered is not stated. Kinesis to enrichment is drawn as the stream being read.
- **Cache use.** The source says all Lambda functions cache product lookups; the single "caches" connector from the group does the same. That the enrichment function really needs the cache is doubtful.
- **Deployment.** The source names CodePipeline and CodeBuild together. I drew CodePipeline to CodeBuild ("builds") and CodeBuild to the Lambda group ("deploys"). Which one performs the deploy step is not stated.
- **Shoppers appears twice** (origin and notification recipient) to avoid a return line across the whole diagram. Both are the same actor.
- **Glue and Athena.** Glue to the lake (dashed "catalogs") and Athena to the lake ("queries") are direct, though Athena normally reads through the Glue catalog.

## Icons

- All icons are exact AWS catalog matches. Amazon S3 has no service icon in the catalog, only the Bucket resource icon, so the two S3 elements use it, with captions "S3 web app" and "S3 data lake".
- WAF is drawn on the path between Shoppers and CloudFront, though in practice it is attached to CloudFront.
- The Region boundary uses the native AWS style. No AWS Cloud outline is drawn because it would add no distinction.

## Design risks (not drawn, not corrected)

- No zones or standby are shown. The source gives no zone or multi-Region detail, so single points of failure cannot be judged.
- The deploy connector enters the Lambda group from outside the Region, which depends on the unstated Region of the pipeline.
- Cognito, Aurora, OpenSearch, ElastiCache, Kinesis and Redis network attachments (VPC, subnets, endpoints) are not stated and are not drawn.
- Secrets Manager and KMS as separate boxes assume the usual key use. Which keys protect which secrets or data is not stated.

## Checks run

- `finalize.mjs`, `check-text.mjs`, `check-layout.mjs` (0 errors, 0 items to check), `check-steps.mjs` (0 items). `render.mjs` ran with the pinned draw.io viewer and I read the PNG after each change.
- Not done: no check in Desktop draw.io, and no official-documentation check beyond what the catalog gives.
- Iterations fixed an overlapping Aurora caption, labels on outlines, and an over-long key. The final layout report is empty, which does not prove the layout reads well; I judged that from the image.
