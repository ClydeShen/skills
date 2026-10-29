---
name: architecture-diagram
description: Create an editable draw.io architecture diagram from a text scenario, or refine a generated diagram against its source. Use for request, event, authentication or cross-cloud flows with deployment and system boundaries. Not for general flowcharts, infrastructure inventories, code/IaC reverse engineering or image tracing.
compatibility: Requires file access and draw.io v32.6.1 for editing and visual inspection. Optional icon lookup and catalog regeneration use Node.js 24; regeneration also requires Git and the pinned draw.io source checkout. No model endpoint is required.
metadata:
  internal: true
---

# Architecture Diagram

Produce one editable `.drawio` architecture diagram. Choose a logical, deployment or flow emphasis that the task and available evidence support; do not imply implementation detail from a high-level description. Make the architecture legible through spatial structure, recognizable symbols and selective labels.

## Establish the architecture

Identify the scenario, distinct instances, responsibilities, boundary membership, directed interactions and important conditions. Use supplied context before asking questions.

If the input contains several scenarios, ask which one to draw. Exclude struck-out text. Briefly disclose excluded business-rule details, schemas, sample data and unrelated alerting.

Distinguish source-stated facts, inferred relationships, unspecified details and recommendations. A connection present in a source is not proof of a vendor capability or deployed operation. Check consequential vendor capabilities against official documentation when uncertain. Never promote recommended infrastructure or inferred paths into established facts.

For a high-level view, draw the supported architecture and keep unresolved or technically suspect relationships in a short companion assumptions record, identifying what the source said and why it is not drawn as an operational path. Do not silently discard source information. If the requested implementation or a central path depends on a consequential unresolved choice, explain it and wait for the user's decision. Do not invent exposure, subnet attachments, protocols or capabilities. Choose layout details yourself.

## Draw the meaning

Read [notation.md](references/notation.md) before composing the view. Read [drawio.md](references/drawio.md) when authoring or modifying the file.

- Choose a readable arrangement around the main relationships before routing. Alignment, proximity and whitespace should help the reader recognize the structure; use a second axis when it expresses a real distinction, not to impose a template.
- Show distinct instances in their actual domains and connect every participating group. Express fleets with repeated or stacked symbols and disclose representative counts; do not replace multiplicity or essential paths with prose.
- Give each enclosure a job: communicate meaningful membership or separation. Use whitespace or a light region fill when another outline adds no distinction. Keep logical grouping distinguishable from deployment and security boundaries.
- Label what the reader cannot infer reliably from the symbols and topology. Preserve distinguishing roles, exact-hop contracts, branch conditions and transformations; omit repeated type names, obvious forwarding prose and unknown-value placeholders. Disclose material unknowns together outside the graph or once in a compact scope line.
- Keep every route inside domains shared by its endpoints. Cross only required boundaries. Move nodes or ports before adding detours; native inline labels interrupt their own stroke.
- Prefer supported visual structure and concise local labels to explanatory Notes. Use a table for a real repeated relation, such as firewall allowances, not as a substitute for topology. Never delete a fact just to reduce text.
- Use exact vendor/catalog matches. Use the documented plain-box fallback when no reliable match exists. Never borrow a similar icon.

## Inspect and deliver

Open or render the file with an available compatible draw.io viewer. Check the actual image, not XML alone.

Trace every entry through its intended destination, including auxiliary calls and explicit failures. Verify instances, memberships, protocols and conditions against the source. Check that branch selection cannot be mistaken for broadcast.

Inspect both the whole view and readable detail. Can the reader recognize the tiers, peers, shared services and exceptions without reading every caption? Remove frames and labels that repeat information already clear in the view. Keep readable typography, distinct paths and necessary qualifiers; fix collisions without changing meaning. Leave clear arrangements alone; change a layout choice when it resolves a visible reading problem, not merely to satisfy a design preference. Fewer words, Notes or bends alone do not establish quality.

Return the editable file and a brief companion account of scope, unresolved assumptions, source deviations and checks actually performed. Keep only essential local qualifiers and a short scope line on the canvas. State when visual or Desktop verification was unavailable. Check source fidelity separately from technical plausibility; neither a clean render nor faithful transcription proves the real deployment is correct.
