# Scenario 01 (owner-approved draft)

Approved by the owner on 2026-10-28. Migrated from the requirements handoff on 2026-10-28; this file now owns the scenario.

**Name:** Token-based API authorization with a policy decision service.

**Input text given to the skill:**

> A user signs in through a web sign-in page with a username and password. Amazon Cognito user pool authenticates the user and issues tokens. The ID token carries user attributes, for example:
> `{"cognito:username": "alex", "custom:tenantId": "T-001", "custom:type": "Customer", "cognito:groups": ["Customers"]}`
> The sign-in page verifies the user's password before sending it to Cognito.
> The web app sends the token with each API request to Amazon API Gateway. API Gateway passes the token to a Lambda authorizer. The Lambda authorizer verifies the token and asks the Amazon Verified Permissions decision endpoint whether the request is allowed. If it is allowed, API Gateway forwards the request to the backend APIs. If authorization fails, API Gateway returns HTTP 403 with an authorization error message.

**Planted common-sense error:** "The sign-in page verifies the user's password." The skill must raise it with a recommendation (Cognito verifies the password; the page only collects and submits credentials) and wait for confirmation.

**Questions the skill asks before drawing:**

1. The planted error.
2. Sign-in page technology. Recommendation: `[Container: Web app]`.
3. What the backend APIs are. Recommendation when unknown: a plain box with `[Container: REST API]`.
4. The API the authorizer calls on Verified Permissions. The skill checks AWS documentation first and asks only if that fails.

**Expected elements:**

- Person: User.
- Container: Web sign-in page.
- Deployment node: AWS Cloud, containing Amazon Cognito user pool; a boundary "API enforcement" with a bold title, containing Amazon API Gateway and Lambda authorizer; Amazon Verified Permissions; Backend APIs as a plain box.
- Note: token attribute example, placed near step 1.

**Expected relationships:**

| # | From → to | Line | Label content |
|---|---|---|---|
| 1 | Web page → Cognito | solid | Submit credentials and authenticate, returns tokens, with protocol |
| 2 | Web page → API Gateway | solid | API request with token |
| 3 | API Gateway → Lambda authorizer | solid | Pass token for authorization |
| 4 | Lambda authorizer → Verified Permissions | dashed (auxiliary call) | Named authorization query |
| 5 | API Gateway → Backend APIs | solid | Forward request after authorization |
| 5' | API Gateway → Web page | solid, bold label | HTTP 403 on authorization failure |

Plus "User uses web sign-in page".

**Gates:** the five layout gates; C4 notation (title, legend, type and technology lines, single-direction lines, protocols); icons only from the shape-name catalog with matching vendor; the token note near step 1.

**Owner feedback regression (2026-10-28):** the API Gateway to Lambda authorizer path stays entirely within API enforcement and AWS. The authorizer's query crosses the enforcement boundary once but never leaves AWS. External request/response paths cross only necessary boundaries, without re-entry or unrelated-domain transit. Connector labels sit on their lines without covering boundary outlines. The same-domain route outside enforcement is a failure even when no text is obscured. These assertions apply the [owner's clarification](../../../research/diagrams/architecture-diagram/requirements-and-observed-style-2026-10-28.md#210-boundary-semantics-and-connector-labels-owner-2026-10-28); they do not change the approved raw scenario input.

**Information checklist for the blind readout (11 items):** the user signs in through the page; Cognito authenticates and issues tokens; the token attributes; the page calls API Gateway with the token; the gateway hands the token to the Lambda authorizer; the authorizer verifies the token; the authorizer queries Verified Permissions; an allowed request is forwarded to the backend; a failed authorization returns 403; these services sit in AWS; the gateway and the authorizer form one enforcement group.
