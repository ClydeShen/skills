# Scope and assumptions

This diagram was generated independently from the [source text](../../three-tier-2026-10-29/source.md), using the updated architecture-diagram skill. No reference image, sibling output or prior generator was consulted.

The deployment overview retains both Availability Zones, all six named subnets and CIDRs, both compute fleets, independent Auto Scaling groups, both ELBs, edge services, and RDS primary/standby roles. Each stack represents an unspecified fleet size. Solid arrows trace application and origin requests; dashed arrows identify DNS resolution and synchronous replication. Normal responses are implicit. The standby has no application traffic.

The ELBs are shared logical services inside the VPC. Their placement between AZ columns asserts neither physical placement nor subnet attachments. Orange dashed member markers identify the EC2 fleets; a separate management association and shared group name link each tier across AZs. ELBs lie outside those member markers. No ELB subtype, exposure or target configuration is inferred.

The static and dynamic origin branches preserve the source's semantic distinction; they do not assert cache rules or request broadcast. DNS resolves the application name to CloudFront and does not forward application payloads. The source states these paths but does not specify the CloudFront-to-ELB connectivity mechanism. The drawing retains that high-level relationship without claiming public exposure, a VPC origin or a particular protocol.

Region, public/private classifications, routing, gateways, security controls, TLS, compute sizes, scaling limits/policies, database engine/settings, observability, deployment automation, disaster recovery objectives and S3/CloudFront access policies remain unspecified. No business-rule details, schemas, sample data or alerting were supplied or excluded. No material source relationship was omitted and no operational recommendation was added.

AWS icons use catalog entries from one pinned generation. The Network Content Delivery Elastic Load Balancing entry and the Storage Bucket resource were selected explicitly. The bucket represents the stated S3 origin without introducing a special bucket type. Users use a neutral box.

Static validation, rendered-route validation and pairwise text-overlap checks are recorded in [generation.json](generation.json). The final PNG was inspected for readability and traced against the source. Rendering used pinned draw.io 32.6.1 in Chromium; offline Desktop rendering remains unverified. Source fidelity and visual checks do not verify an actual AWS deployment.

The delegated write scope was limited to this case directory. Branch/setup mutations and whole-repository checks were left to the integrating agent. The attempted Git session check failed with `spawnSync git EPERM`; local rendering succeeded after sandbox escalation.
