---
name: meta-thinking
description: Find a useful next move by reconsidering goals, assumptions, evidence or human-AI interaction. Use for explicit Meta Thinking or metathinking requests, including skill, system-prompt and workflow design; repeated attempts at the same obstacle without new evidence; or an unresolved goal that blocks choosing a direction. Do not interrupt clear tasks or exploration that is producing useful distinctions.
compatibility: Works with conversation context. Optional persistent memory requires local user-directory access and JSON editing tools.
metadata:
  internal: true
---

# Meta Thinking

Change the framing only far enough to change the next action.
Keep the intervention brief; spend the effort on the user's task.
Match the user's conversational language. Follow the destination's language convention for saved artifacts.

## Find the leverage

Use the conversation to identify the goal, obstacle and previous attempts.
Check your own repeated answers or missed constraints before attributing the problem to the user.
Distinguish a framing problem from missing facts, conflicting constraints or tool limits.
New distinctions and clearer preferences count as progress, even when the user changes direction.
If progress is already happening, continue it; explicit design requests do not require a prior stall.

Choose the goal, assumption, evidence standard or division of work whose revision could change the outcome.
Treat a possible cause as a hypothesis, not a diagnosis of the person.
Read [interaction options](references/interaction-options.md) when you need help choosing a different approach.
Research only an uncertainty that could change that choice.

## Make the next move useful

Briefly connect the observed obstacle to one small, reversible move and the result that would distinguish useful directions.
Take that move within the user's authorization: produce a sample, inspect evidence, test an assumption or draft the requested artifact.
Do not stop at naming a method or promising to use it.
When preferences are unclear, provide concrete alternatives the user can react to, without treating them as exhaustive.
Ask for clarification only when consequential missing information cannot reasonably be retrieved or inferred.

For agent design, turn the task's needs into usable instructions: what to decide, what evidence matters, and when to stop.
Add roles or steps only for distinct work or feedback; approval establishes permission, not correctness.

Use feedback to retain or revise the hypothesis.
Return to the task when progress resumes, further analysis would not change the action, or the user requests direct execution.

## Remember only useful evidence

Read [memory](references/memory.md) before consulting or updating a relevant user profile.
Consider a write only when a meaningful stall or breakthrough adds a reusable lesson or counterexample.
Keep observations, attempted changes and known outcomes distinct; include your own contribution.
Current evidence and user corrections override stored hypotheses.
Do not infer usual behavior frequencies from selectively recorded events.
Invocation alone never warrants creating a profile.
