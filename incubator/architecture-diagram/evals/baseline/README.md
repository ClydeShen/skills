# Baseline

The baseline is the quality boundary of the skill. No change to the package may lower the output below it.

- Package: commit `f7b7537`.
- Cases: the scenarios [A](../scenarios/a.md), [B](../scenarios/b.md), [02](../scenarios/02.md) and [C](../scenarios/c.md).
- Scores: [baseline.json](./baseline.json). Each score is the overall score of one clean run, from a reviewer with no other context.
- Reference outputs: the folders `a`, `b`, `02` and `c`, each with the diagram and its image from one baseline run.

| Scenario | Baseline scores |
| -------- | --------------- |
| A        | 7               |
| B        | 7.5             |
| 02       | 7               |
| C        | 7, 6.5          |

## Owner-approved baseline standards

Effective 2026-11-06, the owner approved these additional acceptance standards:

- Every drawn AWS, Azure or Google Cloud cloud-level boundary has its correct provider corner marker and a readable name. Preserve native AWS boundary artwork; use the pinned Azure and Google Cloud provider marks on generic cloud boundaries. Deeper boundaries use their own actual scope, never an unrelated service icon. Do not add boundaries solely to display a logo.
- Apply WCAG 2.2 SC 1.4.1 (Level A): colour is not the sole cue to identity, grouping or status. Names, nesting, line patterns and the Key must keep the meaning readable without hue.
- Borrow AA readability targets: 4.5:1 for authored text and 3:1 for essential lines/outlines against adjacent backgrounds. These numerical targets are AA guidance, not Level A criteria. Keep vendor artwork unchanged and select suitable backgrounds and readable captions.

The package's [cloud conventions](../../candidate/architecture-diagram/references/cloud-conventions.md#boundaries) and [notation](../../candidate/architecture-diagram/references/notation.md#visual-hierarchy) own implementation guidance. The reviewer checks these standards alongside architecture correctness. An image-only assessment cannot establish full WCAG conformance or measure every contrast pair reliably.

The earlier scores, commit and reference images above remain historical measurements; they have not been re-scored under these additions. In particular, baseline 02 lacks the Azure provider marker. Do not treat that omission as an accepted precedent for new output. Replacing the measured baseline still requires matching new runs, scores and reference artifacts, not only approval of a standard.

## How a run is made

- Prompt for the skill, unchanged: `Use the architecture-diagram skill to create diagram.drawio from scenario.md. Write your companion account to agent-report.md.`
- The session is a clean agent session in an empty directory, with isolated settings and memory. Install the package in the selected client's native skill location and provide one scenario as `scenario.md`. Nothing else reaches the session: no repository instructions, global skills, memory or correction from the authoring conversation. The owner clarified on 2026-11-06 that Claude Code is not required; record the agent, model, settings and isolation mechanism. The existing baseline was measured with Claude Code, so agent or model changes must be reported as separate comparisons.
- For scenario 02, the session gets only the block "Input text given to the skill", not the expected errors and elements that the file also holds.
- The reviewer gets the scenario and the images, and the [review prompt](./review-prompt.md). It never sees the rules of the package.

## How a change is judged

Every pull request that changes the package carries a baseline comparison: for each scenario, at least two runs of the changed package, their scores, and the baseline scores. A scenario whose mean is lower than the mean of its baseline scores minus the tolerance in `baseline.json` (0.5) is reported as below the baseline. The tolerance covers the run-to-run spread of up to one point that the baseline runs showed. The owner judges the comparison; no score merges or blocks a change by itself. The trigger check also stays at full pass: `npm run eval:trigger -- --skill architecture-diagram --agent claude --repeat 3 --baseline <ref>`.

A person looks at the images of any change that alters notation, because a score cannot tell a better convention from a different one.

## When the baseline moves

Only the owner moves the baseline. Then replace the commit, the scores and the reference outputs together.
