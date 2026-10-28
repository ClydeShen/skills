# Research: Engineering controls and delivery harness for the skill repository

Date: 2026-10-25. Question: Which engineering configuration can standardize this repository's artifacts and constrain delivery agents such as Codex and Claude? Context: the repository already has a lifecycle, knowledge and candidate packages, Promptfoo, and three-platform CI; existing rules need executable checks.

Conclusion: [inference] Use a small set of repeatable checks as the shared foundation, with separate integration into agent hooks, local Git hooks, and protected CI. Implement a shared `npm run check`, skill package checks, and agnix reporting first, then client adapters and remote merge controls. Instruction files, linters, hooks, sandboxes, and server rules have different roles and do not replace one another. This investigation only researched the options; it installed no tools and changed no permissions, hooks, CI, or branch rules.

Evidence markers: `[measured]` means a read-only repository check during the original investigation; `[official]` means first-party documentation was read; `[inference]` means a recommendation. The observations below preserve that investigation's state, not a new report of the current repository. Detailed tool and client sources and limitations are in the [quality-tool study](./skill-quality-tools-2026-10-25.md) and [runtime-control study](./agent-controls-2026-10-25.md).

## Overview

| Problem | Minimal recommendation | Enforcement strength and limits |
| --- | --- | --- |
| Incorrect instructions or skill formats | agnix, the reference validator, and package-reference checks | Check encoded rules; cannot prove semantic quality |
| Repository rules are overlooked | One deterministic check entry point called by all layers | Local calls can be skipped; CI blocks merges only when the server is configured |
| An agent ends after failed checks | Feedback through a supported client completion hook | Event, trust, version, and failure semantics differ; hooks do not replace a sandbox |
| An agent changes out-of-scope files or accesses the network | Effective host permissions, OS sandboxing, and credential scope | Verify the actual tool paths covered, not only configuration text |
| An agent changes checks to pass its own work | Protected check configuration, human review, and identities without bypass | Rule administrators or bypass identities may still circumvent controls |
| A skill provides actual value | Behavioral cases and a no-skill comparison | Fixture success does not establish effectiveness |

## 1. Concrete repository gaps at the time of investigation

### Evidence

[measured] `CLAUDE.md` imported `AGENTS.md` but still said that no build, lint, or test tooling existed. In fact, `package.json` already had `npm test`, transport checks, fixtures, and real-model evaluation commands. This established documentation drift, not evidence that an agent had already behaved incorrectly.

[measured] `.github/workflows/prompt-evaluation.yml` configured installation and existing tests on three platforms, but no automated checks for skill format, package dependencies, Markdown references, lifecycle rules, or agent-configuration lint.

[measured] The workspace had no `.agnix.toml`, unified `check` script, Lefthook configuration, or project-specific Codex/Claude hook adapters. No local CODEOWNERS file was found. Actual GitHub rulesets, permissions, and administrator bypass settings were not read, so remote protection status was not determined.

[measured] Existing files in `.agents/skills/` and `.claude/skills/` compared equal. These were imported tools for different clients and should not be reported as duplicate released packages. At that point, `skills/` contained no released packages and the Meta Thinking candidate was in `incubator/`.

### Recommendation for the project

[inference] First align operating instructions with actual scripts. Keep `AGENTS.md` as the shared rule source and use `CLAUDE.md` mainly for imports and client-specific differences. Avoid complete, independently maintained rule sets that drift between clients.

### Relation to existing constraints

This follows the lifecycle and the [guardrails standard](../../../knowledge/harness/guardrails-standard.md): maintain a rule once and repeat its check at outer boundaries. It does not require rebuilding the existing harness knowledge base.

## 2. Minimal checks for skill artifacts

### Evidence

[official] Agent Skills authoring guidance emphasizes domain knowledge, iteration from execution feedback, appropriate content volume, and on-demand loading. It distinguishes output quality from description-trigger optimization. Not every recommendation can be mechanically checked.[S1]

Official tool sources, installation details, and limits are in the [quality-tool study](./skill-quality-tools-2026-10-25.md). The reference validator is a format reference implementation, not proof of safety or behavior. agnix checks multi-client configurations. Cisco Skill Scanner can assist risk detection, but findings still need review.

### Recommendation for the project

[inference] `npm run check` should combine deterministic checks with separate responsibilities instead of asking one linter to cover everything:

| Check | Applicable repository rules |
| --- | --- |
| Skill format | Frontmatter, directory-name agreement, description, and field compatibility |
| Package boundaries | Local reference targets exist; runtime resources stay in the package and do not depend on external knowledge, research, or incubator paths |
| Discovery and lifecycle | Released names are unique; candidates are not mistaken for releases; imported tools have their own scope |
| Repository consistency | Documentation links, JSON/YAML/schema, and instructions agree with actual scripts |
| Agent configuration | Run agnix for the actual target clients and file scopes |
| Evaluation infrastructure | Existing `npm test` and fixture pipeline; label real-model results separately as behavioral evidence |

[inference] Initially report or warn about body size, description generality, and reference-depth heuristics. Missing fields, broken references, and clear out-of-package dependencies can block. Do not make every tool rule fatal or enable automatic fixes in CI.

[inference] Compare with and without the skill using the same model, cases, and budget, and inspect execution traces. False triggers, timely exit, and actual profile reads and writes require host verification; structured prompt checks do not replace it.[S1]

### Relation to existing constraints

Runtime packages remain self-contained. Implementations, cases, and gates belong to concrete engineering work; agree on the initial errors and warnings before implementation.

## 3. From fast feedback to an effective delivery gate

### Evidence

[official] Lefthook documentation describes installing configuration into Git hooks that invoke tasks. Official installation options include npm, winget, and Homebrew. This investigation confirmed the mechanism but did not install it or test platform compatibility.[S2]

[official] GitHub CODEOWNERS defines review ownership and affects merges when combined with required review. Rulesets provide required pull requests, checks, and bypass settings. Checks can be bound to an expected GitHub App. Principals with bypass permissions may still bypass the corresponding rules.[S3–S5]

### Recommendation for the project

[inference] A Git hook manager need not be added initially. After establishing the shared check entry point, Lefthook can be considered as a cross-platform convenience layer: lightweight pre-commit checks and the full gate on pre-push. Agent hooks should call the same command rather than copy grading or validation logic.

[inference] Adapt Claude and Codex configuration to their actual client capabilities. Completion hooks can report incomplete verification, but must handle repeated events, timeouts, and failures. Hooks need a fast, repeatable execution path; even free model inference should not become a mandatory check on every completion or commit. Client details are in the [runtime-control study](./agent-controls-2026-10-25.md).

[inference] When delivery restrictions are needed, configure required pull requests, required checks, necessary reviews, and force-push prevention for `main`. Assign review ownership for `.github/`, agent configuration, checkers, evaluation assertions, dependencies, and CODEOWNERS itself. CI that runs only after a push does not establish that failing commits cannot enter main.

[inference] Running an agent with the owner's administrator identity or bypass credentials weakens server controls. CODEOWNERS cannot turn self-review under the same GitHub identity into independent review. Stronger separation requires restricted agent identities and credentials, with rule management or final confirmation on an independent trusted path. This recommendation changes remote collaboration and did not alter the direct-push workflow during the investigation.

### Relation to existing constraints

Reuse the existing three-platform CI without a large orchestration platform. Remote rules are server configuration; adding repository files alone does not activate them.

## 4. Recommended implementation order

[inference] First, correct documentation drift, add the shared gate and package-boundary validation, pin agnix in report-only mode, and extend existing CI to call the same entry point. Use actual reports to distinguish tool-compatibility rules from useful quality gates.

[inference] Second, add necessary client and local Git hooks and test both allowed and rejected behavior. Record effective controls separately for Windows, WSL, macOS, and managed cloud environments. Do not assume local client configuration automatically controls hosted orchestration.

[inference] When restricting autonomous delivery, configure and verify server rules, review identities, and permission bypass. If checks need stronger protection, their trusted source must be independent of the branch being checked. Passing a check defined in the working branch does not establish that its rules were unchanged.

[inference] Add Cisco Skill Scanner, third-party package supply-chain checks, and secret scanning in proportion to the risk of imported skills or added permissions. Start with local static reports; this repository does not require an additional LLM judge, cloud scanning service, or large multi-agent orchestration by default.

## Judgment confidence

The layered-check and protected-delivery recommendation has medium confidence, 3.0: Owner 0.5 (research authorized, specific configuration not yet accepted); Research 1 (official mechanisms); Reasoning 1; Project history 0.5 (existing rules and evaluation, without tool trials). The score is not a probability of security or effectiveness.

## Not verified

- agnix, Lefthook, and Skill Scanner were not installed or run against the repository during this investigation; no false-positive baseline was established.
- Codex/Claude hooks and sandbox rejection behavior were not tested.
- Remote protection, actual CI results, repository plan, and agent identity permissions were not verified.
- The investigation did not change operating rules, install configuration, commit, or push.

## Decisions for the owner

No immediate decision was required. The first local configuration proposal could be prepared before implementation. How a server gate should change direct pushing depends on the desired delivery workflow.

## Sources

- [S1 — Agent Skills authoring best practices](https://agentskills.io/skill-creation/best-practices): execution-feedback iteration, content, and control granularity.
- [S2 — Lefthook documentation](https://lefthook.dev/): Git hook installation mechanisms and installation options.
- [S3 — GitHub CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners): review ownership and required review.
- [S4 — Available GitHub ruleset rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets): required pull requests, checks, and bypass.
- [S5 — GitHub protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches): check sources, review, and bypass limits.

Related studies: [skill quality tools](./skill-quality-tools-2026-10-25.md) and [agent runtime controls](./agent-controls-2026-10-25.md). Earlier background is in the [runtime and extension supply-chain study](../agent-driven-delivery/agent-runtime-security-and-extension-supply-chain-2026-10-18.md); client mechanisms reflect the verification performed for this investigation.
