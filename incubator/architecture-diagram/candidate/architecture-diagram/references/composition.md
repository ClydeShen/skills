# Composition

Plan the view on an invisible three-by-three grid before you place anything. The grid guides roles; real boundary membership wins when they conflict. Empty cells are fine.

## Split the view

Draw one view. Most architectures fit one page, and one page is easier to read than several: the reader sees every path and needs no cross-reference. Runtime calls and auxiliary relationships, such as telemetry, secrets and deployment, belong in the same view; solid and dashed lines tell them apart, so two concerns are not a reason to split.

Lay the view out on one page first. Split it only when that page still fails one of these limits after you have grouped elements and folded boundary levels:

- It needs a third kind of line or end.
- It is wider than about 1600 units at 16-point text.
- It needs more than three nested outlines.
- It has two main directions that cross.

Do not split to avoid a crossing, a crowded corner or a long label; fix those by placement. When you split, make as few pages as remove the failure, usually two, along the first axis that removes it:

| Axis    | Pages                                                                                                    | Removes                      |
| ------- | -------------------------------------------------------------------------------------------------------- | ---------------------------- |
| Concern | Runtime calls and data; then operations: build, deployment, management, telemetry and secrets            | A third kind of line         |
| Zoom    | An overview that draws each part as one box; then a detail page for each part the reader must see inside | Deep nesting, a wide page    |
| Flow    | One page per path or scenario, such as DNS resolution and the API call                                   | Two crossing main directions |

Apply the same limits to each new page, and split again only while a page still fails one. Never make a page with a single relationship. Show every path whole on at least one page: a detail page may show part of a path only when the overview shows all of it.

Split views are one system seen several ways, so they must read as one:

- Deliver them as pages of one `.drawio` file. Put the overview or runtime page first. Name each page by its question, such as "Overview", "Runtime" or "Operations".
- Give every page its own title, so that it reads alone; each page becomes its own PNG.
- Keep each element's name and icon the same on every page, and each line kind's meaning the same. A page that needs a key uses the same entries as the other pages.
- Link an overview box to its detail page, and use the page's title as the box's name. On the detail page, draw that part as the outer boundary, and show the outside elements it talks to at the edge, with their overview names.
- Keep the numbered steps of one flow on one page.
- When the user asks for one diagram, draw one. In the companion account, recommend the split that would show what one page cannot show clearly.
- List the pages, and the limit that made each split necessary, in the companion account.

## Choose one direction

| The view answers                                           | Direction               |
| ---------------------------------------------------------- | ----------------------- |
| How does a request or data travel?                         | Left to right (default) |
| How is the system tiered?                                  | Top to bottom           |
| What is built on what, or how does data rise from devices? | Bottom to top           |
| It must mirror an adjacent view or real geography          | Right to left           |

When a view needs a second main direction, split it by flow.

## Assign roles (left to right)

|                       | Left: origin          | Center: core                 | Right: destination                   |
| --------------------- | --------------------- | ---------------------------- | ------------------------------------ |
| **Top: control**      | DNS, identity         | Control plane, configuration | Monitoring, audit                    |
| **Middle: main path** | **Clients and entry** | **Core processing**          | **Primary data, downstream systems** |
| **Bottom: support**   | CDN, static entry     | Queues, asynchronous work    | Backup, standby, recovery            |

For top to bottom, the main path runs down the middle column through entry, processing and data. Auxiliary services go on the left and cross-cutting services on the right. For bottom to top, reverse that order, with foundations at the bottom. Right to left mirrors the table.

Start from who initiates. A main path begins at a client or external system, even when the source only implies that hop. Draw that hop, and note the inference in the companion account.

Treat a numbered list in the source as an unordered set of interactions while you lay out. Place services by their role and lane, and route without regard to the numbers. Number the steps afterwards, as [notation](./notation.md#step-numbers) describes, and keep every stated step on the diagram. Readers find a sequence by following its numbers, so the numbers need not run top to bottom or left to right. Never move an element out of its lane to put numbers in order.

Place a service that two flows share between those flows, so that both reach it directly. Do not leave it on one side, where the other flow must reach it by a long route.

## Place elements in boundaries

Decide what a deployment boundary, such as a region or network, contains, in this order:

1. The user's instructions and evident intent. Draw what the source places there.
2. Where the source is silent or unclear, the vendor's standard practice and platform constraints. For example, a load balancer's targets share its region and network, and the services that one workload uses are normally in that workload's region. Draw that placement, and name it as an inference in the companion account.
3. When nothing settles a service's location, leave it outside the boundary and say so.

When the source conflicts with vendor practice, such as a regional service in two regions or a target outside its load balancer's network, report the conflict before you draw. Quote the statement, name the practice it breaks, and recommend a placement. Wait for the user only when the conflict decides a central path. Otherwise, draw the recommendation and keep the conflict in the companion account.

Nest boundaries as the platform does: a deployment boundary, such as a region or network, contains logical boundaries, never the reverse.

Draw a connector from the element that acts. Attach a connector to a boundary only when every member acts, and then say so in its label.

## Emphasis

- Make the main path the most visible thing on the page. It must still read at a small size.
- The middle row comes before the outer rows; corners carry the least.
- Show the main path by its place, a straight run along the middle row in reading order, and by its step numbers. All connectors have one weight, as [notation](./notation.md#connectors) describes.
- Put about two to six elements in the center, and one or two in a corner. With more, group them.

## Route

- The main path moves in one direction along the middle row, straight where possible. It never turns back.
- An element usually takes input on the side that faces the origin and gives output on the opposite side. Auxiliary connections use the other two sides.
- Top and bottom rows join the main path vertically. They do not cross the middle row.
- A failure path runs on its own track beside the main path, in reverse, and shares no segment with it.
- Use orthogonal routes with at most two bends, and no more bends than the ends need: straight when the ends line up, one bend when they do not. A longer route means that an element or port is in the wrong place; move it. A connector never passes behind an element.
- An icon's caption owns the space below it: the placement's `labelWidth` wide and about 20 units per line deep. Attach connectors to the other three sides. When a connection must leave downward, move the caption beside the icon, or move the element. Do not bend the connector around the caption.
- Never bend a connector to avoid text. Move the label, the caption or the element instead, because a detour reads as a real path.
- Give each kind of flow its own lane, so that the layout tells them apart. The runtime path runs through the middle. Build, ingestion and management flows run along the top or a side. Telemetry runs along the bottom or a side. None of them cuts through the runtime path. A long secondary connector therefore runs along its lane around the outside, with two bends, not across the middle. It never leaves a boundary that holds both its ends.
- Order the ports on each side by where their targets sit, so that connectors from one side fan out without crossing. When two connectors cross, swap their ports, even if their step numbers then read out of order.
- Keep only the crossings that the architecture forces, such as a monitoring line over a lane. Do not trade meaning for fewer crossings: never move an element out of its true boundary, merge elements, or drop one to straighten a line.
- Connectors of different meaning never share a segment. Each connector leaves its own port on the element that acts and reaches its target alone. A shared run, or a line that ends on another line, reads as one connection. The layout check reports such a run as an error: connectors share a meaning only when they have the same label and line kind, and an unlabelled connector shares none. Fix every report; none is deliberate.
- A group of connectors must never read as an outline. When auxiliary connectors, such as secrets, telemetry or deployment, run around other elements and enclose them, readers take that shape for a boundary and the enclosed elements for its members. Place a support service that several elements use, such as a key vault or a monitoring service, in a support lane, where each user reaches it by a short direct line. Draw boundaries with solid outlines, as [cloud conventions](./cloud-conventions.md#boundaries) describe, so that a dashed connector never reads as a boundary.
- A connector stays inside every boundary that holds both its ends, and crosses a boundary's outline at most once. A connector that leaves and re-enters a boundary says the data left it. A connector that passes through a boundary says the data went there.
- Keep horizontal runs and waypoints out of caption bands. Below a row of captioned icons, put the first connector track at least the caption depth plus 20 units below the icons.
- Give each connector label a straight segment at least as long as its text width plus 40 units. Set its position and offset so that it sits on that segment, clear of every caption, title and icon. Space captioned neighbours at least one caption width apart, and further when a labelled connector runs between them.

## Align

- Align peers on shared lines with equal gaps. Equal spacing says "same group"; a larger gap says "different group".
- Mirror parallel zones and environments, so that the same role has the same position in each. A difference then has a meaning: a broken symmetry shows a real asymmetry, such as a tier that exists in only one zone.
- In a boundary, repeat the same logic at a smaller scale, with its entry facing the outside traffic. Go no deeper than two levels; deeper detail belongs in its own view.
- Stack instances across the main path, so that the main path meets one group.
- Put text fully inside its box. A caption never touches or crosses an outline.
- Pad each boundary evenly. Leave room for its title, and keep its children away from its edge.

## Fit a document

The PNG usually appears about 900 pixels wide in a wiki.

- Keep the page near 16:9 to 3:2, at most about 1400 units wide, with 16-point text. Over 1600 units wide, split the view; do not shrink the text.
- Give the view a descriptive title, and add nothing else above it. Name the view type only when it helps the audience. Scope belongs in the companion account, not in a subtitle.
