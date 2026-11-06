# Architecture Diagram evaluation

Date: 2026-11-05. Status: the baseline is fixed. Every change to the package is checked against it.

## Scope and target

- Mode: model, with a clean agent session for each run. Existing baseline runs used Claude Code; future runs may use another configured agent and must record that difference.
- Package target: [candidate/architecture-diagram](./candidate/architecture-diagram/SKILL.md).
- Target identity: the baseline is commit `f7b7537`. The [baseline](./evals/baseline/README.md) records its scores and how a change is judged.
- Cases: the four scenarios A, B, 02 and C in [evals/scenarios](./evals/scenarios), and the trigger cases in [trigger.json](./evals/trigger.json).

## Execution

- Environment: Node.js 24, the Claude Code CLI, and a network that reaches the Anthropic API.
- Command: `npm run eval:trigger -- --skill architecture-diagram --agent claude --repeat 3 --baseline <ref>` checks that the skill triggers when it should and skips when it should not. The four scenarios run as [the baseline](./evals/baseline/README.md#how-a-run-is-made) describes: each in a clean session, scored by a reviewer that has only the scenario and the images.
- Model and parameters: the default model of the Claude Code CLI, which `EVAL_CLAUDE_MODEL` overrides. The reviewer uses the same model.
- Evidence: the output of each run stays in the ignored `evals/.local/`. The pull request of a change carries its result. The folder holds only the baseline.

## Findings

The baseline scores, from clean runs with a context-free review, are A 7/10, B 7.5/10, 02 7/10 and C 7 and 6.5/10. The same scenario on the same package scored up to one point apart between runs, so a comparison uses the mean of at least two runs, and the owner judges it.

## Limits and next step

- Current candidate changes, 2026-11-06: [boundary identity markers](../../research/diagrams/architecture-diagram/0001-boundary-markers-identify-cloud-scope.md) cover AWS's native cloud style plus Azure and Google Cloud provider artwork with explicit boundary placement. [Colour guidance](../../research/diagrams/architecture-diagram/0002-colour-cues-and-contrast-levels.md) distinguishes WCAG Level A colour independence from AA contrast targets and adds an opaque-pair calculator. Existing icon contents and the fixed baseline are unchanged. Package checks, helper tests, four Promptfoo synthetic assertions and an illustrative baseline-02-copy render passed. Full clean-session trigger/scenario comparison remains pending; this is not a new quality score.
- The reviewer is a model, not a person. It finds problems; it does not prove quality.
- Codex is not evaluated.
- A person should look at the images of any change that alters notation, because a score cannot tell a better convention from a different one.
- The earlier trials, from 2026-10-28 to 2026-11-05, were removed from the working tree. Git history holds them, for example at commit `facc1f1`.
