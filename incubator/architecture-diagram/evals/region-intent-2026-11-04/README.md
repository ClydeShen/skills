# Region placement by intent trial

Date: 2026-11-04. Purpose: check the placement order at commit `2c706a5`. A session follows the user's instructions and intent first. Where the source is silent, it follows vendor practice and platform constraints and names the result as inference. An obvious conflict between the two is reported before drawing, with a recommendation. The previous rule kept every service of unstated region out of a stated region, and in the [step-check run](../houses-2026-11-03/README.md#a-with-the-step-check) it left the EKS cluster outside its load balancer's region.

Setup: the same clean Claude Code setup and prompt as the [clean-session trials](../clean-session-2026-11-02/README.md), with scenarios [A](../semantic-routing-2026-11-02/scenario-a.md) and [B](../semantic-routing-2026-11-02/scenario-b.md). A read-only reviewer with no other context scored each image.

| Case | Files | Session | Layout check | Step check | Score |
| --- | --- | --- | --- | --- | --- |
| A | [image](./a/diagram.png), [file](./a/diagram.drawio), [report](./a/agent-report.md) | 17 turns, 296 s | 1 item | 0 items | 8/10 |
| B | [image](./b/diagram.png), [file](./b/diagram.drawio), [report](./b/agent-report.md) | 19 turns, 235 s | 12 items, kept | 0 items | 6/10 |

## Findings

- Placement followed the rule in both cases. In A, the EKS cluster sits in `us-east-1` with its load balancer. The report lists Bedrock in the region under its inferences: the source gives no region for it, so it is placed with the workload by standard practice. In B, the Azure services sit in `westeurope`, and the reviewer judged the region boundary correct. A is the highest score for scenario A so far.
- Neither source states anything that conflicts with vendor practice, so the conflict report was not exercised.
- B's deductions concern routes, not placement:
  - The three steps branch from one trunk, which reads like a junction.
  - The unlabelled secrets and telemetry lines cross each other.
  - A deploy line runs around Azure OpenAI and boxes it in.
  - The layout check reported shared segments among its 12 items, and the session kept them.
- The B reviewer again read the arrows into Key Vault as writes. The package draws arrows from initiator to callee.
- One run per scenario, Claude Code only.

## B with shared segments as errors

Commit `fd1e879` turns a segment shared by connectors of different meaning into a layout error. Meaning is compared by label, ignoring step numbers, and by line style; an unlabelled connector never matches. On all recorded diagrams the new errors appear only in the three B runs whose reviewers deducted for merged trunks. One rerun of B with the same setup: [image](./b-shared-error/diagram.png), [file](./b-shared-error/diagram.drawio), [report](./b-shared-error/agent-report.md); 16 turns, 266 s; layout check 0 errors, 14 items; step check 0 items.

The session gave every connector its own port. `1 Search`, `2 Answer` and `3 Store` leave the web app separately, and the secrets and telemetry lines are labelled. The reviewer scored 7/10, up from 6/10, and followed the sequence. A new pattern remains that no check covers yet: different connectors that line up on both sides of an element read as one line through it. `2 Answer` and `Embed` line up across Azure OpenAI, and the left Deploy line and the web app's Telemetry line line up across the web app. The reviewer again read the region frame as invented; under commit `2c706a5` it is a named practice inference.
