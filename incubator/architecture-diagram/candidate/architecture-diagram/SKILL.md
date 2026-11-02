---
name: architecture-diagram
description: Create an editable draw.io architecture diagram and a PNG for documents and wikis from a text scenario, or refine a generated diagram against its source. Use for request, event, authentication or cross-cloud flows with deployment and system boundaries. Not for general flowcharts, infrastructure inventories, code/IaC reverse engineering or image tracing.
compatibility: Requires file access and Node.js 24. PNG export uses draw.io Desktop, or Git and Chromium or Chrome with network access on first use. With neither, it delivers the .drawio and a browser link for viewing and export. Targets draw.io v32.6.1. Catalog regeneration also requires the pinned draw.io source checkout. No model endpoint is required.
metadata:
  internal: true
---

# Architecture Diagram

Produce one editable `.drawio` architecture diagram and its PNG, which is what most readers see in a document or wiki. Choose a logical, deployment or flow emphasis that the task and available evidence support; do not imply implementation detail from a high-level description. Make the architecture legible through spatial structure, recognizable symbols and selective labels.

## Establish the architecture

Identify the scenario, distinct instances, responsibilities, boundary membership, directed interactions and important conditions. Use supplied context before asking questions.

If the input contains several scenarios, ask which one to draw. Exclude struck-out text. Briefly disclose excluded business-rule details, schemas, sample data and unrelated alerting.

Distinguish source-stated facts, inferred relationships, unspecified details and recommendations. A connection present in a source is not proof of a vendor capability or deployed operation. Check consequential vendor capabilities against official documentation when uncertain. Never promote recommended infrastructure or inferred paths into established facts.

For a high-level view, draw the supported architecture and keep unresolved or technically suspect relationships in a short companion assumptions record, identifying what the source said and why it is not drawn as an operational path. Do not silently discard source information. If the requested implementation or a central path depends on a consequential unresolved choice, explain it and wait for the user's decision. Do not invent exposure, subnet attachments, protocols or capabilities. Choose layout details yourself.

## Draw the meaning

Before composing the view, read [composition.md](references/composition.md), [relationships.md](references/relationships.md), [notation.md](references/notation.md) and the sections of [cloud-conventions.md](references/cloud-conventions.md) for the clouds involved. Answer its engineering review. Read [drawio.md](references/drawio.md) when authoring or modifying the file.

- Choose a readable arrangement around the main relationships before routing. Alignment, proximity and whitespace should help the reader recognize the structure; use a second axis when it expresses a real distinction, not to impose a template.
- Show distinct instances in their actual domains and connect every participating group. Express fleets with repeated or stacked symbols and disclose representative counts; do not replace multiplicity or essential paths with prose.
- Give each enclosure a job: communicate meaningful membership or separation. Use whitespace or a light region fill when another outline adds no distinction. Keep logical grouping distinguishable from deployment and security boundaries.
- Label what the reader cannot infer reliably from the symbols and topology. Preserve distinguishing roles, exact-hop contracts, branch conditions and transformations; omit repeated type names, obvious forwarding prose and unknown-value placeholders. Disclose material unknowns together outside the graph or once in a compact scope line.
- Keep every route inside domains shared by its endpoints. Cross only required boundaries. Move nodes or ports before adding detours; native inline labels interrupt their own stroke.
- Prefer supported visual structure and concise local labels to explanatory Notes. Use a table for a real repeated relation, such as firewall allowances, not as a substitute for topology. Never delete a fact just to reduce text.
- Use exact vendor/catalog matches from `find-icon.mjs`, with the size and style it returns. Use the documented plain-box fallback when no reliable match exists. Never borrow a similar icon or draw one.

## Inspect and deliver

Run `node scripts/embed-icons.mjs <diagram.drawio>` whenever the diagram uses a vendor icon outside the draw.io libraries. Then run `node scripts/check-text.mjs <diagram.drawio>` and `node scripts/check-layout.mjs <diagram.drawio>`, and fix what they report. Run `node scripts/render.mjs <diagram.drawio>` and read the PNG. Squint at it: the main path and its start must stand out. Check the actual image, not XML alone, and repeat after every fix. If the script exits with code 3, nothing more can be rendered here: deliver the `.drawio`, pass on the link it prints, and state that the image was not inspected. Otherwise the work is unfinished until the PNG has been inspected.

Trace every entry through its intended destination, including auxiliary calls and explicit failures. Verify instances, memberships, protocols and conditions against the source. Check that branch selection cannot be mistaken for broadcast.

Inspect both the whole view and readable detail. Can the reader recognize the tiers, peers, shared services and exceptions without reading every caption? Remove frames and labels that repeat information already clear in the view. Keep readable typography, distinct paths and necessary qualifiers; fix collisions without changing meaning. Leave clear arrangements alone; change a layout choice when it resolves a visible reading problem, not merely to satisfy a design preference. Fewer words, Notes or bends alone do not establish quality.

Return the editable file, the PNG and a brief companion account of scope, unresolved assumptions, design risks, source deviations and checks actually performed. Keep that account off the canvas. State when visual or Desktop verification was unavailable. Check source fidelity separately from technical plausibility; neither a clean render nor faithful transcription proves the real deployment is correct.
