# Architecture Diagram evaluation

Date: 2026-11-05. Status: the baseline is fixed. Every change to the package is checked against it.

## Scope and target

- Mode: model, with a clean agent session for each run. Existing baseline runs used Claude Code; future runs may use another configured agent and must record that difference.
- Package target: [candidate/architecture-diagram](./candidate/architecture-diagram/SKILL.md).
- Target identity: the baseline is commit `f7b7537`. The [baseline](./evals/baseline/README.md) records its scores and how a change is judged.
- Cases: the four scenarios that [scenarios.json](./evals/scenarios.json) names, and the trigger cases in [trigger.json](./evals/trigger.json).

## Execution

- Environment: Node.js 24, the Claude Code CLI, and a network that reaches the Anthropic API.
- Command: `npm run eval:trigger -- --skill architecture-diagram --agent claude --repeat 3 --baseline <ref>` checks that the skill triggers when it should and skips when it should not. `npm run eval:scenario -- --skill architecture-diagram --agent claude --repeat 2` runs the four scenarios as [the baseline](./evals/baseline/README.md#how-a-run-is-made) describes: each in a clean session, scored by a reviewer that has only the scenario and the images.
- Model and parameters: the default model of the Claude Code CLI, which `EVAL_CLAUDE_MODEL` overrides. The reviewer uses the same model.
- Evidence: the output of each run stays in the ignored `evals/.local/`. The pull request of a change carries its result. The folder holds only the baseline.

## Findings

The baseline scores, from clean runs with a context-free review, are A 7/10, B 7.5/10, 02 7/10 and C 7 and 6.5/10. The same scenario on the same package scored up to one point apart between runs, so a comparison uses the mean of at least two runs, and the owner judges it.

## Release preparation

Date: 2026-11-06. Status: **blocked, not published**. Prepared source: `8a1f58c592fdea4dd33fbe169e6317f087e19bac`; snapshot digest: `64aca4256f56d4b811f58b535bd3a6217a348eac9331c0d4c2d6e7fe9a330635`. The `.publication.json` records its digest method, file inventory and the sole export transformation. Regenerate temporary artifacts from this commit instead of relying on a retained temporary path.

| Check                       | Observed result                                                                                                                                                                                                                                                                                                                                                            |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Documentation/license       | Package README, owner-approved MIT for original content, supplier/project license texts and third-party notices added. Artwork is not blanket-MIT licensed.                                                                                                                                                                                                                |
| Conservative artwork change | Owner-approved exclusion removed 19 entries from builder and generated catalog. The 75 retained entries equal their previous records, including artwork/hashes. Neutral/retained test fixtures preserve the PNG embedding and tamper assertions. No measured baseline artifact changed.                                                                                    |
| Repository verification     | `npm run check`: 127 tests and 42 synthetic assertions passed; targeted clarification replay passed 4/4. These are not quality scores. Advisory README/LICENSE/notices/nesting warnings remain; no check was disabled.                                                                                                                                                     |
| Reference format            | Official `skills-ref` at `83021e2be457a9b6679148719c1f6074f0ad975e` passed on the actual prepared snapshot.                                                                                                                                                                                                                                                                |
| Discovery/install           | skills CLI 1.7.4 on Linux: a temporary source-plus-snapshot repository listed one default skill. An authoring-only canary was not installed. Codex/Claude Code project-local copies matched the snapshot digest. This verifies delivery, not activation or Windows/macOS execution.                                                                                        |
| Security                    | Cisco scanner 2.3.2 passed existing policy with three exact-file reviewed INFO findings retained. Renderer SHA-256 remains `8c5637a3022599ec1a69d5d43232cd36603d1b1fb8f699e320ecb1791da3742c`. This is not external audit evidence.                                                                                                                                        |
| Authorized live smoke       | One scenario-A generation plus one NVIDIA image assessment authorized. Codex CLI 0.163.0 failed at app-server initialization with a read-only-filesystem error, including after a supported temporary state/log-path adjustment. No model resolved, no diagram/image produced and no NVIDIA call made. Both attempts are infrastructure failures, not zero quality scores. |

Git-ignored in-repository staging was discoverable by the CLI. The tool now stages outside the repository and enforces the skill's directory name. Earlier temporary staging artifacts were moved outside, not deleted. Root discovery again reports no released skills. Failed smoke reports remain ignored; do not retry-select successes or substitute an old baseline image.

Branch exception: release preparation retains the three locally accepted lifecycle commits as dependencies instead of discarding them to branch directly from `origin/main`; no verification was waived.

## Remaining acceptance

1. Complete exact-artwork grants and output attribution using [the rights research](../../research/diagrams/architecture-diagram/0003-bundled-icon-rights-need-explicit-notices.md). Excluding 19 entries does not clear every remaining supplier-labelled icon; retained Azure/GCP provider-mark permissions remain unverified. Do not remove required provider identity or declare permission merely to pass a check.
2. Use a writable supported client environment for a live smoke, then budget and execute full scenario/trigger comparisons on the final package. Relevant runtime changes invalidate affected evidence. The frozen baseline has not been re-scored for the new [boundary](../../research/diagrams/architecture-diagram/0001-boundary-markers-identify-cloud-scope.md) and [colour](../../research/diagrams/architecture-diagram/0002-colour-cues-and-contrast-levels.md) standards.
3. Obtain required skills.sh audit approval tied to the actual artifact. The site returned proxy HTTP 403 in this environment; no verdict was obtained. Remote staging, artifact-bound owner approval and stable promotion remain pending.

The historical reviewer was a model, not independent human approval. A person must inspect notation/image changes. Earlier trials are recoverable from Git history, for example `facc1f1`; they are not a new baseline or current-release evidence.
