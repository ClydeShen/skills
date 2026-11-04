# Companion account: Azure to AWS private API access

Files: `diagram.drawio` (3 pages), `diagram-1.png`, `diagram-2.png`, `diagram-3.png` (one per page).

## Scope and pages
One page would have run past 1600 units, so I split by flow and concern:
1. **DNS resolution** – steps 1 to 3: spoke workloads, resolver inbound endpoint, ruleset, outbound endpoint, Azure Firewall, VPN, Transit Gateway, Route 53 Resolver inbound endpoint, private hosted zone.
2. **API call** – steps 4 and 5, plus the call's start: spokes, Azure Firewall, VPN, Transit Gateway, inspection VPC, egress VPC, three workload accounts (API Gateway, then Lambda).
3. **Firewall rules** – the per-environment allowances as a table, with both firewalls named.

The source's single five-step flow therefore spans pages 1 and 2. Step 3 ends page 1 and step 4 starts page 2. No page shows the whole system at once.

## Deviations and drawing choices
- All connectors are solid, since each page is one kind of flow. DNS is not drawn dashed. The title and "DNS" labels say what the lines carry.
- Each spoke shows both a Function App and a Logic App icon, because the source says "or". It does not say a given spoke runs both.
- Connectors leave the Function App and Logic App pair from the spoke VNet frame, not from one icon. Either app type can make the call.
- Not drawn as flows, because the source does not support them as stated:
  - **Outbound endpoint to API Gateway VPC endpoint (step 5).** A Route 53 Resolver outbound endpoint forwards DNS queries. It does not forward HTTPS requests. I drew it as an unlabelled dashed line to the execute-api endpoint (key: "stated, not explained"). The solid path is Network Firewall, then the execute-api endpoint, then API Gateway. I numbered step 5 on the endpoint-to-API Gateway lines ("5 Invoke"), not on the dashed line. **Please decide:** is the outbound endpoint needed on this path at all?
  - **Private hosted zone "attached to the inbound endpoint".** A hosted zone associates with a VPC, not with an endpoint. I drew the inbound endpoint resolving against the zone ("3 Resolve") and placed the zone in the network services account, outside the ingress VPC. Neither the account nor the VPC association is in the source.

## Inferences and unspecified details
- The source says to read the DNS path as spoke, then inbound endpoint, then ruleset, then outbound endpoint. I drew exactly that. In Azure, the ruleset is normally linked to a VNet, so the spoke query would be forwarded by the outbound endpoint.
- The Transit Gateway and Site-to-Site VPN sit in the AWS cloud box, outside the network services account. The source does not place them.
- Inspection VPC to egress VPC is drawn as a direct arrow. The source says the VPCs attach to the Transit Gateway, so the real traffic probably returns through it. The TGW route tables and the appliance-mode setup are not in the source.
- The firewall-rule table lists Port 53 as one rule. That implies DNS also crosses AWS Network Firewall. The source's step 2 and 3 do not route DNS through the inspection VPC, so page 1 skips it. Please confirm which is right.
- The DNS answer, the API response and TCP return traffic are folded into the request lines.
- Not specified and not drawn: region and AZ placement, subnets and CIDRs of the spokes, hub, DNS VNet, the resolver IP addresses, VPC endpoint DNS names and resource-policy contents. The `{region}` placeholder is kept as written.
- I left out any Azure subscription or resource group level and any AWS region box.
- I read "ruleset attached to the outbound endpoint" as a box under the outbound endpoint. It is a plain box because the icon catalogue has no ruleset symbol.
- The key lists only the two line styles used on page 2. Pages 1 and 3 need no key.

## Design risks (not drawn on the canvas)
- One Site-to-Site VPN and one VPN Gateway are single points of failure for both DNS and API traffic. The source names no second tunnel, zone redundancy or other region.
- A single Network Firewall inspection path and one egress VPC endpoint serve all three environments.
- Dev, test and prod share one DNS resolver chain and one inspection and egress path. Only the rules separate the environments.
- The source does not say how DNS responses are returned to the spokes.

## Checks performed
- `finalize.mjs`, `check-text.mjs` and `check-layout.mjs`: 0 errors, 2 advisories left.
  - The step-5 label for the test environment sits on a bend in its line.
  - The prod spoke-to-Firewall line has two bends. The suggested one-bend route would enter the Firewall's bottom port, which is the exit to the VPN Gateway.
- `check-steps.mjs`: 0 items. Steps 1 to 5 are all numbered on a connector.
- All three PNGs rendered with the pinned draw.io viewer, and I read each one. I did not open the file in draw.io Desktop.
- Source fidelity checked by hand against `scenario.md`. Technical plausibility is a separate question: the deployment still needs its own review.
