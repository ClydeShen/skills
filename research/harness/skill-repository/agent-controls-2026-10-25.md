# Research: Delivery controls for Codex and Claude

Date: 2026-10-25. Question: how can a skill repository use client configuration, hooks, permissions, and isolation to constrain delivery agents? Context: the repository already had AGENTS.md, CLAUDE.md, and evaluation commands. Operating guidance, immediate feedback, and actual execution boundaries needed to be distinguished.

Recommendation at the time: [inference] share one set of repository check commands behind thin Codex and Claude adapters. Hooks provide early feedback and limited interception; writable configuration, client differences, and cloud execution paths affect their effectiveness. Stronger restrictions require host-managed permissions and isolation, with integration requirements enforced on a protected server. This research round did not install hooks or change permissions.

Markers: `[official]` identifies relevant official documentation that was read; `[measured]` records command observations from the original research round; `[inference]` identifies project recommendations. Upstream support does not establish activation in the current session. Translation and source review do not rerun historical client or platform tests.

## Overview

| Question | Recommendation | Evidence and limits | Confidence |
| --- | --- | --- | --- |
| How should instructions be shared? | Keep AGENTS.md authoritative; use CLAUDE.md for imports and accurate command entry points | The repository already imported it, but tooling descriptions were stale | Medium, J1 |
| Can the clients share one hook configuration? | Share a Node checker, with separate configuration and event-result adapters | Similar events do not imply identical control semantics or loading scope | Medium, J2 |
| Can edits to checks and credential reads be restricted? | Combine file-tool rules, OS isolation, and host-managed policy | Text instructions and tool-level deny rules do not cover all indirect IO | Medium, J3 |
| How can agents be prevented from changing their own rules? | Place important boundaries on a host or server they cannot modify | Project overrides and trust mechanisms have explicit limits | Medium, J3 |

## 1. Observations in this repository

### Evidence

[measured] During the original research, `CLAUDE.md` imported shared instructions through `@AGENTS.md`, but still said the repository had no build, lint, or test tooling. `package.json` already contained npm test, Promptfoo fixture, and model commands, so that statement had drifted from the repository.

[measured] The environment reported `codex --version` as `0.163.0`. `codex --help` included sandbox, approval, strict-config, and hook-trust options. No Claude executable was found, and no real client hook was run.

### Recommendation for the project

[inference · J1] First correct documentation drift during implementation and give all checks a stable entry point, such as a future `npm run check`. Client hooks, Git hooks, and CI should call that entry point rather than maintain separate rules. The original research changed neither code nor instructions.

### Relation to existing constraints

This follows the repository's single-authority rule, cross-platform command requirements, and research → knowledge → incubator lifecycle.

## 2. Codex: project defaults, rules, and hooks

### Evidence

[official] `.codex/config.toml` is a configuration layer for trusted projects; CLI arguments take precedence. Administrator `requirements.toml` restricts allowed choices rather than merely supplying defaults. Untrusted projects do not load project configuration.[S1][S4]

[official] Codex loads `.rules` from the `rules/` directories of active configuration layers. `prefix_rule` constrains command prefixes, with `forbidden`, `prompt`, and `allow` in descending strictness. `allow` can permit matching commands outside the sandbox without prompting; it is not merely a shortcut list.[S2]

[official] The documentation read in this research supported `.codex/hooks.json` or inline `[hooks]`, including PreToolUse, PostToolUse, and Stop. Project hooks and changed hook definitions require trust. Tool coverage has exceptions, and command hooks have cloud-orchestration compatibility limits. Official guidance presents them as guardrails, not a complete boundary.[S3]

### Recommendation for the project

[inference · J2] A pre-tool hook can check obvious scope violations; a post-tool hook can run fast checks on changed files; a Stop hook can check the final state. They should call shared code but adapt JSON input, tool-name matching, exit status, and continuation separately. A check at the end of a turn cannot prevent an external write that already occurred.

[inference] Verify the supported version and trust state before implementation. Test command failure, timeout, invalid JSON, cancellation, and repeated triggering separately. A loaded hook does not establish interception of every action. The Codex documentation read at the time allowed `commandWindows` as a Windows command override for a thin adapter.[S3]

### Relation to existing constraints

The host controls execution policy in this managed cloud environment. Committing `.codex/` files provides configuration; it does not prove that this cloud path, another app-server, or Work Cloud orchestration uses it. Check effective scope on the target host.

## 3. Claude: settings, events, and failure policy

### Evidence

[official] `.claude/settings.json` contains shareable project settings; `.claude/settings.local.json` is the personal project layer. Project, user, and managed settings have different precedence.[S5]

[official] PreToolUse can block a tool before execution; PostToolUse supplies feedback afterward; Stop can make the agent continue. The command-hook documentation supports exec-form `command` and `args`. Startup errors, timeouts, or invalid output do not necessarily block actions. `onFailure: block` changes this for supported versions and events, but Stop does not support this failure-blocking mode. The documentation specifies v2.1.295 or later for that field.[S6]

### Recommendation for the project

[inference · J2] If the first implementation targets the repository's existing Node.js 24 baseline, invoke Node directly in exec form to reduce Bash and PowerShell quoting differences. Keep output JSON and event semantics in thin client adapters. Share the core checker, not the Codex hook configuration itself.

[inference] A Stop check must handle repeated triggering so it cannot create an endless continuation loop. Static failures should identify files and corrective actions. If prerequisite tools cannot start, report the problem instead of claiming repository verification passed.

### Relation to existing constraints

Do not run full model evaluation after every PostToolUse event. Formatting and package checks can supply immediate feedback; expensive evaluations or external calls remain explicit workflows.

## 4. The scope of tool rules and sandboxes

### Evidence

[official] Claude Read/Edit deny rules cover built-in file tools and some recognizable shell IO, but not arbitrary indirect file access from Python or Node scripts. Rules such as `Write(path)` are not valid substitutes. Official guidance requires the appropriate Read/Edit rules and explains the role of OS isolation.[S7]

[official] Claude's shell sandbox is available on macOS, Linux, and WSL2, not native Windows. It surrounds shell commands and their child processes; file tools, MCP, and hooks run outside it. Strict mode and exit-on-unavailability settings determine whether execution can fall back to an unsandboxed path.[S8]

[official] Codex documentation describes distinct isolation implementations for macOS, Linux, native Windows, and WSL2. The managed-configuration guidance read at the time recommended permission profiles for new clients. Administrator requirements can constrain defaults and CLI overrides. Read-only access does not itself hide credential contents.[S4][S9]

### Recommendation for the project

[inference · J3] Do not claim a project deny rule protects all reads and writes. Restricting credential access, harness edits, workspace escapes, or network egress requires checking file-tool permissions, shell child-process isolation, MCP and plugins, and inherited environment variables. Policies protecting check configuration and credentials should live in a host or managed layer the agent cannot edit.

[inference] Share Node check code across Windows, macOS, WSL, and cloud, but verify isolation separately. For Claude on native Windows, OS-level shell isolation requires WSL2 or an explicitly configured outer restricted environment. A container does not automatically establish the intended network, credential, or mount boundaries; those need separate design.

### Relation to existing constraints

Cross-platform tooling does not imply identical security implementations. Repository feedback can be shared; execution restrictions depend on the host.

## 5. Suggested minimum implementation order

[inference] The first increment needs only the shared check entry point, accurate agent guidance, and two optional hook adapters. Verify fast checks and Stop checks first. If shell or file-access restrictions are needed, add explicit permission and sandbox presets in a second increment and test both enforcement and failure paths.

[inference] To stop a delivery agent from unilaterally removing integration requirements, use required server checks and code-owner review with a separate restricted agent identity that has no bypass. If the agent uses owner or administrator bypass privileges, editable files in the same repository cannot reliably constrain it. Enabling these repository rules requires a separate owner decision.

## Judgment confidence

J1–J3 had medium confidence, 3.0: Owner 1 (request to research control tools), Research 1 (official mechanisms and boundaries), Reasoning 0.5 (the combination still needed implementation), Project history 0.5 (existing instructions and checks, no live hook test). These scores are not security guarantees.

## Not verified

- The original research installed or enabled no project, user, or managed settings, and changed no agent permissions.
- It ran no Codex or Claude hooks and performed no Windows, macOS, or WSL tests.
- It did not inspect actual GitHub branch protection, rulesets, CODEOWNERS, or token permissions. This note makes no claim that those controls were present or absent remotely.
- It was a targeted reading of official documentation on the recorded date. The local Codex version was measured; the Claude version and host support for new fields still needed implementation-time checks.
- At the time, `developers.openai.com/codex/security/` redirected to the Codex Security product page. Sandbox evidence came from Agent approvals & security, not that old entry point.

## Decisions for the owner

No immediate permission change was required. Implementation needed a choice of control strength: collaboration guidance and quality feedback, or host and server boundaries the agent cannot bypass. The latter involves credential roles and administrator configuration.

## Sources

- [S1 — Codex Config basics](https://learn.chatgpt.com/docs/config-file/config-basic): project layers, trust, and precedence.
- [S2 — Codex Rules](https://learn.chatgpt.com/docs/agent-configuration/rules): command prefixes, strictness, and the out-of-sandbox meaning of allow.
- [S3 — Codex Hooks](https://learn.chatgpt.com/docs/hooks): configuration locations, tool coverage, trust, events, Windows overrides, and cloud differences.
- [S4 — Codex Managed configuration](https://learn.chatgpt.com/docs/enterprise/managed-configuration): requirements versus defaults, permission profiles, and cloud scope.
- [S5 — Claude settings files](https://code.claude.com/docs/en/settings): project, personal, and managed scopes.
- [S6 — Claude Hooks reference](https://code.claude.com/docs/en/hooks): events, exec form, onFailure support, and failure semantics.
- [S7 — Claude permissions](https://code.claude.com/docs/en/permissions): path-rule syntax and indirect-IO coverage limits.
- [S8 — Claude sandboxing](https://code.claude.com/docs/en/sandboxing): platforms, scope, strict mode, and default access.
- [S9 — Codex Agent approvals & security](https://learn.chatgpt.com/docs/agent-approvals-security): permissions, sandbox configuration, and platform implementations.
