# Architecture Diagram

Turn architecture requirements into an editable draw.io diagram that makes components, deployment boundaries and interactions visible. Use it to discuss how a system works, review ownership and follow requests across services.

The skill is designed to preserve architectural meaning through layout: boundaries show real membership, arrows show directed relationships, and labels sit with the elements they explain. Consequential gaps and contradictions are raised before drawing.

Stage: **public**. Updated: 2026-11-05. Basis: verified candidate installation and the trial guide below, under the owner's lifecycle definitions. This is an experimental candidate; installed-client effectiveness remains unverified. The owner set the package at `f7b7537` as the evaluation baseline on 2026-11-05; no change may lower the output quality below it, as the [baseline](./evals/baseline/README.md) defines.

## What you get

One editable `.drawio` architecture diagram and its PNG for documents, Markdown and wikis, with a logical, deployment or flow emphasis supported by your English scenario description. Unresolved source claims and implementation choices stay in a concise companion account. The package includes notation guidance and exact vendor-icon lookup, with plain-box fallbacks when a suitable icon is unavailable. AWS, Azure, Google Cloud and Kubernetes use draw.io's libraries; additional bundled artwork travels with the diagram. First-release preparation removes assets with unresolved redistribution/use terms, so lookup results define current coverage. The [third-party notices](./candidate/architecture-diagram/THIRD-PARTY-NOTICES.md) distinguish retained artwork from completed clearance; the skill remains a candidate.

Start with a specific interaction, such as a sign-in flow or a request crossing cloud and on-premises boundaries. Code/IaC input, and automatic redraw are outside current scope. Static export is the core goal; an interactive HTML and SVG version may follow.

## Quick start: install and test the candidate

Use Codex or Claude Code with file access and Node.js 24. Nothing else is required: draw.io Desktop gives the best PNG, Git and Chromium or Chrome also produce one, and otherwise you get the `.drawio` and a browser link to view and export it. The candidate targets draw.io 32.6.1. Use your normal client authentication; no separate evaluation API key or authoring-repository checkout is needed.

Review the [candidate package](./candidate/architecture-diagram/SKILL.md). Run the appropriate command in a disposable test project, outside this authoring repository.

macOS / Linux / WSL:

```bash
INSTALL_INTERNAL_SKILLS=1 npx --yes skills@1.7.4 add https://github.com/ClydeShen/skills/tree/main/incubator/architecture-diagram/candidate/architecture-diagram --agent codex --copy --yes
```

Windows PowerShell:

```powershell
$env:INSTALL_INTERNAL_SKILLS = "1"
npx.cmd --yes skills@1.7.4 add https://github.com/ClydeShen/skills/tree/main/incubator/architecture-diagram/candidate/architecture-diagram --agent codex --copy --yes
```

For Claude Code, replace `--agent codex` with `--agent claude-code`. Installation is project-local. The PowerShell setting lasts for that terminal session. The internal flag enables candidate discovery; restricted repositories still require your normal Git read credentials.

These commands copy the current `main` candidate without automatic updates. To pin a trial, replace `/tree/main/` with `/tree/<full-commit-SHA>/`. If discovery finds no skills, check the internal flag and full candidate path.

Start a fresh client session in that project and confirm `architecture-diagram` appears in its skill list. Then send:

```text
Use the architecture-diagram skill to create an editable .drawio architecture diagram from the requirements below.

[Paste one sanitized architecture scenario here.]
```

Open the result in draw.io. Check components, boundaries, arrow directions and conditions against the input. Save the first diagram before requesting corrections. If the agent cannot inspect a rendered image, treat the visual result as unverified.

The package runs local programs: its Node scripts start draw.io Desktop or a browser and may run `git clone` for the pinned draw.io viewer, without a shell. Review them before installing.

## Status and feedback

CLI delivery was checked on Linux for Codex and Claude Code. Real client activation, Windows command execution and offline draw.io Desktop remain unverified. Earlier diagram trials found information drift; authored repairs still need fresh end-to-end trials. See the [evaluation record](./evaluation.md) for evidence and remaining gaps.

Try your own scenario before reading the examples. In [Issue #7](https://github.com/ClydeShen/skills/issues/7), share sanitized input, the first diagram/screenshot, corrections and revision count, client/model, draw.io version and installed source revision or date. Flag missing or invented architecture and confusing visual choices.

## Development

- [Handoff](./HANDOFF.md): latest outputs, accepted direction, verification limits and next steps.
- [Active package](./candidate/architecture-diagram/SKILL.md): installed instructions and runtime resources.
- [Evaluation](./evaluation.md) and the [baseline](./evals/baseline/README.md): the quality boundary every change is checked against, and how to check it.
- [Authoring tools](./tools/README.md): local checks and rendering setup.
- [Requirements](../../research/diagrams/architecture-diagram/requirements-and-observed-style-2026-10-28.md) and [layout guidance](../../knowledge/diagrams/architecture-layout.md): design basis.
