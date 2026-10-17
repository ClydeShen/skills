# Personal Agent Skills

## Start here

1. Read [`README.md`](README.md) for the lifecycle and repository map.
2. Read [`GLOSSARY.md`](GLOSSARY.md) before naming or changing a repository-wide concept.
3. Inspect the working tree. Preserve changes outside the task.
4. Search for the topic, its authoritative document, and inbound links. Start editing only after every affected artifact has an identified location.

## Place the work

Use the lifecycle `research → knowledge → incubator → external trial → skills`. Feedback from trials can return to research, knowledge, or incubation.

| Directory | Put here | Done when |
|---|---|---|
| `research/` | Dated evidence and conclusions for a question | The note follows the research template, identifies sources and confidence, and preserves superseded conclusions with a correction. |
| `knowledge/` | Current domain knowledge reusable by multiple skills | The guidance synthesizes its evidence and contains no skill-specific packaging. |
| `incubator/` | A concrete skill initiative, candidate package, evaluations, and trial feedback | The initiative has enough isolated material to verify and improve before release. |
| `skills/` | Released, installable skill packages, optionally grouped by category | Each package is self-contained and passes format and repository-discovery checks. |
| `docs/` | This repository's structure, lifecycle, quality model, release process, and decisions | The repository procedure or decision has one authoritative home and correct navigation. |

Read [`docs/README.md`](docs/README.md) when placement is unclear. Read [`knowledge/harness/README.md`](knowledge/harness/README.md) before changing the harness playbook; it defines file ownership, maintenance rules, and maturity updates.

## Make the change

1. Change the authoritative artifact and the references that must agree with it. Create a `SKILL.md` only when the user asks to implement or revise a specific skill.
2. Follow [the writing standards](knowledge/harness/document-writing-standards.md) for terminology, procedures, research evidence, dates, and decisions. Use a template under `knowledge/harness/templates/` when its document type matches the task.
3. Keep shared knowledge independent of one skill. Keep files required at skill runtime inside that skill's package.
4. When a document moves or its purpose changes, update every inbound link and the relevant README map in the same change.
5. When the owner approves a terminology change, update `GLOSSARY.md`, then search the repository and update every affected use. Otherwise, preserve the canonical term.
6. Record feedback against the lifecycle stage that owns the cause. Promote a finding only after it becomes reusable knowledge or a verified skill change. Before changing feedback intake or triage, read [`research/github-feedback-system-2026-10-18.md`](research/github-feedback-system-2026-10-18.md).
7. Follow `.editorconfig`. Finish editing only when the diff contains no unrelated cleanup or duplicate source of truth.

## Package and release skills

Before changing skill layout, validation, installation, or release behavior, read [`research/skills-sh-publishing-and-repository-layout-2026-10-18.md`](research/skills-sh-publishing-and-repository-layout-2026-10-18.md) and verify time-sensitive claims against current official sources.

- Put released packages below `skills/`. Keep the repository root, `skills/`, and category directories free of `SKILL.md` files that would shadow nested packages.
- Add a category directory when its first released package needs it. Treat categories as source organization, not skill namespaces.
- Give every skill a repository-wide unique name. Match frontmatter `name` to the immediate parent directory.
- Keep install-time references, scripts, and assets inside the package. A released skill must not depend on `research/`, `knowledge/`, or `incubator/`.

## Verify

1. Resolve every changed relative Markdown link against its containing file. Every target must exist.
2. Run `git diff --check`. Inspect the complete diff for scope, terminology, and stale navigation.
3. For a skill package, run the current Agent Skills reference validator on the package. Run `npx skills add . --list` from the repository root and confirm that every intended released skill appears exactly once.
4. If a required validator or network-backed check is unavailable, report the unverified check and the reason. Do not claim release readiness.
