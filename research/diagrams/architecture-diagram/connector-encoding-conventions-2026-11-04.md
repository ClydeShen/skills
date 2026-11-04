# Research: Meaning of connector encodings in architecture and technical diagrams

Date: 2026-11-04. Subject: Which connector encodings (line weight, colour, solid, dashed and dotted lines, arrowheads and endpoint markers) have a shared meaning that matches reader intuition, which mean something only inside one notation, and which have no shared meaning. Context: Feeds the legend rules of the architecture-diagram skill, which uses thin dashed or dotted lines for auxiliary relationships, three line weights (main path 2.5, runtime 1.5, auxiliary 1), filled arrowheads from initiator to callee, and bans dot and circle markers unless the key explains them. Builds on [vendor and C4 diagram conventions](vendor-diagram-conventions-2026-10-28.md); facts reused from that note cite it and were not re-fetched.

Confidence markers:

- **[official]**: the relevant part of an official page, specification or project document was read.
- **[official · summary only]**: only an overview was read, or the page does not cover the detail.
- **[measured]**: read on 2026-11-04 by a command from a named file at a named commit (renderer source code, library source). The file shows the value; it is an implementation, not the specification.
- **[secondhand]**: a third-party description, such as a search result summary or course notes; not traced to the primary source.
- **[inference]**: the author's judgment, with no direct evidence.
- **[unverified lead]**: a plausible claim that must be checked against a primary source before use.
- **[memory, unverified]**: stated from the author's prior knowledge because the primary source was unreachable; do not treat it as verified.

Network note: in this session only GitHub (`github.com`, `raw.githubusercontent.com`), `cloud.google.com` and web search were reachable. The OMG, The Open Group, W3C, c4model.com, Microsoft Learn, AWS, IEEE, Springer, HAL, arXiv and NCSU hosts all failed (proxy 403 or DNS failure). Specification claims for UML, BPMN, ArchiMate and SysML therefore rest on reference implementations read from GitHub [measured] plus [memory, unverified] statements. See "Not verified".

## Overview

Only three connector encodings carry a meaning that holds across notations and matches intuition: **a line means "related"**, **a solid line is the default relationship**, and **an arrowhead marks direction from source to target**. Even the arrowhead is ambiguous about _what_ flows (call, data, time order, cause). Every other encoding is either defined differently by each notation (dashed, dotted, filled versus open arrowheads, triangles, diamonds, circles) or defined by none (line weight, hue, bars). Line weight and lightness have a perceptual _order_ (more, stronger, more important) but no agreed _topic_; hue has neither an order nor a topic. Dashed lines have a weak shared connotation of "secondary, indirect or uncertain", but each notation and vendor binds them to a different concept, so they always need a key.

| Question                                   | Finding                                                                                                                                                                                                                           | Strength of evidence | Confidence                               |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ---------------------------------------- |
| 1. Formal notations (UML, BPMN, ArchiMate) | Each defines line pattern and endpoint shapes as a closed vocabulary; the same mark means different things across notations. None encodes meaning by line weight or colour.                                                       | medium               | [measured], [memory, unverified]         |
| 2. C4, vendors and infrastructure guides   | C4 and vendors leave line meaning to a key. Where a guide does assign dashed or dotted lines, the meanings conflict (asynchronous, network grouping, human data, default for everything).                                         | strong               | [official]                               |
| 3. Visualization and perception research   | Weight and lightness are ordered variables; hue and line pattern are nominal. Connectedness is a strong grouping cue. Arrows are read as direction, function or cause. Dashing is often chosen for uncertainty.                   | medium               | [secondhand], [measured]                 |
| 4. Accessibility                           | Colour must not be the only means of conveying information; a lightness difference with 3:1 contrast counts as a second cue.                                                                                                      | strong               | [official]                               |
| 5. Classification of encodings             | Safe without key: solid line, single arrowhead for direction. Needs key: weight, hue, lightness, dashed or dotted, filled versus open heads. Avoid outside a declared notation: triangles, diamonds, circles, bars, double heads. | medium               | mixed                                    |
| 6. Legend rules for the skill              | Keep filled heads and the dot ban; key every weight tier, hue and pattern; use one non-solid pattern only; extend the marker ban to diamonds, triangles, bars and half-arrows.                                                    | medium               | [inference] on [official] and [measured] |

## 1. Formal notations

### Evidence

**UML 2.5.** The OMG specification could not be fetched. The following is [memory, unverified] and agrees with the Mermaid class-diagram syntax, which maps UML relations to its arrow tokens [official, Mermaid docs]:

- Association: solid line; an open (stick) arrowhead marks navigability; no arrowhead means navigability unspecified. A small filled dot at an end marks end ownership. [memory, unverified]
- Dependency: dashed line with an open arrowhead toward the supplier. Mermaid: `..>` = Dependency. [official, Mermaid]
- Generalization: solid line with a hollow triangle at the general class. Mermaid: `<|--` = Inheritance. [official, Mermaid]
- Realization (interface realization): dashed line with a hollow triangle. Mermaid: `..|>` = Realization. [official, Mermaid]
- Aggregation and composition: hollow and filled diamond at the whole end. Mermaid: `o--` = Aggregation, `*--` = Composition. [official, Mermaid]
- Provided interface: "lollipop" (small hollow circle on a stem); required interface: "socket" (half circle). A port is a small square on the classifier border. Mermaid supports the lollipop as `()--`. [memory, unverified; lollipop syntax official, Mermaid]
- Sequence diagrams: synchronous message has a filled arrowhead; asynchronous message has an open (stick) arrowhead; a reply is a dashed line with an open arrowhead. [memory, unverified] Mermaid labels its open-arrow tokens `-)` and `--)` "(async)", and calls the UML dashed reply line "dotted". [official, Mermaid]

Two points follow. In UML, **filled versus open arrowhead** carries meaning only in sequence diagrams (synchronous versus asynchronous). In UML, **dashed** marks a dependency-like or non-structural relation (dependency, realization, reply), not "auxiliary call". [inference]

**SysML.** SysML v1 reuses the UML connector notation and adds flow ports and item flows. [memory, unverified] Not checked further; it adds no connector convention that an architecture diagram needs.

**BPMN 2.0.2.** The OMG specification could not be fetched. The reference renderer bpmn-js (commit `e7b7435`, `lib/draw/BpmnRenderer.js`) draws [measured]:

| BPMN connector | Line                                         | Start marker                               | End marker                                          |
| -------------- | -------------------------------------------- | ------------------------------------------ | --------------------------------------------------- |
| Sequence flow  | solid                                        | none; small diamond for a conditional flow | closed triangle filled with the stroke colour       |
| Message flow   | dashed (`strokeDasharray: '10, 11'`), 1.5 px | circle filled with the background (hollow) | closed triangle filled with the background (hollow) |
| Association    | dotted (`strokeDasharray: '0, 5'`)           | open V only when direction is `Both`       | open V when direction is `One` or `Both`; else none |

This matches the commonly cited spec definitions (sequence flow solid with a solid arrowhead; message flow dashed with an open circle start and an open arrowhead; association dotted). [memory, unverified; secondhand search summaries agree] In BPMN, dashed means "communication across participants (pools)", and dotted means "attached artefact, not flow". [inference]

**ArchiMate 3.x.** The Open Group specification could not be fetched. The reference tool Archi (commit `a8ea4e5`, `com.archimatetool.editor/.../figures/connections/`) draws [measured]:

| Relationship   | Line pattern in Archi | Endpoint                                                 |
| -------------- | --------------------- | -------------------------------------------------------- |
| Composition    | solid                 | diamond at source, foreground fill (filled)              |
| Aggregation    | solid                 | diamond at source, white fill (hollow)                   |
| Assignment     | solid                 | filled ball at source; filled arrowhead at target        |
| Realization    | short dash (`{2}`)    | white-filled (hollow) triangle at target                 |
| Serving        | solid                 | open (polyline) arrowhead at target                      |
| Access         | short dash (`{2}`)    | open arrowhead at the read or write end (either or both) |
| Influence      | long dash (`{6, 3}`)  | open arrowhead at target                                 |
| Triggering     | solid                 | filled arrowhead at target                               |
| Flow           | long dash (`{6, 3}`)  | filled arrowhead at target                               |
| Specialization | solid                 | white-filled (hollow) triangle at target                 |
| Association    | solid                 | none, or a half arrowhead when directed                  |
| Junction       | (node)                | AND junction: filled circle; OR junction: hollow circle  |

The specification names realization and access "dotted" and flow and influence "dashed". [memory, unverified] ArchiMate therefore uses **two** non-solid patterns with different meanings, and uses filled versus open arrowheads to separate dynamic relations (triggering, flow: filled) from dependency relations (serving, access, influence: open). [measured; interpretation is inference] This is the opposite emphasis from UML sequence diagrams, where open means asynchronous. [inference]

**C4 model.** Reused from [vendor and C4 conventions](vendor-diagram-conventions-2026-10-28.md#5-c4-model-rules-for-open-owner-decisions): C4 is notation independent; every diagram needs a key; every line is unidirectional and labelled; dashed versus solid is not prescribed; Structurizr draws all relationships as dashed grey lines by default. [official, via that note] C4-PlantUML (commit `f998c46`, `C4.puml`) offers `SolidLine()`, `DashedLine()`, `DottedLine()` and `BoldLine()` as relationship tag styles, writes "dashed" and "bold" into the generated legend for tagged relations, and draws boundaries dashed by default with default arrow colour `#666666`. [measured] So in the C4 ecosystem, line pattern and weight are free styling that the legend must explain. [inference]

### Recommendation for the project

- Do not borrow endpoint shapes from UML, BPMN or ArchiMate into a free-form architecture diagram. Their meaning is closed inside each notation and conflicts across them. [inference]
- If a diagram is drawn _in_ a formal notation, the notation is its key: name it in the legend ("Notation: ArchiMate 3.2") and use its marks exactly. [inference]

## 2. Vendor and infrastructure guidance

### Evidence

- **AWS** (deck release 24): preset arrows are solid, 1.25 pt, "Open Arrow" size 4, single- and double-headed; no dashed connector preset; no meaning for dashed lines. [official, measured, via [vendor note](vendor-diagram-conventions-2026-10-28.md#1-aws-architecture-icons)] Training diagrams use 2 pt lines. [official, via that note]
- **Azure Well-Architected**: always use arrows; prefer two flows over a double arrow; "Avoid bidirectional arrows"; "Provide a legend. If you introduce border or line semantics, for example, solid is a synchronous call while dash is asynchronous, include a compact legend"; "Avoid relying solely on color to distinguish types, instead consistently pair color with pattern"; keep line weights, line types and arrowheads consistent. [official, via [vendor note](vendor-diagram-conventions-2026-10-28.md#2-microsoft-azure-architecture-icons)]
- **Google Cloud**: no line or grouping guidance found. [official · summary only, via vendor note]
- **Red Hat Portfolio Architecture** draw.io library: six coloured solid 2 px "Network" lines and a grey solid "Data" line with a filled arrowhead; no dashed line. [measured, via vendor note] Colour there encodes network type, a house-specific meaning.
- **OpenStack documentation diagram guidelines** (`openstack-manuals`, commit `344a09b`, `doc/doc-contrib-guide/source/diagram-guidelines/general-guidelines.rst`) [official]:
  - "Set line width to at least 2px or above."
  - "Use solid lines to show a direct relationship between objects."
  - "Use dashed lines to group objects connected through an online network."
  - "Use dotted lines to show how data entered by a human user travels."
  - "Use arrows to represent one-way interactions between two or more objects."
  - Objects are black unless emphasis is needed; colours "may only use bright primary colors"; same colour for objects with similar functions.
- Network icon conventions (Cisco and others) were not reachable; no authoritative line convention for network diagrams was found. [unverified lead]

Across these sources, "dashed" means asynchronous (Azure example), network grouping (OpenStack), default for every relation (Structurizr) or nothing (AWS). Solid is everywhere the direct or default relation, and an arrow is everywhere one-way direction. [inference from official sources]

### Recommendation for the project

- Treat the house rule "dashed = auxiliary call" as a house meaning that the legend must state. No vendor shares it. [inference]
- Keep arrowheads on every flow line (Azure, C4, OpenStack agree). [official; synthesis is inference]

## 3. Visualization and perception research

### Evidence

**Bertin, _Semiology of Graphics_.** The book was not available. Secondhand summaries agree that size is ordered and quantitative, value (lightness) is ordered but not quantitative, hue is associative and selective but not ordered, and shape is associative only; they disagree on texture and orientation. [secondhand] Line weight is a size variable and dash pattern is a texture-like variable. [inference] Consequence: readers read a thicker or darker line as "more" of something, but the variable does not say what; a hue or dash pattern reads as "a different category" with no order. [inference]

**Grammar-of-graphics practice.** ggplot2 (commit `b638d65`) encodes the same rule in its scales [measured]:

- `scale-linewidth.R`: "Using linewidth for a discrete variable is not advised."
- `scale-alpha.R`: "Using alpha for a discrete variable is not advised."
- `scale-linetype.R`: "Continuous values can not be mapped to line types … as linetypes has no inherent order, this use is not advised."

So weight and transparency suit ordered data; line type suits unordered categories. [measured; application to diagrams is inference]

**Moody, "The Physics of Notations" (IEEE TSE 35(6), 2009).** The paper was not reachable. Secondhand descriptions give nine principles: semiotic clarity (one-to-one mapping of symbols to concepts), perceptual discriminability (distinct symbols need enough visual distance; shape is the primary variable; redundant coding increases distance; text-only differences have zero visual distance), semantic transparency, complexity management, cognitive integration, visual expressiveness (use more visual variables and more of their range), dual coding (text with graphics), graphic economy (limit symbol count), and cognitive fit. [secondhand] Statements about Moody's treatment of lines specifically were not found. [unverified lead] Applied to connectors: one encoding per meaning (semiotic clarity), redundant coding of a line category by pattern plus label (discriminability, dual coding), and few line categories (graphic economy). [inference]

**Gestalt connectedness.** Palmer and Rock (1994) proposed uniform connectedness as a grouping principle that acts before, and can override, proximity and similarity; later studies found proximity can be as fast in simple displays. [secondhand] A connector therefore groups its endpoints strongly regardless of its style, so any visible line reads as "these belong together". [inference]

**Preattentive features (Treisman; Healey).** Secondhand copies of Healey's list include line orientation, length, width, size, curvature, closure, terminators, intersection, hue and intensity; Treisman and Gormican's list includes length, orientation, contrast, hue, curvature and closure. [secondhand] Width, hue and lightness can pop out, so a heavy or coloured main path is found fast. [inference] Conjunctions (for example "thin and red") are not preattentive under feature integration theory. [memory, unverified]

**Empirical evidence on arrows.** Heiser and Tversky (Cognitive Science 30(3), 2006): readers describe diagrams without arrows as structure and with arrows as function or process; people spontaneously draw arrows for functional steps. [secondhand] Kang and Tversky (2016) note arrows are ambiguous: temporal sequence, movement or causal connection. [secondhand] No study was found that tests filled versus open arrowheads. Not found.

**Empirical evidence on dashed lines and weight.** Boukhelifa et al. (IEEE InfoVis 2012): viewers subjectively preferred dashing over blur, greyscale and sketchiness to show uncertainty in lines, though dashing was not more accurate. [secondhand] Sterzik et al. ("Perception of Line Attributes for Visualization", IEEE VIS 2023): participants most often chose dashing, luminance, wave amplitude and width to draw uncertainty; they discriminated considerably more levels of width than of dashing or luminance. [secondhand] Geological maps use solid, dashed and dotted for decreasing location certainty. [secondhand] No study was found that tests "thicker line = higher volume" versus "= more important" in architecture diagrams. Not found.

**Accessibility (WCAG 2.x, SC 1.4.1 Use of Color, level A).** Read from the W3C source repository (`w3c/wcag`, commit `d1e0639`) [official]:

- "Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element."
- "Use information in addition to color, such as shape or text, to convey meaning."
- Colours that also differ in lightness with "a contrast ratio of 3:1 or greater" count as an additional visual distinction; but "if content relies on the user's ability to accurately perceive or differentiate a particular color an additional visual indicator will be required regardless of the contrast ratio".

### Recommendation for the project

- Use weight and lightness only for ordered meanings (importance tiers), and say in the key what the order is. [inference]
- Use hue and pattern only for categories, always with a second cue (label, step number or pattern). [official WCAG; application is inference]
- Expect readers to read a dashed line as "secondary or less certain". The house meaning "auxiliary" fits that connotation, but the key still has to name it. [secondhand; inference]

## 4. Classification of encodings

"Cross-notation reading" states whether a meaning holds across notations or matches measured reader intuition.

| Encoding                   | Meaning in notations that define it                                                                                                                                                                                     | Cross-notation or intuitive reading, with evidence                                                                                                                                                 | Recommendation                                 |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Line weight (thickness)    | None in UML, BPMN or ArchiMate (single width in bpmn-js and Archi [measured]). C4-PlantUML `BoldLine()` with legend [measured]. OpenStack: min 2 px, no meaning [official].                                             | Ordered "more" (Bertin size [secondhand]; ggplot2 discourages it for categories [measured]); width is the most discriminable line attribute [secondhand]. Topic (volume or importance) not shared. | Needs a key; ordered meanings only             |
| Hue                        | None in formal notations. Red Hat: network type [measured]. OpenStack: emphasis, same function [official].                                                                                                              | Nominal, unordered [secondhand]. WCAG forbids colour as the only cue [official].                                                                                                                   | Needs a key and a second cue                   |
| Value or lightness         | None in formal notations. C4-PlantUML default grey arrows [measured].                                                                                                                                                   | Ordered [secondhand]; grey reads as de-emphasised [inference]. Counts as a second cue at 3:1 contrast [official].                                                                                  | Needs a key if it carries meaning              |
| Solid                      | Default or structural relation in UML, BPMN sequence flow, most ArchiMate relations; "direct relationship" (OpenStack); all AWS presets.                                                                                | Shared: the primary or direct relation [official, measured].                                                                                                                                       | Safe without a key                             |
| Dashed                     | UML dependency, realization, reply [memory]; BPMN message flow [measured]; ArchiMate flow, influence [measured]; Azure example async [official]; OpenStack network grouping [official]; Structurizr default [official]. | Weak connotation "secondary, indirect or uncertain" [secondhand]; concrete meanings conflict.                                                                                                      | Needs a key; one meaning per diagram           |
| Dotted                     | BPMN association [measured]; ArchiMate access, realization [memory; Archi short dash, measured]; OpenStack human-entered data [official]. Mermaid calls UML dashed "dotted" [official].                                 | No shared meaning; tools use "dashed" and "dotted" interchangeably [official, Mermaid]. Dashing levels are poorly discriminated [secondhand].                                                      | Avoid as a second pattern beside dashed        |
| Filled arrowhead           | UML synchronous message [memory]; BPMN sequence flow [measured]; ArchiMate triggering, flow, assignment target [measured]; Red Hat data line [measured].                                                                | The arrowhead gives direction [secondhand, Heiser and Tversky]; "filled" itself has no shared meaning.                                                                                             | Safe without a key for direction               |
| Open arrowhead             | UML navigability, dependency, async message, reply [memory, Mermaid]; ArchiMate serving, access, influence [measured]; AWS default preset [official].                                                                   | Direction, as filled. Filled versus open as a contrast means different things per notation.                                                                                                        | Safe alone; a filled/open contrast needs a key |
| No arrowhead               | UML association with unspecified navigability [memory]; BPMN undirected association [measured]; ArchiMate association [measured].                                                                                       | "Related, direction unknown or irrelevant" [inference]. C4 and Azure require arrows [official].                                                                                                    | Avoid on flow lines; needs a key elsewhere     |
| Double-headed arrow        | ArchiMate access read-write [measured]; AWS preset [measured]; Mermaid bidirectional message [official].                                                                                                                | Azure: "Double arrows imply bidirectional dependencies, which can create confusion" [official]; C4: unidirectional lines [official].                                                               | Avoid; draw two lines or label                 |
| Hollow triangle            | UML generalization (solid) and realization (dashed) [Mermaid, memory]; ArchiMate specialization, realization [measured].                                                                                                | Shared inside the UML family ("is a", "implements"); no flow meaning.                                                                                                                              | Avoid outside a declared notation              |
| Diamond (filled or hollow) | UML and ArchiMate composition (filled) and aggregation (hollow) [Mermaid, measured]; BPMN conditional-flow start (small diamond) [measured].                                                                            | No intuitive reading [inference].                                                                                                                                                                  | Avoid outside a declared notation              |
| Filled circle              | ArchiMate assignment source and AND junction [measured]; UML association-end ownership dot [memory].                                                                                                                    | None found.                                                                                                                                                                                        | Avoid (current ban holds)                      |
| Hollow circle              | BPMN message-flow start [measured]; ArchiMate OR junction [measured]; UML provided interface lollipop [memory, Mermaid].                                                                                                | None found.                                                                                                                                                                                        | Avoid (current ban holds)                      |
| Bar or tee                 | Not defined by any notation read here. [memory, unverified: crow's-foot ER notation uses a bar for "one"; biology pathway diagrams use a tee for inhibition.]                                                           | None found.                                                                                                                                                                                        | Avoid                                          |

## 5. Recommendations for the skill's legend rules

1. **Keep one arrowhead style.** Keep the filled arrowhead from initiator to callee. It reads as direction without a key. Do not add an open arrowhead as a second meaning; if the owner wants a synchronous versus asynchronous contrast, put it in the key, because UML and ArchiMate read filled versus open differently. [inference on [measured], [memory]]
2. **Key every weight tier, and state that weight means importance, not traffic volume.** No notation defines weight, and readers read a thicker line as "more" without knowing of what. The legend entry should name each tier ("main path", "runtime", "auxiliary"). [inference on [secondhand], [measured]]
3. **Check that 1.5 and 1 are distinguishable at the export scale.** Width is the most discriminable line attribute, but a 1.5 : 1 ratio is small, and OpenStack asks for at least 2 px. If a reviewer cannot tell runtime from auxiliary without the pattern, merge to two tiers or widen the gap. This is not tested here. [inference]
4. **Use one non-solid pattern.** Replace "dashed or dotted" with dashed only, with one meaning (auxiliary). Do not give dotted a separate meaning. Tools and readers do not separate the two reliably. [inference on [official, Mermaid], [secondhand]]
5. **Double-code auxiliary lines.** Thin plus dashed plus a label already gives redundant coding; keep all three, so the meaning survives greyscale print and colour-vision deficiency. [inference on [official WCAG], [secondhand Moody]]
6. **Never let hue carry meaning alone.** Every coloured flow also needs a label, a step number or a pattern, and a key entry. [official WCAG; Azure via vendor note]
7. **Extend the marker ban.** Ban circles (filled or hollow), diamonds, hollow triangles, bars and half-arrows as endpoints unless the diagram declares a formal notation in its legend. Their meanings are notation-specific and conflict. [inference on [measured]]
8. **Ban undirected flow lines and double heads.** Draw two lines or a labelled request with a folded response. Use an undirected line only for a non-flow relation, and key it. [official C4, Azure; inference]
9. **List only what the diagram uses, and include solid and the arrowhead too.** C4 requires a key for the full notation, so even the "safe" encodings appear once. [official C4 via vendor note]

## Not verified

- OMG UML 2.5.1, SysML and BPMN 2.0.2 specification texts: `www.omg.org` did not resolve in WebFetch and returned proxy 403 to curl. UML and SysML claims are [memory, unverified] apart from what Mermaid documents; BPMN claims rest on bpmn-js.
- The Open Group ArchiMate 3.2 specification: `pubs.opengroup.org` did not resolve and `www.opengroup.org` returned 403. ArchiMate claims rest on Archi source code; the spec's own words "dotted" and "dashed" per relationship are [memory, unverified].
- W3C pages: `www.w3.org` did not resolve. WCAG text was read from the `w3c/wcag` GitHub source instead; the published page may differ in wording.
- `c4model.com`, `docs.structurizr.com`, `learn.microsoft.com`, `aws.amazon.com`: proxy 403. Their facts are reused from [vendor and C4 conventions](vendor-diagram-conventions-2026-10-28.md) (accessed 2026-10-28), not re-read.
- Bertin, _Semiology of Graphics_: no online primary text; claims are [secondhand].
- Moody 2009: `ieeexplore.ieee.org`, `doi.org`, `cs.uwaterloo.ca` and `homepages.uc.edu` returned 403; claims are [secondhand]. Moody's statements about lines specifically were not found.
- Treisman and Gelade (1980), Treisman and Gormican (1988), Healey's perception page (`healey.csc.ncsu.edu`, `www.csc2.ncsu.edu`, `ics.uci.edu`): 403; feature lists are [secondhand].
- Palmer and Rock (1994), Heiser and Tversky (2006), Kang and Tversky (2016), Boukhelifa et al. (2012), Sterzik et al. (2023): `link.springer.com`, `www.tc.columbia.edu`, `hal.science`, `arxiv.org` returned 403; findings are [secondhand] from search summaries.
- Network-diagram conventions (Cisco and others): `www.cisco.com` returned 403; no authoritative source found.
- Bar or tee endpoint meanings in ER and biology notations: [memory, unverified].
- Whether readers read thicker architecture lines as volume or importance: no study found.
- Whether 1.5 and 1 line weights are distinguishable in the skill's rendered output: not tested.

## Decisions for the owner

1. **Weight tiers**: keep three tiers (2.5, 1.5, 1) with a key, or merge runtime and auxiliary into two tiers and let the dashed pattern carry the difference?
2. **Dashed versus dotted**: keep only dashed for auxiliary lines and drop dotted?
3. **Synchronous versus asynchronous**: keep one filled arrowhead for all calls, or add a keyed open arrowhead (or dashed line, as in the Azure example) for asynchronous messages?
4. **Formal-notation mode**: allow UML, ArchiMate or BPMN endpoint shapes when the legend declares that notation, or ban them in all skill output?

## Sources

- Repository note, [vendor and C4 diagram conventions](vendor-diagram-conventions-2026-10-28.md): AWS deck release 24, Azure Well-Architected, Google Cloud icons, Red Hat tooling, C4 and Structurizr facts (sources accessed 2026-10-28; reused, not re-fetched).
- bpmn-io, `lib/draw/BpmnRenderer.js`, https://github.com/bpmn-io/bpmn-js/blob/develop/lib/draw/BpmnRenderer.js (commit `e7b7435`, accessed 2026-11-04): BPMN connector line patterns and markers.
- Archi, `com.archimatetool.editor/src/com/archimatetool/editor/diagram/figures/connections/*ConnectionFigure.java` and `figures/elements/JunctionFigure.java`, https://github.com/archimatetool/archi (commit `a8ea4e5`, 2026-10-28, accessed 2026-11-04): ArchiMate relationship and junction rendering.
- Mermaid, class diagram syntax, https://github.com/mermaid-js/mermaid/blob/develop/docs/syntax/classDiagram.md, and sequence diagram syntax, https://github.com/mermaid-js/mermaid/blob/develop/docs/syntax/sequenceDiagram.md (commit `ea53556`, accessed 2026-11-04): UML relation tokens, lollipop interface, sync and async arrow types.
- C4-PlantUML, `C4.puml`, https://github.com/plantuml-stdlib/C4-PlantUML/blob/master/C4.puml (commit `f998c46`, accessed 2026-11-04): relationship line styles and legend text.
- OpenStack, "General guidelines" (diagram guidelines), https://github.com/openstack/openstack-manuals/blob/master/doc/doc-contrib-guide/source/diagram-guidelines/general-guidelines.rst (commit `344a09b`, accessed 2026-11-04); published at https://docs.openstack.org/doc-contrib-guide/diagram-guidelines/general-guidelines.html (not opened).
- W3C, WCAG SC 1.4.1 source, https://github.com/w3c/wcag/blob/main/guidelines/sc/20/use-of-color.html, and "Understanding Use of Color" source, https://github.com/w3c/wcag/blob/main/understanding/20/use-of-color.html (commit `d1e0639`, accessed 2026-11-04).
- ggplot2, `R/scale-linewidth.R`, `R/scale-alpha.R`, `R/scale-linetype.R`, `R/scale-size.R`, `R/scale-shape.R`, https://github.com/tidyverse/ggplot2 (commit `b638d65`, accessed 2026-11-04): mapping advice for ordered and unordered aesthetics.
- Web search result summaries (accessed 2026-11-04), used only for [secondhand] claims and leads: Moody 2009 course slides and the Moody, Heymans and Matulevičius i\* paper (https://publikationen.bibliothek.kit.edu/1000079942/6400321, https://cs.uwaterloo.ca/~jmatlee/Teaching/CS846/Schedule/Jan30/Kevin.pdf); Bertin summaries (https://axismaps.com/guide/visual-variables, https://courses.isds.tugraz.at/ivis/surveys/ss2010/g1-survey-retinal.pdf); Palmer and Rock (https://link.springer.com/content/pdf/10.3758/BF03200760.pdf); Healey lists (https://ics.uci.edu/~kobsa/courses/ICS104/course-notes/preattentive-props.htm, https://www.csc2.ncsu.edu/faculty/healey/download/tvcg.11.pdf); Heiser and Tversky (https://www.tc.columbia.edu/faculty/bt2158/faculty-profile/files/sincomprehendingandproducingmechanicaldiagrams.PDF, https://link.springer.com/10.1186/s41235-016-0004-9); Boukhelifa et al. (https://ieeevis.org/year/2012/paper/infovis/evaluating-sketchiness-visual-variable-depiction-qualitative-uncertainty); Sterzik et al. (https://content.ieeevis.org/year/2023/paper_v-full-1655.html); geological map uncertainty (https://link.springer.com/10.1007/s41651-020-00071-6). None of these pages was opened.
