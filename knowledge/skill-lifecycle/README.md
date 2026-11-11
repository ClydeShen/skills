# Skill lifecycle: from useful idea to maintained release

A portable operating standard for building, evaluating, publishing and maintaining agent skills. Use it for one skill or a repository of skills. Publication can use a Git repository, registry, archive or client-specific catalog; no platform is required by the core process.

## Use the standard

1. Copy this whole folder into the receiving project.
2. Read [the SOP](./sop.md). Assign a human owner and select supported clients and publication targets.
3. Fill the project profile in [records](./records.md). Map tool roles using [the reference stack](./reference-stack.md).
4. Copy [the checklist](./checklist.yaml) for each candidate version. Validate it with [its JSON Schema](./checklist.schema.json) and reject duplicate item IDs in the validator wrapper.
5. Link the adopted standard and local profile from the project's agent instructions. Keep tasks in the tracker and evidence in versioned records.

The [skills.sh adapter](./adapters/skills-sh.md) is an optional example, not a dependency. Replace it when the publication target changes. Preserve the core evidence and approval requirements.

## The lifecycle at a glance

Read from the bottom up: each gate asks for evidence before the next step.

```mermaid
%%{init: {"theme": "base", "block": {"padding": 32}, "fontFamily": "Arial, sans-serif", "themeVariables": {"fontSize": "15px", "lineColor": "#8292A5", "edgeLabelBackground": "#FFFFFF"}}}%%
block-beta
    columns 3

    releaseVersion["Release
    Promote approved bytes without rebuilding
    Verify published identity and post-publication install smoke
    Preserve version identity and the recovery path"]:2
    maintenance["Recover or improve
    Failed smoke: restore or withdraw
    Next revision returns to Draft
    Hotfix released source and forward-port"]

    approval["Owner approval
    Approve this exact snapshot, its targets and known limits
    Scores and CI do not approve a release"]:2
    declined["Approval declined
    Return to Public
    Revise snapshot and evidence"]

    acceptance["Release acceptance
    Security, dependencies and third-party rights
    Matching platform audit verdict
    Clean install, activation, resources and useful output
    Supported targets, updates and applicable recovery"]:2
    hold["Failed or missing checks
    Hold at Public
    Repair and revalidate"]

    publicTrial["Public
    Offer an opt-in candidate with a first-use guide
    Collect reproducible feedback tied to a version
    Freeze source revision, file inventory and digest"]:2
    feedback["Trial feedback
    Return to Draft
    Improve the candidate"]

    internal["Internal
    Promptfoo first, then authorized fresh agent runs
    Calibrate graders and inspect actual outputs
    Baseline, no-skill, held-out and trigger comparisons
    Human review and verified trial installation"]:2
    retest["Weak or inconclusive evidence
    Return to Draft
    Repair and retest"]

    draft["Draft
    Focused instructions and package-local resources
    Tool gate: format, links, lint, resources and secrets
    Runnable evaluation cases, rubric and result path"]:2
    repair["Package or test failure
    Stay in Draft
    Repair and rerun checks"]

    plan["Plan
    Research the need and compare simpler alternatives
    Owner agrees scope, success and supported targets
    Declare capabilities and data boundaries"]:2
    space

    idea["Init
    Identify a recurring user task and its intended benefit"]:2
    space

    idea --> plan
    plan --> draft
    draft --> internal
    internal --> publicTrial
    publicTrial --> acceptance
    acceptance --> approval
    approval --> releaseVersion

    releaseVersion --> maintenance
    approval --> declined
    acceptance --> hold
    publicTrial --> feedback
    internal --> retest
    draft --> repair

    classDef stage fill:#F8FAFC,stroke:#CBD5E1,color:#243247
    classDef tool fill:#EFF6FF,stroke:#93B4D7,color:#1E3A5F
    classDef evidence fill:#FFFBEB,stroke:#D6BC78,color:#59451D
    classDef human fill:#F5F3FF,stroke:#B6A5D2,color:#493568
    classDef stable fill:#ECFDF5,stroke:#86BDA5,color:#20543D
    classDef returnPath fill:#FFFFFF,stroke:#CBD5E1,color:#475569
    class idea,publicTrial stage
    class draft tool
    class internal,acceptance evidence
    class plan,approval human
    class releaseVersion stable
    class maintenance,declined,hold,feedback,retest,repair returnPath
```

**Tools check correctness. Agents produce evidence. The owner decides what ships.** Read upward for progress; the right-hand cards name return and recovery actions, not extra lifecycle stages. Missing required evidence blocks progress. Changed content reopens affected checks; an audit or approval for different bytes does not carry over.

These are required controls, not a claim that every gate is automated; each project's harness decides what it automates. Entering `internal` means evaluation is runnable; entering `public` means a candidate can be tried, not that it has passed release acceptance.

After release, improvements leave the published version intact. A hotfix starts from its recorded source, passes the same applicable gates and is forward-ported to ongoing work. Failed delivery restores the previous verified package or withdraws a failed first release; state recovery is separate where relevant. Only the owner changes an accepted baseline.

## Scope and limits

This is a proposed reusable standard adopted for its originating project's process on 2026-11-06 by the owner. It is not an industry certification. End-to-end publication, recovery and use in a second repository remain unverified. A receiving owner must approve its local profile; copying files does not implement gates.

The schema checks record structure, not evidence truth, security or skill effectiveness. Tool implementations and their actual enforcement belong to each project's harness. Keep this folder self-contained; runtime skill packages must not require it.

## Evidence and revision

The SOP synthesizes [Agent Skills evaluation guidance](https://agentskills.io/skill-creation/evaluating-skills), [description evaluation](https://agentskills.io/skill-creation/optimizing-descriptions), [Anthropic's eval guidance](https://www.anthropic.com/research/demystifying-evals-for-ai-agents), [Microsoft's skill security guidance](https://learn.microsoft.com/en-us/agent-framework/agents/skills), [Git maintenance workflows](https://git-scm.com/docs/gitworkflows) and [SemVer](https://semver.org/). These sources inform the standard; none mandates this complete workflow.

Revision: 2026-11-06, initial portable SOP, evidence checklist and replaceable tool/platform profiles. Local research and implementation status stay in the adopting project, not in this portable folder.
