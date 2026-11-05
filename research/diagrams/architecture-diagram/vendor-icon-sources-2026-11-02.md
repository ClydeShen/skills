# Research: vendor icon sources beyond draw.io

Date: 2026-11-02. Subject: which cloud-engineering vendors have current icons in draw.io, where to obtain the others without drawing them, and how to keep them current. Context: the owner wants the architecture-diagram skill to show these vendors as components in runtime architecture diagrams. The skill forbids borrowing similar icons and must not draw vendor icons itself. Built-in library structure is covered in [draw.io built-in icon libraries](./drawio-builtin-icon-libraries-2026-10-28.md); vendor conventions in [vendor diagram conventions](./vendor-diagram-conventions-2026-10-28.md).

Confidence markers:

- **[official]**: the relevant part of official docs, a specification, a tool's README, or a paper page was read.
- **[official · summary only]**: only an abstract or overview was read, or the page does not cover the detail.
- **[secondhand]**: a third-party description, such as a search result summary; not traced to a primary source.
- **[inference]**: the author's judgment, with no direct evidence.
- **[measured]**: the result of a command run on the stated date (for example, a package registry API).

## Overview

| Question                                           | Recommendation                                                                                                                                                                                                                              | Strength of evidence | Confidence                                   |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | -------------------------------------------- |
| 1. Which vendors does draw.io 32.6.1 cover?        | AWS, Azure, Google Cloud, Kubernetes, plus Azure DevOps, Azure-hosted Databricks and Red Hat OpenShift through `azure2`. Twelve vendors have no draw.io icon.                                                                               | strong               | [measured]                                   |
| 2. Where do the others come from?                  | `@thesvg/icons` 4.0.0 covers every requested vendor in colour, with light variants and per-icon licence and URL fields. Microsoft Fabric's own npm package has its workload and item icons. MuleSoft and Confluent exist only as wordmarks. | strong               | [measured]                                   |
| 3. How to keep icons current without drawing them? | Generate one catalog from pinned package versions, copy SVGs byte for byte with a hash, and add a staleness check against the registry.                                                                                                     | medium               | [inference] built on [measured] release data |
| 4. One unified mechanism                           | Extend the existing generated catalog with a provenance-tagged second tier; embed SVGs as data URIs; let checks reject any icon not in the catalog.                                                                                         | medium               | [inference]                                  |

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

MuleSoft and Confluent: no official brand or icon page could be reached (403 or 404 on probed URLs). [measured]

`@thesvg/icons` 4.0.0 (MIT package, 7,600+ brand SVGs) has every requested vendor, usually as `default` (colour) and `mono` variants, sometimes `light`, `dark` or `wordmark`. Each module exports `license` and `url`; per-icon licences vary (CC0-1.0, MIT, Apache-2.0, nominative fair use, and "Microsoft proprietary … maintainer review required" for its Fabric copies). [measured] Its MuleSoft SVG carries the title `MS_2019_Master_Horizontal_Logo_CoreBlue` and is identical to the svgl.app copy; its Confluent SVG is an Inkscape-edited horizontal wordmark. Neither has a symbol-only variant. [measured]

The raw SVGs in `@fabric-msft/svg-icons` 11.1.0 are under `svg/`, named `<item>_<size>_<item|color>.svg`; the product mark is `fabric_48_color.svg`. [measured]

### Recommendation for the project

Use draw.io libraries first, then the vendor's own package (Microsoft Fabric), then `@thesvg/icons`, preferring its `light` variant on a white canvas. Use a horizontal wordmark as the component's logo and label when no symbol exists (MuleSoft, Confluent). Fall back to a plain box when the only mark is unreadable text (GitHub Pages). Simple Icons, `logos` and `devicon` are not needed: Simple Icons is single-colour and a subset; the other two lack per-icon provenance. A rendered check of all 109 selected icons is in [icon coverage check](https://github.com/ClydeShen/skills/blob/facc1f1/incubator/architecture-diagram/evals/icon-coverage-2026-11-02/README.md).

### Relation to existing constraints

Most non-cloud vendors publish one brand mark, not product architecture icons, so a vendor component usually cannot be distinguished below the product names the set includes.

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

Resolve every component through `find-icon.mjs` in a fixed order: draw.io vendor library, then official vendor package, then `@thesvg/icons`, then the plain-box fallback. The agent never chooses the source; the catalog does.

### Relation to existing constraints

Keeps one generated catalog as the single source of truth, consistent with the package rule that runtime files stay inside the skill.

## 5. AI providers and tooling

### Evidence

draw.io 32.6.1 covers the cloud AI services: `aws4` Bedrock and Bedrock AgentCore; `azure2` OpenAI, AI Foundry, Foundry Models, Foundry Agent Service, Azure Machine Learning, Cognitive Services and Copilot Studio; `gcp3` Vertex AI. [measured]

`@thesvg/icons` 4.0.0 has OpenAI, ChatGPT, Anthropic, Claude, Claude Code, Gemini, Microsoft Copilot, Microsoft 365 Copilot, NVIDIA, Hugging Face, LangChain, LangGraph, LangSmith, LlamaIndex, CrewAI, Pydantic AI, Mastra, MLflow, Ollama, vLLM, Pinecone, Langfuse, Dify, n8n, Palantir, Salesforce and Model Context Protocol. [measured] Variant names are not consistent: OpenAI's and Anthropic's `default` are white artwork and `light` is dark, while Mastra's `light` is white. [measured] Its `nim` icon is the Nim programming language (`https://nim-lang.org`), not NVIDIA NIM. [measured]

Iconify and svgl returned nothing for Semantic Kernel, AutoGen, A2A, Microsoft Agent Framework, Google ADK, OpenAI Agents SDK, Claude Agent SDK or Agentforce. [measured] Official repositories hold marks for A2A (`a2aproject/A2A`, Apache-2.0), Google ADK (`google/adk-python`, Apache-2.0), AutoGen (`microsoft/autogen`, CC-BY-4.0), Weaviate (`weaviate/weaviate-io`, no licence), and 128 × 128 PNG NuGet icons for Semantic Kernel and Microsoft Agent Framework (MIT). [measured] The OpenAI Agents SDK logo in `openai/openai-agents-python` uses only `fill="white"`. [measured] No dedicated Claude Agent SDK, Palantir AIP or Agentforce mark was found in these sources. [measured]

### Recommendation for the project

Add the theSVG entries with explicitly chosen variants and the repository files pinned to a commit. Support PNG artwork where the vendor publishes no SVG. Use the plain-box fallback for OpenAI Agents SDK and Claude Agent SDK, and the parent brand mark with a precise caption for Palantir AIP, Agentforce and NVIDIA NIM. The [icon coverage check](https://github.com/ClydeShen/skills/blob/facc1f1/incubator/architecture-diagram/evals/icon-coverage-2026-11-02/README.md) shows the result.

## Not verified

- Whether each vendor's own brand guidelines allow its logo in third-party diagrams or redistribution in an open-source package.
- Whether theSVG copies match each vendor's current mark; only metadata and SVG titles were read.
- How draw.io Desktop treats large data URIs in exported PNGs; the 109-icon sheet rendered, but embedding in PNG metadata was not tested.
- Docker in MSCAE, Ansible in IBM Cloud and GitHub in WebIcons: currency not compared with vendor marks.
- MuleSoft and Confluent symbol-only official assets.

## Decisions for the owner

- Settled 2026-11-02: use any readily available upstream icon; wordmarks are acceptable where no symbol exists; plain box otherwise.
- Bundle icons whose per-icon licence requires attribution (Jenkins CC-BY-SA-3.0) or limits use (Microsoft Fabric terms), or resolve them at generation time only?

## Sources

- https://www.npmjs.com/package/simple-icons: package metadata; tarball 16.36.0 read for `DISCLAIMER.md`, `VERSIONING.md` and `data/simple-icons.json`.
- https://www.npmjs.com/package/@iconify-json/logos: package metadata and `info.json` in tarball 1.2.18.
- https://www.npmjs.com/package/@iconify-json/devicon: package metadata and `info.json` in tarball 1.2.76.
- https://www.npmjs.com/package/@fabric-msft/svg-icons: version and licence via `npm view`; tarball 11.1.0 `svg/` folder read.
- https://www.npmjs.com/package/@thesvg/icons: tarball 4.0.0 read for variants, `license` and `url` of each selected icon.
- https://svgl.app/library/mulesoft.svg: MuleSoft SVG compared with the theSVG copy.
- https://api.iconify.design/search and https://api.svgl.app: searched for the AI marks missing from theSVG.
- GitHub repositories `a2aproject/A2A`, `google/adk-python`, `microsoft/autogen`, `microsoft/semantic-kernel`, `microsoft/agent-framework`, `openai/openai-agents-python` and `weaviate/weaviate-io`: logo files, commit and licence read via the GitHub API.
- https://learn.microsoft.com/en-us/fabric/fundamentals/icons: official Microsoft Fabric icon terms and download locations.
- https://github.com/jgraph/drawio/tree/84487b4891cbc0f32d7e30f34cf878c87cb1f414: sidebar sources searched for each vendor.
