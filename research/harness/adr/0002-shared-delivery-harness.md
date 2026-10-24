---
status: accepted
---

# Use one executable delivery harness behind thin client adapters

Status: accepted. Date: 2026-10-24 (UTC). Decision authority: repository owner delegated implementation of a multi-agent shared harness in this conversation. Remote access policy changes are outside this decision.

## Context

The [source-of-truth decision](./0001-repository-sources-of-truth.md) defines authoritative artifacts and the skill lifecycle. The [engineering research](../skill-repository/engineering-baseline-2026-10-25.md) recommends executable checks, thin client adapters and a separate integration boundary. Existing Node.js/Promptfoo tooling already supports local and three-platform CI execution.

## Decision

Use Node.js 24 and Git for a shared deterministic gate in root `harness/`. `package.json` owns executable commands. Enforce repository-specific package, reference, structured-data and projection constraints with regression-tested code. Preserve separate model and host-integration evaluation.

Use one fast checker behind Codex/Claude Stop adapters, with a bounded repair opportunity. Keep optional Git pre-push integration and CI calling the same full gate. Introduce pinned agnix as an optional advisory dependency; do not make platform-binary installation, heuristic diagnostics or the known CLI metadata extension block the core workflow.

Document coordination and handoff in the project guide. Use disjoint write scopes or worktrees for parallel work and one final integrator. Do not require multiple roles for small work or create a second mutable catalog. CODEOWNERS provides review routing; the owner separately configures remote enforcement and independent identities.

## Considered Options

- Client-specific rule/check implementations: rejected because they drift and do not serve other agents.
- Mandatory model/scanner execution for every change: deferred because it introduces credentials, quota, nondeterminism and unnecessary runtimes.
- Hooks as a hard security perimeter: rejected because client support, trust and failure behavior vary, and the agent can edit project configuration.
- A new full orchestration framework: rejected for the present scope; it adds task state and operational cost without improving these deterministic contracts.

## Consequences

The shared gate is reproducible offline after dependency installation and can inspect uncommitted new work. Policy changes require tests and review. Source-of-truth semantics, research quality and skill effectiveness still need judgment. Local checks and a workflow file do not prove remote protection, real client event execution or cross-platform success. The [operating guide](../../../docs/HARNESS.md) owns implementation coverage and activation instructions.
