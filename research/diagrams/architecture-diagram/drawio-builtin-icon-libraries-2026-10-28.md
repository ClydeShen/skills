# Research: draw.io built-in shape libraries for official vendor icons

Date: 2026-10-28. Subject: Whether draw.io's built-in shape libraries can supply the official icons of AWS, Microsoft Azure, Google Cloud, Red Hat (including OpenShift), Docker, Kubernetes and Argo CD for generated `.drawio` files. Covers library naming, vendor icon-set version, offline rendering, a way to get valid shape names, licensing, and when the trial fails. Context: This tests the trial approach in section 2.7 of [the requirements note](requirements-and-observed-style-2026-10-28.md): reference draw.io built-in shapes and store no icon files. A separate icon set is out of scope here and is mentioned only where the trial falls short.

Confidence markers:
- **[official]**: read in a primary source: the jgraph/drawio or jgraph/drawio-desktop repository (source, ChangeLog, README), drawio.com documentation, or a vendor's official icon or brand page.
- **[measured]**: the result of a command run by the author on 2026-10-28 against the `dev` branch of jgraph/drawio at release 32.6.1 (commit `84487b48`), unless stated otherwise.
- **[inference]**: the author's judgment, with no direct evidence.
- **[unverified lead]**: a plausible claim that must be checked against a primary source before use.

No owner-supplied samples were used, so the requirements note's **[observed]** marker does not appear. Unless a source line says otherwise, every source was accessed on 2026-10-28.

## Overview

| Question | Finding | Strength of evidence | Confidence |
|---|---|---|---|
| 1. Built-in library per vendor | AWS, Azure, Google Cloud and Kubernetes have current built-in libraries. Docker and Argo CD have none from their own vendor. Red Hat has no Red Hat-authored library; OpenShift appears only as icons drawn by AWS, Microsoft and IBM. | strong | [official], [measured] |
| 2. Vendor version match | AWS matches the Q3-2026 package, the current one. Azure includes the July 2026 icons (download V24). Google Cloud's "2026" library follows the 2025 icon system, but the ChangeLog calls it preliminary. Kubernetes matches the kubernetes/community icon set; whether it includes that set's 2024 update is not verified. | strong for AWS and Azure; medium for Google Cloud and Kubernetes | [official], [measured] |
| 3. Offline rendering | draw.io desktop bundles all built-in libraries and blocks remote network connections by design. A `.drawio` file stores only style strings, except for libraries whose style carries a data URI. The embeddable JavaScript viewer loads stencils and images from `viewer.diagrams.net` by default. | strong for desktop; weak for Confluence and VS Code | [official], [measured] |
| 4. Authoritative name list | Decode `js/stencils.min.js` to get every registered stencil name, and run `Sidebar-*.js` against a stub to get each palette entry's title and style. Both worked on 2026-10-28. Validate statically: an unknown name renders as a plain rectangle or an empty tile, with no error. | strong | [measured] |
| 5. Licensing | draw.io code is Apache-2.0. Its icon sets carry an extra restriction on use in Atlassian products, which does not apply to diagram output. AWS, Microsoft, Red Hat and Kubernetes allow use in architecture diagrams. Docker restricts its logos. Google's icon page states no terms. | strong for written terms; legal interpretation not done | [official] |
| 6. Trial outcome | The trial already fails its first criterion for Docker, Argo CD and Red Hat product icons. It holds for AWS, Azure, Google Cloud and Kubernetes, if the skill pins one library per vendor and validates names. | medium | [inference] |

## 1. Built-in library per vendor, naming and shape type

### Evidence

draw.io defines each library in `src/main/webapp/js/diagramly/sidebar/Sidebar-<Name>.js`. Each palette entry is a style string plus a title. Since release 32.0.0 (2026-10-03), the public repository ships stencils as one compressed bundle, `js/stencils.min.js`, instead of `stencils/*.xml`. [official: ChangeLog 32.0.0, "Ships the public repository with the stencil bundle instead of the stencil XML"] The bundle holds 204 stencil files that register 9,090 stencil names. [measured]

A style resolves in one of three ways [official: `Graph.js` `mxStencilRegistry.getBasenameForStencil`; `Sidebar-*.js`]:
- **Stencil (vector XML).** `shape=mxgraph.<lib>.<name>` loads `<lib>.xml` from the bundle. Some vendors wrap a stencil in a JavaScript shape that draws a coloured tile or frame and then the stencil, for example `shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.lambda`.
- **Bundled image file.** `image=img/lib/<lib>/<category>/<File>.svg`. This is a path relative to the draw.io application.
- **Inline data URI.** `image=data:image/svg+xml,<base64>`. The SVG travels inside the diagram file.

| Vendor | Library id and More Shapes title | Style naming | Shape type | Size, measured 2026-10-28 |
|---|---|---|---|---|
| AWS | `aws4`, titled "AWS " plus the current calendar year | `shape=mxgraph.aws4.<name>`; service icons use `shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.<name>`; groups use `mxgraph.aws4.group` and `groupCenter` | Stencil, plus JavaScript wrappers in `shapes/mxAWS4.js` | 1,050 stencils in `aws4.xml`; 969 palette entries |
| AWS (retired) | `aws4r`, "AWS (retired)" | same as `aws4` | Stencil | 76 entries |
| AWS, older | `aws3` (AWS17), `aws4b` (AWS18), `aws3d` | `mxgraph.aws3.*`, `mxgraph.aws4.*` | Stencil | Not counted; legacy |
| Azure | `azure2`, "Azure" | `image=img/lib/azure2/<category>/<File>.svg` | Bundled SVG image | 704 SVG files; 766 entries referencing 701 paths |
| Azure, older | `azure` (`mxgraph.azure.*`), `mscae` (Microsoft Cloud and Enterprise, `img/lib/mscae/`) | stencil and image | mixed | 90 stencils in `azure.xml`; legacy |
| Google Cloud | `gcp3`, "Google Cloud Platform 2026" | `shape=mxgraph.gcp3.<name>` | Stencil | 45 stencils (26 category, 19 core product) |
| Google Cloud, older | `gcp2` "Google Cloud Platform", `gcpicons` "GCP Icons" | `mxgraph.gcp2.*`; GCP Icons use inline data URIs | Stencil; inline data URI | `gcp2.xml` has 297 stencils; GCP Icons have 139 entries, all data URIs |
| Kubernetes | `kubernetes`, "Kubernetes" | `shape=mxgraph.kubernetes.icon2;prIcon=<name>` (labelled) and `mxgraph.kubernetes.icon` (unlabelled) | Stencil inside a heptagon JavaScript wrapper, `shapes/mxKubernetes.js` | 40 and 39 stencils in `kubernetes.xml` and `kubernetes2.xml`; 78 entries |
| Red Hat / OpenShift | None from Red Hat | See below | — | — |
| Docker | None from Docker | See below | — | — |
| Argo CD | None | — | — | — |

[official: `Sidebar.js` library list and More Shapes titles; measured: counts]

The Kubernetes `prIcon` values (`api`, `c_c_m`, `c_m`, `c_role`, `cm`, `control_plane`, `crb`, `crd`, `cronjob`, `deploy`, `ds`, `ep`, `etcd`, `group`, `hpa`, `ing`, `job`, `k_proxy`, `kubelet`, `limits`, `netpol`, `node`, `ns`, `pod`, `psp`, `pv`, `pvc`, `quota`, `rb`, `role`, `rs`, `sa`, `sc`, `sched`, `secret`, `sts`, `svc`, `user`, `vol`) match the file names in the kubernetes/community icon set. [measured]

A search of every sidebar file and every bundled stencil name for Red Hat, OpenShift, Docker, Argo, Helm and CNCF found only these [measured]:

| Found | Library | Who drew it |
|---|---|---|
| `mxgraph.aws4.red_hat_openshift`, titled "Red Hat OpenShift Service on AWS" | AWS / Containers | AWS's icon for its own managed service |
| `img/lib/azure2/containers/Azure_Red_Hat_OpenShift.svg` | Azure / Containers | Microsoft's icon for its own managed service |
| `mxgraph.ibm_cloud.logo--openshift` | IBM / Groups and Containers | IBM's depiction |
| `img/lib/mscae/OpenShift.svg`, `img/lib/mscae/Docker.svg` | "CAE / Companies" | Microsoft's legacy Cloud and Enterprise set |
| Istio logo, Kubernetes logo | GCP2 and GCP Icons / Open Source Icons | Google's set |

The `Docker.svg` in `mscae` uses nine fill colours, including `#394d54`. [measured] Docker's brand page says the Docker logos "must always appear as one of Docker's primary brand colors", and that the symbol replaces "the retired, vertical design". [official: Docker brand guidelines] The `mscae` whale is therefore probably not the current Docker logo. [inference]

### Recommendation for the project

- Catalog only one library generation per vendor: `aws4`, `azure2`, `gcp3` and `kubernetes`. Exclude `aws3`, `aws4b`, `aws4r`, `azure`, `mscae`, `gcp2` and `gcpicons` from automatic selection. This also follows the "one icon-set generation per vendor" rule in section 2.7. [inference]
- For OpenShift, use the AWS or Azure icon only when the element really is that vendor's managed service (ROSA or Azure Red Hat OpenShift). Self-managed OpenShift, RHEL, Ansible, Docker and Argo CD have no official built-in icon. [inference]

### Relation to existing constraints

Section 2.7 forbids borrowing an icon from another vendor. That rule excludes the IBM and Microsoft depictions of OpenShift and Docker. [inference]

## 2. Vendor icon-set version and last update

### Evidence

Git path history in jgraph/drawio starts on 2025-09-05 (release 28.2.0) for files under `js/diagramly/sidebar/`, and commit messages contain only release numbers. Content dates below come from `ChangeLog`. [measured; official: ChangeLog]

| Vendor | draw.io content update (ChangeLog) | Latest file commit | Vendor's current official release | Match |
|---|---|---|---|---|
| AWS (`aws4`) | 2026-09-08, 31.4.5: "Updates AWS shapes to the Q3-2026 icon package and adds an AWS (retired) library" | `Sidebar-AWS4.js` 2026-09-08; `mxAWS4.js` 2026-01-17 | The AWS page links `Icon-package_07312026` (Q3 2026). AWS releases "Q1 (end of January), Q2 (end of April), and Q3 (end of July). No releases occur in Q4." | Current until the Q1 2027 package [official] |
| Azure (`azure2`) | 2026-07-13, 30.3.7: "Updates azure icons [jgraph/drawio#5301]"; 2026-09-28, 31.6.0: "Adds missing viewBox to Azure SVG icons" | `img/lib/azure2` 2026-10-01; `Sidebar-Azure2.js` 2026-10-03 | Download `Azure_Public_Service_Icons_V24.zip`; latest icon update listed is July 2026; page `ms.date` is 2026-07-09 | Likely V24. All 13 July 2026 and November 2025 names checked are present, for example `Azure_DocumentDB`, `AI_Gateway`, `Resiliency`, `DDoS_Custom_Policy`, `Foundry_Agent_Service`, `Azure_Linux`, `Azure_Local`, `AKS_Network_Policy`. [measured] The full V24 file list was not compared. |
| Google Cloud (`gcp3`) | 2026-05-26, 30.0.3: "Adds new GCP3 stencils. Preliminary version, content added, but many things to fix."; 2026-10-02, 31.7.1: "Adds curated connection points to the GCP 2026 stencils" | `Sidebar-GCP3.js` 2026-10-03 | Google introduced a new icon system in early 2025: about 40 icons, unique 4-colour icons for core products and 2-colour category icons for all other products. The overview PDF says "Updated: May 2026". | Structure matches: 26 category and 19 core stencils. [measured] The PDF's core list names Gemini; `gcp3` has `vertexai` and no Gemini stencil. [measured] |
| Google Cloud (`gcp2`, `gcpicons`) | Last content update 2023-12-06, 22.1.6: "Updates GCP icons [drawio-3254]"; later entries changed only colours or connection points | `Sidebar-GCP2.js` 2026-10-08; `Sidebar-GCPIcons.js` 2026-05-16 | Google publishes the pre-2025 icons as "Legacy console icons" | Legacy [official] |
| Kubernetes | 2023-12-26, 22.1.12: "Adds new Kubernetes shapes [drawio-3699]"; 2026-10-02, 31.7.1: connection points only | `Sidebar-Kubernetes.js` 2025-09-05; `mxKubernetes.js` 2026-10-03 | kubernetes/community `icons/`, last icon change on 2024-07-23 ("fix path to dockerfile, updae icons, update visio file") | Names match. Whether the 2024-07-23 change is included: [unverified lead] |

The AWS library title "AWS <year>" comes from `new Date().getFullYear()`, so it is not a version label. [official: `Sidebar.js`]

The ChangeLog shows that draw.io once removed Azure icons: 2020-07-22, 13.5.1, "Removes official Azure icons for licensing reasons". They returned on 2020-09-28 ("Updates Azure icons"). [official] The reason and the current agreement are not documented in the repository. [unverified lead]

### Recommendation for the project

Pin the catalog to one draw.io release tag. Record the vendor release it represents (for example AWS Q3-2026, Azure V24, Google Cloud 2025 system) and re-check after each vendor release: AWS in February, May and August; Azure when its page lists a new month. [inference]

### Relation to existing constraints

This answers the requirements note's open item "icon-set version" for AWS, Azure and Google Cloud. Kubernetes has no versioned release.

## 3. Offline rendering and other viewers

### Evidence

- draw.io desktop is "designed to be completely isolated from the Internet, apart from the update process". Its Content Security Policy "restricts the application's own network connections to itself". The README also says a diagram that references external media fetches that media when it opens. [official: drawio-desktop README] `DRAWIO_DISABLE_UPDATE=true` or `--disable-update` turns off the update check. [official]
- drawio is a git submodule of drawio-desktop. Desktop tag v32.6.1 pins drawio commit `84487b48`, the drawio v32.6.1 release commit. [measured] The packaging config excludes stencil XML, `shapes/` and unminified sources, and keeps everything else, including `img/lib/**` and `js/stencils.min.js`. [official: `electron-builder-linux-mac.json`] The vendor sidebars and wrapper shapes are compiled into `js/app.min.js`. [measured: `addAWS4Palette`, `addAzure2Palette`, `addGCP3Palette`, `addKubernetesPalette` and `mxgraph.kubernetes.icon2` occur in it]
- The drawio.com page "Run draw.io offline" says desktop diagrams need no internet connection. The browser PWA works offline after loading, but "Search for and use the online clipart shapes" is listed as unavailable offline. [official]
- A `.drawio` file is XML. Shapes, styles and even the visible shape libraries are described in it. [official: drawio.com "Manually edit the diagram source"] A stencil or `img/lib/...` style is a name or relative path, so the viewer must ship that library. [official: `Graph.js`] GCP Icons entries and 164 of the GCP2 entries embed the SVG as a data URI, so those render without the library. [measured]
- The embeddable JavaScript viewer `js/viewer-static.min.js` does not contain the stencil bundle. It defaults to `STENCIL_PATH = "https://viewer.diagrams.net/stencils"`, `SHAPES_PATH = "https://viewer.diagrams.net/shapes"` and `GRAPH_IMAGE_PATH = "https://viewer.diagrams.net/img"`. [measured] A page that embeds this viewer therefore needs network access to `viewer.diagrams.net`, or a host that overrides these paths. [inference]
- The VS Code extension "Draw.io Integration" is third-party (Henning Dieterichs), and the editor "is bundled with the VS Code editor so you can code and diagram offline". [official: drawio.com "Create diagrams directly in VS Code"] Its CHANGELOG for 1.17.0 says "Updated Draw.io to v32.3.0", which is later than the AWS Q3-2026 update in 31.4.5. [official: hediet/vscode-drawio CHANGELOG] The Marketplace version was not checked. [unverified lead]
- Confluence: no primary source read states which draw.io version the Confluence Cloud or Data Center app uses or whether it needs outbound access to render built-in shapes. [unverified lead] The drawio.com edition comparison lists a "Zero Egress" app for Confluence Cloud, but does not mention shape rendering. [official]
- draw.io desktop has a command-line export (`-x`, `--export`, formats pdf, svg, png, jpeg, xml, html). [official: drawio-desktop `src/main/args.js`] An offline render check could use it; the author did not run it because desktop is not installed on this machine. [measured]

### Recommendation for the project

- Treat draw.io desktop at or above the pinned release as the reference renderer. [inference]
- Before accepting the trial, open a sample file in desktop with the network disconnected. The file should contain one `aws4`, `azure2`, `gcp3` and `kubernetes` shape and one deliberately invalid name. Confirm the four icons render. Repeat in the team's Confluence app. [inference]

### Relation to existing constraints

This meets the "renders offline in the team's draw.io setup" criterion in section 2.7 for desktop. It does not yet meet it for Confluence or for embedded HTML viewers.

## 4. Getting the authoritative list of valid shape names

### Evidence

Two methods worked on 2026-10-28 with Node.js 24, outside the downloaded sources. The scripts were in the session scratchpad and may not exist later. [measured]

1. **Registered stencil names.** `js/stencils.min.js` defines `f['<file>.xml'] = '<base64>'` and a `decode` function. The data is raw-deflated, and `decode` needs the globals `atob`, `pako.inflateRaw` (replaceable by Node's `zlib.inflateRawSync`) and `mxStencilRegistry.loadStencil`. Each decoded file is a `<shapes name="mxgraph.<lib>">` tree. draw.io registers each name as the package name in lower case, a dot, then the shape name in lower case with spaces replaced by `_`. [official: `Graph.js` `mxStencilRegistry.parseStencilSet`] Result: 204 files and 9,090 names.
2. **Palette entries (title and style).** Run each `Sidebar-<Name>.js` against a stub `Sidebar.prototype` that records `createVertexTemplateEntry(style, w, h, value, title)`. Results: `addAWS4Palette` 969 entries, `addAzure2Palette` 766, `addGCP3Palette` 45, `addKubernetesPalette` 78. GCP2 needs extra stubs for `addEntry` and `addDataEntry`. Titles such as "Lambda" or "Red Hat OpenShift Service on AWS" give the human-readable key for exact lookup.

Cross-check of method 2 against method 1 and the repository file tree [measured]:
- Every `mxgraph.aws4.*`, `mxgraph.gcp3.*` and Kubernetes reference resolves to a bundled stencil. The exceptions are the JavaScript wrapper shapes `aws4.resourceIcon`, `aws4.group`, `aws4.groupCenter` and `kubernetes.icon2`.
- Four `azure2` paths differ in letter case from the files: `solutions.svg` against `Solutions.svg`, `IP_Address_Manager.svg` against `IP_Address_manager.svg`, `Arc_Data_Services.svg` against `Arc_Data_services.svg`, and `Database_Instance_for_SAP.svg` against `Database_Instance_For_SAP.svg`. Whether these render depends on the file system or server. [unverified lead]

Failure is silent:
- `mxCellRenderer.createShape` falls back to the default vertex shape, a rectangle, when a name is neither a registered shape nor a stencil. [official: `mxgraph/src/view/mxCellRenderer.js`]
- `mxShapeAws4ResourceIcon` draws the coloured tile and skips the glyph when `resIcon` is unknown. [official: `shapes/mxAWS4.js`]

### Recommendation for the project

- Generate the catalog from a pinned drawio tag with both methods. Store per entry: vendor, library id, palette, title, full style string and source type (stencil, image or data URI). [inference]
- Validate each generated file statically against that catalog. A render check cannot detect a wrong name, because the result is a plain rectangle or an empty tile. [inference]
- Check `img/lib` paths with exact case against the tagged file tree. [inference]

### Relation to existing constraints

This implements the "exact lookup in a catalog" and "post-generation check" rules in section 2.7. The catalog holds style strings, not icon files, so requirement R3 still holds. [inference]

## 5. Licensing and trademark

### Evidence

| Party | Terms (quoted or closely paraphrased) | Source |
|---|---|---|
| draw.io | Source code is Apache-2.0. Icon sets and stencil libraries "and any derivatives thereof ... may not be used as software assets in, distributed for use with, or incorporated into Atlassian products or products distributed through the Atlassian marketplace or plugin ecosystem, without explicit written permission. This restriction does not apply to end-user diagram output (such as exported images or documents)". "Some icons are originally defined by third-party copyright holders; we have verified that all original licenses permit use in this project." "We make no copyright claim on diagrams you create." The same restriction is in `img/LICENSE`, `shapes/LICENSE` and `stencils/LICENSE`. | [official: jgraph/drawio README and LICENSE files] |
| AWS | "We allow customers and partners to use these toolkits and assets to create architecture diagrams." Icons may also go in whitepapers, presentations, data sheets and posters. The trademark guidelines forbid imitating AWS "trade dress", including product icons. | [official: AWS Architecture Icons; AWS Trademark Guidelines] |
| Microsoft Azure | "Microsoft permits the use of these icons in architectural diagrams, training materials, or documentation. You can copy, distribute, and display the icons only for the permitted use unless granted explicit permission by Microsoft." The don'ts are: crop, flip or rotate; distort or change shape; use Microsoft icons to represent your own product. | [official: Azure architecture icons] |
| Google Cloud | The icon page offers the icons "for your diagrams, technical documentation, and more". No licence or usage terms were found on the page or in the overview PDF. | [official] |
| Kubernetes | Icon set licensed under Apache-2.0 or CC-BY-4.0. The Kubernetes logo is a Linux Foundation trademark, subject to its trademark usage guidelines. | [official: kubernetes/community `icons/README.md`] |
| Red Hat | Red Hat icons are CC BY 4.0; "For individual uses, such as a diagram or presentation, attribution is optional." Technology icons are used in "diagrams" and must be used "as provided without modifications". The GitHub icon repository has no OpenShift product or technology icon; technology icons are downloaded from a Red Hat brand portal. | [official: Red Hat Icons and Technology icons pages; RedHat-UX/red-hat-icons tree] |
| Docker | Docker logos, including "Moby Dock", "may be taken only from Docker's product sheet or from Docker's service screen shot following authorization from us. Do not create imitations, facsimiles or reproductions". | [official: Docker Trademark Guidelines] |
| Argo (CNCF) | cncf/artwork has Argo icon and logo files (`projects/argo/icon/color/argo-icon-color.svg` and others). The artwork "is made available under the Linux Foundation trademark usage guidelines". The files are for the Argo project; there is no separate Argo CD mark in that folder. | [official: cncf/artwork LICENSE.md and tree] |

### Recommendation for the project

- Referencing draw.io's built-in shapes by name and shipping the diagrams is covered by the "end-user diagram output" exception. The skill package stores no draw.io icon assets. [inference; not legal advice]
- If a separate icon set is built later, take files from the vendors, not from draw.io's `img/lib` or stencil bundle. draw.io's restriction covers derivatives, and the team uses Confluence. [inference]
- The Azure don'ts and Red Hat's "as provided" rule mean generated styles must not rotate, flip or recolour vendor icons. Add this to the post-generation check. [inference]

### Relation to existing constraints

This refines the section 2.7 rule that a third-party product uses its official logo "only where its terms allow". Under Docker's terms, Docker needs authorization or the plain-box fallback. [inference]

## 6. Gaps, risks and failure criteria

### Gaps and risks

1. **Coverage.** No built-in library has official icons for Docker, Argo CD, self-managed OpenShift or other Red Hat products. [measured] Section 2.7 already names this as a reason to switch.
2. **Google Cloud granularity.** Google's current system gives most products a shared category icon. A diagram that follows Google's rules shows the same icon for several services. Requirement R2 ("the icon must match the element exactly") must accept the category icon as the exact official icon for such products. [official: Google icon overview PDF; inference for the R2 reading]
3. **Preliminary Google Cloud library.** draw.io calls `gcp3` preliminary, and its core list differs from Google's (Vertex AI against Gemini). [official; measured]
4. **Silent failures.** Wrong names render as rectangles or empty tiles. Four Azure paths depend on letter case. [official; measured]
5. **Viewer dependence.** The file references libraries by name, so an older or online-only viewer may render differently. The embeddable viewer fetches from `viewer.diagrams.net` by default. Confluence behaviour is unverified. [measured; unverified lead]
6. **Legacy libraries.** Older generations stay visible in the editor and in search. A human editing a generated file can mix generations. [official: `Sidebar.js`; inference for the editing risk]
7. **Licence change.** draw.io removed Azure icons once for licensing reasons, in 2020. A vendor can change terms. [official]

### Proposed failure criteria (subsequently adopted)

Historical research proposal. The owner subsequently adopted F1-F6 and the F2 tolerance in [requirements section 2.9](./requirements-and-observed-style-2026-10-28.md#29-notation-and-icon-decisions-after-the-conventions-research-owner-2026-10-28). Later accepted scope and fallback choices in that note take precedence over this proposal's unanswered questions.

The trial fails for a vendor when any check below fails. Run them on the pinned release and the team's real viewers. [inference]

| # | Check | Observable signal |
|---|---|---|
| F1 | Coverage | A concept in the skill's in-scope list for that vendor has no entry in the generated catalog. Already true for Docker, Argo CD and Red Hat products other than the AWS and Azure managed OpenShift services. |
| F2 | Freshness | The pinned draw.io release lacks the vendor's latest package for more than one vendor release cycle: AWS, one quarterly package; Azure, one listed monthly update. Compare draw.io's ChangeLog with the vendor page. |
| F3 | Offline desktop render | With the network disconnected, draw.io desktop at the pinned version renders any catalog shape as a rectangle or an empty tile. |
| F4 | Team viewer render | The team's Confluence draw.io app, or another required viewer, shows a different or missing icon for the same file. |
| F5 | Reproducible catalog | The extraction in section 4 cannot run automatically against a new drawio tag, or its counts change without a matching ChangeLog entry. |
| F6 | Terms | The owner, or a legal review, rejects the vendor's terms for the team's use. |

## Not verified

- Whether the Confluence Cloud and Data Center draw.io apps render built-in stencils and `img/lib` images without outbound access, and which draw.io version they run.
- Which draw.io version the VS Code extension published on the Marketplace bundles. The repository CHANGELOG says 32.3.0.
- How the embeddable viewer resolves relative `img/lib/...` image paths.
- Whether the Kubernetes library includes the kubernetes/community icon change of 2024-07-23.
- A complete file-by-file comparison of `azure2` with Azure V24, `aws4` with the AWS Q3-2026 package, and `gcp3` with Google's core and category ZIP files. Only names and counts were compared.
- Whether the four case-mismatched Azure paths render on draw.io desktop on each operating system.
- No offline render test was run. draw.io desktop is not installed on the research machine.
- The reason for draw.io's 2020 removal of Azure icons, and what permission covers the current set.
- Whether Red Hat's technology icons, including OpenShift, can be downloaded without a Red Hat login.
- Whether the `mscae` Docker whale is a retired Docker logo. Only its colours were checked.

## Decisions for the owner

Historical questions at the end of this investigation; the later [requirements decisions](./requirements-and-observed-style-2026-10-28.md#29-notation-and-icon-decisions-after-the-conventions-research-owner-2026-10-28) record the chosen plain-box fallback, category-icon acceptance, failure criteria and Desktop viewer requirement.

- Accept a split now: built-in libraries for AWS, Azure, Google Cloud and Kubernetes, and a separate solution for Docker, Argo CD and Red Hat products, which already fail F1. Or wait for the full trial.
- Confirm the failure criteria F1 to F6, including the freshness tolerance in F2.
- Confirm that a Google Cloud category icon counts as "the official icon" under R2.
- Name the viewers that must render the files: draw.io desktop only, or also Confluence and VS Code.

## Sources

All accessed 2026-10-28.

- https://github.com/jgraph/drawio (branch `dev`, release v32.6.1, commit `84487b48`): repository tree, licence, README. Read through `gh api` and raw.githubusercontent.com.
- https://raw.githubusercontent.com/jgraph/drawio/dev/README.md: licence terms for code, icon sets and stencils; trademark notice.
- https://raw.githubusercontent.com/jgraph/drawio/dev/src/main/webapp/img/LICENSE, `shapes/LICENSE`, `stencils/LICENSE`: icon-set restriction text.
- https://raw.githubusercontent.com/jgraph/drawio/dev/ChangeLog: dated vendor library updates.
- https://github.com/jgraph/drawio/tree/dev/src/main/webapp/js/diagramly/sidebar: `Sidebar.js`, `Sidebar-AWS4.js`, `Sidebar-Azure2.js`, `Sidebar-GCP2.js`, `Sidebar-GCP3.js`, `Sidebar-GCPIcons.js`, `Sidebar-Kubernetes.js`, `Sidebar-MSCAE.js`, `Sidebar-IBMCloud.js` and all other sidebar files, searched for coverage.
- https://raw.githubusercontent.com/jgraph/drawio/dev/src/main/webapp/js/stencils.min.js: stencil bundle and decoder.
- https://raw.githubusercontent.com/jgraph/drawio/dev/src/main/webapp/js/grapheditor/Graph.js: stencil name resolution and registration.
- https://raw.githubusercontent.com/jgraph/drawio/dev/src/main/webapp/mxgraph/src/view/mxCellRenderer.js: fallback for unknown shapes.
- https://raw.githubusercontent.com/jgraph/drawio/dev/src/main/webapp/shapes/mxAWS4.js and `shapes/mxKubernetes.js`: wrapper shapes.
- https://raw.githubusercontent.com/jgraph/drawio/dev/src/main/webapp/js/app.min.js and `js/viewer-static.min.js`: bundled sidebars; viewer default paths.
- https://api.github.com/repos/jgraph/drawio/commits (path-filtered): last commit dates per library file.
- https://api.github.com/repos/jgraph/drawio/issues/5301: Azure icon update request, closed 2026-07-14.
- https://github.com/jgraph/drawio-desktop: README security section, `.gitmodules`, submodule pin at v32.6.1, `electron-builder-linux-mac.json`, `src/main/args.js`, release v32.6.1 assets.
- https://www.drawio.com/docs/manual/editor/offline/: offline use of desktop and PWA.
- https://www.drawio.com/docs/integrations/embed-diagrams-vscode/: VS Code integration is third-party and bundled for offline use.
- https://www.drawio.com/docs/diagram-types/aws-diagrams/ and https://www.drawio.com/docs/diagram-types/azure-diagrams/: enabling the libraries.
- https://www.drawio.com/docs/integrations/atlassian/confluence/confluence-cloud-drawio-zero-egress-vs-app-editions/: Confluence Cloud app editions.
- https://www.drawio.com/doc/faq/diagram-source-edit ("Manually edit the XML source of your draw.io diagram"): the diagram is XML with styles.
- https://github.com/hediet/vscode-drawio: `.gitmodules`, submodule pin, `CHANGELOG.md` 1.17.0.
- https://aws.amazon.com/architecture/icons/: permitted use, quarterly release schedule, `Icon-package_07312026` link.
- https://aws.amazon.com/trademark-guidelines/: trade dress clause.
- https://learn.microsoft.com/en-us/azure/architecture/icons/: icon terms, do's and don'ts, update history, V24 download.
- https://cloud.google.com/icons: 2025 icon system, core, category and legacy downloads.
- https://services.google.com/fh/files/misc/google-cloud-product-icons.pdf: overview, "Updated: May 2026", core and category lists.
- https://github.com/kubernetes/community/tree/master/icons: icon list, licence, last commits.
- https://www.redhat.com/en/about/brand/standards/icons: CC BY 4.0 terms and diagram use.
- https://www.redhat.com/en/about/brand/standards/icons/technology-icons: technology icon rules.
- https://www.redhat.com/en/about/brand/standards/product-logos: product logo rules.
- https://github.com/RedHat-UX/red-hat-icons: repository licence, tree (no OpenShift icon), release v2.3.1.
- https://www.redhat.com/architect/portfolio/tool/index.html and its custom libraries under `/architect/portfolio/tool/Libraries/`: Red Hat's own embedded draw.io tool loads generic concept libraries (for example "Bare Metal", "Container", "CI/CD Pipeline") from redhat.com; no OpenShift logo was found in the five libraries read.
- https://www.docker.com/company/newsroom/media-resources/: Docker brand guidelines.
- https://www.docker.com/legal/trademark-guidelines/: logo use clause.
- https://github.com/cncf/artwork: README, LICENSE.md, `projects/argo` tree.
