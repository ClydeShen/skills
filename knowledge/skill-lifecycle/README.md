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

Read from the top down. Each diamond is a decision: "yes" moves on, and "no" follows a dashed pill to the stage where the work goes back. Purple is decided by a person, blue by tools, amber by evidence that a person reads, and green is the published release.

```mermaid
%%{init: {"theme": "base", "fontFamily": "Arial, sans-serif", "flowchart": {"curve": "basis", "nodeSpacing": 24, "rankSpacing": 26, "htmlLabels": true, "padding": 10}, "themeVariables": {"fontSize": "14px", "lineColor": "#8292A5", "edgeLabelBackground": "#FFFFFF"}}}%%
flowchart TB
    init(["<b>Init</b><br/>Name a recurring task and its benefit"])
    plan["<b>Plan</b><br/>Research, compare simpler options<br/>Owner agrees scope and success"]
    draft["<b>Draft</b><br/>Write instructions and local resources<br/>Prepare cases, rubric and result path"]
    d1{"Tools pass?"}
    internal["<b>Internal</b><br/>Shared regressions, fresh agent runs<br/>Baseline comparison, a person inspects"]
    d2{"Evidence strong?"}
    public["<b>Public</b><br/>Opt-in trial with a first-use guide<br/>Freeze source revision and digest"]
    d3{"Feedback<br/>reproducible?"}
    accept["<b>Release acceptance</b><br/>Security, rights, platform audit<br/>Clean install, activation, useful output"]
    d4{"All checks pass?"}
    d5{"Owner approves<br/>this exact snapshot?"}
    release["<b>Release</b><br/>Promote the approved bytes unchanged<br/>Smoke-check the published install"]
    d6{"Smoke passes?"}
    live(["<b>Published</b><br/>The version stays intact"])

    a1(["↩ <b>Draft</b><br/>repair, rerun the checks"])
    a2(["↩ <b>Draft</b><br/>repair and retest"])
    a3(["↩ <b>Draft</b><br/>improve the candidate"])
    a4(["↩ <b>Public</b><br/>hold, repair, revalidate"])
    a5(["↩ <b>Public</b><br/>revise snapshot and evidence"])
    a6(["<b>Restore</b> the previous verified version<br/>or withdraw a failed first release"])
    a7(["↻ <b>Draft</b><br/>next revision or hotfix"])

    init --> plan --> draft --> d1
    d1 -- yes --> internal
    d1 -- no --> a1
    internal --> d2
    d2 -- yes --> public
    d2 -- no --> a2
    public --> d3
    d3 -- yes --> accept
    d3 -- no --> a3
    accept --> d4
    d4 -- yes --> d5
    d4 -- no --> a4
    d5 -- yes --> release
    d5 -- no --> a5
    release --> d6
    d6 -- yes --> live
    d6 -- no --> a6
    live --> a7

    classDef person fill:#F5F3FF,stroke:#8B7BC0,color:#3F2D66
    classDef tool fill:#EFF6FF,stroke:#60A5FA,color:#1E3A5F
    classDef evidence fill:#FFFBEB,stroke:#D6A93C,color:#59451D
    classDef stable fill:#ECFDF5,stroke:#34A56F,color:#14532D
    classDef back fill:#FFFFFF,stroke:#94A3B8,color:#334155,stroke-dasharray:4 3
    classDef fail fill:#FEF2F2,stroke:#E08A8A,color:#7F1D1D
    class init,plan,d5 person
    class draft,d1 tool
    class internal,public,accept,d2,d3,d4 evidence
    class release,d6,live stable
    class a1,a2,a3,a4,a5,a7 back
    class a6 fail
```

**Tools check correctness. Agents produce evidence. The owner decides what ships.** The dashed pills name return and recovery actions, not extra lifecycle stages. Missing required evidence blocks progress. Changed content reopens affected checks; an audit or approval for different bytes does not carry over.

These are required controls, not a claim that every gate is automated; each project's harness decides what it automates. Entering `internal` means evaluation is runnable; entering `public` means a candidate can be tried, not that it has passed release acceptance.

After release, improvements leave the published version intact and restart at Draft. A hotfix starts from its recorded source, passes the same applicable gates and is forward-ported to ongoing work. Failed delivery restores the previous verified package or withdraws a failed first release; state recovery is separate where relevant. Only the owner changes an accepted baseline.

## Scope and limits

This is a proposed reusable standard adopted for its originating project's process on 2026-11-06 by the owner. It is not an industry certification. End-to-end publication, recovery and use in a second repository remain unverified. A receiving owner must approve its local profile; copying files does not implement gates.

The schema checks record structure, not evidence truth, security or skill effectiveness. Tool implementations and their actual enforcement belong to each project's harness. Keep this folder self-contained; runtime skill packages must not require it.

## Evidence and revision

The SOP synthesizes [Agent Skills evaluation guidance](https://agentskills.io/skill-creation/evaluating-skills), [description evaluation](https://agentskills.io/skill-creation/optimizing-descriptions), [Anthropic's eval guidance](https://www.anthropic.com/research/demystifying-evals-for-ai-agents), [Microsoft's skill security guidance](https://learn.microsoft.com/en-us/agent-framework/agents/skills), [Git maintenance workflows](https://git-scm.com/docs/gitworkflows) and [SemVer](https://semver.org/). These sources inform the standard; none mandates this complete workflow.

Revision: 2026-11-06, initial portable SOP, evidence checklist and replaceable tool/platform profiles. Local research and implementation status stay in the adopting project, not in this portable folder.
