# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

This repository is Markdown, YAML, and JSON with no build, lint, or test tooling. The verification commands from `AGENTS.md` are:

```sh
git diff --check                        # whitespace errors in the diff
skills-ref validate ./skills/<category>/<skill-name>   # Agent Skills format check for one package
npx skills add . --list                 # repository discovery: each released skill listed exactly once
```

`skills-ref` is the reference validator from the Agent Skills specification.

## Structured data

`knowledge/harness/setup-checklist.yaml` follows `knowledge/harness/setup-checklist.schema.json`. When you change either file, keep each checklist item's stable `id` and update both files together.
