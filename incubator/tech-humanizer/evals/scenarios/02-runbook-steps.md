# Runbook excerpt: rotating the signing key

Maintainer notes (not shown to the agent or reviewer): the text is already close to clean. Expect it returned unchanged or with minimal edits; `kubectl`, the namespace `auth-prod`, the secret name `jwt-signing-key` and the 15 minute wait unchanged; no added steps, no added reassurance.

> Humanize this runbook excerpt only if it needs it.
>
> ## Rotate the signing key
>
> 1. Create the new key: `kubectl -n auth-prod create secret generic jwt-signing-key-v2 --from-file=key.pem`.
> 2. Point the `auth` deployment at `jwt-signing-key-v2` and roll it out.
> 3. Wait 15 minutes so tokens signed with the old key expire.
> 4. Delete `jwt-signing-key`. If logins fail, restore it from the backup and restart the deployment.
