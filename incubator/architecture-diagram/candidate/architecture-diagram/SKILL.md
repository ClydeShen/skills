---
name: architecture-diagram
description: Create an editable draw.io architecture diagram and a PNG for documents and wikis from a text scenario, or refine a generated diagram against its source. Use for request, event, authentication or cross-cloud flows with deployment and system boundaries. Not for general flowcharts, infrastructure inventories, code/IaC reverse engineering or image tracing.
license: MIT for original instructions and scripts; third-party artwork retains its own terms in assets/vendor-icons.json.
compatibility: Requires file access and Node.js 24. PNG export uses draw.io Desktop, or Git and Chromium or Chrome with network access on first use. With neither, it delivers the .drawio and a browser link for viewing and export. Targets draw.io v32.6.1. No model endpoint is required.
metadata:
  internal: true
---

# Architecture Diagram

Produce one editable `.drawio` architecture diagram and a PNG of each of its pages. Most readers see only the PNG, in a document or wiki. Make the architecture readable through position, boundaries, known icons and a few labels.

Choose a logical, deployment or flow emphasis that the task and the evidence support. Do not imply implementation detail that a high-level description does not give.

## Establish the architecture

Identify the scenario, the distinct instances, their responsibilities, boundary membership, directed interactions and important conditions. Use the supplied context before you ask questions.

- When the input contains several scenarios, ask which one to draw.
- Exclude struck-out text. State briefly which business rules, schemas, sample data and unrelated alerting you left out.
- Keep four kinds of statement apart: facts the source states, relationships you infer, details the source does not specify, and your recommendations. Never present an inferred path or recommended infrastructure as a fact.
- A connection in the source does not prove a vendor capability or a deployed operation. When a consequential capability is uncertain, check it against official documentation.
- Do not invent exposure, subnet attachments, protocols or capabilities.

Follow the user's instructions and intent first, and vendor practice where they are silent. When the two clearly conflict, name the conflicting statement and the practice before you draw, and recommend a resolution. When a central path or the requested implementation depends on a consequential open choice, explain the choice and wait for the user's decision.

For a high-level view, draw the architecture that the source supports. Keep unresolved or technically doubtful relationships in the companion account: say what the source states and why the drawing does not show it as an operational path. Do not drop source information without saying so. Choose the layout details yourself.

## Plan the views

Draw one view. Lay it out on one page first, with the main flow and the supporting relationships together as solid and dashed lines. Split into pages of the same file only when that page still breaks a limit in [composition](references/composition.md#split-the-view), such as a third kind of line or a width over 1400 units, and then make as few pages as fix it.

## Draw the meaning

Read these references before you compose a view:

- [composition.md](references/composition.md): views, placement, routing and alignment.
- [notation.md](references/notation.md): icons, connectors, the key, step numbers and labels.
- [relationships.md](references/relationships.md): how to draw each kind of relationship.
- [cloud-conventions.md](references/cloud-conventions.md): "All clouds", "Boundaries" and the section for each cloud in the view. Answer its engineering review.
- [drawio.md](references/drawio.md): when you write or change the file.

For missing native icons, use the optional consumer-library path in [drawio.md](references/drawio.md#optional-consumer-icon-libraries). Select the exact product and preserve source artwork; keep the library setting for lookup, finalization and rendering. Continue with a labelled box when no supported image exists.

While you draw:

- Arrange the elements around the main relationships before you route. Use alignment, proximity and whitespace to show the structure. Add a second axis only when it shows a real distinction.
- Show distinct instances in their actual boundaries, and connect every group that takes part. Draw an identical repeated structure, such as three environments or a standby region with the same stack, once with its count and names. Show fleets with repeated or stacked icons, and state that counts are representative. Do not replace multiplicity or essential paths with prose.
- Give each boundary a job: it shows membership or separation that matters. When another outline adds no distinction, use whitespace or a light fill. Keep logical boundaries visibly different from deployment and security boundaries.
- Label only what the reader cannot reliably infer from the icons and the topology: distinguishing roles, exact-hop contracts, branch conditions and transformations. Do not repeat type names, describe obvious forwarding or write placeholders for unknown values. State material unknowns together, outside the drawing.
- Keep every route inside the boundaries that its ends share, and cross only the boundaries it must. Move elements or ports before you add a detour.
- Prefer visual structure and short local labels to explanatory notes. Never delete a fact only to reduce text.
- Use the exact icon that `find-icon.mjs` returns, at the size and style it returns. When no reliable match exists, use the plain-box fallback. Never borrow a similar icon or draw one.

## Check the file

After every edit, run these from the package directory:

1. `node scripts/finalize.mjs <diagram.drawio>`. It embeds the vendor icons and writes draw.io's own file layout, which importers such as Lucidchart require.
2. `node scripts/check-text.mjs <diagram.drawio>`.
3. `node scripts/check-layout.mjs <diagram.drawio>`. With several pages, it reports each page by name.
4. When the source numbers its steps, save the source as a file and run `node scripts/check-steps.mjs <source> <diagram.drawio>`. It reports stated steps that no connector label numbers.

The layout check estimates where text and routes fall. It reports what can mislead a reader, such as collisions, crossings, detours, shared segments, unexplained line styles and inconsistencies between pages. Each report names the elements involved.

The reports are symptoms of the composition, not the goal. Fix the cause: place elements by role, lane and true boundary, and order ports so that connectors do not cross. Never clear a report by deleting, merging or relabelling an element, moving it out of its boundary, rewording, moving a label away from its line, or bending a connector around text. When only a change of meaning would clear a report, keep the report and name it in the companion account. An empty report does not prove that the diagram reads well.

## Inspect the image

Run `node scripts/render.mjs <diagram.drawio>`. It writes one PNG per page. Read every PNG, and repeat after every fix; the XML alone is not enough.

- Look at each image at a small size: the main path and its start must stand out.
- Trace every entry to its destination, including supporting calls and stated failures.
- Check instances, memberships, protocols and conditions against the source. Make sure that a branch choice cannot be mistaken for a broadcast.
- Check the whole view and the readable detail. The reader must recognise the tiers, peers, shared services and exceptions without reading every caption. Remove boundaries and labels that repeat what the view already shows.
- Fix collisions without changing meaning. Keep a clear arrangement; change a layout only to solve a visible reading problem, not for a design preference. Fewer words, notes or bends do not by themselves make a better diagram.

When `render.mjs` exits with code 3, this host cannot render. Deliver the `.drawio`, pass on the link that the script prints, and state that you did not inspect the image. In every other case, the work is not finished until you have inspected every PNG.

## Deliver

Return the editable file, the PNG of each page and a short companion account. Keep the account off the canvas. It covers:

- the scope, and the pages with the reason for each;
- unresolved assumptions, design risks and deviations from the source;
- the checks you actually ran, and any visual or Desktop verification that was unavailable.

Judge source fidelity and technical plausibility separately. Neither a clean render nor a faithful transcription proves that the real deployment is correct.
