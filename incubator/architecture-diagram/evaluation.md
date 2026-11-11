# Architecture Diagram evaluation

Date: 2026-11-10. Status: published at the revision recorded below. The baseline is fixed; every change to the package is checked against it.

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

## Release record

Date: 2026-11-11. Published revision: [`skills/architecture-diagram/`](../../skills/architecture-diagram/README.md), source commit `67afa05c7e9fea8d97572aff1667b62126eef007`, snapshot digest `91afbc8012b1cdef6cfbf1c60f0ca660c2f9ab3f20c5d97e7032198773e221e6`, 27 files. Its `.publication.json` records the digest method, the file inventory and the one export transformation (the candidate's internal marker is removed). Regenerate it with `npm run skill:publication -- stage architecture-diagram 67afa05c7e9fea8d97572aff1667b62126eef007`.

This is the third revision. The second (source `eacf45065a0700a0fb1c58feb0a3ddfc15dbff73`, digest `7f6b2a6adb18347a4d2efcef6fab9f0fc25f10fb0e732519dc7d7f53e2ca4276`) and the first (source `fd453ea34a46b250c0e70a53969f7f95eac1b2fe`, digest `4224ee3cda065cfa5cc676c2ef8a36f1a32b80cf3d0f93c98f2e40715113c218`) are earlier published revisions. The three differ only in `README.md` and `.publication.json`; every script, reference and asset is identical, so the regression and trigger results below, measured on source `92872b0`, describe all of them. The third README puts the install command first, gives one command, leaves the choice of agent to the skills CLI, describes only the skill, and says each idea once. For this revision: `skill:publication verify` matches the digest, `skills-ref` at `83021e2be457a9b6679148719c1f6074f0ad975e` reports a valid skill, `npx skills add . --list` lists one skill, and clean `--copy` installs for Claude Code and Codex are identical to the snapshot. This verifies delivery, not activation.

Owner approval of the second revision: on 2026-11-11 the owner approved the snapshot of source commit `eacf45065a0700a0fb1c58feb0a3ddfc15dbff73` (digest `7f6b2a6adb18347a4d2efcef6fab9f0fc25f10fb0e732519dc7d7f53e2ca4276`) for merge, after being told that it differs from the first revision only in `README.md` and `.publication.json`.

Owner approval of the first revision: on 2026-11-10 the owner approved the snapshot of source commit `92872b042a6856ed782e6248ae0d774d7751be19` (digest `facc8d18d5a280f6996963888540ad78b1dc8901db0d78565bbc7c286c4e79d6`) and directed that its README, which still described the package as unreleased, be corrected. The published revision differs from the approved one only in `README.md` and `THIRD-PARTY-NOTICES.md`; every script, reference and asset is identical.

### Behavioral regression

Command: `npm run eval:scenario -- --skill architecture-diagram --agent claude --repeat 2`, against source `92872b0`, whose scripts and references the published revision shares. Agent and reviewer: Claude Code with `claude-sonnet-5-5`, each run in a clean session. A run interrupted by the usage limit has no score and was rerun.

| Scenario                | Baseline | Runs | Mean | Baseline mean minus 0.5 |
| ----------------------- | -------- | ---- | ---- | ----------------------- |
| AWS support assistant   | 7        | 8, 7 | 7.5  | 6.5                     |
| Azure document Q&A      | 7.5      | 7, 7 | 7.0  | 7.0                     |
| Cross-cloud private API | 7        | 7, 6 | 6.5  | 6.5                     |
| AWS online store        | 7, 6.5   | 7, 6 | 6.5  | 6.25                    |

No mean is below its tolerance line; three are below the baseline mean, two of them exactly on the line. All eight runs had no layout error. The reviewers' recurring findings were small connector labels and key text at 900 pixels, long supporting (dashed) connectors in the two largest scenarios, and an incomplete standby region in the online store. The owner reviewed the eight images and accepted the comparison.

Trigger check: `npm run eval:trigger -- --skill architecture-diagram --agent claude --repeat 3 --baseline f7b7537`. Current 17 of 18 and baseline 17 of 18; the failing run of each was a provider request failure, not a trigger error. A rerun of that case gave current 2 of 3 and baseline 3 of 3, the failing one again a provider request failure. Every completed run triggered or skipped as its case expects.

### Checks

| Check            | Result                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repository       | `npm run check`: tests and 42 synthetic assertions passed; they are not quality scores                                                                                                                                                                                                                                                                                                                                                         |
| Reference format | Official `skills-ref` at `83021e2be457a9b6679148719c1f6074f0ad975e`: valid skill                                                                                                                                                                                                                                                                                                                                                               |
| Snapshot         | `npm run skill:publication -- verify skills/architecture-diagram` matches the digest above; formatters ignore `skills/` so the files stay byte-identical                                                                                                                                                                                                                                                                                       |
| Security         | Cisco scanner 2.3.2 on `skills/architecture-diagram`: highest severity LOW (the provenance file `.publication.json`) and three INFO findings for `scripts/render.mjs`, reviewed from CRITICAL. The file is byte-identical to the one reviewed on 2026-11-06, so the review registry now covers the snapshot path too; renderer SHA-256 `8c5637a3022599ec1a69d5d43232cd36603d1b1fb8f699e320ecb1791da3742c`. This is not external audit evidence |
| Discovery        | skills CLI 1.7.4, `npx skills add . --list` from the repository root: one skill, `architecture-diagram`, listed once                                                                                                                                                                                                                                                                                                                           |
| Clean install    | skills CLI 1.7.4 into a new project for Claude Code and for Codex with `--copy`: both installed trees are identical to the snapshot. This verifies delivery, not activation or Windows and macOS execution                                                                                                                                                                                                                                     |
| Package README   | The package carries its own first-use README with the install command                                                                                                                                                                                                                                                                                                                                                                          |
| Artwork          | 75 bundled entries; the 19 with unclear rights are excluded and draw as plain labelled boxes. Exact grants for the Azure and Google Cloud provider marks and Jenkins output attribution remain open in [the rights research](../../research/diagrams/architecture-diagram/0003-bundled-icon-rights-need-explicit-notices.md)                                                                                                                   |

### skills.sh audit

The table is for the first revision. Read on 2026-11-11 from [the skill's page](https://www.skills.sh/clydeshen/skills/architecture-diagram) and the partner pages under its `/security/` path, after an installation of the published repository whose report reached skills.sh. [The skills.sh API documentation](https://www.skills.sh/docs/api) says audits are generated automatically after a skill is installed for the first time, with a delay of a few minutes.

| Partner             | Result                               | Analyzed (UTC)   |
| ------------------- | ------------------------------------ | ---------------- |
| Gen Agent Trust Hub | Pass; risk `SAFE`                    | 2026-11-11 06:28 |
| Socket              | Pass                                 | 2026-11-11 06:29 |
| Snyk                | Pass; risk `LOW`; no issues detected | 2026-11-11 06:28 |

Status for the first revision: **all three partners pass, with no adverse finding**. Later revisions have no audit result of their own. The second revision was installed from GitHub on 2026-11-11 after its merge (skills CLI 1.7.4 with `NODE_USE_ENV_PROXY=1`, `--copy`, files identical to its snapshot). The skill page and the three partner pages were read straight after, and again about fifty minutes later, and still showed the analysis times above (06:28 and 06:29 UTC). [The skills.sh documentation](https://www.skills.sh/docs/api) says audits are generated after a skill is first installed, so a new revision may never be re-audited by this route. The audit is therefore not bound to the third revision, and its result for the third revision is unknown, not a pass.

- Gen Agent Trust Hub lists four informational categories that describe documented behavior: `COMMAND_EXECUTION` (Node `spawn` and `execFileSync` without a shell, for Git and Chromium), `EXTERNAL_DOWNLOADS` (the first run clones the pinned draw.io viewer from GitHub), `INDIRECT_PROMPT_INJECTION` (user scenarios are untrusted input, checked by `check-text.mjs` and `check-layout.mjs`) and `DYNAMIC_EXECUTION` (a headless browser renders the diagram, served locally with name resolution limited to `127.0.0.1`). It notes that rendering runs Chromium with its sandbox disabled (`--no-sandbox`); that is a candidate for the next revision.
- **Binding to the snapshot is inferred, not recorded by the provider.** An audit entry has a timestamp and no revision or digest, and the install report names only the repository and skill. The audits ran after the last commit to `skills/architecture-diagram/` (`651266e`, 2026-11-11 02:42 UTC), so they cover the current folder if skills.sh read the default branch when it audited. Socket's page shows a package hash (`4ddcd775ccd2fc91cca690347c24be9ebf5f188a9927befd45e7b4c4a30deac3`) that the CLI's folder-hash algorithm does not reproduce for this folder under any of 55 variants tried, so it is not used as evidence.
- The legacy endpoint `https://www.skills.sh/tele/audit?source=clydeshen%2Fskills&skills=architecture-diagram` returned only the Snyk entry. It is not a complete record: read the skill page or the partner pages.

## Remaining work

1. Close the open artwork grants and output attribution, or authorize a further exclusion.
2. Re-read the audit after each new revision and after any change to the published folder. Decide whether an audit of the first revision is acceptable for a README-only revision, or find a way to have the new revision audited.
3. The next revision, including PR #45's consumer icon libraries, needs its own regression against the same baseline.

The historical reviewer was a model, not independent human approval. A person must inspect notation and image changes. Earlier trials are recoverable from Git history, for example `facc1f1`; they are not a new baseline or current-release evidence.
