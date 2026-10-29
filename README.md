# Personal Agent Skills

This repository is my workspace for developing and publishing reusable agent skills. This README helps people understand the project and find its materials.

Delivery agents share [AGENTS.md](./AGENTS.md). The [source-of-truth and folder contract](./docs/REPOSITORY-STRUCTURE.md) and [document formats](./docs/DOCUMENT-FORMATS.md) define how artifacts are maintained; Claude imports the same instructions through its thin adapter.

## Development flow

Research questions, synthesize reusable knowledge, incubate a specific skill, verify it, optionally evaluate it when time and token budget allow, try it in external projects, then release it. Feedback can return to research, knowledge, or incubation.

Incubating and released skills use the same package structure and authoring practices. Incubation adds supporting experiments outside the package. Refine and prune continuously so release is a directory move with minimal discovery and documentation updates, not a packaging rewrite. See the [lifecycle contract](./docs/REPOSITORY-STRUCTURE.md#candidate-and-release-lifecycle).

## Repository map

- [`docs/`](./docs/): documentation about how this repository is organized and maintained.
- [`GLOSSARY.md`](./GLOSSARY.md): shared terminology for the whole repository.
- [`research/`](./research/): evidence and conclusions for questions investigated during development.
- [`knowledge/`](./knowledge/): current, shared domain knowledge synthesized from research.
- [`incubator/`](./incubator/): initiatives that turn shared knowledge into candidate skills.
- [`skills/`](./skills/): released skills that users can install.

The current knowledge base covers [skill design](./knowledge/skill-design/README.md), harness engineering in [`knowledge/harness/`](./knowledge/harness/) and [Meta Thinking](./knowledge/meta-thinking/README.md), shared guidance for choosing thinking and interaction approaches. The [Meta Thinking initiative](./incubator/meta-thinking/README.md) contains a candidate skill and evaluation cases. The [Tech Humanizer initiative](./incubator/tech-humanizer/README.md) contains a candidate writing skill and its local evaluations.

The [Human-AI Meta Thinking research](./research/human-ai-interaction/meta-thinking/README.md) preserves the original draft, evidence, and open questions behind the guidance. The [Architecture Diagram initiative](./incubator/architecture-diagram/README.md) contains an experimental standard skill candidate, draw.io examples and evaluations based on the [owner's requirements](./research/diagrams/architecture-diagram/requirements-and-observed-style-2026-10-28.md).

No skill has been released yet.

[Diagram design knowledge](./knowledge/diagrams/README.md) covers spatial grouping, reading direction and routing without changing architectural meaning.

## Shared delivery harness

Use Node.js 24 and Git, run `npm ci`, `npm run git:setup`, then `npm run check`. Start each agent session with `npm run git:check`. Work on short-lived `work/<topic>` branches; use separate worktrees for concurrent tasks and squash PRs into `main`. See [Git strategy](./docs/HARNESS.md#git-strategy) for startup and cleanup. The shared gate checks Git policy, package layout, references, structured data, tool projections, harness tests and synthetic evaluation. See [the harness guide](./docs/HARNESS.md) for enforcement limits.

## Prompt evaluation

Use Node.js 24, then run `npm ci`, `npm test`, and `npm run eval`. The default evaluation is an offline synthetic replay of the harness, not a model quality test. See [local prompt evaluation](./docs/prompt-evaluation.md) for explicit model evaluation and Windows, macOS, WSL, and cloud setup.

With `NVIDIA_API_KEY` configured, run `npm run eval:nvidia -- --case C6` for a small real-model evaluation. The NVIDIA model is configurable through `NVIDIA_MODEL`; see the setup guide for the current default and trial availability limits.
