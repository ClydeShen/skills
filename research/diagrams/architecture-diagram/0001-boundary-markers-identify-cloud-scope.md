# Boundary markers identify the cloud or resource scope

Date: 2026-11-06. Status: implemented candidate change; fresh-session effect remains unverified.

## Finding

The owner identified baseline 02's unmarked Azure boundary beside an AWS Cloud boundary with its native corner icon. The pinned AWS catalog supplies boundary styles with built-in markers. The Azure catalog supplies Subscriptions, Resource Groups and Virtual Networks, but no exact Microsoft Azure provider mark. The previous generic-boundary instructions covered service boundaries without making provider identity lookup explicit. [measured]

The existing pinned `@thesvg/icons` 4.0.0 distribution contains two Azure marks: `azure.js` uses an older silhouette; `microsoft-azure.js` contains the gradient Microsoft Azure mark, identifies `https://azure.microsoft.com/` as its source and declares MIT. The latter is added byte-for-byte as `thesvg-microsoft-azure`, with version, source path and SHA-256. The owner also requested all three cloud-provider boundaries. The pinned GCP catalog has service/category symbols but no provider mark; `google-cloud.js` provides the multicolour provider artwork, declares CC0-1.0 and names `https://cloud.google.com/`. It is added as `thesvg-google-cloud`. AWS keeps its native cloud boundary and corner icon. Brand rights remain separate from package licensing. [measured upstream package metadata; not a new redistribution clearance]

## Implementation and verification

`find-icon.mjs --boundary` returns either the native boundary style or a generic container and a small, captionless identity marker. Marker artwork stays unchanged and embeds through the existing finalize step. It has the boundary as its parent and is not a traffic endpoint. Exact scope matters: the provider mark labels the cloud; subscription and network symbols label those scopes only when the source contains them. A missing exact identity keeps a text-only title.

Tests cover exact Azure and GCP lookup/embedding, scope-specific VNet artwork and preservation of AWS's native corner icon without adding another one. An illustrative copy of baseline 02 adds the Azure marker and reserves title spacing without changing components or paths; a separate three-provider sheet demonstrates all three headers. These demonstrate rendering, not fresh agent behavior. The fixed baseline is unchanged. Full clean-session baseline regression remains pending.

## Sources

- [Pinned upstream module](https://unpkg.com/@thesvg/icons@4.0.0/dist/microsoft-azure.js), inspected from the npm tarball on 2026-11-06.
- [Pinned GCP provider module](https://unpkg.com/@thesvg/icons@4.0.0/dist/google-cloud.js), inspected from the same tarball.
- [Azure identity source named by the module](https://azure.microsoft.com/).
- Local pinned catalog and baseline 02; [earlier icon-source research](./vendor-icon-sources-2026-11-02.md) explains provenance and licensing limits.
