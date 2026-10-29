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

Use a trusted draw.io checkout at the [package's upstream pin](../candidate/architecture-diagram/references/drawio.md), outside this repository. Obtain these files from that revision:

- `src/main/webapp/js/viewer-static.min.js`
- `src/main/webapp/js/stencils.min.js`
- `src/main/webapp/shapes/mxAWS4.js`
- `src/main/webapp/shapes/mxKubernetes.js`
- Catalog-referenced SVG assets used by the diagram, such as those under `src/main/webapp/img/lib/azure2/`.

Chromium and loopback socket access are required. Set `DIAGRAM_BROWSER` to the browser executable if needed. The renderer does not install a browser or fetch missing assets; obtaining the checkout is a separate setup step.

```sh
node incubator/architecture-diagram/tools/render.mjs /path/to/pinned-drawio /path/to/diagram.drawio /path/to/preview.svg /path/to/preview.png
```

Use fresh local output paths to preserve committed evidence. The renderer uses a temporary browser profile, local scripts and allowlisted pinned SVG assets, with external/background networking disabled. Rendered checks cover routes, boundaries and labels; inspect the image as well. Browser rendering does not establish draw.io Desktop support.

## Catalog helpers

Use the package's [lookup and regeneration instructions](../candidate/architecture-diagram/references/drawio.md#exact-icon-lookup). `catalog.mjs` here is a compatibility entry for historical fixture generators; the package owns the implementation. Generated metadata must not be edited manually.
