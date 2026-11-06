# Architecture Diagram

**Make the next architecture conversation easier to follow.**

Start with one request path or cross-cloud interaction. Give your agent the description, then review and refine an editable diagram together. For the short product tour, a sample prompt and what to expect, see [Architecture Diagram's user guide](./candidate/architecture-diagram/README.md).

This is an open candidate trial, not a stable release. The guide below helps you install it and tell us where it helps or gets in the way.

## What you get

- **An editable diagram:** open the `.drawio` file and keep working with it after the conversation.
- **Images for sharing:** export PNGs for a design review, document or wiki when rendering is available.
- **The questions that still matter:** assumptions and unresolved details stay in a short companion account, ready for your review.

Start with one interaction you know well: a sign-in flow, a background job or a request crossing cloud and on-premises boundaries. Input is an English text scenario; code/IaC reverse engineering and image tracing are outside current scope.

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

Stage: **public**. Updated: 2026-11-06. Basis: verified candidate installation and the trial guide, under the owner's lifecycle definitions. Installed-client effectiveness remains unverified. The owner set package `f7b7537` as the evaluation baseline on 2026-11-05; [the baseline protocol](./evals/baseline/README.md) governs comparisons and owner review.

Icon coverage follows the actual lookup results, with plain-box fallback for unavailable identities. First-release preparation removes assets with unresolved use terms; [third-party notices](./candidate/architecture-diagram/THIRD-PARTY-NOTICES.md) record remaining clearance and attribution work.

CLI delivery was checked on Linux for Codex and Claude Code. Real client activation, Windows command execution and offline draw.io Desktop remain unverified. Earlier diagram trials found information drift; authored repairs still need fresh end-to-end trials. See the [evaluation record](./evaluation.md) for evidence and remaining gaps.

Try your own scenario before reading the examples. In [Issue #7](https://github.com/ClydeShen/skills/issues/7), share sanitized input, the first diagram/screenshot, corrections and revision count, client/model, draw.io version and installed source revision or date. Flag missing or invented architecture and confusing visual choices.

## Development

- [Handoff](./HANDOFF.md): latest outputs, accepted direction, verification limits and next steps.
- [Active package](./candidate/architecture-diagram/SKILL.md): installed instructions and runtime resources.
- [Evaluation](./evaluation.md) and the [baseline](./evals/baseline/README.md): the quality boundary every change is checked against, and how to check it.
- [Authoring tools](./tools/README.md): local checks and rendering setup.
- [Requirements](../../research/diagrams/architecture-diagram/requirements-and-observed-style-2026-10-28.md) and [layout guidance](../../knowledge/diagrams/architecture-layout.md): design basis.
