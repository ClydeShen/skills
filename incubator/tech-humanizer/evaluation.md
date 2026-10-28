# Tech Humanizer candidate evaluation

Date: 2026-10-28. Status: deterministic checks run on a synthetic replay; no behavioral trial has run.

## Entry points

- Repository gate: `npm run eval -- --suite incubator/tech-humanizer/evals/suite.mjs` replays 20 cases from [cases.json](./evals/cases.json) through the shared runner. It checks the assertions and the prompt assembly. It does not evaluate a model.
- Model run: `npm run eval -- --mode model --suite incubator/tech-humanizer/evals/suite.mjs` applies the same deterministic assertions to a configured model. See [local prompt evaluation](../../docs/prompt-evaluation.md).
- Rubric-graded quality: `npm run eval` inside [evals/](./evals/README.md) adds an `llm-rubric` grader for meaning, terms, and voice. The shared runner does not run it.

## Open before release

- Natural activation from the description alone: not tested.
- Output quality of a real model with and without the skill: not tested.
- Profile reads and writes in a real user directory: not tested. The cases use synthetic profiles in the prompt.
- Clean-checkout installation into an isolated client workspace: not run.
- License: the repository has no license file and the package declares none.
