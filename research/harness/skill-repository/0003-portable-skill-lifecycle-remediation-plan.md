# Research: Close lifecycle evidence gaps before stable publication

Date: 2026-11-06. Question: how should this project close the [lifecycle gaps](./0002-skill-lifecycle-needs-verifiable-release-boundaries.md) and provide a reusable SOP? Context: the owner authorized project remediation planning followed by a platform-neutral standard in knowledge. Status: implementation plan, not evidence that the proposed controls work. Inspection baseline: `1d98ca3`; no live skill evaluation, installation, audit or recovery was executed.

Conclusion: [inference] retain the existing stages and tools. Implement the missing release boundaries before the first stable publication; use recorded manual evidence where automation is unnecessary. Separate the [portable standard](../../../knowledge/skill-lifecycle/README.md) from this project's paths, commands and publication adapter. A validated checklist proves its structure, not the truth of evidence or human approval.

## Overview and sequence

P0 blocks the affected stable release. Conditional P0 applies only when the package has that capability. P1 establishes continuing consumer support. The packages below are proposed work, not newly implemented gates.

| Work package                         | Priority                                    | Dependency                   | Present coverage                                                | Completion evidence                                                                         |
| ------------------------------------ | ------------------------------------------- | ---------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| WP1: Artifact identity and promotion | P0                                          | Declared publication adapter | Source/snapshot policy; uniqueness and discovery checks         | Deterministic export, verified pair, staged acceptance and unchanged approved promotion     |
| WP2: Capability-sensitive security   | P0                                          | Package capability inventory | Host permissions; advisory script/dependency scanning           | Reviewed capabilities, complete change coverage and safe denied-permission trials           |
| WP3: Credible evaluation records     | P0                                          | Declared support environment | Shared Promptfoo runner, regressions and grader counterexamples | Resolved run identity, isolation, calibrated grading and honest outcome classification      |
| WP4: State and recovery              | Conditional P0                              | WP1, capability inventory    | Skill-specific profile schemas and preservation instructions    | Safe upgrade/recovery against representative existing state                                 |
| WP5: Consumer lifecycle and support  | P1; install acceptance before release       | WP1; WP4 where applicable    | Trial guides and installation requirements                      | Actual consumer smoke, verified update/pin/recovery instructions and version-aware feedback |
| WP6: Dependencies and redistribution | Conditional P0 before affected distribution | Export inventory             | License/provenance rules; known icon-rights questions           | Applicable rights/notices and reviewed runtime dependencies                                 |

Work in parallel only across disjoint files. Settle WP1's adapter/evidence design first; WP2, WP3 and WP6 can proceed independently. Complete WP4 and WP5 against the actual export before stable approval. Keep delivery tasks in GitHub issues when authorized, not in duplicated README progress logs.

Use the [portable checklist IDs](../../../knowledge/skill-lifecycle/checklist.yaml) when implementing and recording acceptance:

| Work package | Primary checklist items                                                                     |
| ------------ | ------------------------------------------------------------------------------------------- |
| WP1          | `freeze-provenance`, `platform-audit-binding`, `release-approval`, `stable-promotion-smoke` |
| WP2          | `capability-boundary`, `security-acceptance`                                                |
| WP3          | `evaluation-identity`, `grader-calibration`, `behavior-and-trigger`                         |
| WP4          | `state-compatibility`, `upgrade-recovery`                                                   |
| WP5          | `consumer-smoke`, `feedback-support`, `hotfix-forward-port`, `retirement-notice`            |
| WP6          | `resources-and-rights`, `security-acceptance`                                               |

## WP1: Bind acceptance to the distributed artifact

[measured] [ADR 0004](../adr/0004-versioned-skill-maintenance.md) adopts one authoring source plus generated publication snapshots. The [structure contract](../../../docs/REPOSITORY-STRUCTURE.md#package-progression) explicitly says generation and provenance-aware pairing do not exist yet. Existing uniqueness checks must remain intact until their replacement verifies the permitted pair.

[official] The inspected skills CLI audit client sends repository source and skill names, not a revision or digest. Its response shape does not establish artifact identity, and missing results do not block installation. Backend provenance remains unknown. [S1]

Implementation and acceptance:

1. Define the export inventory and declared transformations, including removal of the candidate-only internal marker.
2. Generate from an explicit source commit. Record the output inventory and content digest using a defined, repeatable method.
3. Test reproducibility, forbidden runtime dependencies, unexpected transformations, stale pairs and discovery selecting the wrong copy.
4. Keep unapproved snapshots outside default stable discovery. Use an explicit opt-in staging/ref path where needed.
5. Establish how required audit evidence identifies the exported bytes. Record scope, date, verdict and correspondence; a repository-level table alone is insufficient.
6. Bind human approval to that artifact. Verify promotion and a subsequent consumer install preserve it. Changed bytes invalidate prior acceptance.

This project's selected default skills.sh adapter still requires its matching audit. If verifiable binding cannot be obtained, record the release blocked; do not silently substitute a local scanner. Adapter selection is an owner decision, not a way for an agent to clear a failed gate. No `skills audit` command is assumed.

## WP2: Review capabilities across the complete package

[measured] The [security workflow](../../../.github/workflows/skill-security.yml) is advisory and triggers on scripts, development dependencies and scanner configuration, not authored instruction/resource-only changes. [official] Microsoft recommends reviewing all skill content and enforcing sensitive-operation limits in the host. [S2]

Record necessary reads, writes, persistence, network destinations, credentials and consequential actions; use "none" when accurate. Extend affected-package selection to instructions and resources without claiming a clean scanner result proves safety. Preserve the existing byte-pinned false-positive review mechanism.

Acceptance: an instruction-only change selects the affected review; disposable malformed-input, untrusted-content and permission-denied cases demonstrate safe behavior. Include retry/idempotency evidence where external actions occur. Record actual observations separately from proposed actions. Human review can supply semantic acceptance; scanners cannot authorize data disclosure or destructive effects.

## WP3: Make comparisons reproducible and graders accountable

[measured] [The runner](../../../evals/run.mjs) records runtime and suite hashes, but suite-provided agent runs can retain null model/parameters. The [evaluation guide](../../../docs/prompt-evaluation.md#skill-trigger-and-version-comparison) documents global-skill influence and heuristic activation detection. Existing regression and judge-counterexample tests are useful foundations, not absent infrastructure.

[official] Agent Skills guidance supports clean-context old/new or no-skill comparisons, inspection of actual artifacts and mechanical checks complemented by human review. [S3]

Extend the shared runner, not a skill-specific framework. Capture package, case and rubric identities; resolved client/model/settings; tool availability; cache provenance; and sanitized artifact/trace references. Record unavailable identity as unknown, not a reproducible run. Separate behavioral failure, infrastructure failure and inconclusive evidence; retain attempts rather than retry-selecting successes.

Acceptance: known-good and deliberately wrong outputs exercise graders; important disagreements receive human review. Matched old/new runs and held-out cases supply behavioral evidence. Fresh repeats and tool executions stay uncached; eligible cached prompt regressions run first. A manual clean-session record is valid while scenario orchestration is unfinished, but synthetic replay alone cannot satisfy behavior acceptance.

## WP4: Recover state as well as package files

[measured] [Meta Thinking memory](../../../incubator/meta-thinking/candidate/meta-thinking/references/memory.md) and [Tech Humanizer profiles](../../../incubator/tech-humanizer/candidate/tech-humanizer/references/profile.md) persist outside installed packages. [official] Microsoft's recovery guidance distinguishes restoring code from handling state changes. [S4]

For affected skills, declare supported schemas and migration/downgrade behavior. Exercise old data, malformed/unsupported versions, unrelated-field preservation, interrupted writes and recovery after a package restore. Use synthetic data and a documented backup/reconciliation path; never silently downgrade or erase user state. Acceptance includes observing the resulting files, not only a model's intended writes. Mark stateless cases not applicable with a reason. Do not build a generic migration engine unless real reuse justifies it.

## WP5: Verify the consumer path and maintain feedback

Declare the supported client/model/OS/tool/network combinations; repository CI coverage alone is not skill compatibility evidence. Check fresh install → discovery → activation → resource access → meaningful output in an ordinary isolated consumer workspace. Include stale/shadowed copies and unavailable dependencies where relevant. Verify actual update, pin and prior-version recovery syntax with the selected adapter.

Acceptance: the installed identity matches WP1; first-use instructions work; one post-promotion smoke is recorded. Feedback requests installed revision, environment, sanitized reproduction and expected/actual results. Name responsibility for material environment changes, unsafe-version notices and retirement guidance. Explain that removing a default publication cannot recall local copies. Existing issues and concise release notes suffice; no hosted telemetry or service-level machinery is required. [inference]

## WP6: Resolve rights and runtime dependency assumptions

[measured] The [Architecture Diagram handoff](../../../incubator/architecture-diagram/HANDOFF.md) already identifies unresolved icon redistribution terms. [official] GitHub's licensing guidance does not equate public visibility with general reuse permission. [S5]

Inventory bundled third-party content and runtime fetches. Retain source/version, applicable terms, required notices and relevant integrity/network assumptions. Resolve unclear rights, replace the material or exclude it before affected distribution. A package license field does not settle every embedded asset's rights. Acceptance is an export inventory with evidence for applicable obligations, not an agent's legal assurance or a clean static scan. Seek qualified clarification when necessary.

## Scope, unverified items and confidence

The portable SOP owns reusable procedure and checklist semantics. Project docs map it to actual commands, paths, gates and implementation status. Do not copy this remediation backlog into the portable bundle. Record project-profile selection and meaningful policy changes once, then link them from agent startup instructions.

Not verified: audit backend artifact binding; export/promotion tooling; end-to-end consumer install/update/recovery; state migrations; any new skill behavior or remote CI result. These require implementation or actual execution, not further prose. Required unavailable checks remain blocked or inconclusive, never pass or not applicable merely because the tool is missing.

Owner decisions arise when selecting a publication/support policy, accepting a changed behavioral baseline or authorizing exact-artifact promotion. The agent can prepare evidence and recommend scope; it cannot fabricate those approvals. No external write, platform change or skill release is authorized by this plan.

Confidence in remediation priorities: high, 3.5 (owner 1, primary research 1, reasoning 1, local history 0.5). Confidence in a working adapter/promotion implementation: low, 2.0 (owner 0.5, research 0.5, reasoning 1, execution history 0). The latter remains a design to verify, not an operational capability.

## Sources opened

- [S1: skills CLI audit client](https://github.com/vercel-labs/skills/blob/d3701c11b1101251af14c9d148f026e1a47ebe17/src/telemetry.ts): request/response identity and advisory failure behavior.
- [S2: Microsoft Agent Framework skills](https://learn.microsoft.com/en-us/agent-framework/agents/skills): complete-content review, host permission boundaries and consequential side effects.
- [S3: Agent Skills output evaluation](https://agentskills.io/skill-creation/evaluating-skills): clean comparisons, concrete evidence and mechanical/human grading.
- [S4: Microsoft safe deployments](https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/safe-deployments): state-aware recovery and controlled exposure; no adoption of its cloud rollout machinery is proposed.
- [S5: GitHub licensing guidance](https://choosealicense.com/no-permission/): public hosting does not establish unrestricted reuse rights.
