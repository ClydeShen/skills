# Vendor mix trial

Fresh Codex CLI 0.163.0 session on 2026-11-02, in the `workspace-write` sandbox, with the skill copied from the working tree at `f80a640` and only the synthetic [scenario](./scenario.md). Prompt: use the skill to create `diagram.drawio` from `scenario.md` and write the companion account to `agent-report.md`. 65,568 tokens, one run. The session could not render (`listen EPERM`); the parent rendered [diagram.png](./diagram.png) with draw.io Desktop 32.6.1 afterwards. See the [editable file](./diagram.drawio) and [agent report](./agent-report.md).

## Findings

Icon workflow, as intended:

- The session listed vendors, looked up each icon by exact title, used the returned placement unchanged and ran `embed-icons.mjs`. Ten vendor icons from three sources sit beside draw.io AWS icons at one standard size, with captions below.
- No icon was borrowed or drawn. The MCP server is a plain box: the server is the team's own component, so the protocol mark would describe the wrong thing.

Mixed-vendor appearance:

- AWS service icons are filled tiles; brand marks are bare symbols. At the same 72-unit size the tiles look heavier, but both read clearly.
- Wide marks (Cloudflare, Salesforce, LangGraph, Langfuse) are 40 high and look slightly smaller than square icons, while staying legible.

Remaining problems, not caused by icons:

- `Run` overlaps the OpenAI caption; the Langfuse trace line runs through the assistant caption; the Bedrock caption touches the EKS cluster title.
- `check-layout.mjs` reported nothing, so it does not detect caption collisions with connector labels or frame titles.
- The sandbox still prevents the session from seeing its own image, so these went unfixed.

## After label and route rules

The findings above led to a fixed caption width in the standard placement, caption and route rules in `composition.md`, and new `check-layout.mjs` checks: estimated caption, title and connector-label collisions, labels set away from their line, connectors that leave and re-enter a shared region or pass through a foreign one, detours and jogs. An intermediate run showed that detours, jogs and separately drawn captions still escaped; the checks now cover them.

A fresh Codex session with the final package redrew the same scenario: [image](./after-label-rules/diagram.png), [editable file](./after-label-rules/diagram.drawio), [agent report](./after-label-rules/agent-report.md). 40,887 tokens, one run. Its layout check went from 12 items to 0 over several revisions. The parent render shows no overlapping captions or labels, no detour around text, and each connector crosses the EKS and AWS outlines only where its ends require. Remaining: three connectors leave the assistant's right side close together, and `Write embeddings` crosses `Manage resources`.

Neither run is evidence of repeatability.
