# Personal Agent Skills

## Start here

1. Read [`README.md`](README.md) for the lifecycle and repository map.
2. Read [`GLOSSARY.md`](GLOSSARY.md) before naming or changing a repository-wide concept.
3. Inspect the working tree. Preserve changes outside the task.
   Run `npm run git:setup` once per clone, then `npm run git:check` at session start. Resume the task's existing branch/worktree, or create `work/<kebab-case-topic>` from freshly fetched `origin/main` before editing. Concurrent independent sessions use separate worktrees. Follow [Git strategy](docs/HARNESS.md#git-strategy) for integration and cleanup.
   Git workflow checks are bypassable safeguards. Use a task-justified exception when needed and record its reason and skipped checks. Server-side protection is optional, not a setup blocker. Keep changes within the user's authorization and report actual verification results.
4. Search for the topic, its authoritative document, and inbound links. Start editing only after every affected artifact has an identified location.
5. Read [the source-of-truth and folder contract](docs/REPOSITORY-STRUCTURE.md) and [document formats](docs/DOCUMENT-FORMATS.md) before introducing or moving artifacts. Use uppercase stems for harness framework documents, as defined there.

## Place the work

Use [the folder contract](docs/REPOSITORY-STRUCTURE.md) for lifecycle, exact paths, active package ownership, development-tool projections, and promotion rules. Read [`knowledge/harness/README.md`](knowledge/harness/README.md) before changing the harness playbook; it defines file ownership, maintenance rules, and maturity updates.

Use [the shared delivery harness](docs/HARNESS.md) for coordination, check coverage, client hooks and handoff. All agents use the same commands; extra roles are optional. When work is delegated, assign disjoint write scopes or separate worktrees. One integrator owns the final combined check. Do not overwrite another agent's changes or describe author self-review as independent review.

## Make the change

Write repository content in English, including documents, prompts, examples and code comments. Conversation with the user may use their preferred language. Follow [the language convention](docs/DOCUMENT-FORMATS.md#common-conventions) when recording translated source material.

When creating, reviewing or revising a skill, use [the skill design principles](knowledge/skill-design/skill-design-principles.md). They guide behavioral value, model freedom, human interaction and evidence; package format remains in `docs/DOCUMENT-FORMATS.md`.

1. Change the authoritative artifact and the references that must agree with it. Create a `SKILL.md` only when the user asks to implement or revise a specific skill.
2. Follow [the writing standards](knowledge/harness/document-writing-standards.md) and [document purpose and maintenance](docs/DOCUMENT-FORMATS.md#document-purpose-and-maintenance). Integrate, consolidate and prune when editing; keep READMEs scoped to their folder and reader. Use only applicable template sections.
3. Keep shared knowledge independent of one skill. Keep files required at skill runtime inside that skill's package.
4. When a document moves or its purpose changes, update every inbound link and the relevant README map in the same change.
5. When the owner approves a terminology change, update `GLOSSARY.md`, then search the repository and update every affected use. Otherwise, preserve the canonical term.
6. Record feedback against the lifecycle stage that owns the cause. Promote a finding only after it becomes reusable knowledge or a verified skill change.
7. Follow `.editorconfig`. Finish editing only when the diff contains no unrelated cleanup or duplicate source of truth.

## Package and release skills

Before changing skill layout, validation, installation, or release behavior, verify time-sensitive claims against current official sources.

Follow [candidate and release rules](docs/REPOSITORY-STRUCTURE.md#candidate-and-release-lifecycle) and [package format](docs/DOCUMENT-FORMATS.md#skill-package-format). Maintain one active source per authored skill. Update package targets and links when promotion changes the source path.

Use the same package best practices during incubation and after release. Keep runtime files relocatable and authoring support outside the package. Prune obsolete material as the skill matures; preserve necessary evaluation evidence. Release should move the validated package, not rebuild it into another format.

## Project tools

Use `package.json` as the command source. Run `npm run check` before handing off a change. Use `npm run check:repo` for fast feedback. Read [prompt evaluation setup](docs/prompt-evaluation.md) for model configuration and test limits. `npm test` checks the harness; `npm run eval` is synthetic replay, not a model-quality gate. Keep credentials and local run results out of commits. Never weaken a gate just to make the task pass; report pre-existing failures and unavailable checks.

Validate `knowledge/harness/setup-checklist.yaml` against its adjacent schema when either changes. Keep stable checklist IDs and schema constraints consistent.

## Verify

1. Resolve every changed relative Markdown link against its containing file. Every target must exist.
2. Run `git diff --check`. Inspect the complete diff for scope, terminology, and stale navigation.
3. For a skill package, run the current Agent Skills reference validator on the package. Run `npx skills add . --list` from the repository root and confirm that every intended released skill appears exactly once.
4. If a required validator or network-backed check is unavailable, report the unverified check and the reason. Do not claim release readiness.
5. Inspect the authored package inventory independently; CLI name deduplication cannot prove uniqueness. Use the full [release checks](docs/REPOSITORY-STRUCTURE.md#installation-and-release-checks) before publication.
