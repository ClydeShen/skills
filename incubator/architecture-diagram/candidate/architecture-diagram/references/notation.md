# Diagram notation

Use a consistent visual vocabulary for one scenario. C4's useful distinctions inform the model; they need not appear as repeated type tags on the canvas.

## Structure and elements

Choose a descriptive scenario title. Add the view type only when it helps the audience. Let the main relationships suggest the reading direction; place supporting elements where their connections are easy to trace. Align comparable tiers or environments when useful, but size regions to their contents and paths rather than forcing equal columns. No fixed left/right placement or symmetry is required.

Preserve meaningful deployment membership, ownership and trust distinctions. Show a boundary when crossing or membership matters. A labeled light-filled region can define a subnet without a second heavy outline. Omit unspecified or redundant enclosing levels when their omission changes no known membership. A shared scaling group is a logical overlay, not another network or security domain.

Choose a recognizable symbol at the level actually described: service, resource or instance. An exact table or email-resource symbol can be more informative than a generic service logo; do not introduce a resource the source did not specify. Use a short name and add a role, technology or type only when it disambiguates the element. Retain useful metadata in the editable file without repeating it in captions or wrapping every icon in a generic card.

Keep distinct environment instances visible. For a fleet, use an exact multi-instance symbol or a small repeated/stacked set, with one clear indication that counts are representative when unspecified. Do not collapse a fleet into one ordinary icon plus “multiple”. Reuse drawing patterns, not entity identity.

Keep people and external systems outside deployment boundaries. Use official vendor symbols from one pinned generation per vendor, preserving their colors and identity. Keep comparable icons at a consistent size; start with 72 draw.io units. Place captions below or beside symbols where they remain clearly associated and leave paths readable; comparable elements should feel consistent, not mechanically identical.

Use matching built-in group styles only when their meaning fits. Do not use public/private-subnet or lock symbols to invent security properties. If no exact service icon exists, use a white box with a thin grey border and a truthful name; never borrow a similar vendor icon.

## Visual hierarchy

Use muted region fills, thin outlines and a restrained palette with stable meanings. Keep main paths easy to follow and surrounding frames visually secondary without recoloring vendor symbols. Distinguish network boundaries from logical groups through line style and labels as well as color. Whitespace can group peers without creating a new architectural domain. Use these choices to resolve competing emphasis, not to add decoration or enforce one palette.

Use a small, consistent text hierarchy for the title, names and secondary details. Keep all architectural text readable at the intended viewing scale; do not shrink a difficult label to fit. Remove redundant detail or adjust spacing instead. A compact, readable composition is preferable to an enormous sparse canvas.

## Relationships

For established runtime calls, use direct orthogonal connectors with one filled arrowhead from initiator to callee. Keep a poller's arrow toward the queried service, not toward the returned data's recipient. Label origin retrieval distinctly from content delivery. Show DNS as resolution, not HTTP forwarding; a separate response arrow is useful only when its answer needs explicit depiction.

Label a relationship when its action, protocol, branch condition or contract would otherwise be ambiguous. Preserve specified distinctions on their exact hops, such as synchronous replication or wrapping XML in JSON. Leave obvious forwarding hops unlabeled. Do not repeat “[unspecified]” on every line; report material unknowns once without guessing values.

Number interactions when execution order is needed and layout alone cannot establish it. Use branch suffixes or separate prefixes only when they improve tracing. Separate auxiliary DNS/authentication from application traffic; do not imply that DNS forwards application payloads.

Fold normal responses into the request relationship; label a response when its content matters. Use a separate return arrow for an explicitly specified failure, with its condition/result. Do not invent denial behavior.

Solid arrows show established runtime traffic. Dashed relationships require a specific meaning such as DNS resolution, replication, management or monitoring association; label that meaning rather than relying on a catch-all legend. A monitoring association does not assert an application call to an alarm. If its exact metric or caller is unknown, retain that unresolved endpoint at logical scope without inventing a component or API. Keep unconfirmed operational paths in the companion assumptions record, not mixed into established flows. In an explicitly requested source-transcription view, isolate and label such source claims as unverified.

Shared managed services may be drawn once without asserting a physical host between AZs. Distinguish logical service scope from actual subnet attachments. Do not infer load-balancer type, exposure, network classification or target-group configuration from target placement. Logical management overlays are not network boundaries. Add deployment detail only when supplied or confirmed.

## Routes and annotations

Place needed connector labels on their host segments with an opaque background. Keep them off other captions, boundary titles and outlines. A label may interrupt its own stroke; it must not cause a route detour. Avoid ambiguous shared segments and cross only domains required by the relationship.

Use concise local labels before explanatory Notes. A table should expose a real repeated relation, not replace topology. If an indispensable explanation remains, use the native `Misc > Note` preset with automatic text fitting, near its subject and disconnected from call arrows. State why it was necessary. Deleting an important fact is not simplification.
