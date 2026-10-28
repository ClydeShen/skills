# Scenario 03 (owner-approved draft)

Approved by the owner on 2026-10-28, including the E1 and E2 recommendations and the sub-workflows drawn as a nested group inside the inbound-processing boundary. Migrated from the requirements handoff on 2026-10-28; this file now owns the scenario.

**Name:** Partner amendment requests through a SOAP gateway to a validation API in AWS.

**Input text given to the skill (Markdown kept):**

> ## High level flow
> 1. Existing partner integrators send SOAP requests to the existing legacy endpoint, routed to the *Legacy SOAP API* in Azure API Management (APIM). New partner integrators send requests to a new endpoint, routed to the *Partner SOAP API* in APIM.
> 2. In APIM, the request is authenticated against Azure AD B2C with either basic auth or bearer auth. APIM also checks the roles of the system account and the presence of a user profile, as it is mandatory for **cancel order** requests.
> 3. The authenticated request is passed to the `API-Route-Processor` Logic App workflow.
> 4. `API-Route-Processor` passes the authorization check to the `Common-Authx-Handler` workflow, which queries Cosmos DB by system account name and user profile name
>    1. to check whether the user profile has the required role
>    2. ~~to get a list of accessible registrations and pass it back to `API-Route-Processor`~~
> 5. Authorized requests are passed to the sub-workflows `Amend-Order-Processor` and `Amend-Document-Processor`.
> 6. The sub-workflows validate the request XML and the request method, and check that the base64-encoded content is not malformed. ~~They extract the document_id and query the `orders` container in Cosmos DB to check that the order exists and is accessible.~~
> 7. The sub-workflow wraps the decoded XML in JSON and calls the amend API in AWS API Gateway over the site-to-site VPN.
> 8. In AWS, API Gateway invokes the *Validation engine* Lambda function in the core platform, which performs business rule validation.
> 9. The JSON response returns to the sub-workflow, which converts it to XML with a Liquid template.
> 10. The workflow sends the XML response back to the partner integrator.
>
> ## Authorization rules
> - SOAP method `amend_order` requires the user profile role **ManageOrders**.
> - SOAP method `amend_document` requires the user profile role **ManageDocuments**.
> - The user profile is mandatory and, based on the Cosmos DB result, needs the **ManageOrders** role.
>
> ## Error handling
> Internal errors, for example a timeout on the AWS call, are hidden. The integrator receives only a generic error response.
>
> TBD: AWS amend API specification. Sample response: TBD.

**Natural inconsistencies the skill must raise with a recommendation:**

| # | Source claim | Recommendation |
|---|---|---|
| E1 | Step 2: the user profile is mandatory "for cancel order requests", in a document about amendments. | Read it as "for amend requests"; it looks copied from another design. |
| E2 | `amend_document` requires ManageDocuments, but the last rule says every user profile needs ManageOrders. | Per method: `amend_order` needs ManageOrders, `amend_document` needs ManageDocuments. Remove or rewrite the last rule. |

**Other statements and questions before drawing:** list the ignored struck-out content (accessible registrations in 4.2; the `orders` query in step 6); the TBD AWS API specification (recommend the label `[HTTPS/JSON]` with no operation name); APIM's system-account role check and the handler's user-profile check are two separate checks (recommend drawing both).

**Expected elements:** outside every boundary, two external software systems as plain boxes (existing partner integrators, new partner integrators); an Azure boundary (light-blue, Azure logo) with API Management holding the Legacy SOAP API and the Partner SOAP API, Azure AD B2C, a boundary "Inbound processing" (bold title) holding API-Route-Processor, Common-Authx-Handler and a nested sub-workflows group with Amend-Order-Processor and Amend-Document-Processor (XML and JSON conversion in their descriptions), and Azure Cosmos DB (roles and permissions); a VPN connector on the gap between the clouds; AWS Cloud with API Gateway and a boundary "Core platform" holding the Validation engine (Lambda); a note with the method-to-role table.

**Expected relationships:**

| # | From → to | Line | Label content |
|---|---|---|---|
| 1a | Existing integrators → Legacy SOAP API | solid | Amend request [SOAP/HTTPS], returns XML response |
| 1b | New integrators → Partner SOAP API | solid | Same |
| 2 | APIM → Azure AD B2C | dashed (auxiliary) | Authenticate (basic or bearer) |
| 3 | APIM → API-Route-Processor | solid | Pass authenticated request |
| 4 | API-Route-Processor → Common-Authx-Handler | solid | Authorization check |
| 5 | Common-Authx-Handler → Cosmos DB | dashed (auxiliary) | Query roles by system account and user profile |
| 6a, 6b | API-Route-Processor → Amend-Order-Processor or Amend-Document-Processor | solid | Forward authorized request |
| 7 | Processor → API Gateway, through the VPN | solid | Amend request [HTTPS/JSON], returns JSON response |
| 8 | API Gateway → Validation engine | solid | Invoke: business rule validation |
| Failure | APIM → integrators | solid, bold label | Generic error only, on internal error |

Source steps 9 and 10 are responses; they fold into the labels of 7 and 1a/1b.

**Gates:** the five layout gates and C4 notation; AWS and Azure icons from their own vendors; no double-headed arrows; no struck-out content in the diagram; entry branches numbered 1a and 1b.

**Information checklist for the blind readout (13 items):** two kinds of partner; two SOAP APIs in APIM as entry points; authentication by Azure AD B2C; APIM's system-account role check; routing through API-Route-Processor; Common-Authx-Handler querying user roles in Cosmos DB; requests split by method into two sub-workflows; XML and base64 validation in the sub-workflows; XML and JSON conversion; the call to AWS API Gateway through the VPN; business rule validation in Lambda; the method-to-role table; generic error responses for internal errors.
