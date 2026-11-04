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
