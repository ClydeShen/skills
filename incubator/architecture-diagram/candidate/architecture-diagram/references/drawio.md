# Authoring an editable draw.io file

The target is draw.io **v32.6.1**, upstream commit `84487b4891cbc0f32d7e30f34cf878c87cb1f414`. Use an existing compatible editor or generate uncompressed draw.io XML. Do not require the authoring repository to be installed.

## Exact icon lookup

The bundled [catalog](../assets/catalog.json) contains palette titles, style strings, IDs and vendor metadata, not icon artwork. Do not load the whole catalog into the conversation. Query it with [find-icon.mjs](../scripts/find-icon.mjs), from the installed package directory:

```text
node scripts/find-icon.mjs --vendor AWS --title "Lambda"
node scripts/find-icon.mjs --vendor Azure --id azure2-dcd8189c36a60111
```

Titles are upstream labels, not a complete service-alias dictionary. Compare a candidate entry's meaning with the required service. If several entries match, select the evidenced palette/ID explicitly. A missing or unusable entry requires the plain-box fallback, not fuzzy matching. The helper returns metadata only and makes no network call.

Preserve the entry's shape/image identity and vendor colors. Add caption placement and typography without rotating, recoloring or imitating the artwork. Built-in Azure SVG references resolve through draw.io's own installed assets; they are not remote URLs. Four known wrong-case paths are marked unusable. A valid catalog entry does not by itself prove Desktop rendering on the user's host.

To regenerate metadata, obtain a local draw.io source checkout at the pinned commit and run [catalog.mjs](../scripts/catalog.mjs):

```text
node scripts/catalog.mjs /path/to/pinned-drawio assets/catalog.json
```

This uses Node.js 24 and Git. Regeneration reads and executes pinned upstream palette definitions in a bounded context; use a trusted checkout. Git may need network access to retrieve missing objects in a partial clone. No icon artwork is copied. An upgrade requires reviewing the new library and rerendering examples, not just changing a version string.

## XML essentials

Use one `mxfile` / `diagram` / `mxGraphModel` page with root cells `0` and `1`. Use unique IDs. Set the file version to `32.6.1`. Parent child nodes to their actual boundary cells; coordinates of child vertices are relative to that parent.

For an icon, an `object` wrapper can hold `id`, `label`, `c4Type`, `technology`, `vendor` and `iconKey`. Its child `mxCell` has `vertex="1"`, the real parent ID, the selected style and an `mxGeometry`. Labels use escaped XML attributes and HTML line breaks when `html=1`. The custom metadata supports inspection; visible names and types still belong in the caption.

Use `source` and `target` IDs on connectors, with explicit ports when routing needs them. Root-parented edge waypoints use page coordinates; do not mix those with child-local coordinates. Useful native connector settings are:

```text
startArrow=none;endArrow=block;endFill=1;rounded=0;
labelBackgroundColor=#ffffff;html=1;
```

Place the label through relative edge geometry at an appropriate segment. An opaque label may interrupt its own line. Do not introduce a waypoint detour just to avoid that label.

## Verify the actual view

Check XML parsing, unique IDs, valid parents/endpoints, catalog identity and consistent style. Then inspect the rendered diagram for clipped labels, crossings through nodes/captions, accidental shared segments and incorrect domain transitions. Test at a useful reading scale as well as an overview; a large raster can hide unreadable labels at fit-to-page scale.

Use the host's available draw.io editor/export capability for inspection. Browser rendering is not evidence of offline Desktop compatibility. If no compatible viewer is available, deliver only with an explicit unverified-render warning; do not substitute a generated illustration for the editable architecture.
