# Shared delivery harness

This is the operating guide for this repository's engineering harness, not a new runtime skill or orchestration service. It implements the [source-of-truth contract](./REPOSITORY-STRUCTURE.md) and [formats](./DOCUMENT-FORMATS.md). The [implementation decision](../research/harness/adr/0002-shared-delivery-harness.md) records the selected controls. Reusable harness knowledge remains in [knowledge/harness](../knowledge/harness/README.md).

## Small shared workflow

1. Find the owning artifact and inspect the current worktree before editing. State the task scope and intended verification. Research only unresolved questions that can change the implementation.
2. Edit the authoritative source and its dependent links, projections and tests. Preserve unrelated work. Keep skill runtime instructions light; engineering machinery stays outside installed packages.
3. Run the shared gate, examine the diff, and record the result in the owning initiative when behavior or trial evidence changes. Handoff states what changed, what was actually tested, and any remaining blocker. Do not claim release, independent review or model effectiveness from static checks.

One agent can do a small task. When several agents work, assign disjoint file ownership or separate branches/worktrees; keep one integrator responsible for conflicts, source-of-truth consistency and the combined gate. A subagent reports touched paths, tests and unresolved findings to the integrator. Do not run full-tree Stop hooks on every worker while other workers are midway through edits. This repository does not automatically spawn agents, maintain a second task catalog, or require a planner/reviewer ceremony for every change.

## Setup and command contract

Use Node.js 24 and Git on Windows, macOS, Linux, WSL or a cloud workspace. Run the same commands from the repository root:

```text
npm ci
npm run git:setup
npm run check
```

`package.json` owns command definitions and exact dependency versions; the lockfile owns resolved npm dependencies. No Python, Bash or model key is required for the core gate. The optional Git hook uses Git's shell, available with Git for Windows.

| Entry | Purpose | Gate |
| --- | --- | --- |
| `npm run check:repo` | Fast repository contracts | Blocking |
| `npm run git:setup` | Enable reviewed repository Git hooks in this clone; refuses conflicting hooks | Explicit local setup |
| `npm run git:check` | Check current branch, authoring state and local hook activation, or CI source/target refs | Blocking; also part of `check:repo` |
| `npm test` | Shared checker and evaluation-harness regression tests | Blocking |
| `npm run eval` | Offline synthetic replay of initiative cases | Blocking harness smoke, not skill quality |
| `npm run check` | Runs the three entries above, stopping at the first failure | Shared handoff/CI gate |
| `npm run test:transport` | Loopback HTTP provider contract tests; no remote model | Additional CI gate; needs local socket access |
| `npm run lint:agents` | Pinned agnix diagnostics for skills and agent configuration | Advisory CI job; nonzero exit remains visible |
| `npm run skills:sync` | Explicitly copy reviewed canonical development tools to the Claude projection | Mutation, followed by `check:repo` |

Real-model commands and configuration remain in [prompt evaluation](./prompt-evaluation.md). They are explicit, quota-consuming checks and are never triggered by hooks or the default gate. Evaluation output stays in ignored `evals/.local/`. The repository checker does not open actual user profiles or ignored environment files; the evaluation runner loads `.env.evaluation` only in explicit model mode.

### Deterministic coverage

The checker inventories tracked and non-ignored new files through Git; it does not recursively read dependencies, ignored model output or local credentials. Tracked private environment/profile paths are rejected without reading their contents. It checks:

- Authored candidate/release placement, frontmatter fields/types/limits, directory-name match, internal-marker lifecycle, duplicate names and shadowing container `SKILL.md` files.
- Candidate initiative artifacts, package-local Markdown references and literal `references/`, `scripts/`, `assets/` paths in inline code. Missing targets, wrong case, heading anchors, package escapes and authored symlinks fail.
- Uppercase stems for established framework document roles at the root and in `docs/`, following the [filename convention](./DOCUMENT-FORMATS.md#framework-document-filenames). Ordinary content and tool-defined filenames retain their existing conventions.
- Local Markdown links across maintained and historical documents, JSON/YAML parsing, LF/final newline, checklist schema and unique checklist IDs. Fenced example links are not treated as real navigation.
- Locked development-tool presence/provenance, byte-for-byte `.agents/skills/` → `.claude/skills/` equality and orphan projections. The root Claude adapter stays an import, not a second instruction source. Undeclared `AGENTS.override.md` files fail.

It does not establish completeness of research, causal truth, appropriate activation, safety of arbitrary scripts or remote URLs, or actual filesystem behavior proposed by a model. It does not parse every possible plain-text resource mention or prove that an initiative's narrative status is correct. Review these semantically. Use the independent CLI, reference-validator, clean-install and behavioral checks in the [release contract](./REPOSITORY-STRUCTURE.md#installation-and-release-checks) before publication; `check` alone is not release approval.

### agnix and dependency limits

agnix is optional because its postinstall downloads a platform binary from GitHub. npm lock integrity covers its npm package, not an independently pinned release binary; the installer verifies the upstream checksum. Supported architectures and download access must be verified on the host. An unavailable advisory tool must be reported, not counted as a clean scan.

On this cloud executor, the installer required Node's `NODE_USE_ENV_PROXY=1` environment setting to use the inherited proxy. Set it through the host's normal environment configuration when needed; do not unset proxy settings or disable TLS verification. Failed optional installation does not remove the core gate.

The measured agnix 0.59.3 report includes AS-016 on the existing candidate's boolean `metadata.internal`. That is a documented skills CLI extension; the core checker validates it explicitly. Keep the incompatibility visible rather than broadly disabling YAML checks. The candidate marker is removed at authorized release. Other heuristics remain advisory until their usefulness and false positives are reviewed. Do not enable automatic fixes as a gate.

## Client and Git adapters

`AGENTS.md` is shared instruction authority; `CLAUDE.md` imports it. Both client configurations call `harness/stop-hook.mjs`, which runs the same fast `check:repo` implementation. Hook checks do not replace the full handoff gate.

The Stop hook asks for one repair pass after a failed check. If `stop_hook_active` is already true, it surfaces an incomplete-verification message without another continuation. Missing dependencies, failed child processes and timeouts are failures, not green checks. Malformed event input exits nonzero without claiming validation. Scope-limited blockers can be handed back; a hook is not permission to fix unrelated changes.

### Codex

Review and trust `.codex/hooks.json` in `/hooks` using a version that supports project hooks. The measured local CLI is 0.163.0; review changed definitions again. The Node bootstrap resolves the Git root, so starting inside a subdirectory works. Its command contains no platform-specific shell expansion. The hook does not grant shell permissions, change approvals or bypass trust.

Project command hooks are not supported in every hosted/cloud orchestration path. A checked-in file does not prove this running session loaded it. If absent or unsupported, use the documented commands and CI. See [official Codex hook behavior](https://learn.chatgpt.com/docs/hooks).

### Claude Code

Review `.claude/settings.json` and inspect `/hooks` in a trusted project. The adapter uses current documented exec-form `command`/`args` with `${CLAUDE_PROJECT_DIR}`, avoiding npm `.cmd` shims and shell quoting. Verify support in the installed version; no Claude executable was available in this cloud environment. See [official Claude hooks](https://code.claude.com/docs/en/hooks).

Neither adapter installs a global hook or changes the user's managed policy. Client hook startup errors or unsupported configurations may fail open. We intentionally do not add broad auto-approve rules, pretend Read/Edit rules cover arbitrary shell IO, or claim identical OS sandboxing across native Windows, WSL, macOS and cloud.

### Git strategy

Adopted by the owner on 2026-10-28 for concurrent skill incubation and knowledge work. Keep one long-lived `main` and short-lived `work/<topic>` branches, where topic is lowercase kebab-case. Examples: `work/meta-thinking-prompt`, `work/reviewer-draft`, `work/memory-knowledge`, `work/harness-hooks`. Branches represent independently reviewable changes. Skills and knowledge topics may span many branches; maturity belongs in repository directories and initiative records.

Owner clarification on 2026-10-28: these are soft workflow safeguards, and bypassing them is acceptable when a task warrants an exception. Keep the documented workflow as the default. Record the exception's reason and which checks were skipped or failed; continue within the user's existing authorization. For a one-off local commit or push exception, Git supports `--no-verify`; this skips the relevant hook, including any checks it invokes. Run applicable verification separately and report its actual results. This does not authorize discarding other work, exposing credentials or claiming that skipped checks passed. Server-side enforcement is optional and is not a prerequisite for using the repository.

At session start, inspect the current branch, worktree, status and task before editing. Run `npm run git:setup` once per clone and `npm run git:check` each session. Resume an existing task in its own worktree. For new work, fetch `origin`, then create a task branch from `origin/main`. Keep concurrent independent sessions in separate worktrees; do not switch a shared directory's branch beneath another session. Inspect `git worktree list` before choosing a path. For example, `git worktree add ../skills-reviewer -b work/reviewer-draft origin/main` creates an isolated task. Each worktree needs its own dependencies; Git hook configuration is shared by linked worktrees.

Make one coherent change per PR. Include related evidence, knowledge, candidate and evaluation updates when they implement that change. Designate one integrator for overlapping shared files. Merge current `origin/main` into an active task branch when needed; do not rewrite shared history. Paused work uses a draft PR with current status and next steps.

Integrate through a PR targeting `main` after all three platform gates pass. Default to squash merge. Merging research or a candidate does not release a skill. Releases follow the package lifecycle, with a tag when a version needs an immutable reference. Do not use long-lived develop, per-skill or release branches.

The owner reported enabling GitHub's automatic deletion of merged head branches on 2026-10-28. Let GitHub clean up the merged remote branch. Before deleting a local branch, inspect its PR's merged state, exact head and local commits. Squash merges are not reliably recognized by `git branch --merged`. Confirm that no local work was added after the merged PR; retain it when uncertain. Inspect linked worktrees, including untracked and ignored files, and preserve local artifacts before removal. Remove only the finished task's worktree without `--force`, then its local branch. A verified squash merge can require `git branch -D <exact-task-branch>`; use it only after these checks. Never batch force-delete branches. Closed, unmerged PRs need an explicit decision to retain or discard their work. Finish by fetching with `--prune`; update a clean main checkout with `git merge --ff-only origin/main` without disturbing other active worktrees.

### Git enforcement

`npm run git:setup` sets local `core.hooksPath` to `.githooks`, enables executable hooks and refuses an existing custom path or default hooks. Reconcile conflicts instead of overwriting them. Installation is explicit and repeated for each clone; `npm ci` does not change Git configuration. Relative hook paths resolve within each linked worktree.

The pre-commit hook rejects `main`, detached HEAD and invalid task names. The pre-push hook reads every actual ref update: it rejects direct main updates/deletion, invalid or renamed task destinations, non-fast-forward or unverifiable updates, non-current task branches and changes/deletions of existing tags. New tags remain subject to release authorization. It then runs the complete shared gate. `check:repo` and client Stop hooks also check Git policy: local main must be clean, task naming valid and hooks enabled. A clean main may be inspected and tested normally.

CI checks real push/PR context, including detached checkouts: PR source must be `work/<topic>` and target must be `main`; pushes allow main, task branches and release tags. The check runs inside the existing three required platform jobs. Old inactive local branch names do not fail current-task checks; inspect and retire them separately.

These are bypassable workflow controls, as accepted by the owner. Hooks and CI provide default feedback; resistance to deliberate bypass is not a project requirement. Parallel session identity, semantic task scope, human authorization and safe squash cleanup require agent judgment; the tools do not infer them or delete work automatically.

## CI and protected integration

The workflow runs the shared gate plus transport tests on Ubuntu, Windows and macOS, with no model key. The separate Linux agnix job reports advisory findings. WSL uses the same Node path but is not a separate CI runner. A workflow definition is not evidence of a successful remote run.

The owner approved PR-based integration and three platform checks on 2026-10-24 (UTC). The clarification on 2026-10-28 retains these as the default workflow and makes server-side enforcement optional. [main-protection.json](../.github/main-protection.json) remains an optional stricter preset, not a required setup task. If applied, it requires the three `local-evaluation` matrix checks from the GitHub Actions app (observed app ID 15368), an up-to-date head and a pull request; it applies restrictions to administrators and disallows force pushes and deletion. agnix remains advisory. A regression test checks that the preset's names match the actual workflow matrix.

The preset requires no approving reviews for the current single-owner workflow. This enforces the agreed PR/check gate without locking the owner out of their own PRs. `.github/CODEOWNERS` still routes review, but it is not independent review enforcement. Add a genuinely independent eligible reviewer before enabling required code-owner approval or last-push approval. Review changes to `AGENTS.md`, source/format policies, `harness/`, dependencies, client/Git adapters, CI, the protection preset and CODEOWNERS as changes to the checks themselves.

Server protection is optional; its absence is not an outstanding setup blocker. Historically, the last observed branch response was `protected: false`, with an empty ruleset list. The available integration rejected the administration endpoint with HTTP 403; the cloud CLI's GitHub API request was also forbidden. Repository owner/admin role alone does not give the active integration an Administration API scope. Protection was not applied through that session. Do not enable or tighten it during routine authoring; treat that as a separate requested configuration change.

If stronger protection is separately requested, after all three platform jobs pass an administrator with GitHub CLI Administration access can inspect existing protection/rulesets and apply the preset from the repository root:

```text
gh api --method PUT repos/ClydeShen/skills/branches/main/protection --input .github/main-protection.json
gh api repos/ClydeShen/skills/branches/main/protection
```

When applying that optional preset, reconcile existing protection settings first. Verify that the GET response contains the three expected check contexts/app IDs, strict status checks, administrator enforcement and PR requirements, and that the branch response reports `protected: true`. Record the observed state and date here. A requested exception to a Git workflow rule should be recorded explicitly rather than presented as a successful check.

A delivery agent with the owner's admin credentials can still change server settings. Stronger boundaries need a separate managed host policy, restricted credentials and independent server-side review. The harness provides stable feedback and reviewable contracts, not a security sandbox.

## Maintenance and observed verification

Change a rule in its owning standard, update the corresponding checker and add a negative regression case. Keep hook adapters thin and reuse commands in CI. Imported development tools are upstream dependencies: review the canonical tree and lock provenance, then explicitly synchronize the projection; the copy command refuses orphan deletions and symlinks. For a removal, review and delete the obsolete projection explicitly.

Local Linux verification on 2026-10-24 uses synthetic fixtures, no real profile or model key. The regression tests exercise valid/invalid package metadata, duplicate sources, links/anchors/case, package escapes, projection drift, schema errors, ignored credentials, symlinks where supported, Stop success/failure/repeat/error paths, malformed input, and the actual Codex bootstrap from a subdirectory. These adapter tests are protocol/command checks, not real client event delivery. Subsequent Windows/macOS CI evidence is recorded below; WSL-specific execution, actual client loading and protected integration still need host-side verification.

Observed results: clean `npm ci` succeeded with the proxy setting above; `npm run check` passed (22 unit/regression tests, including the framework filename convention, and 42/42 synthetic replay assertions); `test:transport` passed for generic and NVIDIA loopback requests. Projection synchronization and the pinned Agent Skills reference validator passed. Cached skills CLI 1.7.4 listed no released skills at the root (expected exit 1) and exactly one skill at the explicit internal candidate path. agnix reported the known AS-016 incompatibility and VER-001 unpinned-client-version information; it was not a clean scan. No real model or actual client lifecycle was tested.

Remote run for `6250662` passed Ubuntu and Windows but failed the macOS relocated-hook test: `argv` retained a temporary-directory alias while Node resolved the module URL to its physical path, causing the CLI entrypoint to emit no JSON. The repair compares physical paths and adds an explicit directory-alias regression, including spaces and `--preserve-symlinks-main`. This changes invocation handling, not package-resource symlink policy. Local repair verification on 2026-10-25 passed 24 unit/regression tests, 42/42 fixture assertions and both loopback provider requests. The updated remote matrix must be verified before applying branch protection.

Remote repair verification on 2026-10-25: the [PR run for `e53af33`](https://github.com/ClydeShen/skills/actions/runs/40145054674) passed all three platform jobs, including macOS and Windows alias-entrypoint regression tests (24/24 tests, none skipped), fixture replay and transport checks. agnix retained the known non-blocking metadata diagnostic. This verifies the code on those runners; it does not activate the pending server protection or prove actual client hook delivery.

Git strategy verification on 2026-10-28: local setup enabled repository hooks after checking for conflicts. `npm run check` passed 28 regression tests and 42 fixture assertions; loopback transport passed. Git policy tests exercised a real rejected main commit, successful task commits, linked-worktree isolation, conflicting hook setup, detached authoring, CI refs, push destinations, multiple ref updates, ancestry and immutable tags. GitHub CLI requests for repository settings and main protection returned Forbidden, so current server protection could not be refreshed or enabled through that route. The connector reports squash, merge and rebase methods all available; squash is the project default, not an exclusively enabled server method. GitHub automatic head deletion is owner-reported. Client Stop delivery and other clones' local hook setup still require their hosts.
