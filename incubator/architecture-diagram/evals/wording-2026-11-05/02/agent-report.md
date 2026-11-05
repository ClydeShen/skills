# Companion account: Azure to AWS private API access

Files: `diagram.drawio` (editable), `diagram.png` and `diagram.svg` (render of the single page).

## Scope and pages

- One page: "Private API access from Azure to AWS". It stays within the 1400-unit width limit with two line kinds (solid for runtime calls, dashed for DNS resolution) and three nested outlines at most, so no split was needed.
- Environments are drawn once with a count: Azure spoke VNet "x3: dev, test, prod" and AWS workload account "x3: dev, test, prod". The firewall rules apply per environment and are shown as a table, because drawing them as connectors would be unreadable.
- Direction is left to right. Step numbers 1 to 5 follow the source.

## Source statements and how the drawing treats them

Stated and drawn as written:
- Function Apps and Logic Apps in spoke VNets, which connect to the hub VNet (Azure Firewall, existing VPN Gateway) and to the DNS extension VNet (Private Resolver with inbound and outbound endpoints).
- The forwarding ruleset sends `*.execute-api.{region}.amazonaws.com` to the AWS Route 53 Resolver inbound endpoint. The rule text is written inside the outbound endpoint box.
- IPsec site-to-site VPN to a new AWS Site-to-Site VPN on a Transit Gateway.
- Ingress VPC 10.1.0.0/20, inspection VPC 10.2.0.0/24 and egress VPC 10.3.0.0/20, each with the stated contents.
- Per-environment workload accounts with a private REST API, resource policy and Lambda function.

Inferred, not stated:
- The workloads are the origin of the main path. The source only says a function app calls the API.
- The Site-to-Site VPN, Transit Gateway and private hosted zone sit in the network services account. The source places the VPCs there but is silent on these.
- The Logic Apps and Function Apps are drawn as one "Workloads" group because both act. The source's step 1 mentions only a function app.
- The private hosted zone sits outside the ingress VPC. The source says the zone is "attached to the Route 53 Resolver inbound endpoint". The drawing shows the inbound endpoint resolving through the zone (step 3).
- The TGW to Network Firewall to execute-api endpoint hops show the stated step 4 and the path to the endpoint. The return through the Transit Gateway after inspection (typical TGW appliance routing) is implied by attachment and not drawn, because the source gives no route tables.
- The two dashed and solid lines run in parallel through Azure Firewall, VPN Gateway, Site-to-Site VPN and Transit Gateway. The source says both DNS and API traffic use this path.

## Doubtful statements, not drawn as paths

- **Step 5 and the Route 53 Resolver outbound endpoint.** The source says the outbound endpoint "forwards the request to the API Gateway VPC endpoint". In AWS, a Resolver outbound endpoint forwards DNS queries to external resolvers. It does not carry HTTPS traffic to a VPC interface endpoint. I drew the outbound endpoint inside the egress VPC with no connector. The API traffic goes from the inspection VPC to the execute-api VPC endpoint to API Gateway to Lambda. Please confirm what the outbound endpoint is for. I did not check this against AWS documentation during this run.
- **Private hosted zone attached to the inbound endpoint.** A private hosted zone is associated with a VPC, not with a Resolver endpoint. I drew the inbound endpoint resolving through the zone (step 3) and did not draw a zone-to-endpoint attachment.
- **Resolver inbound endpoint IPs in the forwarding rule.** The rule targets the inbound endpoint IP addresses, so the step 2 DNS hop ends at that endpoint. For the zone to answer with the VPC endpoint addresses, the ingress VPC would need the association. This is an assumption, not drawn.

## Design risks (not drawn)

- The VPN Gateway, the Site-to-Site VPN tunnel pair and the Transit Gateway are single paths for both DNS and API traffic. Redundancy (second tunnel, gateway SKU, zones) is not specified.
- One shared egress VPC endpoint serves all three environments. Isolation between dev, test and prod relies on the firewall rules and the API resource policies. The firewall rules named in the source do not distinguish environments except by "per environment".
- Overlapping address space between Azure spokes and the AWS VPCs is not described.

## Deviations and drawing choices

- No region is drawn because the source gives `{region}` as a placeholder.
- Boundary outlines are one neutral grey for Azure; AWS boundaries keep the vendor styles from the catalog.
- Plain white boxes are used for Inbound endpoint and Outbound endpoint, since the catalog has no exact Azure icon for them. The Azure DNS Private Resolver icon marks its boundary.
- Subnets are not drawn. The firewall rules mention a "spoke subnet", which appears only in the rules table.
- The execute-api interface endpoint uses the generic AWS "Endpoints" icon.
- The "Outbound endpoint" caption uses `labelWidth=120` instead of 160 so that it stays inside the 130-unit-wide egress VPC.
- Dashed hops carry labels shorter than the ideal one-word spacing in places; the layout check reports no issues.
- Text omitted from the canvas: business rules, sample data and alerting (none in the source).

## Checks run

- `finalize.mjs`: ran after every edit; no vendor icons needed embedding (all icons are draw.io built-ins).
- `check-text.mjs`: clean.
- `check-layout.mjs`: 0 errors, 0 items on the final file (earlier runs reported label and outline collisions, which I fixed by moving labels and boundaries).
- `check-steps.mjs` against a copy of `scenario.md`: 0 items; steps 1 to 5 are all numbered.
- `render.mjs`: rendered with the pinned draw.io viewer. I read the PNG and compared it with the source. I did not open the file in draw.io Desktop or import it into Lucidchart.

## Housekeeping note

While looking up icons I wrote `/tmp/gen/icons.txt`. `/tmp/gen` already contained other files that are not mine, and I may have overwritten an earlier `icons.txt` there. I did not touch the other files. My generator script and its copy of the source live in `/tmp/z02-gen/`.
