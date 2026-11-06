# Architecture Diagram

Turn a text architecture scenario into an editable draw.io diagram and PNGs for reviews, documents and wikis. Use it when the important question is how components interact, where they run, or which boundaries a request crosses.

## What it helps with

- Request, event, authentication and cross-cloud flows.
- Logical and deployment views with explicit component ownership and directed relationships.
- Exact vendor icons, package-local checks and image inspection, with plain boxes when a suitable icon is unavailable.

The skill asks about consequential contradictions rather than inventing infrastructure. It is not an IaC generator, code reverse-engineering tool, image tracer or general flowchart skill.

## Get started

Use Codex or Claude Code with file access and Node.js 24. PNG export uses draw.io Desktop, or Git and Chromium/Chrome with network access on first use. Without those, you receive the editable file and a browser link for viewing/export. The package targets draw.io 32.6.1.

Before an approved stable release, install the opt-in candidate in a disposable project:

```bash
INSTALL_INTERNAL_SKILLS=1 npx --yes skills@1.7.4 add https://github.com/ClydeShen/skills/tree/main/incubator/architecture-diagram/candidate/architecture-diagram --agent codex --copy --yes
```

In PowerShell, set `$env:INSTALL_INTERNAL_SKILLS = "1"` first, then run the command starting with `npx`. For Claude Code, replace `--agent codex` with `--agent claude-code`. Start a fresh client session after installation.

Once a stable release is approved and published, its installation command is:

```sh
npx --yes skills@1.7.4 add ClydeShen/skills --skill architecture-diagram --agent codex --copy --yes
```

That stable command is not a claim that a release is already available. To pin a candidate trial, replace `/tree/main/` in its URL with `/tree/<full-commit-SHA>/`.

## Try it

```text
Use the architecture-diagram skill to create diagram.drawio from this scenario:

A browser calls an API in AWS. The API publishes jobs to a queue.
A worker consumes jobs and stores results in a database in the same VPC.
Show the request path and background processing separately. Do not invent subnets.
```

Expected output: an editable `.drawio` file, a PNG per page when export is available, and a concise companion account of unresolved details. Inspect the first diagram before requesting corrections.

## Good to know

The runtime scripts run local programs and may clone a pinned draw.io viewer for browser rendering. Review them and use sanitized scenarios. A successful static check is not proof of architectural correctness; image inspection remains necessary.

Original instructions and scripts use the [MIT license](./LICENSE). Third-party artwork retains its own terms in the [asset catalog](./assets/vendor-icons.json); this is not blanket MIT licensing of icons. Redistribution clearance and output-attribution handling are still being checked before stable publication.

Report issues with the input, first diagram, client/model, installed source revision and expected result in [the feedback issue](https://github.com/ClydeShen/skills/issues/7).

### Additional icon libraries

Native draw.io icons remain the first choice. You can also supply a local draw.io SVG/PNG custom library through `ARCHITECTURE_ICON_LIBRARIES`; use the same setting for lookup, finalization and rendering. Selected image bytes are embedded in your diagram, not added to the skill package. See [optional libraries](./references/drawio.md#optional-consumer-icon-libraries) for lookup, provenance and supported entry formats. Missing brands use labelled boxes; a matching image must represent the correct product.
