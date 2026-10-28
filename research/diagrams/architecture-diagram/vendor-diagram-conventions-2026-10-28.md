# Research: Vendor and C4 diagram conventions behind the observed house style

Date: 2026-10-28. Subject: Which features of the owner's house style (see [requirements and observed style](requirements-and-observed-style-2026-10-28.md), sections 2.3 and 2.5) are official vendor conventions, which are C4 conventions, and which are team habit. Context: Feeds the open owner decisions on line semantics (decision 5), icon-set version (decision 4), C4 levels (decision 9) and the zone styles. It also resolves the first item of "Not verified" in that note. Primary sources only: vendor pages and downloadable guideline files, c4model.com and Structurizr docs. All sources were accessed on 2026-10-28.

Confidence markers:
- **[official]**: the relevant part of an official page, guideline file or specification was read.
- **[official · summary only]**: only an overview was read, or the page does not cover the detail.
- **[measured]**: read directly from an official downloadable file (SVG, PPTX, library) on the stated date, by a command. The file states the value; no page text explains it.
- **[secondhand]**: a third-party description; not traced to a primary source.
- **[inference]**: the author's judgment, with no direct evidence.
- **[unverified lead]**: a plausible claim that must be checked against a primary source before use.

## Overview

The house style is mostly the **AWS Architecture Icons group system**, as rendered by the **draw.io AWS 4 library**. The cloud zone, the account zone, the grey logical group, the coloured service tiles and the orthogonal arrows all have an AWS source. The pink account *title* comes from draw.io's library, not from AWS's own deck. No vendor and not C4 prescribe dashed lines for authentication or queries; that use is team habit. Azure and Google Cloud publish icon rules but no grouping or boundary conventions. C4 prescribes no line style or colour; it requires a key, unidirectional labelled lines, numbered steps in dynamic diagrams, and allows nested deployment nodes and vendor icons.

| Question | Finding | Strength of evidence | Confidence |
|---|---|---|---|
| 1. AWS conventions | Full group, colour, arrow, label and callout rules exist in the official PPTX deck, release 24, 2026-07-31 | strong | [official], [measured] |
| 2. Azure conventions | Icon do's and don'ts and terms only; diagram practices in Well-Architected; no boundary styles | strong | [official] |
| 3. Google Cloud conventions | Icon library and overview PDF only; no grouping guidance found; diagramming tool URL now redirects away | medium | [official], [measured] |
| 4. Kubernetes, Red Hat, Docker, Argo CD | K8s icon set (Apache-2.0 or CC-BY-4.0); Red Hat technology icons and a draw.io tooling project; Docker logos need authorization; Argo has only a project logo in CNCF artwork | medium | [official] |
| 5. C4 rules | Notation independent; key required; unidirectional lines; numbered dynamic steps; nested deployment nodes; vendor icons allowed with a key | strong | [official] |
| 6. Verdicts | See section 6 | medium | mixed |

## 1. AWS Architecture Icons

### Evidence

**Release.** The icons page offers two downloads, an icon package and a PPTX toolkit, both named `07312026`. [official] The deck's title slide reads "Release 24-2026.07.31". [measured] The page states releases are quarterly: "Q1 (end of January), Q2 (end of April), and Q3 (end of July). No releases occur in Q4." [official] The page warns: "Check that you're using up-to-date icons," because some third-party libraries carry legacy sets. [official]

**Permitted use.** "We allow customers and partners to use these toolkits and assets to create architecture diagrams." The page has no icon-specific terms beyond the general site terms. [official]

**Package structure.** Folders: `Architecture-Group-Icons`, `Architecture-Service-Icons` (per category, sizes 16, 32, 48, 64), `Category-Icons` (16, 32, 48, 64), and `Resource-Icons` (48, light and dark variants). Group icons are 32 px only. [measured]

**System elements.** The deck names five: groups ("Show the connections between multiple services or resources"), arrows ("Describe a flow of information"), service icons, resource icons, and general resource icons. [official]

**Groups (deck slide "Groups 1/5").** Read from the shapes in the light-background deck. The border width of every group is 15875 EMU (1.25 pt). Labels are 12 pt in the theme text colour (black in the light deck); no group label is bold or coloured. [measured]

| Group | Border colour | Border style | Corner badge |
|---|---|---|---|
| AWS Cloud (AWS logo, or cloud glyph where the AWS logo cannot be used) | theme text colour (black in light deck) | solid | yes, badge fill `#242F3E` (`#232F3E` in the dark variant) |
| Region | `#00A4A6` | system dash | yes, `#00A4A6` |
| Availability Zone | `#00A4A6` | dashed | no badge |
| Security group | `#DD344C` | solid | no badge |
| Auto Scaling group | `#ED7100` | dashed | yes |
| Virtual private cloud (VPC) | `#8C4FFF` | solid | yes |
| Private subnet | `#00A4A6` | solid | yes |
| Public subnet | `#7AA116` | solid | yes |
| Server contents; Corporate data center | `#7D8998` | solid | yes |
| EC2 instance contents; Spot Fleet; Elastic Beanstalk container | `#ED7100` | solid | yes |
| AWS account | `#E7157B` | solid | yes, badge fill `#E7157B` |
| AWS IoT Greengrass; Greengrass Deployment | `#7AA116` | solid | yes |
| AWS Step Functions workflow | `#E7157B` | solid | yes |
| Generic group | `#7D8998` | one dashed and one solid variant | no badge |

All borders above come from the deck shapes; badge fills come from the group SVGs in the package. [measured] The example slide (Chef Automate) draws the public subnet with a dashed border, unlike the solid preset; the deck is internally inconsistent here. [measured]

Group rules, quoted from the deck. [official]
- "Each group consists of an icon and a label. Colors and lines help to differentiate groups."
- "Some groups cross multiple groups, such as Auto Scaling, while others are meant to nest inside another, such as a VPC and subnets."
- Nested groups: "inner groups should have at least .05" buffer on all sides."
- Do: "Use a generic group type if the presets do not suit your needs." "Add a custom group if needed." Custom groups start from "a group with the category color where you find your service."
- Don't: "Create groups with nonapproved AWS icon(s)." "Resize group icons."
- AWS Cloud: "use the group with the AWS logo except in Regions where the AWS logo cannot be used. You may use the group with the cloud icon in those cases."

**Category colours.** Each category icon has one fill. Every service SVG in a category folder uses that category's fill. [measured]

| Fill | Categories |
|---|---|
| `#ED7100` | Compute, Containers, Blockchain, Media Services, Quantum Technologies |
| `#8C4FFF` | Analytics, Networking & Content Delivery, Games, Serverless |
| `#7AA116` | Storage, Internet of Things, Cloud Financial Management |
| `#C925D1` | Databases, Developer Tools, Customer Enablement, Satellite |
| `#E7157B` | Application Integration, Management Tools, Multicloud & Hybrid |
| `#DD344C` | Security & Identity, Business Applications, Customer Experience, Front-End Web & Mobile |
| `#01A88D` | Artificial Intelligence, End User Computing, Migration & Modernization |
| `#232F3E` | General icons |

The deck does not state these values as a colour table. They are read from the files. [measured]

**Icons.** "For diagrams, use icons at their predefined size and do not resize." Don't crop, flip, rotate or change icon shapes. [official] In the deck example, service icons are about 60 pt, resource icons about 36 pt, and the group badge about 30 pt. [measured]

**Arrows.** "Use straight lines and right angles to connect objects wherever possible." A diagonal is allowed only where right angles are not possible. "Don't use anything beside preset or default arrows." Preset arrows use "Open Arrow" in "Size 4". [official] The preset sheet contains single-headed and double-headed arrows, straight and elbow, all solid, 1.25 pt, in the theme text colour. It contains no dashed arrow. [measured] The deck gives no meaning for dashed lines. [official · summary only]

**Labels.** "All label text should be 12pt Arial throughout the diagram." Service names fit on at most two lines, never break mid-word, and keep "AWS" or "Amazon" with the first word of the name. Short forms such as "Amazon EC2" are allowed only after the full name appears somewhere in the document. [official] In the deck example, labels sit centred directly below the icon. [measured]

**Numbered callouts.** "Callouts are black with bold white type." Use them at predefined size; order "as linearly as possible"; don't "Use letters or other symbols", don't mix callout sizes, don't create new callout shapes. "Consult with your team to see if you can use numbered callouts." [official]

**Training and Certification diagrams only.** White background, all type 16 pt black, all lines 2 pt, icon and line colours not altered. [official]

**draw.io rendering.** draw.io's AWS 4 sidebar (`Sidebar-AWS4.js`, last commit 2026-09-08) styles the groups with slightly different values from the deck. [measured]

| Group | draw.io stroke | draw.io label colour | Dashed |
|---|---|---|---|
| AWS Cloud (alt) | `#232F3E` | `#232F3E` | no |
| AWS account | `#CD2264` | `#CD2264` | no |
| Region | `#00A4A6` | `#147EBA` | yes |
| VPC | `#8C4FFF` | `#AAB7B8` | no |
| Security group | `#00A4A6`, fill `#E6F6F7` | `#147EBA` | no |

### Recommendation for the project

- Treat the AWS deck release 24 (2026-07-31) as the AWS authority for group colours, dash styles and badges. Record the release in the icon catalog, because AWS ships three releases a year. [inference]
- Decide whether the skill follows the deck values or the draw.io library values where they differ (for example account `#E7157B` with a black label versus `#CD2264` with a pink label). The owner chose draw.io as output format; this is an owner decision. [inference]

## 2. Microsoft Azure architecture icons

### Evidence

- The icons page (`ms.date` 2026-07-09) offers `Azure_Public_Service_Icons_V24.zip`; its latest update entry is July 2026. [official] The zip holds SVGs by category, `Azure_Icons_FAQ.pdf` and `Microsoft_Terms_of_Use.pdf`; file dates are 2026-07-08. [measured]
- Do's: "Use the icon to illustrate how products can work together." "We recommend including the product name somewhere close to the icon." "Use the icons as they would appear within Azure." Don'ts: "Don't crop, flip, or rotate icons." "Don't distort or change icon shape in any way." "Don't use Microsoft product icons to represent your product or service." [official]
- Terms: "Microsoft permits the use of these icons in architectural diagrams, training materials, or documentation. You can copy, distribute, and display the icons only for the permitted use unless granted explicit permission by Microsoft." [official]
- FAQ PDF: "the full name of the service should always appear near the icon, but not so close that it looks like it's overlapping the icon." [official]
- The icons are not provided as Visio stencils, and "There are no plans to provide these icons as Visio stencils." [official]
- Diagram practices (Well-Architected, "Create architecture design diagrams", `ms.date` 2025-08-13). [official]
  - "Always use arrows, and when bi‑directional communication exists, either show two separate flows (preferred) or annotate a single arrow with request/response notes."
  - "Avoid bidirectional arrows. Double arrows imply bidirectional dependencies, which can create confusion."
  - "Provide a legend. If you introduce border or line semantics, for example, solid is a synchronous call while dash is asynchronous, include a compact legend."
  - "Avoid relying solely on color to distinguish types, instead consistently pair color with pattern."
  - "Label everything clearly", "Maintain consistency" (colours, icon sizes, line weights, line types, arrow heads, border styles), "Include metadata" (title, description, last updated date, author, version).
  - "Be accurate ... don't depict a PaaS service inside a subnet if it's actually accessed over a private endpoint."
  - Lists C4 among optional specifications.
- Neither page defines border colours, dash styles or badges for subscriptions, resource groups, virtual networks, subnets or regions. Not found. [official · summary only] The icon set contains icons for Subscriptions, Resource Groups, Management Groups, Virtual Networks and Subnet. [measured]
- Azure icons are not category-coloured: compute, databases, networking, storage and identity folders are all dominated by blue `#0078D4` and related blues. [measured] No page states a category-colour rule. Not found.

### Recommendation for the project

- The Azure "second cloud" zone (light-blue border, vendor logo) has no Azure source. Treat its look as house style and explain it in the legend. [inference]
- The dashed-equals-asynchronous example is a Microsoft *example* of a legend-backed semantic, not a rule. [official]

## 3. Google Cloud

### Evidence

- The icon library page offers product category icons, core product icons, legacy console icons and an overview PDF. "In early 2025, we updated our product iconography." [official]
- Overview PDF ("Google Cloud product icons", "Updated: May 2026"): the system went "from over 250 unique icons to ~40": unique core product icons (4-colour) and general product category icons (2-colour). Each general product maps to one category icon. Legacy console icons "should not be used as of 2026." [official]
- Category icons all use the same two fills, a blue (`#4285F4` or `#2B80F8`) and grey `#9AA0A6`, so colour does not encode category. [measured]
- Neither the page nor the PDF gives terms of use, grouping, boundary, line or label rules. Not found. [official · summary only]
- The diagramming tool URL `googlecloudcheatsheet.withgoogle.com/architecture` returns a redirect to `cloud.google.com/products`. [measured] A forum thread suggested it was retired. [secondhand]

### Recommendation for the project

- Use core product icons where they exist, else the category icon, per the PDF. Do not use legacy icons. [official]
- Treat any Google zone style as house style with a legend entry. [inference]

## 4. Kubernetes, Red Hat, Docker, Argo CD

### Evidence

**Kubernetes.** The `kubernetes/community` `icons/` set exists "to standardize Kubernetes architecture diagrams". Icons come labeled and unlabeled, as PNG and SVG, for control plane components, infrastructure components and resources. License: "a choice of either Apache-2.0 or CC-BY-4.0". The Kubernetes logo is a Linux Foundation trademark under its trademark usage guidelines. [official] Last commit under `icons/`: 2026-01-26. [measured] No grouping or line rules found. [official · summary only]

**Linux Foundation trademark usage.** Use official logo versions; do not change colours, design elements or scale; fair use of word marks must not imply endorsement. The page does not address diagrams. [official]

**Red Hat.**
- Standard icons are for "general technology concepts"; "Icons are paired with brief text in technical diagrams." Licence CC BY 4.0; attribution optional for individual uses such as a diagram. Don't combine, rotate or stretch icons; "Don't use icons from other companies or free icons from the internet"; "Never use AI to generate new icons." [official]
- Technology icons identify products (such as OpenShift) and are used in "marketplaces and catalogs, diagrams, and favicons". "Use the icons as provided without modifications." "Use the full technology icon, including the rounded rectangle." "Do not co-brand a technology icon with a partner or customer logo." Download is through Red Hat's brand portal. No licence is stated. [official]
- The Portfolio Architecture team publishes draw.io tooling and libraries for "logical, schematic, detail diagrams" on GitLab (`redhatdemocentral/portfolio-architecture-tooling`). Its schematic library defines six coloured "Network" lines (solid, 2 px) and a grey solid "Data" line with a filled arrowhead; no dashed line style. Last project activity: 2022-09-17. No licence is stated. [measured]

**Docker.** Brand page: logos in Docker brand colours only, at least 24 px, with clear space; don't flip, tilt, stretch, crop, recolour, or use the wordmark alone. [official] Trademark guidelines: logos "may be taken only from Docker's product sheet or from Docker's service screen shot following authorization from us." Word marks (not logo marks) may be used in an informational context. Other uses need "express written permission". Diagrams are not addressed. [official]

**Argo CD.** CNCF artwork has an Argo project logo (horizontal, icon, stacked; colour, black, white) but no Argo CD-specific asset. [measured] Artwork is "made available under the Linux Foundation trademark usage guidelines." [official]

### Recommendation for the project

- Docker: the logo needs Docker's authorization for most uses. Use a plain box with the word "Docker" unless the team holds permission, or a vendor icon set (for example a container icon) that represents the concept. Owner decision. [inference]
- Argo CD: only the Argo project logo is official. Show "Argo CD" in the caption under it. [inference]

## 5. C4 model rules for open owner decisions

### Evidence

- **Notation.** "The C4 model is notation independent, and doesn't prescribe any particular notation." Colours are "**isn't** something that is dictated by the C4 model"; keep colour coding consistent. [official]
- **Dashed versus solid.** Not prescribed. The review checklist asks only whether the reader understands "all border styles used? (e.g. solid, dashed, etc)" and "all line styles used? (e.g. solid, dashed, etc)". [official] Structurizr, the C4 author's tool, draws all relationships as "dashed grey lines" by default, and allows `style <solid|dashed|dotted>` per tag. [official] So dashed lines carry no C4 meaning; any meaning must go in the key. [inference]
- **Direction.** "Every line should represent a unidirectional relationship." "Every line should be labelled, the label being consistent with the direction and intent of the relationship." Avoid single words like "Uses". [official] The FAQ leaves dependency versus data-flow direction to the author: "make sure that the description of the line matches the direction of the arrow." [official] Bidirectional arrows are not addressed beyond the unidirectional rule. [official · summary only]
- **Dynamic diagram step numbering.** Based on a UML communication diagram, "with numbered interactions to indicate ordering". Two styles: collaboration (free-form layout) and sequence. Scope: one feature, story or use case. [official] Structurizr supports explicit order prefixes (`1:`, `2:`) and parallel sequences; its example gives two parallel steps the same number `2`. [official] C4 does not define letter suffixes such as `1a.`. Not found.
- **Deployment diagram.** "A deployment node represents where an instance of a software system/container is running": physical, virtualised (IaaS, PaaS, VM), containerised (Docker container), or an execution environment. "Deployment nodes can be nested." Include "infrastructure nodes such as DNS services, load balancers, firewalls, etc." Scope: one deployment environment (production, staging, development). [official] The Structurizr AWS cookbook nests "Amazon Web Services" > "US-East-1" > "Amazon EC2" > "Ubuntu Server" and models Route 53 and ELB as infrastructure nodes. [official]
- **Icons.** "Feel free to use icons provided by Amazon Web Services, Azure, etc to complement your deployment diagrams … just make sure any icons you use are included in your diagram key/legend." [official] The checklist asks whether all icons are understood. [official]
- **Key.** "Every diagram should have a key/legend explaining the notation being used." Element type and technology must be explicit. [official]
- **Diagram types.** Core: System context, Container, Component, Code. Supplementary: System landscape, Dynamic, Deployment. "You don't need to use all 4 levels"; context and container diagrams suffice for most teams. [official]

### Recommendation for the project

- Decision 5 (dashed lines): C4 and the vendors leave the meaning open. If the team keeps dashed lines, define one meaning in the legend of every diagram that uses them. [inference]
- Two-way flows: both C4 (unidirectional rule) and Azure ("two separate flows (preferred)") point to two single-headed lines. AWS provides a double-headed preset, so a double arrow is not forbidden by AWS. [official; synthesis is inference]
- Step labels: C4 requires numbers but not a format. AWS callouts forbid letters. The `1a.` form is house style. [official; synthesis is inference]
- The house zones map cleanly to nested C4 deployment nodes, and gateways or VPN connectors map to infrastructure nodes. [inference]

## 6. Verdicts on observed house-style features

| Observed feature | Verdict | Basis |
|---|---|---|
| Cloud zone: thin dark border, dark square badge with cloud glyph (once a vendor wordmark), title beside it | **Official vendor convention (AWS)** | AWS Cloud group: badge `#242F3E`, AWS-logo and cloud-glyph variants, cloud glyph where the AWS logo cannot be used. The deck border is the theme text colour (black); draw.io uses `#232F3E`. [official], [measured] |
| Account zone: pink/magenta border and pink badge | **Official vendor convention (AWS)** | AWS account group: border and badge `#E7157B`. [measured] |
| Account zone: pink title | **Tool convention (draw.io), not AWS** | AWS deck label is black 12 pt; draw.io AWS 4 sets label colour `#CD2264`. [measured] |
| Logical group: thin grey border | **Official vendor convention (AWS generic group)** | Generic group border `#7D8998`, solid or dashed, no badge. [measured] |
| Logical group: bold title | **Not found (team habit)** | No AWS group label is bold. [measured] |
| Service icons as coloured tiles, colour follows category | **Official vendor convention (AWS only)** | Every AWS service SVG uses its category fill. [measured] Azure (mostly blue) and Google (blue and grey for all categories) do not encode category by colour. [measured] |
| Second-cloud zone: light-blue border, vendor logo | **Not found (team habit)** | Azure and Google publish no boundary styles. [official · summary only] |
| Dashed line for authentication | **Not found (team habit)** | No dashed connector in AWS presets; Azure gives dashed = asynchronous only as a legend example; C4 prescribes nothing. [official], [measured] |
| Dashed line for a query call | **Not found (team habit)** | Same sources as above. |
| Orthogonal lines with arrowheads | **Official vendor convention (AWS)** | "Use straight lines and right angles ... wherever possible." Preset arrows are solid "Open Arrow" size 4 (open, not filled). [official] |
| Double-headed arrows for two-way flows | **Allowed by AWS presets; discouraged by Azure and C4** | AWS preset sheet has double-headed arrows. [measured] Azure: "Avoid bidirectional arrows." C4: unidirectional lines. [official] |
| Caption centred below the icon | **Consistent with AWS** | AWS example places 12 pt labels centred below icons. [measured] Azure asks for the name near the icon. [official] |
| Step numbers `1a.`, `1b.` in labels | **C4 convention for numbering; letter format is team habit** | C4 dynamic diagrams number interactions. AWS callouts are black circles with numbers only and forbid letters. [official] |
| Numbered yellow area circles (S9) | **Not found (team habit)** | AWS callouts are black with white type and mark process steps. [official] |
| Legend, element type and technology (S10) | **C4 convention** | Key, type and technology required. [official] |

## Not verified

- Whether the owner's AWS samples used draw.io's AWS 4 library or the AWS deck. The pink account title suggests draw.io. [inference]
- Whether the sample's "dark-grey" cloud border is draw.io `#232F3E` or the deck's black. Not measured on the samples. [unverified lead]
- Whether the two icon generations seen in the samples match a specific earlier AWS or Azure release. Older releases were not downloaded. [unverified lead]
- Google Cloud icon terms of use: none found on the icon page or PDF. [unverified lead]
- Red Hat technology icon licence: not stated on the page. [unverified lead]
- Whether the Red Hat Portfolio Architecture tooling is still maintained or linked from the Red Hat Architecture Center: the catalog page fetch returned no content; last GitLab activity is 2022-09-17. [unverified lead]
- Whether an official Argo CD-specific logo exists outside CNCF artwork (for example in the `argoproj` repositories). Not checked. [unverified lead]
- Whether Docker's trademark guidelines allow its logo in customer architecture diagrams without permission. The text does not address diagrams. [unverified lead]
- Structurizr's built-in cloud themes (colours, icon versions) were not inspected.
- The dark-background AWS deck was not parsed; values above come from the light deck plus the dark badge SVGs.

## Decisions for the owner

1. **AWS colour authority**: follow the AWS deck values (account label black, account border `#E7157B`) or the draw.io AWS 4 library values (label and border `#CD2264`)?
2. **Dashed lines**: keep them for authentication and queries with a legend entry, or drop them? No source requires either.
3. **Two-way flows**: two single-headed lines (C4, Azure) or the AWS double-headed preset?
4. **Step label format**: keep `1a.` in labels, or use AWS-style numbered callouts (numbers only)?
5. **Docker logo**: use a plain box unless the team has Docker's permission?

## Sources

- AWS, "AWS Architecture Icons", https://aws.amazon.com/architecture/icons/ (accessed 2026-10-28): downloads, release cadence, permitted use.
- AWS, `Icon-package_07312026` zip and `Microsoft-PPTx-toolkits_07312026` zip (`AWS-Architecture-Icons-Deck_For-Light-BG_07312026.pptx`), linked from the page above (downloaded and parsed 2026-10-28): group, arrow, label, callout guidance and colour values.
- draw.io, `Sidebar-AWS4.js`, https://github.com/jgraph/drawio/blob/dev/src/main/webapp/js/diagramly/sidebar/Sidebar-AWS4.js (accessed 2026-10-28): draw.io AWS group styles.
- Microsoft, "Azure icons", https://learn.microsoft.com/en-us/azure/architecture/icons/ (accessed 2026-10-28), and `Azure_Public_Service_Icons_V24.zip` with its FAQ and terms PDFs (downloaded 2026-10-28).
- Microsoft, "Create architecture design diagrams", https://learn.microsoft.com/en-us/azure/well-architected/architect-role/design-diagrams (accessed 2026-10-28).
- Google Cloud, "Icon library", https://cloud.google.com/icons (accessed 2026-10-28), with `google-cloud-product-icons.pdf` and `category-icons.zip` from https://services.google.com/fh/files/misc/ (downloaded 2026-10-28).
- Google Cloud architecture diagramming tool, https://googlecloudcheatsheet.withgoogle.com/architecture (accessed 2026-10-28; redirects to the products page).
- Kubernetes, icons README, https://github.com/kubernetes/community/tree/master/icons, and logo usage guidelines, https://github.com/kubernetes/kubernetes/blob/master/logo/usage_guidelines.md (accessed 2026-10-28).
- Linux Foundation, "Trademark usage", https://www.linuxfoundation.org/legal/trademark-usage (accessed 2026-10-28).
- CNCF, artwork README and LICENSE, https://github.com/cncf/artwork (accessed 2026-10-28), including `projects/argo`.
- Red Hat, "Icons – standard icons", https://www.redhat.com/en/about/brand/standards/icons/standard-icons, and "Technology icons", https://www.redhat.com/en/about/brand/standards/icons/technology-icons (accessed 2026-10-28).
- Red Hat Portfolio Architecture tooling, https://gitlab.com/redhatdemocentral/portfolio-architecture-tooling (README and `Libraries/Schematic Diagrams`, accessed 2026-10-28).
- Red Hat Architecture Center, https://www.redhat.com/architect/portfolio/ (accessed 2026-10-28; fetch returned only the title).
- Docker, "Media resources" (brand guidelines), https://www.docker.com/company/newsroom/media-resources/, and "Trademark guidelines", https://www.docker.com/legal/trademark-guidelines/ (accessed 2026-10-28).
- C4 model, https://c4model.com/diagrams, https://c4model.com/diagrams/notation, https://c4model.com/diagrams/checklist, https://c4model.com/diagrams/dynamic, https://c4model.com/diagrams/deployment, https://c4model.com/diagrams/faq (accessed 2026-10-28).
- Structurizr docs, https://docs.structurizr.com/dsl/language, https://docs.structurizr.com/dsl/cookbook/relationship-styles/, https://docs.structurizr.com/dsl/cookbook/dynamic-view/, https://docs.structurizr.com/dsl/cookbook/dynamic-view-parallel/, https://docs.structurizr.com/dsl/cookbook/amazon-web-services/ (accessed 2026-10-28).
