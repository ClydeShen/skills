# AWS Three-Tier Web Application Architecture

## 1. Architecture Overview

The solution implements an AWS three-tier web application architecture deployed within a single AWS Region, with infrastructure distributed across two Availability Zones (AZ-1 and AZ-2).

The architecture includes:

- DNS and Ingress Layer: Amazon Route 53 and Elastic Load Balancer (ELB).
- Web Tier: EC2-based Web Servers managed by an Auto Scaling Group.
- Application Tier: EC2-based Application Servers.
- Caching Tier: Amazon ElastiCache.
- Database Tier: Amazon RDS Primary and Standby instances.
- Static Content Layer: Amazon S3 and Amazon CloudFront.
- Supporting Services: Amazon DynamoDB, Amazon SES, Amazon SNS and Amazon CloudWatch Alarms.

The application uses RDS primary-standby replication for database availability and S3 with CloudFront for static media delivery.

The diagram shows most application components within AZ-1, with a separate RDS standby instance within AZ-2.

## 2. AWS Infrastructure Components

| Component | Configuration / Role |
| --- | --- |
| AWS Region | Single Region, name not specified |
| Availability Zones | AZ-1 and AZ-2 |
| Amazon Route 53 | Hosted Zone for www.yourApp.com |
| Elastic Load Balancer | Application traffic distribution |
| EC2 Web Servers | Two Web Server instances shown |
| Web Auto Scaling Group | Manages Web Server capacity |
| EC2 App Servers | Two Application Server instances shown |
| Amazon ElastiCache | Caching tier |
| Amazon RDS Primary | Primary relational database in AZ-1 |
| Amazon RDS Standby | Standby database in AZ-2 |
| Amazon S3 | Static object storage |
| Amazon CloudFront | Static content distribution |
| Amazon DynamoDB | Additional NoSQL database |
| Amazon SES | Email delivery |
| Amazon SNS | Notifications |
| Amazon CloudWatch Alarms | Monitoring and alerting |

## 3. Infrastructure and Availability Zone Design

### 3.1 Regional Deployment

The solution is deployed within a single AWS Region.

Two Availability Zones are represented:

- AZ-1: Contains the Web Tier, Application Tier, ElastiCache, primary RDS instance and S3 representation.
- AZ-2: Contains the RDS standby instance and overlaps with the S3 representation.

The S3 bucket is positioned within the region boundary, but S3 is a regional service rather than an AZ-specific resource.

### 3.2 Network Configuration

The diagram does not explicitly represent a VPC or individual subnets.

The following network information is not specified:

- VPC CIDR and subnet allocation.
- Public and private subnets.
- Internet Gateway and NAT Gateway.
- Route tables and network ACLs.
- Security Groups.
- VPC endpoints.
- Inter-AZ network connectivity.

No explicit network segmentation is provided between the Web, Application and Database tiers.

## 4. DNS and Ingress Layer

### 4.1 Amazon Route 53

Amazon Route 53 provides DNS resolution for the application domain.

Configuration shown:

- Hosted Zone: Amazon Route 53.
- Application domain: `www.yourApp.com`.
- Downstream target: Elastic Load Balancer.

Route 53 directs application traffic toward the ELB.

The record type, routing policy, DNS TTL and health checks are not specified.

### 4.2 Elastic Load Balancer

An Elastic Load Balancer is deployed as the entry point for application traffic.

Responsibilities:

- Receive application traffic associated with `www.yourApp.com`.
- Distribute incoming requests to the Web Tier.
- Integrate with the EC2 Web Server Auto Scaling Group.

The diagram shows a single ELB connected to the Web Tier.

The following are not specified:

- ELB type: ALB, NLB or Classic Load Balancer.
- Public-facing or internal configuration.
- Listener ports and protocols.
- Target groups and routing rules.
- TLS termination and certificates.
- Health-check configuration.

## 5. Web Tier

### 5.1 EC2 Web Servers

The Web Tier consists of two EC2 Web Server instances deployed within AZ-1.

Both instances are enclosed within a single Auto Scaling Group.

The Web Tier receives application requests from the ELB.

A connection is also shown between the Web Tier and the Amazon S3 bucket.

Configuration shown:

| Property | Value |
| --- | --- |
| Compute | Amazon EC2 |
| Role | Web Server |
| Instances illustrated | 2 |
| Availability Zone | AZ-1 |
| Scaling | Auto Scaling Group |
| Upstream | Elastic Load Balancer |
| Additional Integration | Amazon S3 |

### 5.2 Web Auto Scaling Group

The Web Tier is managed by an Auto Scaling Group, providing the ability to adjust EC2 instance capacity.

The diagram illustrates two Web Server instances within the group.

The following settings are not specified:

- Minimum, desired and maximum instance count.
- Scaling policies.
- Launch Template or Launch Configuration.
- Instance type and AMI.
- Health checks and replacement policies.
- Multi-AZ distribution.

The Auto Scaling Group is shown only within AZ-1. Cross-AZ scaling is not explicitly represented.

## 6. Application Tier

### 6.1 EC2 Application Servers

The Application Tier contains two EC2 Application Server instances within AZ-1.

Configuration shown:

| Property | Value |
| --- | --- |
| Compute | Amazon EC2 |
| Role | Application Server |
| Instances illustrated | 2 |
| Availability Zone | AZ-1 |
| Application Tier Scaling | Not explicitly shown |
| Database Integration | Amazon RDS |
| Cache Integration | Amazon ElastiCache |

The App Servers are grouped within an Application Tier boundary.

Unlike the Web Tier, no Auto Scaling Group is explicitly identified for the Application Tier.

### 6.2 Application Tier Connectivity

The diagram shows outgoing connections from the Application Tier toward:

- Amazon ElastiCache.
- Amazon RDS Primary.

A direct connection between the Web Servers and App Servers is not explicitly drawn, although the tier labels indicate a logical three-tier application structure.

No internal load balancer, service discovery or application-to-application communication protocol is specified.

## 7. Caching Tier

### 7.1 Amazon ElastiCache

Amazon ElastiCache is deployed in AZ-1 as a dedicated caching component.

Configuration shown:

- Service: Amazon ElastiCache.
- Location: AZ-1.
- Upstream: Application Tier.
- Downstream relationship: Amazon RDS Primary.

The diagram shows Application Tier traffic directed to ElastiCache and a connection from ElastiCache toward RDS.

The caching strategy is not specified.

The following details remain undefined:

- Redis OSS, Valkey or Memcached engine.
- Cache cluster or replication group configuration.
- Cache node type and capacity.
- Cache TTL and eviction policies.
- Cache invalidation strategy.
- Multi-AZ replication or automatic failover.

The diagram does not establish whether the cache is used for sessions, application objects, query results or other data.

## 8. Database Tier

### 8.1 Amazon RDS Primary

An Amazon RDS primary database instance is deployed in AZ-1.

Configuration shown:

| Property | Value |
| --- | --- |
| Service | Amazon RDS |
| Role | Primary database |
| Availability Zone | AZ-1 |
| Upstream | Application Tier and ElastiCache connection |
| Replication Target | RDS Standby in AZ-2 |

The primary instance is the database endpoint represented for application operations.

The database engine, instance class, storage configuration and backup policies are not specified.

### 8.2 Amazon RDS Standby

A second RDS instance is deployed in AZ-2 and labelled `Standby`.

The diagram shows a directional connection from the primary database to the standby instance.

This indicates a primary-standby database arrangement intended to support database availability.

The diagram does not explicitly label the replication mode. If implemented as a conventional Amazon RDS Multi-AZ DB instance deployment, replication is synchronous and AWS manages failover.

The standby is not shown receiving direct application read requests.

### 8.3 Database High Availability

The database tier is the only tier with an explicitly illustrated deployment spanning both Availability Zones.

The architecture separates:

- Primary database operations in AZ-1.
- Standby database instance in AZ-2.

Automatic failover behaviour, failover thresholds, RTO and RPO are not defined in the diagram.

## 9. Static Content and Media Delivery

### 9.1 Amazon S3

An Amazon S3 bucket provides object storage for the application.

The diagram illustrates connections involving:

- Web Tier to S3.
- RDS Standby side to S3.
- S3 to Amazon CloudFront.

The specific purpose of the RDS Standby-to-S3 connection is not identified. It should not automatically be interpreted as database backup, export or replication.

The S3 bucket is associated with static media delivery through CloudFront.

### 9.2 Amazon CloudFront

Amazon CloudFront is deployed as the CDN for static content.

The diagram identifies:

- Content origin: Amazon S3.
- Media domain: `media.yourApp.com`.
- Content type: Static Data.

CloudFront retrieves content from S3 and delivers it through the media domain.

The diagram does not specify a Route 53 record for `media.yourApp.com`.

Caching policies, CloudFront distribution settings, HTTPS configuration and S3 origin access controls are not provided.

## 10. Supporting AWS Services

### 10.1 Amazon DynamoDB

An Amazon DynamoDB table is represented as an additional persistence service.

The diagram shows a bidirectional relationship between the application deployment boundary and DynamoDB.

Specific characteristics:

- Service: Amazon DynamoDB.
- Resource: DynamoDB Table.
- Function: Additional NoSQL data storage.
- Read/write interactions are indicated.

The consuming application component and DynamoDB table schema are not specified.

### 10.2 Amazon SES

Amazon Simple Email Service (SES) is included for application email delivery.

The diagram shows an outbound relationship from the application deployment boundary toward SES.

The exact calling component, email templates, sending identities and delivery configuration are not specified.

### 10.3 Amazon SNS

Amazon Simple Notification Service (SNS) is included for notifications.

The diagram identifies email as a notification channel.

SNS is represented as an external supporting service connected to the application deployment boundary.

The publishing source, topics, subscriptions and message triggers are not specified.

### 10.4 Amazon CloudWatch Alarms

Amazon CloudWatch Alarms provides infrastructure or application monitoring and alerting.

The diagram shows a connection from the deployment boundary toward CloudWatch Alarms.

Specific monitored metrics, alarm thresholds and notification integrations are not defined.

No direct CloudWatch-to-SNS connection is illustrated.

## 11. Application Traffic and Data Flow

| Step | Source | Destination | Purpose |
| --- | --- | --- | --- |
| 1 | www.yourApp.com | Route 53 | Application DNS resolution |
| 2 | Route 53 | Elastic Load Balancer | Resolve application ingress endpoint |
| 3 | ELB | Web Servers | Distribute application requests |
| 4 | Web Servers | App Servers | Logical three-tier application processing; connection not explicitly drawn |
| 5 | Application Tier | ElastiCache | Cache access |
| 6 | Application Tier | RDS Primary | Relational database access |
| 7 | ElastiCache | RDS Primary | Connection shown; data operation unspecified |
| 8 | RDS Primary | RDS Standby | Primary-to-standby database replication relationship |
| 9 | Web Tier | S3 Bucket | Object storage interaction |
| 10 | RDS Standby side | S3 Bucket | Connection shown; purpose unspecified |
| 11 | S3 Bucket | CloudFront | Static content origin |
| 12 | CloudFront | media.yourApp.com | Static content delivery |
| 13 | Application boundary | DynamoDB | NoSQL data access |
| 14 | Application boundary | SES | Email delivery |
| 15 | Application boundary | SNS | Notification publishing |
| 16 | Application boundary | CloudWatch Alarms | Monitoring and alarms |

The flow table distinguishes relationships directly visible in the diagram from logical interactions implied by the three-tier design.

## 12. High Availability and Scalability

| Layer | Mechanism | Architecture Configuration |
| --- | --- | --- |
| DNS | Route 53 | Managed DNS service |
| Ingress | ELB | Single logical load balancer |
| Web | Auto Scaling | Two illustrated EC2 instances, AZ-1 |
| Application | Multiple instances | Two illustrated EC2 instances, AZ-1 |
| Cache | ElastiCache | Single caching component illustrated in AZ-1 |
| Relational Database | Primary / Standby | RDS Primary in AZ-1, Standby in AZ-2 |
| Object Storage | S3 | AWS regional object storage |
| CDN | CloudFront | AWS-managed content distribution |
| Notifications | SNS | Managed notification service |
| Monitoring | CloudWatch Alarms | Managed alarm service |

The design provides horizontal scaling capability for the Web Tier and database redundancy across two Availability Zones.

However, full application-level Multi-AZ high availability is not established by the diagram because the Web Tier, Application Tier and ElastiCache are represented only within AZ-1.

## 13. Architecture Details Not Specified

| Area | Missing Information |
| --- | --- |
| AWS Region | Region identifier |
| VPC | VPC ID, CIDR, network layout |
| Subnets | CIDR allocation, public/private classification |
| Network Security | Security Groups, NACLs, route tables |
| Internet Connectivity | Internet Gateway, NAT Gateway, VPC endpoints |
| ELB | Type, listeners, routing rules, health checks |
| Web Tier | EC2 configuration, scaling limits, deployment strategy |
| App Tier | Scaling configuration, internal routing, service discovery |
| Caching | Engine, cluster configuration, TTL, failover |
| RDS | Engine, instance class, storage, backup and retention |
| DynamoDB | Table structure, access patterns, capacity mode |
| S3 | Bucket policies, encryption, versioning, lifecycle |
| CloudFront | Cache policies, origins, TLS, WAF |
| SES | Sending configuration, identities, templates |
| SNS | Topics, subscriptions, publishing events |
| Monitoring | CloudWatch metrics, alarm thresholds, dashboards |
| Security | IAM, KMS, Secrets Manager, authentication |
| Operations | CI/CD, Infrastructure as Code, logging and tracing |
| Disaster Recovery | RTO, RPO, backup restoration, regional recovery |

## 14. Architecture Summary

The architecture represents a single-region AWS three-tier web application, using Route 53 and an ELB to route application traffic to an EC2-based Web Tier.

The Web Tier contains two EC2 instances managed by an Auto Scaling Group within AZ-1. The Application Tier contains two additional EC2 instances and integrates with Amazon ElastiCache and an Amazon RDS primary database.

Database redundancy is provided through an RDS standby instance deployed in AZ-2.

Amazon S3 and CloudFront support static media distribution through `media.yourApp.com`, while DynamoDB provides additional NoSQL persistence.

Amazon SES, SNS and CloudWatch Alarms provide email, notification and monitoring capabilities.

Architecture characteristics:

- Single AWS Region.
- Two Availability Zones.
- Three logical application tiers.
- EC2-based compute infrastructure.
- Web Tier Auto Scaling.
- Dedicated caching tier.
- Relational and NoSQL persistence.
- Primary-standby database architecture.
- S3-backed static content delivery.
- Managed notification, email and monitoring services.

Scope: This document captures the architecture elements and relationships visible in the supplied diagram. Unspecified implementation details are not assumed to be configured.
