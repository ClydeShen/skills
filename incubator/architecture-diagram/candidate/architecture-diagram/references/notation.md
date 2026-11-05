# Diagram notation

Use one visual vocabulary for each diagram, and keep it the same on every page. C4's distinctions inform the model; do not repeat C4 type tags on the canvas.

## Elements and icons

Choose an icon at the level the source describes: service, resource or instance. An exact resource icon, such as a table or an email resource, can say more than a generic service logo. Do not add a resource that the source does not specify.

- Use the exact vendor or catalog match from `find-icon.mjs`, with the style and size it returns: a 72-unit square, or 40 high for a wide mark. Comparable icons then match.
- Use official icons from one pinned generation per vendor. Keep their colours. Do not crop, rotate, stretch, recolour or imitate them.
- When no exact icon exists, use a white box with a thin grey border and a true name. Do not borrow a similar icon.
- Give each element a short name. Add a role, technology or type only when it tells two elements apart. Keep other metadata in the file, not in the caption.
- Put the caption below or beside its icon, where it clearly belongs to it and leaves paths clear.
- Draw a structure that repeats identically, such as environments or a warm-standby region with the same stack, once, and label it with the count and names, such as "×3: dev, test, prod" or "Standby: same stack". Draw each copy only where the copies differ in a way the reader needs, and then show only the difference. Show a fleet as an exact multi-instance icon or a small stack of repeated icons, and state once that counts are representative when the source gives none. Do not show a fleet as one icon with the word "multiple".
- Keep people and external systems outside deployment boundaries.
- Do not use public or private subnet styles or lock icons to claim security properties that the source does not state.

[Cloud conventions](./cloud-conventions.md) say which boundaries to draw and how to nest them. Size each boundary to its contents and paths.

## Visual hierarchy

- Use muted boundary fills, thin outlines and a small palette whose colours keep one meaning.
- Keep boundaries visually below the icons and the main path.
- Tell a network boundary from a logical boundary by outline and fill: a network boundary has an outline, a logical boundary has a light fill. Name the kind in the title. Colour alone never carries the difference.
- Whitespace can group peers without a new boundary.
- Use a small text hierarchy: the title, then boundary titles, then element names, then connector labels, which are the smallest. Do not shrink a label to make it fit; remove detail or add space.

## Connectors

Readers share only three connector meanings: a line relates two things, a solid line is the direct relationship, and an arrowhead gives direction. Build every view on these.

- Draw one filled arrowhead on every connector. The arrowhead points where the request or the data moves.
  - A call points to the service it calls, such as a request to an API, a database or a model.
  - A read, pull, poll or sync of a stored thing points to the one that reads it. The stored things are a queue or topic, a secret store, configuration, a source repository and an image registry. Argo CD syncing from Git, an application reading a secret and a worker reading a queue each point from the store to the reader. An arrow into a queue or a secret store says that the sender writes there.
  - Use a verb on the line, such as "reads", "pulls" or "polls", when the direction could be taken the other way.
- When data or requests move both ways as separate steps, draw two connectors. Do not draw a double-headed arrow.
- Use two kinds of line. A solid line is the main flow: a request or data moving between components, including ingestion and tunnels. A dashed line is a supporting flow, such as deployment, management, telemetry, secrets, DNS resolution or replication.
- Give each dashed line a one-word label, and make it long enough to show at least three dashes.
- Do not use dotted lines. Readers and tools do not tell them from dashed lines.
- Give every connector one weight (`strokeWidth` 1.5). Readers barely tell weights apart, and they do not know whether a thicker line means more importance or more traffic. Show the main path by its place and its step numbers.
- Keep every line one dark neutral colour. The vendor icons carry the colour.
- Do not use open, double or missing arrowheads, or circles, diamonds, triangles or bars at a line end or on a boundary. Each of these means something different in UML, ArchiMate and BPMN.

When a view seems to need a third kind of line or end, split the view first, as [composition](./composition.md#split-the-view) describes. Add a kind only when a split cannot answer the reader's question. Then give it a key row, with the same meaning on every page. A notation such as UML is an exception only when the key names it.

## Key

A view with two or more kinds of line needs a key. A view whose connectors are all one kind (the same pattern, weight and colour) needs none.

- Draw the key in the lower-right corner as a native draw.io table titled "Key". [draw.io authoring](./drawio.md) shows how to build it.
- Give each kind of line or end one row, including the plain solid line: a short sample line on the left, and its meaning on the right, such as "Solid: main flow (request or data)" and "Dashed: supporting flow (deployment, secrets, telemetry)".
- Add a row for a boundary style only when it is not a vendor boundary style or a thin solid outline.

## Step numbers

Number steps only where execution order matters.

- When the source states an order, such as a numbered list, give each stated step's connector a number and a short action label. Give other interactions, such as sign-in or the user's request, a label without a number.
- When the source states no order, number interactions only when the order matters and the layout alone cannot show it.
- Number last, after the layout is settled. Number by the order in which the drawn architecture executes the steps: what must happen before what. The source's list order is evidence, not the numbering. When the logic differs from the list, number by the logic and note the difference in the companion account.
- Use branch suffixes or separate prefixes only when they make tracing easier.

## What each part says

Give each fact to the part of the diagram that can state it. Do not state a fact twice, and do not make one part imitate another.

| Part                                      | Says                                                                          |
| ----------------------------------------- | ----------------------------------------------------------------------------- |
| Icons, boundaries and position            | What exists and where it belongs                                              |
| Connectors, their direction and line kind | Who relates to whom, and in which direction                                   |
| Text                                      | Names, and what the drawing cannot state: protocol, condition, transformation |
| Companion account                         | Gaps, assumptions and doubts about the source                                 |
| Special characters                        | Nothing. No `→`, `↔`, `->`, `·` or `•` in any visible text                    |

A label that breaks this table is a signal. Do not reword it to pass. When the drawing already says it, remove the label. When the drawing cannot say it, the diagram is wrong or incomplete, so fix the drawing. When the source leaves it open, move it to the companion account.

## Labels

- Label a relationship when its action, protocol, branch condition or contract would otherwise be unclear. Keep the label to about three words: a name, role, verb, protocol, condition or value.
- Keep a stated distinction on its exact hop, such as synchronous replication, or wrapping XML in JSON.
- Do not label obvious forwarding hops. Do not write "[unspecified]" on lines; report material unknowns once, without guessed values.
- Put a label on its own straight segment, on an opaque background, clear of captions, boundary titles and outlines. A label may interrupt its own line; it must not cause a detour.
- Fold a normal response into its request. Label a response only when its content matters. Draw a separate return connector only for a failure that the source specifies, labelled with its condition or result. Do not invent denial behaviour.
- Show DNS as resolution, not as HTTP forwarding. Draw a separate DNS response only when its answer must be shown. Keep DNS and authentication separate from application traffic.
- Label origin retrieval differently from content delivery.

## Notes and tables

Prefer local labels to explanatory notes. Use a table only for a real repeated relation, such as firewall allowances, never in place of topology. When an explanation is still necessary, use the native `Misc > Note` preset with automatic text fitting. Place it near its subject, unconnected to any call arrow, and say in the companion account why it was necessary. Deleting an important fact is not simplification.

## Source claims the drawing does not confirm

- Do not infer load balancer type, exposure, network classification or target group configuration from where targets sit. Add deployment detail only when the source supplies or confirms it.
- A monitoring association does not claim an application call to an alarm. When its metric or caller is unknown, keep the endpoint at a logical scope; do not invent a component or API.
- Keep unconfirmed operational paths in the companion account, apart from established flows. In a view that the user asks to transcribe the source, mark such claims as unverified.
