# Boundary-membership check across scenarios

Date: 2026-11-03. Purpose: in the [clean-session trials](../clean-session-2026-11-02/README.md), scenario B framed every Azure service in the one region the source names for the web app. This trial checks whether drawing elements into boundaries the source does not state recurs across other scenarios and misleads readers. The owner's rule: fix it if it is frequent and misleading; otherwise leave it.

Setup: the package at commit `523f38e`, the same clean Claude Code setup as the clean-session trials, and the same prompt. Each `scenario.md` held only the "Input text given to the skill" block of an owner-approved [scenario](../scenario-01.md), with no expected answers or notes. A read-only reviewer with no other context, given only that input and the image, listed every boundary's members against the source and judged each mismatch.

| Scenario | Files | Session | Score | Boundary mismatches |
| --- | --- | --- | --- | --- |
| [01](../scenario-01.md) token authorization | [image](./s01/diagram.png), [file](./s01/diagram.drawio), [report](./s01/agent-report.md) | 13 turns, 89 s | 7/10 | Backend APIs drawn outside AWS Cloud, location unstated; mildly misleading |
| [02](../scenario-02.md) private cross-cloud call | none | stopped by an account usage limit | – | not run |
| [03](../scenario-03.md) partner SOAP to AWS | [image](./s03/diagram.png), [file](./s03/diagram.drawio), [report](./s03/agent-report.md) | 16 turns, 190 s | 6/10 | none placed wrongly; the AWS "core platform" group is omitted |
| [04](../scenario-04.md) AWS to Azure metadata sync | [image](./s04/diagram.png), [file](./s04/diagram.drawio), [report](./s04/agent-report.md) | 23 turns, 127 s | 7/10 | none |

## Findings

- No element was drawn into a boundary the source does not support. The one mismatch places an element of unstated location outside a cloud, which the reviewer judged mildly misleading.
- Scenario B's region over-framing did not recur. It follows from a source that names a region for one service and none for the rest, which these scenarios do not do.
- Decision under the owner's rule: no further change for boundary membership.
- Reviewer findings outside boundaries recur and are left for later: missing return or result paths (01 authorizer decision, 03 response to partners), a stated connection drawn as a plain line (03 site-to-site VPN), and repeated or missing step numbers (01, 04).
- One run per scenario, Claude Code only; scenario 02, the most boundary-heavy, remains to be run.
