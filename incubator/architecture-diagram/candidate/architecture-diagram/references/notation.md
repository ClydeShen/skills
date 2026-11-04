# Diagram notation

Use a consistent visual vocabulary for one scenario. C4's useful distinctions inform the model; they need not appear as repeated type tags on the canvas.

## Structure and elements

Choose a descriptive scenario title. Add the view type only when it helps the audience. [composition.md](composition.md) sets placement and [cloud-conventions.md](cloud-conventions.md) sets boundaries. Size regions to their contents and paths.

Preserve meaningful deployment membership, ownership and trust distinctions. Show a boundary when crossing or membership matters. A labeled light-filled region can define a subnet without a second heavy outline. Omit unspecified or redundant enclosing levels when their omission changes no known membership.

Choose a recognizable symbol at the level actually described: service, resource or instance. An exact table or email-resource symbol can be more informative than a generic service logo; do not introduce a resource the source did not specify. Use a short name and add a role, technology or type only when it disambiguates the element. Retain useful metadata in the editable file without repeating it in captions or wrapping every icon in a generic card.

Keep distinct environment instances visible. For a fleet, use an exact multi-instance symbol or a small repeated/stacked set, with one clear indication that counts are representative when unspecified. Do not collapse a fleet into one ordinary icon plus “multiple”. Reuse drawing patterns, not entity identity.

Keep people and external systems outside deployment boundaries. Use official vendor symbols from one pinned generation per vendor, preserving their colors and identity. Size every icon by the placement `find-icon.mjs` returns, so comparable icons match: a 72-unit square, or 40 high for wide marks. Place captions below or beside symbols where they remain clearly associated and leave paths readable; comparable elements should feel consistent, not mechanically identical.

Use matching built-in group styles only when their meaning fits. Do not use public/private-subnet or lock symbols to invent security properties. If no exact service icon exists, use a white box with a thin grey border and a truthful name; never borrow a similar vendor icon.

## Visual hierarchy

Use muted region fills, thin outlines and a restrained palette with stable meanings. Keep frames visually secondary to symbols and the main path. Distinguish network boundaries from logical groups through line style and labels as well as color. Whitespace can group peers without creating a new architectural domain.

Use a small, consistent text hierarchy for the title, names and secondary details. Do not shrink a difficult label to fit. Remove redundant detail or adjust spacing instead.

## What each channel says

Give each fact to the channel that can state it. Do not say it twice, and do not make one channel imitate another.

| Channel                                    | Says                                                                        |
| ------------------------------------------ | --------------------------------------------------------------------------- |
| Symbols, boundaries and position           | What exists and where it belongs                                            |
| Connectors, their direction and line style | Who relates to whom, and in which direction                                 |
| Text                                       | Names, and what a drawing cannot state: protocol, condition, transformation |
| Companion record                           | Gaps, assumptions and doubts about the source                               |
| Special characters                         | Nothing. No `→`, `↔`, `->`, `·` or `•` in any visible text                  |

A label that breaks this is a signal, so do not reword it to pass. If the drawing already says it, remove the label. If the drawing does not, the diagram is wrong or missing logic, so fix the drawing. If the source leaves it open, move it to the companion record.

## Relationships

For established runtime calls, use one filled arrowhead from initiator to callee. Keep a poller's arrow toward the queried service, not toward the returned data's recipient. Label origin retrieval distinctly from content delivery. Show DNS as resolution, not HTTP forwarding; a separate response arrow is useful only when its answer needs explicit depiction.

Label a relationship when its action, protocol, branch condition or contract would otherwise be ambiguous. Preserve specified distinctions on their exact hops, such as synchronous replication or wrapping XML in JSON. Leave obvious forwarding hops unlabeled. Do not repeat “[unspecified]” on every line; report material unknowns once without guessing values.

When the source states an order of execution, such as a numbered list, show it: give each step's connector a number and a short label of its action. Number only those steps; label other interactions, such as sign-in or the user's request, without a number. Otherwise number interactions only when execution order matters and layout alone cannot establish it. Number them last, after layout, from the order the drawn architecture executes them: what must happen before what. A source's list order is evidence, not the numbering; when the logic differs from it, number by the logic and note the difference in the companion account. Use branch suffixes or separate prefixes only when they improve tracing. Separate auxiliary DNS/authentication from application traffic; do not imply that DNS forwards application payloads.

Fold normal responses into the request relationship; label a response when its content matters. Use a separate return arrow for an explicitly specified failure, with its condition/result. Do not invent denial behavior.

Solid arrows show established runtime traffic. Dashed relationships, which the key must name, need one specific meaning per view such as DNS resolution, replication, management or monitoring; label it with one word. An unexplained source relationship stays unlabeled, as [relationships.md](relationships.md) describes. A monitoring association does not assert an application call to an alarm. If its exact metric or caller is unknown, retain that unresolved endpoint at logical scope without inventing a component or API. Keep unconfirmed operational paths in the companion assumptions record, not mixed into established flows. In an explicitly requested source-transcription view, isolate and label such source claims as unverified.

Do not infer load-balancer type, exposure, network classification or target-group configuration from target placement. Add deployment detail only when supplied or confirmed.

## Routes and annotations

Place needed connector labels on their host segments with an opaque background, off other captions, boundary titles and outlines. A label may interrupt its own stroke; it must not cause a detour. Avoid shared segments, and cross only domains the relationship requires.

Use concise local labels before explanatory Notes. A table should expose a real repeated relation, not replace topology. If an indispensable explanation remains, use the native `Misc > Note` preset with automatic text fitting, near its subject and disconnected from call arrows. State why it was necessary. Deleting an important fact is not simplification.
