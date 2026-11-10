# Personal Agent Skills

A curated collection of agent skills for clearer architecture diagrams, more natural technical writing and more productive AI conversations. Each skill focuses on a practical task, with reusable instructions and tools where they help.

## Find your skill

| Skill                                                              | When it helps                                                 | What to expect                                                                                   |
| ------------------------------------------------------------------ | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [Architecture Diagram](./incubator/architecture-diagram/README.md) | Explain a request path, deployment or cross-cloud interaction | Editable draw.io diagrams, PNGs when export is available, and explicit architectural assumptions |
| [Meta Thinking](./incubator/meta-thinking/README.md)               | An AI conversation is stuck or solving the wrong problem      | A clearer goal, a challenged assumption and a useful next action                                 |
| [Tech Humanizer](./incubator/tech-humanizer/README.md)             | Technical writing sounds generic or unnatural                 | More natural wording while preserving meaning and technical vocabulary                           |

These are intended uses, not guarantees. Each skill's page explains its current maturity, prerequisites and verified limits.

## Try a skill

Install the released Architecture Diagram skill in your project:

```sh
npx --yes skills@1.7.4 add ClydeShen/skills --skill architecture-diagram --agent codex --copy --yes
```

For Claude Code, replace `--agent codex` with `--agent claude-code`. The [package README](./skills/architecture-diagram/README.md) lists the requirements and a first-use prompt. Use a sanitized scenario in a disposable project and inspect the first result before requesting corrections. Other skills here are candidates; their trial instructions are opt-in and not approved releases.

## From idea to release

`init → plan → draft → internal → public → release`

Ideas begin with research and a clear user problem. A standard skill package takes shape during drafting, then enters internal evaluation. At public trial, users can install the candidate and share feedback. Formal release requires a verified package, installation checks, applicable security/audit acceptance and owner approval.

Release publishes a snapshot, not unfinished authoring work. Later improvements are evaluated separately; fixes and upgrades retain version history. skills.sh is the current distribution example, not a requirement of the reusable process.

Explore the [lifecycle SOP and checklist](./knowledge/skill-lifecycle/README.md) for the full process, or the [local release contract](./docs/REPOSITORY-STRUCTURE.md#candidate-and-release-lifecycle) for this repository's requirements.

## Explore how they are built

[Research](./research/) informs [reusable knowledge](./knowledge/) and the skills in the [incubator](./incubator/). Approved publication snapshots belong in [skills/](./skills/). The [skill design principles](./knowledge/skill-design/skill-design-principles.md) explain the approach: focused guidance, room for model judgment and evidence from real tasks.

## Contribute

Feedback from trying a skill is welcome; use its page's feedback route. For repository changes, start with [AGENTS.md](./AGENTS.md) and the [engineering setup](./docs/HARNESS.md). Detailed organization and procedures live in [docs/](./docs/README.md).
