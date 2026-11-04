# View-splitting trial

Date: 2026-11-04. Purpose: check commit `9fc7940`. Under it, a session splits a view that would answer more than one question by concern, zoom or flow into pages of one `.drawio` file, with the same names, symbols and line meanings on every page. `render.mjs` writes one PNG per page, and the layout check reports each page by name.

Setup: the clean Claude Code setup and prompt of the [clean-session trials](../clean-session-2026-11-02/README.md), with the input text of [scenario 02](../scenario-02.md), the only recorded scenario with two flows over one network. A read-only reviewer with no other context read the source and the three PNGs. It scored each page, listed every line style and whether a key explained it, and judged consistency across pages and whether the split helped.

| Case | Files                                                                                                                                                                         | Session          | Checks                                        | Pages                                                                                          | Score |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------- | ----- |
| 02   | [page 1](./02/diagram-1.png), [page 2](./02/diagram-2.png), [page 3](./02/diagram-3.png), [file](./02/diagram.drawio), [report](./02/agent-report.md) | 29 turns, 516 s | layout 0 errors, 2 items; steps 0; text clean | DNS resolution, steps 1 to 3 (7/10); API call, steps 4 and 5 (6/10); firewall rules table (9/10) | 7/10  |

## Findings

- The session split the view by flow and named why: one page would have been wider than 1600 units. The reviewer judged the split right, because the DNS and API flows share the firewall, VPN and Transit Gateway and would overlap on one page.
- Every shared element kept its name and symbol across pages, and solid lines meant the same on both diagram pages. Page 1 has one kind of line and no key, as the rules allow; page 2 keys solid and dashed.
- Page 2's dashed line from the Resolver outbound endpoint is about 28 units long, so it shows one dash. The reviewer read it as solid and its key row as unused. `check-layout.mjs` now reports a dashed connector too short for three dashes; it reports this line and nothing in the legend, region and house trials.
- Name drift across pages: "Network Firewall IDPS" on page 2 and "AWS Network Firewall" on page 3; the Azure "Outbound endpoint" carries no product name, beside the AWS "Resolver outbound endpoint". The symbol check compares captions and cannot see a renamed element.
- No page says how the pages relate. With a flow split there is no overview; the step numbers 1 to 3 and 4 to 5 imply the order.
- Not caused by the split, and named in the agent report: page 2 draws inspection to egress as a direct line, bypassing the Transit Gateway; page 1 does not send DNS through AWS Network Firewall, while the firewall rules include port 53 there.
- One run, Claude Code only. The zoom axis and page links were not exercised.

## Scenario C: the zoom axis

Scenario 02 split by flow, so the zoom axis and page links were not exercised. [Scenario C](./scenario-c.md), an online store on AWS with a warm-standby region, one VPC per region across three zones, six services on EKS, three data stores, a five-step checkout, and build, secrets and telemetry, was written for this trial. It describes the architecture only and says nothing about views or pages. Same clean setup and prompt, package at `370bd4c`.

| Case | Files | Session | Checks | Pages | Score |
| --- | --- | --- | --- | --- | --- |
| C | [page 1](./c/diagram-1.png), [page 2](./c/diagram-2.png), [page 3](./c/diagram-3.png), [page 4](./c/diagram-4.png), [file](./c/diagram.drawio) | 19 turns, 738 s; stopped by the account usage limit before writing its companion account | layout 0 errors, 0 items; steps 0; text clean | Overview (6/10); eu-west-1 browse and search (8/10); eu-west-1 checkout, steps 1 to 5 (7.5/10); build, deployment, secrets and telemetry (6.5/10) | 7/10 |

Findings:

- The session split on all three axes and recursively: zoom (an overview, then the primary region in detail), flow (the region's detail split into browse and checkout), and concern (an operations page). The reviewer judged the split right; one page would hold about 30 elements and three concerns. Each detail page draws the zoomed part as its outer boundary with outside elements, such as CloudFront and Stripe, at the edge. The five checkout steps stay on one page.
- Navigation: the overview's `eu-west-1` region links to the browse page only. One box with two detail pages can carry one link, and the operations page belongs to no box, so two pages cannot be reached from the overview. Nothing on the overview marks the link or names the other pages, and links do not work in a PNG.
- Names drift across pages: "eu-west-1 (primary)" and "Region eu-west-1", "us-east-1 (warm standby, same stack)" and "(warm standby)", and an inconsistent "Amazon" prefix. Scenario 02 drifted the same way. The symbol check compares captions and cannot see a renamed element.
- On the operations page, build steps ("push image", "update") are solid while the key calls solid "runtime call or data flow", and telemetry is dashed. The rules list deployment as auxiliary but do not say that build and deployment stay dashed on an operations page, where nothing is runtime. Scenario A in the [legend trial](../legend-2026-11-04/README.md) drew CI flows solid too.
- The operations key adds "Dashed, no label: source link left unexplained" for unlabelled lines to Secrets Manager, a sample identical to the labelled dashed one.
- Not caused by the split: the overview leaves Route 53 off the normal request path and ends its failover line on the standby region's border.
- One run, Claude Code only; no companion account, because the session hit the usage limit.
