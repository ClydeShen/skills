# Companion account

Files: `diagram.drawio` (editable), `diagram.png` (rendered, inspected), `diagram.svg`.

## Scope
Left-to-right deployment/flow view of the one scenario in `scenario.md`. The source had a single scenario and no struck-out text. Nothing was excluded. The firewall rules are in a small table because they repeat per environment.

## Not drawn as an operational path
- **Route 53 Resolver outbound endpoint -> execute-api VPC endpoint (step 5).** An outbound endpoint forwards DNS queries. It does not carry HTTPS to an interface endpoint. The outbound endpoint is on the diagram in the egress VPC with no connector. API traffic runs inspection VPC -> VPC endpoint -> API Gateway -> Lambda. Please confirm what the outbound endpoint is for.
- **Private hosted zone "attached to the inbound endpoint".** A hosted zone is associated with a VPC, not an endpoint. I drew it in the ingress VPC with a "3 Resolve" link from the inbound endpoint. Its real association is unconfirmed.

## Inferences and unspecified details
- The function and logic apps are the callers (source says "A function app calls the API"). Each spoke shows both icons, labelled only "Function App" and "Logic App".
- Spoke-to-hub and spoke-to-DNS-VNet peering is implied by the source and not drawn as lines.
- DNS and API traffic share one tunnel, so one solid line runs from Azure Firewall through the VPN gateway, Site-to-Site VPN and Transit Gateway. It splits at the Transit Gateway: dashed to the ingress VPC (DNS) and solid to the inspection VPC (API).
- I drew inspection VPC -> egress VPC endpoint directly. The source says only that all three VPCs attach to the Transit Gateway. The hop is really made through the Transit Gateway, and the TGW-to-egress attachment is not drawn.
- The Site-to-Site VPN and Transit Gateway are placed in the AWS Cloud outside the network services account. The source does not name their account or region.
- The workload accounts' private REST APIs sit outside any VPC, as API Gateway is a managed service. The resource policy on each API is not drawn.
- The DNS Private Resolver has one icon in the catalog. I used it for both the inbound and the outbound endpoint. The forwarding ruleset is shown only as the "ruleset" label on the link between them. The `*.execute-api.{region}.amazonaws.com` pattern is in the table.
- Port 53 is given without a protocol, as in the source.
- No regions, zones or subnets are drawn, because the source gives none.

## Design risks (not on the canvas)
- A single VPN tunnel and a single Azure Firewall, VPN Gateway and Transit Gateway are shown. The source does not state redundancy.
- The shared Transit Gateway and VPN carry DNS and API traffic for all three environments. The per-environment separation rests on firewall rules alone.

## Layout and check results
- Final `check-text` is clean. The final `check-layout` run reports 0 errors and 3 crossings. All three come from the dashed DNS lines from the test and prod spokes crossing the solid API lines from the dev and test spokes. The spokes stack vertically and the DNS VNet and hub sit one above the other, so I left them. I did not change any meaning to remove them.
- Step numbers 1 to 5 follow the source order, which matches the drawn execution order. The "1 DNS" label sits on the dev spoke line only. The test and prod DNS lines are the same kind and unlabelled. "4 IDPS" and "5 HTTPS" labels sit close to the line ends.
- The line from the Site-to-Site VPN to the Transit Gateway and the tunnel from the VPN gateway have no arrowheads (undirected). The IPsec tag is in the VPN caption because the line has no room for a label between the two cloud outlines.
- I checked the PNG visually. I did not open the file in draw.io Desktop.
