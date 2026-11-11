# Companion account: cross-cloud private API access

Files: `diagram.drawio` (editable), `diagram.png` (render), `diagram.svg`.

## Scope and pages

One page, "Private API access". It holds the Azure side, the VPN, the AWS network services account, the workload accounts, the DNS path (dashed) and the API path (solid). No limit in the composition rules forced a split. The page is 1400 units wide and has two kinds of line.

Left out: nothing from the scenario was dropped. Detail the source does not give, such as subnets, regions, IP addresses, zones and redundancy, is not drawn.

## What the drawing states and how

- Facts drawn: the three components of the Azure side (spoke VNets x3, hub VNet with Azure Firewall and VPN Gateway, DNS extension VNet with Private Resolver and forwarding ruleset), the S2S IPsec VPN to a Transit Gateway, the three VPCs with their CIDRs, the Route 53 inbound endpoint and private hosted zone, the execute-api VPC endpoint, one workload account x3 with API Gateway and Lambda, and the firewall allowances (as a table).
- Steps 1 to 5 are numbered on connectors in the order the drawn path runs them. Step 2 runs on the first hop out of the ruleset and the DNS hops that follow. Step 4 is on the hop into the inspection VPC.
- Two parallel lines (dashed DNS, solid API call) cross each gateway hop, so the same device is shown on both paths without shared segments.

## Inferences (not stated in the source)

- The function app starts the API call, so the solid path begins at Function Apps and goes to Azure Firewall, VPN Gateway, Site-to-Site VPN and Transit Gateway. The source names the firewall and VPN only for the DNS query, plus the firewall rules.
- The Transit Gateway and Site-to-Site VPN sit in the network services account. The source does not say which account owns them.
- API traffic goes Network Firewall, then the execute-api VPC endpoint, with no Transit Gateway hop drawn between the inspection and egress VPCs. Real routing would normally return through the Transit Gateway. The source says only "routed through the inspection VPC".
- Spoke VNet, hub VNet and DNS VNet connectivity (peering) is not drawn as links. The path simply passes through them.
- The ruleset is drawn as a box in the DNS extension VNet, with the resolver handing queries to it ("forwards") and it handing them on to Azure Firewall. The source says the ruleset is attached to the outbound endpoint. The box stands for that forwarding. The inbound and outbound endpoints are not drawn separately in Azure, because the single DNS Private Resolver icon covers both.

## Source statements not drawn as paths, and doubts

- Step 5 says the Route 53 Resolver outbound endpoint forwards the request to the API Gateway VPC endpoint. An outbound endpoint forwards DNS queries to other resolvers. It does not carry API HTTPS traffic. I drew the outbound endpoint in the egress VPC with no connector, and the API path goes from the Network Firewall to the VPC endpoint. Please confirm what the outbound endpoint is for. This is the main open question.
- "A private hosted zone ... is attached to the Route 53 Resolver inbound endpoint": a hosted zone is associated with VPCs, not endpoints. I drew the resolver querying the zone, which is the intended behaviour.
- The resource policy on the private REST API is only in this account. The drawing has no policy icon. API Gateway is captioned "private REST API".
- Logic Apps are drawn as a peer workload of Function Apps in the spoke VNet, with no connectors of their own. The source says "Function Apps or Logic Apps" and describes the flow only for a function app; drawing a second set of parallel lines would have added clutter without new information. They are assumed to use the same path.
- The AWS DNS answer returning to Azure is not drawn. The source gives no response step.
- Design risks to note, not drawn: single VPN tunnel/gateway and a single Azure Firewall and Network Firewall are single points of failure as described; no redundancy or regions are stated.

## Checks I ran

- `finalize.mjs`, `check-text.mjs`, `check-layout.mjs`, `check-steps.mjs` and `render.mjs`; I looked at the final PNG.
- Final layout report: 0 errors, 1 item to check. "Connector e2 bends 2 times to avoid the connector label d3" is a false positive of the check: the second bend exists because the ruleset box and Azure Firewall are not vertically aligned, and the label is not near it. I left it. Moving the firewall under the ruleset would widen the page beyond 1400 units.
- `check-steps.mjs`: all five source steps are numbered.
- Not done: opening the file in draw.io Desktop. Rendering used the pinned draw.io viewer only.

## Deviations from preference

- Resolver, inbound endpoint, Network Firewall and Lambda captions sit beside or above the icon so that connectors do not cross captions.
- The Azure region and AWS region are not drawn. The source gives `{region}` as a placeholder.
