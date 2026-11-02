# Research: vendor icon sources beyond draw.io

Date: 2026-11-02. Subject: which cloud-engineering vendors have current icons in draw.io, where to obtain the others without drawing them, and how to keep them current. Context: the owner wants the architecture-diagram skill to show these vendors as components in runtime architecture diagrams. The skill forbids borrowing similar icons and must not draw vendor icons itself. Built-in library structure is covered in [draw.io built-in icon libraries](./drawio-builtin-icon-libraries-2026-10-28.md); vendor conventions in [vendor diagram conventions](./vendor-diagram-conventions-2026-10-28.md).

Confidence markers:

- **[official]**: the relevant part of official docs, a specification, a tool's README, or a paper page was read.
- **[official · summary only]**: only an abstract or overview was read, or the page does not cover the detail.
- **[secondhand]**: a third-party description, such as a search result summary; not traced to a primary source.
- **[inference]**: the author's judgment, with no direct evidence.
- **[measured]**: the result of a command run on the stated date (for example, a package registry API).

## Overview

| Question                                           | Recommendation                                                                                                                                                                 | Strength of evidence                                 | Confidence                                   |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- | -------------------------------------------- |
| 1. Which vendors does draw.io 32.6.1 cover?        | AWS, Azure, Google Cloud, Kubernetes, plus Azure DevOps, Azure-hosted Databricks and Red Hat OpenShift through `azure2`. Twelve vendors have no draw.io icon.                  | strong                                               | [measured]                                   |
| 2. Where do the others come from?                  | Simple Icons covers 20 of the 26 requested vendors with a per-icon official source URL. Microsoft Fabric has an official npm package. MuleSoft and Confluent: no source found. | strong for packages; weak for MuleSoft and Confluent | [measured]                                   |
| 3. How to keep icons current without drawing them? | Generate one catalog from pinned package versions, copy SVGs byte for byte with a hash, and add a staleness check against the registry.                                        | medium                                               | [inference] built on [measured] release data |
| 4. One unified mechanism                           | Extend the existing generated catalog with a provenance-tagged second tier; embed SVGs as data URIs; let checks reject any icon not in the catalog.                            | medium                                               | [inference]                                  |

## 1. Coverage in draw.io 32.6.1

### Evidence

At pinned commit `84487b4891cbc0f32d7e30f34cf878c87cb1f414`, the skill catalog reads `aws4`, `azure2`, `gcp3` and `kubernetes`. [measured]

| Vendor                                                                                                                                        | draw.io coverage                                                                                   | Usable as exact match?                                     |
| --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| AWS, Azure, Kubernetes                                                                                                                        | Dedicated libraries                                                                                | Yes [measured]                                             |
| Google Cloud                                                                                                                                  | `gcp3`: 19 core product and 26 category icons                                                      | Yes, under Google's core-or-category rule [measured]       |
| Apigee                                                                                                                                        | `gcp3` core product                                                                                | Yes [measured]                                             |
| Azure DevOps                                                                                                                                  | `azure2` DevOps: `DevOps`                                                                          | Yes [measured]                                             |
| OpenShift                                                                                                                                     | `azure2` Red Hat OpenShift; `aws4` Red Hat OpenShift Service on AWS; IBM Cloud logo                | Only for the hosted service named [measured]               |
| Databricks, Grafana, Kafka, VMware                                                                                                            | `azure2` Databricks, Grafana, VMware Solution; `aws4` Managed Grafana, MSK, Elastic VMware Service | Only for that cloud's managed offering [measured]          |
| Docker, Ansible, GitHub                                                                                                                       | Docker in MSCAE, Ansible in IBM Cloud, GitHub in WebIcons                                          | Not in the catalog; library currency unverified [measured] |
| Terraform, Argo CD, Jenkins, Snowflake, Microsoft Fabric, MuleSoft, Kong, Confluent, HashiCorp (Vault, Consul), Splunk, Dynatrace, Cloudflare | No match in any sidebar                                                                            | No [measured]                                              |

Google's legacy console icons, which draw.io ships as `GCP Icons`, "should not be used as of 2026". [official] (see [vendor diagram conventions](./vendor-diagram-conventions-2026-10-28.md))

### Recommendation for the project

Keep the four libraries. Do not add MSCAE, IBM Cloud or WebIcons for single logos; a pinned brand source is easier to keep current. Do not add draw.io `GCP Icons`.

### Relation to existing constraints

The catalog rule "exact vendor/catalog matches, never borrow" excludes using a managed-service icon for a self-hosted product.

## 2. Sources outside draw.io

### Evidence

Packages measured on 2026-11-02 with `npm view` and `npm pack`:

| Package                                  | Version                       | Licence         | Colour                 | Per-icon provenance                                      |
| ---------------------------------------- | ----------------------------- | --------------- | ---------------------- | -------------------------------------------------------- |
| `simple-icons`                           | 16.36.0 (modified 2026-10-25) | CC0-1.0 package | One brand hex per icon | `source`, optional `guidelines` and `license` [measured] |
| `@iconify-json/logos` (gilbarbara/logos) | 1.2.18                        | CC0-1.0         | Multicolour            | None [measured]                                          |
| `@iconify-json/devicon`                  | 1.2.76                        | MIT             | Multicolour            | None [measured]                                          |
| `@fabric-msft/svg-icons`                 | 11.1.0 (modified 2026-10-19)  | MIT             | Product colours        | Microsoft-owned [measured]                               |

Simple Icons coverage of the requested vendors: Docker, Terraform, Ansible, Argo, GitHub, Jenkins, VMware, Databricks, Snowflake, Kong, Apache Kafka, HashiCorp, Vault, Consul, Splunk, Dynatrace, Grafana, Cloudflare, Red Hat OpenShift, Kubernetes and Google Cloud. Not included: AWS, Azure, Azure DevOps, Microsoft Fabric, MuleSoft, Confluent, Apigee. [measured]

Sample `source` values point to official assets: `https://www.hashicorp.com/brand` (Terraform, Vault, Consul), `https://www.cloudflare.com/logo/`, `https://konghq.com/brand-assets/`, `https://www.snowflake.com/brand-guidelines/`, `https://www.dynatrace.com/company/press-kit/`, `https://github.com/logos`, the CNCF artwork repository at a fixed commit for Argo, and the Kubernetes repository at a fixed commit. Some entries point only to the vendor home page (Grafana, Splunk, Google Cloud, OpenShift). [measured]

Per-icon licences differ from the package licence: Jenkins is `CC-BY-SA-3.0`, Apache Kafka `Apache-2.0`. [measured] The disclaimer says the package is CC0 but "that doesn't mean to imply that all icons within the project are also CC0", and asks users to "seek the correct permissions". [official]

Simple Icons release policy: minor and patch releases weekly, major releases about every six months that remove icons or change slugs. [official]

Microsoft Fabric: Microsoft Learn provides "the official collection of icons for Microsoft Fabric" for architecture diagrams and documentation, and allows them to be copied, distributed and displayed "only for the permitted use". It names the `@fabric-msft/svg-icons` npm package and a GitHub zip. Don'ts include cropping, distorting or using them to represent your own product. [official]

Gilbarbara `logos` includes a `fabric` icon; it is the Fabric.io logo, not Microsoft Fabric. [measured]

MuleSoft and Confluent: no official brand or icon page could be reached (403 or 404 on probed URLs). [measured] Not found.

### Recommendation for the project

Use Simple Icons as the single brand-logo tier, because each icon names its source and the release cadence is documented. Use `@fabric-msft/svg-icons` for Microsoft Fabric. Keep MuleSoft and Confluent as plain boxes until the owner supplies official assets. Do not use `logos` or `devicon`: they lack per-icon provenance, so currency and origin cannot be checked.

### Relation to existing constraints

Simple Icons logos are brand marks, not product architecture icons, and are single-colour. They are suitable for a vendor component but cannot distinguish products inside one vendor beyond what the set names.

## 3. Keeping icons current without drawing

### Evidence

`scripts/catalog.mjs` already regenerates the catalog from a pinned draw.io commit and records source hashes. [measured] Simple Icons and the Fabric package publish semantic versions on npm. [measured]

### Recommendation for the project

- Pin each source version in the generator, next to `upstreamCommit`.
- Copy each SVG unchanged into the catalog as a data URI and record package, version, slug, source URL, licence and SHA-256.
- Add a check that compares the pinned versions with `npm view <package> version` and reports stale sources, and that rejects any `image=data:` style whose hash is not in the catalog. That rule also prevents hand-drawn icons.
- Regenerate the whole catalog on update; never edit entries by hand.

### Relation to existing constraints

`render-inputs.mjs` currently rejects every image that is not a catalogued `img/lib/...svg` path, so data URI icons need an explicit allowance tied to catalog hashes.

## 4. One mechanism for all vendors

### Evidence

draw.io's own `GCP Icons` palette stores icons as `shape=image;image=data:image/svg+xml,<base64>`. [measured] A data URI keeps the `.drawio` file self-contained. [inference]

### Recommendation for the project

Resolve every component through `find-icon.mjs` in a fixed order: draw.io vendor library, then official vendor package, then Simple Icons, then the plain-box fallback. The agent never chooses the source; the catalog does.

### Relation to existing constraints

Keeps one generated catalog as the single source of truth, consistent with the package rule that runtime files stay inside the skill.

## Not verified

- Whether each vendor's own brand guidelines allow its logo in third-party diagrams or redistribution in an open-source package.
- Whether Simple Icons `source` SVGs match each vendor's current mark; only the URLs were read.
- How draw.io Desktop treats large data URIs in exported PNGs; not tested.
- Docker in MSCAE, Ansible in IBM Cloud and GitHub in WebIcons: currency not compared with vendor marks.
- MuleSoft and Confluent official assets.

## Decisions for the owner

- Accept single-colour brand logos for non-cloud vendors, or require multicolour official artwork?
- Bundle icons with licences such as CC-BY-SA-3.0 (Jenkins), which require attribution, or keep those as plain boxes?
- Bundle Microsoft Fabric icons, whose terms permit copying only for diagram, training and documentation use?

## Sources

- https://www.npmjs.com/package/simple-icons: package metadata; tarball 16.36.0 read for `DISCLAIMER.md`, `VERSIONING.md` and `data/simple-icons.json`.
- https://www.npmjs.com/package/@iconify-json/logos: package metadata and `info.json` in tarball 1.2.18.
- https://www.npmjs.com/package/@iconify-json/devicon: package metadata and `info.json` in tarball 1.2.76.
- https://www.npmjs.com/package/@fabric-msft/svg-icons: version and licence via `npm view`.
- https://learn.microsoft.com/en-us/fabric/fundamentals/icons: official Microsoft Fabric icon terms and download locations.
- https://github.com/jgraph/drawio/tree/84487b4891cbc0f32d7e30f34cf878c87cb1f414: sidebar sources searched for each vendor.
