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
npm run check
```

`package.json` owns command definitions and exact dependency versions; the lockfile owns resolved npm dependencies. No Python, Bash or model key is required for the core gate. The optional Git hook uses Git's shell, available with Git for Windows.

| Entry | Purpose | Gate |
| --- | --- | --- |
| `npm run check:repo` | Fast repository contracts | Blocking |
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

### Optional pre-push hook

Inspect `git config --local --get core.hooksPath` and existing hooks first. If no conflicting hook setup exists, opt in with `git config --local core.hooksPath .githooks`. The checked-in pre-push hook calls `npm run check`. Do not overwrite an existing hooks path without resolving it. This setting is local, not automatically installed by `npm ci`, and can be bypassed; CI remains necessary.

## CI and protected integration

The workflow runs the shared gate plus transport tests on Ubuntu, Windows and macOS, with no model key. The separate Linux agnix job reports advisory findings. WSL uses the same Node path but is not a separate CI runner. A workflow definition is not evidence of a successful remote run.

`.github/CODEOWNERS` routes reviews to the repository owner. Before relying on protected integration, the owner must configure a GitHub ruleset/branch protection for the integration branch to:

1. Require the three `local-evaluation` matrix status checks and an up-to-date tested head (or a tested merge queue).
2. Require code-owner review, dismiss stale approvals and restrict bypass identities. Arrange an independent eligible reviewer when the author is the owner; CODEOWNERS alone cannot supply independence.
3. Review changes to `AGENTS.md`, source/format policies, `harness/`, npm dependencies, client/Git adapters, CI and CODEOWNERS as changes to the checks themselves.

Remote rules were not inspected or modified in this implementation. A delivery agent with the owner's admin/bypass credentials can defeat same-repository controls. Stronger boundaries need a separate managed host policy, restricted credentials and server-side review. The harness provides stable feedback and reviewable contracts, not a security sandbox.

## Maintenance and observed verification

Change a rule in its owning standard, update the corresponding checker and add a negative regression case. Keep hook adapters thin and reuse commands in CI. Imported development tools are upstream dependencies: review the canonical tree and lock provenance, then explicitly synchronize the projection; the copy command refuses orphan deletions and symlinks. For a removal, review and delete the obsolete projection explicitly.

Local Linux verification on 2026-10-24 uses synthetic fixtures, no real profile or model key. The regression tests exercise valid/invalid package metadata, duplicate sources, links/anchors/case, package escapes, projection drift, schema errors, ignored credentials, symlinks where supported, Stop success/failure/repeat/error paths, malformed input, and the actual Codex bootstrap from a subdirectory. These adapter tests are protocol/command checks, not real client event delivery. Windows/macOS/WSL execution, actual client loading, remote CI and protected integration remain host-side verification steps.

Observed results: clean `npm ci` succeeded with the proxy setting above; `npm run check` passed (22 unit/regression tests, including the framework filename convention, and 42/42 synthetic replay assertions); `test:transport` passed for generic and NVIDIA loopback requests. Projection synchronization and the pinned Agent Skills reference validator passed. Cached skills CLI 1.7.4 listed no released skills at the root (expected exit 1) and exactly one skill at the explicit internal candidate path. agnix reported the known AS-016 incompatibility and VER-001 unpinned-client-version information; it was not a clean scan. No real model or actual client lifecycle was tested.
