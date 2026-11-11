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

Date: 2026-11-10. Published revision: [`skills/architecture-diagram/`](../../skills/architecture-diagram/README.md), source commit `fd453ea34a46b250c0e70a53969f7f95eac1b2fe`, snapshot digest `4224ee3cda065cfa5cc676c2ef8a36f1a32b80cf3d0f93c98f2e40715113c218`, 27 files. Its `.publication.json` records the digest method, the file inventory and the one export transformation (the candidate's internal marker is removed). Regenerate it with `npm run skill:publication -- stage architecture-diagram fd453ea34a46b250c0e70a53969f7f95eac1b2fe`. The source is the commit on `main` that merged the release (`fd453ea`); the snapshot was first built from the pull request's last commit `71ca85d`, which the squash merge left out of `main`'s history, so the repository check could no longer find it. The package files are identical at both commits and the digest is unchanged; only the source commit in `.publication.json` differs.

Owner approval: on 2026-11-10 the owner approved the snapshot of source commit `92872b042a6856ed782e6248ae0d774d7751be19` (digest `facc8d18d5a280f6996963888540ad78b1dc8901db0d78565bbc7c286c4e79d6`) and directed that its README, which still described the package as unreleased, be corrected. The published revision differs from the approved one only in `README.md` and `THIRD-PARTY-NOTICES.md`; every script, reference and asset is identical.

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

Pending. The audit appears only after the first installation from the published repository. After this revision merges to `main`, install it once with `npx --yes skills@1.7.4 add ClydeShen/skills --skill architecture-diagram`, read the audit and record its URL, date and verdict here. A missing or inconclusive result stays pending. An adverse finding is fixed in a new revision or the snapshot is withdrawn.

## Remaining work

1. Close the open artwork grants and output attribution, or authorize a further exclusion.
2. Record the skills.sh audit.
3. The next revision, including PR #45's consumer icon libraries, needs its own regression against the same baseline.

The historical reviewer was a model, not independent human approval. A person must inspect notation and image changes. Earlier trials are recoverable from Git history, for example `facc1f1`; they are not a new baseline or current-release evidence.
