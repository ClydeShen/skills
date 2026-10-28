# Scenario 02 (owner-approved draft)

Approved by the owner on 2026-10-28, including the E1 recommendation that may remove the outbound endpoint and the rule tables drawn as notes. Migrated from the requirements handoff on 2026-10-28; this file now owns the scenario.

**Name:** Private cross-cloud API call from Azure to AWS API Gateway.

**Input text given to the skill:**

> Integration workloads in Azure need private access to internal REST APIs hosted in Amazon API Gateway in AWS.
>
> **Azure side.** The workloads run as Azure Function Apps or Logic Apps in one spoke VNet per environment (dev, test, prod). The spoke VNets connect to a hub VNet that contains Azure Firewall and an existing Azure VPN Gateway, and to a DNS extension VNet that hosts Azure DNS Private Resolver with an inbound endpoint and an outbound endpoint. A DNS forwarding ruleset attached to the outbound endpoint forwards `*.execute-api.{region}.amazonaws.com` to the IP addresses of the AWS Route 53 Resolver inbound endpoint.
>
> **Connectivity.** A site-to-site IPsec VPN connects the Azure VPN Gateway to a new AWS Site-to-Site VPN attached to an AWS Transit Gateway.
>
> **AWS side.** A network services account contains three VPCs attached to the Transit Gateway: an ingress VPC (10.1.0.0/20) with the Route 53 Resolver inbound endpoint, an inspection VPC (10.2.0.0/24) with AWS Network Firewall for IDPS, and an egress VPC (10.3.0.0/20) with an execute-api interface VPC endpoint and a Route 53 Resolver outbound endpoint. A private hosted zone for `execute-api.{region}.amazonaws.com` is attached to the Route 53 Resolver inbound endpoint. Each environment has its own workload account with a private REST API in API Gateway, protected by a resource policy and backed by a Lambda function.
>
> **Flow.** (1) A function app calls the API. Its DNS query goes to the private resolver's inbound endpoint and is forwarded by the ruleset. (2) The query travels through Azure Firewall and the VPN to AWS. (3) The Route 53 Resolver inbound endpoint resolves the name using the private hosted zone. (4) The API traffic is routed through the inspection VPC, where AWS Network Firewall inspects it. (5) The Route 53 Resolver outbound endpoint in the egress VPC forwards the request to the API Gateway VPC endpoint, and API Gateway invokes the Lambda function.
>
> **Firewall rules** (Azure Firewall and AWS Network Firewall, per environment): spoke subnet to Route 53 inbound endpoint IP, port 53; spoke subnet to `*.execute-api.{region}.amazonaws.com`, port 443.

**Natural errors the skill must raise with a recommendation:**

| # | Source claim | Recommendation | Evidence |
|---|---|---|---|
| E1 | The Route 53 Resolver outbound endpoint forwards the request to the API Gateway VPC endpoint. | An outbound endpoint forwards DNS queries out of a VPC, not application requests. The Transit Gateway routes the HTTPS request to the execute-api interface VPC endpoint. The outbound endpoint may be unnecessary here; ask whether to keep it. | AWS Route 53 Developer Guide, "Forwarding outbound DNS queries to your network", accessed 2026-10-28 |
| E2 | A private hosted zone is attached to the Route 53 Resolver inbound endpoint. | Associate the private hosted zone with the VPC, here the ingress VPC that holds the inbound endpoint. | AWS Route 53 Developer Guide, "Forwarding inbound DNS queries to your VPCs", accessed 2026-10-28. That a zone cannot attach to an endpoint is not quoted there; the skill rechecks at run time. |

**Other questions before drawing:** whether DNS queries also pass AWS Network Firewall (the port 53 rule suggests yes; recommend yes); the Lambda runtime (recommend `[Container: AWS Lambda]` when unknown).

**Expected elements:** an Azure boundary (light-blue, Azure logo) with spoke VNet (x3: dev, test, prod, stacked) holding Function Apps and Logic Apps, DNS extension VNet holding the Private Resolver inbound and outbound endpoints, and hub VNet holding Azure Firewall and Azure VPN Gateway; a Site-to-Site VPN connector on the gap between the clouds; AWS Cloud and Region holding the network services account (Transit Gateway as an infrastructure node; ingress VPC with the inbound endpoint and the associated private hosted zone; inspection VPC with AWS Network Firewall; egress VPC with the execute-api VPC endpoint) and workload account (x3, stacked) with API Gateway (private REST API, resource policy in its description) and Lambda; notes with the forwarding rule, the firewall rules and the environment list.

**Expected relationships:**

| Flow | # | From → to | Line | Label content |
|---|---|---|---|---|
| A, DNS | A1 | Function app → Private Resolver inbound endpoint | dashed | Resolve execute-api name [DNS] |
| | A2 | Private Resolver outbound endpoint → Route 53 inbound endpoint, through Azure Firewall, VPN and Transit Gateway | dashed | Forward query by rule [DNS 53] |
| | A3 | Route 53 inbound endpoint → private hosted zone | dashed | Returns the VPC endpoint private IP |
| B, API call | B1 | Function app → Azure Firewall | solid | API request [HTTPS 443] |
| | B2 | Azure VPN Gateway → AWS Site-to-Site VPN → Transit Gateway | solid | [IPsec] |
| | B3 | Transit Gateway → Network Firewall | solid | Inspect (IDPS) |
| | B4 | → execute-api VPC endpoint | solid | [HTTPS] |
| | B5 | VPC endpoint → API Gateway in the workload account | solid | Invoke private API, allowed by resource policy |
| | B6 | API Gateway → Lambda | solid | Invoke |

The outbound endpoint is left out if the user confirms its removal.

**Gates:** the five layout gates; C4 notation; icons only from the catalog, AWS and Azure each with their own; flow colours A and B explained in the legend and separable by numbering in black and white; the connector on the gap between the clouds.

**Information checklist for the blind readout (14 items):** callers in three Azure environments as Function Apps or Logic Apps; egress through the hub VNet's firewall and VPN gateway; DNS by Azure Private Resolver with a forwarding rule for the execute-api domain; IPsec site-to-site VPN between the clouds; Transit Gateway connecting three VPCs; the Route 53 inbound endpoint in the ingress VPC; the private hosted zone resolving the execute-api domain; inspection by Network Firewall; the request entering the execute-api VPC endpoint in the egress VPC; a private REST API controlled by a resource policy; Lambda behind the API; one workload account per environment; firewall rules for ports 53 and 443; DNS resolution and the API call as two separate paths.
