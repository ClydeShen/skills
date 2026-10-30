# Review Standard

This standard gives the procedure for reviewers. A reviewer can be a person or an agent. The workflow states ("in review", "verifying") are in [issue-workflow-standard.md](./issue-workflow-standard.md). The format of findings and the order of sources in a conflict are in [feedback-loops-standard.md](./feedback-loops-standard.md).

## 1. Scope

1.1 This standard applies to each reviewer of a change.

1.2 A reviewer examines a change and reports findings. A reviewer does not change the work that it reviews. The implementer makes the changes.

1.3 A reviewer is not the implementer of the change. Review in a new session or with a fresh context.

1.4 The full check at the last gate ([GLOSSARY.md](../../GLOSSARY.md)) is the gate. The review adds the parts that tools cannot check: design, behaviour against the requirement, security judgment, and the quality of the tests. A finding can send the work back only when it is confirmed (3.7).

> **CAUTION:** Do not change the code, the tests, or the check configuration of a change that you review. If you change them, the review is not independent.

## 2. Inputs

2.1 Get these inputs before you start:

- The issue: background, scope, acceptance, out of scope, files, decision log.
- The diff of the change.
- The results of the required checks.
- The project standards: the code style, the contracts, the dependency rules, the global constraint table, and the security and data requirements.
- The review instructions of the project (section 7), if the project has them.

2.2 Do not use the notes or the reasoning of the implementer as evidence. Use the issue, the diff, the check results, and the standards.

## 3. Task: review a change

3.1 Do this task when an issue enters "in review". Set the risk tier of the change first (section 6).

3.2 Make sure that the required checks pass. If a check fails, stop the review. Move the issue back to "in progress" with the name of the failed check. Count one round.

3.3 Read the issue. Then read the diff.

3.4 Examine the change in this sequence:

1. **Design**: the change fits the architecture. It obeys the dependency rules and the constraint table. A change to the structure has an ADR. A change to a contract has the reason in the issue and an updated contract document (phase 6 of [delivery-phases-overview.md](./delivery-phases-overview.md)).
2. **Behaviour**: the change does what the acceptance asks. It does not change what "out of scope" names.
3. **Security and data**: the change obeys the security and data requirements. External content is treated as data. No secret or machine detail is committed.
4. **Tests**: the protected tests are not deleted or weakened (compare with the baseline, [testing-standard.md](./testing-standard.md)). Each new test can fail. The code that connects an acceptance scenario to the product does not make the scenario pass without the behaviour.
5. **Complexity**: the code is as simple as the problem allows.
6. **Names, comments, and documents**: the names are glossary terms. The documents that the issue names are updated.

3.5 Do not report what a tool checks (format, lint, types). If a tool must check something that it does not check now, write a suggestion for a new check in the feedback log. Do not block a change for a problem that existed before the change. Write it as a suggestion, or open a new issue.

3.6 Write each finding with a location, a problem, a failure scenario, a basis, and a severity ([feedback-loops-standard.md](./feedback-loops-standard.md), section 2.1).

3.7 Confirm each blocking finding. Reproduce the failure scenario, or show it in the code. Drop each finding that you cannot confirm, and write one line with the reason.

3.8 Select one decision:

- **Approve**: there is no confirmed blocking finding. Approve a change that makes the code better, also if it is not perfect. Write the suggestions as non-blocking. After the merge, the issue moves to "verifying". If the merge queue rejects the change, the issue moves back to "in progress" and counts one round.
- **Request changes**: there is a confirmed blocking finding. Move the issue back to "in progress". Count one round.
- **Blocked**: a finding conflicts with the spec, the order of sources cannot settle a conflict, or the issue reached the round limit. Mark the issue blocked. Write the reason, who decides (the owner, or the person that the owner named for the area), and the open findings.

3.9 Write the review result in the issue: the decision, the findings, and each part that you did not examine.

3.10 In a later round, examine the changes made since the last review and the findings of the last review. Do not repeat a finding that was dropped. If one kind of problem occurs in several places, write one finding with all the locations. Report a new blocking finding on code that did not change only if the earlier round missed it, and say so.

**Completion criterion:** The issue has one decision. Each finding has the five parts and is confirmed or dropped with a reason. "No findings" is written if there are none.

## 4. Task: settle a disagreement

4.1 Do this task when the implementer does not agree with a finding.

4.2 For a conflict between sources (spec, tests, checks, review), use the order in section 3 of [feedback-loops-standard.md](./feedback-loops-standard.md).

4.3 For a design point that no source settles, use this sequence. Stop at the first item that settles it:

1. Technical facts and measurements.
2. The code style and the project standards.
3. Established engineering principles. Do not use personal preference.
4. Consistency with the existing code, if it does not make the code worse.

4.4 If the disagreement is still open, mark the issue blocked and give it to the owner or the tech lead. Do not wait without an end.

**Completion criterion:** The disagreement is settled by a named rule, or the issue is blocked with the person who decides.

## 5. Task: review at the end of a milestone

5.1 Do this task in the cleanup story of each epic that produces code, and at the end of each milestone.

5.2 Do the architecture review of the cleanup story (phase 5 of [delivery-phases-overview.md](./delivery-phases-overview.md)). Classify each finding as severe or not severe with the written criteria.

5.3 Review the checks: the checks marked "not useful", the checks that never fire, and the rules that are often bypassed ([feedback-loops-standard.md](./feedback-loops-standard.md), section 4.3).

5.4 Read the feedback log. For each problem that occurred again, propose a prevention: a check if a tool can detect it, else a short guide.

5.5 Give the findings and the proposals to the planner. The planner makes the issues (Task 8 of [planner-standard.md](./planner-standard.md)).

**Completion criterion:** The architecture findings are classified. Each reviewed check has a decision. Each repeated problem has a proposal or a reason why there is none.

## 6. Task: set the risk tier of a change

6.1 Do this task when an issue enters "in review", before you examine the change (3.1).

6.2 Ask two questions:

- What damage does the change cause if it is wrong?
- Can you undo the change fully and fast, with a revert or by switching off a flag?

6.3 Select the tier from this table:

| Tier | The change | What must happen before the merge |
|---|---|---|
| Low | Documents or text. A change behind a flag that is off. You can undo it. | The required checks pass and a reviewer approves. A person reads a sample of these changes ([human-team-in-loop.md](./human-team-in-loop.md), F8). |
| Medium | A normal feature or fix. You can undo it. | As for low, and one person approves. This can be the person who directed the implementing agent. |
| High | A change to a contract, core logic, security, data, money, or permissions. A change to the check configuration, the pipeline, or the release process ([guardrails-standard.md](./guardrails-standard.md), section 1, rule 6). Any change that you cannot undo with a revert or a flag. | As for low, and a person approves who did not direct the implementing agent. The owner names that person for each area. A project can require two persons. |

6.4 Select the tier from what the change touches. Do not select it from the size of the change or from who wrote it. If a change touches more than one tier, use the highest. If you are not sure, use the higher tier.

6.5 A reviewer can raise the tier. Only the owner can lower it.

6.6 An approval by an agent is not the approval of a person. An approval covers one commit. A new commit removes it. Where the host can do it, dismiss approvals when a new commit arrives.

6.7 A project can change the numbers in the table. It writes the changes, and the paths and kinds of change of each tier, in its review instructions (section 7).

**Completion criterion:** The issue has a tier. The merge waits for the approvals of the tier.

## 7. Task: write the review instructions of a project

7.1 Do this task when the project sets up its review (phase 5 of [delivery-phases-overview.md](./delivery-phases-overview.md)), and each time the same finding occurs again ([feedback-loops-standard.md](./feedback-loops-standard.md), section 4.2).

7.2 Write the review instructions in one file. Keep it short. Write only what changes how a reviewer decides. Write build commands and code style elsewhere. If a tool can check a rule, make a check and do not write the rule here.

7.3 Put these parts in the file:

1. **Blocking**: what a blocking finding is in this project. For each kind of file, say what failure looks like. For example: code gives a wrong result; a document says something false; a configuration sends work to the wrong place.
2. **Risk tiers**: the paths and kinds of change of each tier, and the approvals of each tier (section 6).
3. **Do not report**: what the checks already enforce, generated files, lock files, copied third-party code, and test code that breaks a rule on purpose. For paths that need less care, set a higher bar for findings. Do not exclude the paths.
4. **Always check**: the rules of this project that no tool checks. For example: each new route has an integration test.
5. **Suggestions**: the maximum number of non-blocking suggestions in one review.

7.4 Make each reviewing tool read the file. Name the file in the agent entry file (`AGENTS.md`). If a tool reads another entry file, make that file name or import the same file. Do not keep a second copy.

7.5 Read the file from the protected default branch, not from the change that you review. Review a change to the file with the old copy. Require the approval of the owner for a change to it ([guardrails-standard.md](./guardrails-standard.md), section 1, rule 6).

7.6 Start from the real failures: the findings that a person rejected and the changes that were reverted. Do not start from a general list. When a finding is repeated or wrong, change one line.

7.7 The file guides the reviewer. It does not replace a check ([feedback-loops-standard.md](./feedback-loops-standard.md), section 2).

**Completion criterion:** The file has the five parts. The agent entry file names it. Only the owner can change it on the default branch.

## Sources

All pages were opened on 2026-10-14, except those marked 2026-10-30.

- [Google engineering practices: code review](https://google.github.io/eng-practices/review/) and [what to look for in a code review](https://google.github.io/eng-practices/review/reviewer/looking-for.html): design first, then functionality, complexity, tests, naming, comments, style, and documentation; approve a change that improves the code, even if it is not perfect.
- The sources of [feedback-loops-standard.md](./feedback-loops-standard.md): the format of findings, confirmation before change, and the order of sources.
- 2026-10-30: [How the Claude Code team does code review](https://claude.dev/blog/solving-code-review-at-anthropic/) (Anthropic developer blog, read as a summary): approvals by risk (no person, one, or two), the approval of an agent is not the approval of a person, an approval covers one commit, repeated findings become checks or guides.
- 2026-10-30: [Customize Code Review](https://code.claude.com/docs/en/code-review-customize) (Anthropic documentation): one file of review instructions, read from the base branch and not from the change, with the definition of an important finding, a limit on nits, paths not to report, and rules to always check.
