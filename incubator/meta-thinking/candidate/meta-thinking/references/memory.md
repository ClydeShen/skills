# User profile memory

## Location and access

Use an explicitly configured profile path when the user provides one.
Otherwise resolve the actual user's home directory from the host.
Use `.agents/meta-thinking/profile.json` beneath that directory.
Resolve this to an absolute path before reading or writing.
In a remote sandbox, verify that the directory belongs to the intended user and persists across sessions.
If that cannot be established, use conversation context without persistent memory.
Do not substitute the project directory or the skill installation directory.

Read the profile only when its context could help the current task.
If the file is absent, continue without it.
Create it only when a useful event warrants a first write.
Use [the empty profile](../assets/profile.empty.json) for initialization.
Respect host permissions and the user's memory preferences.
If access is unavailable, continue the task and report the persistence limitation briefly when relevant.

## Data contract

Keep one UTF-8 JSON object with `version: 1`, `episodes`, and `patterns` arrays.
Follow the configured storage language for descriptive text; otherwise use the user's language.
Use stable, locally unique IDs and absolute dates in `YYYY-MM-DD` format.

An episode records an event:

| Field | Meaning |
| --- | --- |
| `id` | Stable episode ID |
| `date` | Date the event was recorded |
| `context` | Task conditions relevant to reusing the lesson |
| `observation` | What happened, including agent behavior when relevant |
| `action` | The attempted change, or `null` if none was tried |
| `outcome` | Observed result; use `null` while unknown |
| `cause` | `null`, or an object with `hypothesis` and `confidence` |
| `evidence` | A short factual anchor from the conversation or a retrievable reference |

A pattern summarizes a conditional lesson:

| Field | Meaning |
| --- | --- |
| `id` | Stable pattern ID |
| `context` | Conditions under which the lesson may apply |
| `claim` | The provisional thinking pattern or useful intervention |
| `confidence` | `tentative` or `supported` |
| `evidence` | IDs of supporting episodes |
| `counterevidence` | IDs of conflicting episodes; an empty array if none recorded |

For `cause.confidence`, also use `tentative` or `supported`.
Use `supported` only when evidence distinguishes the hypothesis from plausible alternatives.
A breakthrough after an intervention alone warrants at most `tentative` causal confidence.
Generalize across tasks only when the supporting episodes justify that scope.
Keep observations that contradict a pattern accessible.
Leave `patterns` empty when only an individual episode is justified.

## Lazy updates

Write only when a meaningful stall or breakthrough adds reusable evidence.
Update an existing episode when its outcome becomes known.
Add a new episode for a distinct event.
Revise a related pattern when new evidence changes its support or scope.
Skip duplicate lessons and unsupported guesses.
Preserve unknown outcomes instead of inventing a resolution.
Use a short summary of relevant behavior; omit unrelated personal details and secrets.

Before writing, reread the current file and preserve unrelated entries and unknown fields.
Validate the JSON and episode references before replacing the file.
Use an atomic replacement when the host supports it.
If another writer changed the file, merge against the new contents or defer the write.
If the version is unsupported or JSON is malformed, leave the file intact.
Continue without updating it and explain the limitation briefly.
After a successful write, briefly state what was remembered.

## Applying a lesson

Check that the current context matches the stored context.
Use a relevant pattern to propose an action, not to label the user.
Prefer a current correction over an older inference.
If evidence conflicts, narrow or revise the claim.
If no relevant evidence exists, make no profile-based inference.

Example: record that comparing two audiences helped clarify a writing goal.
Keep the cause tentative if new product facts arrived at the same time.
Do not turn this episode into a claim that the user generally lacks goals.
