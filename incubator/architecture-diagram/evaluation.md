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
2. Use a writable supported client environment for a live smoke, then budget and execute full scenario/trigger comparisons on the final package. Shared scenario orchestration remains pending. Relevant runtime changes invalidate affected evidence. The frozen baseline has not been re-scored for the new [boundary](../../research/diagrams/architecture-diagram/0001-boundary-markers-identify-cloud-scope.md) and [colour](../../research/diagrams/architecture-diagram/0002-colour-cues-and-contrast-levels.md) standards.
3. Obtain required skills.sh audit approval tied to the actual artifact. The [access and audit recheck](#skillssh-audit-recheck) retrieved no partner verdict or artifact identity. Remote staging, artifact-bound owner approval and stable promotion remain pending.

## skills.sh audit recheck

Checked 2026-11-06 (UTC), continuing the handoff at `work/readme-product-story` commit `e3f530238259c28fc5d08d76b4a301d26d1dc77c`. PR #44 was open and unmerged; this evidence change starts from fetched `origin/main` at `3e71a1a413b8c7dc9a8662c3017f87fed3f2c628`.

- Environment: current observed specification revision `1`, running and connected, with enforced access to both skills.sh hosts. The executor policy agrees. Initial sandbox commands could not connect to `proxy:8080`; running through the same inherited proxy outside that sandbox succeeded. TLS verification remained enabled. At `2026-11-06T18:51:06Z`, HEAD returned 308 from `skills.sh` to `www.skills.sh`, and 200 from `www.skills.sh`. This supersedes the earlier session's access blocker, not any acceptance gate.
- Official implementation: npm registry `skills/latest` reports CLI `1.7.6`, with `gitHead` `7a5e920bead4b1039a6d6df5d7e1163b7b09423a`. Its [telemetry implementation](https://github.com/vercel-labs/skills/blob/7a5e920bead4b1039a6d6df5d7e1163b7b09423a/src/telemetry.ts) still uses GET `https://www.skills.sh/tele/audit` with `source` and comma-separated `skills`. `DISABLE_TELEMETRY` or `DO_NOT_TRACK` suppresses the CLI request; errors and the default three-second timeout return null. Direct read-only retrieval here does not depend on those CLI switches. The previously tested installation version remains `1.7.4`; no new installation claim is made.
- Response: GET with `source=ClydeShen/skills` and `skills=architecture-diagram` returned HTTP 200 and exactly `{"architecture-diagram":{}}`. Rechecking with lowercase `source=clydeshen/skills` returned the same result. No partner verdicts, findings, `analyzedAt`, revision or digest identifiers were supplied. The empty object establishes no available partner result; it does not distinguish an absent audit from pending work and is neither approval nor an adverse finding.
- Provider page: [Architecture Diagram](https://www.skills.sh/clydeshen/skills/architecture-diagram) returned HTTP 200 but displayed `404` and `architecture-diagram isn’t available in this repository.` HTTP success alone is not evidence of an indexed skill or audit approval.
- Artifact correspondence: neither response nor provider page binds a verdict to an artifact. Historical prepared source `8a1f58c592fdea4dd33fbe169e6317f087e19bac` / digest `64aca4256f56d4b811f58b535bd3a6217a348eac9331c0d4c2d6e7fe9a330635` is not accepted by this query. PR #44 separately records a format-validated export from source `5f6a426` / digest `cd9137d314cb85dbb0e89c7763ba15d511e3b0e61b669da29ebcee56a20b45aa`; it too has no matching external audit evidence. Neither historical identity is asserted to represent current package bytes.

### Trigger diagnosis and proposed isolated audit

Follow-up checked 2026-11-06 (UTC): the [official API documentation](https://www.skills.sh/docs/api) says audits are generated automatically after the first installation and may take a few minutes. GET `https://www.skills.sh/api/v1/skills/audit/clydeshen/skills/architecture-diagram` returned HTTP 404 with `{"error":"not_found","message":"No security audits found for this skill. Audits are generated automatically after a skill is installed for the first time."}`. This is stronger evidence than the empty legacy response: no audit is currently returned, rather than an adverse verdict. It does not establish whether a job is queued. The [FAQ](https://www.skills.sh/docs/faq) says installation telemetry causes leaderboard listing.

The pinned CLI's [install implementation](https://github.com/vercel-labs/skills/blob/7a5e920bead4b1039a6d6df5d7e1163b7b09423a/src/add.ts) normalizes GitHub telemetry to `owner/repo` and sends skill names and repository-relative paths, without the selected ref or content hash. Public-repository confirmation is required; private or unknown repositories suppress audit requests and telemetry. A branch-pinned local installation alone therefore does not establish which ref the backend scans. Historical local snapshot installations did not establish remote indexing or trigger evidence.

Exact-artifact evidence may be possible: the public [Socket audit detail for find-skills](https://www.skills.sh/vercel-labs/skills/find-skills/security/socket) includes `pkg:socket/skills-sh/vercel-labs%2Fskills%2Ffind-skills%2F@b146008599c31057cef1c145774cea5d5afb30e8f43fa802e47a4b461419aaaf`. This is a provider artifact identifier, not yet a proven match to this repository's digest algorithm. The documented detail API supplies snapshot `hash` and `files`; an example detail request returned HTTP 401 requiring Vercel OIDC. No configured Vercel identity exists in this environment, and none was fabricated. Even matching a current detail snapshot to local bytes would still require evidence linking that snapshot to each accepted partner verdict.

Fresh local exports verified the actual version distinction:

| Source commit                                                      | Publication digest                                                 | Files |
| ------------------------------------------------------------------ | ------------------------------------------------------------------ | ----- |
| `3e71a1a413b8c7dc9a8662c3017f87fed3f2c628` (fetched main)          | `64aca4256f56d4b811f58b535bd3a6217a348eac9331c0d4c2d6e7fe9a330635` | 25    |
| `e3f530238259c28fc5d08d76b4a301d26d1dc77c` (handoff/README branch) | `cd9137d314cb85dbb0e89c7763ba15d511e3b0e61b669da29ebcee56a20b45aa` | 25    |

Both exports used `skill:publication stage` and stayed outside the repository. The later README-branch source reproduces PR #44's recorded digest, while current main reproduces the earlier preparation digest. Neither has external audit approval.

Recommended next operation, subject to owner approval of public staging and the retained-artwork distribution boundary:

1. Use the README-branch source above as the explicit proposed target, unless superseded by an owner-selected revision. Regenerate and verify the same digest.
2. Place only that generated snapshot on a dedicated public audit-staging repository, clearly marked as an unapproved trial. Freeze its default branch at the recorded staging commit. This is public distribution, although isolated from `ClydeShen/skills` default stable discovery; it is not a private prepublication scan. Resolve retained-artwork rights before uploading assets whose redistribution remains unverified.
3. Perform one real CLI `1.7.6` installation from that repository in an isolated consumer with telemetry enabled; verify installed inventory against the snapshot. Do not synthesize installation counts. Query the audit service after the documented processing delay, with bounded follow-up.
4. Capture each partner's verdict, time and artifact identifiers. Establish the provider digest method or obtain provider evidence linking those identifiers to the frozen snapshot. Do not equate the Socket identifier with the local publication digest by appearance alone.
5. Confirm whether approval on the staging repository can satisfy the production-source requirement. If results are source-specific, obtain matching evidence for the production source before promotion; isolated staging approval alone does not authorize release.

Result: **no audit found; publication remains blocked**. No documented unauthenticated, private, revision-bound audit submission route was found in the inspected official docs and CLI. The next public staging operation needs an owner decision because it creates a new distribution surface and retained-artwork grants remain unresolved. No publication, remote staging, install telemetry event or paid model evaluation was performed.

The historical reviewer was a model, not independent human approval. A person must inspect notation/image changes. Earlier trials are recoverable from Git history, for example `facc1f1`; they are not a new baseline or current-release evidence.

## Existing-library coverage follow-up

On 2026-11-06, the owner requested maximizing drawing coverage through existing icon libraries instead of assuming all artwork must ship with the skill. The [19-identity library investigation](../../research/diagrams/architecture-diagram/0004-existing-libraries-reduce-bundled-artwork.md) found candidates for four identities, with product/fidelity caveats. Native Azure sample PNG/SVG export succeeded and was visually inspected. Lucidchart import and optional-library CLI support remain unverified; no excluded artwork was restored and no baseline score changed.

## Consumer-library implementation

On 2026-11-06 the owner authorized implementing broad library support and continuing release preparation rather than waiting to bundle every brand. The candidate now loads consumer-selected local draw.io libraries through `ARCHITECTURE_ICON_LIBRARIES` (or lookup-only `--library`). Supported single-image SVG/PNG entries join exact icon lookup, placement, finalization and existing SHA-256 render validation. Artwork is neither bundled nor downloaded by this adapter. Unsupported groups/active images are skipped; the labelled-box fallback remains available.

The pinned Integration logo library yielded 147 supported entries out of 154. Real Ansible, Terraform symbol and Terraform wordmark entries passed CLI lookup, original-byte embedding and PNG/SVG export with the pinned viewer and Chromium; all three images were visually inspected. Local provenance records library and artwork hashes. These are technical delivery checks, not new baseline quality scores. Changes to the consumer library invalidate selected IDs; the same library setting is required for later validation. Offline display uses embedded images, while actual Lucidchart import remains unverified.

`npm run check` passed 129 tests and 42 synthetic replay assertions. `npm run skill:check` passed with existing README/license/notices/nesting advisories; agnix remained unavailable. The initially missing pinned static tools were installed using Node's inherited-proxy support; no check was disabled. New tests cover compressed-library import, exact-byte finalization, render validation, tampering, source changes and rejected unsupported/active images. Cisco scanner 2.3.2 also passed the existing policy: only the three unchanged, hash-pinned renderer INFO findings remained. No paid model calls were made.

This change removes missing bundled icons as a reason to wait for complete brand coverage. It does not retrospectively approve retained bundled artwork, replace exact-artifact platform audit, or certify model behavior. Those remaining release requirements retain their recorded status.

Prepared export for [PR #45](https://github.com/ClydeShen/skills/pull/45): source `78c31b5cf6db3d2ce2a8d75008ebb93211340766`, publication digest `d8ee81559e7ba043aef1c5607c8aff788d29ba0919bd10ddb03ded8f3b992a83`, 26 files. The external temporary export passed `skill:publication verify` and the official `skills-ref` validator at `83021e2be457a9b6679148719c1f6074f0ad975e`. This supersedes the older snapshot as the proposed library-support target; it has no skills.sh audit approval. The evidence-only follow-up does not change package bytes.

## Behavioral regression required before integration

Owner clarification, 2026-11-06: changed skill behavior must return to regression before release progression. The consumer-library change modifies instructions, icon selection, embedding and validation when configured. Unit tests, technical render samples, synthetic replay and format/security checks do not establish behavioral regression acceptance. PR #45 is not ready for integration.

Required comparison: trigger cases repeated three times for each arm; baseline scenarios A, B, 02 and C generated at least twice each, scored by a context-free reviewer against the historical baseline and 0.5 tolerance. Record client/model differences separately. Also test a scenario that needs consumer-library icons; existing cloud scenarios alone do not cover that new path. Independent scenario orchestration remains to be completed through the shared runner, rather than a skill-specific evaluation framework.

An isolated scenario-A generation was attempted using Codex 0.163.0 and the fixed baseline prompt. Its temporary client home had only a reference to the existing login, with no copied global skills/settings/memory; the project held only the candidate in its native skill location and scenario.md. The client used workspace-write sandboxing, ephemeral state and ignored user configuration. No authoring conversation or expected answer was provided. This was an infrastructure readiness probe, not a completed scored evaluation.

The client failed to reach `wss://chatgpt.com/backend-api/codex/responses`: proxy CONNECT HTTP 403. A bounded unauthenticated HEAD request to `https://chatgpt.com/backend-api/codex/models` independently returned the same CONNECT 403. The environment permits skills.sh but not this model-service host. Retries were stopped; no diagram, reviewer score or regression pass exists. No proxy bypass, sandbox relaxation or alternate paid endpoint was used. Resume only after the supported environment policy permits `chatgpt.com`, then rerun the real trigger/scenario comparisons before integration and publication.
