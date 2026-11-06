# Meta Thinking evals

The cases and graders of the skill, run by the shared runner in the root [evals](../../../evals) folder.

| Path           | What it holds                                                                       |
| -------------- | ----------------------------------------------------------------------------------- |
| `suite.mjs`    | Builds the prompts: no skill, the description alone, and the full candidate package |
| `cases.json`   | 14 decision cases, each with a fixture and the decision the skill should lead to    |
| `trigger.json` | Cases that check when the skill triggers, for `npm run eval:trigger`                |

Run `npm run eval` for the synthetic replay and `npm run eval:model` for a real model. The [evaluation record](../evaluation.md) holds the current result. Run output goes to the ignored `evals/.local/`.
