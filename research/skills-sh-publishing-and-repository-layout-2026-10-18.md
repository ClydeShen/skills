# Research: skills.sh publishing and repository layout

Date: 2026-10-18. Subject: how the `skills` CLI discovers, installs, manages, and publishes Agent Skills, and what those rules imply for a personal repository with several skill categories. Context: the repository will eventually publish installable skills through skills.sh, but the immediate decision is only its directory structure. No skill was created as part of this research.

Confidence markers:
- **[official]**: the relevant part of official skills.sh or Vercel documentation, the `vercel-labs/skills` repository, or the Agent Skills specification was read.
- **[inference]**: a repository recommendation derived from the documented behavior; it is not a skills.sh requirement.
- **[measured]**: a command was run against the stated source on 2026-10-18.

## Overview

| Question | Finding or recommendation | Strength of evidence | Confidence |
|---|---|---|---|
| What is skills.sh? | It is a public discovery and ranking directory backed by the open-source `skills` CLI. The CLI installs the same portable skill format into many agent clients. | strong | [official] |
| How are skills published? | There is no publish or submission command. Put valid skills in a Git repository, share the repository, and let users install it. Installs reported by anonymous telemetry cause public skills to appear in skills.sh rankings. | strong | [official] |
| Does a categorized repository work? | Yes. The documented default discovery layout includes `skills/<category>/<skill>/SKILL.md`, and even permits a second category level. | strong | [official] |
| Should this repository have a root `SKILL.md`? | No. Without `--full-depth`, a root `SKILL.md` makes the repository resolve as one skill and prevents normal discovery of nested catalog skills. | strong | [official] |
| Are categories namespaces? | No. Discovery and installation identify a skill by its frontmatter `name`; category paths are not retained as an installed namespace. Names should therefore be unique across the whole repository. | strong | [official] / [inference] |
| Do repository folders control categories on skills.sh? | No. After the repository is listed, an optional root `skills.sh.json` controls display groupings on its skills.sh page; it does not affect CLI discovery or installation. | strong | [official] |
| What other top-level directories are required? | None. skills.sh only needs discoverable skill directories. A root README and license are recommended for a public repository; research or authoring directories are local repository choices, not publishing requirements. | strong | [official] / [inference] |

## 1. Characteristics of skills.sh and the `skills` CLI

### Documented facts

- The CLI describes itself as the CLI for the open Agent Skills ecosystem and currently lists support for Codex, Claude Code, Cursor, OpenCode, and many other agents. Skills follow the shared Agent Skills specification, although optional features such as `allowed-tools`, hooks, or forked context are not uniformly supported. [skills CLI README](https://github.com/vercel-labs/skills/blob/main/README.md#skills) [compatibility table](https://github.com/vercel-labs/skills/blob/main/README.md#compatibility) **[official]**
- A skill is a directory containing `SKILL.md`. The minimum frontmatter is `name` and `description`; the body contains instructions. The specification also permits optional `license`, `compatibility`, `metadata`, and experimental `allowed-tools` fields. [Agent Skills specification](https://agentskills.io/specification) **[official]**
- Skills use progressive disclosure: clients first expose only `name` and `description`, load the complete `SKILL.md` when the skill is activated, and load bundled files only when needed. The specification recommends a `SKILL.md` under 500 lines and 5,000 tokens, with details split into supporting files. [Agent Skills specification](https://agentskills.io/specification#progressive-disclosure) **[official]**
- A skill may contain arbitrary supporting files. The conventional directories are `scripts/`, `references/`, and `assets/`; these are conventions inside each skill, not required repository-level directories. [Agent Skills specification](https://agentskills.io/specification#optional-directories) **[official]**
- The default installation scope is the current project; `-g` selects global/user scope. The CLI keeps a canonical copy and, interactively, recommends symlinking it into agent-specific locations; copying is also supported. [skills CLI README](https://github.com/vercel-labs/skills/blob/main/README.md#installation-scope) **[official]**
- The CLI accepts GitHub shorthand, GitHub/GitLab/Azure or other Git URLs, direct repository subpaths, local paths, direct `SKILL.md` downloads, and supported archives. It also supports private Git repositories through existing Git, GitHub CLI, SSH, or explicit token authentication. [skills CLI README](https://github.com/vercel-labs/skills/blob/main/README.md#source-formats) **[official]**

### Implications for this repository

- **[inference]** Treat every directory that contains a `SKILL.md` as an independently installable package. Runtime references and scripts needed by that skill belong inside the skill directory so that the directory remains self-contained after installation.
- **[inference]** Do not design around agent-specific optional frontmatter unless the skill explicitly targets that agent. The portable core is `name`, `description`, Markdown instructions, and bundled files.

## 2. How users install and manage skills

The following commands are documented by the official CLI README. [skills CLI README](https://github.com/vercel-labs/skills/blob/main/README.md)

```sh
# Inspect what a repository exposes without installing it
npx skills add owner/repo --list

# Install interactively
npx skills add owner/repo

# Install only named skills
npx skills add owner/repo --skill skill-one --skill skill-two

# Install globally, to a specific agent, without prompts
npx skills add owner/repo --skill skill-one -g -a codex -y

# Install all repository skills to all detected/supported agents
npx skills add owner/repo --all

# Use one skill without permanently installing it
npx skills use owner/repo@skill-one
npx skills use owner/repo --skill skill-one --agent claude-code

# List installed project skills; list global skills; machine-readable output
npx skills list
npx skills list -g
npx skills list --json

# Search the directory
npx skills find
npx skills find typescript
npx skills find react --owner owner

# Update all, selected, project-only, or global-only skills
npx skills update
npx skills update skill-one skill-two
npx skills update -p
npx skills update -g

# Remove interactively, by skill name, by exact source, or everything
npx skills remove
npx skills remove skill-one
npx skills remove owner/repo
npx skills remove --all
```

Important distinctions:

- `npx skills add owner/repo --list` lists skills available from a source; `npx skills list` lists skills already installed locally. **[official]**
- Project installation locations vary by target agent. Codex and several other clients use `.agents/skills/`; Claude Code uses `.claude/skills/`. The CLI handles those paths. [supported agents table](https://github.com/vercel-labs/skills/blob/main/README.md#supported-agents) **[official]**
- `skills use` resolves the source like `skills add`, writes the selected skill to a temporary directory, then emits a prompt or starts a supported agent when `--agent` is supplied. [skills CLI README](https://github.com/vercel-labs/skills/blob/main/README.md#use-a-skill-without-installing) **[official]**
- `skills update` updates installed skills recorded from their sources. It should not be treated as discovery of newly added skills in the same repository; users can rerun `add ... --list` to see the repository's current catalog. The latter limitation is visible in the current command model, but no promise about automatic new-skill discovery is made in the user documentation. **[inference]**

## 3. Exact repository discovery rules

### Documented default rules

The official README says that known skill container directories are walked up to three directory levels. For `skills/`, these supported shapes are: [skills CLI discovery documentation](https://github.com/vercel-labs/skills/blob/main/README.md#skill-discovery)

```text
skills/<skill>/SKILL.md
skills/<category>/<skill>/SKILL.md
skills/<category>/<category>/<skill>/SKILL.md
```

The repository root, `skills/`, special Vercel collection directories such as `skills/.curated/`, and many agent-specific skill containers are known search locations. Plain `skills/` is the neutral public-repository choice. A `SKILL.md` found at a shallower directory stops traversal below that directory. `--full-depth` expands discovery beyond the normal container search, including places such as `examples/` and `tests/`. **[official]**

### Root and shadowing behavior verified in source

The CLI implementation and tests make these edge cases explicit. The source inspected was `vercel-labs/skills` version `1.7.2`, commit `13e4063a1cf913f5606d57d42ab83a86f5001e04`. **[measured]**

- If the selected source path itself contains `SKILL.md`, normal discovery returns that root skill immediately. Nested skills become visible only with `--full-depth`. [implementation](https://github.com/vercel-labs/skills/blob/13e4063a1cf913f5606d57d42ab83a86f5001e04/src/skills.ts#L180-L239) [tests](https://github.com/vercel-labs/skills/blob/13e4063a1cf913f5606d57d42ab83a86f5001e04/tests/full-depth-discovery.test.ts#L26-L101) **[official]**
- Within a known container, once a child directory contains `SKILL.md`, traversal does not continue below it. Therefore `skills/harness/SKILL.md` would make `harness` a skill and hide `skills/harness/<skill>/SKILL.md` under default discovery. [implementation](https://github.com/vercel-labs/skills/blob/13e4063a1cf913f5606d57d42ab83a86f5001e04/src/skills.ts#L269-L292) [tests](https://github.com/vercel-labs/skills/blob/13e4063a1cf913f5606d57d42ab83a86f5001e04/tests/nested-container-discovery.test.ts#L63-L75) **[official]**
- Default traversal under `skills/` reaches a skill folder at depth three beneath the container, which corresponds to at most two category levels. A still deeper skill requires `--full-depth`. [implementation](https://github.com/vercel-labs/skills/blob/13e4063a1cf913f5606d57d42ab83a86f5001e04/src/constants.ts#L1-L6) [tests](https://github.com/vercel-labs/skills/blob/13e4063a1cf913f5606d57d42ab83a86f5001e04/tests/nested-container-discovery.test.ts#L132-L147) **[official]**
- Duplicate frontmatter names are deduplicated during normal discovery, and installation uses the sanitized skill name for the canonical and agent-specific directory rather than retaining its category path. [discovery implementation](https://github.com/vercel-labs/skills/blob/13e4063a1cf913f5606d57d42ab83a86f5001e04/src/skills.ts#L217-L267) [installer implementation](https://github.com/vercel-labs/skills/blob/13e4063a1cf913f5606d57d42ab83a86f5001e04/src/installer.ts#L321-L337) **[official]**
- If normal priority-directory discovery finds nothing, the current on-disk implementation falls back to a bounded recursive search. This is an implementation fallback, not a good catalog layout to depend on. [implementation](https://github.com/vercel-labs/skills/blob/13e4063a1cf913f5606d57d42ab83a86f5001e04/src/skills.ts#L294-L311) **[official]**

### Constraints for a multi-category repository

1. **Do not put `SKILL.md` at the repository root.** It changes the default meaning of the repository from “catalog of skills” to “one root skill.” **[official]**
2. **Do not put `SKILL.md` in `skills/` itself or in a category directory.** It shadows the installable skill directories below it. **[official]**
3. **Use one category level by default:** `skills/<category>/<skill>/SKILL.md`. A second level works but spends the complete documented depth budget and makes navigation more complex. **[official] / [inference]**
4. **Make every skill name globally unique across the repository.** `harness/review` and `engineering/review` do not create two namespaced `review` skills; the category path is organization only. **[official] / [inference]**
5. **Do not require users to pass `--full-depth`.** Public install instructions should work with the ordinary `npx skills add owner/repo` command. **[inference]**

## 4. Publishing and skills.sh listing

### Documented facts

- There is no `publish` command and no registry submission or pull-request flow. Vercel's guide says to put the skill in a Git repository, share it, and let users install it with `npx skills add`; it can then appear on skills.sh through install telemetry. [Vercel publishing guide](https://vercel.com/kb/guide/agent-skills-creating-installing-and-sharing-reusable-agent-context#5-publishing-and-discoverability-how-listing-actually-works) **[official]**
- The skills.sh FAQ states that skills appear on the leaderboard automatically when users install them with `npx skills add <owner/repo>` and are ranked from aggregate install counts. [skills.sh FAQ](https://skills.sh/docs/faq) **[official]**
- Anonymous telemetry is enabled by default and can be disabled with `DISABLE_TELEMETRY=1` or `DO_NOT_TRACK=1`. The CLI README says GitHub repository and skill identifiers are sent only when GitHub confirms that the repository is public. [skills CLI telemetry documentation](https://github.com/vercel-labs/skills/blob/main/README.md#telemetry) **[official]**
- The public-repository guide recommends a README explaining each skill and its install command, clear licensing and ownership, and safety notes for executable scripts. [Vercel publishing guide](https://vercel.com/kb/guide/agent-skills-creating-installing-and-sharing-reusable-agent-context#what-you-should-include-in-a-public-skill-repo) **[official]**

### Practical publication workflow

1. Host the repository publicly on GitHub. Other Git hosts are installable, but the official discovery FAQ specifically describes GitHub-hosted skills, and public GitHub visibility is explicitly checked before telemetry. **[official] / [inference]**
2. Make each published directory conform to the Agent Skills specification and keep its `name` equal to its immediate parent directory name. **[official]**
3. Push the repository. It is immediately addressable by `npx skills add <owner>/<repo>`; there is no separate release upload. **[official]**
4. From a clean test directory, run `npx skills add <owner>/<repo> --list` and confirm that every intended skill appears exactly once. **[official] / [inference]**
5. Test a selective install with `--skill <name>` into each agent that the repository claims to support. **[inference]**
6. Share the repository and exact install commands. A genuine telemetry-enabled install supplies the event from which skills.sh listing and ranking are built. **[official]**

The official pages do not document an indexing interval, a guaranteed time to first appearance, or a minimum install count. Do not promise any of those. **[official: not specified]**

### Optional skills.sh page grouping

After a public GitHub repository has a page on skills.sh, its owner may commit `skills.sh.json` at the repository root to group skills on that page. The configuration names skill slugs explicitly and affects only the skills.sh presentation; it does not change CLI discovery, installation, or `SKILL.md`. Changes are picked up after a telemetry-enabled install and may be delayed by processing and page caches. [skills.sh customization documentation](https://skills.sh/docs/customize) **[official]**

This means the `skills/harness/`, `skills/engineering/`, and `skills/management/` folders organize the source repository, while eventual skills.sh page groups are a separate presentation layer. **[official] / [inference]**

## 5. Validation and testing workflow

There are three different checks; passing one does not replace the others.

### A. Validate the format of each skill

The Agent Skills specification recommends the reference validator:

```sh
skills-ref validate ./skills/harness/example-skill
```

It checks the `SKILL.md` frontmatter and naming conventions, including the requirement that the frontmatter `name` match the immediate parent directory. The `skills-ref` repository labels the library a demonstration/reference implementation rather than a production library, so it is suitable as a conformance check but should not be confused with a package registry. [spec validation section](https://agentskills.io/specification#validation) [skills-ref README](https://github.com/agentskills/agentskills/tree/main/skills-ref) **[official]**

### B. Validate repository discovery and installation

```sh
# Before publishing: test the local checkout
npx skills add . --list

# After pushing: test the exact public source users will enter
npx skills add <owner>/<repo> --list

# In a disposable project, test one actual installation
npx skills add <owner>/<repo> --skill <skill-name> -a codex -y
npx skills list -a codex
```

This catches repository-layout failures that a per-skill format validator cannot catch: shadowing, excessive category depth, duplicate names, omitted skills, and remote-source resolution. **[official] / [inference]**

### C. Evaluate whether the skill improves agent behavior

The official Agent Skills evaluation guide recommends realistic test cases, starting with two or three; runs both with and without the skill (or against the previous version); fresh context for every run; objective assertions where possible; recording time and token costs; and human review. [evaluating skill output quality](https://github.com/agentskills/agentskills/blob/main/docs/skill-creation/evaluating-skills.mdx) **[official]**

For descriptions, test both prompts that should activate the skill and prompts that should not. Because activation is nondeterministic, the official guide recommends repeated runs and comparing trigger rates. [optimizing descriptions](https://github.com/agentskills/agentskills/blob/main/docs/skill-creation/optimizing-descriptions.mdx) **[official]**

## 6. Repository-layout recommendation for discussion

This is a recommendation, not a change made by this research.

```text
<repository>/
├── README.md
├── LICENSE                  # if publishing publicly
├── skills.sh.json           # optional, after a skills.sh repo page exists
├── skills/
│   ├── harness/
│   │   └── <globally-unique-skill-name>/
│   │       ├── SKILL.md
│   │       ├── scripts/     # only when that skill needs them
│   │       ├── references/  # only when that skill needs them
│   │       └── assets/      # only when that skill needs them
│   ├── engineering/
│   │   └── <globally-unique-skill-name>/
│   │       └── SKILL.md
│   └── management/
│       └── <globally-unique-skill-name>/
│           └── SKILL.md
└── <existing non-skill material, location still to be decided>
```

Reasons:

- `skills/<category>/<skill>/SKILL.md` is directly supported without special flags. **[official]**
- It leaves one unused category level available if a future domain genuinely needs subdivision. **[official] / [inference]**
- The root remains a repository/catalog rather than becoming a skill. **[official]**
- Source categories and skills.sh page groupings can use the same labels, but they are maintained separately; `skills.sh.json` is optional and should be added only when there are enough published skills to group. **[official] / [inference]**
- No repository-level `materials/`, `tooling/`, or `docs/` hierarchy is required by skills.sh. Those directories should be introduced only if this repository develops a concrete maintenance need for them. **[inference]**
- Existing research and documents do not need to be forced into the installable `skills/` tree now. Plain Markdown outside known skill containers does not become a skill. Avoid stray `SKILL.md` files outside the intended catalog because `--full-depth` and fallback discovery can find them. **[official] / [inference]**

## Not verified

- The delay between the first telemetry-enabled install and appearance on skills.sh is not documented.
- A minimum installation count for first listing is not documented.
- The rules for receiving an “Official” badge or placement in curated topic pages were not found in the publishing documentation and should not be conflated with ordinary automatic leaderboard listing.
- This research did not run installation against this repository because it intentionally contains no finished skills yet.

## Decisions for the owner

- Whether the current non-skill research and playbook documents remain at the repository root temporarily or move to one deliberately named authoring area. This is a repository-maintenance choice, not a skills.sh constraint.
- Whether a second category level will ever be permitted. The tool supports it, but one category level is the simpler default.

## Sources

- https://github.com/vercel-labs/skills/blob/main/README.md: official CLI commands, source formats, installation scope, agent paths, discovery rules, compatibility, and telemetry.
- https://github.com/vercel-labs/skills/blob/13e4063a1cf913f5606d57d42ab83a86f5001e04/src/skills.ts: exact on-disk discovery, root early return, bounded container traversal, shadowing, fallback, and name deduplication.
- https://github.com/vercel-labs/skills/blob/13e4063a1cf913f5606d57d42ab83a86f5001e04/src/blob.ts: corresponding GitHub tree/blob discovery behavior.
- https://github.com/vercel-labs/skills/blob/13e4063a1cf913f5606d57d42ab83a86f5001e04/src/installer.ts: installation paths use the skill name rather than the source category path.
- https://github.com/vercel-labs/skills/blob/13e4063a1cf913f5606d57d42ab83a86f5001e04/tests/full-depth-discovery.test.ts: root `SKILL.md` and `--full-depth` behavior.
- https://github.com/vercel-labs/skills/blob/13e4063a1cf913f5606d57d42ab83a86f5001e04/tests/nested-container-discovery.test.ts: categorized layouts, depth limit, and shallow-skill shadowing.
- https://skills.sh/docs/cli: official CLI overview and leaderboard telemetry.
- https://skills.sh/docs/faq: automatic listing, ranking, hosting, and update overview.
- https://skills.sh/docs/customize: optional root `skills.sh.json`, page grouping behavior, validation limits, and refresh behavior.
- https://vercel.com/kb/guide/agent-skills-creating-installing-and-sharing-reusable-agent-context: Vercel's authoring, CLI, publishing, and security guide.
- https://agentskills.io/specification: portable skill structure, field constraints, progressive disclosure, supporting directories, and validation command.
- https://github.com/agentskills/agentskills/tree/main/skills-ref: official reference implementation and validator caveat.
- https://github.com/agentskills/agentskills/blob/main/docs/skill-creation/evaluating-skills.mdx: official output-quality evaluation workflow.
- https://github.com/agentskills/agentskills/blob/main/docs/skill-creation/optimizing-descriptions.mdx: official trigger-testing workflow.
