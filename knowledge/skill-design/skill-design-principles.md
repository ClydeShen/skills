# Skill design principles

Date: 2026-10-25. Status: adopted authoring guidance, supported by cross-source research; specific behavioral effects remain unverified. Decision basis: the owner explicitly endorsed Matt Pocock's design philosophy and authorized a synthesis with other primary practices. The choices below implement that authorization; they do not imply that the owner separately approved every author's claim.

This project uses skills to preserve reusable experience that changes decisions, actions or artifacts. The goal is timely help with the user's actual task, in a form the user can understand, use and correct. Brevity results from sustained selection; useful behavior and reasonable total cost determine what deserves to remain.

Use this guide to create, review and improve skills. It is not a runtime checklist or a requirement that all skills use one workflow. [Document formats](../../docs/DOCUMENT-FORMATS.md) owns package conventions; [repository structure](../../docs/REPOSITORY-STRUCTURE.md) owns lifecycle.

## Assumptions about models and people

Models already have broad capabilities, but not automatically the project's implicit conventions, user preferences, specialized tool knowledge or reliable execution feedback. Explaining a method does not establish that a model will choose and follow it in a real task. A skill supplies the relevant difference, rather than teaching general knowledge again. [A][O]

Behavior depends on model version, host tools, visible context and other instructions. Text alone cannot guarantee activation, execution, correctness or safety. An instruction useful in one environment may be redundant or constraining in another. [M][O][V]

People supply goals, value trade-offs, authorization and judgments of quality; they may discover their preferences by seeing examples. Agents should investigate accessible facts and carry out authorized work. Human participation matters because of its substance: granting permission, expressing preference and checking facts are different responsibilities. [M][H]

## 1. Identify the added value

Start from a concrete task, observed failure or clear recurring need. Use a realistic request to explain what is inadequate without the skill and what should change with it. New legitimate needs do not have to await an actual incident; unobserved failures remain hypotheses.

Anthropic distinguishes capability improvement from encoded preferences. Accordingly, judge capability improvement against the current model baseline, and encoded preferences against the user's or team's accepted practice. A convention may be valuable without improving general capability. Domain knowledge and tool procedures can support either purpose. [A]

Generic demands to be careful, thorough or professional rarely establish the benefit. A consequential decision is more useful: verify evidence for a disputed claim, or compare concrete samples when the audience is undecided. When direct instructions suffice for a simple task, do not add a skill, role or routing layer merely for uniformity. [M][O]

## 2. Write decision criteria and useful reasons

Prioritize the desired result, conditions affecting the choice, real constraints and evidence of completion. A concise explanation of why a requirement matters can support appropriate choices in unfamiliar settings. Keep reasons that change action; retain background discussion in research or knowledge. [A][O]

For example, “Every question must include a recommendation” prescribes an action. “Recommend an evidenced choice and its main trade-off to reduce the user's effort in organizing an answer” also explains purpose and applicability. Whether the latter works better still requires task evidence; natural wording is not proof.

Use established, precise domain concepts. Explain unfamiliar or easily confused concepts minimally, with discriminating examples. Keep a term only when it helps select, execute or detect an error; theoretical names cannot replace evidence and action. [M]

## 3. Match freedom to consequences

Open-ended work needs room to choose methods. Fragile or consequential operations need explicit boundaries. Strictness should follow real risk, task invariants and observed failures, not a preference for writing MUST. [A][O][S]

| Situation | Appropriate guidance | Evidence of completion |
| --- | --- | --- |
| Intent exploration, creation, option comparison | Goals, constraints, decision criteria and a few contrasting examples | A useful trade-off or testable artifact |
| A preferred method with varying context | Default method, reason and adaptation conditions | The artifact meets the goal; deviations have task-based reasons |
| Wrong ordering could damage data, exceed authority or lose verification evidence | Explicit prerequisites, fixed steps or verified scripts | Actual state or an independent check satisfies the conditions |

Prefer positive descriptions of target behavior and choose constraints for the failure type. Necessary prohibitions, authorization boundaries and recurring discipline failures may still need explicit rules. Repeating slogans does not strengthen enforcement. Automate suitable checks; skill text is not a permission system.

## 4. Generalize stable relationships and bounded expertise

When extracting a skill from one success, retain problem structure, decision criteria and feedback mechanisms; remove incidental filenames, project details and one-off preferences. Test similar problems in different domains. Technical skills may retain versions, APIs and domain rules: their generality is reliable reuse within a declared scope, not applicability to everything. [M][A][V]

For example, “Which current decisions depend on an unverified fact?” is transferable; a fixed questionnaire is less so. Writing, study planning and agent design can share that relationship while requiring different actions and completion evidence.

Split by independent use, actual reuse and context needs. A short entry point calling another skill has not removed complexity. Count the complete dependency chain, installation requirements and entry points the user must remember. Keep one self-contained package when it suffices. [M][O]

## 5. Spend human attention where it matters

Let agents look up accessible facts and take authorized, reversible steps when context is sufficient. Ask clarifying questions only when missing information materially changes goals, trade-offs, correctness or authority and cannot reasonably be obtained or inferred. A skill neither invalidates existing authorization nor expands it. [M][O]

When goals are forming, offer concrete choices or samples that help the user develop preferences. When learning is the goal, preserve purposeful thought and practice. Evaluate burden relative to that goal: reduce wasted interruptions while retaining valuable judgment, understanding and control. Human participation is not automatically a cost to eliminate. [M][H]

State when to continue, stop or change methods. Prototype experience questions that interviews cannot settle; investigate missing facts; return to the task when progress resumes. Completion should be observable in context. “Sufficiently” or “deeply” must not prolong interaction indefinitely. Different skills may have different endpoints. [M]

## 6. Load only relevant context

Keep common goals, important decisions and required boundaries in the main instructions. Load branch-specific examples, rules or knowledge conditionally, with explicit reading conditions. Scripts can handle repeated, stable mechanics. Do not duplicate facts that the environment can reliably supply. Split files or add scripts for actual benefit. [M][A][O]

Activation is a design choice. State when the skill is useful, then check adjacent non-applicable tasks so broad keywords do not turn ordinary work into a heavy workflow. Successful explicit invocation, accurate natural activation and correct reference loading are separate kinds of evidence. [A][O][V]

Persistent project conventions may belong in host-supported standing instructions or a small index; specialized workflows suit on-demand loading. Consider model context cost alongside human discovery, selection and maintenance costs. Choose activation controls for the target client and confirmed interaction needs; one host's mechanism is not a cross-platform guarantee.

## 7. Let artifacts and feedback guide improvement

Evaluate the change the user cares about. Inspect usefulness, critical constraints and effective or wasted actions; verify required processes where the task demands them. Keywords, promises and self-reported success do not substitute for results. [A][O][H]

Use a no-skill baseline to find added value, an old version to detect regression, and deletion comparisons to test necessity. Compare under the same model and similar tools and budgets; retain cases not repeatedly used for rewriting. Repeat variable outcomes, report differences and limitations, and do not generalize from one attractive output. [M][A][S]

People identify meaningful failures in actual samples. Agents can organize patterns, inspect coverage, generate counterexamples and propose revisions. Model judging assists rather than replaces calibrated human criteria. Revisit older samples when standards change. Deliberately difficult cases reveal failure types, not routine failure rates. [H]

Match verification depth to change, risk and budget. Targeted checks may suffice for small edits; complex workflows may warrant isolated execution, independent runs or blind review. When budget is insufficient, record effectiveness as unknown. Synthetic replay is not model or host verification. Follow the [evaluation semantics](../../docs/DOCUMENT-FORMATS.md#evaluation-result-semantics).

## 8. Prune continuously and allow retirement

Every new rule should address a need, real failure or important boundary. Every deletion should consider behavioral damage. Check duplication, stale content, irrelevant branches and instructions the current model already follows reliably. Remove related small groups and compare behavior; do not use a universal word target. [M][A][O]

Revisit assumptions after model, tool or host upgrades. Capability scaffolding may become redundant while preferences and essential constraints remain valuable. Keep temporary personal requirements in task or local configuration. Skills without sustained benefit may narrow, merge or retire instead of accumulating steps to justify their existence.

## Turn differing practices into contextual choices

These sources provide design hypotheses and engineering experience, not unanimous company conclusions for all models. Each research record retains source versions and reading scope.

| Source | Main contribution | Boundary retained here |
| --- | --- | --- |
| Matt Pocock [M] | Precise behavior, completion criteria, branch resources, pruning through runs | Extensive interviews do not fit every low-burden task; count dependencies behind short entry points |
| Anthropic [A] | Capabilities versus preferences, useful reasons, traces and artifacts, generalizing feedback | Scale evaluation cost; stronger descriptions intended to reduce missed triggers also need false-trigger checks |
| OpenAI [O] | Assume capability, preserve user scope, risk-sensitive steps, prune after upgrades | Model-specific advice is not universal; discovery and execution authority are separate |
| Superpowers [S] | Expose failure first, pressure testing, behavior under real constraints | Discipline-oriented constraints do not automatically fit exploration and creation |
| Vercel [V] | Specialized knowledge, performance judgment, testing actual knowledge use | Framework-specific results do not generalize to every skill or host; choose the appropriate knowledge entry point |
| Hamel / Shreya [H] | Human review of real samples, error analysis, calibrated criteria | Agent suggestions are not ground truth; error discovery and prevalence estimation differ |

We adopt Matt's economy and behavioral focus, combine them with Anthropic's and OpenAI's treatment of capability, feedback and authority, and use other practices to clarify pressure, activation and human evaluation. We do not resolve apparent differences by requiring both “always ask more questions” and “always execute directly,” or require every skill to have a full evaluation platform.

## Applying the guidance

Start with a short account of the intended user, task, added value and completion evidence. Begin when existing information is sufficient; do not require the user to repeat a questionnaire. Save necessary design rationale in the initiative's existing documents.

Observe a baseline or select cases that expose the need, write the smallest sufficient candidate, run it, inspect artifacts and traces, then revise. Address effectiveness in behavior and knowledge, activation in visible descriptions, and tool problems in the environment. Research only unknowns that change the current design. Fix a failure at its owning layer rather than automatically adding a global rule.

At handoff, explain the added value, tested contexts, costs and remaining unknowns. Keep evaluation in its authoritative initiative location. Research alone does not authorize release.

## Evidence and revision

- [M — Matt Pocock](../../research/harness/skill-repository/pocock-skill-design-2026-10-25.md): writing method, source, maintenance policy and limits of short entry points.
- [A — Anthropic](../../research/harness/skill-repository/anthropic-skill-design-2026-10-25.md): capability and preferences, freedom, authoring and evaluation.
- [O — OpenAI](../../research/harness/skill-repository/openai-skill-design-2026-10-25.md): current Codex authoring guidance, model updates and behavioral evaluation.
- [S / V / H — Other practices](../../research/harness/skill-repository/community-skill-design-2026-10-25.md): Superpowers, Vercel, Hamel / Shreya, with source limits.

The synthesis and trade-offs are project judgments. Cross-author agreement is not independent experimental replication; this research has not proved improved quality for every project skill. Recheck persistently ineffective rules, false activation, user burden and upgrade regressions with concrete cases.

- 2026-10-25: Established and adopted the initial guidance under the owner's authorization. The owner endorsed Matt's direction; the agent researched, synthesized and connected authoring entry points. That adoption did not itself rewrite candidate runtime behavior.
- 2026-10-25: Translated the guidance into English under the owner's repository-language requirement. Runtime application is recorded in the Meta Thinking initiative.
