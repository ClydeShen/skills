# Arrow direction trial

Purpose: check that an arrowhead points where the request or data moves. A read, pull, poll or sync of a queue, secret store, configuration, repository or registry points from the store to its reader. A call points to the service it calls. The key names the two kinds of line "main flow" and "supporting flow".

Setup: the clean Claude Code setup and prompt of the [clean-session trials](../clean-session-2026-11-02/README.md), with scenarios [A](../semantic-routing-2026-11-02/scenario-a.md), [B](../semantic-routing-2026-11-02/scenario-b.md), [02](../scenario-02.md) and [C](../view-splitting-2026-11-04/scenario-c.md). A read-only reviewer with no other context read each source and the page, then scored it. The direction of every connector was also read from the file.

| Case | Files                                                                                  | Layout check      | Pages | Score |
| ---- | -------------------------------------------------------------------------------------- | ----------------- | ----- | ----- |
| A    | [file](./a/diagram.drawio), [image](./a/diagram.png), [report](./a/agent-report.md)    | 0 errors, 2 items | 1     | 7.5   |
| B    | [file](./b/diagram.drawio), [image](./b/diagram.png), [report](./b/agent-report.md)    | 0 errors, 0 items | 1     | 7.5   |
| 02   | [file](./02/diagram.drawio), [image](./02/diagram.png), [report](./02/agent-report.md) | 0 errors, 2 items | 1     | 7     |
| C    | [file](./c/diagram.drawio), [image](./c/diagram.png), [report](./c/agent-report.md)    | 0 errors, 2 items | 1     | 6.5   |

## Direction of the pull relationships in the files

| Case | Relationship                  | Connector                                   |
| ---- | ----------------------------- | ------------------------------------------- |
| B    | secrets read by the two apps  | Key Vault to the web app and to the function |
| C    | worker reads the queue        | Amazon SQS to the fulfilment worker, "reads" |
| C    | Argo CD syncs from Git        | Git repository to Argo CD, "pulls"           |
| C    | secrets read by the cluster   | Secrets Manager to the EKS cluster           |
| A    | assistant calls a vector index | Assistant service to Pinecone index, "retrieves" |
| A    | MCP server queries a CRM      | MCP server to Salesforce, "reads"            |

## Findings

- No reviewer read a pull relationship as a write into the store. In the earlier trials, reviewers read these as the reverse of the real flow in every scenario that has them.
- The reviewer of B still found the secrets arrows only "loosely" matching "read secrets". The key has no row that says what an arrowhead means, and reviewers asked for one in every trial.
- In A, the ingestion lines to the vector index are solid while the key words for the dashed style name "deployment"; reviewers read the two as inconsistent.
- C still draws the standby region as a database reader only, and its long dashed lines cross boundary outlines.
- Scores of one scenario on one package vary by up to one point between runs. One run per scenario here.
- Not tested: Codex.
