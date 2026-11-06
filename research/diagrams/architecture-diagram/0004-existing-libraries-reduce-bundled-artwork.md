# Research: Existing libraries reduce bundled artwork without guaranteeing full coverage

Date: 2026-11-06. Question: can existing draw.io libraries restore the 19 excluded identities without bundling their artwork in the Architecture Diagram skill? Context: the owner prioritizes drawing coverage and a fast release. This is a technical feasibility check, not a new blanket artwork permission claim.

## Conclusion

[measured] Existing libraries contain useful candidates for four of the excluded identities: OpenShift, Ansible, Terraform and Grafana. Not all candidates preserve the requested product meaning or original artwork. The inspected libraries do not establish coverage for all 19 identities. No excluded artwork was restored to the package.

[inference] Prefer references to the user's installed drawing libraries and optionally consume a user-selected custom library. Keep source and identity checks, but do not require the skill to redistribute every image it can use in a diagram. Separate software-asset distribution from end-user diagram output. Existing library availability is not a universal permission grant.

## Versions and search scope

[measured] The built-in search used draw.io 32.6.1 at commit `84487b4891cbc0f32d7e30f34cf878c87cb1f414`, matching the skill's pinned viewer. Searches covered the complete tracked asset filenames, sidebar sources and registered IBM Cloud stencils. The current package catalog indexes AWS, Azure, GCP and Kubernetes only; a source found elsewhere is not automatically usable by the installed helper.

[measured] The extension search used `jgraph/drawio-libs` at `ddeb033ab84b5b5408ab9e90858906638b5d72cc`. Inspected its README, tracked library paths, and all 25 Integration library files. Negative findings below are limited to this search, not all third-party icon libraries.

## Coverage of the excluded set

| Excluded identity                                          | Existing-library evidence                                                                                                             | Treatment                                                                                                                                                              |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OpenShift                                                  | Built-in legacy `img/lib/mscae/OpenShift.svg`; registered IBM `logo--openshift`; current Azure Red Hat OpenShift and AWS ROSA entries | Generic and managed offerings must remain distinct. Legacy and IBM sources need catalog integration and fidelity checks.                                               |
| Ansible                                                    | Registered IBM `logo--ansible-community`; Integration `apps-and-system-logos.xml` and `azure.xml` contain Ansible                     | IBM uses its own prescribed visual treatment. Integration entries embed SVG in library XML. Neither source is integrated into the skill yet.                           |
| Terraform                                                  | Integration `apps-and-system-logos.xml` has a symbol and wordmark, both with embedded SVG                                             | Genuine matching titles found; requires an optional-library adapter, exact source pin and output checks. Do not bundle that library merely to avoid the old exclusion. |
| Grafana                                                    | Current catalog `azure2-e2e43f097966503b`, plus AWS Managed Grafana                                                                   | Actual rendered Azure artwork is a blue service tile; do not silently substitute it for the standalone Grafana brand.                                                  |
| HashiCorp, Vault, Consul, Nomad, Packer, Vagrant, Waypoint | No exact identity found in inspected built-ins and Integration entries                                                                | Azure Key Vault and generic vault shapes do not match HashiCorp Vault. User-selected additional libraries remain an option.                                            |
| Confluent, Grafana Loki                                    | No exact identity found in inspected sources                                                                                          | Do not substitute Kafka or Grafana for these products.                                                                                                                 |
| Microsoft Copilot, Microsoft 365 Copilot                   | Copilot Studio found, but it is a different product                                                                                   | Do not count it as coverage for either excluded identity.                                                                                                              |
| AutoGen, Semantic Kernel, Agent Framework, Weaviate        | No exact identity found in inspected sources                                                                                          | Additional official or user-selected sources remain to be checked.                                                                                                     |

## Actual rendering and portability

[measured] Generated a three-cell diagnostic using the current catalog's Azure Grafana, Red Hat OpenShift and Copilot Studio. Ran the unchanged `finalize.mjs` and `render.mjs` with `DRAWIO_CHECKOUT` pointing to the pinned viewer and the environment's Chromium. PNG and SVG export succeeded; visual inspection confirmed three recognizable, distinct icons and labels. Run artifacts stay ignored under `evals/.local/native-icon-probe/`. This is a technical sample, not an architecture-quality score or a baseline replacement.

[measured] Finalization embedded zero vendor icons; the source `.drawio` retains installed-editor image references. The browser renderer resolves those locally for export. This does not prove that another importer has the same assets. No live Lucidchart session/import tool is available in this task, so actual Lucidchart import remains unverified. Formatting alone is not import acceptance. Offline Desktop behavior was not exercised.

[official] drawio-libs documents `clibs=U<encoded-library-URL>` and the `mxlibrary` JSON format. Entries can contain compressed XML or image data URIs. Thus custom libraries can supply assets without shipping them in the skill. [measured] The inspected Terraform and Ansible entries contain embedded SVG data. The skill's current render validation rejects embedded images outside its pinned vendor inventory; merely linking a custom library does not make the existing CLI pipeline support it. An adapter must validate selected entries and preserve exact bytes/provenance without disabling that check.

## Rights and product implications

[official] The pinned draw.io README says its icon-set restriction concerns use as software assets in Atlassian products and explicitly excludes end-user diagram output. It also states that original licenses were checked for use in draw.io and claims no copyright in user-created diagrams. These statements support distinguishing drawing-tool use from rebundling assets in a different software product; they do not extend every third-party grant to every use.

[inference] The fastest practical expansion is an optional, user-selected installed/custom-library source with exact identity selection and a verified portable output path. Continue using native references where suitable. Restore component recognition independently of restoring the old bundled bytes. Keep managed-service symbols tied to their real services. Required output attribution still travels with deliverables where applicable.

Not verified: all other third-party libraries, exact artwork permission for every candidate, custom-library CLI integration, cross-version freshness, live Lucidchart import, and offline Desktop export. No paid model run, publication or external message occurred.

## Sources opened

- [Pinned draw.io README](https://github.com/jgraph/drawio/blob/84487b4891cbc0f32d7e30f34cf878c87cb1f414/README.md): software and diagram-output distinction.
- [Pinned Azure sidebar](https://github.com/jgraph/drawio/blob/84487b4891cbc0f32d7e30f34cf878c87cb1f414/src/main/webapp/js/diagramly/sidebar/Sidebar-Azure2.js): exact product titles and SVG paths.
- [Pinned IBM sidebar](https://github.com/jgraph/drawio/blob/84487b4891cbc0f32d7e30f34cf878c87cb1f414/src/main/webapp/js/diagramly/sidebar/Sidebar-IBMCloud.js): OpenShift and Ansible stencil references and prescribed styles.
- [Pinned extension-library README](https://github.com/jgraph/drawio-libs/blob/ddeb033ab84b5b5408ab9e90858906638b5d72cc/README.md): custom-library loading and format.
- [Pinned Integration logos](https://github.com/jgraph/drawio-libs/blob/ddeb033ab84b5b5408ab9e90858906638b5d72cc/libs/integration/apps-and-system-logos.xml): Ansible and Terraform entries.

Related evidence: [original built-in investigation](./drawio-builtin-icon-libraries-2026-10-28.md) and [bundled-artwork rights investigation](./0003-bundled-icon-rights-need-explicit-notices.md).
