# Research: Architecture-diagram skill requirements and observed house style

Date: 2026-10-28. Subject: What the owner wants from an architecture-diagram skill, and which visual and structural conventions recur in the owner's real project diagrams. Context: Requirements for a skill that draws technical architecture diagrams in C4 terms. The initiative now owns prototype work and evaluation; no installable package exists yet. This note is the durable handoff so a fresh session can continue gathering requirements without the earlier conversation.

Confidence markers:
- **[owner]**: stated or confirmed by the owner in conversation on the stated date.
- **[observed]**: seen directly in the owner-supplied sample diagrams (11 images). Describes the samples only; it is not a claim about any vendor standard.
- **[inference]**: the author's judgment, with no direct evidence.
- **[unverified lead]**: a plausible claim that must be checked against a primary source before use.

## Status at handoff

- Decided: requirements R1-R6, the five structural rules, the C4 mapping, and every item in sections 2.5 to 2.9. [owner, 2026-10-28]
- Requirement gathering reached an empty decision frontier on 2026-10-28. What remains is checked on a rendered prototype: element descriptions do not clutter captions, and the icon size.
- Research done: [vendor and C4 conventions](vendor-diagram-conventions-2026-10-28.md) and [draw.io built-in libraries](drawio-builtin-icon-libraries-2026-10-28.md).
- Revised on 2026-10-28: four scenarios were approved later in this conversation and are now migrated to the initiative. The owner authorized work that can proceed without Scenario 05. Prototype and evaluation status are maintained in the initiative README; no `SKILL.md` has been created.
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
- S11 puts labels beside rather than on the lines, crosses lines heavily, and shows a non-AWS element (a source-repository service) with an icon that looks like an AWS developer-tools tile. This is the failure that R2 exists to prevent. At the initial observation its role was open; section 2.8 later records the owner's decision that it is a bad example.

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
| Every line is unidirectional. | Samples use double-headed arrows for two-way flows. | Initial conflict resolved by section 2.9: caller-to-callee line with notable response in its label. |
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
| Layout gates | Must pass: no line crosses another element or its caption; connector labels sit on and fit their host segments; consistent font size except native Note comments (section 2.11); zone titles stay clear of lines; no two lines share a path segment. Line-to-line crossings are minimized, not forbidden. The owner's subsequent clarification in section 2.10 makes boundary semantics a prerequisite, not a layout preference. |
| Evaluation | During incubation, a test set of 3-5 client-neutral synthetic scenarios modelled on the sample kinds. Each states the expected elements, the gates that must pass, and one planted common-sense error that tests ask-before-drawing. The owner reviews the scenarios before use. Four approved drafts are maintained in the initiative; Scenario 05 is deferred. |
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

### 2.10 Boundary semantics and connector labels [owner, 2026-10-28]

The owner rejected the Scenario 01 draw.io prototype after seeing an internal call routed outside its enclosing boundary to avoid text. Each boundary defines an architectural domain. A connector's path carries meaning as well as its endpoints: leaving the domain falsely depicts the interaction leaving that scope. This is an architecture correctness failure, not a cosmetic defect. It applies to logical system boundaries as well as deployment nodes; a logical boundary does not thereby become a physical network perimeter.

- Keep an interaction inside every boundary shared by its endpoints, including enclosing ancestors.
- Cross boundaries only where the interaction requires a domain transition. Do not route through unrelated domains or leave and re-enter a domain unnecessarily.
- Use native draw.io connector labels. Place the label on the line with an opaque background interrupting its own stroke. This is not the forbidden collision with another element's caption.
- Keep labels clear of boundary outlines and titles, so masking does not hide a domain transition.
- Prefer a direct path where it meets these constraints. Adjust node positions, spacing or boundary dimensions before adding detours.

Priority: architectural meaning and domain membership, then readability, then visual economy. Boundary meaning cannot be traded for a collision-free layout. This clarification supersedes any interpretation of the earlier layout gates that treated boundaries as free routing space. The [initiative evaluation](../../../incubator/architecture-diagram/evaluation.md) records the failed prototype and correction, not retrospective owner approval of the corrected image.

### 2.11 Annotation placement [owner, 2026-10-29]

The owner accepted the improved routing but found explanatory text scattered around the prototype. The owner approved organizing annotations by their subject and allowed nearby sticker-style comments and tables for structured explanations.

Place diagram-wide purpose or requirements below the title. Put local comments near their referenced element or step; use a folded-note shape when it improves the association. Identify the subject in the comment rather than relying on proximity alone. Use a compact table for repeated mappings such as notation and meaning, not for a single fact. Keep the legend in a consistent reserved area outside the deployment nodes and system boundaries.

The owner subsequently specified the built-in `Misc > Note` preset, not a custom style that merely uses `shape=note`. Use that native preset, including its automatic text fitting. The owner explicitly allowed Note text to scale for a more natural appearance on 2026-10-29. This is a narrow exception to uniform typography; architectural captions, boundary titles, connector labels and legend text retain their consistent size. Do not disable automatic fitting just to satisfy the earlier font-size gate.

Annotations explain the architecture; they are not services, boundaries or data-flow endpoints. Do not add a normal call arrow to attach a comment. Keep comment backgrounds clear of elements, captions, paths and boundary outlines. Do not reroute a call outside its domain to make room for a comment. Keep authoring assumptions, evaluation status and prototype caveats in the evaluation record, not in the formal diagram. Preserve necessary architectural assumptions through the existing ask-before-drawing rule; moving trial metadata out of the image does not authorize inventing facts.

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
- Superseded by the [built-in library research](drawio-builtin-icon-libraries-2026-10-28.md): coverage, catalog extraction, versions and written terms have been investigated. Real desktop offline rendering and specific platform behavior remain verification work.

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

2026-10-28: the owner authorized independent prototype work while offline and deferred Scenario 05. Continue from the [initiative README](../../../incubator/architecture-diagram/README.md), which owns current next steps, artifacts and verification status. Preserve pending owner review of icon size and description density. Research a separate icon set only if an adopted failure criterion warrants it. Candidate authoring follows prototype evidence; this migration creates no installable skill.

## Approved scenarios

The four owner-approved drafts now live in the [architecture-diagram initiative](../../../incubator/architecture-diagram/README.md). The scenario documents are the authoritative inputs and expectations:

- [Scenario 01 — token-based API authorization](../../../incubator/architecture-diagram/evals/scenario-01.md)
- [Scenario 02 — private cross-cloud API access](../../../incubator/architecture-diagram/evals/scenario-02.md)
- [Scenario 03 — SOAP request processing](../../../incubator/architecture-diagram/evals/scenario-03.md)
- [Scenario 04 — event-driven metadata sync](../../../incubator/architecture-diagram/evals/scenario-04.md)

Scenario 05 (Google Cloud or Kubernetes) is deferred while the owner is offline; no new scenario is represented as owner-approved.

## Sources

- Owner-supplied sample diagrams (11 images from a client project's internal wiki) and owner statements in the 2026-10-28 conversation. Source paths are deliberately not recorded here.
- C4 model, "Notation", https://c4model.com/diagrams/notation, and "Review checklist", https://c4model.com/diagrams/checklist, both accessed 2026-10-28. Source of the rules in section 2.5.
