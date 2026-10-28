# Skill repository engineering research

Date: 2026-10-25. Status: targeted research complete. These notes preserve observations at the time of research; current implementation is owned by the engineering guides.

- [Engineering baseline and sequence](./engineering-baseline-2026-10-25.md): gaps, shared checks, layered feedback and server gates.
- [Skill quality tools](./skill-quality-tools-2026-10-25.md): agnix, skills-ref, official authoring and evaluation guidance, optional Skill Scanner.
- [Codex and Claude controls](./agent-controls-2026-10-25.md): hooks, permissions, sandboxes, platform differences and enforcement limits.
- [Sources of truth, layout and discovery](./sot-layout-installability-2026-10-25.md): single maintenance sources, skills CLI discovery and candidate/release trade-offs.
- [Matt Pocock's skill design](./pocock-skill-design-2026-10-25.md): behavioral value, completion criteria, on-demand resources, pruning and Meta Thinking evaluation hypotheses.
- [Anthropic's design philosophy](./anthropic-skill-design-2026-10-25.md): capabilities and preferences, freedom, useful reasons, human-AI feedback and evaluator limits.
- [OpenAI's design philosophy](./openai-skill-design-2026-10-25.md): model-relative instruction value, user intent, risk and behavioral evidence.
- [Other representative practices](./community-skill-design-2026-10-25.md): Superpowers pressure testing, Vercel domain and activation evidence, Hamel / Shreya human error analysis.

2026-10-25 synthesis: the owner endorsed Matt's direction and authorized broader research. Adopted authoring guidance lives in the [skill design principles](../../../knowledge/skill-design/skill-design-principles.md). These notes preserve source claims and research-time status, not independent current rules. This is a representative sample, not an exhaustive ecosystem survey.

Layout and formats were recorded in [ADR 0001](../adr/0001-repository-sources-of-truth.md); current rules live in [repository structure](../../../docs/REPOSITORY-STRUCTURE.md). Shared checks, client hook adapters and CI were implemented under [ADR 0002](../adr/0002-shared-delivery-harness.md); [HARNESS.md](../../../docs/HARNESS.md) records coverage, measured results and unverified boundaries.

Reuse existing npm, Promptfoo and three-platform CI. Trial new tools and establish false-positive baselines before adoption. Remote rules and credential roles require the owner's selection and separate configuration.
