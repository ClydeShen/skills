# Professional layout trial

Real generations on 2026-11-02 after adding composition guidance, cloud conventions and a layout check to the package. Scenarios: [AWS, two zones](../three-tier-2026-10-29/source.md), [AWS with supporting services](../three-tier-supporting-2026-10-29/source.md), [AWS and Azure](../scenario-04.md), and a [synthetic Google Cloud case](./gcp-scenario.md).

| Case | Agent | Image | State of the run |
| --- | --- | --- | --- |
| AWS, two zones | Claude Code | [PNG](./aws-a/diagram.png) | A usage limit ended the session after the files were written |
| AWS, supporting services | Claude Code | [PNG](./aws-b/diagram.png) | Refined files left by a session the limit interrupted, so not a clean first run |
| AWS and Azure | Claude Code | [PNG](./azure/diagram.png) | A usage limit ended the session after the files were written |
| Google Cloud | Claude Code | [PNG](./gcp/diagram.png) | Completed; USD 1.49 |
| AWS, supporting services | Codex | No PNG; [draw.io](./codex-aws-b/diagram.drawio) | Sandbox blocked PNG export; image not inspected |

## Findings

Improved: mirrored zones, Auto Scaling groups spanning zones, a visible client entry and a heaviest main path.

Remaining:

- AWS two zones: the `Users` and `CloudFront` captions touch, and a counts note stays on the canvas. The load balancers sit outside subnets.
- AWS supporting services: `inferred` comments on the source, and a counts note stays on the canvas.
- AWS and Azure: `Processing workflow` sits close to a connector.
- Google Cloud: DNS, load balancer and CDN share one category icon, as Google's icon system directs, so captions carry the distinction.

`check-layout.mjs` estimates from XML geometry, and cannot see caption collisions like the first item. One run per case is not evidence of repeatability, and no masked-text test has run.
