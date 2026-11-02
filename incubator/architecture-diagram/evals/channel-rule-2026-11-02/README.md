# Channel rule trial

Fresh Claude Code session on 2026-11-02, with the skill installed from the working tree and only the [second text scenario](../three-tier-supporting-2026-10-29/source.md) as `scenario.md`. Prompt: use the skill to create `diagram.drawio` from `scenario.md`. Compare with the [earlier delivery](../three-tier-supporting-2026-10-29/first.png).

- [Rendered image](./diagram.png), [editable draw.io](./diagram.drawio), [SVG](./diagram.svg), [agent report](./agent-report.md).
- Cost USD 1.06, 326 seconds, 32 turns, one run.

## Findings

Fixed compared with the earlier delivery: no arrow or separator symbols, Route 53 to the load balancer is a connector, and source doubts moved to the agent report.

Remaining:

- The web tier title overlaps the first web server. The session could not render, because the trial denied headless Chrome, so it never saw this.
- `logical tier processing`, `object storage`, `application traffic` and `static data delivery` are not a name, role, verb, protocol or condition.
- The scope line still discusses the source. `check-text.mjs` does not catch that wording.
- Supporting services connect from the Region frame, so those lines have no real source.
- ElastiCache to RDS and standby to S3 appear only in the agent report.

`tools/validate.mjs` reports 20 errors. Most are its C4 metadata expectations, which the package does not ask for, so they are not evidence of a drawing fault. One run is not evidence of repeatability.

## Second run

A fresh session after adding [relationships.md](../../candidate/architecture-diagram/references/relationships.md) and PNG export to the package. Cost USD 1.22, 271 seconds, 40 turns, one run. See the [image](./second/diagram.png), [editable draw.io](./second/diagram.drawio) and [agent report](./second/agent-report.md).

Fixed: no text overlaps the symbols, source relationships are kept as unlabeled dashed connectors, only the main path is heavy, unknown callers attach to ports on the boundary, and the session rendered the image and corrected four connectors itself.

Remaining:

- No client is drawn and no request reaches the load balancer, so the main path has no start. The source leaves that hop implicit, but the drawing loses the entry.
- `www.yourApp.com` and `media.yourApp.com` are boxes rather than endpoints of a user's path.
- `logical` still comments on the source.
- `read/write` uses a double-headed connector, which the repository validator rejects.
- The session reports a non-catalog `iconKey` for CloudWatch; that icon was not verified.
