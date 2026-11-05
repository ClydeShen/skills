# Baseline

The baseline is the quality boundary of the skill. A change to the package passes only when its output is not lower than the baseline.

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

## When a change passes

For each scenario, take at least two runs of the changed package. The change passes when the mean of those scores is not lower than the mean of the baseline scores for that scenario minus the tolerance in `baseline.json` (0.5). The tolerance covers the run-to-run spread of up to one point that the baseline runs showed. A change also keeps the trigger check at full pass: `npm run eval:trigger -- --skill architecture-diagram --agent claude --repeat 3 --baseline <ref>`.

`node incubator/architecture-diagram/evals/regression.mjs` runs the scenarios and applies this rule. A person still looks at the images of a change that alters notation.

## When the baseline moves

Only the owner moves the baseline. Then replace the commit, the scores and the reference outputs together.
