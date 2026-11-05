# Architecture Diagram evaluation

Date: 2026-11-05. Status: the baseline is fixed. Every change to the package is checked against it.

## Scope and target

- Mode: model, with a real Claude Code session for each run.
- Package target: [candidate/architecture-diagram](./candidate/architecture-diagram/SKILL.md).
- Target identity: the baseline is commit `f7b7537`. The [baseline](./evals/baseline/README.md) records its scores and the rule for a pass.
- Cases: the four scenarios A, B, 02 and C in [evals/scenarios](./evals/scenarios), and the trigger cases in [trigger.json](./evals/trigger.json).

## Execution

- Environment: Node.js 24, the Claude Code CLI, and a network that reaches the Anthropic API.
- Command: `npm run eval:trigger -- --skill architecture-diagram --agent claude --repeat 3 --baseline <ref>` checks that the skill triggers when it should and skips when it should not. `node incubator/architecture-diagram/evals/regression.mjs --runs 2` runs the four scenarios, each in a clean session, and scores each result with a reviewer that has only the scenario and the images.
- Model and parameters: the default model of the Claude Code CLI, which `EVAL_CLAUDE_MODEL` overrides. The reviewer uses the same model.
- Evidence: the output of each run stays in the ignored `evals/.local/`. The pull request of a change carries its result. The folder holds only the baseline.

## Findings

The baseline scores, from clean runs with a context-free review, are A 7/10, B 7.5/10, 02 7/10 and C 7 and 6.5/10. The same scenario on the same package scored up to one point apart between runs, so the pass rule compares the mean of at least two runs.

## Limits and next step

- The reviewer is a model, not a person. It finds problems; it does not prove quality.
- Codex is not evaluated.
- A person should look at the images of any change that alters notation, because a score cannot tell a better convention from a different one.
- The earlier trials, from 2026-10-28 to 2026-11-05, were removed from the working tree. Git history holds them, for example at commit `facc1f1`.
