# Document formats

This file defines project-specific document shapes. General writing, terminology, dates and evidence follow the existing [writing standards](../knowledge/harness/document-writing-standards.md). The [structure standard](./REPOSITORY-STRUCTURE.md) defines where each artifact belongs.

## Common conventions

Use UTF-8, LF, a final newline and `.editorconfig`. `.gitattributes` defines Git's text line-ending normalization. Use one H1 title per document. Use relative links within the repository and text-based diagrams when useful. Match path case exactly. Keep one topic per paragraph and distinguish evidence, recommendations and accepted decisions.

Write all repository-authored content in English: documents, research, skill instructions, prompts, examples, fixtures and code comments. Write agent procedures concisely, following the procedural principles in the writing standards. User-facing conversation in Claude, Codex or another client may use the user's preferred language; this does not change the language of saved repository artifacts. The owner confirmed this convention on 2026-10-25.

Translate non-English source material faithfully and label translated quotations or historical drafts; keep their provenance, dates, uncertainty and source links. Git history retains earlier repository text. Maintain one English document, not parallel language copies. Do not alter external source identifiers or vendored dependency content merely to translate it.

Use established terminology from `GLOSSARY.md`. Add an entry when a shared concept becomes part of the maintained model. Do not fill the glossary with file schemas or provisional research categories.

## Framework document filenames

Use uppercase filename stems and the normal lowercase `.md` extension for repository harness framework documents. This distinguishes shared operating context and rules from ordinary project content. Examples: `AGENTS.md`, `CLAUDE.md`, `GLOSSARY.md`, `CONTEXT.md`, `HARNESS.md`, `REPOSITORY-STRUCTURE.md` and `DOCUMENT-FORMATS.md`. The owner confirmed this convention in the repository conversation on 2026-10-24 (UTC).

Classify by responsibility, not by whether the text mentions harness engineering. Research notes, reusable knowledge, templates and ordinary technical guides keep descriptive lowercase kebab-case names. Code, directories and tool-defined configuration names keep their compatible names, such as `harness/`, `repository.mjs` and `hooks.json`. Preserve standard `README.md` and `SKILL.md` filenames. Do not create an otherwise unnecessary framework document merely to reserve its name.

The repository checker rejects lowercase or mixed-case variants of the established framework document roles at the root and in `docs/`. New framework roles must follow this convention and extend the naming check when introduced. Update every inbound reference in the same change as a rename; do not keep a second lowercase copy.

## Required shapes

| Artifact | Required content | Scaffold or authority |
| --- | --- | --- |
| Research note | Date, question, context, conclusion, evidence, project implications, unverified items and opened sources | Existing [research template](../knowledge/harness/templates/research-note-template.md) |
| ADR | Status, date, decision authority, context, chosen rules, alternatives and consequences | Existing [ADR template](../knowledge/harness/templates/adr-template.md) |
| Knowledge topic | Current guidance, applicability, evidence/uncertainty, source links and revision record | [Knowledge scaffold](./templates/knowledge-topic-template.md) |
| Initiative README | Stage, goal, knowledge sources, active package path, evaluation path, known gaps and next step | [Initiative scaffold](./templates/initiative-template.md) |
| Evaluation record | Scope, case/target version, mode, model/parameters where applicable, environment, result and limitations | [Evaluation scaffold](./templates/evaluation-record-template.md) |
| Skill package | Standard frontmatter, focused instructions, declared resource load conditions and package-local runtime files | Agent Skills format plus the rules below |

Do not add empty scaffold sections to existing content mechanically. Preserve useful historical notes. Apply missing fields when a document's substance or purpose changes.

## Skill package format

Use the [skill design principles](../knowledge/skill-design/skill-design-principles.md) for behavioral value, freedom, interaction and iteration. This section owns package format and resource boundaries.

Require YAML frontmatter with `name` and `description`. Follow the Agent Skills limits: name at most 64 characters, description at most 1024 characters, and name matching the immediate parent directory. Use lowercase kebab-case names. Describe both the useful task and activation conditions.

Use standard fields first. Record target-specific extensions and their compatible clients in the initiative. Current candidate `metadata.internal` uses a YAML boolean for skills CLI behavior; do not represent it as a portable Agent Skills guarantee. Keep generic metadata values as strings unless a verified extension requires otherwise.

Keep `SKILL.md` focused on required decisions and actions. Treat 500 lines / 5000 tokens as upstream authoring guidance, not a reason to pad a short skill or as a quality proof. State when a resource should be loaded. Avoid deep reference chains.

Use `references/` for runtime explanations, `scripts/` for reusable executable work, and `assets/` for templates or data. Create only directories that are needed. Put authoring rationale, evaluation cases and delivery history outside the installable package. Optional client metadata may be included only when it is part of the intended runtime package and is verified compatible.

External services and dependencies require explicit setup information. A remote URL may be a research source or service endpoint; it is not a substitute for a missing package-local file. Runtime package dependencies must not point into the repository's authoring directories.

## Evaluation result semantics

Use `fixture`, `transport`, `model` or `host-integration` to describe what was actually checked. Distinguish author self-review from independent review. Keep unresolved or unexecuted outcomes unknown.

Record enough input/target identity to reproduce the conclusion: commit or content hashes, case IDs, model and parameter settings, host/runtime, command and meaningful errors. Link to approved sanitized evidence when available. Keep raw local output ignored by default.

Do not call a synthetic replay a skill pass rate. Do not call a model's proposed memory write an executed filesystem action. Record real activation, file writes and cross-session persistence only after host integration tests observe them.

## Updating the system

Change the owning standard once. Update templates and agent navigation that must agree with it. Record architectural trade-offs in an ADR. Keep research findings separate from accepted operating policy. Avoid adding another rules file when an existing authoritative artifact owns the topic.
