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

## How a run is made

- Prompt for the skill, unchanged: `Use the architecture-diagram skill to create diagram.drawio from scenario.md. Write your companion account to agent-report.md.`
- The session runs in an empty directory with a fresh home folder. The directory holds the package under `.claude/skills/` and one scenario as `scenario.md`. Nothing else reaches the session: no repository instructions, no memory, and no correction from the authoring conversation.
- For scenario 02, the session gets only the block "Input text given to the skill", not the expected errors and elements that the file also holds.
- The reviewer gets the scenario and the images, and the [review prompt](./review-prompt.md). It never sees the rules of the package.

## How a change is judged

Every pull request that changes the package carries a baseline comparison: for each scenario, at least two runs of the changed package, their scores, and the baseline scores. A scenario whose mean is lower than the mean of its baseline scores minus the tolerance in `baseline.json` (0.5) is reported as below the baseline. The tolerance covers the run-to-run spread of up to one point that the baseline runs showed. The owner judges the comparison; no score merges or blocks a change by itself. The trigger check also stays at full pass: `npm run eval:trigger -- --skill architecture-diagram --agent claude --repeat 3 --baseline <ref>`.

A person looks at the images of any change that alters notation, because a score cannot tell a better convention from a different one.

## When the baseline moves

Only the owner moves the baseline. Then replace the commit, the scores and the reference outputs together.
