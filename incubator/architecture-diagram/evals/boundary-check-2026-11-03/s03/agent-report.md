# Companion account

Files: `diagram.drawio` (editable), `diagram.png` (render), `diagram.svg`.

## Scope
Partner SOAP amend flow, left to right: partner integrators, Azure (APIM, B2C, Logic Apps workflows, Cosmos DB), then AWS (API Gateway, Validation engine Lambda). Step numbers follow the source list. Step 6 (validation inside the sub-workflows) has no connector of its own. Step 10 (response to the partner) is folded into the request arrows.

## Excluded (struck out in source)
- Returning a list of accessible registrations to `API-Route-Processor`.
- Extracting document_id and querying the `orders` container.

## Left off the canvas
- Authorization rules: `amend_document` needs ManageDocuments and `amend_order` needs ManageOrders. Both are shown as labels on the routing connectors. The mandatory user profile and the ManageOrders check against Cosmos DB are only summarised ("role and profile check", "account, profile").
- Profile requirement for **cancel order**: APIM requires a user profile for these requests. Only "role and profile check" appears.
- Error handling: internal errors such as an AWS timeout are hidden and the integrator gets a generic error. No failure path is drawn, because the source gives no status or payload.
- Sub-workflow checks (request XML, method, base64 content) and the Liquid template are not drawn as nodes. The label "9 JSON to XML" stands in for the Liquid transform.
- TBD in source: AWS amend API specification and sample response.

## Assumptions and inferences
- The partner-to-APIM hop is inferred from step 1. Existing integrators go to the Legacy SOAP API and new ones to the Partner SOAP API.
- The source says APIM authenticates against Azure AD B2C. I drew the call from the APIM icon, not from the individual API boxes.
- Both API boxes sit inside one APIM icon group. The source does not say whether they are two APIs in one APIM instance.
- The source does not say how `API-Route-Processor` picks a sub-workflow. I drew one connector per method (`amend_order` goes to the order sub-workflow, `amend_document` to the document sub-workflow) with the role as the label.
- The Cosmos DB account is shown as one query from `Common-Authx-Handler` (account name and profile name). Container names are not given.
- The VPN is not drawn as a symbol or network boundary. Azure and AWS are drawn as cloud boundaries only, with no VNet, VPC, subnet, region or zone, because the source gives none. The "7" connectors carry the XML-to-JSON wrapping but do not name the VPN, so the site-to-site VPN is not visible on the canvas.
- The source does not say where B2C, Cosmos DB and Logic Apps live in Azure, or where API Gateway and Lambda live in AWS. All are placed only inside the cloud boundary.
- The source says "the core platform" invokes the Lambda. The core platform is not drawn separately.
- The Lambda is called by API Gateway (step 8); no data store behind it is named.

## Icon notes
- No exact icons for the partner integrators or workflow nodes (Logic Apps workflows are boxes, with one Logic Apps group). The Logic Apps icon was not used; the group is a plain region.
- The draw.io catalog has no Azure AD B2C match under that exact name other than the one used (`Azure AD B2C`, identity palette). APIM uses `API Management Services` (integration palette).

## Design risks (not drawn)
- Single path with no redundancy shown: one VPN, one Lambda, one Cosmos DB account. Resilience is unstated.
- Cancel-order handling is mentioned in the source but has no distinct path in the flow.

## Source deviations
- Step numbers: authorization (4) and the Cosmos query share "4". The two partner-to-APIM arrows share "1" and the two APIM-to-route arrows share "3". The two sub-workflow-to-gateway arrows carry "7" and "9" together on one label.

## Checks performed
- `finalize.mjs`, `check-text.mjs` (clean), `check-layout.mjs` (0 errors; 11 items to check, listed below), `render.mjs`; PNG inspected.
- Remaining layout reports, left as is because clearing them would move elements off their real region or change meaning:
  - Labels "1 SOAP" (twice) and "7/9" (twice) touch the Azure outline, and label "3" on the partner path touches the Logic Apps outline. They sit on short connectors that must cross those boundaries.
  - e10/e11 labels sit near a bend; e10/e11 use a 2-bend route into API Gateway so the two connectors take separate ports.
  - e4 and e9 bend once where a straight route could be drawn. They use separate ports on API-Route-Processor so connectors of different meaning do not share a segment.
- Not verified: opening in draw.io Desktop (render used the pinned viewer only). Source fidelity was checked against `scenario.md`; technical plausibility of the real deployment was not.
