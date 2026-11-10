# Authoring an editable draw.io file

The target is draw.io **v32.6.1**, upstream commit `84487b4891cbc0f32d7e30f34cf878c87cb1f414`. Use an existing compatible editor or generate uncompressed draw.io XML. Do not require the authoring repository to be installed.

## Exact icon lookup

The package carries two icon sources. The draw.io [catalog](../assets/catalog.json) holds palette titles, style strings and IDs for AWS, Azure, Google Cloud and Kubernetes; draw.io draws that artwork itself. The [vendor icons](../assets/vendor-icons.json) hold pinned upstream artwork and provenance for additional provider, platform and AI identities. Available coverage is the actual lookup result, not a promise that every brand has an icon. Assets with unresolved redistribution/use terms are being removed before release; use the existing plain-box fallback when lookup finds none. AWS Bedrock, Azure AI and Microsoft Foundry, and Vertex AI come from the draw.io catalog. Run `--list` for the full set. Do not load either catalog into the conversation. Query both with [find-icon.mjs](../scripts/find-icon.mjs), from the installed package directory:

Check [third-party notices](../THIRD-PARTY-NOTICES.md) before using bundled artwork. Keep required credit with each displayed output, not only in the installed package. For Jenkins, include visible Jenkins-project credit and its project/license links on each page displaying the mark; if that cannot be retained in a standalone PNG, use a plain labelled box instead. Never hide attribution to improve layout. Unresolved asset clearance does not become permission merely because lookup returns an entry.

```text
node scripts/find-icon.mjs --list
node scripts/find-icon.mjs --vendor "Microsoft Fabric" --list
node scripts/find-icon.mjs --vendor AWS --title "Lambda"
node scripts/find-icon.mjs --vendor Azure --id azure2-dcd8189c36a60111
node scripts/find-icon.mjs --vendor Azure --title "Microsoft Azure" --boundary
```

Titles are upstream labels, not a complete service-alias dictionary. Compare a candidate entry's meaning with the required service. If several entries match, select the evidenced palette/ID explicitly. A missing or unusable entry requires the plain-box fallback, not fuzzy matching; the helper then returns the fallback's style and size. It makes no network call.

Each match carries a `placement`: use its `style`, `width` and `height` unchanged, and set only the caption, position and parent. Keep the caption as the icon cell's own value, not a separate text cell, so that it moves with the icon and the checks can find it. Symbols fit a 72-unit square; wide marks are 40 high and at most 200 wide. Captions sit below in 16-point text, wrapped to a fixed `labelWidth` of at least 160 so that their footprint is predictable. A placement with a `caption` note is a wordmark that already shows the name: caption only the role, or leave it empty. Do not rotate, recolor, crop or imitate any artwork.

A vendor-icon style names its artwork with `vendorIcon=<id>` and has no image yet. `node scripts/finalize.mjs <diagram.drawio>` writes the exact artwork into each such cell; rerun it after every edit. The file then displays in any draw.io, offline, without this package. Rendering rejects a missing, altered or uncatalogued embedded image.

Built-in Azure SVG references resolve through draw.io's own installed assets; they are not remote URLs. Four known wrong-case paths are marked unusable. A valid catalog entry does not by itself prove Desktop rendering on the user's host.

Catalog and vendor-icon regeneration belong to the authoring repository, not the installed skill. An upgrade requires reviewing the new library and rerendering examples, not just changing a version string.

## XML essentials

Use one `mxfile` with one `diagram` / `mxGraphModel` page per view, each with root cells `0` and `1`, a unique page `id` and a `name` that states the page's question. Use unique IDs within a page. To link an overview box to its detail page, wrap the box in a `UserObject` with `link="data:page/id,<page id>"`. Set the file version to `32.6.1`. Parent child nodes to their actual boundary cells; coordinates of child vertices are relative to that parent. Write the XML in any layout; `finalize.mjs` rewrites it in draw.io's own layout, one element per line, because importers such as Lucidchart reject other layouts of the same valid XML.

For an icon, an `object` wrapper can hold `id`, `label`, `c4Type`, `technology`, `vendor` and `iconKey`. Its child `mxCell` has `vertex="1"`, the real parent ID, the selected style and an `mxGeometry`. Labels use escaped XML attributes and HTML line breaks when `html=1`. Keep inspection metadata separate from the short visible caption; print a type or technology only when it clarifies the element.

Draw a boundary as a container (`container=1`) whose members are its children. `find-icon.mjs --boundary` returns a native boundary style with its built-in corner icon, or a generic boundary style plus a small title marker; without `--vendor` and an identity, it returns the text-only boundary. All three put the title at the top left. For a light-filled logical boundary, change only the fill and stroke of the text-only style. For the latter, add the marker as a child with an empty label at the returned offset, preserving aspect ratio, and reserve the returned title spacing. It identifies the boundary, not a deployed member or connector endpoint. Choose the identity by [cloud conventions](./cloud-conventions.md#boundaries). Do not apply ordinary 72-unit element placement to this marker.

Build the key as a table: a `shape=table;childLayout=tableLayout;container=1;startSize=24;collapsible=0;fontSize=12;align=left;` cell titled "Key", with one `shape=tableRow` per style and two `shape=partialRectangle;connectable=0;fontSize=12;` cells per row, the left empty and the right holding the meaning. Draw each sample as a free connector on the page (`sourcePoint` and `targetPoint`, no `source` or `target`) across its left cell, with exactly the style of the connectors it explains, including `edgeStyle=orthogonalEdgeStyle`.

Use `source` and `target` IDs on connectors, with explicit ports when routing needs them. Root-parented edge waypoints use page coordinates; do not mix those with child-local coordinates. Every connector is orthogonal: set `edgeStyle=orthogonalEdgeStyle`, never `none` or a curved style. Useful native connector settings are:

```text
edgeStyle=orthogonalEdgeStyle;startArrow=none;endArrow=block;endFill=1;rounded=0;
labelBackgroundColor=#ffffff;html=1;
```

For a necessary label, set a readable label width and use relative edge geometry on an appropriate segment. Leave obvious relationships unlabeled. An opaque label may interrupt its own line; it must not introduce a waypoint detour.

## Verify the actual view

Check XML parsing, unique IDs, valid parents/endpoints, catalog identity and consistent style. Then inspect the rendered diagram for clipped labels, crossings through nodes/captions, accidental shared segments and incorrect boundary crossings. Test at a useful reading scale as well as an overview; a large raster can hide unreadable labels at fit-to-page scale.

Use the host's available draw.io editor/export capability for inspection. Browser rendering is not evidence of offline Desktop compatibility. If no compatible viewer is available, deliver only with an explicit unverified-render warning; do not substitute a generated illustration for the editable architecture.
