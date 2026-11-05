# Companion account: Online store on AWS

Files: `diagram.drawio` (editable), `diagram.png` (render), plus `diagram.svg` and `diagram.render.json` from the renderer.

## Scope and pages
- One page. The layout checker found no reason to split: two line kinds, no more than three outlines (Region, VPC, subnet) and under 1400 units wide.
- Emphasis is deployment plus runtime flow, left to right. The main path is Shoppers, CloudFront, ALB, storefront, then the services and data. Checkout steps 1 to 5 are numbered.
- Build, DNS, secrets, telemetry, replication and failover are dashed lines in the same view.
- Left out: business rules and sample data (none in the source).

## Drawn as the source states
- Route 53, CloudFront and WAF sit outside the regions. `eu-west-1` holds the VPC, with public subnets (ALB, NAT gateways) and private subnets (EKS and data).
- The six services are drawn inside the EKS cluster. The call graph follows the source.
- Aurora is a global database: writer in `eu-west-1`, reader in the `us-east-1` standby, joined by a dashed replication line.
- Stripe is reached from payments through the NAT gateways.
- EventBridge delivers to SQS, and the fulfilment worker reads the queue.
- GitHub Actions pushes to ECR and updates the Git repository; Argo CD syncs from that repository. Datadog gets telemetry and Secrets Manager gets a secrets line, both from the cluster.

## Inferences (not stated in the source)
- The shopper to CloudFront hop is implied. Its protocol is not stated and none is shown.
- ECR, EventBridge, SQS and Secrets Manager are placed in `eu-west-1` outside the VPC, because they are regional services used by that workload. The source gives no region for them.
- The Secrets Manager and Datadog lines attach to the EKS cluster boundary, not to a named service, because the source does not say which services read the secrets. A Git repository icon was not used because no hosting product is named; it is a plain box.
- Standby: drawn once with the label "same stack". Only the Aurora reader is drawn inside it, because that is the one difference the source names. Failover is a dashed line from Route 53 to the standby boundary.
- The WAF line (CloudFront to WAF, "Filter") is an association I drew. WAF is not a hop in the request path.
- "Dynamic" on CloudFront to ALB is the source's "dynamic requests"; static delivery is not drawn.
- NAT gateways are shown as a stack of three because the source says gateways in each of the three zones. Three is the zone count, not a stated gateway count.

## Doubts and design risks (not changed on the canvas)
- **Failover design:** the source has CloudFront in front of the ALB and also says Route 53 fails over on a health check. DNS failover only works if the record Route 53 serves leads to the regional endpoints. With CloudFront in front, the usual mechanism is a CloudFront origin group, or a CloudFront origin that is itself a Route 53 failover record. The source does not say which one is used, so I drew only the stated Route 53 to standby relation and did not draw a standby-to-CloudFront path. This needs your decision before it is treated as a working design.
- **Warm standby:** Aurora Global Database replicates asynchronously, and the reader cannot take writes until it is promoted. The source does not describe promotion. The standby also uses an unspecified path for the other data stores (OpenSearch, ElastiCache and SQS are regional, with no cross-region replication stated).
- **Subnets and zones:** a subnet belongs to one zone. I drew one "Public subnets" band and one "Private subnets" band, with "3 availability zones" in the VPC title, to fold the zone level. It is not a literal subnet-per-zone view.
- **Single points:** payments is the only path to Stripe. Stripe is outside the region and all of its traffic goes through NAT.
- **EventBridge to SQS:** the source says "delivers", which I drew as a plain arrow. The EventBridge rule and target are not shown.
- **Secrets, image pull and Argo CD:** I did not draw ECR to the cluster (image pull), because the source does not state it. Argo CD to Git is drawn as "Sync" with the arrow from Argo CD, because Argo CD pulls.

## Layout reports I kept
- `Page is taller than wide` (1370 by 1650): the standby region, the operations lane and the key sit below the primary region. I did not shrink text. A split into runtime and operations pages would give a wider page, but the checker's limits for splitting are not met.
- `nat1/nat2/nat3 overlap`: this is the intentional stacked icon for a fleet.
- The key is in the bottom row beside the standby region, not at the far lower-right corner, because the standby region occupies that corner.
- The Telemetry line has no crossings. The checker still lists some lines that pass boundary outlines; every such crossing is a real boundary crossing (e.g. CloudFront into the Region).

## Checks run
- `finalize.mjs`: ran; embedded 2 vendor icons (GitHub Actions, Argo CD) and wrote the draw.io file layout.
- `check-text.mjs`: clean.
- `check-layout.mjs`: 0 errors; 4 items kept above.
- `check-steps.mjs ../../../scenario.md`: reported "0 items to check" (it did not treat the source's numbered list as stated steps). I numbered steps 1 to 5 by hand, in the order the drawn flow executes them, which matches the source list. Step 3 continues through payments to NAT to Stripe; only the first hop carries the number.
- `render.mjs`: ran and I read the PNG twice (before and after fixing overlapping labels). I did not check the file in desktop draw.io.
- Icons: exact catalog matches for Route 53, CloudFront, WAF, ALB, NAT Gateway, EKS, Aurora, ElastiCache, OpenSearch Service, EventBridge, SQS, Secrets Manager, ECR, Users, Argo CD and GitHub Actions. Plain boxes for Stripe, Datadog and the Git repository (no catalog icon). Aurora uses the generic Aurora icon; no PostgreSQL-specific icon exists, so the caption says "PostgreSQL".

Source fidelity and technical plausibility are separate: the diagram matches the source, but the failover design above is not shown to work.
