# Research: Quality tools and engineering checks for the skill repository

Date: 2026-10-25. Question: Which engineering tools can standardize this repository's agent skills and provide executable feedback to delivery agents? Context: the repository already had candidates, Promptfoo, and three-platform CI, but needed format, configuration, and release checks. The original investigation researched options only; it did not install tools or change their configuration.

Recommendation: [inference] Build around one repository-wide check command. Trial agnix for skill and agent configuration, add format compatibility, package self-containment, and navigation checks, and continue using existing evaluation. Add security scanning when justified. CI and host permissions enforce different boundaries; a linter is not permission control.

Evidence markers: `[official]` means maintainer documentation or source was read; `[measured]` means a command observation during the original investigation; `[inference]` means a recommendation. No new linter or scanner was run during that investigation. Repository observations and verification status below preserve that historical state rather than reporting the current workspace.

## Overview

| Question | Recommendation | Evidence and limits | Judgment confidence |
| --- | --- | --- | --- |
| Does the skill conform to the format? | Retain skills-ref compatibility checks and add repository constraints | Official reference implementation, explicitly described as a demonstration | Medium, J1 |
| Are multi-agent configurations correct? | Start agnix in reporting mode; block clear errors after tuning noise | Supports skills and multiple tools; does not prove behavior | Medium, J2 |
| Does the skill provide actual value? | Reuse Promptfoo and add with/without comparisons in a real host | Official evaluation guidance; fixtures are insufficient | Medium, J3 |
| Should security scanning be enabled by default? | Use Cisco Skill Scanner as an optional release or third-party import layer | Best-effort coverage, extra runtime, and false-positive costs | Medium, J4 |
| Can an agent change checks and declare success? | Protected branches, required checks, and independent review of check configuration | Server controls must actually be enabled; CODEOWNERS alone is insufficient | Medium, J5 |

## 1. Repository gaps at the time of investigation

### Evidence

[measured] Inspection of `package.json` and `.github/workflows/prompt-evaluation.yml` found existing Node.js tests, loopback transport, and fixture evaluation, but no unified `check`, agent-configuration lint, or package-layout check command.

[measured] `CLAUDE.md` still stated that the repository had no test tooling, contradicting the npm configuration. A `cmp` check found identical content for the two imported skills in `.agents/skills/` and `.claude/skills/`, but they had two maintenance locations.

[inference] Correct documentation drift and provide one check entry point first, then add rules incrementally. Replacing the entire delivery harness is unnecessary.

### Recommendation for the project

A future `npm run check` should call existing tools and a few repository-specific checks, serving local use, CI, and agent completion checks. Initial scope:

- Agent and skill configuration lint, with explicit scan inventories for released and candidate packages.
- SKILL frontmatter, unique names, and agreement between directory and skill names.
- Valid package references, with runtime resources independent of files outside the package in research, knowledge, or incubator.
- Markdown links and JSON/schema checks; existing structured inventories should use their schemas.
- Existing harness tests and fixture smoke checks, explicitly labeled as integration checks.

[inference] Scan candidates and imported tooling skills as distinct categories. The presence of a SKILL.md anywhere in the repository does not make it a released artifact. Keep real-model evaluation explicit to avoid consuming quota or blocking every commit on model variability.

### Relation to existing constraints

This follows AGENTS.md requirements for lifecycle, runtime self-containment, and release verification. Shared repository checks belong to engineering configuration; cases for individual skills remain with their incubation projects.

## 2. agnix: the specialized linter to trial first

### Evidence

[official] The reviewed agnix README offers a CLI, editor integrations, and a GitHub Action. It checks SKILL.md, AGENTS.md, CLAUDE.md, hooks, MCP, and configurations for different agents, with strict mode and cross-tool configuration checks.[S1]

[official] Its `.agnix.toml` configuration selects `tools`, rule categories, severity, path scope, and local exceptions. CI can ignore inline suppressions. These settings need verification against the pinned version.[S2]

[measured] The original `npm view agnix version engines --json` command returned version `0.59.3` and a Node.js requirement of `>=16.0.0`. The tool was neither installed nor executed.

[official] The reviewed npm installer downloads a GitHub release binary during postinstall and verifies SHA-256. Its mapping includes Linux, macOS, and Windows x64. The reviewed source maps Darwin x64 to an ARM binary and attributes this to Rosetta in a comment; that comment is not execution evidence, and compatibility was not tested. Windows ARM64 is absent from the mapping. Upstream CI tests three operating systems. The main-branch package.json and registry versions differed and must not be conflated.[S3][S4][S5]

### Recommendation for the project

[inference · J2] If implemented, pin the npm version and start with `tools = ["codex", "claude-code"]`. Report findings first, then classify them. Use deterministic errors such as invalid fields or formats as gates; keep heuristics about wording or token budgets as warnings initially. Do not enable automatic fixes by default.

[inference] Exceptions need a rule ID, path, and reason. Do not disable rules globally merely to clear a report. Initial evaluation should include example text in existing research documents, preventing recorded bad examples from being treated as executable configuration.

[inference] Initial cloud installation also needs access to GitHub releases; npm registry access alone is insufficient. Windows ARM and Intel Mac behavior need additional verification. Lockfiles and release checksums help but do not eliminate supply-chain review.

### Relation to existing constraints

This can reuse the Node.js tooling entry point without adding another language for routine execution. It validates configuration, not actual agent permissions or compliance with every instruction.

## 3. The appropriate role of skills-ref and authoring best practices

### Evidence

[official] skills-ref provides `validate`, property reading, and prompt-catalog generation. Its README explicitly describes it as a demonstration reference library, not something intended directly for production systems.[S6]

[official] Agent Skills best practices emphasize real domain experience, concise context, reasonable scope, and revision through actual execution.[S7]

[official] Official evaluation guidance recommends comparing the same task with a skill and without it or against an older version, using clean contexts and recording artifacts, elapsed time, and tokens. Anthropic's skill-creator provides related iteration, evaluation, and description-optimization methods.[S8][S9]

### Recommendation for the project

[inference · J1/J3] Retain the adopted reference validator as a format-compatibility smoke check. Encode repository-specific invariants in testable local checks; do not expect the reference library to provide complete release quality assurance.

[inference] Distill authoring guidance into a few reviewable standards: clear activation boundaries, user-task orientation, the minimum necessary steps, package-local resources, and boundary cases. Do not require the complete skill-creator workflow for every small edit.

[inference] Existing Promptfoo evaluation can compare prompt conditions. Natural skill activation, on-demand reference reading, file output, and memory operations still need real-host tests. Continue treating `42/42 fixture` solely as a harness self-check, not as a skill pass rate.

### Relation to existing constraints

This supports the user's preference for lightweight skill bodies. Authoring tools help discover problems but do not replace independent verification or code review.

## 4. Cisco Skill Scanner: an optional security layer

### Evidence

[official] The scanner describes itself as best-effort. It detects injection, exfiltration, and malicious-code patterns, while explicitly acknowledging false positives and false negatives. Its CLI, SARIF output, and reusable CI support reporting; some analyzers and external services are optional.[S10]

[official] The reviewed pyproject requires Python `>=3.11,<3.15`, with YARA-X, file-detection, and AI SDK dependencies. Basic Quick Start scans use core analyzers such as static analysis. Recommended configurations for real-world threat coverage additionally enable an LLM judge, requiring choices about models, added latency, and data flows.[S11][S12]

### Recommendation for the project

[inference · J4] Use it as a reporting layer when importing third-party skills, preparing releases, or running periodic checks. Test installation and noise with synthetic packages first. Do not make every finding blocking before validating diagnostic quality. LLM and cloud analysis require an explicit choice; do not reuse NVIDIA prompt-evaluation credentials by default.

[inference] With few first-party text candidates, the main benefits still come from correct references, self-containment, real behavioral evaluation, and host permissions. A complete security-scanning stack need not run for every documentation edit.

### Relation to existing constraints

New dependencies should provide concrete benefits. Zero scanner findings are not proof of safety and do not justify broader delivery-agent permissions.

## 5. Checks themselves need an independent boundary

### Evidence

[official] GitHub protected branches can require reviews and status checks and control bypass. Administrators may be exempt by default. CODEOWNERS becomes a merge requirement only when combined with settings such as required code-owner reviews.[S13][S14]

### Recommendation for the project

[inference · J5] Require independent review for `AGENTS.md`, `CLAUDE.md`, check scripts, CI, permission configuration, and CODEOWNERS itself. Local hooks and CI should call the same command, with actually enabled server-side gates providing the final merge condition.

[inference] If the agent uses the repository owner's account or bypass credentials, review requirements may not provide independent judgment. Review changes to checks alongside task changes rather than relying only on the modified checks passing. Remote protection settings were not read during this investigation, so it cannot establish whether they were enabled or missing.

### Relation to existing constraints

This supports existing guardrails' layered controls and protection of checks. The research phase does not change remote settings, permissions, or workflows.

## Judgment confidence

J1–J5 are all medium, 3.0: Owner 1 (explicit request for this research), Research 1 (maintainer sources reviewed), Reasoning 0.5 (the combined approach still needs implementation), and Project history 0.5 (existing tools and rules, but no trials of the new approach). This measures support for the recommendations, not a probability of success.

## Not verified

The following limitations describe the original investigation:

- agnix and Cisco Scanner were not installed or run; their diagnostic quality on this repository was not verified.
- New tools were not tested on Windows, macOS, or WSL; architecture and installer findings came from reviewed source only.
- Remote branch protection, rulesets, CODEOWNERS settings, and account bypass permissions were not read.
- Natural skill activation and actual host behavior were not verified. The official skill-creator was a reading source only, not installed or executed.
- `npm run check`, new hooks, permission configuration, and security scanning were not implemented.

## Decisions for the owner

No provider selection or service purchase is needed now. Before implementation, decide which high-impact paths require review by an independent identity and whether an external scanner is acceptable as an initial reporting layer.

## Sources

- [S1 — agnix README](https://raw.githubusercontent.com/agent-sh/agnix/main/README.md): capabilities, CLI, and installation guidance.
- [S2 — agnix configuration reference](https://raw.githubusercontent.com/agent-sh/agnix/main/docs/CONFIGURATION.md): scope, severity, and exceptions.
- [S3 — npm package.json](https://raw.githubusercontent.com/agent-sh/agnix/main/npm/package.json): platform fields and postinstall.
- [S4 — npm installer](https://raw.githubusercontent.com/agent-sh/agnix/main/npm/install.js): binary download, verification, and platform mapping.
- [S5 — agnix CI](https://raw.githubusercontent.com/agent-sh/agnix/main/.github/workflows/ci.yml): three-platform test scope.
- [S6 — skills-ref README](https://raw.githubusercontent.com/agentskills/agentskills/main/skills-ref/README.md): reference-implementation scope and commands.
- [S7 — Best practices](https://agentskills.io/skill-creation/best-practices): domain experience, context, and actual execution.
- [S8 — Evaluating skills](https://agentskills.io/skill-creation/evaluating-skills): isolation, comparisons, and actual artifacts.
- [S9 — Anthropic skill-creator](https://raw.githubusercontent.com/anthropics/skills/main/skills/skill-creator/SKILL.md): author iteration and evaluation methods.
- [S10 — Scanner README](https://raw.githubusercontent.com/cisco-ai-defense/skill-scanner/main/README.md): security scope and explicit limitations.
- [S11 — Scanner pyproject](https://raw.githubusercontent.com/cisco-ai-defense/skill-scanner/main/pyproject.toml): runtime and dependencies.
- [S12 — Scanner Quick Start](https://raw.githubusercontent.com/cisco-ai-defense/skill-scanner/main/docs/getting-started/quick-start.md): core scanning, judge, and CLI.
- [S13 — Protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches): merge requirements and bypass boundaries.
- [S14 — CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners): owner reviews and dependence on settings.
