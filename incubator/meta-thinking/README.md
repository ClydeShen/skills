# Meta Thinking candidate

The initial candidate turns [shared knowledge](../../knowledge/meta-thinking/meta-thinking-guidance.md) into a trialable, low-frequency skill. The owner authorized implementation on 2026-10-25. It remains in incubation; real behavior and long-term benefit need trials.

Updated: 2026-10-28. Stage: candidate. Active package: [candidate/meta-thinking/](./candidate/meta-thinking/SKILL.md). Evaluation sources of truth: [evals/suite.mjs](./evals/suite.mjs) and [evals/cases.json](./evals/cases.json). Trial and verification record: [evaluation.md](./evaluation.md).

## Files

- [Candidate skill](./candidate/meta-thinking/SKILL.md): brief instructions for explicit invocation, stall diagnosis, intent exploration and agent design.
- [Interaction options](./candidate/meta-thinking/references/interaction-options.md): obstacle-based choices, loaded when needed.
- [Profile contract](./candidate/meta-thinking/references/memory.md): user-level JSON, contextual events and patterns, lazy updates and access fallback.
- [Evaluation record](./evaluation.md): scenario boundaries, expected behavior and measured status.
- [Executable suite](./evals/suite.mjs): baseline, description-only and full-candidate conditions, using the shared Promptfoo runner.

## Initial implementation choices

The first trial target is a local agent with user-file access. The default profile is `.agents/meta-thinking/profile.json` under the actual user's home directory, with explicit path overrides supported. Remote hosts must establish ownership and persistence; otherwise use conversation context only. This is an implementation choice, not a capability verified on all hosts.

The main prompt finds the consequential decision, acts on it and remembers selectively. Conditional references carry interaction options and storage rules. The installed package does not depend on repository knowledge or research. The agent maintains profiles through host tools; there is no extra service, background monitor or storage script.

The package name is `meta-thinking`; the description includes the user's spelling `metathinking`. The candidate is not in the release directory and is not automatically installed into this repository's agent configuration.

The candidate uses the current skills CLI extension `metadata.internal: true` to hide from default discovery. This is not a universal client activation control. Explicit trials can use `INSTALL_INTERNAL_SKILLS=1` to discover it.

## Trial

### Design basis and current revision

2026-10-25: The owner endorsed Matt's direction and authorized the cross-source [skill design principles](../../knowledge/skill-design/skill-design-principles.md). Their initial adoption did not itself change runtime behavior.

The subsequent authorized prompt revision retains low-frequency use, lightweight intervention and lazy memory. It now explicitly connects the obstacle to a discriminating next move and carries out an authorized sample, evidence check or requested artifact, rather than stopping at a named method. It distinguishes conversational language from saved-artifact conventions. Detailed memory safeguards remain in the package reference.

The target user is someone working with an agent on a stalled interaction, emerging goal or explicit agent-design request. The intended added value is a useful change in the next action, without burdening already productive work. Observable success is a concrete testable response or artifact, not merely a longer explanation.

Compare actual C3 interventions and C6 design artifacts against the old prompt and no-skill baseline; use C1 and C2 for non-interference. Validate natural activation, conditional reading and real profile behavior separately. The JSON decision smoke test cannot establish artifact quality. Results and remaining gaps belong only in [evaluation.md](./evaluation.md).

### Loading and recording

Load `candidate/meta-thinking/` in a local client that supports Agent Skills. Use the client's installation and user-directory permission mechanisms. Start explicitly: “Use metathinking to help me design a reviewer skill.”

From the repository root, list without installing:

```bash
INSTALL_INTERNAL_SKILLS=1 npx skills add ./incubator/meta-thinking/candidate/meta-thinking --list
```

Record actual input, output, host/version, activation, user burden and memory changes against the [evaluation cases](./evaluation.md). Test natural activation and cross-session memory separately. Use synthetic profiles or explicitly authorized real records during trials.

If trials reveal reusable knowledge errors, record evidence in research before updating knowledge. Fix candidate instructions, activation and profile implementation here.

## Verification basis

The [Agent Skills specification](https://agentskills.io/specification) and [skills CLI creation/discovery documentation](https://github.com/vercel-labs/skills/blob/main/docs/creating-skills.md) were read on 2026-10-25. The package uses standard frontmatter, package-local references and conditional resources. Actual tool results belong in the evaluation record; format validation does not establish behavioral quality.
