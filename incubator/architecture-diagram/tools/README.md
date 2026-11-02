# Architecture Diagram authoring tools

Repository-side validation and browser rendering for development fixtures. These tools stay outside the installed skill. Run commands from the repository root with Node.js 24 after `npm ci`.

## Check a fixture

```sh
node --test incubator/architecture-diagram/evals/checks.test.mjs
npm run eval -- --suite incubator/architecture-diagram/evals/suite.mjs
node incubator/architecture-diagram/tools/validate.mjs incubator/architecture-diagram/prototype/scenario-01.drawio
```

The validator checks uncompressed XML, catalog references and declared route geometry. The suite is synthetic clarification replay; neither establishes model quality. Behavioral evaluation uses the [round-trip protocol](../evals/roundtrip.md); measured results belong in the [evaluation record](../evaluation.md).

## Render locally

Rendering is part of the package: run `node incubator/architecture-diagram/candidate/architecture-diagram/scripts/render.mjs /path/to/diagram.drawio /path/to/preview.png`. The first run fetches the pinned draw.io files into `~/.cache/architecture-diagram/`; set `DRAWIO_CHECKOUT` to use another pinned checkout, and `DIAGRAM_BROWSER` to choose a browser. Use fresh output paths to preserve committed evidence.

## Catalog helpers

Use the package's [lookup and regeneration instructions](../candidate/architecture-diagram/references/drawio.md#exact-icon-lookup). `catalog.mjs` here is a compatibility entry for historical fixture generators; the package owns the implementation. Generated metadata must not be edited manually.
