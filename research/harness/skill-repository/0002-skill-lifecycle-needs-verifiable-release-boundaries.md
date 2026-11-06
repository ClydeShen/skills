# Research: Skill lifecycle needs verifiable release boundaries

Date: 2026-11-06. Question: what important details are missing from concept-to-release and continuing maintenance? Local baseline: `2e6ed80`, including the adopted source/snapshot model. Status: research findings and recommendations, not new operating policy. Scope: primary-source review and read-only inspection; no live agent evaluation, audit, installation or rollback was performed.

Conclusion: [inference] the lifecycle stages are sufficient. The important omissions concern proof at boundaries: whether the evaluated, audited and installed bytes match; when a pending release becomes exposed; what a skill may change; whether evaluation evidence is trustworthy; and what recovery means for consumers and their data. Extend acceptance at these boundaries rather than adding more lifecycle stages or enterprise release machinery.

## Prioritized findings

P0 means resolve before the affected stable release; conditional P0 applies only when that capability exists. P1 means establish the lightweight operation before expecting continuing external use. These are recommendations, not newly enforced gates.

| Priority            | Boundary needing detail                                               | Current coverage and remaining gap                                                                                                                                                                                                                 |
| ------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0                  | Tested/audited content becomes the default distribution               | Provenance and matching audits are required; snapshot tooling is a known implementation gap. Audit-to-revision proof and exposure while audit is pending remain unresolved design details.                                                         |
| P0                  | Skill instructions acquire runtime authority                          | Host permissions and safe scripting are documented. Package-specific data flows, side effects and adversarial/denied-permission acceptance are incomplete; prompt/resource-only changes do not automatically trigger the security-report workflow. |
| P0                  | Evaluation results become release evidence                            | Promptfoo, baseline comparison and several evaluator counterexamples exist. Clean scenario execution, resolved client/model identity, grader calibration and inconclusive-result handling are incomplete.                                          |
| Conditional P0      | An upgrade or rollback touches persistent state                       | Profiles already have schemas and some preservation safeguards. Generic release acceptance does not explicitly require migration/downgrade and recovery evidence.                                                                                  |
| P1                  | Installed users receive updates and recovery instructions             | Discovery/isolated installation is required. Supported-client claims, full activation smoke, update/rollback exercises and post-release withdrawal communication need explicit coverage.                                                           |
| P0 where applicable | Runtime dependencies and bundled material can be redistributed safely | License/provenance requirements exist. Dependency behavior and individual artwork attribution/redistribution evidence must still be resolved for the actual package.                                                                               |

## 1. Audit status is not yet immutable package evidence

[official] At skills CLI commit `d3701c11b1101251af14c9d148f026e1a47ebe17`, `fetchAuditData` sends only repository `source` and skill names; its response type contains risk, alerts, score and analysis date, not a revision/digest. Errors, timeouts and telemetry opt-out return no result without blocking installation. `add.ts` treats the table as advisory. [S1][S2]

[measured] Read-only inspection of the cached `skills@1.7.4` package found the same request shape and advisory behavior. This is source inspection, not a network audit result. The backend may have additional provenance; the inspected client does not establish its binding to a requested tag, commit or transformed snapshot.

[inference] The existing matching-version audit rule therefore needs a concrete evidence mechanism. Record the exact artifact identity, audit scope/date/verdicts and how they correspond. Bind the owner's release decision to that revision/digest; changed content needs renewed acceptance. Missing or stale data cannot become approval merely because installation succeeds. Ask for verifiable backend/partner evidence if necessary; report the release blocked if the required binding cannot be established.

The structure contract permits pushing a release-layout revision while acceptance remains pending. That does not stop a default-branch consumer receiving those bytes. Define a pre-release exposure boundary and promote the same tested/audited artifact only after acceptance. Rebuilds or changed transformations require renewed verification. GitHub's optional immutable releases demonstrate commit/asset binding, but do not freeze an installer following moving `main` content. No server-setting change is required by this research. [S3]

## 2. Review capabilities, not only executable filenames

[official] Microsoft treats skills as third-party code and recommends reviewing instructions/resources as well as scripts, limiting filesystem/network access and requiring confirmation for sensitive operations. Its guidance distinguishes low-risk/idempotent skills from workflows with irreversible effects and retries. [S4]

[measured] The security workflow triggers on authored `scripts/`, imported dependencies and scanner configuration, not authored `SKILL.md`, `references/` or `assets/` alone. Manual dispatch and release review remain available. Thus a script scan is neither universal package coverage nor a semantic safety proof.

[inference] Before public trials, describe relevant reads/writes, persistence, external destinations, credentials and consequential actions. Test refusal, malformed/untrusted input and unavailable permissions in disposable environments. Authorization from one evaluation is not permission to upload later user data or run unrelated external actions. Keep this proportional: a local formatting skill needs less than one sending messages or modifying profiles. A host permission boundary enforces limits; prose and audit scores do not.

## 3. Make evaluation evidence explainable and comparable

[official] Anthropic recommends stable isolated environments, validating tasks with known-good solutions, calibrating model graders against human judgment and allowing uncertainty. It combines evaluation with real-use feedback and periodic human review. Agent Skills implementation guidance also separates discovery, activation and resource loading; names can be shadowed across scopes. [S5][S6]

[measured] The current runner records framework/runtime information, but suite-provided agent runs can report `model: null` and `parameters: null`; defaults may not identify the resolved model/client. The trigger guide explicitly acknowledges Codex global-skill influence and heuristic skill-use detection. Existing planted-error judge tests are valuable, but not a complete calibration protocol.

[inference] Preserve package/case/rubric identities, actual resolved client/model/settings, tool availability, cache provenance and relevant trace/artifact references. Separate behavioral failure from infrastructure failure or inconclusive evidence. Neither hide failed attempts through retries nor score an unavailable renderer as a proven reasoning defect. Maintain a few human-reviewed reference and deliberately wrong outputs to check graders; retain fresh cases and inspect important disagreements. Reuse the shared runner rather than create another evaluation framework. Recorded manual clean-session checks can supply evidence while the shared scenario wrapper is unfinished.

## 4. Package rollback is not state rollback

[measured] Meta Thinking's memory contract uses external version-1 JSON and preserves unsupported/malformed data with atomic/concurrent-write guidance. Tech Humanizer defines version-2 user profiles and version-1 project profiles. These stateful contracts sit outside the installed package.

[inference] Replacing a skill does not undo profile writes, generated documents, notifications or external mutations. For stateful releases, declare supported schemas and upgrade/downgrade behavior; test existing-data preservation, safe migration and package rollback against that data. Use backups or a documented recovery path where needed, without destructive automatic downgrades. Mark this acceptance item not applicable for stateless skills. Microsoft's deployment guidance independently identifies stateful rollback as harder than stateless rollback; its cloud rollout machinery is not required here. Retries of external side effects require idempotency or explicit reconciliation, not blind reruns. [S4][S8]

## 5. Close the consumer feedback and compatibility loop

[inference] Define only the clients, operating systems, models and offline/network conditions actually supported. Exercise fresh install, discovery, activation, required resource access and one meaningful output in a normal consumer workspace, including shadowed older copies where relevant. Upgrade and pin/reinstall the prior version before claiming recovery works. Source availability is not the same as successful client use. [S6]

After a release, perform one consumer smoke check, provide a version-aware feedback route and review it after material model/tool changes. Assign responsibility for deprecation, an unsafe-version notice and how users move to a safe version. Removing a directory or changing `main` does not recall copies already installed. Existing issues, release notes and occasional manual review suffice; hosted telemetry and fixed service-level commitments are not necessary. NIST's voluntary, tailorable framework similarly includes feedback, incident communication, recovery and decommissioning; this is not a mandate to adopt its full framework. [S9]

Bundled dependencies/artwork also need their own applicable rights and notices; a package-wide license field is not evidence for every embedded asset. The current Architecture Diagram handoff already flags unresolved redistribution terms. Treat that as a known acceptance work item, not a newly discovered legal conclusion. GitHub's licensing guidance distinguishes public visibility from general reuse permission; seek qualified clarification where terms are uncertain. [S7]

For runtime code fetches, record the source/version, integrity assumptions and network destination. A static package audit does not establish the safety of mutable external code or data. [inference]

## Implementation boundary and confidence

Keep `init`/`plan` lightweight: define purpose, non-goals, success and foreseeable risk without requiring a large benchmark for an idea. The maintenance contract already covers focused fixes, holdouts, no-skill value, owner baseline decisions and retirement of obsolete guidance; those are not missing phases.

Prioritize artifact/audit/exposure proof, risk-sensitive execution checks and credible evaluation evidence before adding dashboards. Source/snapshot generation, isolated scenario orchestration and a release-check summary are already known missing automation. No part of this note installs them or weakens current uniqueness checks.

Confidence in the identified gaps: high, 3.5 (owner 1, primary research 1, reasoning 1, local history 0.5). Confidence in any exact promotion/audit integration: low, 2.0 (owner 0.5, research 0.5, reasoning 1, execution history 0); backend provenance and consumer update/recovery remain unverified. The owner still decides support scope and acceptance of any explicit exception; an agent must not silently replace the required external audit with a local scanner.

## Sources opened

- [S1: skills CLI audit implementation](https://github.com/vercel-labs/skills/blob/d3701c11b1101251af14c9d148f026e1a47ebe17/src/telemetry.ts): request fields, response shape and advisory failure behavior.
- [S2: skills CLI installation](https://github.com/vercel-labs/skills/blob/d3701c11b1101251af14c9d148f026e1a47ebe17/src/add.ts): audit invocation and installation behavior.
- [S3: GitHub immutable releases](https://docs.github.com/en/code-security/concepts/supply-chain-security/immutable-releases): optional tag/asset protection and release attestations.
- [S4: Microsoft Agent Framework skills](https://learn.microsoft.com/en-us/agent-framework/agents/skills): trust, permission boundaries and side effects.
- [S5: Anthropic agent evaluations](https://www.anthropic.com/research/demystifying-evals-for-ai-agents): grader health, isolation and operational feedback.
- [S6: Agent Skills client implementation](https://agentskills.io/client-implementation/adding-skills-support): scope collisions, trust, activation and resource access.
- [S7: GitHub licensing guidance](https://choosealicense.com/no-permission/): public visibility is not a general reuse license.
- [S8: Microsoft safe deployments](https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/safe-deployments): stateful rollback and recovery differ from code replacement.
- [S9: NIST AI RMF Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/): voluntary, context-dependent lifecycle risk management; MANAGE 4.1 and 4.3 cover post-deployment feedback, recovery and incident communication.

Local evidence: [maintenance procedure](../../../docs/HARNESS.md#skill-maintenance), [release contract](../../../docs/REPOSITORY-STRUCTURE.md#installation-and-release-checks), [runner](../../../evals/run.mjs), [trigger limitations](../../../docs/prompt-evaluation.md#skill-trigger-and-version-comparison), [security workflow](../../../.github/workflows/skill-security.yml), [Meta Thinking memory](../../../incubator/meta-thinking/candidate/meta-thinking/references/memory.md), [Tech Humanizer profiles](../../../incubator/tech-humanizer/candidate/tech-humanizer/references/profile.md) and [Architecture Diagram handoff](../../../incubator/architecture-diagram/HANDOFF.md).
