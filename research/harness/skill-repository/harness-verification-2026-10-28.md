# Research: observed verification of the shared harness

Date: 2026-10-28 (last entry). Subject: what the shared engineering harness was observed to do on real hosts. Context: [`docs/HARNESS.md`](../../../docs/HARNESS.md) states the current rules and coverage. This note keeps the dated observations that support them. Entries are frozen measurements; later runs add entries and do not rewrite earlier ones.

Confidence markers follow the [research template](../../../knowledge/harness/templates/research-note-template.md): every result below is **[measured]** on its stated date.

## Observed results

Local Linux verification on 2026-10-24 uses synthetic fixtures, no real profile or model key. The regression tests exercise valid/invalid package metadata, duplicate sources, links/anchors/case, package escapes, projection drift, schema errors, ignored credentials, symlinks where supported, Stop success/failure/repeat/error paths, malformed input, and the actual Codex bootstrap from a subdirectory. These adapter tests are protocol/command checks, not real client event delivery. Subsequent Windows/macOS CI evidence is recorded below; WSL-specific execution, actual client loading and protected integration still need host-side verification.

Observed results: clean `npm ci` succeeded with the proxy setting above; `npm run check` passed (22 unit/regression tests, including the framework filename convention, and 42/42 synthetic replay assertions); `test:transport` passed for generic and NVIDIA loopback requests. Projection synchronization and the pinned Agent Skills reference validator passed. Cached skills CLI 1.7.4 listed no released skills at the root (expected exit 1) and exactly one skill at the explicit internal candidate path. agnix reported the known AS-016 incompatibility and VER-001 unpinned-client-version information; it was not a clean scan. No real model or actual client lifecycle was tested.

Remote run for `6250662` passed Ubuntu and Windows but failed the macOS relocated-hook test: `argv` retained a temporary-directory alias while Node resolved the module URL to its physical path, causing the CLI entrypoint to emit no JSON. The repair compares physical paths and adds an explicit directory-alias regression, including spaces and `--preserve-symlinks-main`. This changes invocation handling, not package-resource symlink policy. Local repair verification on 2026-10-25 passed 24 unit/regression tests, 42/42 fixture assertions and both loopback provider requests. The updated remote matrix must be verified before applying branch protection.

Remote repair verification on 2026-10-25: the [PR run for `e53af33`](https://github.com/ClydeShen/skills/actions/runs/40145054674) passed all three platform jobs, including macOS and Windows alias-entrypoint regression tests (24/24 tests, none skipped), fixture replay and transport checks. agnix retained the known non-blocking metadata diagnostic. This verifies the code on those runners; it does not activate the pending server protection or prove actual client hook delivery.

Git strategy verification on 2026-10-28: local setup enabled repository hooks after checking for conflicts. `npm run check` passed 28 regression tests and 42 fixture assertions; loopback transport passed. Git policy tests exercised a real rejected main commit, successful task commits, linked-worktree isolation, conflicting hook setup, detached authoring, CI refs, push destinations, multiple ref updates, ancestry and immutable tags. GitHub CLI requests for repository settings and main protection returned Forbidden, so current server protection could not be refreshed or enabled through that route. The connector reports squash, merge and rebase methods all available; squash is the project default, not an exclusively enabled server method. GitHub automatic head deletion is owner-reported. Client Stop delivery and other clones' local hook setup still require their hosts.

## Server protection

Server protection is optional; its absence is not an outstanding setup blocker. Historically, the last observed branch response was `protected: false`, with an empty ruleset list. The available integration rejected the administration endpoint with HTTP 403; the cloud CLI's GitHub API request was also forbidden. Repository owner/admin role alone does not give the active integration an Administration API scope. Protection was not applied through that session. Do not enable or tighten it during routine authoring; treat that as a separate requested configuration change.

## Not verified

- Actual client delivery of Stop hooks, and other clones' local hook setup.
- Whether Git hooks fire on each cloud host.
- WSL-specific execution and protected integration.
