# Architecture Diagram evals

This folder holds the cases of the skill and the boundary that every change must stay above. It holds no history of experiments.

| Path                              | What it holds                                                                               |
| --------------------------------- | ------------------------------------------------------------------------------------------- |
| [baseline/](./baseline/README.md) | The quality boundary: commit, scores, reference outputs, reviewer prompt and the pass rule  |
| [scenarios/](./scenarios)         | The inputs given to the skill. `a`, `b`, `02` and `c` are the baseline scenarios            |
| `regression.mjs`                  | Runs the baseline scenarios in clean sessions, has each result scored, and applies the rule |
| `suite.mjs`, `cases.json`         | Clarification cases for the shared prompt runner                                            |
| `trigger.json`                    | Cases that check when the skill triggers, for `npm run eval:trigger`                        |
| `*.test.mjs`                      | Tests of the checks and helpers of the package                                              |
| [fixtures/](./fixtures)           | Frozen diagrams and reports that the tests read                                             |

## Check a change

1. `npm run check`, then `npm run skill:check`.
2. `npm run eval:trigger -- --skill architecture-diagram --agent claude --repeat 3 --baseline <ref>`.
3. `node incubator/architecture-diagram/evals/regression.mjs --runs 2`. The run needs the Claude Code CLI and a network that reaches the Anthropic API. It gives each session a fresh home folder, so set `ANTHROPIC_API_KEY` when you do not use a proxy. `--ref <git ref>` runs an older package; `--scenarios a,b` runs fewer scenarios.
4. Look at the images of any change that alters notation.

Run output goes to the ignored `evals/.local/`. Put the result in the pull request, not in this folder.
