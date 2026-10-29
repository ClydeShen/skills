# Repository structure and sources of truth

This file defines the authoritative locations, folder rules, and lifecycle for this repository. Codex, Claude, and other delivery agents maintain the same artifacts. The [architecture decision](../research/harness/adr/0001-repository-sources-of-truth.md) records the rationale; [document formats](./DOCUMENT-FORMATS.md) defines content shapes.

## Sources of truth

A source of truth owns one kind of fact. Other files link to it or contain an explicitly derived representation.

| Fact | Authoritative artifact | Other representations |
| --- | --- | --- |
| Shared agent operating instructions | Root `AGENTS.md` | `CLAUDE.md` imports it |
| Repository structure, ownership and lifecycle | This file | Root README and directory READMEs provide navigation |
| Project document formats | `docs/DOCUMENT-FORMATS.md` | Templates illustrate those formats |
| Shared vocabulary | Root `GLOSSARY.md` | Definitions are referenced, not redefined |
| Evidence and dated findings | `research/<category>/<topic>/` | Knowledge cites the research |
| Architectural decision history | `research/<category>/adr/NNNN-<slug>.md` | Repository docs state current rules and link to the decision |
| Current reusable domain guidance | `knowledge/<topic>/` | Skill instructions adapt the relevant guidance |
| Initiative stage, active package path and trial status | `incubator/<initiative>/README.md` | Root README links to it |
| Executable skill behavior and runtime resources | The one active package's `SKILL.md`, `references/`, `scripts/`, `assets/` | No independently maintained candidate/release copies |
| Initiative cases and assertions | `incubator/<initiative>/evals/` | `evaluation.md` records runs and interpretation |
| Shared evaluation implementation | Root `evals/` | npm scripts and CI call it |
| Repository checks and client-neutral hook implementation | Root `harness/` | Client adapters, Git hooks and CI reuse it; `docs/HARNESS.md` explains coverage and activation |
| Git workflow and session/cleanup instructions | `docs/HARNESS.md` Git strategy | `AGENTS.md` links the procedure; `harness/git-policy.mjs`, Git hooks and CI enforce observable rules |
| Executable project commands and dependencies | `package.json` and `package-lock.json` | Agent instructions link to documented commands |
| Optional stricter `main` protection preset | `.github/main-protection.json` | GitHub holds actual enforcement state; `docs/HARNESS.md` records the accepted soft policy and any separately requested activation |
| Imported development-skill provenance | `skills-lock.json` and its upstream sources | `.agents/skills/` is the canonical installed tree; `.claude/skills/` is a synchronized projection |

Reusable knowledge explains mechanisms and limits. A package defines installed behavior. These are distinct responsibilities: a runtime instruction must not require the knowledge tree to be installed. The initiative README records which knowledge informed the package.

Chat decisions and client auto-memory are inputs, not the durable repository record. When an authorized decision changes durable behavior, record it in the owning artifact in the same change. Record the date and decision authority. Label recommendations and unverified claims.

## Folder contract

```text
research/<category>/<topic>/<subject>-YYYY-MM-DD.md
research/<category>/adr/NNNN-<slug>.md
knowledge/<topic>/README.md
knowledge/<topic>/<subject>.md
incubator/<initiative>/README.md
incubator/<initiative>/candidate/<skill-name>/SKILL.md
incubator/<initiative>/evals/{suite.mjs,cases.json}
incubator/<initiative>/evaluation.md
skills/<skill-name>/SKILL.md
evals/{run.mjs,lib.mjs,...}
evals/.local/                         # ignored run artifacts
harness/                             # shared repository checks and their tests
docs/{HARNESS.md,REPOSITORY-STRUCTURE.md,DOCUMENT-FORMATS.md,...}
docs/templates/                      # repository document scaffolds
.agents/skills/                      # imported development tools
.claude/skills/                      # client projection
```

Use lowercase kebab-case for new directory and subject names. Use uppercase stems for harness framework documents, such as `AGENTS.md`, `CLAUDE.md`, `GLOSSARY.md`, `CONTEXT.md` when needed, and the framework standards listed above. Follow the [filename convention](./DOCUMENT-FORMATS.md#framework-document-filenames). Preserve standard filenames such as `README.md` and `SKILL.md`. Use four-digit ADR numbers within a category. Research filenames use the recording date; explicitly distinguish an attachment's original date from its archival date.

Use flat `skills/<skill-name>/` for releases at the current scale. Add a category only when it has a real organizational need and the discovery check verifies its depth. Do not create `SKILL.md` at the repository root, `skills/`, or a category/container root. Those files can shadow packages below them.

Keep generated run output in ignored `evals/.local/`. Record a concise reproducible result in the initiative's `evaluation.md`; do not commit secrets, real user profiles, dependency installations or bulk run logs. Keep any approved, sanitized evaluation evidence with the initiative.

## Candidate and release lifecycle

1. Create or update the initiative README before introducing a package.
   Once the owner authorizes a specific skill's implementation, start with a minimal standard candidate package. Incubation is experimental maturity, not a script-only format. Keep behavior in `SKILL.md`, loadable guidance in `references/`, and reusable runtime helpers in `scripts/` only when needed. Research-only initiatives may remain without a package. Evaluation generators and delivery history stay outside the package. This clarification was requested by the owner on 2026-10-29.
2. Keep a new active candidate at `incubator/<initiative>/candidate/<skill-name>/`.
3. Give every authored skill a unique repository-wide name that does not collide with a locked development tool.
4. Match frontmatter `name` to the package's immediate directory name.
5. Keep candidate `metadata.internal: true` while using the current skills CLI.
6. Validate candidate format, package boundaries, references and discovery.
7. Record trial evidence separately from fixture checks.
8. On authorized release, move the package into `skills/<skill-name>/`.
9. Remove the candidate-only internal marker from the released package.
10. Update the initiative stage, evaluation target, installation instructions and all affected links in the same change.

Release moves the package; it does not leave another editable source copy. Git history preserves the former candidate. Once released, maintain that skill's active source in `skills/`; use branches/worktrees for revisions rather than a second same-name package. Rename or split packages only through an explicit decision with updated references.

Owner clarification, 2026-10-29: candidates and releases follow the same skill design, package format and runtime-boundary practices from the start. Their difference is maturity and publication status, not a separate experimental format. Keep the candidate relocatable: moving its directory to the release location must not require rewriting instructions, changing internal paths, copying in repository dependencies or rebuilding a different distribution. If relocation requires those changes, repair the candidate before promotion.

Prune during incubation, not only at release. Remove superseded scratch files, unused helpers and duplicate current guidance after checking their callers and inbound links. Keep only useful runtime resources in the package; keep evaluation cases, generators and concise design evidence in the initiative. Preserve evidence still needed to explain or reproduce a recorded result. Do not rewrite frozen measurements or keep every abandoned experiment as current guidance; Git history can recover retired tracked material. Update navigation when removing files.

The final migration should therefore be small: move the validated package, remove its candidate-only discovery marker, update repository-side paths and documentation, and verify installation. Add skills CLI discovery configuration only if the chosen layout needs it. Standard `skills/` locations are already discovered; do not create a second hand-maintained skill registry or expose the incubator through a custom discovery path. Category nesting remains subject to the folder contract and an actual discovery check. Verify an isolated copy of the package during incubation so missing runtime dependencies are found before release.

The initiative workspace remains after release to own its design history, evaluation cases and feedback. Its stage is `released`; its active package path points to `skills/`. Consequently, tests need not move when the package is promoted. The suite must target the active package path and must fail clearly if that target is absent. Do not silently fall back to an old copy.

The initiative README owns lifecycle and trial status. Do not add a hand-maintained second catalog or status manifest. Package frontmatter owns package metadata. Installation listings are derived from package discovery, not manually curated in another index.

## Installed development tools

Development skills are dependencies of this authoring repository, not published products. Update them through their recorded upstream source. Preserve source and lock information. If a local fork is necessary, record that fork and its provenance explicitly.

`skills-lock.json` records sources and update metadata; it does not by itself guarantee an immutable upstream revision, complete installation reconciliation or reproducible installed content. Review the upstream revision and tool version during an update, and compare the local projections separately.

Treat `.agents/skills/` as the canonical installed tree when a local projection is required. Synchronize `.claude/skills/` from it; never edit the two copies independently. Prefer a deterministic copy-and-compare process that works on Windows rather than relying on symlinks. Verify that frontmatter and resources stay equivalent after an update.

The skills CLI currently excludes project-installed dependencies by entries in `skills-lock.json`. Do not rely on directory naming alone to keep development tools out of public discovery. Test the installed CLI behavior and the package inventory separately. Name deduplication can hide duplicate authored packages, and explicit/full-depth discovery can expose candidates.

`metadata.internal` is a CLI discovery extension, not a permission boundary or universal client behavior. Candidate users must select that path explicitly. Never make installation require the repository's authoring helpers, root agent instructions or evaluation dependencies.

## Installation and release checks

The documented public install command is `npx skills add ClydeShen/skills --skill <skill-name>`. It is valid only after the package has been released, pushed and verified discoverable. Do not advertise a candidate as released.

Before release, verify these independent properties:

- Format compatibility with a pinned reference validator.
- Filesystem inventory: no duplicate authored names or shadowing container files.
- Package-local runtime resources and valid relative references, including case-sensitive paths.
- Actual default repository discovery lists exactly the intended released packages.
- Explicit candidate discovery lists the requested candidate only.
- Installation from a clean temporary checkout into an isolated client workspace includes required resources.
- Relevant behavioral evidence is recorded; fixture success alone is not skill effectiveness.

No released packages currently exist. For that state, a CLI result of no installable skills can be expected; it is not a reason to expose the candidate. Add an explicit package license or applicable inherited license before publishing; do not invent license terms for imported materials.

## Agent maintenance

Read `AGENTS.md`, then the owning standard for the change. Update authoritative content before its navigation or projections. When moving a file, update all inbound references and affected evaluation targets. Record verification and limits before handoff.

Use nested `AGENTS.md` only for local additions. Keep shared rules at the root. Do not commit `AGENTS.override.md` or conflicting client-specific rule trees without an explicit compatibility decision: clients resolve them differently. Client preferences and permissions do not redefine repository content ownership.

These maintenance rules are checked in part by the [shared engineering harness](./HARNESS.md). They do not establish a sandbox or prevent a privileged agent from editing its own instructions; the harness documents which controls need a separate host or server boundary.
