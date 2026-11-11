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

Read from the bottom up: each gate asks for evidence before the next step. Purple cards are decided by a person, blue by tools, amber by evidence that a person reads, and green is the published release. The cards on the right say where a failure goes.

```mermaid
%%{init: {"theme": "base", "block": {"padding": 28}, "fontFamily": "Arial, sans-serif", "themeVariables": {"fontSize": "15px", "lineColor": "#8292A5", "edgeLabelBackground": "#FFFFFF"}}}%%
block-beta
    columns 3

    release["<b>Release</b>
    Promote the approved bytes unchanged
    Smoke-check the published install"]:2
    recover["<b>If smoke fails</b>
    Restore the previous version or withdraw
    A next revision or hotfix restarts at Draft"]

    approval["<b>Owner approval</b>
    Approve this exact snapshot, its targets and its limits
    Scores and CI never approve a release"]:2
    declined["<b>If declined</b>
    Return to Public
    Revise the snapshot and evidence"]

    acceptance["<b>Release acceptance</b>
    Security, rights and the platform audit
    Clean install, activation and useful output"]:2
    hold["<b>If a check fails or is missing</b>
    Hold at Public
    Repair, then revalidate"]

    publicTrial["<b>Public</b>
    Offer an opt-in trial with a first-use guide
    Collect reproducible feedback by version
    Freeze the source revision and digest"]:2
    feedback["<b>After trial feedback</b>
    Return to Draft
    Improve the candidate"]

    internal["<b>Internal</b>
    Run shared regressions, then fresh agent runs
    Compare with the baseline and inspect outputs
    A person reviews the results"]:2
    retest["<b>If evidence is weak</b>
    Return to Draft
    Repair and retest"]

    draft["<b>Draft</b>
    Write focused instructions and local resources
    Tools check format, links, lint, resources, secrets
    Prepare runnable cases, rubric and result path"]:2
    repair["<b>If a check fails</b>
    Stay in Draft
    Repair and rerun the checks"]

    plan["<b>Plan</b>
    Research the need and compare simpler options
    The owner agrees scope, success and targets"]:2
    space

    idea["<b>Init</b>
    Name a recurring task and its benefit"]:2
    space

    idea --> plan
    plan --> draft
    draft --> internal
    internal --> publicTrial
    publicTrial --> acceptance
    acceptance --> approval
    approval --> release

    release --> recover
    approval --> declined
    acceptance --> hold
    publicTrial --> feedback
    internal --> retest
    draft --> repair

    classDef person fill:#F5F3FF,stroke:#8B7BC0,color:#3F2D66
    classDef tool fill:#EFF6FF,stroke:#60A5FA,color:#1E3A5F
    classDef evidence fill:#FFFBEB,stroke:#D6A93C,color:#59451D
    classDef stable fill:#ECFDF5,stroke:#34A56F,color:#14532D
    classDef back fill:#FFFFFF,stroke:#CBD5E1,color:#475569
    class idea,plan,approval person
    class draft tool
    class internal,publicTrial,acceptance evidence
    class release stable
    class recover,declined,hold,feedback,retest,repair back
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
