---
name: domain-modeling
description: Build and sharpen a project's domain model. Use when discussing codebase terminology, writing or editing a GLOSSARY.md, or recording or editing an ADR.
---

# Domain Modeling

Actively build and sharpen the project's domain model as you design. This is the *active* discipline: challenging terms, inventing edge-case scenarios, and writing the glossary and decisions down the moment they crystallise. (Merely *reading* `GLOSSARY.md` for vocabulary is not this skill: that's a one-line habit any skill can do. This skill is for when you're changing the model, not just consuming it.)

## Repository files

- Keep shared terminology in the root [`GLOSSARY.md`](../../../GLOSSARY.md). Follow the [document-writing standards](../../../knowledge/harness/document-writing-standards.md); preserve the glossary's existing sections and table format.
- Record accepted architectural decisions in the Bronze Layer at `research/<category>/adr/NNNN-<slug>.md`. Create the `adr/` directory only when an ADR is needed. Keep it alongside topic directories such as `research/<category>/<topic>/`. Use the repository's [ADR template](../../../knowledge/harness/templates/adr-template.md).
- Keep ADRs as source decision records in `research/`. When a decision becomes reusable knowledge across skills, synthesize it in `knowledge/<topic>.md` and link back to its ADR.
- Use lowercase kebab-case for category, topic, and filename slugs. Keep the four-digit ADR sequence.

## During the session

### Challenge against the glossary

When the user uses a term that conflicts with the existing language in `GLOSSARY.md`, call it out immediately. Ask which meaning they intend.

### Sharpen fuzzy language

When the user uses vague or overloaded terms, propose a precise canonical term. "You're saying 'account': do you mean the Customer or the User? Those are different things."

### Discuss concrete scenarios

When domain relationships are being discussed, stress-test them with specific scenarios. Invent scenarios that probe edge cases and force the user to be precise about the boundaries between concepts.

### Cross-reference with code

When the user states how something works, check whether the code agrees. If you find a contradiction, surface it: "Your code cancels entire Orders, but you just said partial cancellation is possible. Which is right?"

### Update the glossary inline

When a term is resolved, update the root `GLOSSARY.md` right there. Don't batch these up: capture them as they happen. Follow its existing structure and the repository's writing standards.

Keep `GLOSSARY.md` free of implementation details. Do not treat it as a spec, a scratch pad, or a repository for implementation decisions.

### Offer ADRs sparingly

Only offer to create an ADR when all three are true:

1. **Hard to reverse**: the cost of changing your mind later is meaningful
2. **Surprising without context**: a future reader will wonder "why did they do it this way?"
3. **The result of a real trade-off**: there were genuine alternatives and you picked one for specific reasons

If any of the three is missing, skip the ADR. Otherwise, save it in `research/<category>/adr/` with the repository's ADR template.
