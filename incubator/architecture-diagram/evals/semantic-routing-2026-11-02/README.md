# Semantic routing trials

Date: 2026-11-02. Purpose: check whether the package itself, without help from the authoring session, produces layouts whose routes and placement express meaning: lanes per flow, step order matching reading order, true boundary nesting, and no detours or avoidable crossings. Each run is a fresh Codex CLI 0.163.0 session in the `workspace-write` sandbox, in an isolated directory holding only the installed package and one scenario, with the prompt "Use the architecture-diagram skill to create diagram.drawio from scenario.md. Write your companion account to agent-report.md." The sandbox cannot render, so the parent rendered each PNG with draw.io Desktop 32.6.1.

Scenarios: [A, support assistant on AWS](./scenario-a.md) (also used in the [vendor mix trial](../vendor-mix-2026-11-02/README.md)) and [B, document Q&A on Azure](./scenario-b.md), not seen before by the rules.

## Round 1

Package at the state that added crossing, port-order, detour and jog checks. [A image](./round1-a/diagram.png), [B image](./round1-b/diagram.png), with editable files and agent reports beside them.

An independent read-only reviewer with no other context, given only scenario and image, scored A 8/10 and B 6/10. Findings that led to package changes:

- B nested the `westeurope` region inside a logical group, and left the Function outside it.
- B placed Cosmos DB (step Q3) above AI Search (Q1), so steps read out of order; AI Search, shared by both flows, sat on one side, forcing the ingestion write into a long route.
- Connector labels sat on bends (`2. Write answer`, `Every run`, `Q2`, `I1`).
- Key Vault, deployment and telemetry lines left a frame edge instead of the acting elements.

Changes: composition rules for call-order placement, shared services between flows, boundary nesting and connectors from acting elements; a check for labels on bends; meaning-first wording in `SKILL.md` that forbids silencing checks by changing meaning.

## Round 3

Package at commit `154c9b3`. Round 2 was interrupted and discarded. Both sessions were cut off before writing their agent reports: A by a network reconnect, B by an interruption. Their last `diagram.drawio` files were rendered: [A image](./round3-a/diagram.png), [B image](./round3-b/diagram.png). Not reviewed independently.

- A: ingestion runs along the top without crossings; Terraform is a real icon again; no detours. Steps leave the agent as 1 up, 3 right, 2 down, so they do not read in order.
- B: Key Vault and telemetry connect from both acting elements; Q1 to Q3 read top to bottom. `3. Store conversation` still crosses `Write embeddings`, and AI Search is still not placed between the two flows that use it. The region now appears only in a caption. The session's own layout check still listed three items when it stopped.

Neither round is evidence of repeatability.
