# Reference stack and automation boundaries

Choose tools by responsibility, not brand. Pin tested versions in the adopting project's dependency/lock configuration. Keep runtime skill dependencies separate from the repository's development tools.

| Responsibility                | Replaceable examples                                                        | When and evidence                                                            | Boundary                                                         |
| ----------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Change isolation and identity | Git, short task branches/worktrees, immutable refs                          | Each change; source revision, reviewed diff, artifact digest                 | No permanent branch per skill or full GitFlow required           |
| Coordination and context      | Issue tracker, root agent instructions, harness profile                     | Session startup and handoff; task owner, current rules and tool mapping      | Client memory is not shared authority                            |
| Deterministic hygiene         | Formatter/linter such as Biome or Prettier; link/format/resource validators | Each commit/PR; reproducible exit/output                                     | Format is not behavioral quality                                 |
| Repository health             | Knip, dependency-cruiser, package/inventory checks                          | Tooling or dependency changes; unused-code and boundary results              | Do not delete files solely to clear a heuristic                  |
| Secret and capability review  | Gitleaks, skill scanners, manual diff review                                | Runtime content/dependency changes and pre-publication                       | Scan all runtime material; scanner approval is not isolation     |
| Regression evaluation         | Promptfoo or equivalent shared runner                                       | Internal onward; case/rubric identity, comparisons, artifacts, cost          | Synthetic replay tests mechanics, not live usefulness            |
| Consumer execution            | Isolated agent client sessions and disposable workspaces                    | Behavior changes and actual snapshot acceptance                              | Verify resolved model/tool state; observe effects                |
| Automation runner             | Local hooks, CI, scripts                                                    | Fast local feedback and reproducible PR checks                               | Hooks are bypassable; model calls need explicit cost/data policy |
| Publication adapter           | Git/archive export, registry API, optional skills.sh CLI                    | Stage, inspect, promote, install, update and restore one identified artifact | Never infer audit approval from install success                  |
| Record validation             | YAML/JSON + JSON Schema validator                                           | Checklist changes and gate review                                            | Valid structure cannot prove evidence or human approval          |

## Minimal setup

Start with Git, agent instructions, a tracker, package validation, one evaluation runner and a documented manual release procedure. Add scripts when they remove repeated deterministic work. Use a small number of shared commands; clients and CI should call the same implementation.

For every control, record its configuration, trigger, result artifact, responsible role, enforcement and current implementation status. Test validators with positive and negative fixtures. A profile that says only “CI enabled” is not sufficient. Static checks can block mechanical errors. Behavioral evidence informs human acceptance; avoid a single aggregate quality score.

## Publication adapter contract

Every adapter must explain how to select immutable input, stage without stable exposure, inspect/download actual bytes, run required acceptance, promote the same bytes, install/update/pin and restore. These are operations to implement or perform manually, not invented CLI commands.

For plain Git or archive delivery, an isolated staged ref/archive plus a recorded manifest and digest can provide the artifact boundary. Test the actual consumer extraction/discovery path. Promote a verified ref or identical archive only after approval. A registry needs equivalent content identity, channel and recovery behavior. Neither requires skills.sh specifically.

If a target cannot preserve identity across packaging or promotion, verify its transformation and bind acceptance to the resulting artifact. If a required audit cannot identify that artifact, keep publication blocked and resolve the adapter or obtain an explicit owner policy decision. Do not change targets silently to bypass a failed gate.

## Cost and data controls

Run deterministic checks before paid evaluations. Cache unchanged prompt-only inputs where valid; never count cached runs as independent repetitions. Declare endpoint, data classes and budget before external model calls. Keep credentials outside version control. Sanitize retained failures while preserving enough evidence to reproduce them. Declaring a tool here does not authorize installation, network access, spending or publication.
