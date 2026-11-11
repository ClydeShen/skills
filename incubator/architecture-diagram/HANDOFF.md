# Architecture Diagram handoff

Updated: 2026-11-11 (UTC). This is the consolidated continuation guide, not a parallel task tracker. Read root [AGENTS.md](../../AGENTS.md), inspect the working tree and fetch the relevant branches before changing anything.

## Current state

The second revision, a README-only change, is staged at [`skills/architecture-diagram/`](../../skills/architecture-diagram/README.md) (source `eacf45065a0700a0fb1c58feb0a3ddfc15dbff73`, digest `7f6b2a6adb18347a4d2efcef6fab9f0fc25f10fb0e732519dc7d7f53e2ca4276`); it is published only when the owner has approved that source and digest and the release pull request has merged. The first revision (source `fd453ea34a46b250c0e70a53969f7f95eac1b2fe`) passed all three audit partners. Both carry 75 bundled icons. Install with `npx --yes skills@1.7.4 add ClydeShen/skills --skill architecture-diagram`. Its regression, checks and open items are in the [release record](./evaluation.md#release-record). Two things remain open:

1. **Re-reading the skills.sh audit.** All three partners (Gen Agent Trust Hub, Socket, Snyk) passed the published revision on 2026-11-11; the [release record](./evaluation.md#skillssh-audit) has the details. Read the skill page again after each new revision. The audit carries a timestamp, not a revision or digest, so say that the binding to a snapshot is inferred. Gen Agent Trust Hub notes that rendering runs Chromium with `--no-sandbox`; consider keeping the sandbox where the host allows it.
2. **Retained-artwork grants and output attribution.** The owner approved MIT only for original content and the exclusion of 19 unclear-rights entries. A supplier MIT or CC0 label is not proof of all copyright and trademark permissions. Exact grants for the Azure and Google Cloud provider marks and the Jenkins output attribution are open in the [rights research](../../research/diagrams/architecture-diagram/0003-bundled-icon-rights-need-explicit-notices.md).

## Next revision

A new revision starts at `internal`, is compared with the [baseline](./evals/baseline/README.md), and needs its own snapshot and the owner's approval of it.

- **Consumer icon libraries** ([PR #45](https://github.com/ClydeShen/skills/pull/45), draft, branch `codex/architecture-icon-libraries`, based on an older `main`). The feature reads local draw.io image libraries named by `ARCHITECTURE_ICON_LIBRARIES` (host path delimiter for several files) and by the lookup-only `--library <file>`. Supported single-image SVG and PNG entries, including compressed library XML, join exact title or ID lookup, placement, finalization and SHA-256 render checks; the same setting must apply to lookup, finalization and rendering. The pinned `jgraph/drawio-libs` Integration library at commit `ddeb033ab84b5b5408ab9e90858906638b5d72cc` (`libs/integration/apps-and-system-logos.xml`) gave 147 supported entries out of 154, and Ansible, Terraform symbol and Terraform wordmark passed lookup, embedding and PNG and SVG rendering. Re-apply it on current `main` rather than rebuilding it, then:
  - run `npm run eval:trigger -- --skill architecture-diagram --agent claude --repeat 3 --baseline <ref>` and `npm run eval:scenario -- --skill architecture-diagram --agent claude --repeat 2`; a score from any other runner is not evidence;
  - add targeted coverage for the configured-library path (Ansible and Terraform), the missing-image fallback, ambiguous symbol or wordmark selection and a final deliverable with embedded images, with the library source and hash as a declared test dependency, and test an actual Lucidchart import where one is available;
  - record scores, the baseline comparison and limits in the pull request and the evaluation record.

## Start here

- Authoring source: [candidate/architecture-diagram](./candidate/architecture-diagram/SKILL.md). The published package is its verified snapshot in `skills/`; edit the source, never the snapshot. The [initiative README](./README.md) owns installation and lifecycle status.
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
- Icons: offer as many useful icons as practical for drawing, and do not hold the skill for exhaustive bundled-logo clearance. Prefer native drawing-tool libraries and consumer-selected external libraries over redistributing every icon. Preserve correct identity and upstream artwork. A library's availability is not blanket permission, but ordinary diagram output and software-asset redistribution are different questions.
- Talk to the owner in Chinese; write repository content in English.

## What the package does now

- `find-icon.mjs` looks up the draw.io catalog (AWS, Azure, Google Cloud, Kubernetes) and the pinned vendor catalog, with provenance and SHA-256. The first conservative rights exclusion removed 19 vendor entries; lookup supplies a plain-box fallback, not a borrowed mark. This does not clear all retained artwork: see [rights research](../../research/diagrams/architecture-diagram/0003-bundled-icon-rights-need-explicit-notices.md) and [package notices](./candidate/architecture-diagram/THIRD-PARTY-NOTICES.md). Boundary lookup supplies AWS's native corner style or a provider marker; retained Azure/GCP mark grants still need exact-artwork confirmation before release.
- `finalize.mjs` embeds vendor artwork and rewrites the file in draw.io's own layout, one element per line. Lucidchart rejects any other layout of the same XML. `check-layout.mjs` errors and `render.mjs` refuses until the file is finalized.
- `check-layout.mjs` estimates caption, boundary-title and connector-label boxes and connector routes. It reports text collisions, labels away from their line or on a bend, connectors through captions, connectors that leave and re-enter or pass through a boundary, detours, jogs, crossings, ports to swap, bends that a clear straight or one-bend route would avoid, members named like the boundary they sit in, and more than three nested outlines. A segment shared by connectors of different meaning is an error. Errors also cover mixed connector styles without a key entry for each, dotted lines, more than one weight, ends other than one filled arrowhead that the key does not name, a page wider than 1400 units, key entries that differ between pages, page links to missing pages, and custom boundaries with dashed, multi-colour or multi-weight outlines. It reports dashed lines too short to show their dashes and an element whose symbol changes between pages.
- `check-steps.mjs` compares a source's numbered steps (top-level `1.` items or inline `(1)`) with the step numbers on connector label lines. `render.mjs` writes one PNG per page.
- `check-colors.mjs` measures an opaque sRGB foreground/background pair against AA text/graphics guidance. Level A colour-independent meaning still needs visual review; the calculator does not certify a diagram. Native vendor artwork remains unchanged.
- `tools/build-vendor-icons.mjs` regenerates the vendor icons, and `--check-latest` reports newer upstream versions.

## Decisions

Not adopted, by first-principles review on 2026-11-06: markdownlint, because Prettier formats Markdown and the repository link check already catches the link and anchor failures that occurred; Lychee, because the link check covers local links more strictly, and remote links in frozen research are expected to rot and would make a gate depend on third-party hosts.

## Known issues

Evaluation setup checked on 2026-11-06: the shared runner supports prompt-response caching while independent/tool runs stay fresh. A 1-scenario Codex generation plus 1 NVIDIA assessment smoke was authorized. Codex 0.163.0 failed before generation with a read-only-filesystem app-server initialization error, including after setting supported temporary state/log directories. No diagram or new quality score exists; no NVIDIA call was made. Keep both attempts recorded as infrastructure failures, not zero quality scores. Full scenario/trigger comparisons and shared scenario orchestration remain pending. The latest network failure and the owner's decision to continue in Claude are recorded above. Do not loosen the sandbox or reuse authoring-context output as a clean run.

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
