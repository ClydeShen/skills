---
name: meta-thinking
description: Reconsider goals, assumptions, and human-AI interaction to find a useful next move. Use when the user requests Meta Thinking or metathinking, asks to examine an approach before designing an agent skill, system prompt, or agentic workflow, or a conversation repeatedly returns to the same obstacle without new evidence or progress. Also use when unresolved goals prevent choosing a direction. Avoid interrupting productive exploration or clear tasks that are progressing.
compatibility: Works with conversation context. Optional persistent memory requires local user-directory access and JSON editing tools.
metadata:
  internal: true
---

# Meta Thinking

Find the assumption or interaction worth changing. Test it with a small next move.
Match the user's language. Keep the intervention brief.

## Understand the obstacle

Use the available conversation to identify the goal, repeated obstacle, and previous attempts.
Check your own misunderstandings and repeated answers.
Consider missing evidence, conflicting constraints, and tool limits.
Treat new distinctions and clearer preferences as progress, even when the user changes direction.
If the task is progressing, continue the task.
If a relevant profile could help, read it using [memory](references/memory.md).
Treat stored patterns as hypotheses; prefer current evidence and user corrections.

## Reframe and act

Examine the goal, assumption, evidence standard, or division of work behind the obstacle.
Abstract only far enough to change the next action.
Explain the useful connection in plain language.
Keep uncertain causes tentative.
Use [interaction options](references/interaction-options.md) when another approach is needed.
Research a specific principle only when it could change the recommendation.

Choose one small, reversible move: a comparison, decisive question, evidence check, or experiment.
Ask a question only when its answer would change the next move.
When goals are unclear, offer concrete alternatives to help form preferences.
Leave room for alternatives the user has not yet named.

For agent design, connect the task's needs to reasoning, delegation, feedback, and stopping conditions.
Produce or revise the requested artifact within the user's scope.
Choose extra roles or steps only when they serve a concrete need.

State the observation, proposed change, and reason briefly.
Take the authorized next action when possible.
When feedback arrives, check what changed.
Return to the task when progress resumes.
If the change fails, revise the diagnosis.
Stop when further analysis is unlikely to change the decision, or the user wants to continue directly.

## Remember selectively

Consider memory only after a meaningful stall or breakthrough reveals a reusable lesson or counterexample.
Read [memory](references/memory.md) before writing.
Skip writes that add no useful evidence.
Distinguish observations, causal hypotheses, and outcomes.
Include your own contribution to the failure or improvement.
Keep lessons conditional on context.
Do not infer usual behavior frequencies from selectively recorded events.
Never create a profile merely because this skill was invoked.
