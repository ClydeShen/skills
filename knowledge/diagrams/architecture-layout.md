# Architecture layout

Use spatial structure to make the intended architecture easier to read. Domain membership and interaction meaning are constraints; direction, alignment and whitespace are design choices within them. Apply this guidance to architecture views with nested deployment or system boundaries, adapting it to the audience's question.

Start with what exists and where, how it interacts, and what constrains those interactions. Choose an emphasis supported by the evidence: a high-level logical view need not pretend to specify a deployment. Distinguish source-stated relationships from technically established operations, inferred paths and recommendations. Preserve unresolved source claims in a concise companion record instead of promoting them to runtime arrows. A faithful transcription can still reproduce a source error. Use standard visual vocabulary without introducing a mandatory modeling framework, optimization formula or fixed set of views.

## Choose one primary reading direction

| View's main question                  | Useful default                                                       | When to adapt                                                                       |
| ------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| How does a request or event progress? | Left-to-right stages; parallel branches on aligned rows              | A tall page or established convention may favor top-to-bottom.                      |
| What does this client depend on?      | Clients above entry, application and deeper dependencies             | Do not rank peer environments or identity providers as deeper just to fit the grid. |
| How do domains connect?               | Peer domains side by side; ingress/egress face the relevant neighbor | Physical geography or multiple entry points may need another arrangement.           |

These are English-diagram defaults, not universal perceptual laws. Use a secondary axis for a genuine distinction such as environment or parallel branch. Avoid making both axes imply different execution sequences. Arrows and labels remain authoritative; position reinforces them.

## Arrange the houses before routing

Establish what each boundary means and which nodes belong to it. Research platform constraints where they decide placement. Ask only for consequential project choices that available evidence cannot resolve. Never infer an account or trust-domain owner from adjacency alone.

Within each house, continue the main reading direction where it helps. Keep related nodes close and align peers that benefit from comparison. Size regions for their contents and paths; equal columns are useful for comparable deployments, not obligatory for a sparse standby zone. Place supporting services where their relationships are easy to trace, without prescribing one side. Reserve space for headings, captions and paths before drawing edges. Prefer whitespace over an invented nested boundary and a light-filled region over another competing outline when membership remains clear. Retain meaningful ownership, trust and deployment boundaries.

Give color and line style stable roles, keeping main paths legible and surrounding frames secondary. Muted region fills can separate tiers while service symbols carry stronger color. Choose an exact service, resource or instance symbol for the described entity, not a more generic logo by habit. Captions may sit below or beside symbols according to available space and association. Logical groups such as shared scaling membership must remain distinguishable from network boundaries. Symmetry should expose true equivalence; preserve asymmetric roles. Do not recolor vendor symbols or add security-looking badges merely to resemble a reference.

## Decide which houses to draw

No vendor publishes a cross-cloud boundary standard. AWS defines a group as an icon and a label, lets some groups span others (Auto Scaling) and nest others (VPC and subnets), and asks for a generic group, or a custom group that carries the service icon, when no preset fits. Azure asks only for accuracy, such as not drawing a PaaS service inside a subnet it reaches through a private endpoint. Google Cloud gives no grouping guidance. C4 treats a boundary as a nestable deployment node, scoped to one environment, with load balancers, DNS and firewalls as infrastructure nodes. The rules below synthesize these sources for any cloud; the synthesis is project inference, recorded in the [vendor conventions research](../../research/diagrams/architecture-diagram/vendor-diagram-conventions-2026-10-28.md).

A house answers one of four questions:

| Kind              | Question it answers          | Examples                                            |
| ----------------- | ---------------------------- | --------------------------------------------------- |
| Ownership, place  | Who owns it, where it runs   | Cloud, account, subscription, project, region       |
| Network isolation | What can reach what          | VPC, VNet, subnet                                   |
| Runtime host      | What the members run on      | Kubernetes cluster, scaling group, workflow, server |
| Logical group     | What shares a responsibility | A light-filled group of services with one job       |

- Draw a level only when it separates elements the reader must tell apart, such as a trust, failure or exposure boundary, or when it holds at least two drawn members. Otherwise fold it: name a single region in its parent's title, omit subnets whose public or private role decides nothing, and draw a host with no drawn members as one icon.
- A house that represents a service is that service. Mark it with the service icon at the top left and the name beside it, using the vendor preset where one exists and a generic group with the service icon otherwise. Do not draw the same service again as a node inside it.
- Draw availability zones only when zonal redundancy is the point of the view, and follow the cloud's hierarchy: an AWS zone contains its subnets, while Azure and Google Cloud subnets span zones, so their zones are lanes across subnets rather than another nesting level.
- Security groups and network security groups are policy, not location. Outside a security view, state the access rule on the connector or in the companion record instead of drawing a house per group.
- Keep to three nested outlines in one view; a light fill without an outline separates without adding one. Deeper nesting means the view answers too many questions; split it into an overview and a network or runtime view.

## Split a view that answers two questions

One view answers one question for one reader. Symptoms of a second question are a third kind of line, a second main direction, deep nesting, a crowded center or an oversized page. Split along the axis that removes the symptom: by concern (runtime against operations), by zoom (an overview with detail pages, as in C4's levels) or by flow (one path or scenario per view). Apply the same test to each new view. Views split from one diagram are one system seen several ways: keep names, symbols and line meanings identical across them, and link each overview element to its detail.

## Route for traceability

Start with facing ports on a common row or column. Prefer a straight connector, then a simple orthogonal route. Keep a bend when it avoids a real obstacle, separates parallel calls or preserves domain transitions. If a route doubles back, check whether moving a node, choosing another port or making room removes the cause.

A connector's own inline label may interrupt its stroke. It should not force a detour. Other captions, notes, boundaries and unrelated elements remain obstacles. Cross only the domains required by the relationship. Crossing a firewall icon is not a substitute for an explicitly connected forwarding hop.

Reduce crossings and ambiguous shared segments before chasing the smallest bend count or page area. Retain readable captions and sufficient separation between parallel arrows. Do not straighten a path through another domain, merge distinct calls, duplicate a resource or reverse its direction merely to improve a geometric metric.

## Preserve information while improving presentation

Keep distinct architectural instances visible even when their icons, types and responsibilities repeat. Environment-specific workloads belong in their own deployment boundaries; use aligned repeated groups so readers can compare them. Reuse a drawing pattern without merging entity identity. A matrix can clarify relations between these visible objects, but cannot substitute for their existence. For a genuinely shared service, show one shared node unless a repeated view has explicit identity linkage. Represent a fleet with a reliable multi-instance symbol or a small repeated set, and qualify illustrative counts once when unspecified. One ordinary icon plus “multiple” leaves the main distinction in prose.

Show the essential connections of every participating instance. Restoring an icon while leaving its paths to “same as above” prose still makes the reader reconstruct the graph. Shared downstream infrastructure may remain drawn once, provided every entry connects explicitly and branch conditions retain the correct destination. Keep true relation tables, such as permission matrices, when their rows and columns communicate the facts better than more arrows.

Bind every protocol, payload and response detail to the relationship it describes. A public API's JSON response does not specify every internal invocation. Express node responsibilities in concise captions and real data transformations at their responsible node or hop. Let containment establish ownership, directed edges establish interaction, parallel branches establish alternatives, and consistent alignment support comparison. Keep any spatial implication consistent with the source; placement alone must not invent sequence, exclusivity or ownership.

Every explanatory Note indicates a cost in visual communication. First inspect why the graph cannot express its fact. Move the information into supported structure, meaningful connectors or concise local labels when possible. A matrix is useful for repeated relations such as environment bindings or firewall allowances: use explicit row/column subjects and cells with a defined meaning. A paragraph inside a table, a giant node caption or a renamed white text box still has the same explanatory burden.

Use text where visual structure leaves ambiguity: identity, primary/standby roles, specified protocols, exact-hop contracts, conditions and transformations. Omit repeated type tags and obvious forwarding descriptions; use numbering and a legend only when they help trace or interpret the view. Report material unspecified details together rather than placing an unknown-value placeholder on every element or edge. Preserve necessary qualifiers even when they require text. A zero-Note count alone does not establish quality, and neither does a lower word count.

Before accepting a revision, compare meaningful facts independently from layout: nodes, responsibilities, parents, directed relationships, contracts, conditions and exclusions. Then inspect the rendered artifact for route continuity, label fit and grouping. Blind image-to-description round trips measure information survival; source admission and vendor research assess whether the starting architecture is justified. Neither replaces the other.

Also review how the image communicates. Can the reader locate the entry, trace the main path, distinguish alternatives, find controls and identify transformations without detached explanations? Does each matrix expose a real relation? Does a caption identify its element and role without becoming a miniature document? Count and justify retained Notes separately from fidelity. Do not let a highly faithful wall of text pass as a well-designed diagram. Leave already clear choices alone; improve observed reading problems instead of applying every design suggestion to every element.

## Evidence and revision

The [research record](../../research/diagrams/architecture-diagram/layout-and-fidelity-2026-10-29.md) separates official guidance, abstract-only experimental evidence and project inference. These defaults have not been shown optimal across architectures or cultures.

- 2026-10-29: Initial synthesis under the owner's request to repair fidelity defects and improve intuitive layout. Keep future runtime instructions short; retain research, metrics and experiments outside the installed package.
- 2026-10-29: The owner rejected Note-heavy artifacts and explicitly made every Note a negative visual-design signal. Prefer structural expression; review communication quality independently from information survival. This is an owner-directed quality standard, not a new empirical claim about universal note-count thresholds.
- 2026-10-29: The owner requested first-principles simplicity: standard, accurate and information-rich diagrams, not a new layout platform. Repair concrete visual omissions and ambiguities before adding mechanisms.
- 2026-10-29: The [three-tier reference case](../../incubator/architecture-diagram/evals/three-tier-2026-10-29/README.md) exposed redundant frames, type tags and edge text despite broadly correct topology. The owner rated the first output 60/100 and preferred aligned tiers/AZs, restrained fills, repeated instance symbols and selective labels. These are adopted design directions; improved generation quality remains unverified.
- 2026-11-03: A clean session drew an EKS icon inside an "Amazon EKS cluster" house and a GitHub Actions node inside its own workflow house. The owner asked for one cross-provider standard for networking, zones, clusters and security that avoids dense nesting. The section on deciding houses synthesizes the existing vendor research; no vendor page could be re-read on that date because the session's network did not allow it.
