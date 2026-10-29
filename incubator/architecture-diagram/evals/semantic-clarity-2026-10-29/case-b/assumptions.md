# Scope and assumptions

This new high-level diagram uses only the [text source](../../three-tier-supporting-2026-10-29/source.md) and current architecture-diagram skill. It represents one Region, AZ-1 compute/cache/primary placement, AZ-2 standby placement, the two illustrated instances in each compute tier, web Auto Scaling, regional S3, global DNS/CDN, and every supporting service. Dashed enclosures denote logical groups, not networks. The application deployment enclosure retains the source's service interactions at deployment scope; it does not identify a caller or introduce a VPC.

Three source relationships are preserved here rather than asserted as working paths: Web → App is only inferred from tier names; ElastiCache → RDS has no defined operation or cache strategy; standby-side → S3 has no identified purpose. No backup, export, automatic cache fetch, internal balancer or routing mechanism is inferred. These omissions are intentional scope decisions, not claims that the source lacks the connections.

DNS resolves the ELB endpoint; it does not forward application payloads. CloudFront's arrow points to its S3 origin for retrieval, replacing the source's content-direction S3 → CloudFront representation; static delivery remains separately directed to the media domain. No DNS record for that media domain is invented. The ELB-to-web group arrow represents traffic distribution, not simultaneous delivery to both instances.

DynamoDB read/write and results use separate directions to retain the source's explicitly bidirectional relationship. SES and SNS originate at deployment scope because their callers are unknown. Monitoring is a dashed association to CloudWatch Alarms, not an application API call; no CloudWatch → SNS route is added. Supporting services share regional logical scope without AZ or subnet claims.

The source establishes replication direction, but not mode or failover behavior. Network layout, exposure, protocols, engines, capacity, IAM, security, recovery objectives and service configuration remain unspecified. Full application Multi-AZ availability is not established. No business rules, schemas, sample data or supplied alerting components were dropped.

Validation records are in validation.json. The actual PNG was inspected for topology, captions and placement. Browser rendering uses pinned draw.io 32.6.1; offline Desktop behavior and operational deployment correctness are unverified. Repository setup and aggregate checks are delegated to the parent integrator because this worker owns only this disjoint output directory.
