# Companion account: diagram.drawio

Files: `diagram.drawio` (editable, finalized) and `diagram.png` (rendered; `diagram.svg` also produced).

## Scope
High-level request and authorization flow, left to right: User, web app (sign-in page), Cognito user pool, API Gateway, Lambda authorizer, Verified Permissions, backend APIs. AWS services sit in one AWS Cloud boundary. The user, web app and backend APIs sit outside it. The source does not say where the backend APIs run, so they are a plain box (no exact icon) outside the boundary.
The 403 path is the only failure path and is dashed red.

## Excluded or not drawn
- Sample ID token JSON (username, tenantId, type, groups) is omitted as sample data. The diagram says only "ID token".
- "The sign-in page verifies the user's password before sending it to Cognito" is not drawn as a step. Cognito is the service that authenticates credentials. The source does not say what this client-side check does, so I did not draw it as an operational path. Please clarify whether it means client-side validation such as format or policy checks, or something else.

## Assumptions and inferences
- Cognito returning the token to the web app is shown as an "ID token" arrow, inferred from "issues tokens".
- API Gateway calling the Lambda authorizer and the authorizer calling Verified Permissions are drawn as stated. The Verified Permissions answer is folded into the request arrows. Only the 403 outcome is shown as a return.
- The source gives no numbered sequence, so no step numbers are used.
- The source does not state which token is used or how the Lambda authorizer verifies it, so the diagram does not either.

## Design risks
- API Gateway is drawn on the main row with the authorizer branch below it. The "Allowed" label on the backend arrow is the branch condition.
- The 403 arrow and the request arrow cross the AWS Cloud outline by necessity. The layout checker flags the 403 label as touching the outline. It does not hide the label, and I left it because it sits on the line between web app and API Gateway.
- The checker also flags the "ID token" label on the API Gateway to Lambda connector as sitting on a bend. I left it for the same reason.

## Checks performed
- `finalize.mjs`, `check-text.mjs` and `check-layout.mjs` were run. check-text is clean. check-layout reports two items (the label notes above). Earlier reports (label overlaps, a connector through a caption, uniform line weight) were fixed by repositioning.
- The PNG was rendered with the pinned draw.io viewer and inspected. I did not open the file in draw.io Desktop, so Desktop rendering is unverified.
- Icons come from `find-icon.mjs` (AWS aws4: Cognito, API Gateway, Lambda, Verified Permissions, User, Client, AWS Cloud group).
- Technical plausibility was not checked beyond the source, for example whether the authorizer can call Verified Permissions in this configuration.
