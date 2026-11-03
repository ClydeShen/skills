# Architecture Diagram handoff

Updated: 2026-11-03. The last change, [PR #25](https://github.com/ClydeShen/skills/pull/25), is merged into `main`; start new work on a task branch from `origin/main`. This is a continuation guide for the current initiative, not a parallel task tracker. Read root [AGENTS.md](../../AGENTS.md) before making changes.

## Start here

- Active package: [candidate/architecture-diagram](./candidate/architecture-diagram/SKILL.md), a public-stage candidate, not a release. The [initiative README](./README.md) owns installation and lifecycle status.
- Latest evidence: [boundary-membership check](./evals/boundary-check-2026-11-03/README.md), [clean-session trials](./evals/clean-session-2026-11-02/README.md), then [semantic routing trials](./evals/semantic-routing-2026-11-02/README.md), [vendor mix](./evals/vendor-mix-2026-11-02/README.md) and [icon coverage](./evals/icon-coverage-2026-11-02/README.md). Older history is in [evaluation.md](./evaluation.md). Keep frozen trial evidence; put new runs in new directories.

## Baseline

The owner accepted the package as of commit `c14828a` as the baseline on 2026-11-03. Its evidence is the [clean-session trials](./evals/clean-session-2026-11-02/README.md) (A 7/10, rerun at the baseline 7/10; final B 7/10) and the [boundary-membership check](./evals/boundary-check-2026-11-03/README.md) (scenarios 01, 03 and 04 at 7, 6 and 7/10), each one clean Claude Code run with a context-free review. Compare later changes against these runs with the same setup and prompt; small differences between scenarios are expected and tolerated.

## Owner direction

- Improve the skill, not one diagram. A good result must come from a fresh session that has only the package and a scenario, not from an agent repairing output with this conversation's context.
- Layout must express meaning, not mathematical tidiness. Runtime path in the middle; build, ingestion, management and telemetry in their own lanes; true boundary nesting. Treat a source's numbered steps as an unordered list while laying out; once the layout is settled, number the steps by the execution order the drawn architecture implies. Readers find the sequence by its numbers, so 1, 3, 2 in space is fine, while tangled lines are not (owner, 2026-11-03, replacing the earlier "numbered steps in reading order"). Avoid detours: a line that leaves and re-enters a region reads as data leaving it. Never delete, merge or move an element out of its region to clear a check.
- Icons must be real upstream artwork that travels with the package, shown at one standard size. Never draw or recolor an icon; use the plain-box fallback when none exists.
- Output must import into Lucidchart as well as open in draw.io.
- Talk to the owner in Chinese; write repository content in English.

## What the package does now

- `find-icon.mjs` looks up the draw.io catalog (AWS, Azure, Google Cloud, Kubernetes) and `assets/vendor-icons.json` (92 platform and AI vendor icons from pinned `@thesvg/icons`, `@fabric-msft/svg-icons` and official repositories, with licence and SHA-256). It returns a standard placement: symbols in a 72 square, wide marks 40 high, captions below at 16 point with `labelWidth` 160, or the plain-box fallback.
- `finalize.mjs` embeds vendor artwork and rewrites the file in draw.io's own layout, one element per line. Lucidchart rejects any other layout of the same XML; this was confirmed by owner import tests on 2026-11-02. `check-layout.mjs` errors and `render.mjs` refuses until the file is finalized.
- `check-layout.mjs` estimates caption, frame-title and connector-label boxes and connector routes, and reports text collisions, labels away from their line or on a bend, connectors through captions, leaving and re-entering or passing through regions, detours, jogs, crossings, ports to swap, bends that a clear straight or one-bend route would avoid (a simpler route through an element, a caption, an extra region outline or a new crossing counts as blocked), members named like the house they sit in, and more than three nested outlines (fills without a stroke do not count). Estimates were calibrated against exact render geometry: every real overlap was found; extra reports were near misses.
- `composition.md` holds the placement and routing rules above; `SKILL.md` says the checks report symptoms and must not be satisfied by changing meaning.
- Authoring tools: `tools/build-vendor-icons.mjs` regenerates the vendor icons and `--check-latest` reports newer upstream versions. Research behind the sources: [vendor icon sources](../../research/diagrams/architecture-diagram/vendor-icon-sources-2026-11-02.md).

## Open problems

1. Tangled steps and needless bends. The rules used to demand that numbered steps read in order, which, with scenarios that list steps 1, 2, 3, likely pushed sessions to place and port by number and tangle lines (round 3 B: `2` and `3` cross). The rules now place by role and lane and order ports to avoid crossings; round 3 A's 1, 3, 2 is acceptable. `check-layout.mjs` also reports bends that a clear straight or one-bend route would avoid, as in round 3 A's `Run`. Whether fresh sessions produce untangled layouts is untested: rerun both scenarios (problem 4).
2. Shared services. Round 3 B still left AI Search to one side, so the ingestion write takes a long route and crosses `3. Store conversation`. The rule exists; consider stronger guidance or an example.
3. Fresh sessions in the Codex sandbox cannot render: `render.mjs` stops with `listen EPERM` (see the [round 1 agent report](./evals/semantic-routing-2026-11-02/round1-a/agent-report.md)), so they never see their image. Static checks partly compensate. A renderer that needs no local listener would close the gap.
4. The [clean-session trials](./evals/clean-session-2026-11-02/README.md) reran both scenarios at `cc7d529` in Claude Code: A 7/10 with numbered, untangled steps; B 6/10 with AI Search placed between its flows but the query calls left unnumbered and unlabeled. After `f8ae813` required stated steps to be numbered and labeled, a rerun of B scored 7/10 with `1 search`, `2 answer` and `3 store` untangled; it still framed every Azure service in `westeurope`, which the source states only for the web app. Its secrets and telemetry lines enclosed the data services like a frame; after `a3c662c` a rerun had none but scored 6/10, because connectors of different meaning shared trunks (Deploy on `1 Ask`, `2 Search` with secrets and telemetry), which the layout check reported and the session kept. After `d8e0d3b` forbade shared segments, the next rerun drew every connector as a straight diagonal (`edgeStyle=none`), which the layout check cannot assess, and still framed every service in the region, following `cloud-conventions.md`. After `c14828a` required orthogonal connectors, stated regions and numbers only for stated steps, a rerun was orthogonal, untangled and numbered 1 to 3 (7/10), but still framed every service in `westeurope`. Scenario A rerun at the baseline package scored 7/10, as before; its main finding is an avoidable crossing of `1 retrieve` with `read`. A [boundary-membership check](./evals/boundary-check-2026-11-03/README.md) on scenarios 01, 03 and 04 found no element drawn into an unstated boundary, so B's over-framing is left as scenario-specific (owner decision, 2026-11-03); scenario 02 was not run. One run each, Claude Code only; Codex was not rerun.
5. Not verified: repeatability across several runs, Claude Code sessions (usage limit hit during this work), offline Desktop use on another machine, and redistribution terms for icons whose licence requires attribution (Jenkins, CC-BY-SA-3.0) or limits use (Microsoft Fabric).

## How to evaluate a change

1. Copy `candidate/architecture-diagram` into `<tmp>/.agents/skills/`, add one scenario as `scenario.md`, run `git init`, and run `codex exec -s workspace-write "Use the architecture-diagram skill to create diagram.drawio from scenario.md. Write your companion account to agent-report.md."` there. Set up the directory before starting the session, not in parallel.
2. Render with `node candidate/architecture-diagram/scripts/render.mjs <diagram.drawio>` outside the sandbox and inspect the PNG.
3. Ask a read-only subagent with no other context to read scenario and image and score fidelity, meaning of layout and misleading geometry.
4. Record the run and review in a new `evals/<topic>-<date>/README.md`. Finish repository changes with `npm run check` and `npm run skill:check`.

Update this handoff by consolidation when the continuation state changes.
