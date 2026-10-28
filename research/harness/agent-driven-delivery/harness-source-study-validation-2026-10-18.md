# Research: source-code anatomy of coding-agent harnesses and gaps in the delivery playbook

Date: 2026-10-18. Subject: what arXiv:2609.00006, _Harness Engineering: Anatomy, Architecture, and Evolution of Coding Agents — A Source-Code Study of Eleven Systems_, establishes about coding-agent harnesses; which claims in `knowledge/harness/` it supports; and which errors, scope mismatches, gaps, and time-sensitive claims need follow-up. Context: the shared knowledge base currently describes an Agent-Driven Delivery playbook derived from one project. This note tests it against the paper, independent surveys and experiments, first-party engineering reports, and recent harness-security studies. It does not change the knowledge base.

Confidence markers:

- **[official]**: the relevant part of official docs, a specification, a tool's README, or a paper page was read.
- **[official · summary only]**: only an abstract or overview was read, or the page does not cover the detail.
- **[secondhand]**: a third-party description, such as a search result summary; not traced to a primary source.
- **[inference]**: the author's judgment, with no direct evidence.
- **[measured]**: the result of a command run on the stated date.

## Overview

| Question                                                   | Finding                                                                                                                                                                                                                                                                                                                                     | Strength of evidence                                 | Confidence               |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ------------------------ |
| What is the paper's core model?                            | A coding-agent harness is the runtime around the model. The paper decomposes it into the agent loop, LLM integration, tools and actions, memory and context, safety and permissions, orchestration, and extensibility; interface and session storage are cross-cutting surfaces.                                                            | strong for description; not a proven unique taxonomy | [official]               |
| What does the paper actually establish?                    | It establishes how eleven selected systems were structured at pinned July 2026 snapshots, plus one-quarter source evolution for eight systems. It does not compare runtime performance, causal effectiveness, or the best design.                                                                                                           | strong                                               | [official]               |
| Does the current playbook use “harness” in the same sense? | No. It primarily describes a **delivery harness** around coding work: repository knowledge, tests, checks, review, workflow, and team agreements. Its glossary definition claims the broader term while omitting much of the runtime anatomy.                                                                                               | strong                                               | [official] / [inference] |
| Is the playbook substantially wrong?                       | Its central delivery practices are mostly supported, especially mechanical verification, progressive disclosure, externalized durable knowledge, feedback loops, least privilege, and cautious multi-agent use. The largest problem is scope and terminology, followed by several absolute rules that evidence supports only conditionally. | medium to strong                                     | [official] / [inference] |
| What are the largest missing areas?                        | Agent-runtime state and session recovery; context compaction and memory governance; tool and edit-interface design; model/provider coupling; effective sandbox and permission evaluation; trajectory-level observability; extension supply-chain controls; and runtime interface/protocol design.                                           | strong                                               | [official]               |
| What should happen next?                                   | First decide whether `knowledge/harness/` will cover only the delivery harness or both delivery and runtime harnesses. Then fix the glossary boundary before adding runtime material. Add security and trajectory-observability research before turning either into a standard.                                                             | strong for the scope decision; medium for sequencing | [inference]              |

### Finding classification

| Class                                           | Meaning in this note                                                                                                              | Findings                                                                                                                                                                                |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Clear error**                                 | The statement is false under ordinary counterexamples or contradicts another rule in the repository.                              | “Computational” is treated as equivalent to deterministic; counting supporting confidence dimensions is treated as evidence strength.                                                   |
| **Scope confusion**                             | A useful local concept is named as though it covered a broader field concept.                                                     | The glossary's guide/sensor definition claims the unqualified term “harness”; repository durable state is called the single source of truth without a runtime-state boundary.           |
| **Insufficient evidence / over-generalization** | The practice may be good in a chosen architecture, but the cited evidence does not support a universal rule.                      | The 60-line AGENTS.md limit; contract-first, ports-and-adapters, C4, one composition entry point, one configuration format; categorical prohibitions on frameworks and code RAG.        |
| **Real gap**                                    | A material concern appears in multiple independent taxonomies or measured studies but lacks owned guidance in the knowledge base. | Effective runtime permissions and sandboxing, extension supply chain, context/session lifecycle, tool-interface design, trajectory observability, and outcome-based harness evaluation. |

The central finding is not that the playbook's delivery process is unsound. It is that a strong, opinionated delivery architecture is presented as a general harness theory, while several actual runtime-harness concerns are absent. [inference]

## 1. What the source-code study says

### 1.1 Definition and anatomy

The paper uses the formula **Agent = Model + Harness**. The harness is the runtime that couples a model to the world. It is not only the project instructions and checks around a coding tool. Its seven subsystems are: [official]

1. **Agent loop**: inference/action alternation, stop conditions, and recovery.
2. **LLM integration**: provider protocols, prompt assembly, caching, reasoning controls, and routing.
3. **Tools and actions**: tool definitions and execution, especially file editing and shell execution.
4. **Memory and context**: context-window management, compaction, repository context, and cross-session memory.
5. **Safety and permissions**: authorization, approval, forbidden actions, and execution isolation.
6. **Orchestration**: sub-agent spawning, coordination, and agent-to-agent integration.
7. **Extensibility**: configuration, hooks, skills, plugins, MCP, and other extension surfaces.

The interface layer and session substrate sit across these seven. The interface includes CLI, TUI, IDE protocol, HTTP, and SDK surfaces. The session substrate includes transcripts, persistence, resume, and fork. The authors call the seven subsystems “canonical,” but their evidence shows that these dimensions are useful and recurrent, not that no other decomposition is valid. [official] [inference]

An independent 2026 survey proposes a different but compatible seven-layer taxonomy, ETCLOVG: Execution, Tooling, Context, Lifecycle/Orchestration, Observability, Verification, and Governance. It maps more than 170 publicly documented projects and deliberately promotes observability, verification, and governance to first-class layers. This is important for the playbook: its strongest material corresponds to Verification and Governance, while the source-code paper is more detailed about the runtime's internal anatomy. Neither taxonomy should be treated as the only correct one. [official]

### 1.2 Corpus and method

The study selects eleven harnesses for diversity in philosophy, maturity, and market position: Claude Code, Codex CLI, Gemini CLI, Mistral Vibe, OpenHands, Aider, Mini-SWE-Agent, Hermes, Pi, OpenCode, and OpenClaw. Omnigent is a contrast point above the harness layer because it coordinates other harnesses and has no editing loop of its own. The systems span Python, TypeScript, and Rust and roughly three orders of magnitude in code size. [official]

The July 2026 revision pins public release tags or commits for ten systems. Claude Code is the reproducibility exception: the source analysis uses a publicly circulated March 2026 snapshot rather than an official release. The eight systems retained from the April edition were re-pinned, which gives a one-quarter longitudinal comparison. [official]

The method is a qualitative source-code audit organized by the seven dimensions. The study reads structure and implementation; it does not run the eleven systems on a shared task set. Its benchmark figures are self-reported by the individual systems and are not directly comparable because models, dates, configurations, and isolation differ. [official]

### 1.3 Strong descriptive findings

The following findings are useful as inventory and architecture evidence, with the paper's date and corpus boundary kept attached:

- Loop sophistication did not track the systems' self-reported benchmark numbers. Production-system size was largely spent on safety, recovery, interfaces, cost management, and extensibility rather than the basic edit loop. This is descriptive; it is not evidence that loop design never affects performance. [official]
- Provider-specific prompt, cache, reasoning, and tool behavior appeared in both vendor-native and multi-provider systems. Multi-provider support did not force a lowest-common-denominator design, but it required maintained per-provider conditional logic. [official]
- File-edit contracts were model-sensitive and changed during the quarter. Exact replacement, fuzzy cascades, patch DSLs, and LLM-assisted repair coexist. The paper treats edit-interface design as a major accuracy surface. [official]
- Seven of eleven systems used threshold-triggered LLM compaction. The differentiating frontier had moved toward cross-session memory and its write-governance model: agent-maintained, human-gated, bounded direct writes, or pre-turn recall. [official]
- OS-level sandboxing was expensive and not implied by codebase size. Systems instead chose different combinations of sandboxing, approval, syntax-aware policy, content scanning, and delegated execution backends. [official]
- Coordinator-worker structures appeared widely, but the implementations optimized different things: cache reuse, context isolation, portability, simplicity, or containment. A production-quality single-agent design also remained viable. [official]
- At the July pins, SKILL.md bundles appeared in 9/11 systems and MCP in 8/11. Eight of nine skill adopters used deferred loading. Registries, trust tiers, provenance checks, and agent-authored skills made extensions a software supply-chain concern. These are fast-decaying inventory claims, not timeless ratios. [official]
- No audited agent runtime imported a checked general-purpose agent framework, and no audited system used vector embeddings for **source-code** retrieval. The systems used host-language loops plus deterministic structural retrieval such as ripgrep, glob, tree-sitter, language servers, and filesystem traversal. This absence is corpus-specific and does not prove that frameworks or code RAG cannot help another workload. [official]
- ACP had acquired outward roles for editor integration and whole-harness hosting, while proprietary or in-process mechanisms still dominated a harness's own sub-agent coordination. This is a dated platform-interoperability observation. [official]

### 1.4 The paper's prescriptive layer is weaker than its anatomy

The paper derives 18 recommendations, including starting with a linear loop and few tools, using hierarchical context files and threshold compaction, delaying multi-agent orchestration, using skills before MCP for reusable procedures, and avoiding general-purpose agent frameworks and vector code RAG. Each recommendation points back to observed implementations, but observation frequency is not causal evaluation. [official] [inference]

Two recommendations are particularly over-broad if copied as universal rules:

- “Do not build RAG over code” moves from an absence in eleven products to a general prohibition. The paper itself cites CodeRAG-Bench, where gains vary by task and are meaningful for documentation and library-use scenarios. The defensible rule is to establish a deterministic-search baseline and require held-out evidence before adding semantic retrieval. [official] [inference]
- “Do not use [general-purpose agent frameworks]” similarly converts non-adoption into an anti-pattern. Debuggability and transparency are plausible reasons, but the study did not compare framework and non-framework implementations under controlled conditions. [official] [inference]

The 90-line scaffold is explicitly illustrative and omits a sandbox, multi-agent support, MCP, and skills. Observation 13 then conjectures, without evidence, that it would match Mini-SWE-Agent on a frontier model. That conjecture must not enter shared knowledge as a result. [official]

### 1.5 Threats to validity

- The paper is a preprint and a source-reading study, not a controlled execution study. [official]
- System selection is purposive rather than random. It is strong for architectural variety but cannot establish ecosystem prevalence beyond the selected corpus. [official] [inference]
- Qualitative scoring requires judgment. The authors anchor judgments in implementation details but do not publish an inter-rater reliability measure in the methodology passages reviewed. [official]
- Claude Code's unofficial source snapshot weakens reproducibility and may not match the July binary. [official]
- The two technology-absence claims came from dependency manifests and import searches. Dynamic imports, internal forks, plugins, and transpiled distributions could evade them. [official]
- The 90-day longitudinal sample is useful but short in a rapidly moving field. Three April conclusions had to be revised after one quarter. The authors appropriately distinguish dated inventory from more durable structure, but the “platform turn completed” thesis remains interpretive. [official] [inference]
- No vendor-engineer interviews were performed, so convergence does not establish common causation or deliberate imitation. [official]

## 2. Independent and first-party cross-validation

### 2.1 Runtime anatomy and observability

The independent _Agent Harness Engineering: A Survey_ supports the broad conclusion that harness quality is a separate engineering surface. Its ETCLOVG taxonomy agrees on execution, tools, context, and orchestration, then adds observability, verification, and governance as first-class concerns. It describes agent observability as traces of model calls, tool invocations, retrieval, and context assembly, with latency, token, cost, and prompt-version data. [official]

This exposes an important distinction in the current playbook. [`guardrails-standard.md`](../../../knowledge/harness/guardrails-standard.md) gives agents access to **product** logs, metrics, and traces. It does not specify **agent-trajectory** observability: the assembled prompt/context, model call, tool authorization, tool result, token/cost accounting, compaction event, and policy decision for each turn. [official] [inference]

The AHE experiment independently varies harness components while holding the base-model setting fixed. Ten evolution rounds raised Terminal-Bench 2 pass@1 from 69.7% to 77.0%; the frozen harness transferred to SWE-bench Verified and three other model families. Its ablations attribute gains to tools, middleware, and long-term memory, while a system-prompt-only change regressed. The authors limit the claim to two benchmark surfaces and note high variance. This supports treating structural harness components as testable artifacts, not assuming that more prompt prose is the main lever. [official]

### 2.2 Repository knowledge and context files

OpenAI's first-party harness-engineering report strongly supports several playbook practices: repository-local versioned knowledge, a small entry point with progressive disclosure, executable plans, mechanically enforced architecture, structural tests, agent-accessible development tools, and recurring cleanup. It also explicitly says that one large AGENTS.md failed and that the experiment's behavior should not be assumed to generalize without similar investment. [official]

Anthropic's context-engineering guidance independently treats context as finite and dynamically curated. It recommends just-in-time retrieval using lightweight references such as file paths and links, rather than loading all potentially relevant material up front. It does not reject embedding retrieval universally; it describes teams augmenting pre-indexed retrieval with JIT strategies. [official]

The controlled AGENTS.md study is a necessary correction to practitioner enthusiasm. Across SWE-bench Lite and a new 138-task, 12-repository benchmark, context files did not significantly improve success overall and increased cost and steps by about 20% or more. Developer-written files significantly outperformed generated files but did not show a significant gain over no context. Agents followed the instructions and explored and tested more, so the extra cost was not caused by ignoring the files. The study recommends minimal, non-redundant requirements and evaluation before adoption. [official]

The study also found that repository overviews in context files did not help agents reach the relevant files sooner. This supports the playbook's template rule not to describe the current state of the codebase in AGENTS.md. [official]

The study also reports no clear relationship between context-file length and task success. Therefore the playbook's “about 60 lines at most” is a practitioner heuristic, not an empirically validated threshold. [official] [inference]

### 2.3 Safety, permissions, and supply chain

The source-code paper correctly elevates safety and permissions, but newer independent evidence shows why feature inventory is insufficient. HarnessSecurity-Bench rated ten security mechanisms across 40 harnesses and found that about half of confirmed implementations were opt-in. Its controlled tests (six harnesses, 2,500 trials, one fixed model) show that enabling auto-approve raised attack success from 29.2% to 95.6%, and that mechanisms can reduce attack success while also blocking legitimate work, and that allowed alternative commands can bypass the protected route. It recommends reporting attack effect, task utility, token use, and runtime together, and exposing the effective settings to users. [official]

This is a gap in [`guardrails-standard.md`](../../../knowledge/harness/guardrails-standard.md). The file covers least privilege, untrusted content, resource limits, and protected checks, but not a procedure to verify the agent harness's **effective** approval mode, sandbox, network policy, writable paths, environment filtering, or bypass paths. [official] [inference]

The supply-chain study of 2,660 public setups and 511 published skill collections found at least one of its six configuration-exposure categories in 15.4% of setups. Including required-field and skill-format issues raised the setup rate to 17.9%. The largest reported categories were unpinned MCP packages (9.8%), broad execution grants (2.5%), and broad skill tool preapproval (3.8%). The paper recommends pinning dependencies, reviewing execution preapproval, and checking component conformance before distribution or use; it does not measure runtime consequences or recall. [official]

This evidence confirms the playbook's general supply-chain and least-privilege direction but shows that generic dependency guidance is not enough for agent extensions. Skills, hooks, MCP servers, sub-agent definitions, and project-local permission settings need their own install, pinning, provenance, authority, and audit model. [official] [inference]

A separate safety audit across ten harness configurations reports that task completion and safe execution diverge, violations accumulate with trajectory length, resource access and inter-agent information transfer dominate violations, and multi-agent collaboration expands the attack surface. Only the abstract was available in the page reviewed, so use this as supporting direction rather than a detailed design source. [official · summary only]

## 3. Coverage of the paper's anatomy in `knowledge/harness/`

| Paper area                      | Current coverage                                                                                                                                                                                                                                                                      | Assessment                                                                                                                   | Gap to research before writing a standard                                                                                                                                      |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Agent loop                      | [`feedback-loops-standard.md`](../../../knowledge/harness/feedback-loops-standard.md) describes tool, verification, and convergence loops; [`issue-workflow-standard.md`](../../../knowledge/harness/issue-workflow-standard.md) describes delivery states and stop/escalation rules. | Strong outer-loop material, but it is not a runtime agent-loop specification.                                                | Turn state, stop reasons, tool-result handling, retry/recovery, stuck detection, and loop event model.                                                                         |
| LLM integration                 | Almost absent. [`judgment-practices.md`](../../../knowledge/harness/judgment-practices.md) mentions model-vendor configurability only as an estimation example.                                                                                                                       | Out of the current delivery-playbook scope, but missing if “harness” remains unqualified.                                    | Provider adapters, model-specific tool/prompt contracts, routing, caching, reasoning controls, fallback, and model-harness compatibility tests.                                |
| Tools and actions               | Strong project toolchain guidance and “one command checks everything”; some MCP/log access.                                                                                                                                                                                           | Covers tools **used by** agents, not how a harness defines, discovers, authorizes, executes, and reports tools to the model. | Tool schema quality, error feedback, deferred discovery, output truncation, file-edit contracts, idempotency, and ACI evaluation.                                              |
| Memory and context              | Repository as system of record, short AGENTS.md, handoff, research notes, feedback log, and progressive disclosure.                                                                                                                                                                   | Strong durable project knowledge; weak runtime context lifecycle.                                                            | Context budget, compaction, recent-tail preservation, session resume/fork, memory write governance, stale-memory handling, and cost measurement.                               |
| Safety and permissions          | Protected checks, least privilege, untrusted content, resource limits, data rules, product logging, and server gates.                                                                                                                                                                 | Strong delivery and product guardrails; incomplete agent-execution security.                                                 | Effective approval/sandbox state, OS isolation, network/host/path/env policies, bypass tests, audit trail, prompt-injection boundaries, and utility/security joint evaluation. |
| Orchestration                   | Planner/implementer/reviewer roles, tracker dependencies, conflict groups, WIP limits, worktrees, merge queues, and cautious use of agents.                                                                                                                                           | Strong work orchestration; limited runtime sub-agent mechanics.                                                              | Context inheritance, permission narrowing, recursion/depth/cost limits, result aggregation, cancellation, inter-agent information flow, and protocol boundaries.               |
| Extensibility                   | Skills and MCP appear in examples and shared-context definitions.                                                                                                                                                                                                                     | No lifecycle or trust model.                                                                                                 | Discovery precedence, deferred loading, compatibility, versioning, pinning, provenance, install-time permissions, quarantine, removal, and marketplace risk.                   |
| Interface and session substrate | Handoff documents and tracker state cover work continuity.                                                                                                                                                                                                                            | Human workflow continuity is not runtime session persistence.                                                                | Stable event/protocol model, transcript storage, resume/fork/rewind, import/export, redaction, retention, and interface-independent harness reuse.                             |
| Observability                   | Product OpenTelemetry guidance, evidence records, delivery-health signals, feedback log.                                                                                                                                                                                              | Strong product and delivery observability; agent trajectory is largely invisible.                                            | Per-turn traces, prompt/context assembly, authorization decisions, tool spans, compaction, token/cost, replay, failure attribution, and privacy.                               |
| Verification                    | Tests, protected acceptance examples, separate review, live verification, and layered gates.                                                                                                                                                                                          | The most mature and best-supported area.                                                                                     | Evaluate the harness itself by controlled task runs, component ablations, false-positive/false-negative rates, cost, and security/utility together.                            |
| Governance                      | Roles, decisions, audit evidence, source hierarchy, a human team in the loop, and least privilege.                                                                                                                                                                                       | Broad and useful, but sometimes stated as universal process law.                                                             | Effective runtime identity and authorization, extension inventory, exception process, retention, and evidence that each project-scale rule pays for itself.                    |

## 4. Claims that are well supported

1. **Keep durable project knowledge versioned and discoverable, with a small entry point and progressive disclosure.** OpenAI's report and the eleven-system context-file convergence support the architecture. The AGENTS.md experiment adds the condition: do not duplicate discoverable documentation, and evaluate task and cost effects. [official]
2. **Turn repeatable rules into executable checks near the action.** OpenAI's structural tests and custom linters, the paper's policy-as-code pattern, and the current playbook's layered gates agree. [official]
3. **Give the agent direct access to verification and operational evidence.** OpenAI reports agents using development and review tools directly; Anthropic emphasizes feedback from tools; the survey treats verification and observability as first-class. [official]
4. **Separate durable authority from model judgment.** Protected acceptance criteria, deterministic gates, and owner decisions are a defensible delivery design, provided the playbook stops calling all tests deterministic. [official] [inference]
5. **Use the simplest agent/orchestration structure that serves an observed need.** The source study, Anthropic guidance cited by it, and the playbook's low-load practice agree that multi-agent cost and coordination must be justified. [official]
6. **Treat safety as defense in depth and extensions as dependencies.** Source architecture, HarnessSecurity-Bench, and the configuration supply-chain study all support this direction. [official]
7. **Feed repeated failures back into the harness.** The playbook's feedback ladder agrees with OpenAI's practice of converting missing capabilities and recurrent drift into tools, rules, tests, and cleanup jobs. The source-code paper's longitudinal sample independently observes behavioral policy migrating from prompt prose to configuration over one quarter, which matches the ladder's preference for checks over instructions. [official]

## 5. Errors and over-generalizations to correct

### 5.1 Major: the glossary claims the whole term while documenting one layer

[`GLOSSARY.md`](../../../GLOSSARY.md) defines a harness as “everything around the agent that guides it before it acts and checks its work after,” then reduces it to guides and sensors. This is compatible with Böckeler's **outer harness** framing, but not with the dominant runtime definition used by the source-code paper, OpenAI's App Server description, AHE, HarnessSecurity-Bench, or the independent survey. It excludes the loop, provider integration, context assembly and compaction, session state, runtime authorization, and interface protocols. [official]

Severity: **major terminology and scope error**, not evidence that the delivery practices are wrong. A reader can reasonably assume the directory is a complete harness-engineering body of knowledge when it is mainly a delivery-harness playbook. [inference]

Recommended correction for later owner approval: define **agent runtime harness** and **delivery harness** separately, with **harness** as the umbrella only if both are explicitly mapped. Do not silently replace the existing meaning because many files depend on it. Update `GLOSSARY.md` first if the owner accepts the terminology change. [inference]

The sources actually expose three layers, for which vocabulary is not yet fully standardized: [official] [inference]

| Proposed local term                  | Boundary                                                                                                                                          | Examples                                                                                                                               |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Built-in agent runtime harness**   | Code shipped as the agent runtime around the model. This is the source-code paper's main object.                                                  | Loop, provider integration, built-in tools, compaction, permission engine, sandbox, session store, sub-agent runtime, protocol server. |
| **Outer or user-configured harness** | Project or user artifacts loaded by a built-in runtime. Böckeler and the configuration supply-chain study often use “harness” at this layer.      | AGENTS.md or CLAUDE.md, skills, hooks, MCP declarations, sub-agent definitions, permission settings, project checks.                   |
| **Delivery harness**                 | The wider socio-technical delivery system that controls work before, during, and after one agent run. This is the current playbook's real center. | Tracker workflow, roles, acceptance ownership, CI gates, review, release, feedback log, human team in the loop.                       |

The layers interact but are not interchangeable. For example, a project hook in the outer harness can request a check, the built-in runtime decides when and how the hook runs, and the delivery harness decides whether its result blocks integration. Security must model authority across all three. [inference]

### 5.2 “The repository is the single source of truth” needs a boundary

[`delivery-phases-overview.md`](../../../knowledge/harness/delivery-phases-overview.md) says conversations and memories get lost but documents, issues, and code do not. The intended claim—durable project decisions belong in versioned artifacts—is supported. The literal claim is false or incomplete: sessions, permission state, tool results, runtime memory, transcripts, and external service state can be authoritative for active execution; committed files can also be stale. The paper treats the session substrate and memory as real state, and the playbook itself already has verification dates and stale-document checks. [official] [inference]

Recommended correction: “The repository is the system of record for durable project knowledge and decisions; runtime and external state must be linked, captured, or re-verified.” [inference]

### 5.3 “Deterministic checks give the same answer each time” is false as written

[`feedback-loops-standard.md`](../../../knowledge/harness/feedback-loops-standard.md) says tests, types, builds, and lint are deterministic and therefore can block. Tests and builds can depend on time, order, network, concurrency, infrastructure, and environment. The repository already recognizes flakes elsewhere, so this sentence contradicts the more careful testing guidance. HarnessSecurity-Bench likewise repeats trials because model and runtime behavior vary. [official] [inference]

Recommended correction: distinguish **computational** checks from **reliably reproducible** checks. A computational check can block only under the project's flake, retry, and evidence policy. [inference]

### 5.4 Independent acceptance is sound; prohibiting self-judgment is too absolute

The playbook says the implementer does not judge its own work. Independent final verification is well supported, but self-review, self-testing, and recovery inside the agent loop are standard and valuable. OpenAI explicitly has Codex review its own changes and then request additional agent reviews. The defensible invariant is: the implementer's own report is not sufficient evidence for final acceptance. [official] [inference]

### 5.5 The 60-line AGENTS.md limit is a heuristic, not a standard

The evidence supports minimal, non-redundant, task-relevant instructions. It does not support a universal 60-line cutoff. The controlled context-file study found no clear relationship between file length and success; content and redundancy mattered. Keep a measurable context/token budget or a removal test instead of presenting 60 lines as a general limit. [official]

### 5.6 “Every session reads every AGENTS.md line” is not portable

[`feedback-loops-standard.md`](../../../knowledge/harness/feedback-loops-standard.md) uses this claim to justify minimality. Harnesses differ: some inject top-level files eagerly, some discover nested files just in time, some read multiple vendor conventions, and some load skill bodies only on demand. The cost argument remains valid, but the mechanism must be phrased conditionally by the selected agent. [official]

### 5.7 One configuration format for everything is too broad

[`delivery-phases-overview.md`](../../../knowledge/harness/delivery-phases-overview.md) prescribes one resource format for everything configurable. The audited systems intentionally separate user settings, policy rules, skills, hooks, server declarations, model catalogs, and protocol data because they have different authorities, validation, and distribution. “One authoritative schema per configuration concern” is defensible; one format for all concerns is not established. [official] [inference]

### 5.8 Paper claims that should not be imported as rules

- Do not import “no frameworks” or “no code RAG” as universal prohibitions. Preserve them as dated corpus observations and require a local benchmark before adding those dependencies. [official] [inference]
- Do not import the paper's `~15 tools` deferred-loading threshold as a standard. It is a practitioner cutoff inferred from a small corpus, not a measured optimum. [official]
- Do not import exact adoption counts without a date and version pins. Three conclusions changed in one quarter. [official]
- Do not treat the 90-line scaffold as safe or production-ready; it deliberately omits the sandbox and other deployment-specific controls. [official]

### 5.9 Clear error: confidence is not the count of supporting dimensions

[`judgment-practices.md`](../../../knowledge/harness/judgment-practices.md) assigns confidence from the number of dimensions—Owner, Research, Reasoning, Project history—that support a judgment. This is not an evidence-strength model. One strong, replicated experiment can justify high confidence about a narrow empirical claim even if the owner and project history are silent. Four weak, correlated, or mutually derivative signals do not become high confidence merely because they occupy four labels. Owner intent can establish a preference or decision but cannot increase confidence in an external factual claim. [inference]

This rule can therefore invert calibration in both directions: downgrade strong evidence to “very low” and upgrade four weak signals to “high.” It also ignores source independence, directness, study quality, effect size, uncertainty, recency, applicability, and contrary evidence. None of the papers reviewed supports dimension counting as a confidence algorithm. Severity: **clear reasoning error**. [inference]

Recommended correction: keep the four dimensions as a **coverage checklist**, not a score. Calibrate confidence claim by claim from the strongest direct evidence, its quality and applicability, independent replication, contrary evidence, and uncertainty. Record owner intent separately from factual confidence. [inference]

**Correction, 2026-10-18.** The owner clarified that the intended model is a sum of four scores, each from 0 to 1, not a count of supporting dimensions; the old text stated a count. Under the intended model, a dimension can carry partial strength, so the main inversion above (strong evidence forced to "very low") is reduced but not removed: one fully supported dimension still sums to 1. [`judgment-practices.md`](../../../knowledge/harness/judgment-practices.md) now states the scored model with anchors for 0, 0.5, and 1, and requires a contradicting dimension to be named. The remaining limits (correlated sources, owner intent added to factual confidence) stay open for a later review. [official] / [inference]

### 5.10 Architecture choices are written as universal rules without matching evidence

[`delivery-phases-overview.md`](../../../knowledge/harness/delivery-phases-overview.md) makes “contracts first, dependencies inverted” a core idea and prescribes C4 diagrams, ports and adapters, domain-organized directories, one public package entry point, and one composition entry point. These can be coherent choices for a modular service or long-lived multi-package system. The source-code paper does not establish them as necessary harness practices, and the current repository's cited harness evidence does not compare them with alternatives. [official] [inference]

The rule set combines several independent architectural decisions:

- **Contract-first** is valuable at costly or parallel boundaries but adds ceremony to uncertain prototypes and local refactors.
- **Ports and adapters / dependency inversion** is useful when isolation or substitution matters; it is not a default requirement for every component.
- **C4** is one architecture-description method, not a prerequisite for agent legibility.
- **One composition entry point** assumes a particular dependency-injection and deployment shape; plugins, multiple executables, serverless functions, distributed services, and framework-managed composition can legitimately have several roots.
- **Domain-first directories** and **one public package entry point** are design choices whose fit depends on language, framework, ownership, and scale.

Severity: **insufficient evidence and over-generalization**, not a demonstrated falsehood for the project that inspired the playbook. These should be conditional profiles or an adopted project architecture, with a lighter default: define and mechanically check only the boundaries whose violation has a named cost. [inference]

## 6. Gaps to fill, in priority order

### P0: settle the knowledge boundary and vocabulary

Decide whether this repository will:

1. Keep `knowledge/harness/` explicitly limited to the **delivery harness**, with a short boundary map to runtime harness concerns; or
2. Expand it into an umbrella harness knowledge base with separate runtime, delivery, and governance maps.

Do this before adding more standards. Otherwise the same word will continue to mean “runtime,” “repository configuration,” and “team delivery system” in different sources. [inference]

### P0: add agent-runtime security research

Research a setup and verification procedure for effective approval, sandbox, network, filesystem, environment, identity, audit, and bypass behavior. Include a security/utility trade-off and default-state verification. Add extension supply-chain controls: inventory, source, pin/digest, declared authority, install-time review, quarantine, updates, and removal. The 2026 security studies show measured defects and bypasses, so this is more urgent than adding another general security checklist. [official] [inference]

### P1: add a state and context lifecycle

Define the state classes and owners: task specification, active plan, turn history, tool results, compacted summary, durable project memory, user memory, generated artifacts, and external runtime state. For each, specify authority, lifetime, write permission, validation, resume/fork behavior, and stale-data handling. [official] [inference]

### P1: add agent-trajectory observability and harness evaluation

Extend observability beyond product telemetry. Capture enough structured data to answer: what context was assembled, what model/tool/policy version ran, what was authorized, what result returned, what compaction occurred, how many tokens and how much time it cost, why the loop stopped, and which component likely caused failure. Protect secrets and user data. [official] [inference]

Evaluate the harness itself with controlled tasks or replay: outcome, cost, latency, safety effect, false blocks, and component ablations. A checklist score measures configuration presence, not effectiveness. [official] [inference]

The current [`setup-checklist.yaml`](../../../knowledge/harness/setup-checklist.yaml) calculates the weighted share of applicable items marked done and calls the weights a general standard from harness practice. This is a **coverage/readiness inventory**, not an outcome measure: it cannot show that the selected items improve task success, reduce defects, control cost, or prevent unsafe action in this project. Marking `n/a` as done further makes scores incomparable across projects. AHE's held-out task evaluation and component ablations demonstrate the missing method: vary a harness component, evaluate on tasks not used to design it, report outcome and cost, and retain uncertainty. HarnessSecurity-Bench adds that security changes need both attack and legitimate-task utility measures. [official] [inference]

Recommended correction: rename the score as configuration coverage or setup readiness; remove any implication that a higher percentage is a more effective harness; keep autonomy prerequisites as a proposal; and pair the checklist with project-specific held-out tasks, regressions, cost, false-block, and security-utility measures. [inference]

### P1: add tool and edit-interface engineering

The playbook says much about project tools but little about the model-facing interface. Research tool description quality, input schemas, error messages, output caps, cancellation, idempotency, discovery, file-edit contracts, shell semantics, and model-specific compatibility. Test these against representative tasks instead of selecting them by prevalence. [official] [inference]

### P2: document runtime orchestration conditions

Keep the current single-agent default. Add runtime conditions for spawning: a concrete breadth-first exploration need, isolated context, narrowed permissions, bounded depth/fan-out/cost, cancellation, result schema, provenance, and an independent verifier. Separate work orchestration in the tracker from sub-agent orchestration inside one harness. [official] [inference]

### P2: add an extension and interoperability lifecycle

Document when to use a skill, local CLI, MCP server, hook, plugin, SDK, or agent protocol. Cover discovery precedence, progressive loading, configuration collisions, portability, trust, pinning, and removal. Keep protocol/adoption facts dated because this layer changed materially between April and July 2026. [official]

### P2: record model–harness compatibility explicitly

The playbook treats the agent as relatively interchangeable. The source study and AHE indicate that tool contracts, prompts, caching, reasoning controls, and context behavior interact with model family and version. Record the supported model/harness combinations and rerun a small evaluation when either changes. [official] [inference]

## 7. Proposed follow-up artifacts

These are research outputs, not approved knowledge-base changes:

1. A short terminology ADR or owner decision: runtime harness, delivery harness, and their boundary. [inference]
2. A research note on effective coding-agent security, using HarnessSecurity-Bench, the supply-chain defect study, official Codex/Claude/Gemini controls, and executable local probes. [inference]
3. A research note and schema for agent-trajectory evidence, aligned with OpenTelemetry where it fits but not conflated with product traces. [inference]
4. A context/state map with authority and lifetime, followed by a minimal standard only after an external trial. [inference]
5. An evaluation plan that measures the repository's own harness changes on representative tasks, cost, false blocks, and security utility. [inference]
6. Only after those notes: revise the authoritative glossary and file map, then update each affected inbound reference in one change. [inference]

## Not verified

- The eleven pinned source trees were not cloned and re-audited independently for this note. The paper's source-level claims were checked against its full HTML text and against independent/first-party sources at the level stated above.
- The circulated March 2026 Claude Code source snapshot was not obtained. Its detailed source claims remain the weakest part of the paper's reproducibility.
- The paper's 29-pattern membership tables were not independently re-counted.
- The exact line counts of the eleven systems were not independently measured. The paper itself says they are approximate and not directly comparable across languages.
- The latest harness-security and supply-chain papers are preprints. Their methods and reported results were read, but their released artifacts were not executed.
- The independent survey's 170+ project classifications were not reproduced. Its taxonomy and stated collection/coding protocol were read.
- No local project trial was run, so this note cannot raise the playbook's maturity status from Researched or Designed to Used.

## Decisions for the owner

- Decide whether `knowledge/harness/` remains a delivery-harness playbook or becomes an umbrella for runtime and delivery harness engineering. Recommendation: keep the current playbook explicitly scoped to **delivery harness** and add separate runtime knowledge only after research and trial. [inference]
- If the boundary is accepted, approve a glossary change before any file-by-file terminology edits. Recommendation: define both terms and keep “harness” unqualified only for the umbrella concept. [inference]
- Choose the next research priority. Recommendation: effective runtime security and extension supply chain first; agent-trajectory observability second; context/state lifecycle third. [inference]

Outcome, 2026-10-18: the owner kept `knowledge/harness/` scoped to the **delivery harness**. Instead of an umbrella term, [`GLOSSARY.md`](../../../GLOSSARY.md) now defines “harness” as short for delivery harness and defines **agent runtime harness** separately, so existing uses keep their meaning. The owner chose runtime security and extension supply chain as the next research: [agent-runtime-security-and-extension-supply-chain-2026-10-18.md](./agent-runtime-security-and-extension-supply-chain-2026-10-18.md).

## Sources

All pages were opened on 2026-10-18.

- [Harness Engineering: Anatomy, Architecture, and Evolution of Coding Agents — full arXiv HTML](https://arxiv.org/html/2609.00006): primary paper; definition, seven subsystems, corpus, source audit, observations, recommendations, and threats to validity.
- [Agent Harness Engineering: A Survey](https://picrew.github.io/LLM-Harness/main.pdf): independent ETCLOVG taxonomy, 170+ project map, and first-class observability, verification, and governance layers.
- [Agentic Harness Engineering: Observability-Driven Automatic Evolution of Coding-Agent Harnesses](https://arxiv.org/abs/2604.25850): controlled harness evolution, transfer, component ablations, and limitations.
- [Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?](https://arxiv.org/abs/2602.11988): controlled evaluation of generated and developer-written context files, success, behavior, and cost.
- [Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/): first-party case study of repository knowledge, mechanical architecture, agent review, cleanup, throughput, and limits to generalization.
- [Unlocking the Codex harness: how we built the App Server](https://openai.com/index/unlocking-the-codex-harness/): first-party runtime definition and interface/protocol architecture.
- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents): finite context, dynamic curation, and just-in-time retrieval.
- [HarnessSecurity-Bench: Do Security Mechanisms Really Protect Coding Agent Harnesses?](https://arxiv.org/abs/2610.07639): 40-harness mechanism inventory and controlled security/utility evaluation.
- [Scanning the Harness: Configuration Exposures in AI Coding-Agent Supply Chains](https://arxiv.org/abs/2609.07360): validated prevalence of extension/configuration exposures, conformance issues, and recommendations by responsible party.
- [Auditing Agent Harness Safety](https://arxiv.org/abs/2605.14271): trajectory-length, resource-access, inter-agent, and multi-agent safety findings; abstract only.
