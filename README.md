# Personal Agent Skills

This repository is my workspace for developing and publishing reusable agent skills. This README helps people understand the project and find its materials.

Delivery agents share [AGENTS.md](./AGENTS.md). The [source-of-truth and folder contract](./docs/REPOSITORY-STRUCTURE.md) and [document formats](./docs/DOCUMENT-FORMATS.md) define how artifacts are maintained; Claude imports the same instructions through its thin adapter.

## Development flow

Research questions, synthesize reusable knowledge, incubate a specific skill, verify it, optionally evaluate it when time and token budget allow, try it in external projects, then release it. Feedback can return to research, knowledge, or incubation.

## Repository map

- [`docs/`](./docs/): documentation about how this repository is organized and maintained.
- [`GLOSSARY.md`](./GLOSSARY.md): shared terminology for the whole repository.
- [`research/`](./research/): evidence and conclusions for questions investigated during development.
- [`knowledge/`](./knowledge/): current, shared domain knowledge synthesized from research.
- [`incubator/`](./incubator/): initiatives that turn shared knowledge into candidate skills.
- [`skills/`](./skills/): released skills that users can install.

The current knowledge base covers [skill design](./knowledge/skill-design/README.md), harness engineering in [`knowledge/harness/`](./knowledge/harness/) and [Meta Thinking](./knowledge/meta-thinking/README.md), shared guidance for choosing thinking and interaction approaches. The [Meta Thinking initiative](./incubator/meta-thinking/README.md) contains a candidate skill and evaluation cases.

The [Human-AI Meta Thinking research](./research/human-ai-interaction/meta-thinking/README.md) preserves the original draft, evidence, and open questions behind the guidance.

No skill has been released yet.

## Shared delivery harness

Use Node.js 24 and Git, run `npm ci`, then `npm run check`. The same deterministic gate serves Codex, Claude, other delivery agents and CI. It checks package layout, references, structured data, tool projections, harness tests and synthetic evaluation. See [the harness guide](./docs/HARNESS.md) for collaboration, optional local hooks and enforcement limits.

## Prompt evaluation

Use Node.js 24, then run `npm ci`, `npm test`, and `npm run eval`. The default evaluation is an offline synthetic replay of the harness, not a model quality test. See [local prompt evaluation](./docs/prompt-evaluation.md) for explicit model evaluation and Windows, macOS, WSL, and cloud setup.

With `NVIDIA_API_KEY` configured, run `npm run eval:nvidia -- --case C6` for a small real-model evaluation. The NVIDIA model is configurable through `NVIDIA_MODEL`; see the setup guide for the current default and trial availability limits.
