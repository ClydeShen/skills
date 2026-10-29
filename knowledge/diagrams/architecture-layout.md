# Architecture layout

Use spatial structure to make the intended architecture easier to read. Domain membership and interaction meaning are constraints; direction, alignment and whitespace are design choices within them. Apply this guidance to architecture views with nested deployment or system boundaries, adapting it to the audience's question.

Start with what exists and where, how it interacts, and what constrains those interactions. Use standard visual vocabulary to express these facts accurately and richly. Do not turn this into a mandatory modeling framework, optimization formula or multi-view system. Establish the meaning, choose a simple arrangement, inspect the result, and repair concrete misunderstandings.

## Choose one primary reading direction

| View's main question | Useful default | When to adapt |
| --- | --- | --- |
| How does a request or event progress? | Left-to-right stages; parallel branches on aligned rows | A tall page or established convention may favor top-to-bottom. |
| What does this client depend on? | Clients above entry, application and deeper dependencies | Do not rank peer environments or identity providers as deeper just to fit the grid. |
| How do domains connect? | Peer domains side by side; ingress/egress face the relevant neighbor | Physical geography or multiple entry points may need another arrangement. |

These are English-diagram defaults, not universal perceptual laws. Use a secondary axis for a genuine distinction such as environment or parallel branch. Avoid making both axes imply different execution sequences. Arrows and labels remain authoritative; position reinforces them.

## Arrange the houses before routing

Establish what each boundary means and which nodes belong to it. Research platform constraints where they decide placement. Ask only for consequential project choices that available evidence cannot resolve. Never infer an account or trust-domain owner from adjacency alone.

Within each house, continue the main reading direction. Keep entry and exit near the appropriate sides, peers aligned, related nodes close, and unrelated groups separated. Reserve space for headings, captions, native labels and local notes before drawing edges. Prefer whitespace over an invented nested boundary. Keep repeated environments or branches in a stable order and preserve recognizable positions during revisions when practical.

## Route for traceability

Start with facing ports on a common row or column. Prefer a straight connector, then a simple orthogonal route. Keep a bend when it avoids a real obstacle, separates parallel calls or preserves domain transitions. If a route doubles back, check whether moving a node, choosing another port or making room removes the cause.

A connector's own inline label may interrupt its stroke. It should not force a detour. Other captions, notes, boundaries and unrelated elements remain obstacles. Cross only the domains required by the relationship. Crossing a firewall icon is not a substitute for an explicitly connected forwarding hop.

Reduce crossings and ambiguous shared segments before chasing the smallest bend count or page area. Retain readable captions and sufficient separation between parallel arrows. Do not straighten a path through another domain, merge distinct calls, duplicate a resource or reverse its direction merely to improve a geometric metric.

## Preserve information while improving presentation

Keep distinct architectural instances visible even when their icons, types and responsibilities repeat. Environment-specific workloads belong in their own deployment boundaries; use aligned repeated groups so readers can compare them. Reuse a drawing pattern without merging entity identity. A matrix can clarify relations between these visible objects, but cannot substitute for their existence. For a genuinely shared service, show one shared node unless a repeated view has explicit identity linkage. Mark representative physical multiplicity honestly; do not invent a fleet size from one icon.

Show the essential connections of every participating instance. Restoring an icon while leaving its paths to “same as above” prose still makes the reader reconstruct the graph. Shared downstream infrastructure may remain drawn once, provided every entry connects explicitly and branch conditions retain the correct destination. Keep true relation tables, such as permission matrices, when their rows and columns communicate the facts better than more arrows.

Bind every protocol, payload and response detail to the relationship it describes. A public API's JSON response does not specify every internal invocation. Express node responsibilities in concise captions and real data transformations at their responsible node or hop. Let containment establish ownership, directed edges establish interaction, parallel branches establish alternatives, and consistent alignment support comparison. Keep any spatial implication consistent with the source; placement alone must not invent sequence, exclusivity or ownership.

Every explanatory Note indicates a cost in visual communication. First inspect why the graph cannot express its fact. Move the information into supported structure, meaningful connectors or concise local labels when possible. A matrix is useful for repeated relations such as environment bindings or firewall allowances: use explicit row/column subjects and cells with a defined meaning. A paragraph inside a table, a giant node caption or a renamed white text box still has the same explanatory burden.

Names, protocols, conditions and compact notation keys are necessary diagram vocabulary; replacing all text with obscure pictograms would increase ambiguity. Preserve necessary qualifiers and unknowns. If one cannot be represented naturally, retain the minimal Note, report its design cost and state the unresolved limitation. A zero-Note count alone does not establish quality. Do not invent internal components, topology or deployment boundaries just to draw an illustration for a sentence.

Before accepting a revision, compare meaningful facts independently from layout: nodes, responsibilities, parents, directed relationships, contracts, conditions and exclusions. Then inspect the rendered artifact for route continuity, label fit and grouping. Blind image-to-description round trips measure information survival; source admission and vendor research assess whether the starting architecture is justified. Neither replaces the other.

Also review how the image communicates. Can the reader locate the entry, trace the main path, distinguish alternatives, find controls and identify transformations without detached explanations? Does each matrix expose a real relation? Does a caption identify its element and role without becoming a miniature document? Count and justify retained Notes separately from fidelity. Do not let a highly faithful wall of text pass as a well-designed diagram.

## Evidence and revision

The [research record](../../research/diagrams/architecture-diagram/layout-and-fidelity-2026-10-29.md) separates official guidance, abstract-only experimental evidence and project inference. These defaults have not been shown optimal across architectures or cultures.

- 2026-10-29: Initial synthesis under the owner's request to repair fidelity defects and improve intuitive layout. Keep future runtime instructions short; retain research, metrics and experiments outside the installed package.
- 2026-10-29: The owner rejected Note-heavy artifacts and explicitly made every Note a negative visual-design signal. Prefer structural expression; review communication quality independently from information survival. This is an owner-directed quality standard, not a new empirical claim about universal note-count thresholds.
- 2026-10-29: The owner requested first-principles simplicity: standard, accurate and information-rich diagrams, not a new layout platform. Repair concrete visual omissions and ambiguities before adding mechanisms.
