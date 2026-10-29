# Personal Agent Skills

A workspace for developing useful, reusable agent skills: investigate an idea, distill the knowledge, build a standard skill package, evaluate it and make it available for others to try.

## Explore the skills

- [Architecture Diagram](./incubator/architecture-diagram/README.md): turn architecture requirements into editable draw.io diagrams. Includes candidate installation and trial instructions.
- [Meta Thinking](./incubator/meta-thinking/README.md): help a stalled interaction find a useful next action.
- [Tech Humanizer](./incubator/tech-humanizer/README.md): make writing more natural while preserving meaning and technical vocabulary.

Each initiative owns its maturity and verification status. No skill has been released yet.

## Repository map

- [`research/`](./research/): evidence, investigated questions and decision history.
- [`knowledge/`](./knowledge/): reusable guidance synthesized from research.
- [`incubator/`](./incubator/): skills in development, with their evaluations and supporting tools.
- [`skills/`](./skills/): installable releases.
- [`docs/`](./docs/README.md): repository organization and operating procedures.
- [`GLOSSARY.md`](./GLOSSARY.md): shared terminology.

Incubation uses the same package format as release; supporting experiments stay outside the package. See the [lifecycle contract](./docs/REPOSITORY-STRUCTURE.md#candidate-and-release-lifecycle) for stages and promotion.

## Contribute

Start with [AGENTS.md](./AGENTS.md); Codex and Claude share these instructions. With Node.js 24 and Git available, run:

```sh
npm ci
npm run git:setup
npm run check
```

The [delivery harness](./docs/HARNESS.md) owns session startup, Git workflow and check coverage. The default evaluation is synthetic replay; see [prompt evaluation](./docs/prompt-evaluation.md) for model trials and cross-platform setup.
