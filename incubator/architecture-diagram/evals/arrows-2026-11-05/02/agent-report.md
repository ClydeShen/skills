# Companion account: Azure to API Gateway private access

Deliverables, all in the working directory:
- `diagram.drawio`: the editable file.
- `diagram.png`: the PNG of the single page. `diagram.svg` and `diagram.render.json` are render by-products.

## Scope and pages
- One page, "Azure to API Gateway private access", 1400 x 1000 units, laid out left to right. It has no split because it needs only two kinds of line, stays within 1400 units, has at most two nested outlines, and has one main direction.
- Azure is on the left: the spoke VNet (×3), the DNS extension VNet with the Private Resolver, and the hub VNet with Azure Firewall and the VPN Gateway.
- AWS is on the right: the network services account with Site-to-Site VPN, Transit Gateway and the ingress, inspection and egress VPCs, plus the workload account (×3).
- Solid lines are the API path. Dashed lines are DNS resolution. The Key is lower right.
- The firewall allowances are a native table, because they are a repeated relation: source, destination and port, for both firewalls and every environment.
- Steps 1 to 5 are numbered on connectors. `check-steps` reports no stated step without a number.

## What the source states and the drawing shows
- The three spoke VNets are drawn once, as "×3: dev, test, prod". The three workload accounts are also drawn once, with the same count.
- The VPN is drawn as two parallel hops, solid and dashed, because the DNS query and the API traffic both cross it. I did not draw a shared line, because lines with different meanings must not share a segment.
- The Azure ruleset is shown inside the Private Resolver boundary as "Outbound endpoint and forwarding ruleset".
- The wildcard `*.execute-api.{region}.amazonaws.com` appears only in the firewall table. It is not repeated on the ruleset box.

## Inferences, which are not stated in the source
- The main path begins at the function app. The source implies the call, and I drew it.
- Function Apps and Logic Apps are both workloads. The connectors start at Function Apps only, because the stated flow names a function app. Logic Apps would behave the same, but the source does not say so.
- DNS travels Transit Gateway to ingress VPC directly, without passing the inspection VPC. Step 3 does not route it through inspection.
  - The firewall rules list port 53 for both firewalls, which suggests DNS may also be inspected. Please confirm.
- The "Private hosted zone" sits in the network services account, outside the VPCs. Route 53 private hosted zones are not VPC-resident. Its placement is an inference.
- AWS Network Firewall to the interface VPC endpoint is drawn as one hop. The source says only "routed through the inspection VPC".
  - On AWS this normally returns through the Transit Gateway. The attachments, route tables and appliance mode are unspecified, so the drawing does not show them.

## Source statements the drawing does not show as an operational path
- **Step 5 wording.** The source says the Route 53 Resolver outbound endpoint "forwards the request to the API Gateway VPC endpoint".
  - A Resolver outbound endpoint forwards DNS queries to target resolvers. It does not carry HTTPS to a VPC endpoint.
  - I drew the outbound endpoint in the egress VPC with no connector. The API call reaches the VPC endpoint through the inspection hop. This is a doubtful relationship, so it stays out of the drawing.
  - Please confirm what the outbound endpoint is for, for example forwarding other DNS queries.
- **Hosted zone attachment.** The source says the private hosted zone is "attached to the Resolver inbound endpoint".
  - Hosted zones are associated with VPCs, not endpoints. I drew a dashed "resolve" lookup from the inbound endpoint to the zone, and did not draw an association.
  - The zone needs association with the ingress VPC.
- **Resource policy.** "Protected by a resource policy" is policy, not a component, so it is not drawn.
  - A private REST API normally requires that policy to allow the VPC endpoint.
- **Existing and new.** The "existing" Azure VPN Gateway and the "new" AWS Site-to-Site VPN are not distinguished on the canvas.

## Design risks, reported and not corrected on the canvas
- There is one VPN connection and one Azure VPN Gateway. No redundancy is stated or drawn.
- There is a single region per cloud.
- All three environments share one ingress, inspection and egress path, one DNS path and one VPC endpoint. This is a shared failure and blast-radius domain.
- The `{region}` value and the AWS Region boundary are not specified, so the Region level is folded into the title "AWS".
- No Azure subscription or resource-group boundary is drawn, because the source does not make them matter.

## Left out
- No business rules, schemas or sample data are in the source.
- No struck-out text is in the source.
- CIDRs are shown only for the three AWS VPCs, as the source gives them.

## Checks run
- `finalize.mjs`: file written in draw.io layout. It embedded 0 vendor icons, because all icons come from the draw.io catalog (Azure and AWS).
- `check-text.mjs`: clean.
- `check-layout.mjs`: 0 errors, 2 items. I judged both acceptable after inspecting the image:
  - The "2 DNS" label sits close to the Site-to-Site VPN caption, but they do not touch.
  - The "5 call" label sits next to the egress VPC outline, but it is clear of it in the render.
- `check-steps.mjs` against `scenario.md`: 0 items.
- `render.mjs`: rendered with the pinned draw.io viewer, and I inspected the PNG.
- Not verified: opening the file in draw.io Desktop or importing it into Lucidchart.

## Icons
- The Private Hosted Zone, the inbound and outbound endpoint boxes, and the forwarding ruleset use the plain-box fallback. `find-icon` found no exact catalog match for these.
- The AWS Resolver icons are "Route 53 Resolver".
- The VPC endpoint uses the catalog's "Endpoints" icon. It is the closest exact title for an interface endpoint, but the catalog entry is generic.
