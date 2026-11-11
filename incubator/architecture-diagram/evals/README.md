# Architecture Diagram evals

This folder holds the cases of the skill and the boundary that every change must stay above. It holds no history of experiments.

| Path                              | What it holds                                                                                       |
| --------------------------------- | --------------------------------------------------------------------------------------------------- |
| [baseline/](./baseline/README.md) | The quality boundary: commit, scores, reference outputs, reviewer prompt and how a change is judged |
| [scenarios/](./scenarios)         | The inputs given to the skill. `scenarios.json` names the baseline cases                            |
| `suite.mjs`, `cases.json`         | Clarification cases for the shared prompt runner                                                    |
| `trigger.json`                    | Cases that check when the skill triggers, for `npm run eval:trigger`                                |
| `scenarios.json`                  | How each baseline scenario runs, for `npm run eval:scenario`                                        |
| `*.test.mjs`                      | Tests of the checks and helpers of the package                                                      |
| [fixtures/](./fixtures)           | Frozen diagrams and reports that the tests read                                                     |

## Check a change

1. `npm run check`, then `npm run skill:check`.
2. `npm run eval:trigger -- --skill architecture-diagram --agent claude --repeat 3 --baseline <ref>`.
3. `npm run eval:scenario -- --skill architecture-diagram --agent claude --repeat 2`, and put the printed comparison in the pull request. [The baseline](./baseline/README.md#how-a-run-is-made) describes the runs.
4. Look at the images of any change that alters notation.

Run output goes to the ignored `evals/.local/`. Put the result in the pull request, not in this folder.
