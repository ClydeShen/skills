---
name: research
description: Investigate a question against high-trust primary sources and capture the findings as a Markdown file in the repo. Use when the user wants a topic researched, docs or API facts gathered, or reading legwork delegated to a background agent.
---

Spin up a **background agent** to do the research, so you keep working while it reads.

Its job:

1. Investigate the question against **primary sources** (official docs, source code, specs, first-party APIs), not a secondary write-up of them. Follow every claim back to the source that owns it.
2. Write the findings to a single Markdown file, citing each claim's source.
3. Save it under `research/<category>/<topic>/` with the filename `<research>-YYYY-MM-DD.md`. Use an existing category and topic when they fit; otherwise, create concise, lowercase, kebab-case names. Use a concise, lowercase, kebab-case research name and the research date.
4. Follow the repository's [research note template](../../../knowledge/harness/templates/research-note-template.md) and [document-writing standards](../../../knowledge/harness/document-writing-standards.md).
