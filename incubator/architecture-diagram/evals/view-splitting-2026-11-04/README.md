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
