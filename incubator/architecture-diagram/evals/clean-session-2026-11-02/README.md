# Clean-session trials

Date: 2026-11-02. Purpose: check, with no help from the authoring session, whether the package at commit `cc7d529` lays out source steps as an unordered set and numbers them afterwards by execution logic, without tangles or needless bends.

Setup: one Claude Code 2.1.316 `-p` session per scenario, model `claude-sonnet-5-5`. Each ran in an empty directory outside the repository with a fresh `HOME` and a cleared environment, holding only the package under `.claude/skills/` and one scenario as `scenario.md`. A probe session with the same setup reported no `CLAUDE.md`, no memory and only built-in skills. Prompt: "Use the architecture-diagram skill to create diagram.drawio from scenario.md. Write your companion account to agent-report.md." Unlike the Codex rounds, these sessions could render, and both inspected their PNG. The parent re-rendered each final file with the package's `render.mjs`.

Scenarios: [A](../semantic-routing-2026-11-02/scenario-a.md) and [B](../semantic-routing-2026-11-02/scenario-b.md) from the semantic routing trials. One run each; this is not evidence of repeatability.

| Case | Files                                                                | Session                  | Layout check   | Independent score |
| ---- | -------------------------------------------------------------------- | ------------------------ | -------------- | ----------------- |
| A    | [image](./a/diagram.png), [file](./a/diagram.drawio), [report](./a/agent-report.md) | 19 turns, 213 s | 0 items        | 7/10              |
| B    | [image](./b/diagram.png), [file](./b/diagram.drawio), [report](./b/agent-report.md) | 22 turns, 376 s | 19 items, left | 6/10              |

A read-only reviewer with no other context, given only the scenario and the image, scored each case. Round 1 scores for the same scenarios were A 8/10 and B 6/10, from Codex sessions.

## A

Steps are numbered by the logic and do not tangle: `1 retrieve` leaves upward to Pinecone, `2 generate` right to Bedrock and `3 lookup` down to the MCP server. The reviewer could follow the sequence. Reviewer findings that hold: `traces` starts at the EKS frame instead of the assistant, Cloudflare is not named, and `1 retrieve` and the ingestion `write` reach Pinecone at nearly the same point. The reviewer's main deduction, that Bedrock sits outside the region, is wrong: Bedrock is inside the region frame and outside the EKS frame.

## B

AI Search now sits between the query and ingestion flows, which both reach directly; earlier rounds left it to one side. The query calls lost their meaning: the web app fans out to Cosmos DB, AI Search and Azure OpenAI from one shared trunk with no labels or numbers, Cosmos DB is on top, and the agent report does not mention the source's three steps. The reviewer could not follow the sequence. Other findings: secrets and telemetry pairs share a start stub, Function to AI Search has a notch and no label, the deploy line crosses the region title, and the session kept 19 layout reports, calling the shared fan-out deliberate.

## Findings

- Laying out the steps as an unordered set gave an untangled fan-out in both cases.
- Numbering afterwards worked in A and was skipped in B. The notation rule numbers interactions only "when execution order is needed and layout alone cannot establish it", which leaves room to drop them; nothing requires a sequence stated in the source to appear on the diagram.
- Shared trunks and start stubs were reported by the layout check and kept as deliberate.

## B after requiring stated steps

Commit `f8ae813` requires every step the source orders to appear with a number and an action label; layout still treats the list as unordered. One rerun of B with the same setup: [image](./b-numbered/diagram.png), [file](./b-numbered/diagram.drawio), [report](./b-numbered/agent-report.md); 16 turns, 235 s; layout check 5 items, all connectors through the web app's or Function's caption.

The query calls now read `1 search`, `2 answer` and `3 store`, fan out without crossing, and AI Search and Azure OpenAI sit between the two flows. The ingestion path is labeled but not numbered, as the source gives it no order. The independent reviewer scored 7/10 and followed the sequence. Findings that hold:

- The `westeurope` frame encloses every Azure service, though the source places only the web app there. The earlier B run did the same.
- Entra ID and AI Search are plain boxes while other services have icons.
- Deploy, telemetry and `3 store` leave the web app's underside about 20 units apart, and the Function's caption sits away from its icon, so lines and captions are hard to attribute.

The reviewer also read the secrets arrows as writes to Key Vault; the package draws arrows from initiator to callee, so that reading is not a defect.

## B after keeping auxiliary connectors from reading as a boundary

In the numbered rerun, the secrets and telemetry lines ran around AI Search, Azure OpenAI and Cosmos DB and together formed a dashed rectangle like the region frame, so Key Vault read as sitting on a zone's edge. Commit `a3c662c` forbids auxiliary connectors that enclose elements, places shared support services in a support lane and gives auxiliary connectors a dotted pattern. One rerun of B with the same setup: [image](./b-support-lane/diagram.png), [file](./b-support-lane/diagram.drawio), [report](./b-support-lane/agent-report.md); 20 turns, 231 s; layout check 22 items, kept.

No connectors enclose elements: Key Vault and Application Insights sit in a middle support row, auxiliary lines are dotted, and every service has an icon. Steps read `1 Ask` to `4 Store` for the query and `A Upload` to `D Index` for ingestion. The independent reviewer scored 6/10. Findings that hold, each confirmed by a shared-segment report in the layout check:

- Both Deploy lines join other connectors instead of reaching their targets alone: one runs on the `1 Ask` line, the other on the `B Trigger` line, so they read as deploying into a request or into Blob Storage.
- `2 Search` leaves the web app on the same trunk as the dotted secrets and telemetry lines; the Function's lines likewise share a trunk with `D Index`.
- The `westeurope` frame still encloses every Azure service, as in both earlier B runs.
- Secrets and telemetry lines have no labels.

## B after forbidding shared segments and unstated region membership

Commit `d8e0d3b` forbids connectors of different meaning from sharing a segment, asks for every shared-segment report to be fixed, and keeps services of unstated location out of a stated boundary. One rerun of B with the same setup: [image](./b-no-shared/diagram.png), [file](./b-no-shared/diagram.drawio), [report](./b-no-shared/agent-report.md); 19 turns, 144 s; layout check 6 items.

The independent reviewer scored 7/10. Findings:

- All 15 connectors use `edgeStyle=none`: straight diagonal lines. No segment is shared, but only because nothing is orthogonal. The package asks for orthogonal routes in prose and never names the style, and the layout check computes orthogonal routes only, so it said almost nothing. The reviewer did not count the diagonals against the image.
- The `westeurope` frame still encloses every Azure service. The agent report justifies it, consistent with `cloud-conventions.md`, which says a regional service sits in its region; that rule overrides the new one in practice.
- `1 sign in` and `2 question` were numbered into the query sequence, so the source's three steps became 3 to 5. The ingestion path runs along the whole bottom edge and back up, and is not numbered.
