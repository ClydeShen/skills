# Minimal lifecycle records

Keep one current record for each responsibility. Link evidence instead of copying logs. Omit optional sections that do not apply. Never include secrets or real user data without authorization.

## Project profile

Record this once in the adopting project's harness instructions:

- Owner and approval authority; tracker and evidence locations.
- Authoring and snapshot locations; generated files and declared transformations.
- Supported clients, models, operating systems and runtime tools; explicit unsupported targets.
- Tool-role mapping: command, configuration, trigger, enforcement, evidence location and implementation status.
- Publication targets/adapters; staging versus stable exposure; required security/audit acceptance and identity binding.
- Version/compatibility contract, artifact digest method, retention and recovery responsibilities.
- Data/secret handling, network and credential boundaries; external-service cost/consent policy.
- Baseline owner; feedback/support route; post-publication smoke and review cadence.

Name each control as `implemented`, `manual` or `planned`. A command entry needs a real, verified invocation. A manual control needs a responsible person and repeatable procedure. Planned controls do not satisfy stage gates.

## Skill brief

- User, task, benefit and simpler/no-skill alternative.
- Scope, non-goals, observable success and material risks.
- Current next-version stage and its basis; published identity separately, if any.
- Capabilities: files read/written, network, credentials, irreversible effects and user confirmations; state `none` where true.
- Runtime dependencies and third-party asset rights/attribution.
- Supported input/output behavior, state schemas and compatibility constraints.

## Evaluation record

- Scope/mode: deterministic fixture, transport, model or host integration.
- Source/snapshot revision and digest; baseline/no-skill comparator identities.
- Cases, graders and calibration identities; held-out handling.
- Resolved client/model, parameters, OS, tools, configuration and permissions; unresolved values explicitly unknown.
- Isolation, discovery/activation evidence, cache policy, run command and fresh attempt IDs.
- Results and actual outputs/traces; failures, variation, human assessment, latency/cost where relevant.
- Limits, pending checks, conclusion and next action; checklist item IDs.

## Publication and recovery record

- Skill/version, source commit, snapshot file inventory/digest and declared transformations.
- Exact staged artifact/ref and destination; installer/client versions and supported consumer matrix.
- Validation, security, rights, behavioral and consumer evidence; required platform audit with artifact association.
- State migration/recovery evidence, or conditional non-applicability reasons.
- Named owner approval, date, approved artifact identity, targets and limits.
- Published immutable ref/digest; stable-promotion and post-publication smoke results.
- Previous verified version, package/state recovery procedure, update/pin instructions and support route.
- Hotfix origin and forward-port record when applicable; unresolved findings and any explicitly authorized exceptions.

Do not put unreleased bytes on the default stable path just to obtain an audit. Keep the release pending if the chosen adapter cannot establish required evidence.

## Checklist instance

Copy [checklist.yaml](./checklist.yaml), set its project and target identities, and update item evidence/status. Validate against [checklist.schema.json](./checklist.schema.json) and reject duplicate IDs separately. `phase` locates the check in the workflow; `maintenance` is ongoing work, not a seventh maturity stage. A completed item references the owning record or output; it does not duplicate it. Reopen affected items on target changes. Retain the accepted checklist with its artifact rather than overwriting it for a new release.
