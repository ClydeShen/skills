# Personal Agent Skills

**Good results shouldn't disappear with the chat.**

A diagram you can bring to a review. A technical draft that sounds like you. A useful next step when a conversation stalls. This collection turns those recurring needs into skills you can try with your own agent.

## What would you like to get done?

### Put your architecture on the page

Describe how your system works. **Architecture Diagram** helps turn it into an editable draw.io diagram: follow a request, see the boundaries, and bring something concrete to the discussion.

[![Released](https://img.shields.io/badge/skill-released-2ea44f)](./skills/architecture-diagram/README.md)
[![Works with Claude Code and Codex](https://img.shields.io/badge/works%20with-Claude%20Code%20%7C%20Codex-D97757)](./skills/architecture-diagram/README.md)
[![Output: .drawio, PNG and SVG](https://img.shields.io/badge/output-.drawio%20%C2%B7%20PNG%20%C2%B7%20SVG-3b82f6)](./skills/architecture-diagram/README.md)
[![AWS, Azure, Google Cloud, Kubernetes](https://img.shields.io/badge/icons-AWS%20%C2%B7%20Azure%20%C2%B7%20Google%20Cloud%20%C2%B7%20Kubernetes-232F3E)](./skills/architecture-diagram/README.md)

<img src="https://raw.githubusercontent.com/ClydeShen/skills/main/incubator/architecture-diagram/examples/cross-cloud-private-api/diagram.png" alt="An architecture diagram drawn by the skill: Azure integration workloads reaching a private API Gateway in AWS through a VPN, a Transit Gateway and DNS forwarding" width="860">

<sub>Drawn by the skill from a text description, unedited. [More examples and the input behind each.](./skills/architecture-diagram/README.md)</sub>

```sh
npx --yes skills@1.7.4 add ClydeShen/skills --skill architecture-diagram --agent codex --copy --yes
```

[See what it does and what to try first →](./skills/architecture-diagram/README.md)

### Keep the technical meaning. Make the writing sound like you.

An email, a design document, a paragraph that feels too generic. **Tech Humanizer** helps rewrite it naturally while preserving the details that matter.

[Explore Tech Humanizer →](./incubator/tech-humanizer/README.md)

### Get an unproductive chat moving again

When the conversation keeps circling, **Meta Thinking** helps uncover the goal or assumption worth revisiting and choose the next useful action.

[Explore Meta Thinking →](./incubator/meta-thinking/README.md)

Architecture Diagram is released; for Claude Code, replace `--agent codex` with `--agent claude-code`. The writing and thinking skills are still in internal testing and are not released.

## A skill gets better by being used

An installable skill is not necessarily a useful one, and a passing test is not permission to publish. Read from the bottom up: each gate asks for evidence before the next step.

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

These are required controls, not a claim that every gate is automated. Local checks and snapshot verification are implemented; real-client acceptance, rights review, platform audit and release approval still need recorded evidence. This project's publication profile requires skills.sh audit. Entering `internal` means evaluation is runnable; entering `public` means a candidate can be tried—not that it has passed release acceptance.

After release, improvements leave the published version intact. A hotfix starts from its recorded source, passes the same applicable gates and is forward-ported to ongoing work. Failed delivery restores the previous verified package or withdraws a failed first release; state recovery is separate where relevant. Only the owner changes an accepted baseline.

Want to use the same approach for your own skills? Borrow the [lifecycle playbook and checklist](./knowledge/skill-lifecycle/README.md). It covers trials, release checks, upgrades and hotfixes without tying you to one publishing platform.

## Contribute

Try a skill and tell us what happened: your input, the first result and what you wished it had done differently. Each skill's page has a feedback link. For repository changes, start with [AGENTS.md](./AGENTS.md) and the [engineering setup](./docs/HARNESS.md).
