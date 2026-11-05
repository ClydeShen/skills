# Companion account: Online store on AWS

Files: `diagram.drawio` (editable), `diagram.png` (render), `diagram.svg`.

## Scope and pages
One page, "Online store on AWS". It has two line kinds (solid, dashed), so no limit forced a split. The page is 1335 by 1475 units, which is taller than wide and below the 16:9 to 3:2 guideline. A second page for operations (CI/CD, secrets, telemetry) would shorten it, but you asked for one diagram.

Left out: nothing was struck out in the source. I did not draw the services' internal business logic, the individual AZs (folded into the VPC and subnet titles), or the standby's copy of the primary stack (summarised by its title).

## Reading of the source
- Facts drawn as stated: the Route 53, CloudFront, WAF and ALB entry; the six EKS services and their calls; the data stores; the five checkout steps; Secrets Manager; the GitHub Actions to ECR and Git to Argo CD chain; Datadog agents; Aurora global replication from writer (eu-west-1) to reader (us-east-1).
- Inferred, not stated:
  - The Shopper to CloudFront hop (the source only implies it).
  - Placing ECR, Secrets Manager, EventBridge and SQS in the region but outside the VPC, as regional services.
  - The Secrets Manager connector ends on the EKS boundary, because the source does not say which workload reads which secret.
  - The WAF to CloudFront "protects" link (WAF is shown as attached to CloudFront).
  - The standby is drawn once, as "same stack", showing only the Aurora reader, which the source places there.
- Not drawn because the source does not give it:
  - Route 53 resolving to CloudFront.
  - Clusters pulling images from ECR.
  - Any ALB to target-group detail.
  - Whether the Git repository is on GitHub (it is a plain box).
  - Static versus dynamic content; I dropped a "dynamic" label on the CloudFront to ALB line because no static origin is stated.
- The checkout step 3 spans three connectors: Checkout to Payments, Payments to NAT, NAT to Stripe.
- Stripe, Datadog, GitHub Actions, the Git repository and the shoppers are outside AWS. The six services, the fulfilment worker, the Datadog agent, Datadog, Stripe and the Git repository are plain boxes, because the icon lookup has no exact match (or, for the services, because a Kubernetes icon would imply resources the source does not state).

## Doubts and design risks (not drawn as paths)
- **Failover.** The source says Route 53 fails over to us-east-1 on a health check, but shoppers also reach the site through CloudFront. DNS failover only works if the record targets something other than the single CloudFront distribution, such as a second distribution or an origin group. The source does not say which. I drew one dashed "failover" line from Route 53 to the standby region boundary. Please confirm the mechanism.
- **Standby writes.** Aurora has a reader only in us-east-1. A failover needs a promotion of the global database, and a warm standby with "the same stack" needs a rule for that. The source says nothing about it.
- **External dependencies.** Stripe and Datadog are each one external service, drawn once. The source does not say how the standby reaches them.
- **Secrets.** The caller of Secrets Manager is unknown, so the line ends on the cluster boundary.

## Checks run
- `finalize.mjs`: passed, 2 vendor icons embedded.
- `check-text.mjs`: clean.
- `check-layout.mjs`: 0 errors, 2 items left:
  - The page is taller than wide (see above).
  - Connector f2 (Storefront to Cart) bends twice. A one-bend route would need Storefront's top port, which Storefront to Search already uses. I kept the two-bend route to avoid a shared segment.
- `check-steps.mjs` against `scenario.md`: 0 unnumbered steps.
- `render.mjs`: rendered, and I read the PNG after each fix. The flagged label and caption collisions are fixed.
- Not done: no check in draw.io Desktop, and no test that the file imports into Lucidchart.

## Layout notes
- Short labels on the vertical step connectors (2 Reserve, 3 Pay) sit on 40-unit gaps. They read in the render, but the gaps are tight.
- The "replication" label sits outside the primary region, at the page's right edge, so the page is slightly wider than the 1400 unit target.
- Key is at lower centre-right, not the corner, because the standby region takes the corner.
