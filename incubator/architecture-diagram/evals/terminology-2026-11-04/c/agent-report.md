# Companion account: online store on AWS

Deliverables: `diagram.drawio` (4 pages) and `diagram-1.png` to `diagram-4.png` (one per page).

## Pages and why
1. **Online store overview.** Shoppers, Route 53, CloudFront and WAF, both regions as one chain each (ALB, EKS, Aurora), Aurora replication, Route 53 failover. The eu-west-1 box links to page 2.
2. **eu-west-1 (primary): browse path.** Region, VPC, public and private subnets, EKS cluster, and storefront calling catalog, search and cart, each with its data service.
3. **eu-west-1 (primary): checkout.** Steps 1 to 5 numbered on one page, including Stripe through the NAT gateways and EventBridge to SQS to the fulfilment worker.
4. **Operations.** GitHub Actions, ECR, Git repository, Argo CD, Secrets Manager and Datadog. This is a separate concern, so it does not cross the runtime paths.

A single page would have needed three line kinds and more than three nested outlines. us-east-1 is not drawn in detail because the source says it has the same stack. The overview and the operations page show it.

## Assumptions and inferences
- **Stripe** is on the checkout page only. The overview omits it so the standby region is not given a Stripe path the source does not detail.
- **WAF** is shown beside CloudFront in a "Global edge" group with no connector. The source does not say how it attaches. Association with CloudFront is the usual setup.
- **Route 53 failover.** The source says it fails over to us-east-1 on a health check. I drew one dashed "failover" line to the us-east-1 ALB. It is unstated how normal traffic reaches CloudFront, or whether the CloudFront origin is a Route 53 failover record. CloudFront to the eu-west-1 ALB is drawn as the source states it.
- **Shopper to Route 53** is drawn as dashed DNS resolution. The source implies it and does not state it.
- **Secrets Manager** appears in each region, because a workload's secrets normally sit in its own region. The source does not say which service reads them. The line starts at the EKS cluster edge, with no port, and is labelled "secrets".
- **ECR** is outside both regions, because its location is not stated. The source has no ECR to cluster pull, so none is drawn.
- **Argo CD** pulls from Git ("sync", arrow from Argo CD). The source says it syncs a repository, so this is the reading of that.
- **Datadog agents** are one box per cluster, standing for agents on every node. The telemetry line comes from that box.
- **Public and private subnets** are labelled "3 AZs", not drawn as AZ boundaries. I did not draw zones, because redundancy is not the point of any page.
- **NAT gateways** (plural in the source) are one icon with a plural caption. The count is not given, and the layout checker flagged a stacked pair as overlapping.
- **Data services in private subnets.** The source puts Aurora, OpenSearch and ElastiCache in private subnets, so I drew them there. EventBridge and SQS are regional services and sit outside the VPC.
- **Step 3** is shown as "3 charge" (checkout to payments) and two "3 card" hops (payments to NAT gateways to Stripe). The source states one step.
- **Step order** follows the source list. I did not reorder it.
- **Catalog to Aurora** is drawn on the browse page only.
- **The fulfilment worker** is on the checkout page only. The browse page shows only the four browse services, not all six.
- **No icon exists** for Stripe, Datadog, OpenSearch Service (the `find-icon` lookup returned no match) or a generic Git repository, so those use the plain-box fallback. The services (storefront, catalog and so on) are also plain boxes.

## Design risks (not drawn on the canvas)
- **Failover writes.** Aurora in us-east-1 is a global-database reader. Checkout in the standby region cannot write orders until that cluster is promoted. The source does not describe promotion.
- **Failover and CloudFront.** The path from Route 53 failover to CloudFront origin selection is unresolved, as above.
- **Single points.** One Stripe dependency. NAT gateway placement per AZ is unknown.
- **Cross-region secrets and images.** ECR and secrets replication to us-east-1 are not described.

## Source deviations
None intended. Omitted from the overview: Stripe, operations and the six-service detail, which sit on pages 2 to 4.

## Checks performed
- `finalize.mjs`: vendor icons embedded, file in draw.io layout.
- `check-text.mjs`: clean.
- `check-layout.mjs`: 0 errors, 0 items. Earlier runs flagged an overlapping NAT stack, a replication-line detour and a title overlap. I fixed each through the layout, not by removing content.
- `check-steps.mjs` against `scenario.md`: 0 items.
- `render.mjs`: the draw.io viewer rendered all 4 PNGs, and I read each one. Page 1 has some empty space at the top. The Aurora captions there sit to the right so the replication line can run straight.
- Not verified: opening in draw.io Desktop or Lucidchart, and any check of the real deployment's correctness.
