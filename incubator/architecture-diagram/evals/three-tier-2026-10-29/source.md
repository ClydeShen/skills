# AWS Three-Tier Web Application Architecture

## 1. Architecture Overview

The solution implements a three-tier web application architecture hosted on AWS, distributed across two Availability Zones (AZs) within a single Virtual Private Cloud (VPC).

The architecture consists of:

- Edge Layer: Amazon Route 53, Amazon CloudFront and Amazon S3.
- Web Tier: Elastic Load Balancer (ELB), EC2-based Web Servers and Auto Scaling.
- Application Tier: Elastic Load Balancer (ELB), EC2-based Application Servers and Auto Scaling.
- Database Tier: Amazon RDS with Multi-AZ synchronous replication.
- Network Layer: A single VPC containing six subnets distributed across two Availability Zones.

The design supports horizontal scaling of the Web and Application tiers, traffic distribution across Availability Zones, and database failover using RDS Multi-AZ.

## 2. AWS Infrastructure Components

| Component | Configuration / Role |
| --- | --- |
| AWS Region | Not specified |
| Availability Zones | Availability Zone A, Availability Zone B |
| VPC | 10.0.0.0/16 |
| Route 53 | DNS resolution |
| CloudFront | CDN and edge distribution |
| S3 Bucket | CloudFront origin for static content |
| Web ELB | Load balancing across Web Servers |
| Web Auto Scaling | Auto Scaling group spanning two AZs |
| App ELB | Load balancing across Application Servers |
| App Auto Scaling | Auto Scaling group spanning two AZs |
| Amazon RDS | Primary database with Multi-AZ standby and synchronous replication |

## 3. Network Architecture

### 3.1 VPC Configuration

A single VPC is provisioned with CIDR block `10.0.0.0/16`.

The VPC spans two Availability Zones and contains six subnets, logically separated into Web, Application and Database tiers.

### 3.2 Subnet Allocation

| Availability Zone | Tier | Subnet | CIDR |
| --- | --- | --- | --- |
| AZ A | Web | Web Subnet 1 | 10.0.0.0/24 |
| AZ B | Web | Web Subnet 2 | 10.0.1.0/24 |
| AZ A | Application | App Subnet 1 | 10.0.2.0/24 |
| AZ B | Application | App Subnet 2 | 10.0.3.0/24 |
| AZ A | Database | RDS Subnet 1 | 10.0.4.0/24 |
| AZ B | Database | RDS Subnet 2 | 10.0.5.0/24 |

Each tier is distributed across both Availability Zones.

The diagram does not explicitly define public/private subnet classification, route tables, Internet Gateway, NAT Gateway, Network ACLs or Security Group rules.

## 4. Edge and Content Delivery Layer

### 4.1 Amazon Route 53

Amazon Route 53 provides DNS resolution for incoming client requests.

- Entry point for application users.
- Resolves the application domain to the CloudFront distribution.
- DNS records, routing policies and health checks are not specified.

### 4.2 Amazon CloudFront

CloudFront operates as the CDN layer in front of the application infrastructure.

The diagram shows two downstream integrations:

- Amazon S3: Origin for static content delivery.
- Web ELB: Origin for Web Server traffic.

CloudFront caching policies, origin routing rules, TLS configuration and security controls are not specified.

### 4.3 Amazon S3

An S3 bucket is provisioned outside the VPC boundary.

- Connected to CloudFront.
- Serves as a content origin.
- Bucket access policies, encryption, versioning and origin access configuration are not specified.

## 5. Web Tier

### 5.1 Web Load Balancer

An Elastic Load Balancer is positioned between CloudFront and the Web Server tier.

Responsibilities:

- Receive application requests forwarded by CloudFront.
- Distribute incoming traffic across Web Servers in AZ A and AZ B.
- Provide a common traffic entry point for the Web Tier.

The specific ELB type (ALB, NLB or Classic Load Balancer), listeners, target groups and health-check configuration are not specified.

### 5.2 Web Server Infrastructure

Web Servers are deployed across two subnets:

- AZ A: `Web Subnet 1 (10.0.0.0/24)`
- AZ B: `Web Subnet 2 (10.0.1.0/24)`

The diagram represents multiple Web Server instances in each Availability Zone.

Web Servers are grouped into a single Auto Scaling configuration spanning both Availability Zones.

### 5.3 Web Auto Scaling

The Web Tier uses Auto Scaling to manage EC2 instance capacity across AZ A and AZ B.

The diagram indicates:

- A shared Auto Scaling group across both Availability Zones.
- Multiple Web Server instances.
- Integration with the Web ELB.

Minimum, desired and maximum capacity, scaling policies and instance types are not specified.

## 6. Application Tier

### 6.1 Application Load Balancer

A second Elastic Load Balancer is deployed between the Web Tier and Application Tier.

Responsibilities:

- Receive traffic from Web Servers.
- Distribute requests across Application Servers in both Availability Zones.
- Provide load balancing independently from the Web Tier.

The diagram does not specify whether this ELB is internal-facing, although its position indicates internal application traffic.

### 6.2 Application Server Infrastructure

Application Servers are deployed across two subnets:

- AZ A: `App Subnet 1 (10.0.2.0/24)`
- AZ B: `App Subnet 2 (10.0.3.0/24)`

Multiple Application Server instances are represented in each Availability Zone.

Both sets of Application Servers are managed by a shared Auto Scaling configuration.

### 6.3 Application Auto Scaling

An independent Auto Scaling group manages Application Server capacity across both Availability Zones.

The Web and Application tiers have separate load balancers and separate Auto Scaling groups, allowing independent capacity management.

Instance types, scaling policies, health checks and deployment strategies are not specified.

## 7. Database Tier

### 7.1 Amazon RDS Primary

The primary RDS database instance is deployed in:

- Availability Zone A
- `RDS Subnet 1 (10.0.4.0/24)`

Application Servers from both Availability Zones connect to the primary database.

The diagram does not specify the database engine, instance class, storage type or database connection configuration.

### 7.2 Amazon RDS Multi-AZ Standby

A secondary RDS instance is deployed in:

- Availability Zone B
- `RDS Subnet 2 (10.0.5.0/24)`

The secondary instance is represented as an RDS Multi-AZ standby.

### 7.3 Database Replication

The diagram explicitly identifies Synchronous Replication between the primary and standby RDS instances.

The design uses RDS Multi-AZ deployment to provide database-level high availability.

The standby is not shown serving application read traffic.

In a conventional RDS Multi-AZ DB instance deployment, the standby is intended for automatic failover rather than read scaling.

## 8. Application Traffic Flow

| Step | Source | Destination | Purpose |
| --- | --- | --- | --- |
| 1 | Users | Route 53 | DNS resolution |
| 2 | Users | CloudFront | Application entry point |
| 3a | CloudFront | S3 Bucket | Static content retrieval |
| 3b | CloudFront | Web ELB | Dynamic application requests |
| 4 | Web ELB | Web Servers (AZ A / B) | Web request distribution |
| 5 | Web Servers | App ELB | Application processing requests |
| 6 | App ELB | App Servers (AZ A / B) | Application request distribution |
| 7 | App Servers | RDS Primary | Database operations |
| 8 | RDS Primary | RDS Standby | Synchronous database replication |

Application responses return through the corresponding application and web layers.

## 9. High Availability and Scalability

| Layer | Mechanism | Configuration |
| --- | --- | --- |
| Edge | CloudFront | AWS-managed CDN |
| Web | Multi-AZ + ELB + Auto Scaling | EC2 instances across AZ A and AZ B |
| Application | Multi-AZ + ELB + Auto Scaling | EC2 instances across AZ A and AZ B |
| Database | RDS Multi-AZ | Primary in AZ A, standby in AZ B |
| Database Replication | Synchronous replication | Primary to standby |
| Network | Availability Zone separation | Three subnets per AZ |

The Web and Application tiers support horizontal scaling independently.

The Database tier provides high availability through synchronous replication and a standby instance, rather than application-level database sharding or read replicas.

## 10. Architecture Details Not Specified

The following information cannot be determined from the diagram and requires additional architecture documentation.

| Area | Missing Information |
| --- | --- |
| Regional Deployment | AWS Region |
| Networking | Internet Gateway, NAT Gateway, route tables, subnet public/private classification |
| Security | Security Groups, Network ACLs, IAM roles, AWS WAF |
| Encryption | TLS termination, ACM certificates, KMS, encryption at rest |
| Compute | EC2 instance types, AMIs, operating systems |
| Load Balancing | ELB types, listener ports, target groups, health-check policies |
| Auto Scaling | Min/desired/max capacities, scaling metrics and policies |
| Database | RDS engine, version, instance class, storage, backup and retention |
| Observability | CloudWatch, tracing, logging and alerting |
| Deployment | CI/CD, infrastructure as code, deployment and rollback strategies |
| Disaster Recovery | Cross-region recovery, RTO and RPO |
| Static Content | S3 bucket policies, CloudFront OAC/OAI and cache behaviour |

## 11. Architecture Summary

The architecture consists of one AWS VPC (`10.0.0.0/16`) spanning two Availability Zones with six subnets organised into three application tiers.

Amazon Route 53 provides DNS resolution, while CloudFront delivers edge content through an S3 origin and forwards application traffic to a Web-tier ELB.

The Web Tier consists of EC2 Web Servers distributed across two Availability Zones under a shared Auto Scaling group. Web Servers forward application requests through a second ELB to Application Servers, which are independently managed by another Multi-AZ Auto Scaling group.

Application Servers connect to an Amazon RDS primary database in Availability Zone A. The database is synchronously replicated to a Multi-AZ standby in Availability Zone B.

The architecture provides independent horizontal scalability for the Web and Application tiers, multi-AZ distribution for compute resources, and database high availability through RDS Multi-AZ synchronous replication.

Scope: This document reflects the components, relationships and configurations visible in the supplied architecture diagram. Any unspecified AWS implementation details remain undefined.
