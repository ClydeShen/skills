# Companion account: Online store on AWS

Files: `diagram.drawio` (editable), `diagram.png` (render; an SVG and `diagram.render.json` sit beside it).

## Scope and pages
- One view, one page, left to right. Runtime calls are solid and auxiliary relationships are dashed (DNS, build and deploy, telemetry, secrets, replication). The page stays within every split limit: two line kinds, 1360 units wide, three outlines at most.
- Layout: shopper and edge services on the left, the primary region in the middle, CI/CD along the top, the standby region at the bottom.
- Checkout steps 1 to 5 are numbered on their connectors. Step 3 has two hops (checkout to payments, NAT to Stripe) and both carry "3".
- Left out: the three-AZ split (folded into the VPC title), security groups, and any business rules or data schemas (the source has none).

## Facts the source states and the drawing shows
All stated services, the six EKS services and their calls, the checkout steps, the Aurora global database (writer in eu-west-1, reader in us-east-1), Secrets Manager, GitHub Actions, ECR, Git, Argo CD and Datadog.

## Inferences
- The shopper's first hop, and the DNS lookup to Route 53, are drawn although the source only implies them.
- EventBridge, SQS, Secrets Manager and ECR are regional or global services with no stated placement. EventBridge, SQS and Secrets Manager sit in the primary region outside the VPC, as standard practice places them. **ECR is outside every boundary** because the source gives no region.
- The fulfilment worker, Argo CD and the Datadog agent are drawn inside the EKS cluster. The source says "same cluster" and "running in each cluster".
- The source says the worker reads the SQS queue, so its arrow points to SQS. I did not add a polling label.
- The secrets arrow starts at the EKS cluster edge. The source names no consumer, only that the Stripe and database secrets live in Secrets Manager.
- Argo CD syncs from the Git repository (its arrow points at Git). The source does not say which tool hosts the repository, so it is a plain box.
- The standby region is drawn once, with its title "warm standby, same stack", and shows only the difference: the Aurora reader. Its ALB, EKS, data services and Argo CD are not repeated.

## Not drawn, or drawn with a caveat
- **WAF:** the source lists it in the access chain. It is a web ACL attached to CloudFront, so I drew a dashed "inspects" line from CloudFront rather than putting it inline.
- **Route 53 failover:** the source says Route 53 "fails over to it on a health check". The target inside us-east-1 is not stated, so the dashed line ends on the standby region boundary. How CloudFront and the DNS record behave on failover is unspecified, and I did not guess it. The "resolves" line from Route 53 to CloudFront is likewise inferred.
- **Image pulls:** the source does not say how the clusters fetch images from ECR (or that they do), so no pull path is drawn.
- **Standby data path:** the standby reader is a read replica, so the drawing does not show a standby write path.
- **Datadog agents:** the source places them on every node, but node count is not given. One agent box stands for all of them.
- **Stripe:** the egress NAT gateway is drawn as the single NAT in the primary region's public subnets, which stands for the per-AZ gateways.
- **Icons:** there is no icon for Stripe, Datadog, Git repository or the EKS services. These are plain boxes. SQS uses the catalog's "Simple Queue Service" icon, captioned "SQS queue".

## Design risks (not drawn on the canvas)
- Card charging goes out through the NAT gateways. The source does not say whether there is one per AZ, so an AZ-level NAT failure cannot be assessed from it.
- The Aurora global database has a single writer in eu-west-1. If the primary region is lost, promoting the reader is a separate step the source does not describe.
- The Route 53 failover plus a warm standby has no stated detail for CloudFront or WAF in us-east-1.

## Checks run
- `finalize.mjs`: embedded the two vendor icons (GitHub Actions and Argo CD) and wrote draw.io's layout.
- `check-text.mjs`: clean.
- `check-layout.mjs`: 0 errors. One remaining item: **the page is taller than wide (1360 by 1438), so it will appear small in a document.** I kept it, because the standby region and the key cannot sit beside the primary region without exceeding 1400 units of width. A recommended split is a second "Operations" page (CI/CD, telemetry, secrets), which would let the main page be wider and shorter. I did not split because you asked for one diagram.
- `check-steps.mjs`: 0 items.
- `render.mjs`: rendered and I inspected the PNG after each fix. It read cleanly after the last round of fixes. Labels, outlines and captions were checked by eye as well as by the tools.
- Not done: opening the file in draw.io Desktop; the render used the pinned viewer only.
