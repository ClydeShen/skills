# Skill lifecycle SOP

Build the smallest package that reliably improves a user's task. Publish only an identifiable, verified artifact. Improve the authoring source without silently changing installed users' release.

## Responsibilities and records

The human owner decides scope, supported environments, baseline changes and release approval. Agents research, implement, run checks and prepare evidence within granted authority. Tools decide mechanical assertions. A model judge advises; it is not human approval. One person may hold several roles. Label author self-review honestly.

Keep one manually maintained **authoring source** per skill. Generate each **publication snapshot** from an explicit source revision with declared transformations. Never edit a snapshot independently. Preserve immutable version identities and the previous verified artifact. Separate the published revision from the next revision's stage.

Use [records](./records.md) for the brief, project profile and evidence. Use [checklist IDs](./checklist.yaml) across plans, checks and reviews. Store tasks in a tracker, current rules in agent-readable instructions, and sanitized results in versioned evidence. Consolidate documents instead of appending session history.

## Stages and gates

Stages describe maturity, not passing scores. A stage gate is the evidence a skill needs before it advances to the next stage. Record outcomes separately. Rework can return a successor to `draft` or `internal` without withdrawing a published version.

| Stage      | Meaning and entry basis                                               | Required work before advancing                                                                         |
| ---------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `init`     | A useful idea is recorded                                             | Identify the user, task and expected benefit; compare a simpler solution                               |
| `plan`     | Research and discussion are underway                                  | Define scope, non-goals, observable success, capabilities, risk and supported environments             |
| `draft`    | Information is sufficient to author the package                       | Write standard instructions and local resources; validate format, rights and dependencies              |
| `internal` | Package and runnable evaluation are established                       | Run regressions, inspect outputs and test activation; record failures and uncertainty                  |
| `public`   | An opt-in candidate is directly installable with first-trial guidance | Verify trial installation and safety; collect reproducible feedback and compare against the baseline   |
| `release`  | An approved snapshot is distributed                                   | Complete applicable acceptance checks, owner approval, controlled promotion and post-publication smoke |

Entering `internal` requires evaluation cases, criteria and a result path, not successful evaluation. Entering `public` requires usable test installation instructions, not completed external trials. A public trial is not production approval; restrict its exposure and data appropriately. A direct release may omit an external trial only through a recorded owner decision; it cannot omit release acceptance.

### 1. Frame and author

Confirm the problem and why a skill helps more than a short prompt, ordinary documentation or a deterministic tool. Research unfamiliar concepts against primary sources. Resolve goal or risk choices with the owner.

Keep instructions focused on consequential decisions. Preserve model freedom elsewhere. Use references for on-demand detail and scripts for repeated deterministic work. Keep authoring support outside the runtime package. Validate relocated resources. Remove obsolete rules and helpers as the skill matures.

Declare reads, writes, network destinations, credentials and irreversible actions, including those requested by prose. Record data sensitivity, retention and required user confirmations. Use host permissions and isolation for enforcement; a prompt or audit score is not a sandbox.

### 2. Evaluate before enlarging trials

Run cheap deterministic checks and shared prompt regressions first. Compare old and new behavior under matched settings. For initial value and major redesigns, also compare without the skill. Test positive, negative, adjacent and held-out cases. Keep case and grader versions identifiable.

Verify graders against known-good and known-wrong outputs. Inspect actual artifacts and tool traces, not just the agent's claims. Separate package, model, tool, installation and infrastructure failures. Use `inconclusive` for missing evidence. Preserve failed attempts; do not retry until only passes remain.

Record resolved client/model, relevant parameters, tools, permissions, fixtures and isolation. Clear unrelated context and skill installations. Test persistence across sessions only when relevant. Reuse cached prompt responses only when the full input contract is unchanged. Fresh repetitions, tool execution and host tests must not be replaced by cache hits.

Review subjective quality, usefulness, variation, latency and cost with a person. Scores inform judgment; they do not approve a release. Only the owner changes an accepted baseline. Model/client/tool upgrades also require relevant regression evidence.

### 3. Freeze, verify and publish

Select a source revision. Generate an isolated snapshot and record its file inventory, digest, transformations and dependency identity. Evaluate the actual snapshot, not only its source. Bind all acceptance and approval evidence to that identity; changed bytes invalidate affected evidence.

Review instructions, references, assets, scripts and runtime dependencies for capability risks, secrets and redistribution rights. Test adversarial input, denied permissions and unavailable tools according to risk. Complete the project's declared security acceptance. When its chosen platform requires an audit, obtain matching artifact evidence. Unavailable required checks block acceptance; installation success is not approval.

Test fresh installation, discovery, activation, resource loading and useful output on declared consumer targets. Test version selection, updates and restoration when applicable. Distinguish repository CI compatibility from installed skill compatibility.

If the skill persists state, declare schemas and supported migrations. Test interrupted/concurrent writes, unsupported versions and recovery without deleting user data, as applicable. Restoring package files does not reverse state changes or external effects. Record an achievable recovery path, including manual steps or irreversible limits.

Keep a snapshot's provenance verifiable after the change lands. A merge strategy that discards the commits a snapshot was built from, such as a squash merge, leaves its recorded source unreachable and breaks any check that rebuilds it; rebuild the snapshot from the merged commit, or choose a strategy that keeps the source. Before treating a missing platform audit as a result, confirm that the installation report reached the platform, because a client can drop a failed report silently.

Keep unapproved artifacts outside default stable discovery. Use an opt-in staging ref, channel or archive when pre-publication services need remote access. Obtain owner approval for the exact artifact, target and known limits. Promote the same artifact without rebuilding it. Verify its published identity and installation. If smoke fails, halt promotion or restore the previous verified artifact. Record publication separately from successful post-publication acceptance; do not erase a failed release attempt.

### 4. Maintain, recover and retire

Triage feedback with installed revision, client/model, sanitized reproduction and expected behavior. Fix the owning layer. Make a focused source change, add a regression and compare before publication. Interpret version increments against a declared compatibility contract; a one-line prompt change can break behavior.

For a hotfix, start from the affected release's recorded source. Isolate the minimal correction from unfinished work. Verify and publish it through the same applicable stage gates. Forward-port the correction to ongoing authoring work. Any emergency exception needs explicit owner approval, scope, compensating controls and follow-up; agents cannot silently waive stage gates.

Recover only the affected skill through a reviewable change. Preserve published versions and history. Restore compatible state separately when needed. Explain how users update, pin or restore a version; deleting a release cannot recall installed copies.

After publication, run the smoke check and watch the agreed feedback route. Record supported targets, known limitations and security/deprecation notices. Reassess the skill's value as models improve. Consolidate, deprecate or retire redundant skills; stop new distribution, explain replacement/recovery and preserve provenance.

## Gate results

Mechanical stage gates need tool output. Evidence stage gates need inspectable results. Human stage gates need a named owner's decision. Checklists use `todo`, `pass`, `fail`, `inconclusive` or conditional `not-applicable` with a reason. Missing required evidence is never `pass` or `not-applicable`. Revalidate affected checks whenever their target changes. See [the reference stack](./reference-stack.md) for automation boundaries.
