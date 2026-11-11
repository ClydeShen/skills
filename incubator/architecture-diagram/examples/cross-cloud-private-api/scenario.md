Integration workloads in Azure need private access to internal REST APIs hosted in Amazon API Gateway in AWS.

**Azure side.** The workloads run as Azure Function Apps or Logic Apps in one spoke VNet per environment (dev, test, prod). The spoke VNets connect to a hub VNet that contains Azure Firewall and an existing Azure VPN Gateway, and to a DNS extension VNet that hosts Azure DNS Private Resolver with an inbound endpoint and an outbound endpoint. A DNS forwarding ruleset attached to the outbound endpoint forwards `*.execute-api.{region}.amazonaws.com` to the IP addresses of the AWS Route 53 Resolver inbound endpoint.

**Connectivity.** A site-to-site IPsec VPN connects the Azure VPN Gateway to a new AWS Site-to-Site VPN attached to an AWS Transit Gateway.

**AWS side.** A network services account contains three VPCs attached to the Transit Gateway: an ingress VPC (10.1.0.0/20) with the Route 53 Resolver inbound endpoint, an inspection VPC (10.2.0.0/24) with AWS Network Firewall for IDPS, and an egress VPC (10.3.0.0/20) with an execute-api interface VPC endpoint and a Route 53 Resolver outbound endpoint. A private hosted zone for `execute-api.{region}.amazonaws.com` is attached to the Route 53 Resolver inbound endpoint. Each environment has its own workload account with a private REST API in API Gateway, protected by a resource policy and backed by a Lambda function.

**Flow.** (1) A function app calls the API. Its DNS query goes to the private resolver's inbound endpoint and is forwarded by the ruleset. (2) The query travels through Azure Firewall and the VPN to AWS. (3) The Route 53 Resolver inbound endpoint resolves the name using the private hosted zone. (4) The API traffic is routed through the inspection VPC, where AWS Network Firewall inspects it. (5) The Route 53 Resolver outbound endpoint in the egress VPC forwards the request to the API Gateway VPC endpoint, and API Gateway invokes the Lambda function.

**Firewall rules** (Azure Firewall and AWS Network Firewall, per environment): spoke subnet to Route 53 inbound endpoint IP, port 53; spoke subnet to `*.execute-api.{region}.amazonaws.com`, port 443.
