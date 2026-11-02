# Diagram scope and review

The editable diagram follows `scenario.md` as a deployment overview: one unnamed AWS Region, two Availability Zones, two illustrated EC2 web instances in one Auto Scaling group, two illustrated application instances, ElastiCache and RDS primary in AZ-1, and RDS standby in AZ-2. The instance counts are illustrated counts, not scaling limits.

Route 53 and CloudFront sit outside the Region. S3, DynamoDB, SES, SNS, CloudWatch Alarms and ELB sit inside the Region but outside the AZ boundaries. The light Application deployment grouping is a logical scope, not a VPC or a security boundary. No VPC, subnet, exposure, listener, protocol or security configuration is inferred.

## Unresolved source relationships

- Web to application: the source explicitly says this connection is not drawn and only implied by the three-tier terminology. No operational connector is asserted. End-to-end dynamic application processing therefore remains unconfirmed.
- ElastiCache to RDS primary: the source shows a relationship without identifying its operation or caching strategy. It is retained here, rather than presented as an established cache-to-database runtime call.
- Standby side to S3: the source shows a relationship without an identified purpose. It is retained here; backup, export or replication is not asserted.
- DynamoDB, SES, SNS and CloudWatch: caller or monitored resource is unspecified. Visible ports on the logical application deployment retain these relationships at the source's scope. DynamoDB read/write is one initiating relationship with ordinary responses folded into it; the source's bidirectionality does not establish a DynamoDB-initiated application call.
- RDS replication mode and failover behavior remain unspecified. The diagram does not claim synchronous replication or managed failover.

## Rendering choices and source deviations

- A user/viewer is inferred to make both application and media entry visible. DNS resolution is separate from the user-to-ELB traffic path; Route 53 does not forward application payloads.
- The source's S3-to-CloudFront content relationship is drawn as a CloudFront-to-S3 origin retrieval request, with ordinary content responses folded into the request. Users access CloudFront at `media.yourApp.com`; no DNS record for that domain is invented.
- S3 is fully outside the zones, resolving the source's overlapping S3 placement in accordance with its explicit regional-service qualification.
- Supporting services remain within the single Region, rather than outside AWS or assigned to one AZ. The application deployment grouping supplies logical endpoint scope only.
- No direct CloudWatch-to-SNS connector, application Auto Scaling group, internal load balancer, read traffic to the standby, or recommended infrastructure is added.
- Unspecified schemas, configuration settings, business-rule details and unrelated alerting are omitted. SNS email delivery and CloudWatch Alarms remain in scope.

## Design risk

Web instances, application instances and cache are all illustrated only in AZ-1. Loss of that AZ can stop application processing despite the RDS standby in AZ-2. The diagram preserves this asymmetry. The unspecified web-to-application connection prevents verification of a complete operational request path.

## Checks performed

- Skill text checker passed.
- Skill layout checker passed with zero errors and zero warnings.
- XML parsing, unique IDs, parent references and connector endpoints validated.
- All AWS symbol identities and colors use the bundled draw.io 32.6.1 catalog. No uncertain vendor capability is added.
- Source review checked instances, zone membership, ingress, DNS, cache/database access, replication, object storage, media delivery and all four supporting services. No explicit failure flow is supplied by the scenario.
- PNG export was attempted using the skill renderer. The environment rejected its local server with `listen EPERM: operation not permitted 127.0.0.1`. A subsequent file-based headless Chrome attempt exited with code 134 before producing an image.
- No PNG was produced or visually inspected. Offline draw.io Desktop rendering was unavailable. Geometry checks do not establish visual quality or deployment correctness.

Open `diagram-export.html` and follow its link to view the editable diagram in diagrams.net and export a PNG.
