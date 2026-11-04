# Companion account: diagram.drawio

Files: `diagram.drawio` (2 pages), `diagram-1.png` (page "Private API access path"), `diagram-2.png` (page "Firewall allowances").

## Scope
- Page 1 is the whole path: Azure spokes, DNS extension VNet with Private Resolver, hub (Azure Firewall, VPN Gateway), IPsec link, AWS Site-to-Site VPN, Transit Gateway, ingress/inspection/egress VPCs, and three workload accounts (API Gateway plus Lambda). Steps 1 to 5 from the source are numbered on connectors (1 DNS query and ruleset, 2 DNS to the firewall, 3 resolve, 4 inspection, 5 invoke).
- Page 2 holds the per-environment firewall allowances as a table, because they are a repeated relation that topology cannot show. They apply to both Azure Firewall and AWS Network Firewall.
- Not drawn: Azure Firewall and Network Firewall rule enforcement points as per-pair connectors; they are only in the table.

## Inferences (not stated in the source)
- The main path starts at the Function or Logic App. The HTTPS call from the spokes to Azure Firewall is inferred from "A function app calls the API".
- One Function App symbol per spoke stands for "Function Apps or Logic Apps"; no separate Logic App symbol is drawn.
- Inspection VPC to egress VPC endpoint is drawn as a direct hop, since the source says traffic is "routed through the inspection VPC" and then reaches the VPC endpoint. How the Transit Gateway routes it is not stated.
- DNS traffic enters AWS through the Transit Gateway straight to the ingress VPC (dashed). The source does not say whether DNS is also inspected.
- Azure Firewall to VPN Gateway and Site-to-Site VPN to Transit Gateway are single shared lines carrying both DNS and API traffic.

## Unresolved or technically doubtful source statements (not drawn as paths)
1. "The Route 53 Resolver outbound endpoint ... forwards the request to the API Gateway VPC endpoint." Outbound endpoints forward DNS queries to other resolvers, not HTTPS traffic. The outbound endpoint is drawn in the egress VPC with no connector. The drawn API path is inspection VPC, then the VPC endpoint, then API Gateway. Please confirm the intended role of the outbound endpoint.
2. "A private hosted zone ... is attached to the Route 53 Resolver inbound endpoint." Private hosted zones associate with VPCs, not endpoints. Drawn as inbound endpoint to hosted zone ("3 resolve") inside the ingress VPC.
3. The hosted zone, inbound endpoint and execute-api name resolve to the VPC endpoint IPs only if private DNS or an alias is set up. The source does not say how. Nothing is drawn.
4. The resource policy on each private REST API is not shown (no symbol); it is in the source but not on the canvas.

## Design risks
- Single VPN tunnel pair, one Azure VPN Gateway and one Transit Gateway attachment path: no redundancy is shown or stated.
- Inspection is a single VPC with one Network Firewall; an outage would block the path.
- The ruleset forwards to Route 53 inbound endpoint IPs across the VPN; if the VPN is down, DNS and API both fail.
- The egress VPC endpoint serves all three environments; isolation between environments depends on the API resource policies and the firewall rules.

## Deviations and compromises
- Page 1 is about 1750 wide, above the 1600 guideline. I kept one page because the single path is easier to follow than a split. A split (DNS resolution page, API call page, overview) would fix the width.
- Step 4 is labeled with the number only; the action is in the "Network Firewall (IDPS)" caption. The IPsec protocol is in the VPN captions instead of on the tunnel line, because the line lies between outlines with no room for a label.
- Step 5 is numbered on the three API Gateway to Lambda hops ("5 invoke"); the VPC endpoint to API Gateway lines carry no label.
- The spoke group connects as a whole (every spoke acts); the three spokes are drawn as separate VNets inside it.
- The Resolver endpoints and the private hosted zone use plain boxes (no exact catalog icon). The VPC and subnet detail inside spokes and hub is not drawn (the source gives none).

## Checks performed
- `finalize.mjs`, `check-text.mjs`, `check-layout.mjs` (final run: 0 errors; two notes, page width and the short wide table page), `check-steps.mjs` (0 unnumbered steps), `render.mjs` with both PNGs inspected visually.
- Source fidelity was checked by tracing each of the five steps and both firewall rules. Technical plausibility is not proven: see the doubtful statements above.
- Desktop draw.io was not opened; rendering used the pinned viewer.
