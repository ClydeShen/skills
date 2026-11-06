# Architecture Diagram authoring tools

Repository-side validation and browser rendering for development fixtures. These tools stay outside the installed skill. Run commands from the repository root with Node.js 24 after `npm ci`.

## Check a fixture

```sh
node --test incubator/architecture-diagram/evals/checks.test.mjs
npm run eval -- --suite incubator/architecture-diagram/evals/suite.mjs
node incubator/architecture-diagram/tools/validate.mjs incubator/architecture-diagram/evals/fixtures/scenario-01.drawio
```

The repository validator checks legacy fixtures using the active package catalog. For new outputs, use the package's finalize, text, layout, step and render scripts in [SKILL.md](../candidate/architecture-diagram/SKILL.md#check-the-file). The suite above is synthetic clarification replay; neither establishes model quality. Behavioral changes use the [baseline comparison](../evals/baseline/README.md); measured status belongs in the [evaluation record](../evaluation.md).

## Render locally

Rendering is part of the package: run `node incubator/architecture-diagram/candidate/architecture-diagram/scripts/render.mjs /path/to/diagram.drawio /path/to/preview.png`. The first run fetches the pinned draw.io files into `~/.cache/architecture-diagram/`; set `DRAWIO_CHECKOUT` to use another pinned checkout, and `DIAGRAM_BROWSER` to choose a browser. Use fresh output paths to preserve committed evidence.

## Catalog helpers

Use the package's [lookup instructions](../candidate/architecture-diagram/references/drawio.md#exact-icon-lookup). To regenerate metadata, obtain a trusted draw.io checkout at the commit pinned in the package's runtime `scripts/catalog.mjs`, then run:

```sh
node incubator/architecture-diagram/tools/catalog.mjs /path/to/pinned-drawio incubator/architecture-diagram/candidate/architecture-diagram/assets/catalog.json
```

The builder reads and executes pinned upstream palette definitions in a bounded context. Git may retrieve missing objects in a partial clone. No artwork is copied; generated metadata must not be edited manually. The installed package retains only the version constants and style parser, not this authoring-time executable.

## Vendor icons

`build-vendor-icons.mjs` regenerates the package's `assets/vendor-icons.json` from the pinned npm releases and official repository files it names. Without an argument it downloads them with `npm pack` and from `raw.githubusercontent.com` at the pinned commit; pass a directory holding unpacked `thesvg/` and `fabric/` packages, and optionally `github/<owner>/<repo>/<path>` copies, to work offline. `--check-latest` compares the pinned npm versions with the registry and exits 2 when an update exists. To update, change the pinned version or commit, regenerate, review the [icon coverage sheets](https://github.com/ClydeShen/skills/blob/facc1f1/incubator/architecture-diagram/evals/icon-coverage-2026-11-02/README.md) and run the tests.

```sh
node incubator/architecture-diagram/tools/build-vendor-icons.mjs --check-latest
node incubator/architecture-diagram/tools/build-vendor-icons.mjs
```

The curated list in the builder decides which icons ship. theSVG variant names are not consistent (Mastra's `light` is white artwork), so AI entries name their variant explicitly after a visual check. `trim-viewbox.mjs` tightens only the `viewBox` of marks drawn in a square canvas with wide transparent margins; artwork paths and colours stay unchanged.
