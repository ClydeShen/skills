# Tech Humanizer evaluations

Run the evaluations locally with Promptfoo. The target and grading models may use APIs. The suite reads the current [candidate package](../candidate/tech-humanizer/SKILL.md) each run.

## Setup

Use Node.js 22.22.0 or later.

```sh
cd incubator/tech-humanizer/evals
npm ci
npm run check
```

Promptfoo is pinned in `package-lock.json`. Update it deliberately and rerun the checks before comparing results across versions.

## Run model evaluations

Set `EVAL_TARGET_PROVIDER` and `EVAL_GRADER_PROVIDER` to Promptfoo provider IDs. Configure credentials through that provider's environment variables. Use a separate grading model when practical.

For an OpenAI-compatible endpoint:

```sh
export EVAL_TARGET_PROVIDER="openai:chat:YOUR_TARGET_MODEL"
export EVAL_GRADER_PROVIDER="openai:chat:YOUR_GRADING_MODEL"
# Set OPENAI_API_KEY in your local environment.
npm run eval
```

Set `EVAL_API_BASE_URL` and `EVAL_GRADER_API_BASE_URL` when the endpoints differ from the provider defaults. Other supported provider IDs, such as `anthropic:messages:MODEL`, can be selected through the same two provider variables with their own credentials.

For a focused run or repeated sampling:

```sh
npm run eval -- --filter-pattern "protected|source|uncertainty"
npm run eval -- --repeat 3
```

Results and the skill source hashes are written under `results/`. The runner disables Promptfoo telemetry, result sharing, and caching. Model and grader requests go to the configured APIs. Use the synthetic fixtures supplied here for shared comparisons.

## Coverage and grading

The cases cover AI-style removal, natural expression, exact and unlisted technical terms, legacy vocabulary, plain verbs, already-clean text, business documents, client email, team messages, context isolation, evidence boundaries, uncertainty, safety wording, explicit punctuation preferences, corrections, provisional learning, promotion, project vocabulary, and ASD-STE100 activation.

Every case has deterministic checks and a semantic rubric. The deterministic checks protect concrete invariants. The grading model assesses meaning, naturalness, context, and evidence-based voice. Review failing outputs and grader reasons before changing the skill.

`npm run check` validates the harness and configuration without model calls. Its counterexamples show that checks reject damaged terminology, unintended profile writes, project-vocabulary leakage, and premature promotion. Passing this command establishes harness validity only.

## Profile-state boundary

The model returns an evaluation envelope containing `text`, `user_profile`, and `project_profile`. This exposes profile decisions without modifying a real user's files. Grading criteria are withheld from the target.

These cases evaluate supplied conversation history and resulting state decisions. They do not prove skill discovery, tool execution, filesystem persistence, or reuse in a fresh agent session. Verify those behaviors in disposable agent workspaces before declaring the complete learning loop validated.

For real-agent tests, use Promptfoo's [Agent Skills guide](https://www.promptfoo.dev/docs/guides/test-agent-skills/). Give each stateful scenario its own workspace and profile directory, and inspect the stored profile after the learning turn and the response from a fresh session.

## Evidence

Framework selection and current-version evidence are in the [selection note](../../../research/tech-humanizer/eval-framework-selection-2026-10-19.md). Prompt integration follows the official [dynamic prompt documentation](https://www.promptfoo.dev/docs/configuration/prompts/) and [model-graded assertions](https://www.promptfoo.dev/docs/configuration/expected-outputs/model-graded/).
