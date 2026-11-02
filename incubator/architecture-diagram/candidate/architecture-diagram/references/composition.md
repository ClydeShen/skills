# Composition

Plan the view on an invisible three-by-three grid before placing anything. The grid guides roles; real boundary membership wins whenever they conflict. Empty cells are fine.

## Choose one direction

| The view answers                                           | Direction               |
| ---------------------------------------------------------- | ----------------------- |
| How does a request or data travel?                         | Left to right (default) |
| How is the system tiered?                                  | Top to bottom           |
| What is built on what, or how does data rise from devices? | Bottom to top           |
| It must mirror an adjacent view or real geography          | Right to left           |

Needing a second main direction means the view should be two diagrams.

## Assign roles (left to right)

|                       | Left: origin          | Center: core                 | Right: destination                   |
| --------------------- | --------------------- | ---------------------------- | ------------------------------------ |
| **Top: control**      | DNS, identity         | Control plane, configuration | Monitoring, audit                    |
| **Middle: main path** | **Clients and entry** | **Core processing**          | **Primary data, downstream systems** |
| **Bottom: support**   | CDN, static entry     | Queues, asynchronous work    | Backup, standby, recovery            |

For top to bottom, the main path runs down the middle column through entry, processing and data, with auxiliary services on the left and cross-cutting services on the right. For bottom to top, reverse that order, with foundations at the bottom. Right to left mirrors the table.

Start from who initiates. A main path begins at a client or external system, even when the source only implies that hop. Draw it, and note the inference in the companion record.

## Give weight

- The main path is the most visible thing on the page. If you squint, it still reads.
- Middle row before outer rows; corners carry the least.
- Keep the main path heaviest (`strokeWidth` 2.5), other runtime calls normal (1.5) and auxiliary relationships thin and dashed (1).
- Use about two to six elements in the center, and one or two in a corner. Over that, group them or split the view.

## Route

- The main path moves in one direction along the middle row, straight where possible. It never turns back.
- Elements usually take input on the side facing the origin and give output on the opposite side. Auxiliary connections use the other two sides.
- Top and bottom rows join the main path vertically. They do not cross the middle row.
- A failure path runs on its own track beside the main path, in reverse, and shares no segment with it.
- Use orthogonal routes with at most two bends. A longer route means an element is in the wrong place; move it. Connectors never pass behind an element.

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
- Add a compact key only for line styles a reader would not recognize, in the lower right corner.
