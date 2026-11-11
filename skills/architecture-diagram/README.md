# Architecture Diagram

Turn a text architecture scenario into an editable draw.io diagram and PNGs for reviews, documents and wikis. Use it when the important question is how components interact, where they run, or which boundaries a request crosses.

## What it helps with

- Request, event, authentication and cross-cloud flows.
- Logical and deployment views with explicit component ownership and directed relationships.
- Exact vendor icons, package-local checks and image inspection, with plain boxes when a suitable icon is unavailable.

The skill asks about consequential contradictions rather than inventing infrastructure. It is not an IaC generator, code reverse-engineering tool, image tracer or general flowchart skill.

## Get started

Use Codex or Claude Code with file access and Node.js 24. PNG export uses draw.io Desktop, or Git and Chromium/Chrome with network access on first use. Without those, you receive the editable file and a browser link for viewing/export. The package targets draw.io 32.6.1.

Install it in your project:

```sh
npx --yes skills@1.7.4 add ClydeShen/skills --skill architecture-diagram --agent codex --copy --yes
```

For Claude Code, replace `--agent codex` with `--agent claude-code`. The command copies the package into the project without automatic updates; run it again to update. Start a fresh client session after installation, then confirm that `architecture-diagram` appears in the skill list.

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

Original instructions and scripts use the [MIT license](./LICENSE). Third-party artwork retains its own terms in the [asset catalog](./assets/vendor-icons.json); this is not blanket MIT licensing of icons. Redistribution clearance and output attribution for some bundled artwork are not complete; the [third-party notices](./THIRD-PARTY-NOTICES.md) list what is cleared and what remains open.

Report issues with the input, first diagram, client/model, installed source revision and expected result in [the feedback issue](https://github.com/ClydeShen/skills/issues/7).
