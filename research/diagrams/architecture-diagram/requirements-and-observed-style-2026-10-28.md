# Research: Architecture-diagram skill requirements and observed house style

Date: 2026-10-28. Subject: What the owner wants from an architecture-diagram skill, and which visual and structural conventions recur in the owner's real project diagrams. Context: Requirement gathering for a future skill that draws technical architecture diagrams in C4 terms. No initiative or package exists yet. This note is the durable handoff so a fresh session can continue gathering requirements without the earlier conversation.

Confidence markers:
- **[owner]**: stated or confirmed by the owner in conversation on the stated date.
- **[observed]**: seen directly in the owner-supplied sample diagrams (11 images). Describes the samples only; it is not a claim about any vendor standard.
- **[inference]**: the author's judgment, with no direct evidence.
- **[unverified lead]**: a plausible claim that must be checked against a primary source before use.

## Status at handoff

- Decided: requirements R1-R6, the five structural rules, the C4 mapping, and every item in sections 2.5 to 2.9. [owner, 2026-10-28]
- Requirement gathering reached an empty decision frontier on 2026-10-28. What remains is checked on a rendered prototype: element descriptions do not clutter captions, and the icon size.
- Research done: [vendor and C4 conventions](vendor-diagram-conventions-2026-10-28.md) and [draw.io built-in libraries](drawio-builtin-icon-libraries-2026-10-28.md).
- Not started: test scenarios, draw.io prototype, initiative README, any `SKILL.md`. Each waits for the owner to say start.
- The samples come from a client project's internal wiki. Do not copy the images, client names, system names or file paths into this repository. Record only client-neutral rules. [owner, confirmed]

## 1. Owner requirements (as stated)

| # | Requirement | Open detail |
|---|---|---|
| R1 | The skill draws technical architecture design diagrams in C4 terms. [owner] | Which C4 levels are in scope |
| R2 | Every diagram uses the official icons of each vendor (Azure, Google, AWS, Red Hat, Docker, Kubernetes, Argo CD and other common ones). The icon must match the element exactly. [owner] | Full vendor list; which icon-set version |
| R3 | Icon files stay out of the skill package, which would otherwise be too large. The skill references a shared location. [owner] | Trial approach decided, see section 2.7 |
| R4 | Output must follow a specific house style, taken from the owner's sample diagrams. [owner] | Specified in section 2 |
| R5 | Facts in the diagram must be correct and follow best practice. [owner] | Defined in section 2.6 |
| R6 | The diagram carries C4-like information but keeps the house style visually. The skill borrows C4's strengths to improve the samples, not C4's default look. [owner] | Which C4 rules to adopt, see section 2.5 |

The owner said the samples are real deliverables, contain flaws and are not always standard C4, and that the owner may not fully know C4 definitions. The style is still derivable from them. The skill should therefore reproduce the style and normalize the flaws. [owner]

## 2. Observed house style

### 2.1 Five structural rules (confirmed by the owner as the high-level pattern) [owner]

1. **Zones express boundary and ownership.** A zone is an outlined rectangle with a corner badge and a name. Zones nest, up to about three levels, and a zone's type is visible from its border and badge.
2. **Elements sit inside zones.** An element with an official icon is the icon with its name centered below. An element without an official icon is a plain white box with a thin grey border and centered text. People and external systems sit outside every zone, at the edge of the diagram.
3. **Connections express relationships.** Orthogonal lines with filled arrowheads. Each line carries a short text that states the relationship. Sequenced scenarios add step numbers (`1a.`, `1b.`).
4. **Layout has a direction.** Triggers and external parties on the left or top. The main flow advances along one direction. Zones group related elements, and a link between zones crosses the zone border.
5. **One diagram tells one scenario.** A short requirement or context note may sit at the top left.

### 2.2 Mapping to C4 [owner confirmed]

The samples are closest to a hybrid of the C4 Deployment and Container diagrams.

| In the sample | C4 concept |
|---|---|
| Zone with badge and name | Deployment node, or system boundary |
| Element with icon inside a zone | Container (or infrastructure node) |
| Person, or external system outside the zones | Person, External system |
| Labelled line | Relationship (description and technology) |

### 2.3 Detailed features [observed]

| Dimension | Feature | Seen in |
|---|---|---|
| Zone, cloud boundary | Thin dark-grey border. Dark square badge at the top left holding a cloud glyph (once a vendor wordmark). Small title beside it. | S2, S3, S4, S5, S6, S8, S9, S11 |
| Zone, second cloud | Light-blue border, the vendor logo at the top left, title beside it. | S2, S3, S6, S8, S9 |
| Zone, account | Pink or magenta border, a pink square badge with an account glyph, pink title. | S4, S5 |
| Zone, logical group | Thin grey border, bold title at the top left, no badge. Nested inside a cloud zone. | S2, S3, S6, S8, S9 |
| Zone, other types | Border style (solid, dashed, dotted) and colour mark different zone types in a landing-zone plan. Badge positions vary (top right, bottom right). A dedicated "third-party services" zone appears once. A dashed boundary labelled `[System]` appears in the C4-notation sample. | S7, S9, S10 |
| Icon, cloud service | About 72-96 px. Official tile style (coloured square, white glyph) and line-art style both occur. Tile colour follows the service category. Name centered below, sometimes with a resource name in parentheses. | all |
| Icon, no official icon | White box, thin grey border, centered text. Used for external systems, roles and custom services. | S1, S2, S3, S8, S9 |
| Person | Outline person glyph with the role below. A computer glyph may sit under it. | S2, S3, S9 |
| Third-party logo | Wordmark logo, often larger than other icons, sometimes in a thin box. | S4, S5, S6, S9 |
| Component notation | A rectangle with two small tabs on the left and a few small tech icons under it, used for an application. | S2, S3, S8, S9 |
| Line routing | Thin dark-grey orthogonal polylines, solid filled arrowheads. Double-headed arrows for two-way flows. | all |
| Line label | Short text sitting on the line, interrupting it. Bold for key steps or error paths. | all |
| Step numbering | `1a.`, `1b.` ... prefix on labels, in sequence. | S2, S3, S6, S8 |
| Area numbering | Numbered yellow circles that mark areas or touchpoints. They carry no order. Their meaning lives outside the diagram. | S9 |
| Line style | Dashed lines for authentication (S6) and for a query call (S4). All other flows are solid. | S4, S6 |
| Line colour | Two parallel business flows use two colours, and the external actor box takes the matching fill. Red marks emphasis once. | S6, S11 |
| Cross-zone link | A connector icon (VPN) sits on the gap between two clouds, with arrows on both sides. | S2, S3, S6, S8, S9 |
| Context note | A box at the top left with a bold heading `Requirement:` and a numbered list. | S2, S3, S8 |
| Cross-cutting boxes | Small unconnected boxes in a zone corner, such as monitoring and logging. | S9 |
| C4 notation | Diagram title, legend, system boundary labelled `[System]`, each element showing name, icon and `[technology]`, and relationship labels with `[protocol]`. Only one sample has this. | S10 |
| Diagram kind | Scenario flow: S1-S6, S8, S10. Whole-system overview with area numbers: S9. Infrastructure and resource-group plan with almost no relationships: S7. | |

Sample index (client-neutral): S1 import pipeline; S2 cross-cloud replacement-request flow; S3 cross-cloud data-retrieval flow; S4 multi-account alert forwarding; S5 multi-account log collection; S6 cross-cloud request flow with two colour-coded paths; S7 landing-zone and resource-group plan; S8 revised version of S3; S9 high-level touchpoint overview; S10 file-upload service in C4 notation; S11 auto-generated agent-workflow diagram.

### 2.4 Deviations treated as drift, not as style [inference]

The skill should normalize these rather than copy them:

- The same service shows different icon forms and colours across diagrams (two icon-set generations; tile versus line-art; storage as bucket outline versus tile).
- Lines cross captions and other elements. Labels use inconsistent font sizes. Several parallel lines merge into one target.
- Large empty areas inside a zone. A spelling mistake in a line label.
- Diagrams lack a legend and the C4 element triple (name, type, technology), except S10.
- S11 puts labels beside rather than on the lines, crosses lines heavily, and shows a non-AWS element (a source-repository service) with an icon that looks like an AWS developer-tools tile. This is the failure that R2 exists to prevent. The owner has not said whether S11 is a bad example or a target.

### 2.5 C4 notation rules adopted for R6 [owner: adopt all, provisionally]

C4 leaves colours and shapes free and asks only for consistency and a key, so the house look can stay. The candidates below come from the C4 notation guidance and review checklist (see Sources). Each row states the gap it closes in the samples.

The owner adopted every row as a provisional baseline on 2026-10-28. If a rendered diagram becomes cluttered, adjust the rules during incubation based on that evidence, rather than removing them up front. [owner] Two-way flows are resolved in section 2.9: one line from caller to callee, no double-headed arrows.

| C4 rule | Gap in the samples | House-style form (proposal) [inference] |
|---|---|---|
| Every diagram has a title stating type and scope. | Only S10 has a title. | Title at the top left, above the requirement note. |
| Every diagram has a key explaining shapes, colours, border styles, line types and arrowheads. | Only S10 has a legend. Dashed lines and colour-coded flows are unexplained. | Small legend box in a free corner. Lists only notation that the diagram uses. |
| Every element states its type. | Missing everywhere except S10. | `[Container: technology]` line under the caption, in smaller grey text. |
| Every element has a short description. | Missing. | Optional one-line description under the type line. Open: may clutter icon captions. |
| Every container and component states its technology. | Partly covered by the icon. | Combined with the type line. The icon does not replace the text. |
| Every line is unidirectional. | Samples use double-headed arrows for two-way flows. | Conflicts with the house style. Owner decision needed. |
| Every line has a specific label consistent with its direction, avoiding words like "Uses". | Labels exist; some are generic. | Keep labels on the line, add a verb phrase. |
| Relationships between containers state a technology or protocol. | Mostly missing. | `[HTTPS]`, `[JDBC]` appended to the label or on a second line. |
| Acronyms are understandable or explained in the key. | Unexplained acronyms occur. [inference] | Explain in the legend. |
| Each diagram stands alone without narrative. | S9 area numbers depend on text outside the diagram. | Put the meaning of area numbers into the legend or the note. |

### 2.6 What "correct" means for R5 [owner, 2026-10-28]

Correctness has two layers, and the skill must meet both.

1. **Notation is correct.** The diagram follows the C4 rules adopted in section 2.5. [owner]
2. **Facts are correct.** The precondition is that the skill never invents a capability for a service. [owner] The owner gave two examples:
   - **Capability matches the element's role.** A frontend does not provide authentication. It can only configure authentication, which an identity service provides. Labelling the frontend as the authentication provider breaks common sense. [owner]
   - **Stated properties stay consistent across the diagram.** If one service is stated to sit in a private network, another service cannot reach it through public access. The diagram must not contradict itself. [owner]

Generalization of the examples into check categories. [owner confirmed, 2026-10-28]

| Category | What the skill checks | Evidence it relies on |
|---|---|---|
| Role and capability | Each element performs only responsibilities that its type can perform. A relationship label does not give an element a capability it lacks. | Common architecture knowledge; vendor documentation for a specific service's capabilities |
| Internal consistency | Network exposure, zone membership, trust boundary, direction and protocol of each relationship agree with what the diagram states elsewhere. | The diagram's own stated facts |
| Vendor capability | A named managed service is shown only with features and integrations it actually offers. | Vendor documentation, checked when uncertain |

The skill can check stated facts and common sense, not the user's real system. [inference]

When the user's own input breaks common sense or contradicts itself, the skill asks first, gives a recommendation with the question, and draws after the user answers. The recommendation states the problem and a corrected alternative, for example "the frontend configures authentication; an identity service provides it". It does not correct silently, and it does not draw the contradiction with a flag. [owner, 2026-10-28]

### 2.7 Icon approach for R2 and R3 [owner, 2026-10-28]

**Trial approach: draw.io built-in shape libraries.** The skill references the shapes that ship with draw.io and stores no icon files. If this proves insufficient, the owner will then work out a solution for publishing a separate icon set. That solution is not designed yet; a shared library of official vendor SVGs with a catalog, embedded into each file at generation time, is one candidate. [owner; candidate is inference]

Alternatives considered: a separate shared icon library (deferred until the trial fails), and linked image URLs (rejected: they break offline, behind a corporate proxy, and on link rot). [inference]

Rules for choosing an icon. [owner confirmed, 2026-10-28]

- The skill picks an icon only by exact lookup of service name and vendor in a catalog, never by visual similarity or fuzzy file-name match. Under the trial approach, the catalog maps each concept to a draw.io shape style name.
- A post-generation check confirms that every icon comes from the catalog and that its vendor matches the element's vendor. This prevents the S11 failure.
- One icon-set generation per vendor within a diagram.
- When no icon exists: use the house-style plain box (white, thin grey border, centered text) with the C4 type and technology line. Never borrow a similar icon from another vendor and never draw an imitation. A third-party product may use its official logo only where its terms allow.

Criteria that would trigger the switch to a separate icon set. [inference; superseded by failure criteria F1-F6, adopted in section 2.9]

- A required vendor (for example Red Hat or Argo CD) has no draw.io built-in shapes.
- The built-in shapes lag the vendor's current icon set in a way that matters to the team.
- Built-in shapes do not render offline in the team's draw.io setup.

### 2.8 Scope and vocabulary decisions [owner, 2026-10-28]

| Topic | Decision |
|---|---|
| Input | The first version accepts a text description (scenario, services, flows). Code or IaC input and redrawing an existing diagram are later extensions. |
| Diagram kinds | The first version draws scenario flows only. Overviews with area numbers (S9 type) and infrastructure plans (S7 type) are out of scope. |
| S11 | Bad example. Use it only to show what the skill must avoid. |
| Fact checks | The three categories in section 2.6 are confirmed, with none added. |
| Icon selection | The four rules in section 2.7 are adopted. |
| Vocabulary | Use C4 terms, not house terms such as "zone". Map each house zone type to a C4 concept (deployment node, boundary). The exact mapping per zone type waits for the C4 conventions research. Keep the terms in this note until the skill package has its own glossary; the repository `GLOSSARY.md` holds repository-wide terms only. |
| Confidentiality | Confirmed: only client-neutral rules enter this repository; no images, client names or system names. |
| Users | The owner's team also uses the skill. Installation, documentation and environment assumptions (for example a corporate proxy) must suit the team. |
| Missing information | The skill lists the gaps that affect correctness (for example network boundary, authentication provider, protocol), each with a recommended value, and draws after the user confirms. Layout-only details are the skill's own choice. |
| Deliverable | The first version delivers the `.drawio` file only. PNG or SVG export is a later extension. |
| Label language | English by default; another language only when the user asks. |
| Several scenarios in one description | The skill lists the scenarios it found, asks which to draw, and draws one diagram per scenario. |
| Uncertain vendor capability | The skill first checks the vendor's official documentation and cites it in its reply. If the documentation cannot be reached or does not answer the question, it falls back to the missing-information rule: ask with a recommendation, then draw. |
| Layout gates | Must pass: no line crosses a caption or an element; each line label fits its segment; one font size across the diagram; zone titles stay clear of lines; no two lines share a path segment. Line-to-line crossings are minimized, not forbidden. |
| Evaluation | During incubation, a test set of 3-5 client-neutral synthetic scenarios modelled on the sample kinds. Each states the expected elements, the gates that must pass, and one planted common-sense error that tests ask-before-drawing. The owner reviews the scenarios before use. Not written yet. |
| Test set content | The first scenario is a token-based API authorization flow (identity provider, API gateway with a custom authorizer, policy decision service, backend API), rewritten client-neutrally from a reference document the owner supplied. Only vendor service names and the flow enter the repository; no source path, image or client marker. Scenario 02 is a private cross-cloud API call from Azure to a private AWS API Gateway, rewritten client-neutrally from a second owner-supplied reference; its source text contains two vendor-capability errors that stay in the input as natural test points. Scenario 03 is an application-level cross-cloud request (SOAP gateway, authentication, workflow routing and authorization, conversion, a REST API in AWS), rewritten client-neutrally from a third owner-supplied reference; it tests request and response folding, parallel entry branches, struck-out input and natural internal inconsistencies. Scenario 04 is an event-driven cross-cloud flow (publish to object storage and a queue, poll from Azure, store metadata, retrieve on demand), rewritten client-neutrally from a fourth owner-supplied reference. Scenario 05 covers Google Cloud or Kubernetes; the multi-account log collection scenario is dropped because Scenario 02 covers multiple accounts. The set has five scenarios. [owner, 2026-10-28] |
| "Approximately the same information" | Two checks. (1) The owner looks at the diagram alone and judges whether it is understandable. (2) A fresh agent with no other context reads the rendered diagram and writes down what it says; its readout must carry about the same information as the input text. Intentional differences required by the rules (response folded into the request label, dashed auxiliary calls, added title, legend and type lines) count as a pass. [owner, 2026-10-28] Rendering the `.drawio` file to an image for that agent is not settled; draw.io desktop's command-line export is an [unverified lead]. |

### 2.9 Notation and icon decisions after the conventions research [owner, 2026-10-28]

Evidence: [vendor and C4 conventions](vendor-diagram-conventions-2026-10-28.md) and [draw.io built-in libraries](drawio-builtin-icon-libraries-2026-10-28.md).

| Topic | Decision |
|---|---|
| C4 mapping | Cloud, region, account, VPC and subnet are deployment nodes (nestable). A logical group that encloses the containers of one system is a software system boundary. Network devices such as a VPN gateway or a load balancer are infrastructure nodes. Roles are persons. Systems outside every boundary are external software systems. |
| Diagram type | Title format "Dynamic diagram (deployment view): <scenario>". The first version draws only this type. |
| Dashed lines | Dashed means an auxiliary call, such as authentication or a query. Every dashed line carries a label that names the call or action. The legend explains it. |
| Two-way flows | Owner explanation: the samples' double-headed arrows merged a request and its response onto one segment to keep the diagram from getting dense; this is a shortcut, not a notation. Double-headed arrows are not allowed. A request and its response are one single-direction line from the caller to the callee; the response gets no line of its own, and a notable response goes into the label, for example `3. Query order status [HTTPS]` with `returns status`. Two lines only when both sides initiate calls. [owner, confirmed] |
| Step numbering | Main sequence `1.` `2.` `3.`; a letter suffix only for parallel branches of one step, for example `2a.` and `2b.`. |
| Arrowheads | Filled arrowheads stay as a house-style feature. |
| Logical group title | Bold, kept as a house-style rule. |
| Cloud shape | Owner explanation: a cloud shape stands for a cloud service as an abstract black box, a simplified conceptual element. It is not a standard and means the same as a plain rectangle; the shape only makes the cloud-service nature easier to read. Use it only for a cloud service with no official icon that the diagram treats as a black box, such as a third-party SaaS whose inside is not shown; in C4 terms an external software system. The legend explains it. [owner, confirmed] |
| Docker, Argo CD, Red Hat | No official built-in draw.io icons. The first version draws them as plain boxes with the C4 type and technology line, for example `[Container: Docker]`. No Docker logo until authorization is confirmed. A separate icon set is deferred. |
| Failure path | Exception to the two-way-flow rule: a separate failure response, such as HTTP 403 back to the caller, gets its own single-direction line with a bold label. [owner, 2026-10-28] |
| Repeated environments | Draw one representative with its count, for example "Workload account (x3: dev, test, prod)", as stacked borders. The full environment list goes into a note. [owner, 2026-10-28] |
| DNS path and data path | When a scenario has a name-resolution path and a traffic path, draw them as two colour-coded flows under the parallel-flow rule: A for DNS (dashed, auxiliary), B for the request. [owner, 2026-10-28] |
| Change status (to be created, existing) | Not supported in the first version; a diagram shows the architecture only. A later rule may add a corner marker explained in the legend. [owner, 2026-10-28] |
| Struck-out input | Text inside `~~...~~` counts as deleted and is not drawn. Before drawing, the skill lists what it ignored so the user can catch a misreading. TBD items follow the missing-information rule. [owner, 2026-10-28] |
| Pull and polling direction | The arrow points from the initiator to the callee, for example listener to queue with "Poll for new messages [SQS API/HTTPS]"; returned messages go into the label. [owner, 2026-10-28] |
| Asynchronous interaction | No extra line style. The label states it, for example "Publish event [async, SQS]", and the legend explains "[async]". [owner, 2026-10-28] |
| Non-architectural input | Business rules, data schemas, sample data and alerting are not drawn. Before drawing, the skill lists what it left out. The blind-readout checklist counts architectural information only: elements, relationships, boundaries and key notes. [owner, 2026-10-28] |
| Non-AWS cloud boundary | A thin light-blue border, the vendor's official logo in the top-left badge, the title beside it. Kept as a house-style rule, since Azure and Google define no boundary style. [owner, confirmed] |
| AWS group colours | Follow the draw.io built-in library values, not the AWS deck. |
| Google Cloud category icons | A shared category icon counts as the official icon under R2. The caption and the type and technology line distinguish the products. |
| Required viewer | draw.io desktop must render the files correctly. Other viewers are added when the owner names the team's viewers. |
| Trial failure criteria | F1-F6 of the draw.io research note are adopted, with the stated F2 tolerance. |
| Shape-name catalog | Shipped with the skill package as text, stamped with its draw.io version, with a script that regenerates it. The skill pins draw.io to that version and regenerates the catalog on upgrade. |
| Colour-coded parallel flows | Allowed only when one scenario has two or more independent flows. At most three colours from a colour-blind-safe palette, each named in the legend. Each flow numbers its own steps (A1, A2 and B1, B2) so a black-and-white print still separates them. |
| Emphasis | Bold only, no red. Bold marks error or failure paths and is explained in the legend. |
| Requirement note | Optional. Drawn below the title only when the user's description states requirements. |
| Unconnected cross-cutting boxes | Not drawn in scenario flows unless they take part in the scenario. |
| Icon size | One icon size across the diagram, value fixed in the prototype. Third-party logos are scaled into the same box; captions always sit below it. |
| More samples | Not required. Google Cloud, Kubernetes, Red Hat and Argo CD are covered by the test scenarios; the owner may add samples later. |

## 3. Style prototype

A throwaway prototype draws a synthetic cross-cloud scenario in the style above. It shows nested zones with badges, icons with captions below, plain boxes, a person, a requirement note, step-numbered labels on lines, one dashed line, and a connector icon between two clouds. All icons are placeholders. They are not official vendor icons and use no vendor artwork.

- Generator: `make_sample.py` and the rendered `sample.svg`, in the session scratchpad `sample/` directory of the session that wrote this note. The scratchpad is session-specific and may not exist later. Regenerate from section 2 if needed.
- The owner reviewed the rendered prototype on 2026-10-28 and confirmed it matches the house style in section 2. [owner]
- It checks layout rules only: line labels fit their segments, lines avoid captions, zone titles stay clear of lines.
- It does not decide the output format. SVG was chosen only because it is fast to inspect. The output format is now draw.io (see decision 1); the next prototype should be a draw.io file.

## Not verified

- The recurring zone colours (dark grey cloud, pink account) and the tile colours by service category look like vendor conventions. [unverified lead] Check the vendors' official architecture-icon and diagram guidelines.
- Whether the two icon-set generations seen (for example two different colours for the same service) correspond to vendor icon-set versions. [unverified lead]
- Whether S10 comes from a specific C4 tool. [inference] Do not rely on it.
- The meaning of dashed lines beyond the two uses seen.
- The meaning of the yellow area numbers in S9.
- Everything about draw.io built-in shape libraries: which vendors and icon-set versions they cover, how often they update, whether they render offline, and their licensing terms. Not researched yet. [unverified lead]

## Decisions for the owner

1. **Output format**: decided on 2026-10-28. The skill produces draw.io files. [owner] The team draws mainly in Lucidchart, then draw.io; the owner chose draw.io without requiring native Lucidchart output. Lucidchart import of draw.io files was not checked and is not a requirement.
2. **C4 rules for R6**: all rows adopted provisionally. [owner] Still to confirm on a rendered prototype: element descriptions do not clutter icon captions. Two-way flows are resolved in section 2.9.
3. **Source of "correct" (R5)**: decided on 2026-10-28, see section 2.6. [owner] Contradictory user input: ask with a recommendation, then draw. [owner] The three check categories are confirmed (section 2.8).
4. **Icon-set version**: decided, the icon set of the pinned draw.io release (section 2.9). [owner]
5. **Dashed lines**: decided, auxiliary calls with a named label (section 2.9). [owner]
6. **Colour-coded parallel flows and step numbers**: decided (section 2.9). [owner]
7. **Diagram kinds in scope**: decided, scenario flows only (section 2.8). [owner]
8. **S11**: decided, bad example (section 2.8). [owner]
9. **C4 levels**: decided, dynamic diagram on a deployment view only (section 2.9). [owner]
10. **Rendering environment**: decided, draw.io desktop offline; other viewers when the owner names them (section 2.9). [owner]
11. **Confidentiality**: confirmed (section 2.8). [owner]
12. **More samples**: not required (section 2.9). [owner]

## Next steps

1. When the owner says start: write the 3-5 synthetic test scenarios (section 2.8) for owner review.
2. When the owner says start: build a throwaway draw.io prototype of one scenario with built-in shapes, to settle the open prototype checks (decision 2, icon size). Research the separate icon set only if a failure criterion F1-F6 fires.
3. Create `incubator/<initiative>/README.md` from the initiative template once the owner is ready to start the initiative.
4. Create a `SKILL.md` only when the owner explicitly asks to implement the skill.


## Appendix A: Scenario 01 (owner-approved draft)

Approved by the owner on 2026-10-28. Move it to `incubator/<initiative>/evals/` when the initiative exists, and delete it here in the same change.

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

**Information checklist for the blind readout (11 items):** the user signs in through the page; Cognito authenticates and issues tokens; the token attributes; the page calls API Gateway with the token; the gateway hands the token to the Lambda authorizer; the authorizer verifies the token; the authorizer queries Verified Permissions; an allowed request is forwarded to the backend; a failed authorization returns 403; these services sit in AWS; the gateway and the authorizer form one enforcement group.

## Appendix B: Scenario 02 (owner-approved draft)

Approved by the owner on 2026-10-28, including the E1 recommendation that may remove the outbound endpoint and the rule tables drawn as notes. Move it to `incubator/<initiative>/evals/` with Appendix A.

**Name:** Private cross-cloud API call from Azure to AWS API Gateway.

**Input text given to the skill:**

> Integration workloads in Azure need private access to internal REST APIs hosted in Amazon API Gateway in AWS.
>
> **Azure side.** The workloads run as Azure Function Apps or Logic Apps in one spoke VNet per environment (dev, test, prod). The spoke VNets connect to a hub VNet that contains Azure Firewall and an existing Azure VPN Gateway, and to a DNS extension VNet that hosts Azure DNS Private Resolver with an inbound endpoint and an outbound endpoint. A DNS forwarding ruleset attached to the outbound endpoint forwards `*.execute-api.{region}.amazonaws.com` to the IP addresses of the AWS Route 53 Resolver inbound endpoint.
>
> **Connectivity.** A site-to-site IPsec VPN connects the Azure VPN Gateway to a new AWS Site-to-Site VPN attached to an AWS Transit Gateway.
>
> **AWS side.** A network services account contains three VPCs attached to the Transit Gateway: an ingress VPC (10.1.0.0/20) with the Route 53 Resolver inbound endpoint, an inspection VPC (10.2.0.0/24) with AWS Network Firewall for IDPS, and an egress VPC (10.3.0.0/20) with an execute-api interface VPC endpoint and a Route 53 Resolver outbound endpoint. A private hosted zone for `execute-api.{region}.amazonaws.com` is attached to the Route 53 Resolver inbound endpoint. Each environment has its own workload account with a private REST API in API Gateway, protected by a resource policy and backed by a Lambda function.
>
> **Flow.** (1) A function app calls the API. Its DNS query goes to the private resolver's inbound endpoint and is forwarded by the ruleset. (2) The query travels through Azure Firewall and the VPN to AWS. (3) The Route 53 Resolver inbound endpoint resolves the name using the private hosted zone. (4) The API traffic is routed through the inspection VPC, where AWS Network Firewall inspects it. (5) The Route 53 Resolver outbound endpoint in the egress VPC forwards the request to the API Gateway VPC endpoint, and API Gateway invokes the Lambda function.
>
> **Firewall rules** (Azure Firewall and AWS Network Firewall, per environment): spoke subnet to Route 53 inbound endpoint IP, port 53; spoke subnet to `*.execute-api.{region}.amazonaws.com`, port 443.

**Natural errors the skill must raise with a recommendation:**

| # | Source claim | Recommendation | Evidence |
|---|---|---|---|
| E1 | The Route 53 Resolver outbound endpoint forwards the request to the API Gateway VPC endpoint. | An outbound endpoint forwards DNS queries out of a VPC, not application requests. The Transit Gateway routes the HTTPS request to the execute-api interface VPC endpoint. The outbound endpoint may be unnecessary here; ask whether to keep it. | AWS Route 53 Developer Guide, "Forwarding outbound DNS queries to your network", accessed 2026-10-28 |
| E2 | A private hosted zone is attached to the Route 53 Resolver inbound endpoint. | Associate the private hosted zone with the VPC, here the ingress VPC that holds the inbound endpoint. | AWS Route 53 Developer Guide, "Forwarding inbound DNS queries to your VPCs", accessed 2026-10-28. That a zone cannot attach to an endpoint is not quoted there; the skill rechecks at run time. |

**Other questions before drawing:** whether DNS queries also pass AWS Network Firewall (the port 53 rule suggests yes; recommend yes); the Lambda runtime (recommend `[Container: AWS Lambda]` when unknown).

**Expected elements:** an Azure boundary (light-blue, Azure logo) with spoke VNet (x3: dev, test, prod, stacked) holding Function Apps and Logic Apps, DNS extension VNet holding the Private Resolver inbound and outbound endpoints, and hub VNet holding Azure Firewall and Azure VPN Gateway; a Site-to-Site VPN connector on the gap between the clouds; AWS Cloud and Region holding the network services account (Transit Gateway as an infrastructure node; ingress VPC with the inbound endpoint and the associated private hosted zone; inspection VPC with AWS Network Firewall; egress VPC with the execute-api VPC endpoint) and workload account (x3, stacked) with API Gateway (private REST API, resource policy in its description) and Lambda; notes with the forwarding rule, the firewall rules and the environment list.

**Expected relationships:**

| Flow | # | From → to | Line | Label content |
|---|---|---|---|---|
| A, DNS | A1 | Function app → Private Resolver inbound endpoint | dashed | Resolve execute-api name [DNS] |
| | A2 | Private Resolver outbound endpoint → Route 53 inbound endpoint, through Azure Firewall, VPN and Transit Gateway | dashed | Forward query by rule [DNS 53] |
| | A3 | Route 53 inbound endpoint → private hosted zone | dashed | Returns the VPC endpoint private IP |
| B, API call | B1 | Function app → Azure Firewall | solid | API request [HTTPS 443] |
| | B2 | Azure VPN Gateway → AWS Site-to-Site VPN → Transit Gateway | solid | [IPsec] |
| | B3 | Transit Gateway → Network Firewall | solid | Inspect (IDPS) |
| | B4 | → execute-api VPC endpoint | solid | [HTTPS] |
| | B5 | VPC endpoint → API Gateway in the workload account | solid | Invoke private API, allowed by resource policy |
| | B6 | API Gateway → Lambda | solid | Invoke |

The outbound endpoint is left out if the user confirms its removal.

**Gates:** the five layout gates; C4 notation; icons only from the catalog, AWS and Azure each with their own; flow colours A and B explained in the legend and separable by numbering in black and white; the connector on the gap between the clouds.

**Information checklist for the blind readout (14 items):** callers in three Azure environments as Function Apps or Logic Apps; egress through the hub VNet's firewall and VPN gateway; DNS by Azure Private Resolver with a forwarding rule for the execute-api domain; IPsec site-to-site VPN between the clouds; Transit Gateway connecting three VPCs; the Route 53 inbound endpoint in the ingress VPC; the private hosted zone resolving the execute-api domain; inspection by Network Firewall; the request entering the execute-api VPC endpoint in the egress VPC; a private REST API controlled by a resource policy; Lambda behind the API; one workload account per environment; firewall rules for ports 53 and 443; DNS resolution and the API call as two separate paths.

## Appendix C: Scenario 03 (owner-approved draft)

Approved by the owner on 2026-10-28, including the E1 and E2 recommendations and the sub-workflows drawn as a nested group inside the inbound-processing boundary. Move it to `incubator/<initiative>/evals/` with Appendices A and B.

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

## Appendix D: Scenario 04 (owner-approved draft)

Approved by the owner on 2026-10-28, including G2 (no assumed private connectivity) and B1 drawn dashed under the query rule. Move it to `incubator/<initiative>/evals/` with Appendices A to C.

**Name:** Event-driven document metadata sync from AWS to Azure, with on-demand retrieval.

**Input text given to the skill (Markdown kept):**

> ## Requirements
> Cosmos DB in the Azure integration layer decouples Azure from AWS. If the connection between the two clouds fails, the integration platform can still serve some requests, for example finding documents.
>
> ## High level flow
> 1. When a document is published or a template version is approved, it is saved into Amazon S3 and, at the same time, an event with its metadata is added to Amazon SQS. In Azure, an SQS listener is set up in the outbound Logic App workflows to listen for new events.
> 2. The SQS listener inserts or updates the metadata in Cosmos DB, in the database and container that match the record type.
> 3. During document or template retrieval, a processing workflow queries Cosmos DB.
> 4. The processing workflow extracts the S3 reference from the metadata and passes it to the retrieving workflow.
> 5. The retrieving workflow retrieves the document from S3 using the reference and saves it into temporary blob storage.
> 6. The retrieving workflow saves the retrieved document into temporary blob storage and sends its blob reference back to the processing workflow.
>
> ## Components
> | Component | Description |
> |--|--|
> | Azure Logic Apps workflows | Orchestrate the tasks |
> | Azure Blob Storage | Temporary storage with a retention policy |
> | Azure Cosmos DB | NoSQL database for document metadata |
>
> ## Workflows
> **SQS-Document-Cosmos** is triggered by the documents queue and upserts metadata by document number:
> - *Published*: upsert and set `isAvailableForCollection = true`.
> - *Withdrawn*: if not yet sent or collected, set `isAvailableForCollection = false`; otherwise upsert `status = withdrawn` and `isAvailableForCollection = true`.
> - *Replaced*: for destination A or B, hide the original if it has not been sent, otherwise upsert the replacement; for destination C, always upsert the replacement.
> - Always update the timestamp on upsert.
>
> **SQS-Template-Cosmos** uses a separate SQS queue for templates and persists metadata by template ID. **SQS-Bundle-Cosmos** uses a separate SQS queue for bundles and persists metadata by bundle ID.
>
> ## Cosmos DB
> Database `Exports`, containers `Documents` (unique key `/documentNumber`), `Bundles` (`/bundleId`) and `Templates` (`/templateId`). Sample item:
> `{"isAvailableForCollection": true, "isSendOrCollected": false, "retryCount": 0, "documentNumber": "DOC.2025", "document": {"status": "Published"}}`
>
> ## Error handling
> | Scenario | Handling |
> |--|--|
> | Connection to S3 fails | Default HTTP retry; after retries the workflow terminates and an alarm is raised for the dev team |
> | Document not found in S3 | Alarm for the dev team |
> | Cannot connect to SQS | Alarm for the platform team |
>
> ## Upstream configuration
> | System | Notes |
> |--|--|
> | AWS SQS | TBD: how many SQS instances? One per record type, or one for all? |
> | AWS S3 | Authentication: AWS Signature |

**Natural inconsistencies and gaps the skill must raise with a recommendation:**

| # | Content | Recommendation |
|---|---|---|
| E1 | The workflows section gives each record type its own SQS queue; the upstream table says the number of queues is TBD. | Read it as three queues, drawn as "SQS queue (x3: documents, templates, bundles)" with the listeners also x3. Ask the user to confirm. |
| E2 | Steps 5 and 6 both describe saving into temporary blob storage. | Merge into one step: retrieve from S3, save to temporary blob storage, return the blob reference. |
| G1 | No producer of the S3 objects and SQS events is named. | A plain box in AWS, "Document publishing service [Software system]"; ask the user for its name. |
| G2 | No network path from Azure to S3 and SQS is stated. | Do not assume private connectivity. Recommend public HTTPS endpoints with AWS Signature authentication; ask the user to confirm. |

**Content the skill lists as not drawn:** the status rules, the Cosmos DB container and key structure, the sample item, the error and alarm table.

**Expected elements:** AWS Cloud with the document publishing service (plain box), Amazon S3 (document store) and Amazon SQS (x3, stacked); an Azure boundary (light-blue, Azure logo) with a boundary "Outbound workflows" (bold title) holding the SQS listener workflows (x3), the processing workflow and the retrieving workflow, all Logic Apps; Azure Cosmos DB (metadata store); Azure Blob Storage (temporary, retention policy); a note on the decoupling purpose.

**Expected relationships:**

| Flow | # | From → to | Line | Label content |
|---|---|---|---|---|
| A, write | A1 | Publishing service → S3 | solid | Save document [HTTPS] |
| | A2 | Publishing service → SQS | solid | Publish metadata event [async, SQS] |
| | A3 | SQS listener → SQS | solid | Poll for new messages [SQS API/HTTPS], returns events |
| | A4 | SQS listener → Cosmos DB | solid | Upsert metadata by record ID |
| B, read | B1 | Processing workflow → Cosmos DB | dashed (query) | Query metadata, returns S3 reference |
| | B2 | Processing workflow → Retrieving workflow | solid | Pass S3 reference, returns blob reference |
| | B3 | Retrieving workflow → S3 | solid | Get document [HTTPS, AWS Signature] |
| | B4 | Retrieving workflow → Blob Storage | solid | Save document temporarily |

**Gates:** the five layout gates and C4 notation; flow colours A and B and `[async]` explained in the legend; polling drawn from listener to SQS; no status rules, schemas or alarms in the diagram.

**Information checklist for the blind readout (13 items, architectural only):** the AWS publishing service stores documents in S3 and publishes events to SQS; one queue per record type; Azure listeners poll SQS; listeners upsert metadata into Cosmos DB; Cosmos DB decouples the clouds so documents can still be found when the link fails; the processing workflow gets the S3 reference from Cosmos DB; it passes the reference to the retrieving workflow; the retrieving workflow gets the document from S3; the document goes to temporary blob storage with a retention policy; the blob reference returns to the processing workflow; write and read are separate paths; S3 access uses AWS Signature; the workflows are Logic Apps in the outbound workflows group.

## Sources

- Owner-supplied sample diagrams (11 images from a client project's internal wiki) and owner statements in the 2026-10-28 conversation. Source paths are deliberately not recorded here.
- C4 model, "Notation", https://c4model.com/diagrams/notation, and "Review checklist", https://c4model.com/diagrams/checklist, both accessed 2026-10-28. Source of the rules in section 2.5.
