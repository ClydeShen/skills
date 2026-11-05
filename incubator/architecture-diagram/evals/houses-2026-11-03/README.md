# House conventions trial

Date: 2026-11-03. Purpose: check whether the cross-cloud house rules at commit `119e714` stop a session from repeating a service inside its own house and keep nesting readable. The rules sort houses into ownership and place, network isolation, runtime host and logical group; draw a level only when it separates or holds members; mark a service house with its icon at the top left; keep security groups off the canvas outside security views; and budget three outlines. They are summarized in [architecture layout](../../../../knowledge/diagrams/architecture-layout.md#decide-which-boundaries-to-draw).

Setup: the same clean Claude Code setup and prompt as the [clean-session trials](../clean-session-2026-11-02/README.md). [Scenario A](../semantic-routing-2026-11-02/scenario-a.md) is the run that drew the duplicate EKS icon; scenario 02 held only the "Input text given to the skill" block of [scenario 02](../scenario-02.md), the most boundary-heavy case. A read-only reviewer with no other context scored each image; the 02 reviewer also listed every boundary's members.

| Case | Files | Session | Layout check | Score |
| --- | --- | --- | --- | --- |
| A | [image](./a/diagram.png), [file](./a/diagram.drawio), [report](./a/agent-report.md) | 17 turns, 245 s | 1 item | 7/10 |
| 02 | [image](./02/diagram.png), [file](./02/diagram.drawio), [report](./02/agent-report.md) | 12 turns, 292 s | 3 crossings | 7/10 |

## Findings

- Houses: A drew the EKS cluster as a house marked by the EKS icon at its top left, with no EKS member, and drew the GitHub Actions workflow, which has no drawn members, as one icon. Its nesting is AWS Cloud, region, cluster. The 02 reviewer found no unnecessary or repeating boundary and nesting of at most three levels (AWS Cloud, network services account, VPC); a single region was folded away.
- A regressed on steps: `retrieve`, `Claude` and `open cases` carry no numbers, against the rule that a source-ordered sequence is numbered, and the reviewer could not follow the order. The layout check does not test this.
- The A reviewer again read Bedrock, which sits inside AWS Cloud and outside the region, as outside AWS; the frame edges in the image show otherwise.
- 02 findings outside houses: Network Firewall connects straight down to the egress VPC instead of through the Transit Gateway, the Route 53 outbound endpoint has no connection, and only one of three parallel API lines is labelled.
- One run per scenario, Claude Code only.

## A with the step check

Commit `06ddcc0` adds `check-steps.mjs`, which reports source-ordered steps that no connector label numbers. One rerun of A with the same setup: [image](./a-steps/diagram.png), [file](./a-steps/diagram.drawio), [report](./a-steps/agent-report.md); 19 turns, 263 s; layout check 1 item, step check 0 items.

The session ran the step check and numbered `1 retrieve`, `2 write answer` and `3 lookup`; the reviewer followed the sequence and scored 7/10. The EKS cluster is again a house marked by its icon. The reviewer's main finding holds: the `us-east-1` frame holds only the load balancer, with the EKS cluster outside it. The source names the region only for the load balancer, and the rule to keep services of unstated region out of a stated region left the cluster out, although a load balancer's targets must share its region. The earlier run at the baseline package drew the cluster inside and named that inference.
