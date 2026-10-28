# Research: Skill discovery, single sources, and directory boundaries

Date: 2026-10-25. Question: how can Codex and Claude maintain the same sources while keeping skills.sh / skills CLI installation predictable? Context: authored candidates live in the incubator, third-party development skills have two agent-directory projections, and future releases need continuing evaluation. This research round investigated options without changing the layout or policy.

Recommendation at the time: [inference] for a stable long-term system, an authored runtime package could have one source at `skills/<name>/` from its first draft, with incubation documents at `incubator/<name>/` and evaluation at `evals/suites/<name>/`. Unreleased packages would be hidden by default. This would change the existing released-only meaning of `skills/`, so it must not be treated as current policy without explicit adoption. The conservative alternative is to retain the candidate location and move the package atomically at release rather than copy it.

Evidence markers: `[official]` means the maintainers' documentation or source was read; `[measured]` records file and CLI observations from the original research round; `[inference]` identifies a project recommendation. Translation and source review do not rerun those historical checks.

## Overview

| Question | Recommendation at the time | Limit |
| --- | --- | --- |
| What determines an installable directory? | Check both discovery by a fixed CLI version and filesystem invariants | Default deduplication can hide conflicts |
| Can internal alone hide drafts? | Treat it as a CLI visibility extension | It is not a cross-client security or permission boundary |
| Should both candidate and release packages remain? | Keep one editable runtime source; do not maintain a copied release source | Separate release artifacts may be generated, but not edited independently |
| Where should evaluation live? | A stable project-level `evals/suites/<name>/` | Runtime packages must still be self-contained |
| Should a catalog be maintained manually? | Derive listings and package inventories from actual SKILL frontmatter | A third-party skills lock is not an authored-release registry |

## 1. What discovery rules mean in practice

### Evidence

[official] The creation guide describes standard containers, normal scanning up to three levels, a shallower SKILL.md shadowing descendants, `--full-depth`, and recursive fallback when no skills are found. Discovery includes the repository root, `skills/`, `.agents/skills/`, and `.claude/skills/`.[S1]

[official] The discovery source deduplicates by skill name by default. Installed project skills are excluded inside agent installation directories when their names or directory names match the local lock. Recursion skips directories such as node_modules. This exclusion depends on the lock and path; `.agents/` is not categorically excluded from discovery.[S2]

[measured] The cached skills CLI in the original research round was `1.7.4`. Its bundled implementation was read and agreed with the main behavior above. `skills-lock.json` recorded research and domain-modeling, and the two agent directories each contained identical bodies. Default root `add . --list` returned No skills found with exit code 1. Enabling internal and full-depth listed only meta-thinking with exit code 0. Both commands only listed skills; neither installed them.

### Recommendation for the project

[inference] Do not place SKILL.md at the repository root, `skills/`, or a category container. Prefer flat `skills/<name>/SKILL.md` paths so category depth does not complicate discovery. Keep names unique across authored packages. A default listing that shows a name once does not prove that no duplicates exist.

[inference] Manage third-party development skills through the lockfile and identify them as tooling dependencies. Deleting the lock, changing a skill name, or manually adding an authored package inside an installation directory can change public discovery. Release checks should verify that development dependencies do not enter the product listing.

### Relation to existing constraints

The existing unique-name, self-contained-package, and root-shadowing rules remain supported. Any actual layout change must update AGENTS.md, CLAUDE.md, README, and automated checks together.

## 2. Internal is a tool extension, not a lifecycle system

### Evidence

[official] The skills CLI documents `metadata.internal: true`. Its source compares the YAML value to the boolean `true`; the string `"true"` does not satisfy that comparison. `INSTALL_INTERNAL_SKILLS=1` or the implementation's includeInternal option makes such packages visible.[S1][S2]

[official] The Agent Skills specification describes metadata as a string key-value mapping and permits additional client metadata. It does not define the CLI's internal visibility semantics.[S3]

### Recommendation for the project

[inference] If this CLI extension remains in use, document the boolean internal field as a compatibility exception. Do not present it as a standard capability supported by all clients. Internal packages can still be explicitly loaded or discovered by other tools.

[inference] Lifecycle information could use a string `metadata.lifecycle`, with valid values and transitions defined by the project. It would not automatically change CLI behavior. If it became the sole lifecycle authority, checks would need to validate its relationship to internal rather than introduce a second manually maintained status table.

### Relation to existing constraints

The candidate already used boolean internal. Its earlier reference-validator pass does not erase the specification's string-value convention. If a linter detects the difference, document a scoped reason or handle it separately; changing it to a string to satisfy the linter would break the intended hiding behavior.

## 3. Two viable single-source layouts

### Evidence

[official] The specification requires SKILL.md in a package and permits resources such as references, scripts, and assets. The CLI reads actual directories and metadata. Neither requires independently maintained candidate and release bodies.[S1][S3]

### Recommendation for the project

[inference] The proposed stable layout was:

```text
skills/<name>/               # One authored runtime source: SKILL.md and local resources
incubator/<name>/            # Design, evaluation summaries, trials; no runtime copy
evals/suites/<name>/         # Cases, grading, and adapter configuration at a stable path
evals/                      # Shared runner, providers, and tooling tests
research/<category>/<topic>/ # Evidence and historical research
knowledge/<topic>/          # Current reusable knowledge
docs/                       # Repository policies, formats, lifecycle, and maintenance
```

[inference] Under this option, candidate and release paths stay the same. Release changes lifecycle and visibility after the criteria are met. Every runtime resource stays inside the package, which remains installable after the other repository directories are removed. `skills/` would no longer mean released packages only; that requires an explicit new policy.

[inference] The conservative option is also valid: `incubator/<name>/candidate/<name>/` is the sole candidate source, and the entire package moves to `skills/<name>/` after verification, leaving no editable copy. In that proposed variant, evaluation would still remain at root evals, and a scanned inventory would resolve the active source path. Select one layout rather than mix them.

[inference] The original preference for the stable-root option reflected the owner's work on long-term conventions while package count was small: stable paths would reduce reference changes during promotion. This was a project choice, not an Agent Skills requirement.

### Relation to existing constraints

In either layout, required runtime resources must not link back into research or knowledge. The shared principle is one editable source, with historical versions retained by Git.

## 4. Development skills and client-specific directories

### Evidence

[official] The installer distinguishes a canonical directory from agent views and supports copy, symlink, and link behavior. It uses junctions on Windows and includes copy fallbacks. A source directory and an installed view are different concepts.[S4]

### Recommendation for the project

[inference] Do not author separate copies of the same skill in `.claude/skills/` and `.agents/skills/`. Third-party development skills derive from their recorded upstream or locked version; tools generate local installation views. If several views are retained for compatibility, verify that they match one upstream version and change them by refreshing the dependency.

[inference] Keep repository-wide rules in one authoritative file. Claude and Codex entry points import or direct agents to it. Client permissions retain their own formats, but call the same project check command. Different client-directory formats do not justify different lifecycle rules.

### Relation to existing constraints

Development tools need not become this project's published products. Imported skills already have lock records and must not be mistaken for authored releases during a layout change.

## 5. Derived catalogs and executable invariants

### Evidence

[official] The CLI gets names, descriptions, and paths from SKILL frontmatter. Default name deduplication is discovery behavior, not repository-wide uniqueness validation.[S2]

### Recommendation for the project

[inference] Scan the one runtime source tree to derive an inventory or catalog of names, paths, descriptions, and lifecycle. If a generated file is committed, check that regeneration produces no diff. If it is only used by checks, it need not be committed. Do not hand-maintain another registry duplicating source names, paths, and statuses.

[inference] A future shared gate should at least check:

- Source directories match names, and authored package names are unique.
- No root or container SKILL.md shadows descendant packages.
- Package links exist and remain inside the package after resolving real paths, including symlink escapes.
- Candidate hiding and release visibility agree with lifecycle; imported tools stay out of the product list.
- Candidate and release locations do not contain two editable runtime copies.
- Every suite targets a real package; expectations and fixtures stay out of model input.
- Default discovery by the selected CLI matches the inventory's release list; full-depth checks separately detect unexpected packages and name conflicts.

[inference] `.gitignore` controls Git tracking, not skills CLI publication exclusions. Directory rules, metadata, and actual discovery checks must work together.

### Relation to existing constraints

This turns manual understanding of the layout into checks shared by Codex, Claude, local development, and CI, rather than adding an independent registration workflow.

## Judgment confidence

The layout recommendation had medium confidence, 3.0: Owner 1 (explicit request for a unified source of truth), Research 1 (specification and source read), Reasoning 0.5 (still a project proposal), Project history 0.5 (a small existing layout, no migration trial). This support does not imply identical discovery across arbitrary clients.

## Not verified

- The original research did not install or update the skills CLI; it used cached `1.7.4` for read-only listing.
- It did not move runtime packages, suites, or installed views, or change policies and checks.
- It did not verify other clients' handling of internal or lifecycle extensions.
- It did not verify remote skills.sh indexing or refresh timing for this repository.
- Main-branch source and the fixed CLI were not the same version; repeat discovery checks before an upgrade.

## Decisions for the owner

The original decision was whether to adopt a stable runtime root or retain a one-time release move. The checks should implement the selected option, not maintain both.

### Subsequent layout decision (2026-10-25)

After the owner authorized the main task to choose a layout, the main agent adopted the conservative one-time move and kept evaluations under their initiative. This preserved the confirmed released-only meaning of `skills/`, avoided making all draft visibility depend on a CLI extension, and retained one active runtime source. Promotion must update suite targets in the same change. The original preference for a fixed source path remains a considered alternative, not an unresolved decision. Current rules are in the [structure standard](../../../docs/REPOSITORY-STRUCTURE.md), with the trade-off in [ADR 0001](../adr/0001-repository-sources-of-truth.md).

## Sources

- [S1 — skills CLI creation and discovery guide](https://raw.githubusercontent.com/vercel-labs/skills/main/docs/creating-skills.md): scan depth, shadowing, internal visibility, and fallback.
- [S2 — skills CLI discovery source](https://raw.githubusercontent.com/vercel-labs/skills/main/src/skills.ts): lock-based exclusion, boolean checks, deduplication, and scan rules; the original research also read the corresponding local 1.7.4 bundle.
- [S3 — Agent Skills specification](https://agentskills.io/specification): standard package structure and string metadata convention.
- [S4 — skills CLI installer](https://raw.githubusercontent.com/vercel-labs/skills/main/src/installer.ts): sources, canonical installation paths, views, and platform handling.
- [S5 — skills CLI add source](https://raw.githubusercontent.com/vercel-labs/skills/main/src/add.ts): targeted inspection of the discovery and installation entry points, not exhaustive verification of CLI behavior.
