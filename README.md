# Personal Agent Skills

**Good results shouldn't disappear with the chat.**

A diagram you can bring to a review. A technical draft that sounds like you. A useful next step when a conversation stalls. This collection turns those recurring needs into skills you can try with your own agent.

## What would you like to get done?

### Put your architecture on the page

Describe how your system works. **Architecture Diagram** helps turn it into an editable draw.io diagram: follow a request, see the boundaries, and bring something concrete to the discussion.

[See what it does and try the preview →](./incubator/architecture-diagram/candidate/architecture-diagram/README.md)

### Keep the technical meaning. Make the writing sound like you.

An email, a design document, a paragraph that feels too generic. **Tech Humanizer** helps rewrite it naturally while preserving the details that matter.

[Explore Tech Humanizer →](./incubator/tech-humanizer/README.md)

### Get an unproductive chat moving again

When the conversation keeps circling, **Meta Thinking** helps uncover the goal or assumption worth revisiting and choose the next useful action.

[Explore Meta Thinking →](./incubator/meta-thinking/README.md)

Architecture Diagram is open for candidate trials. The writing and thinking skills are still in internal testing. No stable release is available yet.

## A skill gets better by being used

An installable skill is not necessarily a useful one, and a passing test is not permission to publish. Read from the bottom up: each gate asks for evidence before the next step.

```mermaid
%%{init: {"flowchart": {"wrappingWidth": 260, "rankSpacing": 24, "nodeSpacing": 24}}}%%
flowchart BT
    accTitle: Skill lifecycle, evidence gates and recovery
    accDescr: Read bottom to top, from init through plan, draft, internal, public and release. The owner approves the problem and scope. Tools check package correctness and evaluation readiness. Agents collect behavioral comparisons and verify candidate installation. A frozen snapshot must pass security, rights, audit and consumer acceptance before the owner approves that exact artifact. Identical bytes are promoted and smoke-tested. Failed or missing checks block progress. Feedback starts a new revision; hotfixes start from released source. Failed delivery restores the previous verified version or withdraws a failed first release.

    idea(["`**INIT · A recurring problem**
    Who needs help, and with what task?`"])

    subgraph planning["PLAN · Confirm the need"]
        direction LR
        research["`Research the task
        Compare simpler alternatives`"]
        scopeGate{{"`**OWNER · Agree the brief**
        Scope, success, supported targets
        Capabilities and data boundaries`"}}
        research --> scopeGate
    end

    subgraph building["DRAFT · Build the smallest useful skill"]
        direction LR
        author["`Focused instructions
        Package-local resources`"]
        readyGate{{"`**TOOLS · Evaluation ready?**
        Format, resources, links, lint, secrets
        Runnable cases, rubric, result path`"}}
        author --> readyGate
        readyGate -.->|"Fail: repair and rerun"| author
    end

    subgraph testing["INTERNAL · Establish evidence, not just a score"]
        direction LR
        regress["`Promptfoo regression first
        Then authorized fresh agent / tool runs
        Calibrate graders; inspect actual outputs`"]
        trialGate{{"`**EVIDENCE + HUMAN REVIEW**
        Baseline / no-skill, held-out, trigger tests
        Trial install and first-use guide work`"}}
        regress --> trialGate
    end

    subgraph trial["PUBLIC · Offer an opt-in candidate"]
        direction LR
        publicTrial["`Install, try, report
        Reproducible feedback tied to a version`"]
        snapshot["`**FREEZE · Select the snapshot**
        Source revision, inventory and digest
        All release evidence binds to these bytes`"]
        publicTrial --> snapshot
    end

    subgraph acceptance["RELEASE ACCEPTANCE · Required evidence, not another maturity stage"]
        direction LR
        trustGate{{"`**SAFE TO DISTRIBUTE?**
        Security, dependencies, third-party rights
        Matching platform audit verdict`"}}
        consumerGate{{"`**WORKS WHEN INSTALLED?**
        Clean install, activation, resources, output
        Supported targets; update / recovery checks`"}}
        trustGate --> consumerGate
    end

    subgraph publishing["RELEASE · Approve, promote and verify"]
        direction LR
        approval{{"`**OWNER · Approve exact artifact**
        Results, targets and known limits
        CI and scores cannot approve release`"}}
        delivery["`**VERIFY · Same bytes**
        Promote without rebuilding
        Published identity and install smoke
        Failure: restore or withdraw`"]
        releaseVersion(["`**Verified release**
        Retain version identity
        and a recovery path`"])
        approval --> delivery --> releaseVersion
    end

    idea --> planning
    planning -->|"Owner agrees"| building
    building -->|"Package and evaluation ready"| testing
    testing -->|"Evidence reviewed; trial entry works"| trial
    trial -->|"Snapshot frozen"| acceptance
    acceptance -->|"All required checks accepted"| publishing
    testing -.->|"Fail / inconclusive: fix and retest"| building
    trial -.->|"Feedback changes behavior"| building
    acceptance -.->|"Fail / missing evidence: hold, repair, refreeze"| trial
    publishing -.->|"Owner declines: revise and revalidate"| trial
    publishing -.->|"Failed delivery: recover, fix, repeat acceptance"| trial
    publishing -.->|"Next revision / hotfix from released source"| building

    classDef stage fill:#F4F7FB,stroke:#65758B,color:#172B4D
    classDef tool fill:#EAF2FF,stroke:#325FA3,color:#16375F
    classDef evidence fill:#FFF5DE,stroke:#946510,color:#543800
    classDef human fill:#F1EAFA,stroke:#73509C,color:#432B60
    classDef stable fill:#E5F4EA,stroke:#277044,color:#163A24
    class idea,research,author,regress,publicTrial,snapshot stage
    class readyGate tool
    class trialGate,trustGate,consumerGate,delivery evidence
    class scopeGate,approval human
    class releaseVersion stable
```

**Tools check correctness. Agents produce evidence. The owner decides what ships.** Solid links advance the candidate; dashed links repair, improve or recover it. Missing required evidence blocks progress. Changed content reopens affected checks; an audit or approval for different bytes does not carry over.

These are required controls, not a claim that every gate is automated. Local checks and snapshot verification are implemented; real-client acceptance, rights review, platform audit and release approval still need recorded evidence. This project's publication profile requires skills.sh audit. Entering `internal` means evaluation is runnable; entering `public` means a candidate can be tried—not that it has passed release acceptance.

After release, improvements leave the published version intact. A hotfix starts from its recorded source, passes the same applicable gates and is forward-ported to ongoing work. Failed delivery restores the previous verified package or withdraws a failed first release; state recovery is separate where relevant. Only the owner changes an accepted baseline.

Want to use the same approach for your own skills? Borrow the [lifecycle playbook and checklist](./knowledge/skill-lifecycle/README.md). It covers trials, release checks, upgrades and hotfixes without tying you to one publishing platform.

## Contribute

Try a skill and tell us what happened: your input, the first result and what you wished it had done differently. Each skill's page has a feedback link. For repository changes, start with [AGENTS.md](./AGENTS.md) and the [engineering setup](./docs/HARNESS.md).
