---
name: architecture-diagram
description: Create an editable draw.io architecture diagram and a PNG for documents and wikis from a text scenario, or refine a generated diagram against its source. Use for request, event, authentication or cross-cloud flows with deployment and system boundaries. Not for general flowcharts, infrastructure inventories, code/IaC reverse engineering or image tracing.
compatibility: Requires file access and Node.js 24. PNG export uses draw.io Desktop, or Git and Chromium or Chrome with network access on first use. With neither, it delivers the .drawio and a browser link for viewing and export. Targets draw.io v32.6.1. Catalog regeneration also requires the pinned draw.io source checkout. No model endpoint is required.
metadata:
  internal: true
---

# Architecture Diagram

Produce one editable `.drawio` architecture diagram and a PNG of each of its pages, which is what most readers see in a document or wiki. Choose a logical, deployment or flow emphasis that the task and available evidence support; do not imply implementation detail from a high-level description. Make the architecture legible through spatial structure, recognizable symbols and selective labels.

## Establish the architecture

Identify the scenario, distinct instances, responsibilities, boundary membership, directed interactions and important conditions. Use supplied context before asking questions.

If the input contains several scenarios, ask which one to draw. Exclude struck-out text. Briefly disclose excluded business-rule details, schemas, sample data and unrelated alerting.

Distinguish source-stated facts, inferred relationships, unspecified details and recommendations. A connection present in a source is not proof of a vendor capability or deployed operation. Check consequential vendor capabilities against official documentation when uncertain. Never promote recommended infrastructure or inferred paths into established facts.

For a high-level view, draw the supported architecture and keep unresolved or technically suspect relationships in a short companion assumptions record, identifying what the source said and why it is not drawn as an operational path. Do not silently discard source information. If the requested implementation or a central path depends on a consequential unresolved choice, explain it and wait for the user's decision. Follow the user's instructions and intent first and vendor practice where they are silent; when the two clearly conflict, name the conflicting statement and practice before drawing and recommend a resolution. Do not invent exposure, subnet attachments, protocols or capabilities. Choose layout details yourself.

## Draw the meaning

Before composing the view, read [composition.md](references/composition.md), [relationships.md](references/relationships.md), [notation.md](references/notation.md) and the sections of [cloud-conventions.md](references/cloud-conventions.md) for the clouds involved. Answer its engineering review. Read [drawio.md](references/drawio.md) when authoring or modifying the file.

Decide first whether one view can answer the reader's question within two kinds of line, three outlines and one page width. If it cannot, split it by concern, zoom or flow into pages of the same file, as composition.md describes, and repeat on each page.

- Choose a readable arrangement around the main relationships before routing. Alignment, proximity and whitespace should help the reader recognize the structure; use a second axis when it expresses a real distinction, not to impose a template.
- Show distinct instances in their actual boundaries and connect every participating group. Express fleets with repeated or stacked symbols and disclose representative counts; do not replace multiplicity or essential paths with prose.
- Give each boundary a job: communicate meaningful membership or separation. Use whitespace or a light fill when another outline adds no distinction. Keep logical boundaries distinguishable from deployment and security boundaries.
- Label what the reader cannot infer reliably from the symbols and topology. Preserve distinguishing roles, exact-hop contracts, branch conditions and transformations; omit repeated type names, obvious forwarding prose and unknown-value placeholders. Disclose material unknowns together outside the graph or once in a compact scope line.
- Keep every route inside the boundaries shared by its endpoints. Cross only required boundaries. Move nodes or ports before adding detours; native inline labels interrupt their own stroke.
- Prefer supported visual structure and concise local labels to explanatory Notes. Use a table for a real repeated relation, such as firewall allowances, not as a substitute for topology. Never delete a fact just to reduce text.
- Use exact vendor/catalog matches from `find-icon.mjs`, with the size and style it returns. Use the documented plain-box fallback when no reliable match exists. Never borrow a similar icon or draw one.

## Inspect and deliver

Run `node scripts/finalize.mjs <diagram.drawio>` after every edit. It embeds vendor icons and writes draw.io's own file layout, which tools such as Lucidchart require for import. Then run `node scripts/check-text.mjs <diagram.drawio>` and `node scripts/check-layout.mjs <diagram.drawio>`. When the source numbers its steps, save it as a file and run `node scripts/check-steps.mjs <source> <diagram.drawio>`, which reports stated steps that no connector label numbers. The layout check estimates where captions, boundary titles and connector labels fall, and reports text that overlaps or nearly touches other text, icons, outlines or lines. It also reports crossing connectors, connectors that should swap ports, detours, bends that a straight or one-bend route would avoid, members that repeat the boundary they sit in, nesting deeper than three outlines, mixed connector styles without a key table that explains each, dotted lines, dashed lines too short to show their dashes, more than one line weight, line ends other than one filled arrowhead that the key does not explain, key entries that differ between pages, page links to missing pages, an element whose symbol changes between pages, custom boundaries with dashed, coloured or uneven outlines, and connectors that leave and re-enter a boundary or pass through one.

Treat these reports as symptoms of the composition, not as the goal. Fix the cause: place elements by role, lane and true boundary, and order ports so that connectors do not cross. Never silence a report by deleting, merging or relabeling an element, moving it out of its boundary, rewording, moving a label away from its line, or bending a connector around text. If only a change of meaning would clear a report, keep it and name it in the companion account. An empty report does not mean the diagram reads well.

Run `node scripts/render.mjs <diagram.drawio>` and read the PNG; a file with several pages renders one PNG per page, and the layout check reports each page by name. Read every one. Squint at it: the main path and its start must stand out. Check the actual image, not XML alone, and repeat after every fix. If the script exits with code 3, nothing more can be rendered here: deliver the `.drawio`, pass on the link it prints, and state that the image was not inspected. Otherwise the work is unfinished until the PNG has been inspected.

Trace every entry through its intended destination, including auxiliary calls and explicit failures. Verify instances, memberships, protocols and conditions against the source. Check that branch selection cannot be mistaken for broadcast.

Inspect both the whole view and readable detail. Can the reader recognize the tiers, peers, shared services and exceptions without reading every caption? Remove boundaries and labels that repeat information already clear in the view. Keep readable typography, distinct paths and necessary qualifiers; fix collisions without changing meaning. Leave clear arrangements alone; change a layout choice when it resolves a visible reading problem, not merely to satisfy a design preference. Fewer words, Notes or bends alone do not establish quality.

Return the editable file, the PNG and a brief companion account of scope, unresolved assumptions, design risks, source deviations and checks actually performed. Keep that account off the canvas. State when visual or Desktop verification was unavailable. Check source fidelity separately from technical plausibility; neither a clean render nor faithful transcription proves the real deployment is correct.
