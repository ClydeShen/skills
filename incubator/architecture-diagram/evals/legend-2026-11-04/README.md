# Legend trial

Date: 2026-11-04. Purpose: check commit `5391f49`. Under it, a session prefers notation readers already know and drops invented dot and circle markers. It must also name, in a key, every package convention a view uses, such as dashed or dotted lines and line weights. The layout check reports any such convention that no key text names.

Setup: the same clean Claude Code setup and prompt as the [clean-session trials](../clean-session-2026-11-02/README.md), with scenarios [A](../semantic-routing-2026-11-02/scenario-a.md) and [B](../semantic-routing-2026-11-02/scenario-b.md). A read-only reviewer with no other context scored each image. The reviewer also listed every line style it saw, its reading of each, and whether the key explained it.

| Case | Files | Session | Layout check | Key on the image | Score |
| --- | --- | --- | --- | --- | --- |
| A | [image](./a/diagram.png), [file](./a/diagram.drawio), [report](./a/agent-report.md) | 17 turns, 212 s | 0 errors | "Dotted: telemetry, management. Heavy: main path" | 7/10 |
| B | [image](./b/diagram.png), [file](./b/diagram.drawio), [report](./b/agent-report.md) | 23 turns, 304 s | 0 errors | "Heavy line: question flow / Dotted line: secrets, telemetry, deployment" | 6/10 |

## Findings

- Both sessions added a key and used no dot or circle marker.
- Both reviewers had to guess the most common style, the thin solid arrow, because the key left it out. The B reviewer also found the dashed region boundary missing from the key.
- Both keys are plain text in a corner with no line samples, which makes them easy to miss and hard to match to lines.
- B uses one dotted style for three meanings (secrets, telemetry, deployment) without labels, so readers separate them only by their endpoints. `3 store` is thinner than steps 1 and 2 of the same flow.
- The [connector encoding research](../../../../research/diagrams/architecture-diagram/connector-encoding-conventions-2026-11-04.md) reaches the same conclusion for keys: list every encoding the view uses, including solid lines and the arrowhead.
- One run per scenario, Claude Code only.

## A and B after adopting the research encodings

Commit `3284b94` applies the [connector encoding research](../../../../research/diagrams/architecture-diagram/connector-encoding-conventions-2026-11-04.md). Connectors use one filled arrowhead, solid and dashed lines only, and two weights. Notation-specific ends are not used unless the key declares the notation. A view that mixes styles keys every style. Custom houses are thin solid outlines named by their titles. One rerun each, same setup; not reviewed independently.

| Case | Files | Session | Layout check | Key |
| --- | --- | --- | --- | --- |
| A | [image](./a-encodings/diagram.png), [file](./a-encodings/diagram.drawio), [report](./a-encodings/agent-report.md) | 16 turns, 252 s | 0 items | Boxed, three rows with sample lines: heavy, solid, dashed |
| B | [image](./b-encodings/diagram.png), [file](./b-encodings/diagram.drawio), [report](./b-encodings/agent-report.md) | 18 turns, 314 s | 0 errors, 2 items | Three rows with sample lines, no frame |

Both keys now list the solid line and show sample lines. B's region is a thin solid outline with a light fill, and every dashed line carries its own label. The owner then asked for the key as a table; that change follows.

## A and B with the key as a table

Commits `9927ad7` to `1d21bf4` draw the key as a native draw.io table titled "Key". Each row holds a sample line and its meaning. A key is needed only when a view has two or more kinds of line. One rerun each with the same setup, reviewed by a context-free reviewer, who also listed every line and box style and whether the key explained it.

| Case | Files | Session | Checks | Key table | Score |
| --- | --- | --- | --- | --- | --- |
| A | [image](./a-table/diagram.png), [file](./a-table/diagram.drawio), [report](./a-table/agent-report.md) | 18 turns, 289 s | layout 0, steps 0 | Heavy: main path / Solid: call or flow / Dashed: telemetry | 8/10 |
| B | [image](./b-table/diagram.png), [file](./b-table/diagram.drawio), [report](./b-table/agent-report.md) | 14 turns, 325 s | layout 0, steps 0 | Heavy: question flow / Solid: other runtime / Dashed: secrets, telemetry, deploy | 7/10 |

Both reviewers found every line style explained by the key, and neither had to guess a line style. The B score is up from 6/10, and A matches its best. Findings that hold:

- A draws step 2 heavy and steps 1 and 3 thin, although they belong to one flow. This breaks the rule to keep one weight within a flow, and no check tests it.
- In A, the AWS region's vendor dashed outline resembles the dashed telemetry lines; only colour separates them.
- In B, one dashed style carries three meanings, told apart by line labels, and three dashed lines run in parallel into the web app and the Function.
- The reviewers did not need the key to read the boxes. Vendor group styles and thin solid outlines were read from their titles.
