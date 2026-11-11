# Optional publication adapter: skills.sh

Use this adapter only when the adopting project selects skills.sh as a distribution/discovery target. The core SOP supports other targets. The project profile declares whether matching external audit approval is required; this example assumes it is.

## Verify the integration

1. Pin and record the tested skills CLI version.
2. Check [official commands](https://github.com/vercel-labs/skills/blob/main/docs/commands.md) and [source parsing](https://github.com/vercel-labs/skills/blob/main/src/source-parser.ts) before documenting ref selection.
3. List the staged source and inspect the full package inventory separately. Name deduplication can hide duplicate packages.
4. Install the selected package into a disposable consumer workspace. Verify selected bytes, activation and package resources.
5. Obtain the required audit evidence and bind it to the staged artifact. Obtain owner approval before default stable exposure.
6. Promote and test the same artifact; document tested update, pin and recovery commands.

Generic repository selection example, not a release claim:

```sh
npx skills@<tested-cli-version> add <owner>/<repository> --skill <skill-name>
```

Replace placeholders. This form alone does not pin package content. Verify immutable-ref syntax with the selected CLI; do not assume namespaced per-skill tags work as version shortcuts. Verify candidate-only metadata and internal-install flags against the actual CLI rather than treating them as portable Agent Skills features.

## Installing from a proxied environment

Checked 2026-11-11: the CLI reports an installation and requests audit data with Node's built-in `fetch`, which ignores `HTTP_PROXY` and `HTTPS_PROXY`, and it discards a failed report without a message. In an environment whose only route out is a proxy, the install succeeds but skills.sh never receives it, so the repository and skill stay absent from the site and the audit endpoint returns an empty object. Run the installation with `NODE_USE_ENV_PROXY=1` (Node 24 or later) and the host allowed. Then both `tele/audit` and `tele/t` answer 200, and the repository and skill appeared on skills.sh within minutes. Do not read "no audit yet" as a platform result before the report is known to have been delivered.

## Audit limitation

Checked 2026-11-06: the [pinned CLI implementation](https://github.com/vercel-labs/skills/blob/d3701c11b1101251af14c9d148f026e1a47ebe17/src/telemetry.ts) requests audit data using repository source and skill names, without a revision/digest parameter. The [install implementation](https://github.com/vercel-labs/skills/blob/d3701c11b1101251af14c9d148f026e1a47ebe17/src/add.ts) displays partner results as advisory information. The request/response contract inspected does not establish which exact artifact was audited; it does not prove the backend never tracks revisions.

Therefore, CLI installation or a security table alone cannot satisfy an artifact-bound audit requirement. Record provider evidence associating its verdict with the intended revision/digest. If that association is unavailable, keep the gate inconclusive. Do not invent a `skills audit` command or silently substitute a local scan. [Telemetry configuration](https://github.com/vercel-labs/skills/blob/main/docs/troubleshooting.md#telemetry) can also affect audit requests; missing results are not passes.

A pushed but unapproved package on a moving default branch can already reach users. Use an isolated opt-in staging surface when available. If the selected service requires stable exposure before it can supply required acceptance, stop and resolve that conflict with the owner; a “pending” label does not prevent installation.

This adapter documents requirements and known limitations, not a completed publication pipeline. Recheck time-sensitive provider behavior before each integration change. No live platform audit result is asserted here.
