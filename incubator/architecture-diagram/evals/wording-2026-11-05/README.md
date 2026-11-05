# Wording trial

Purpose: check that the restructured and reworded package, with one view as the default, a page-width limit of 1400 units and repeated structures drawn once, gives output at or above the baseline package `c863742`.

Setup: the clean Claude Code setup and prompt of the [clean-session trials](../clean-session-2026-11-02/README.md), with scenarios [A](../semantic-routing-2026-11-02/scenario-a.md), [B](../semantic-routing-2026-11-02/scenario-b.md), [02](../scenario-02.md) and [C](../view-splitting-2026-11-04/scenario-c.md). A read-only reviewer with no other context read each source and every page, then scored the whole. The reviewer saw the same prompt for every run. The trigger check, `npm run eval:trigger` with `--repeat 3 --baseline c863742`, passed 36/36 for both the current and the baseline package.

| Case | Files                                                                                                                      | Layout check          | Pages | Score                     | Baseline package, same setup |
| ---- | -------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----- | ------------------------- | ---------------------------- |
| A    | [file](./a/diagram.drawio), [image](./a/diagram.png), [report](./a/agent-report.md)                                        | 0 errors, 0 items     | 1     | 7                         | 7, 7.5                       |
| B    | [file](./b/diagram.drawio), [image](./b/diagram.png), [report](./b/agent-report.md)                                        | 0 errors, 0 items     | 1     | 7.5                       | 7                            |
| 02   | [file](./02/diagram.drawio), [image](./02/diagram.png), [report](./02/agent-report.md)                                     | 0 errors, 0 items     | 1     | 7                         | 7                            |
| C    | [run 1](./c1/diagram.png), [run 2](./c2/diagram.png), files and reports in `c1` and `c2`                                    | 0 errors, 1 and 4 items | 1   | 7 and 6.5                 | 7, 6, 7                      |

The baseline scores for B, 02 and C come from the [legend trial](../legend-2026-11-04/README.md) and the [view-splitting trial](../view-splitting-2026-11-04/README.md); those for A and C were repeated on the baseline package for this comparison. Scores of one scenario on one package vary by up to one point between runs.

## Findings

- Every scenario fits one page of at most 1400 units. Scenario C, the largest, is a page of about 1400 by 1460 units, with about 30 nodes, and its reviewers rate it crowded at 900 pixels wide.
- Arrows for pull relationships point from the caller to the provider: the sync of Argo CD to Git, the secrets read from a secret store, and the read of a worker from a queue. Reviewers read them as the opposite direction in every scenario that has them.
- A dashed boundary, such as an AWS Region, looks like a dashed connector. The key does not list boundaries.
- The key names the dashed style with a broad word, such as "auxiliary", for several different relationships.
- In scenario C, the standby region shows only its database reader, so "same stack" is not shown.
- In scenario 02, the outbound endpoint that the source names in step 5 has no connector.
- Not tested: Codex, and more than one run for A, B and 02 on the current package.
