# Humanization Rewrite Playbook

Use these transformations after identifying AI writing patterns. Base replacement details on the source and supplied evidence.

## Verbatim Preservation

Preserve exact wording where precision depends on it.

**Copy verbatim:**

- Safety-critical sequences: dosing, timing, route of administration, warning signs, stop/contact directives. "With food" stays "with food." "Every 12 hours" stays "every 12 hours."
- Legal scope terms: party names, covered losses, triggering conditions, and operative terms such as "breach".
- Exact wording the user asks to retain. Preserve the central claim's meaning and scope when paraphrasing.
- Technical specifics: algorithm names, version numbers, measurements, API names, code, and citations.

Keep sparse source material sparse. Rewrite surrounding prose when a protected phrase needs to stay intact.

## User Correction Handling

Apply the corrected wording to the draft. Record the preference and its reason in the profile.

Before: "User is able to control own laptop."
User correction: "not laptop -- could belong to someone else."
After: "User is able to control own device."

## Transformation Patterns

### Generic Importance to Concrete Outcome

Before:

```text
This release represents a pivotal moment for the platform and underscores our commitment to innovation.
```

After:

```text
This release adds project-level audit logs.
```

Use that replacement only if the supplied release details confirm audit logs. Otherwise ask what the release changed.

### Vague Authority to Owned Reasoning

Before:

```text
Experts argue that this approach improves reliability.
```

After:

```text
This approach improves reliability when failures are transient, because the retry can succeed after the upstream service recovers.
```

Use that rationale only when supplied context supports transient failures. Otherwise keep the claim marked as needing evidence.

### Marketing Tone to Observable Description

Before:

```text
Our cutting-edge platform boasts a vibrant developer ecosystem.
```

After:

```text
The platform has a developer community.
```

Use specific capabilities when the source supplies them.

### Assistant Stance to Author Stance

Before:

```text
Certainly! I hope this helps clarify the deployment process. Let me know if you need anything else.
```

After:

```text
The deployment process is below.
```

For a teammate:

```text
Deploy steps are below. Ping me if any step is unclear.
```

Only keep a help offer when the target channel naturally expects one and it names a concrete next step.

### Over-Polished Transitions to Natural Flow

Before:

```text
Furthermore, the service validates tokens. Additionally, it logs failed attempts. Consequently, teams can investigate incidents.
```

After:

```text
The service validates tokens and logs failed attempts, which gives teams enough detail to investigate incidents.
```

### Passive Compliance Voice to Actor and Action

Before:

```text
Care should be taken to reject expired tokens before the database call.
```

After:

```text
Please update the implementation to reject expired tokens before the database call.
```

### Placeholder Residue to Usable Draft

Before:

```text
Hi [Recipient Name], please review [Project Name] by [Date].
```

After when values are known:

```text
Hi Priya, please review the Atlas migration by Friday.
```

After when values are unknown:

```text
Please review the migration.
```

### Dev Slang to Technical Term (one direction only)

Use `colloquial_jargon` in [ai-style-lexicon.json](ai-style-lexicon.json) when its technical equivalent fits the context and user's voice.

Before:

```text
The API key is baked into the build, and we spin up a worker under the hood.
```

After:

```text
The API key is set at build time, and we deploy a worker internally.
```

Keep ordinary verbs such as `get`, `find`, `open`, `show up`, `run`, `read`, `use`, and `set up`. Preserve standard technical expressions such as `trigger fires`. Use the slang map when its replacement names the same technical action.

### False Specificity to Evidence Boundary

Before:

```text
The tool is used by millions of developers worldwide.
```

After without source:

```text
The tool is used by developers.
```

With a source, retain its documented count, population, and period.

### Absolute Certainty to Scoped Claim

For an empirical claim with unsupported absolute language, retain the scope the evidence establishes. Flag missing support when the scope is unknown. Keep design decisions and stated preferences as the author expressed them.

Before:

```text
This approach always outperforms the naive implementation.
```

If evidence is available, scope the comparison to its actual conditions. Otherwise flag the claim for verification.

## Rhythm and voice

Match the user's observed sentence length, paragraph shape, contractions, and punctuation. Use transitions to express actual cause, contrast, or sequence. Preserve fragments and asides when they suit the user's voice and occasion.

Read the passage for natural flow. Resolve repetitive sentence templates and let each sentence add information. End when the message is complete.
