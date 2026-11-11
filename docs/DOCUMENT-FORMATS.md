# Document formats

This file defines project-specific document shapes. General writing, terminology, dates and evidence follow the existing [writing standards](../knowledge/harness/document-writing-standards.md). The [structure standard](./REPOSITORY-STRUCTURE.md) defines where each artifact belongs.

## Common conventions

Use UTF-8, LF, a final newline and `.editorconfig`. `.gitattributes` defines Git's text line-ending normalization. Use one H1 title per document. Use relative links within the repository and text-based diagrams when useful. Match path case exactly. Keep one topic per paragraph and distinguish evidence, recommendations and accepted decisions.

Write all repository-authored content in English: documents, research, skill instructions, prompts, examples, fixtures and code comments. Write agent procedures concisely, following the procedural principles in the writing standards. User-facing conversation in Claude, Codex or another client may use the user's preferred language; this does not change the language of saved repository artifacts. The owner confirmed this convention on 2026-10-25.

Translate non-English source material faithfully and label translated quotations or historical drafts; keep their provenance, dates, uncertainty and source links. Git history retains earlier repository text. Maintain one English document, not parallel language copies. Do not alter external source identifiers or vendored dependency content merely to translate it.

Use established terminology from `GLOSSARY.md`. Add an entry when a shared concept becomes part of the maintained model. Do not fill the glossary with file schemas or provisional research categories.

## Document purpose and maintenance

The owner confirmed these rules on 2026-10-29. Documentation should reduce the reader's effort to understand and act. Agent autonomy does not justify accumulating transcripts, redundant rules or speculative context in maintained documents.

Before editing, identify the reader, the document's scope and the question it must answer. Integrate new information into the relevant section; consolidate repeated explanations and remove superseded current guidance. Read the resulting document as a whole, not only the added lines. Keep necessary constraints, evidence and uncertainty even when shortening text.

State each rule or fact in its authoritative location. Elsewhere, provide only the context needed for the next action and a link. Keep task progress in GitHub issues, evaluation evidence in evaluation records, and durable operating rules in their owning standard. Do not turn READMEs into session logs or move an unedited content dump into another file.

A README introduces its containing folder and directs readers to relevant detail. Choose its structure by role:

| README role                      | Lead with                                                                                      | Keep elsewhere                                                                                         |
| -------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Repository overview              | User value, skill discovery, trial/installation entry points and a brief release journey       | Detailed contributor setup, full release procedures, individual trials and repeated folder inventories |
| Skill or skill initiative        | Who it helps, the useful outcome, a concrete example, how to try it and honest maturity/limits | Authoring history, tool internals and full evaluation reports                                          |
| Functional folder or tool        | Function, prerequisites, minimal usage, inputs/outputs and necessary cautions                  | Project-wide background and unrelated functionality                                                    |
| Engineering or agent context     | Local responsibilities, invariants, commands and links needed to work safely                   | Rules already owned by parent instructions and chronological work logs                                 |
| Knowledge or evidence collection | The question or subject, current conclusion/status and a selective reading path                | Full contents of the linked sources                                                                    |

Present a skill's value attractively through concrete uses and outputs; distinguish intended benefits from verified results. Omit inapplicable sections rather than imposing one README template everywhere. Optimize for understanding and useful context, not an arbitrary word or token limit. Apply the same purpose-and-scope review to every document type, including templates and agent instructions.

Owner clarification, 2026-11-06: root and skill-package READMEs are human-facing product introductions. Structure the invitation around recognizable friction, a concrete desired outcome, an example or usage preview, and one low-effort next action. Help readers recognize their own need without inventing performance claims, social proof, scarcity or urgency. Use natural language rather than a feature taxonomy, package inventory or process lecture. Keep maturity, necessary setup, safety and material limits easy to find without dominating the pitch. Contributions stay secondary near the end. Never advertise unavailable releases or present illustrative output as verified performance.

Boundary between the root README and a skill-package README (owner clarification, 2026-11-11). Each fact has one home; the other README links to it.

| Question       | Root README                                                                                            | Skill-package README                                                                                        |
| -------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| Reader         | A visitor who may know no skill yet and is choosing what to try                                        | Someone who picked this skill and decides whether to install and how to use it                              |
| Goal           | Help the reader find the right skill and trust the collection                                          | Help the reader judge the skill's value, install it and succeed on the first use                            |
| Owns           | The catalog (need, outcome, one picture, release status), how skills earn release, contribution        | Benefits, examples with their inputs, installation per agent, first prompt, how to read output, limits, FAQ |
| Does not carry | Badges or chips, per-agent commands, feature lists, output formats, icon counts, runtime prerequisites | Collection status of other skills, the lifecycle, repository contribution rules                             |
| Pictures       | One representative output per released skill, credited, linking to the package page                    | Several outputs with the input behind each                                                                  |
| Next action    | Open a skill page, or one generic install command for a released skill                                 | Install, then run the first prompt                                                                          |

Release status is a root fact kept true by each release. A skill's facts (supported agents, output formats, versions) live in its package README, where badges are allowed.

The root's single lifecycle diagram reads from Idea at the bottom to Release at the top. Show consequential gates, their tool/evidence/human responsibilities, required evidence, failure paths and post-release improvement, hotfix and recovery loops. Summarize the owning SOP; do not invent new policy or imply all required checks are automated. A status chain alone adds no information. Skill-package READMEs show the useful output and first-use interaction, not the incubation process. Omit obvious usage-flow graphics and repeated diagrams; include a visual only when it explains a relationship better than the surrounding prose. Detailed procedures stay behind a link.

## Framework document filenames

Use uppercase filename stems and the normal lowercase `.md` extension for repository harness framework documents. This distinguishes shared operating context and rules from ordinary project content. Examples: `AGENTS.md`, `CLAUDE.md`, `GLOSSARY.md`, `CONTEXT.md`, `HARNESS.md`, `REPOSITORY-STRUCTURE.md` and `DOCUMENT-FORMATS.md`. The owner confirmed this convention in the repository conversation on 2026-10-24 (UTC).

Classify by responsibility, not by whether the text mentions harness engineering. Research notes, reusable knowledge, templates and ordinary technical guides keep descriptive lowercase kebab-case names. Code, directories and tool-defined configuration names keep their compatible names, such as `harness/`, `repository.mjs` and `hooks.json`. Preserve standard `README.md` and `SKILL.md` filenames. Do not create an otherwise unnecessary framework document merely to reserve its name.

The repository checker rejects lowercase or mixed-case variants of the established framework document roles at the root and in `docs/`. New framework roles must follow this convention and extend the naming check when introduced. Update every inbound reference in the same change as a rename; do not keep a second lowercase copy.

## Required shapes

| Artifact          | Required content                                                                                                                           | Scaffold or authority                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| Research note     | Date, question, context, conclusion, evidence, project implications, unverified items and opened sources                                   | Existing [research template](../knowledge/harness/templates/research-note-template.md) |
| ADR               | Status, date, decision authority, context, chosen rules, alternatives and consequences                                                     | Existing [ADR template](../knowledge/harness/templates/adr-template.md)                |
| Knowledge topic   | Current guidance, applicability, evidence/uncertainty, source links and revision record                                                    | [Knowledge scaffold](./templates/knowledge-topic-template.md)                          |
| Initiative README | User value and scope, stage and basis, usage appropriate to that stage, active package, key knowledge/evaluation links and material limits | [Initiative scaffold](./templates/initiative-template.md)                              |
| Evaluation record | Scope, case/target version, mode, model/parameters where applicable, environment, result and limitations                                   | [Evaluation scaffold](./templates/evaluation-record-template.md)                       |
| Skill package     | Standard frontmatter, focused instructions, declared resource load conditions and package-local runtime files                              | Agent Skills format plus the rules below                                               |

Use scaffolds selectively. Preserve necessary historical evidence in its owning record; current guidance should describe the current state. Git retains retired text. Do not rewrite frozen measurements or erase the provenance needed to interpret them.

Use the [incubation stages](./REPOSITORY-STRUCTURE.md#incubation-stages) for current initiative status and explain its basis. At `public`, include copyable candidate installation commands, prerequisites, a first-trial prompt and a feedback route in the README. Research and discussion at `init` or `plan` do not require an installable package.

For published skills, distinguish the current published revision from the next revision's stage and link both source and snapshot. Keep source commit, publication digest/ref, comparisons and matching audit evidence in the evaluation record, not a README history dump.

## Skill package format

Use the [skill design principles](../knowledge/skill-design/skill-design-principles.md) for behavioral value, freedom, interaction and iteration. This section owns package format and resource boundaries.

Apply this format equally to incubating candidates and released skills. Experimental status is not an exemption from package-local resources or focused instructions. Keep incubation support outside the package and follow the [minimal-migration lifecycle](./REPOSITORY-STRUCTURE.md#candidate-and-release-lifecycle).

Require YAML frontmatter with `name` and `description`. Follow the Agent Skills limits: name at most 64 characters, description at most 1024 characters, and name matching the immediate parent directory. Use lowercase kebab-case names. Describe both the useful task and activation conditions.

Use standard fields first. Record target-specific extensions and their compatible clients in the initiative. Current candidate `metadata.internal` uses a YAML boolean for skills CLI behavior; do not represent it as a portable Agent Skills guarantee. Keep generic metadata values as strings unless a verified extension requires otherwise.

Keep `SKILL.md` focused on required decisions and actions. Treat 500 lines / 5000 tokens as upstream authoring guidance, not a reason to pad a short skill or as a quality proof. State when a resource should be loaded. Avoid deep reference chains.

Use `references/` for runtime explanations, `scripts/` for reusable executable work, and `assets/` for templates or data. Create only directories that are needed. Put authoring rationale, evaluation cases and delivery history outside the installable package. Optional client metadata may be included only when it is part of the intended runtime package and is verified compatible.

External services and dependencies require explicit setup information. A remote URL may be a research source or service endpoint; it is not a substitute for a missing package-local file. Runtime package dependencies must not point into the repository's authoring directories.

## Skill package README

Each released skill carries `README.md` beside `SKILL.md` (owner requirement, 2026-11-06). Prepare it in the authoring source so publication remains a minimal export. The initiative README introduces development and testing; the package README introduces the installed product to a first-time user.

Lead with the problem it helps solve, who it is for and the useful outcome. Briefly cover what it can do, important limits or prerequisites, the correct installation command and how to start. Give one command and leave the choice of agent to the platform's installer; do not list per-agent commands or agent ids, which the installer owns and which go stale. Describe only the skill: its content, value, own prerequisites and limits. Which agents or environments it was tested on is evidence for the evaluation record, not README text. When useful, include one short realistic input/example and the expected kind of output; label illustrative output honestly. Keep the tone inviting and concrete, without unsupported claims.

Use [the package README scaffold](./templates/skill-readme-template.md) selectively. Keep examples concise, links package-local where needed, and installation instructions appropriate to candidate or release status. Do not copy runtime instructions, evaluation logs, internal task history or an initiative's folder inventory into it.

A package README may be visually rich when the richness is true and checkable:

- **Badges** state only facts that the package keeps true, such as its license, runtime and tool versions, supported agents, output formats and topic tags. They carry no install counts, ratings, audit results or other figures that change without a new release.
- **Pictures** are real, unedited output of the skill, shown with the input that produced it and a line that says so. They live in the initiative's `examples/` folder, outside the package, so that installing the skill does not copy them into every project. The package README is a byte copy in its snapshot, so it refers to them by GitHub's raw URL on `main`, not by a path relative to the package. The repository check rejects such a URL whose file is not in the repository.
- **Quotes** from a companion account are verbatim, not shortened or reworded.
- Illustrative output is never presented as measured performance; scores stay in the evaluation record.

Do not advertise a public release before the [release checks](./REPOSITORY-STRUCTURE.md#installation-and-release-checks), including skills.sh audit, are complete.

## Evaluation result semantics

Use `fixture`, `transport`, `model` or `host-integration` to describe what was actually checked. Distinguish author self-review from independent review. Keep unresolved or unexecuted outcomes unknown.

Record enough input/target identity to reproduce the conclusion: commit or content hashes, case IDs, model and parameter settings, host/runtime, command and meaningful errors. Link to approved sanitized evidence when available. Keep raw local output ignored by default.

Do not call a synthetic replay a skill pass rate. Do not call a model's proposed memory write an executed filesystem action. Record real activation, file writes and cross-session persistence only after host integration tests observe them.

## Updating the system

Change the owning standard once. Update templates and agent navigation that must agree with it. Record architectural trade-offs in an ADR. Keep research findings separate from accepted operating policy. Avoid adding another rules file when an existing authoritative artifact owns the topic.
