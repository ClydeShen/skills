---
status: accepted
---

# Let static tools decide style and structure, and let evaluation and people decide skill value

Agents spent judgment on style, commit messages drifted across clients (6 of the last 25 subjects on `main` were not Conventional Commits, all from squash-merged pull request titles), and three skill packages failed validators without anyone noticing. The owner confirmed this direction on 2026-11-02 and named it Skill Quality Governance. The tool choices below were researched and tried on this repository the same day.

## Decision

1. Static tools decide what they can check. Agents do not spend judgment on those rules, and reviewers do not report them.
2. Biome formats and lints every format except Markdown. Prettier formats Markdown. Knip finds unused files, exports and dependencies. dependency-cruiser enforces no cycles, relocatable skill packages and a skill-independent harness. commitlint checks commit messages and pull request titles. Gitleaks scans for secrets.
3. skill-validator and agnix check each authored skill package. Errors block; warnings do not.
4. Dated evaluation directories, imported skills, diagrams and generated catalogs are outside format checks, because they are evidence or upstream content.
5. Promptfoo is the main evaluation framework. Trigger and version comparison run through `npm run eval:trigger`, by hand, on the owner's quota.
6. A quality score never gates a merge. Skill size is reported as a change, and growth needs a reason in the pull request.
7. AI improvement proposes candidate changes with before and after evaluation. A person decides. Release needs evaluation evidence and human review.
8. The three measures are correctness, effectiveness and efficiency. Tools own correctness; evaluation and people own effectiveness; efficiency is reported for people to judge.
9. Hooks activate from `npm install`, and clients install dependencies at session start. CI repeats the checks, because hooks can be skipped or absent.

## Considered Options

- **Biome for Markdown**: rejected. Biome 2.6 rewrote frontmatter delimiters and renumbered lists, which broke every `SKILL.md`. A content comparison after normalizing whitespace found this before commit. Reconsider when it preserves frontmatter.
- **skill-check, sklab and other scoring linters**: rejected. A 0-100 score invites optimization of the score.
- **skills-ref as the routine validator**: rejected. Its README says it is for demonstration only. It stays a release compatibility check.
- **Changing `metadata.internal` to a string**: rejected. Validators require strings, but in a trial the skills CLI listed a candidate with `"true"`, so the marker stopped hiding it. The check removes the marker from an exported copy instead; `harness/repository.mjs` still validates it.
- **Harbor as the main evaluation framework**: rejected for daily use. It has stronger isolation and verifiers, but needs Docker and a task directory per case. Revisit it as a deep check if a pilot finds what Promptfoo cannot. Reasons to switch: repeated wrong Promptfoo judgments that configuration cannot fix, Harbor being right where the two disagree, or most skills producing files.
- **Inspect AI**: rejected for now. It has the strongest statistics, but activation checks need custom scorers and no subscription path is documented.
- **GEPA, DSPy and similar optimizers**: rejected. They rewrite skills toward a metric, which is the growth this decision prevents. No independent evidence on overfitting was found.
- **Cisco Skill Scanner on every change**: rejected. Without its LLM judge its README reports about 8% recall on malicious packages, and it reported a critical finding on a shell-free `execFileSync` call. It runs as a non-blocking report when third-party skills or skill scripts change.

## Consequences

- Prettier aligns tables, which added 62 and 111 tokens to two skill packages. This is accepted for now and visible in the size report.
- Static results show that a package is well formed, not that it helps. Only evaluation answers that, and no real-agent run has happened yet.
- Codex cloud does not run project hooks with cloud orchestration, and its setup script lives in Codex settings, so the owner must add `npm ci` there once. Claude multi-repository sessions and project threads also skip repository hooks. CI covers these cases.
- Whether Git hooks fire in each cloud environment still needs a real run on that host.
- Merging can only be blocked by branch protection, which remains optional. "No automatic merge" is otherwise a working agreement.
- Sources and trial results: [Biome language support](https://biomejs.dev/internals/language-support/), [skill-validator](https://github.com/agent-ecosystem/skill-validator), [skills-ref](https://github.com/agentskills/agentskills/tree/main/skills-ref), [Cisco Skill Scanner](https://github.com/cisco-ai-defense/skill-scanner), [scanner benchmark by Liatrio](https://www.liatrio.ai/resources/blog/five-scanners-5000-ai-skills), [Promptfoo skill testing](https://www.promptfoo.dev/docs/guides/test-agent-skills/), [Harbor](https://github.com/harbor-framework/harbor), [Inspect AI](https://inspect.aisi.org.uk/), [SkillsBench](https://arxiv.org/abs/2602.12670).
