# Research: GitHub feedback system for the skills lifecycle

Date: 2026-10-18. Subject: a low-friction system for sending structured feedback from external projects back to `ClydeShen/skills`, then triaging it against an incubator initiative or released skill and closing the loop through an evaluated change. Scope: GitHub Issues, Issue Forms, prefilled URLs, GitHub CLI, labels, Projects, Discussions, dispatch events, and security/privacy. This note proposes a design only; it does not create forms, workflows, skills, or directories.

Confidence markers:

- **[official]**: documented by GitHub or the official GitHub CLI manual.
- **[inference]**: a repository recommendation derived from documented behavior.

## Recommendation in one page

Use **one GitHub Issue Form as the canonical feedback intake**, with two ways to reach the same record:

1. A prefilled browser link for humans and agent-assisted review.
2. A documented `gh issue create --repo ClydeShen/skills --body-file -` recipe for terminal agents.

Every accepted submission becomes an ordinary issue with the template-applied labels `feedback` and `needs-triage`. The form body carries the target stage and canonical target identifier; labels do not need to encode every skill or initiative. During triage, the maintainer decides whether the report targets an incubator initiative, a candidate package, a released skill, or repository process. An accepted report is linked to its evaluation/change pull request, and the pull request closes the issue when merged.

Do **not** require GitHub Projects, Discussions, Actions, `repository_dispatch`, or `workflow_dispatch` for the first version. Each can be added later without changing the issue record that serves as the system of record.

```text
external project
   │
   ├── browser: prefilled Issue Form
   └── terminal/agent: gh issue create --body-file -
                         │
                         ▼
                Issue: feedback + needs-triage
                         │
              maintainer classifies target
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
      incubator      released skill   not actionable
          │              │              │
          └──── evaluation/change ──────┘
                         │
                  linked PR/evidence
                         │
                 completed / not planned
```

This is intentionally an intake-and-closure model, not a request for agents to mutate the skills repository directly. **[inference]**

## Why Issues should be the canonical record

GitHub describes Issues as a way to track bugs, enhancements, and requests. People with read access can create an issue when Issues are enabled. Issue Forms turn structured inputs into editable Markdown in the issue body and can apply default labels, title prefixes, assignees, issue type, and Projects metadata. [Creating an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue) [Issue Form syntax](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms) **[official]**

That matches the intended lifecycle better than a free-form document dropped into the external test project:

- feedback has a durable URL, author, timestamps, comments, labels, and closure state;
- an external project need not share its repository or grant access to the skills repository;
- a maintainer can link the report to a pull request and automatically close it when that change reaches the default branch; and
- the same record can hold positive validation evidence, a usability problem, a defect, or a proposed improvement. **[inference]**

GitHub currently marks Issue Forms and its form schema as public preview, so the form should stay simple and its Markdown field headings should be treated as the durable data representation rather than depending on a separate parser. [Issue Form syntax](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms) [GitHub form schema](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-githubs-form-schema) **[official] / [inference]**

## Smallest viable repository design

When implementation is approved, the first version needs only these repository-level elements:

```text
.github/
└── ISSUE_TEMPLATE/
    ├── skill-feedback.yml
    └── config.yml
```

`skill-feedback.yml` should apply two pre-existing labels:

```yaml
labels: [feedback, needs-triage]
title: "[Feedback]: "
```

The template chooser configuration can set `blank_issues_enabled: false`, leaving the structured form as the normal route. GitHub documents that users with Write, Maintain, or Admin access still see a maintainer-only blank issue option. `config.yml` can also provide `contact_links` for a private/sensitive channel once such a channel exists. [Configuring issue templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository) **[official]**

Do not set `projects:` in the form initially. GitHub requires the person opening the issue to have write permission to a project for that field to work, which an external tester normally will not have. If a Project is later useful, add issues through the Project's label-based Auto-add workflow instead. [Issue Form syntax](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms#top-level-syntax) [Adding items automatically](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/adding-items-automatically) **[official]**

### Proposed form fields

Keep the required set short enough that someone will actually submit feedback:

| Field | Form type | Required | Purpose |
|---|---|---:|---|
| Target stage | dropdown | yes | `Incubator initiative`, `Candidate skill`, `Released skill`, or `Repository process` |
| Target identifier | input | yes | Stable name or repository path, such as `incubator/harness/example-skill` or a released skill name |
| Feedback kind | dropdown | yes | `Unexpected behavior`, `Missing or unclear guidance`, `Workflow friction`, `Improvement idea`, or `Positive validation` |
| Context and outcome | textarea | yes | What the user/agent tried and what happened |
| Expected or desired outcome | textarea | yes | The comparison point needed for triage |
| Source version | input | no | Git ref, commit, tag, install source, or “unknown” |
| Reproduction/evidence | textarea | no | Minimal sanitized prompt, steps, output excerpt, timing, or observation |
| Impact/workaround | textarea | no | Severity and whether work continued |
| Privacy confirmation | checkboxes | yes | Confirms removal of secrets, client data, proprietary code, and sensitive logs |

Use stable ASCII field IDs such as `target-stage`, `target-id`, `feedback-kind`, and `source-version`. GitHub form elements support unique IDs, field validation, and input, textarea, dropdown, checkbox, upload, and Markdown elements. The rendered answers become Markdown sections in the resulting issue. [GitHub form schema](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-githubs-form-schema) **[official]**

`Positive validation` is deliberate. A skill should not be changed only from failure reports; evidence that a behavior worked in a real external project is also useful when deciding whether an incubating skill is ready to release. **[inference]**

## Low-friction submission from another project

### Human or agent-assisted browser path

The stable entry point is:

```text
https://github.com/ClydeShen/skills/issues/new?template=skill-feedback.yml
```

GitHub supports query parameters including `template`, `title`, `body`, `labels`, `milestone`, `assignees`, and `projects`, and also supports prefilling custom text fields defined by Issue Forms. Privileged values require the reporter to have the corresponding permission; invalid or unauthorized URLs can return `404`, and oversized URLs can return `414`. Therefore, use the form's own default labels and reserve the URL for the template, title, and short text-field values. [Creating an issue from a URL query](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue#creating-an-issue-from-a-url-query) **[official]**

A released skill or incubator test guide can eventually expose a target-specific link that prefills its target identifier and source version. The link should open a reviewable form; it should not submit automatically. **[inference]**

### Terminal/agent path

The official CLI can create an issue in another repository with an explicit title and body, and `--body-file -` reads the body from standard input. [GitHub CLI `gh issue create`](https://cli.github.com/manual/gh_issue_create) **[official]**

The portable recipe should be documented conceptually as:

```sh
gh issue create \
  --repo ClydeShen/skills \
  --title "[Feedback]: <target> — <short summary>" \
  --body-file -
```

The agent supplies Markdown on standard input using the same headings as the Issue Form. It should show the user the exact title and body and obtain confirmation before creating the public issue. Do not pass `--label` or `--project` from an external project: adding labels or Projects may require permissions the reporter does not have, while a fully specified body needs only normal issue-creation access. [Creating an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue#creating-an-issue-with-github-cli) **[official] / [inference]**

`gh issue create --template` is documented as using a template as starting body text. For predictable machine-generated structure, supply the complete Markdown body instead of relying on the CLI to reproduce the web form interaction. [GitHub CLI `gh issue create`](https://cli.github.com/manual/gh_issue_create) **[official] / [inference]**

### What to place in external projects

Do not require every external project to install a feedback action or hold a repository token. The test instructions only need:

- the canonical browser link;
- the canonical Markdown headings for an agent-generated report;
- the `gh issue create` recipe; and
- a warning that the destination is public and must be reviewed before submission.

The installed skill may later carry these instructions in its own bundled documentation, while incubator trials can link to the repository's feedback guide. Both should point to the same intake contract. **[inference]**

## Intake, triage, linkage, and closure are different stages

### 1. Intake

The Issue Form or CLI creates the record and applies the common intake labels:

```text
feedback
needs-triage
```

Avoid one label per skill or initiative. The canonical target belongs in the issue body, where it remains understandable if folders or labels change. A small label vocabulary is easier to maintain. **[inference]**

### 2. Triage

The maintainer verifies that the report is safe to retain publicly, reproducible or otherwise useful, and points to one canonical target. Then:

- remove `needs-triage`;
- add one target-stage label such as `target:incubator` or `target:released` if filtered views need it;
- optionally add one outcome label such as `accepted`, `needs-evidence`, or `duplicate`; and
- comment with the triage decision and the exact initiative/skill path being affected.

The form records what the reporter believed the target was; triage owns the authoritative linkage. This matters when a report about one released skill reveals a shared harness problem or should instead become new research. **[inference]**

### 3. Evaluation/change

For accepted feedback, the issue should state what evidence would demonstrate improvement before editing the skill. The resulting work may be:

- a new or revised evaluation/trial under the relevant incubator initiative;
- a change to a candidate package;
- a change to a released skill; or
- follow-up research when the report exposes an unresolved question.

Link the implementation pull request to the issue. GitHub supports manual linkage or closing keywords such as `Closes #123`; when a linked pull request merges into the default branch, the issue closes automatically. [Linking a pull request to an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue) **[official]**

### 4. Closure

Close as completed only when the accepted response has landed and its evaluation result is recorded. Otherwise close with an explicit reason such as duplicate or not planned, with a comment linking the duplicate or explaining the decision. The issue remains the audit trail from field experience to repository response. **[inference]**

## Labels and Project usage

### Minimal labels

Start with only:

```text
feedback
needs-triage
```

Add `target:incubator`, `target:released`, `accepted`, or `needs-evidence` only when saved filters or volume justify them. Do not copy the entire lifecycle into labels when the repository has only a few reports. **[inference]**

The labels referenced by an Issue Form must already exist; otherwise GitHub does not add them. [Issue Form syntax](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms#top-level-syntax) **[official]**

### Optional Project later

Plain Issue filters are adequate initially. Add a GitHub Project when feedback volume makes one queue valuable. A Project Auto-add workflow can watch this repository for `label:feedback` and add matching new or updated issues without depending on reporter permissions. GitHub Free currently permits one Auto-add workflow, while paid plans permit more. Existing matching issues are not backfilled when the workflow is first enabled. [Adding items automatically](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/adding-items-automatically) **[official]**

Useful later Project fields would be `Status`, `Target stage`, `Target`, and `Validation result`. They are triage metadata, not intake requirements. **[inference]**

## Why Discussions are optional, not the first intake

GitHub positions Discussions as transparent community conversations that do not need to be tracked in a Project and are not directly related to code, while Issues are suited to tracked work. Discussion category forms can collect structured fields, and a triager can create an Issue from a Discussion while retaining its body and labels. The original Discussion remains. [GitHub Discussions quickstart](https://docs.github.com/en/discussions/quickstart) [Discussion category forms](https://docs.github.com/en/discussions/managing-discussions-for-your-community/syntax-for-discussion-category-forms) [Creating an issue from a discussion](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue#creating-an-issue-from-discussion) **[official]**

Discussions become useful if a real community forms and people want open-ended experience reports, questions, or pattern-sharing before anything is actionable. Starting with both an Issue Form and a Discussion form would create two intake queues and force every reporter to decide which system the maintainer considers authoritative. Use Issues alone until that distinction is demanded by actual traffic. **[inference]**

## Why dispatch events are not a public feedback channel

`repository_dispatch` is designed for activity outside GitHub to trigger a workflow, and it accepts a custom `event_type` plus `client_payload`. `workflow_dispatch` provides a manual/API-triggered workflow with declared inputs. Both require a workflow on the default branch and authenticated API access; their REST endpoints require write-capable repository permissions (`Contents: write` for repository dispatch and `Actions: write` for workflow dispatch with fine-grained tokens). [Events that trigger workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#repository_dispatch) [Create a repository dispatch event](https://docs.github.com/en/rest/repos/repos#create-a-repository-dispatch-event) [Create a workflow dispatch event](https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event) **[official]**

Therefore neither is appropriate for public or widely installed skills: each external environment would need a write-capable credential for `ClydeShen/skills`. Never embed a shared token in a skill. A dispatch event could later be useful for the owner's trusted private test automation, but it should create or update the same canonical issue/evaluation record rather than become a parallel feedback store. **[inference]**

## Security and privacy

The destination repository is intended to be public, so its issues and discussions must be treated as public. Public repositories are accessible to everyone on the internet. [About repositories and visibility](https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories#about-repository-visibility) **[official]**

The form and agent instructions should explicitly say not to submit:

- access tokens, API keys, credentials, or secrets;
- client/customer names or confidential business context;
- private repository URLs or proprietary source code;
- complete prompts, logs, or generated output unless reviewed and sanitized;
- personal data that is unnecessary for diagnosis.

Ask for the smallest reproducible, sanitized excerpt. If the report cannot be made public, the user should stop and use a separately configured private contact route. A security vulnerability should go through GitHub Private Vulnerability Reporting when that feature is enabled, not through the normal feedback form. [Configuring private vulnerability reporting](https://docs.github.com/en/code-security/how-tos/report-and-fix-vulnerabilities/configure-vulnerability-reporting/configure-for-a-repository) **[official] / [inference]**

If Actions are added later, every issue title, body, label, and related event field must be treated as attacker-controlled input. GitHub specifically warns that values such as `github.event.issue.title` and body/title fields can cause script injection when interpolated directly into shell commands. Use least-privilege `GITHUB_TOKEN` permissions and pass untrusted values as data rather than executable shell text. [Script injections](https://docs.github.com/en/actions/concepts/security/script-injections) [Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use) **[official]**

The first version needs no Action at all. Template-applied labels and manual triage have a smaller attack surface and are adequate for a personal repository. **[inference]**

## Phased adoption

### Phase 1: smallest viable system

1. Enable Issues.
2. Create the two labels `feedback` and `needs-triage`.
3. Add one `skill-feedback.yml` Issue Form.
4. Add `config.yml` with blank public issues disabled.
5. Publish one feedback guide containing the browser link, the Markdown contract, the CLI recipe, and the privacy warning.
6. Use issue comments and linked pull requests to record triage and closure.

### Phase 2: only after repeated use

- Add target-stage/outcome labels if saved Issue filters are insufficient.
- Add a Project with label-based Auto-add if the queue needs a board or metrics.
- Add target-prefilled links to released skills and incubator trial instructions.
- Record a precise source ref/hash in trial instructions so reports can identify what was tested.
- Add a Discussion category only if exploratory community conversation is genuinely separate from actionable feedback.

### Phase 3: trusted automation only

- Validate that form headings are present or remind maintainers about untriaged issues.
- Synchronize accepted issues into an evaluation index if manual linkage becomes burdensome.
- Use dispatch events only from owner-controlled environments with narrowly scoped credentials.

No automation should auto-edit a skill, publish a candidate, or expose issue content to a privileged shell merely because a public issue was opened. **[inference]**

## Decisions still needed before implementation

- The private contact route for sensitive, non-security feedback; do not add a dead `contact_link` before choosing one.
- Whether Private Vulnerability Reporting will be enabled when the repository becomes public.
- The final canonical syntax for target identifiers, preferably repository-relative initiative paths and globally unique released skill names.
- Whether feedback submission instructions belong only in repository documentation or are also bundled with each released skill.
- What minimum evaluation evidence is required before closing an accepted report as completed.

## Sources

- [Creating an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue): issue permissions, URL query parameters, custom-form prefilling, CLI creation, and conversion from Discussions.
- [Configuring issue templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository): Issue Form location and `config.yml` behavior.
- [Issue Form syntax](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms): top-level keys, automatic labels, assignees, types, and Project permission constraint.
- [GitHub form schema](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-githubs-form-schema): supported fields, IDs, and validations.
- [GitHub CLI `gh issue create`](https://cli.github.com/manual/gh_issue_create): cross-repository issue creation, body files/stdin, templates, and metadata flags.
- [Adding items automatically](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/adding-items-automatically): label-filtered Project Auto-add behavior and limits.
- [Linking a pull request to an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue): development linkage and automatic closure on merge.
- [GitHub Discussions quickstart](https://docs.github.com/en/discussions/quickstart), [Discussion category forms](https://docs.github.com/en/discussions/managing-discussions-for-your-community/syntax-for-discussion-category-forms): intended use and structured forms.
- [Events that trigger workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows), [repository dispatch REST endpoint](https://docs.github.com/en/rest/repos/repos#create-a-repository-dispatch-event), [workflow dispatch REST endpoint](https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event): dispatch semantics and authentication.
- [About repository visibility](https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories#about-repository-visibility), [Private Vulnerability Reporting](https://docs.github.com/en/code-security/how-tos/report-and-fix-vulnerabilities/configure-vulnerability-reporting/configure-for-a-repository): public visibility and private security reports.
- [Script injections](https://docs.github.com/en/actions/concepts/security/script-injections), [Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use): untrusted event input and least-privilege workflow guidance.
