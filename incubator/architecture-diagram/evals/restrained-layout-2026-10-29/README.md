# Restrained layout: two fresh generations

The owner accepted the general information coverage of the simple diagrams at an overall 85/100, then requested modest presentation improvements without a rigid layout recipe. That rating describes earlier results, not these new generations. This trial uses the same two source documents and a small instruction revision; it does not archive the second reference image.

## Compare outputs

| Case | Unchanged text | Previous delivery | New PNG | Editable file |
| --- | --- | --- | --- | --- |
| Two-AZ, six-subnet application | [Source A](../three-tier-2026-10-29/source.md) | [Previous A](../three-tier-2026-10-29/revised/diagram.png) | [New A](./case-a/diagram.png) | [draw.io A](./case-a/diagram.drawio) |
| Application with supporting services | [Source B](../three-tier-supporting-2026-10-29/source.md) | [Previous B](../three-tier-supporting-2026-10-29/first.png) | [New B](./case-b/diagram.png) | [draw.io B](./case-b/diagram.drawio) |

## Change and method

The package now treats alignment, region size, caption placement and service/resource/instance symbols as contextual choices. Main paths should remain legible without competing frames or decoration. Clear existing arrangements need no change. No new workflow, mandated palette, fixed left/right layout or scoring formula was added; architecture invariants remain unchanged.

Two separate agents started without the parent conversation. Each received only its own source path, the current package and neutral authoring/validation tools. Neither was provided old images, reference images, previous generators or scores. Each may repair its own rendering before delivery. Shared filesystem access makes this procedural isolation, not a sandbox guarantee. The parent integrates checks and compares results without claiming independent review.

## Verification and limits

Both generators completed and inspected their actual PNGs. They reported zero XML/catalog, rendered route/boundary and pairwise text-overlap errors, and respected input isolation. Their [Case A account](./case-a/generation.json) and [Case B account](./case-b/generation.json) describe interpretations and limits. The parent reran those checks with zero errors and froze hashes in [verification.json](./verification.json). Run `node incubator/architecture-diagram/evals/restrained-layout-2026-10-29/verify.mjs` from the repository root to check the saved evidence without regenerating it.

Local `npm run check` passed 63 regression tests and 42 synthetic assertions. The cached pinned Agent Skills reference validator passed; skills CLI discovery still lists one explicit internal candidate and no releases. These package and harness checks do not score diagram quality.

Parent comparison, not an independent judgment:

- **Case A:** the horizontal tier progression and AZ rows expose the two shared scaling groups and both app-to-primary paths. The six CIDRs, memberships and synchronous standby relationship remain visible. The wider landscape composition and residual scope text are trade-offs, not proven improvements over the previous portrait view.
- **Case B:** a bottom band separates supporting services from application processing. Two Web and two App instances remain in AZ-1, the standby in AZ-2, and S3 outside both AZs. Only Web has Auto Scaling. The new diagram explicitly labels the source's implied Web → App relationship; the previous delivery omitted that hop. This is a disclosed interpretation, not a newly confirmed path. Supporting-call endpoints and unknown-operation qualifiers remain visible, but the long auxiliary routes and amount of text still limit visual economy.

The parent checked source distinctions and did not edit either generated diagram. It asked Case B to confirm that an implied relationship was not being presented as established. Neither generator received layout feedback based on a reference image. Owner comparison of these new outputs is pending; no new score is assigned.

One generation per case cannot isolate the prompt's causal effect or establish broad reliability. No image-only readout, full round trip, external model endpoint or Desktop verification is included. Preserve earlier outputs and these first new deliveries; any later repair needs a separately identified artifact.
