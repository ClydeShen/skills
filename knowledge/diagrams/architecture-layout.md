# Architecture layout

Use spatial structure to make the intended architecture easier to read. Domain membership and interaction meaning are constraints; direction, alignment and whitespace are design choices within them. Apply this guidance to architecture views with nested deployment or system boundaries, adapting it to the audience's question.

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

Bind every protocol, payload and response detail to the relationship it describes. A public API's JSON response does not specify every internal invocation. Use explicit subjects for important association notes. Use a table for repeated mappings and a nearby native note for a local explanation. Keep note emphasis subordinate to the architecture's primary reading path.

Before accepting a revision, compare meaningful facts independently from layout: nodes, responsibilities, parents, directed relationships, contracts, conditions and exclusions. Then inspect the rendered artifact for route continuity, label fit and grouping. Blind image-to-description round trips measure information survival; source admission and vendor research assess whether the starting architecture is justified. Neither replaces the other.

## Evidence and revision

The [research record](../../research/diagrams/architecture-diagram/layout-and-fidelity-2026-10-29.md) separates official guidance, abstract-only experimental evidence and project inference. These defaults have not been shown optimal across architectures or cultures.

- 2026-10-29: Initial synthesis under the owner's request to repair fidelity defects and improve intuitive layout. Keep future runtime instructions short; retain research, metrics and experiments outside the installed package.
