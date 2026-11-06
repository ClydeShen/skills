# Research: Published skills need versioned feedback loops

Date: 2026-11-06. Question: how should a published skill be repaired, improved and released without destabilizing its users? Context: the owner favors continued authoring in the incubator, stable published packages and easy hotfixes. Status: research completed before the adoption recorded below; source claims and proposals remain research-time findings.

Subsequent decision, 2026-11-06: the owner adopted the shared maintenance principles and source/snapshot direction in [ADR 0004](../adr/0004-versioned-skill-maintenance.md). Current rules live in [skill maintenance](../../../docs/HARNESS.md#skill-maintenance) and [package progression](../../../docs/REPOSITORY-STRUCTURE.md#package-progression). Publication tooling remains unimplemented; this is not release evidence.

Conclusion: [inference] combine evidence-driven improvement with reproducible releases. Diagnose failures before adding prompt text. Maintain one authoring source, identify the exact tested/published package, isolate urgent fixes and carry them forward. Sources support these mechanisms, not a universal folder layout or release workflow.

## Overview

| Judgment                                | Recommendation                                                                             | Evidence and confidence                                                            |
| --------------------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| J1: Improve behavior                    | Reproduce, diagnose, make a focused change, compare outcomes and retain useful regressions | Strong official guidance; high, 4.0                                                |
| J2: Separate authoring from publication | Consider an incubator source plus generated, versioned publication snapshot                | Established revision principles; medium, 3.0; the exact layout is a project design |
| J3: Handle urgent failures              | Patch the affected release baseline and forward-port the fix without unrelated development | Official Git guidance; medium, 3.0; integration remains untested here              |

Confidence uses the repository's [four-dimension rubric](../../../knowledge/harness/judgment-practices.md#1-four-dimension-confidence): J1 owner/research/reasoning/history = 1/1/1/1; J2 = 1/0.5/1/0.5; J3 = 1/1/1/0. Research confidence is not a probability of success.

## 1. Start with a reproducible failure and locate its cause

[official] Matt Pocock's maintenance policy requires observed session failures that fit the skills' purpose. His bug template requests the installed version or commit, client/version and installation method, model/effort, minimal reproduction, actual behavior and expected behavior. His contributing guide separates problems from proposed rewrites and asks for one problem per issue. These are his project's policies, not universal contributor requirements. [S1][S2][S3]

[inference] Retain sanitized evidence in GitHub issues. Distinguish installation/discovery, client configuration, model behavior, tools, packaged resources and instructions. Fix the owning layer: a stale installation is not necessarily a prompt defect; a missing icon asset should not become instructions compensating for it.

## 2. Improve the mechanism, not only the reported example

[official] Anthropic's skill-creator recommends generalizing from feedback, reading execution transcripts, explaining consequential reasons, keeping instructions lean and moving repeated deterministic work into reusable helpers. It reruns cases against the original or previous skill and supports blind comparison. Its description optimizer separates training and held-out evaluation rather than selecting improvements on the same examples repeatedly. [S4][S5]

[official] Agent Skills evaluation guidance compares a modified skill with a prior snapshot and examines actual artifacts and process evidence. Repeated runs reveal variation; mechanical properties suit code checks, while subjective quality still needs human judgment. OpenAI similarly recommends defining outcome, process, style and efficiency criteria and turning observed failures into cases. [S6][S7]

[inference] Preserve the failing case and nearby variations/negative cases. Compare a focused change against the old package under matched model, client, tools and budgets. Judge usefulness, correctness, time, tokens and interaction burden. Retain held-out cases; do not tune against every acceptance example. Format, discovery and size checks cannot establish effectiveness.

Use the existing shared Promptfoo runner, not a new per-skill evaluation framework. Run deterministic and eligible cached prompt regressions first. Fresh tool/agent runs and independent repeats must remain fresh. A previous-release comparison detects introduced regressions; a no-skill comparison asks whether the skill still adds value.

[official] Anthropic distinguishes capability improvements from encoded workflow preferences. Model or infrastructure changes can change behavior even when the skill is unchanged. A capability skill may eventually become unnecessary; a preference skill remains useful only while it reflects the intended workflow. This supports periodic reevaluation and deletion of obsolete scaffolding, not indefinite rule accumulation. [S8]

## 3. Stable publication does not require frozen authoring

[official] The Agent Skills specification defines package contents and optional metadata, not a release/hotfix workflow. Anthropic's API guide says versions are complete snapshots: omitted files do not carry over. It recommends specific version pins in production and newest-version selection in development; floating selection can expose production to a new upload immediately. These are platform-specific mechanisms, not a required hosting service. [S9][S10]

[inference] The proposed incubator-source/`skills/`-snapshot model is reasonable if only the source is manually maintained. Separate immutable artifact provenance from the default distributed version. Promotion selects an explicit source commit, generates the package, verifies declared metadata transformations and records its digest, checks and audit evidence. Run final installation and smoke checks against that generated snapshot, not only its authoring source. Do not independently edit both trees or include development helpers.

An existing release remains stable while its successor undergoes internal evaluation. Record published status separately from next-version verification. Authoring merges do not publish automatically; neither automated improvement nor a score should authorize promotion.

At research time, this differed from the move-on-release contract. The subsequent decision above updates [package ownership](../../../docs/REPOSITORY-STRUCTURE.md#package-progression); snapshot generation, paired-package checks, discovery and installation still require implementation and verification. The research alone did not change those rules.

## 4. Hotfix the release, then preserve the fix in future work

[official] Git's workflow guidance warns that merging unstable development into a stable line imports unrelated changes. It recommends fixing the oldest supported baseline that needs the correction and moving fixes toward newer development. Topic branches isolate changes; cherry-pick can apply selected commits and record their origin. Git also cautions that its complete multi-branch workflow is rarely needed for small projects. [S11][S12]

[inference] Keep short task branches, not permanent per-skill release branches. Reproduce a hotfix against the exact release in an isolated worktree. Restore its recorded authoring source, apply the minimal correction there and generate/test the patched snapshot. Integrate only that skill's corrected publication into current main, then forward-port the fix to its evolving authoring source and rerun regressions. Do not blindly publish the newest incubator head or restore an entire old repository: that could affect other skills.

If immediate recovery matters more than diagnosis, restore the last verified package through a reviewable change, then investigate. Preserve the bad revision and explanation; do not overwrite its public tag or erase history. Reapply this project's installation, security and matching skills.sh audit requirements to the intended published version.

## 5. Version the contract and explain how users receive updates

[official] SemVer requires a declared public API, unchanged contents for an already released version, and compatibility-based patch/minor/major distinctions. Git recommends annotated tags for releases and warns against replacing published tags with different contents. [S13][S14]

[inference] For a skill, define the contract as supported tasks/trigger scope, meaningful output expectations, interaction and authorization behavior, and runtime requirements. A one-line prompt edit can break that contract; diff size is not the version category. Per-skill versions and tags are a possible project convention, not an Agent Skills requirement. A skill-named tag still identifies a repository commit, not an independently versioned directory.

[official] Current skills CLI documentation supports explicit Git-ref installation, update checks and user-initiated updates. Its update source code preserves the recorded ref. An installation pinned to an immutable release therefore does not automatically advance to the next release. [S15][S16]

Verify the exact installation/update syntax with the selected CLI; do not infer it from tag names.

## Not verified and owner decisions

- No new skill behavior, promotion tool, consumer update, rollback or external audit was executed. Source review is not integration evidence.
- CLI source at `cad8cda44e8944316354d115eaac8b4485a5b211` recognizes `@v1.2.3`/full-SHA pins, not arbitrary namespaced tags via that shortcut. Ref selection and updates were not tested with this project's pinned `skills@1.7.4`.
- The subsequent decision adopts the ownership/workflow direction, not working publication tooling. Exact transformation/check implementation, tag syntax and support for older versions remain unsettled; follow the current linked contract rather than these research-time proposals.
- Human evaluation and security review remain necessary; neither a score nor an audit proves overall usefulness.

## Sources opened

- [S1: Matt Pocock scope](https://github.com/mattpocock/skills/blob/main/SCOPE.md): observed failures and maintenance boundaries.
- [S2: Matt Pocock bug template](https://github.com/mattpocock/skills/blob/main/.github/ISSUE_TEMPLATE/bug.yml): reproduction and environment evidence.
- [S3: Matt Pocock contributing guide](https://github.com/mattpocock/skills/blob/main/CONTRIBUTING.md): one problem per issue, reproduction first.
- [S4: Anthropic skill-creator](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md): feedback generalization and old/new comparison.
- [S5: Agent Skills description optimization](https://agentskills.io/skill-creation/optimizing-descriptions): held-out validation and trigger checks.
- [S6: Agent Skills evaluation](https://agentskills.io/skill-creation/evaluating-skills): evidence, comparisons and variation.
- [S7: OpenAI skill evaluations](https://developers.openai.com/blog/eval-skills): task-level criteria and regression cases.
- [S8: Anthropic skill-creator improvements](https://claude.com/resources/articles/improving-skill-creator-test-measure-and-refine-agent-skills): model changes, baselines and skill value.
- [S9: Agent Skills specification](https://agentskills.io/specification): package format, not a maintenance policy.
- [S10: Anthropic Skills API guide](https://platform.claude.com/docs/en/build-with-claude/skills-guide): complete version snapshots and production pins.
- [S11: Git workflows](https://git-scm.com/docs/gitworkflows): stable fixes, topic branches and selective integration.
- [S12: Git cherry-pick](https://git-scm.com/docs/git-cherry-pick): selected commit application and provenance.
- [S13: Semantic Versioning](https://semver.org/): declared compatibility and immutable released versions.
- [S14: Git tags](https://git-scm.com/docs/git-tag): release tags and published-tag stability.
- [S15: skills CLI commands](https://github.com/vercel-labs/skills/blob/cad8cda44e8944316354d115eaac8b4485a5b211/docs/commands.md): ref pins and explicit updates.
- [S16: skills CLI update source](https://github.com/vercel-labs/skills/blob/cad8cda44e8944316354d115eaac8b4485a5b211/src/update-source.ts), [parser](https://github.com/vercel-labs/skills/blob/cad8cda44e8944316354d115eaac8b4485a5b211/src/source-parser.ts): preserved refs and version-pin parsing.
