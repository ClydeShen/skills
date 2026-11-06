# Architecture Diagram handoff

Updated: 2026-11-06. This is a continuation guide for the current initiative, not a parallel task tracker. Read root [AGENTS.md](../../AGENTS.md) before making changes, and start new work on a task branch from `origin/main`.

## Start here

- Active package: [candidate/architecture-diagram](./candidate/architecture-diagram/SKILL.md), a public-stage candidate, not a release. The [initiative README](./README.md) owns installation and lifecycle status.
- Quality boundary: the [baseline](./evals/baseline/README.md). No change may lower the output quality below it. [Evaluation](./evaluation.md) says how to check this, and [evals/README.md](./evals/README.md) maps the folder.
- Research behind the rules: [connector encoding conventions](../../research/diagrams/architecture-diagram/connector-encoding-conventions-2026-11-04.md), [vendor diagram conventions](../../research/diagrams/architecture-diagram/vendor-diagram-conventions-2026-10-28.md) and [vendor icon sources](../../research/diagrams/architecture-diagram/vendor-icon-sources-2026-11-02.md). The shared layout principles are in [architecture layout](../../knowledge/diagrams/architecture-layout.md).

## Owner direction

- Improve the skill, not one diagram. A good result must come from a fresh session that has only the package and a scenario, not from an agent repairing output with the context of the authoring conversation.
- No change may lower the output quality below the baseline (owner, 2026-11-05).
- The owner added [baseline visual standards](./evals/baseline/README.md#owner-approved-baseline-standards) on 2026-11-06: correct cloud corner markers for AWS/Azure/GCP, Level A colour-independent meaning and AA-derived contrast guidance. Earlier scored images remain historical measurements; the new rubric does not retroactively change their scores.
- Layout must express meaning, not mathematical tidiness. The main flow runs through the middle; build, ingestion, management and telemetry use their own lanes; boundaries nest as the platform nests them. Treat a source's numbered steps as an unordered list while laying out; once the layout is settled, number them by the execution order the drawn architecture implies. Readers find the sequence by its numbers, so 1, 3, 2 in space is fine, while tangled lines are not. A line that leaves and re-enters a boundary reads as data leaving it. Never delete, merge or move an element out of its boundary to clear a check.
- Placement follows the user's instructions and intent first, then the vendor's standard practice and platform constraints where the source is silent, named as inference. An obvious conflict between the two is reported before drawing, with a recommendation.
- Prefer notation readers already know. Do not use self-invented rules of unclear meaning; where a package convention is used, the key states its meaning. Use one filled arrowhead, solid and dashed lines only (no dotted), one line weight, no hue without a second cue, and no notation-specific ends unless the key declares the notation. A view with two or more kinds of line has a key, drawn as a native draw.io table titled "Key" with a sample line and its meaning per row; a view with one kind needs none. Boundaries follow the same standard: vendor boundary styles as the vendor defines them, every other boundary a thin solid neutral outline named by its title.
- Two kinds of line carry a view: solid for the main flow, dashed for supporting flows such as deployment, management, telemetry, secrets and DNS. A third kind of line or end is a last resort: first split the view; if a kind is still added, the key explains it, and split views share one notation across their pages.
- An arrowhead points where the request or data moves. A call points to the service it calls. A read, pull, poll or sync of a queue, secret store, configuration, repository or registry points from the store to its reader; an arrow into one says the sender writes there. An arrow that reads as the reverse of the real flow is a correctness error.
- Draw one view by default. Split only when a laid-out page still breaks a hard limit (a third kind of line, wider than 1400 units, more than three nested outlines, two crossing main directions), into as few pages as fix it. Split views are pages of one file with the same names, symbols and line meanings, and overview boxes link to their detail pages.
- Draw an identical repeated structure, such as environments or a warm-standby region with the same stack, once with its count and names; draw copies only where they differ. A page wider than 1400 units is a layout-check error.
- Icons must be real upstream artwork that travels with the package, shown at one standard size. Never draw or recolor an icon; use the plain-box fallback when none exists.
- Output must import into Lucidchart as well as open in draw.io.
- Talk to the owner in Chinese; write repository content in English.

## What the package does now

- `find-icon.mjs` looks up the draw.io catalog (AWS, Azure, Google Cloud, Kubernetes) and `assets/vendor-icons.json` (94 provider, platform and AI vendor icons from pinned sources, with licence and SHA-256). It returns standard element placement, or `--boundary` returns a native boundary style or a small title marker. AWS uses its native cloud corner icon; Azure and Google Cloud have pinned provider marks. Every drawn cloud-level boundary of these three has its identity marker and title. Deeper scopes use their own exact icons; other unavailable identities retain text-only titles.
- `finalize.mjs` embeds vendor artwork and rewrites the file in draw.io's own layout, one element per line. Lucidchart rejects any other layout of the same XML. `check-layout.mjs` errors and `render.mjs` refuses until the file is finalized.
- `check-layout.mjs` estimates caption, boundary-title and connector-label boxes and connector routes. It reports text collisions, labels away from their line or on a bend, connectors through captions, connectors that leave and re-enter or pass through a boundary, detours, jogs, crossings, ports to swap, bends that a clear straight or one-bend route would avoid, members named like the boundary they sit in, and more than three nested outlines. A segment shared by connectors of different meaning is an error. Errors also cover mixed connector styles without a key entry for each, dotted lines, more than one weight, ends other than one filled arrowhead that the key does not name, a page wider than 1400 units, key entries that differ between pages, page links to missing pages, and custom boundaries with dashed, multi-colour or multi-weight outlines. It reports dashed lines too short to show their dashes and an element whose symbol changes between pages.
- `check-steps.mjs` compares a source's numbered steps (top-level `1.` items or inline `(1)`) with the step numbers on connector label lines. `render.mjs` writes one PNG per page.
- `check-colors.mjs` measures an opaque sRGB foreground/background pair against AA text/graphics guidance. Level A colour-independent meaning still needs visual review; the calculator does not certify a diagram. Native vendor artwork remains unchanged.
- `tools/build-vendor-icons.mjs` regenerates the vendor icons, and `--check-latest` reports newer upstream versions.

## Next steps

The owner approved these on 2026-11-06. Do them in order, each in its own pull request from `origin/main`.

1. Shared scenario suite. Add a suite to root `evals/` on the shared Promptfoo runner, like `evals/trigger-suite.mjs`. A skill supplies scenarios, baseline, reviewer prompt and an optional image hook. Each run is a clean agent session with only the package and one scenario under [the fixed prompt](./evals/baseline/README.md#how-a-run-is-made); the agent is configurable, not restricted to Claude Code (owner clarification, 2026-11-06). A reviewer sees only the scenario and images; reuse `evals/vision-judge.mjs` where it fits. Run Promptfoo regressions first to reduce repeated token use. Reuse eligible prompt responses with recorded provenance; fresh samples and agent/tool executions cannot be replaced by response-cache hits. Report each scenario's mean of at least two independent runs beside the baseline mean and flag a mean below it minus tolerance. Connect this skill first, with `render.mjs` as its image hook. Keep adapters and orchestration shared, not in a skill-specific framework.
2. ADR 0004. Record that a baseline comparison is required evidence on every pull request that changes a skill package from `public` onward, and that the owner judges it; no score merges or blocks a change by itself. It amends [ADR 0003](../../research/harness/adr/0003-static-tools-and-skill-quality-governance.md). Update the Skill Quality Governance table in [HARNESS.md](../../docs/HARNESS.md#skill-quality-governance) to match.
3. General process. Write into the shared documents what this skill taught: in the stage table of [repository structure](../../docs/REPOSITORY-STRUCTURE.md#incubation-stages), what each stage requires (`public` fixes a baseline); in [HARNESS.md](../../docs/HARNESS.md), the evaluation standards (clean context, a context-free reviewer with a fixed prompt, at least two runs, the trigger check first) and what not to do (carry corrections from the authoring conversation into a run, commit run history, clear a check by changing meaning, keep a skill-specific evaluation framework). Add a "Baseline comparison" section to the [pull request template](../../.github/pull_request_template.md) and an incubator skeleton to `docs/templates/`.
4. Security scan. Move the catalog regeneration in `candidate/architecture-diagram/scripts/catalog.mjs` (its `git` calls) to `tools/`, leaving only runtime helpers in the package. That removes one of the four `COMMAND_INJECTION_JS_CHILD_PROCESS` findings of the `scan` job. The three in `render.mjs` remain: they start the browser, draw.io Desktop and `git`, with argument arrays and no shell. Do not disable the rule.
5. Reference validator. Wire the Agent Skills reference validator (skills-ref) into a script, as `AGENTS.md` and [HARNESS.md](../../docs/HARNESS.md#skill-quality-governance) require before release; no script runs it now.

Not adopted, by first-principles review on 2026-11-06: markdownlint, because Prettier formats Markdown and the repository link check already catches the link and anchor failures that occurred; Lychee, because the link check covers local links more strictly, and remote links in frozen research are expected to rot and would make a gate depend on third-party hosts.

## Known issues

Evaluation setup checked on 2026-11-06: Node.js 24 dependencies and repository tools are installed; the shared runner supports reported prompt-response cache reuse while independent repeats and agent/tool suites run fresh. The package's finalize, text/layout checks and Chromium rendering passed on a baseline copy; the pinned `skills-ref` validator passed. The legacy fixture validator now uses the active catalog, and tool commands point at existing files. No package behavior or baseline changed. The shared scenario runner in step 1 is still to be built.

Fix one when evaluation shows it often, or when it misleads readers.

- The key has no row for what an arrowhead means.
- A dashed boundary, such as an AWS Region, reads like a dashed connector, and the key lists no boundary style.
- The key word "supporting flow" names several unlike dashed relationships.
- A repeated standby region drawn as a single database reader does not show "same stack".
- Names drift between pages of one file.
- A collinear but non-overlapping pair of lines reads as one bus.
- An overview that links to one of several detail pages does not show which boxes have detail pages.
- Fresh sessions in the Codex sandbox cannot render: `render.mjs` stops with `listen EPERM`, so they never see their image.
- Not verified: repeatability across many runs, Codex, offline Desktop use on another machine, and redistribution terms for icons whose licence requires attribution (Jenkins, CC-BY-SA-3.0) or limits use (Microsoft Fabric).

Update this handoff by consolidation when the continuation state changes.
