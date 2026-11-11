# Architecture Diagram examples

Unedited output of the skill, used by the [package README](../candidate/architecture-diagram/README.md) to show what it produces. Each folder holds what a user receives for one scenario:

| File              | What it is                                                                         |
| ----------------- | ---------------------------------------------------------------------------------- |
| `scenario.md`     | The input given to the skill and nothing else.                                     |
| `diagram.drawio`  | The editable diagram.                                                              |
| `diagram.png`     | The rendered page.                                                                 |
| `diagram.svg`     | A vector copy of the page.                                                         |
| `agent-report.md` | The companion account: scope, assumptions, doubts about the source and the checks. |

| Example                                               | Shows                                                                                      |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [aws-support-assistant](./aws-support-assistant/)     | AWS with platform and AI services from other vendors, plain boxes where no icon exists     |
| [azure-document-qa](./azure-document-qa/)             | An Azure-only view with one cloud boundary naming its region                               |
| [cross-cloud-private-api](./cross-cloud-private-api/) | Azure to AWS, DNS and API paths drawn apart, repeated environments drawn once with a count |

Each was generated in a clean agent session that had only the released package and the scenario, in the same way as the scenarios of the [baseline](../evals/baseline/README.md). They are illustrations of typical output, not measurements: the baseline holds the scores. Replace an example only with another unedited output, from the revision that the package README describes.
