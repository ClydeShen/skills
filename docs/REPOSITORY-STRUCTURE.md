# Repository structure and sources of truth

This file defines the authoritative locations, folder rules, and lifecycle for this repository. Codex, Claude, and other delivery agents maintain the same artifacts. The [architecture decision](../research/harness/adr/0001-repository-sources-of-truth.md) records the rationale; [document formats](./DOCUMENT-FORMATS.md) defines content shapes.

## Sources of truth

A source of truth owns one kind of fact. Other files link to it or contain an explicitly derived representation.

| Fact                                                     | Authoritative artifact                                                             | Other representations                                                                                                             |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Shared agent operating instructions                      | Root `AGENTS.md`                                                                   | `CLAUDE.md` imports it                                                                                                            |
| Repository structure, ownership and lifecycle            | This file                                                                          | Root README and directory READMEs provide navigation                                                                              |
| Project document formats                                 | `docs/DOCUMENT-FORMATS.md`                                                         | Templates illustrate those formats                                                                                                |
| Shared vocabulary                                        | Root `GLOSSARY.md`                                                                 | Definitions are referenced, not redefined                                                                                         |
| Evidence and dated findings                              | `research/<category>/<topic>/`                                                     | Knowledge cites the research                                                                                                      |
| Architectural decision history                           | `research/<category>/adr/NNNN-<slug>.md`                                           | Repository docs state current rules and link to the decision                                                                      |
| Current reusable domain guidance                         | `knowledge/<topic>/`                                                               | Skill instructions adapt the relevant guidance                                                                                    |
| Portable skill lifecycle and evidence contract           | `knowledge/skill-lifecycle/`                                                       | This file maps package locations/stages; `docs/HARNESS.md` maps project tools and implementation status                           |
| Initiative stage, active package path and trial status   | `incubator/<initiative>/README.md`                                                 | Root README links to it                                                                                                           |
| Executable skill behavior and runtime resources          | The incubator authoring package's `SKILL.md`, `references/`, `scripts/`, `assets/` | `skills/` holds verified publication snapshots; never independently edit them                                                     |
| Initiative cases and assertions                          | `incubator/<initiative>/evals/`                                                    | `evaluation.md` records runs and interpretation                                                                                   |
| Shared evaluation implementation                         | Root `evals/`                                                                      | npm scripts and CI call it                                                                                                        |
| Repository checks and client-neutral hook implementation | Root `harness/`                                                                    | Client adapters, Git hooks and CI reuse it; `docs/HARNESS.md` explains coverage and activation                                    |
| Git workflow and session/cleanup instructions            | `docs/HARNESS.md` Git strategy                                                     | `AGENTS.md` links the procedure; `harness/git-policy.mjs`, Git hooks and CI enforce observable rules                              |
| Executable project commands and dependencies             | `package.json` and `package-lock.json`                                             | Agent instructions link to documented commands                                                                                    |
| Optional stricter `main` protection preset               | `.github/main-protection.json`                                                     | GitHub holds actual enforcement state; `docs/HARNESS.md` records the accepted soft policy and any separately requested activation |
| Imported development-skill provenance                    | `skills-lock.json` and its upstream sources                                        | `.agents/skills/` is the canonical installed tree; `.claude/skills/` is a synchronized projection                                 |

Reusable knowledge explains mechanisms and limits. A package defines installed behavior. These are distinct responsibilities: a runtime instruction must not require the knowledge tree to be installed. The initiative README records which knowledge informed the package.

Chat decisions and client auto-memory are inputs, not the durable repository record. When an authorized decision changes durable behavior, record it in the owning artifact in the same change. Record the date and decision authority. Label recommendations and unverified claims.

## Folder contract

```text
research/<category>/<topic>/NNNN-<slug>.md   # notes before 2026-11-05 keep <subject>-YYYY-MM-DD.md
research/<category>/adr/NNNN-<slug>.md
knowledge/<topic>/README.md
knowledge/<topic>/<subject>.md
incubator/<initiative>/README.md
incubator/<initiative>/candidate/<skill-name>/SKILL.md
incubator/<initiative>/evals/{README.md,suite.mjs,cases.json,trigger.json,scenarios.json}
incubator/<initiative>/evals/{scenarios,baseline,fixtures}/
incubator/<initiative>/evaluation.md
skills/<skill-name>/SKILL.md             # generated, verified publication snapshot; formatters ignore it
evals/{run.mjs,lib.mjs,...}
evals/.local/                         # ignored run artifacts
harness/                             # shared repository checks and their tests
docs/{HARNESS.md,REPOSITORY-STRUCTURE.md,DOCUMENT-FORMATS.md,...}
docs/templates/                      # repository document scaffolds
.agents/skills/                      # imported development tools
.claude/skills/                      # client projection
```

Use lowercase kebab-case for new directory and subject names. Use uppercase stems for harness framework documents, such as `AGENTS.md`, `CLAUDE.md`, `GLOSSARY.md`, `CONTEXT.md` when needed, and the framework standards listed above. Follow the [filename convention](./DOCUMENT-FORMATS.md#framework-document-filenames). Preserve standard filenames such as `README.md` and `SKILL.md`. Use four-digit ADR numbers within a category. Name a new research note `NNNN-<slug>.md`, numbered within its topic folder, with a slug of three or more words that states the finding or decision, not only the subject, and put the date in the note header. The number gives the order when several notes share a day, and the slug tells two notes of one subject apart. The notes named before 2026-11-05, with a date suffix, keep their names. A decision record keeps its `NNNN-<slug>.md` name in `adr/`. Distinguish dates in a note: explicitly distinguish an attachment's original date from its archival date.

Use flat `skills/<skill-name>/` for releases at the current scale. Add a category only when it has a real organizational need and the discovery check verifies its depth. Do not create `SKILL.md` at the repository root, `skills/`, or a category/container root. Those files can shadow packages below them.

Keep generated run output in ignored `evals/.local/`. Record a concise reproducible result in the initiative's `evaluation.md`; do not commit secrets, real user profiles, dependency installations or bulk run logs. Keep any approved, sanitized evaluation evidence with the initiative.

An initiative's `evals/` folder holds its cases and its quality boundary, not a history of experiments. `scenarios/` holds the inputs given to the skill, one file per scenario. `baseline/` holds the boundary: its commit, scores, reference outputs and the rule for a pass. `fixtures/` holds frozen files that tests read. Tests are `*.test.mjs` files directly in `evals/`, next to the shared cases. Do not commit dated trial directories. The record of a change is its pull request, and its run output stays in ignored `evals/.local/`. Only the owner moves a baseline.

## Candidate and release lifecycle

### Incubation stages

The owner defined `init`, `plan`, `draft`, `internal`, `public` and `release` on 2026-10-29. Their reusable meanings now live in the [lifecycle SOP](../knowledge/skill-lifecycle/sop.md#stages-and-gates). Record the current stage and its basis in the initiative README; keep outcomes and gaps in the evaluation record.

Local requirements: `internal` needs runnable cases in the shared [Promptfoo runner](./prompt-evaluation.md), grading criteria and a result path; until then it remains `draft`. `public` needs usable candidate installation and first-trial instructions, not completed external trials. `release` requires the verified snapshot in `skills/` and the [release checks](#installation-and-release-checks), including this project's matching skills.sh audit and package README. No stage is assigned from a score alone.

Owner rule, 2026-10-30: a skill at `draft` or an earlier stage is very early, so authors may use custom programs and methods to check feasibility and initial effect. Once evaluation cases are built for `internal`, they use the shared Promptfoo runner and no skill-specific evaluation framework. Draft-era methods, such as the Architecture Diagram round-trip, may remain as dated history or temporary diagnostics until the skill settles, then retire; they do not count as `internal` evaluation.

These stages replace the former broad README labels `candidate`, `external-trial` and `released` for current lifecycle reporting. Candidate names the authoring package location, including successors of published skills; it is not an additional stage. Preserve dated historical evaluation labels in their original context.

`public` describes installable test availability, not repository visibility or a formal release. A public-stage candidate can retain `metadata.internal: true` and provide explicit-path installation with `INSTALL_INTERNAL_SKILLS=1`. That CLI marker does not determine lifecycle stage. Record a pause separately from the stage. Update the README when work changes phase; elapsed time or a merged document alone does not advance it.

After release, keep the current published revision/path and the next revision's stage separate in the initiative README. An `internal` successor does not unpublish an existing release. Evaluation targets must identify whether they test authoring content or a publication snapshot.

### Package progression

1. Create or update the initiative README before introducing a package.
   Once the owner authorizes a specific skill's implementation, start with a minimal standard candidate package. Incubation is experimental maturity, not a script-only format. Keep behavior in `SKILL.md`, loadable guidance in `references/`, and reusable runtime helpers in `scripts/` only when needed. Research-only initiatives may remain without a package. Evaluation generators and delivery history stay outside the package. This clarification was requested by the owner on 2026-10-29.
2. Keep a new active candidate at `incubator/<initiative>/candidate/<skill-name>/`.
3. Give every independently authored skill a unique repository-wide name that does not collide with a locked development tool.
4. Match frontmatter `name` to the package's immediate directory name.
5. Keep candidate `metadata.internal: true` while using the current skills CLI.
6. Validate candidate format, package boundaries, references and discovery.
7. Record trial evidence separately from fixture checks.
8. On authorized release, select an explicit authoring commit and generate a verified snapshot at `skills/<skill-name>/`; retain the authoring source.
9. Remove the candidate-only internal marker from the snapshot, not the source. Declare and verify any other publication transformation.
10. Verify the actual snapshot and record its source commit, digest/ref and acceptance evidence in the initiative's evaluation record. Update trial/published status, test targets, installation instructions and affected links together.

Owner decision, 2026-11-06: keep one manually maintained authoring source in the incubator throughout the skill's life. `skills/` is its controlled publication surface, not another authoring tree. Source and snapshot correspond at publication, apart from declared transformations; later authoring changes must not alter the published snapshot automatically. This supersedes moving the source at release; [ADR 0004](../research/harness/adr/0004-versioned-skill-maintenance.md) records the trade-off. Follow [skill maintenance](./HARNESS.md#skill-maintenance) for repairs and hotfixes.

Candidates and snapshots use the same package format and runtime boundaries. Publication must not require redesigning instructions, rewriting runtime paths or importing repository dependencies. Keep the package relocatable; verify an isolated copy before promotion. Evaluation and authoring tools stay in the initiative, outside the runtime package.

Prune during incubation, not only at release. Remove superseded scratch files, unused helpers and duplicate current guidance after checking their callers and inbound links. Keep only useful runtime resources in the package; keep evaluation cases, generators and concise design evidence in the initiative. Preserve evidence still needed to explain or reproduce a recorded result. Do not rewrite frozen measurements or keep every abandoned experiment as current guidance; Git history can recover retired tracked material. Update navigation when removing files.

Only a declared, provenance-verified source/snapshot pair may share a skill name. Never rely on CLI name deduplication to prove that the correct copy is installed. Verify default discovery selects publication content, explicit candidate trials select authoring content, and neither depends on the other at runtime. Do not add a second manually maintained discovery registry. Future category nesting requires matching checks and actual installation evidence.

Use `npm run skill:publication -- stage <skill-name> <source-ref>` to generate a snapshot in a new system temporary directory outside this repository. The command reports the resulting package path. Use `npm run skill:publication -- verify <snapshot-directory>` to recheck it against its recorded source commit. An optional explicit staging directory must also be outside the repository and below the system temporary directory; its final name must match the skill. Do not store staged packages under ignored repository directories: the skills CLI can discover them despite Git ignore rules.

The tool requires package-local README and LICENSE files, strips only the internal marker, records a SHA-256 file inventory and refuses stable destinations or overwrites. Its `.publication.json` travels with the snapshot; it records provenance, not audit or human approval. Temporary snapshots are disposable; retain the source commit, digest and concise acceptance results in versioned evidence.

The duplicate-name checker permits only one candidate plus one flat publication snapshot whose manifest and actual content reproduce the declared source. Other duplicate sources still fail. Authoring may advance independently; verification uses the recorded source revision, not whichever source files are current. Staged export and pairing checks do not implement remote staging, platform audit binding, approval or stable promotion. Publication remains blocked until those acceptance checks are completed. No package is published merely by generating a snapshot.

The initiative retains source ownership, cases and feedback after release. Tests select the intended source or snapshot explicitly and fail if it is absent; do not silently fall back. The initiative README owns lifecycle/trial status, its evaluation record owns verification/release evidence, and package frontmatter owns package metadata.

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
- Filesystem inventory: no independent duplicate sources or shadowing container files; declared snapshots require source/provenance validation.
- Reproducible snapshot generation from the selected source commit, with a verified digest and only declared transformations.
- Package-local runtime resources and valid relative references, including case-sensitive paths.
- Actual default repository discovery lists exactly the intended released packages.
- Explicit candidate discovery lists the requested candidate only.
- Installation of the actual publication snapshot from a clean temporary checkout into an isolated client workspace includes required resources and does not select its incubator source instead.
- Relevant behavioral evidence is recorded; fixture success alone is not skill effectiveness.
- Each released package has its own `README.md` for first-time users, following [the package README contract](./DOCUMENT-FORMATS.md#skill-package-readme).
- The owner has approved the exact snapshot, by source commit and digest, on the checks above.
- After publication, the published version has a recorded skills.sh audit result. Record the audit URL, check date, repository revision or package digest, partner verdicts and any resolved findings in the initiative evaluation/release evidence. Local scanners and format validators do not substitute for this external audit.

Owner requirement, 2026-11-06: a matching skills.sh audit and a package-local README remain required for this project's default publication adapter. Owner decision, 2026-11-09: the audit is verified after publication, not before it. skills.sh generates an audit only after the first installation of a skill from its public repository, so an audit cannot precede publication in this repository. Other projects using the [portable standard](../knowledge/skill-lifecycle/README.md) choose their own publication target. Changing this project's target or acceptance policy requires an owner decision, not an agent workaround.

Publish only an owner-approved snapshot. Right after publication, install the package once from the repository in a disposable workspace, read the audit and record it. A missing, pending, unavailable or inconclusive audit is recorded as pending, not as a pass; check it again until a result exists. On an adverse finding, fix it in a new published version or withdraw the snapshot, and record which. Bind owner approval to the actual snapshot identity. Moving files or successfully installing them alone does not establish approval. See [the adapter's verified limits](../knowledge/skill-lifecycle/adapters/skills-sh.md#audit-limitation); exact-artifact audit binding remains unresolved.

The [selected adapter](../knowledge/skill-lifecycle/adapters/skills-sh.md) owns verified CLI/audit mechanisms and limits. The initiative evaluation record of each released skill holds its platform verdict.

One package is released: `skills/architecture-diagram/`, a verified snapshot of the Architecture Diagram candidate. Candidates stay out of default discovery; a repository with no released package lists no installable skills, which is not a reason to expose a candidate. Add an explicit package license or applicable inherited license before publishing; do not invent license terms for imported materials.

## Agent maintenance

Read `AGENTS.md`, then the owning standard for the change. Update authoritative content before its navigation or projections. When moving a file, update all inbound references and affected evaluation targets. Record verification and limits before handoff.

Use nested `AGENTS.md` only for local additions. Keep shared rules at the root. Do not commit `AGENTS.override.md` or conflicting client-specific rule trees without an explicit compatibility decision: clients resolve them differently. Client preferences and permissions do not redefine repository content ownership.

These maintenance rules are checked in part by the [shared engineering harness](./HARNESS.md). They do not establish a sandbox or prevent a privileged agent from editing its own instructions; the harness documents which controls need a separate host or server boundary.
