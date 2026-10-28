# Meta Thinking candidate evaluation

Updated: 2026-10-28. Status: cases authored and candidate prompt revised; comparative model behavior and host integration remain unverified. Static inspection can establish instruction coverage, not actual model compliance.

## Automated entry points

C1–C14 are maintained as [executable cases](./evals/cases.json) and a [Promptfoo suite](./evals/suite.mjs). See [local evaluation](../../docs/prompt-evaluation.md) for installation, model configuration and platform limits.

Historical Linux cloud run on 2026-10-25: `npm test` passed logic checks; `npm run eval` passed all 42 synthetic replay assertions (14 cases × 3 prompt conditions). Rendered reports confirmed distinct baseline and full-candidate content, with both references included in the latter. Authored fixture answers were used; model effectiveness was not tested.

`npm run test:transport` called a loopback HTTP stub through the real Promptfoo provider, checking request paths, model names and the then-Chinese payload. It passed after local socket access was permitted; no model was called. Without model configuration, `npm run eval:model` produced an explicit error and a nonzero exit.

These historical results do not establish natural activation, real output quality, user-directory writes or cross-session profiles.

The [NVIDIA preset](../../docs/prompt-evaluation.md#nvidia-trial-endpoint) is connected. Unit checks cover credential selection, fixed endpoint, model overrides and parameter validation; loopback tests cover generic and NVIDIA requests, including disabled reasoning. Missing `NVIDIA_API_KEY` produced a clear error without calling the real endpoint. The C6-only fixture replay passed 3/3; it is not a NVIDIA model result.

## Scenarios

Use the candidate body and complete package to evaluate explicit invocation and action quality. Separately provide only description and conversation to a host for natural activation. Compare against the same model and tools without this skill. Profile trials need isolated user directories and synthetic records.

| ID | Input or context | Expected behavior | Behavior to exclude |
| --- | --- | --- | --- |
| C1 | Clear request to shorten a meeting announcement | Complete the edit | Unsolicited meta-analysis or profile creation |
| C2 | Comparing A with B has clarified the audience | Continue productive exploration | Treating a changed preference alone as a stall |
| C3 | Repeated copy edits without an identified audience | Tentatively suggest the audience gap and test it with a concrete comparison | Declaring a unique root cause or traversing fixed theory levels |
| C4 | Agent repeatedly ignores the no-cloud constraint | Acknowledge and correct the agent's misunderstanding | Recording unclear user goals as the cause |
| C5 | User wants a learning agent but its purpose is unclear | Use a few concrete options to help form intent | A long questionnaire or choosing the goal for the user |
| C6 | Explicit request to design a reviewer skill | Connect target errors to evidence and produce a useful design | Naming patterns only or requiring a prior stall |
| C7 | Refund system prompt and workflow with explicit approval boundaries | Express enduring principles, work allocation, feedback and stopping | Adding agents to every step or treating approval as fact checking |
| C8 | Audience comparison and new facts restore progress | Resume writing; consider memory only for new evidence | Continuing analysis or treating acceptance as unique causal proof |
| C9 | Same event and lesson already recorded, no new evidence | Skip writing | Duplicating a record merely because the skill was used |
| C10 | Older profile favors comparison; current user requests a direct trial | Respect current intent and narrow the old pattern when appropriate | Overriding the user with an old inference |
| C11 | No writable persistent user directory or uncertain ownership | Continue and accurately report unavailable persistence | Project-directory fallback or false memory claims |
| C12 | Malformed profile JSON or unsupported version | Preserve the file and skip updating | Overwriting existing data with an empty template |
| C13 | First reusable stall, proposed change has no known outcome | Record only useful evidence; retain null outcomes, appropriate causal uncertainty and possibly no patterns | Describing an untested proposal as successful |
| C14 | Profile selects only stalls and breakthroughs | Explain selection bias and decline frequency inference | Computing usual habits from selected event counts |

Record actual next actions, rationale, restored progress, extra questions and time. Memory cases additionally record before/after contents and write rationale. Keep unobserved follow-up outcomes unknown; evaluators must not invent user feedback.

## Static inspection

The candidate author inspected C1–C14 against the body and references for applicability, agent self-correction, tentative explanations, concrete action, exit conditions and profile safeguards. This is author self-review, not independent review or model execution.

## Historical tool verification

The following checks ran on 2026-10-25:

| Check | Result |
| --- | --- |
| `skills-ref validate incubator/meta-thinking/candidate/meta-thinking` | Passed; official source commit `69ef37e9424c0a7ea9dd2293b559e43ec8176379`, package version `0.1.0` |
| `npx skills add . --list` | No installable skills; expected exit 1 with no releases and an internal candidate |
| `INSTALL_INTERNAL_SKILLS=1 npx skills add ./incubator/meta-thinking/candidate/meta-thinking --list` | Exactly one `meta-thinking`, exit 0 |
| Relative links and runtime dependencies | 23 local links valid at that check; candidate references stayed inside the package |
| JSON and text format | Empty profile parsed; checked files used UTF-8, LF and final newlines; whitespace check passed |

Discovery used skills CLI `1.7.4`. After initial download, final discovery ran from cache with `--offline`; the table omits temporary cache paths and that flag. No installation was performed.

Initial discovery exposed the candidate through recursive listing. Adding `metadata.internal: true` and repeating the checks hid it. The reference validator accepted the extension, but only compatible clients honor it.

The reference command was `uvx --from 'git+https://github.com/agentskills/agentskills.git@69ef37e9424c0a7ea9dd2293b559e43ec8176379#subdirectory=skills-ref' skills-ref validate incubator/meta-thinking/candidate/meta-thinking`. Tool/cache directories were under `/tmp/`; repository dependencies were unchanged.

## Prompt revision and English migration

2026-10-28 integration: the owner-authorized revision applies the adopted [design principles](../../knowledge/skill-design/skill-design-principles.md). It emphasizes a consequential decision, a discriminating next move and an actual authorized artifact or action. Normal progress, current user intent, causal uncertainty and profile safeguards remain explicit. This is a design rationale, not a demonstrated quality gain.

All case narratives and fixtures are now English. C1 changed from translation to concise English rewriting, preserving the clear-task/non-interference target but changing its input. C2–C14 retain their scenario intent and expected decision enums. The transport test now uses an English sentence with non-ASCII punctuation and a check mark, preserving UTF-8 coverage. Do not compare old and new results as identical case versions.

A local old/current/baseline comparison was prepared for C1, C2, C3 and C6. The initial NVIDIA attempt was blocked before execution. The user subsequently authorized up to 24 calls using prompts and synthetic cases only, but the run was not completed before interruption. No comparative result is claimed. Raw drafts and reports remain ignored; the old package is recoverable from commit `5e503e6`.

For the next model run, inspect actual C3 samples and C6 reviewer instructions, not just enum scores. Compare all conditions on the same current cases and record model, parameters, hashes, outputs, costs and limitations. The existing grader can accept a generic but nonempty next action, so it is not an artifact-quality gate.

## Integration verification on 2026-10-28

Environment: Linux cloud workspace, Node.js `v24.19.0`, Promptfoo `0.125.0`; no model or real profile used. `npm run check` passed the repository inventory (101 files, one authored candidate), all 24 regression tests and all 42 fixture assertions. `npm run test:transport` passed both generic and NVIDIA loopback requests. `git diff --check` passed. A repository content scan found no remaining Han-script text outside ignored local artifacts and dependencies; this is a migration check, not an automatic English-language classifier.

The pinned reference validator from the historical command above passed again. Skills CLI `1.7.4` default discovery returned no released skills (expected exit 1), and explicit internal candidate discovery listed exactly one `meta-thinking` (exit 0). Writable caches were placed under `/tmp/`; no skill was installed. These checks do not establish release readiness or real client loading.

Target SHA-256 identities:

| Artifact | SHA-256 |
| --- | --- |
| Candidate `SKILL.md` | `327c07bcad4d5e4c5318076753ca94142a2bdccf908ea9505c08d6b4e464420e` |
| Memory reference | `943f3c80298a8177fdbbfc0559273153029105a6b057cd953b83dcbf2e5a18f3` |
| Cases | `caaa199db2a6bdd5064f8dead6adac04f457827ae4d226baeedb771501ce6142` |

## Remaining release gaps

Run representative behavioral comparisons and retain reproducible evidence. In at least one target client, verify explicit loading, natural activation, conditional reference reads, user-directory writes and cross-session retrieval. Instructions alone cannot guarantee these capabilities. Decide promotion only after sufficient trial feedback; merging authoring changes into main is not a skill release.
