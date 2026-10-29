# Diagram notation

Use this house style for one scenario. It borrows C4 information without requiring C4's example colors or boxes.

## Elements and boundaries

- Title the view `Dynamic diagram (deployment view): <scenario>`.
- Label cloud, region, account, network and subnet outlines as deployment nodes. Label a logical system enclosure as a software system boundary. A logical boundary is not automatically a security perimeter.
- Place external systems and people outside the deployment boundaries. Show actual deployment membership, not proximity-based guesses.
- Give each element a name, a concise responsibility where needed, and its type. Containers and components also state technology, such as `[Container: Logic Apps workflow]`.
- Use official vendor symbols from one pinned library generation per vendor. Keep one icon size across the diagram; start with 72 draw.io units. Put captions below icons.
- Use a white box with a thin grey border when a matching official icon is unavailable. Docker, Argo CD and Red Hat currently use this fallback. Do not fabricate vendor symbols or hotlink images.
- Keep distinct environment instances visible. A shared component is one entity only when the source establishes sharing. Mark representative multiplicity honestly; one symbol does not establish a replica count.

Use bold boundary titles and consistent thin outlines. Use the matching built-in AWS group styles when applicable. Use light-blue non-AWS cloud outlines and a verified vendor badge when available; otherwise retain an explicit vendor title. Do not invent a badge. Keep enclosure sizes close to their contents while reserving room for captions and paths.

## Relationships

Use orthogonal connectors with one filled arrowhead. Label the actual action and applicable protocol. The arrow goes from initiator to callee, including a poller calling a queue. Name the returned message in the request label; do not reverse the polling arrow.

Fold normal responses into request labels. Use a second connector when the other side independently initiates an interaction. An explicitly specified failure response is the exception: give it a separate return arrow and a bold condition/result label. Do not invent denial behavior from the presence of authorization.

Solid means main request or forwarding. Dashed means a named auxiliary call, such as authentication, a role query or DNS. Express asynchronous behavior in the label, not by silently changing the meaning of dashed lines.

Number the main sequence. Use letter suffixes for branches of a step. For independent flows, use at most three color-blind-safe colors and separate numbered prefixes. For DNS plus application traffic, use A for dashed DNS and B for solid application traffic. Conditions must identify which environment or branch a request selects.

Use a compact legend for the notation actually present. Explain colors, line/border styles, arrowheads, abbreviations and any special symbols. Do not use red emphasis; use bold for failures.

## Labels, routes and Notes

Use one readable font size across architectural labels, boundaries and the legend. Do not shrink individual labels to fit. Adjust spacing, wrapping or page layout instead.

Place connector labels on their host segments with an opaque white background. Keep them clear of other captions, boundary outlines and titles. Distinct connections must not share a path segment. Minimize line crossings, but never move a route into an unrelated domain to eliminate one.

Keep a short purpose statement below the title when useful. Encode controls and transformations at their actual owners. Keep required names and qualifiers even when they take space.

Each explanatory Note is a visual-design cost. If an indispensable residual explanation cannot be encoded naturally, use the exact built-in `Misc > Note` preset with automatic text fitting. This is the only font-size exception. Keep Notes subordinate, adjacent to their named subject, and disconnected from architectural call arrows. Report why the Note remains necessary.
