# Terminology trial

Date: 2026-11-04. Purpose: check commit `e662f38`. It calls every drawn enclosure a boundary in the package, its check messages and the shared layout knowledge, where these used house, frame, enclosure, domain or region. The owner requires that no change lowers output quality below the baseline at `c863742`.

Setup: the clean Claude Code setup and prompt of the [clean-session trials](../clean-session-2026-11-02/README.md). Scenarios: [A](../semantic-routing-2026-11-02/scenario-a.md), [B](../semantic-routing-2026-11-02/scenario-b.md), [02](../scenario-02.md) and [C](../view-splitting-2026-11-04/scenario-c.md). A read-only reviewer with no other context read each source and every page, and scored each page and the whole.

| Case | Files                                                                               | Session          | Checks                                         | Pages                                                         | Score | Baseline |
| ---- | ----------------------------------------------------------------------------------- | ---------------- | ---------------------------------------------- | ------------------------------------------------------------- | ----- | -------- |
| A    | [file](./a/diagram.drawio), [report](./a/agent-report.md), `a/diagram-*.png`        | 18 turns, 237 s  | layout 0 errors, 0 items; steps 0              | Runtime; content and infrastructure updates                   | 8/10  | 8/10     |
| B    | [file](./b/diagram.drawio), [report](./b/agent-report.md), `b/diagram-*.png`        | 22 turns, 239 s  | layout 0 errors, 7 items (bends); steps 0      | Question answering; document ingestion; operations            | 7.5/10 | 7/10    |
| 02   | [file](./02/diagram.drawio), [report](./02/agent-report.md), `02/diagram-*.png`     | 15 turns, 441 s  | layout 0 errors, 2 items (page width); steps 0 | Private access path; firewall allowances                      | 7/10  | 7/10     |
| C    | [file](./c/diagram.drawio), [report](./c/agent-report.md), `c/diagram-*.png`        | 26 turns, 590 s  | layout 0 errors, 0 items; steps 0              | Overview; browse; checkout; operations                        | 7/10  | 7/10     |

No score fell below the baseline. A and B now split into pages by concern and flow, which their baseline runs, made before the split rules, did not.

Findings that hold, for the watch list rather than this change:

- Every reviewer missed a key on pages with one kind of line, which the rules leave keyless.
- Regional services drawn inside a stated region the source gives only one service (B), and B's secrets arrows read as writes.
- In 02, DNS and HTTPS share one solid run from the Azure firewall to the Transit Gateway, and the layout check reported no shared segment.
- In C, the overview leaves Route 53 off the normal path again, and the operations page draws every line dashed, which the reviewer read as conflicting with page 1's key.
