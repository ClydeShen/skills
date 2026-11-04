# Composition

Decide the views first, then plan each view on an invisible three-by-three grid before placing anything. The grid guides roles; real boundary membership wins whenever they conflict. Empty cells are fine.

## Split the view

A view answers one question for one reader. Split it when it must answer more than one, which shows as soon as a single view would need any of these:

- a third kind of line or end;
- a second main direction;
- more than three nested outlines, or boundary detail deeper than two levels;
- more than about six elements in the center;
- a page wider than about 1600 units at 16-point text.

Split along the first axis that removes the cause:

| Axis    | Pages                                                                                                    | Removes                                          |
| ------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Concern | Runtime calls and data; then operations: build, deployment, management, telemetry and secrets            | A third kind of line; auxiliary lines in the way |
| Zoom    | An overview that draws each part as one box; then a detail page for each part the reader must see inside | Deep nesting, a crowded center, a wide page      |
| Flow    | One page per path or scenario, such as DNS resolution and the API call                                   | Two main directions, tangled paths               |

Apply the same test to each new page and split again while a page still answers two questions. Stop when every page fits two kinds of line, three outlines and the page width, or when a further split would leave a page with a single relationship. Never leave a path whole on no page: a detail page may show part of a path only when the overview shows all of it.

Split views are one system seen several ways, so they must read as one:

- Deliver them as pages of one `.drawio` file, the overview or runtime page first, each named by its question, such as "Overview", "Runtime" or "Operations". Every page carries its own title and reads alone, because each becomes its own PNG.
- An element keeps its name and symbol on every page, and a line style or end keeps its meaning. A page whose connectors are all one kind needs no key; a page that needs one uses the same entries as the other pages.
- An overview box that has a detail page links to it, and its name is that page's title. The detail page draws that part as its outer boundary and shows the outside elements it talks to at the edge, with their overview names.
- Keep the numbered steps of one flow on one page.
- When the user asks for one diagram, draw one, and recommend in the companion account the split that would answer what it cannot show clearly. List the pages and why each exists in the companion account.

## Choose one direction

| The view answers                                           | Direction               |
| ---------------------------------------------------------- | ----------------------- |
| How does a request or data travel?                         | Left to right (default) |
| How is the system tiered?                                  | Top to bottom           |
| What is built on what, or how does data rise from devices? | Bottom to top           |
| It must mirror an adjacent view or real geography          | Right to left           |

Needing a second main direction means the view should be split by flow.

## Assign roles (left to right)

|                       | Left: origin          | Center: core                 | Right: destination                   |
| --------------------- | --------------------- | ---------------------------- | ------------------------------------ |
| **Top: control**      | DNS, identity         | Control plane, configuration | Monitoring, audit                    |
| **Middle: main path** | **Clients and entry** | **Core processing**          | **Primary data, downstream systems** |
| **Bottom: support**   | CDN, static entry     | Queues, asynchronous work    | Backup, standby, recovery            |

For top to bottom, the main path runs down the middle column through entry, processing and data, with auxiliary services on the left and cross-cutting services on the right. For bottom to top, reverse that order, with foundations at the bottom. Right to left mirrors the table.

Start from who initiates. A main path begins at a client or external system, even when the source only implies that hop. Draw it, and note the inference in the companion record.

Treat a numbered list in the source as an unordered set of interactions while you lay out: place services by their role and lane, and route without regard to the numbers. Number the steps afterwards, from the execution order the architecture implies, and keep every stated step on the diagram; see [notation](./notation.md). A reader finds a sequence by following its numbers on the page, so numbers need not read top to bottom or left to right; never move an element out of its lane to put numbers in order. Place a service that two flows share between those flows, so that both reach it directly; never leave it on one side for the other flow to reach by a long route.

Decide what a deployment boundary, such as a region or network, contains in this order. First, the user's instructions and evident intent: draw what the source places there. Second, where the source is silent or unclear, the vendor's standard practice and platform constraints: a load balancer's targets share its region and network, and services that one workload uses are normally deployed in that workload's region. Draw that placement and name it as an inference in the companion account. When nothing settles a service's location, leave it outside the boundary and say so. When the source states something that conflicts with vendor practice, such as a regional service in two regions or a target outside its load balancer's network, report the conflict before drawing: quote the statement, name the practice it breaks, and recommend a placement. Wait for the user only when the conflict decides a central path; otherwise draw the recommendation and keep the conflict in the companion account. Nest boundaries as the platform does: a deployment boundary such as a region or network contains logical boundaries, never the reverse. Draw a connector from the element that acts. Attach it to a boundary only when every member acts, and then say so in its label.

## Give weight

- The main path is the most visible thing on the page. If you squint, it still reads.
- Middle row before outer rows; corners carry the least.
- Give every connector one weight (`strokeWidth` 1.5). Readers barely tell weights apart and do not know whether thicker means more important or more traffic. Show the main path by its place, a straight run along the middle row in reading order, and by step numbers.
- Use about two to six elements in the center, and one or two in a corner. Over that, group them or split the view by zoom.

## Route

- The main path moves in one direction along the middle row, straight where possible. It never turns back.
- Elements usually take input on the side facing the origin and give output on the opposite side. Auxiliary connections use the other two sides.
- Top and bottom rows join the main path vertically. They do not cross the middle row.
- A failure path runs on its own track beside the main path, in reverse, and shares no segment with it.
- Use orthogonal routes with at most two bends, and no more than the ends need: straight when they line up, one bend when they do not. A longer route means an element or port is in the wrong place; move it. Connectors never pass behind an element.
- An icon's caption owns the space below it: the placement's `labelWidth` wide and about 20 units per line deep. Attach connectors to the other three sides. If a connection must leave downward, move the caption beside the icon or move the element; do not bend the connector around the caption.
- Never bend a connector to avoid text. Move the label, the caption or the element instead. A detour reads as a real path.
- Give each kind of flow its own lane, so the layout tells them apart. The runtime path runs through the middle. Build, ingestion and management flows run along the top or a side, and telemetry along the bottom or a side, so they do not cut through the runtime path. A long secondary connector therefore runs along its lane around the outside, with two bends, rather than across the middle; it never leaves a boundary that holds both its ends.
- Order the ports on each side by where their targets sit, so that connectors from one side fan out without crossing. When two cross, swap their ports, even if their step numbers then read out of order.
- A crossing that remains should be one the architecture forces, such as a monitoring line over a lane. Do not trade meaning for fewer crossings: never move an element out of its true boundary, merge elements or drop one to straighten a line.
- Connectors of different meaning never share a segment. Each leaves its own port on the element that acts and reaches its target alone; a run shared with another connector, or a line that ends on another line, reads as one connection. The layout check reports such a run as an error: connectors share a meaning only when they carry the same label and line style, and an unlabelled connector shares none. Fix every one; none is deliberate.
- Connectors must never read as an outline. Do not let auxiliary connectors, such as secrets, telemetry or deployment, run around other elements and together enclose them: a reader takes that shape for a boundary and its elements for members. Place a support service that several elements use, such as a key vault or a monitoring service, in a support lane where each user reaches it by a short direct line. Draw boundaries with solid outlines, as [cloud conventions](./cloud-conventions.md) describe, so that a dashed connector never reads as a boundary.
- A connector stays inside every boundary that holds both its ends, and crosses a boundary's outline at most once. Leaving and re-entering a boundary says the data left it; passing through a boundary says the data went there.
- Keep horizontal runs and waypoints out of caption bands: below a row of captioned icons, the first connector track lies at least the caption depth plus 20 units under the icons.
- Give each connector label a straight segment at least its text width plus 40 units long, and set its position and offset so that it sits on that segment clear of every caption, title and icon. Space captioned neighbours at least the caption width apart, and further when a labeled connector runs between them.

## Align

- Align peers on shared lines with equal gaps. Equal spacing says "same group"; a larger gap says "different group".
- Mirror parallel zones and environments, so that the same role sits at the same position in each. Then a difference means something: a broken symmetry should reveal a real asymmetry, such as a tier that exists in only one zone.
- In a boundary, repeat the same logic at a smaller scale, with its entry facing the outside traffic. Go no deeper than two levels of this; deeper detail belongs in its own view.
- Stack instances across the main path, so that it sees one group.
- Put text fully inside its box. A caption never touches or crosses an outline.
- Pad each boundary evenly. Leave room for its title, and do not let its children touch the edge.

## Fit a document

The PNG usually appears about 900 pixels wide in a wiki.

- Keep the page near 16:9 to 3:2 and at most about 1400 units wide, with 16-point text. Over 1600 wide, split the view instead of shrinking the text.
- Add at most a title. Remove subtitles describing scope; those belong in the companion record.
- Readers share only three connector meanings: a line relates two things, a solid line is the direct relation, and an arrowhead gives direction. Use one filled arrowhead, from initiator to callee, on every connector. Do not use open, double or missing heads, or circles, diamonds, triangles or bars at a line's end or on a boundary: each means something different in UML, ArchiMate and BPMN. Such an end is an added kind; use one only as the next rule allows, with a key row, or when the key declares that notation.
- Build views on two kinds of line: solid for runtime calls and data, and dashed for auxiliary relationships such as deployment, management, telemetry or secrets, each dashed line carrying a one-word label and long enough to show at least three dashes. Do not use dotted lines: readers and tools do not tell them from dashed. Never let colour carry meaning alone.
- When a view seems to need a third kind of line or end, first split it by concern, as [Split the view](#split-the-view) describes. Add a kind only when splitting cannot answer the reader's question, and then give it a key row with the same meaning on every page.
- When a view mixes styles, add a key in the lower right corner as a native draw.io table titled "Key": one row per style the view uses, including the plain solid line, with a short sample line in the left column and its meaning in the right, for example "Heavy: main path", "Solid: runtime call", "Dashed: secrets, telemetry". Add a row for a boundary style only when the boundary is not a vendor boundary style or a thin solid outline. A view whose connectors are all one kind of line, the same pattern, weight and colour, needs no key; two or more kinds need one. [draw.io authoring](./drawio.md) shows how to build the table.
