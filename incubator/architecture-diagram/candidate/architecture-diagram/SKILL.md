---
name: architecture-diagram
description: Create an editable draw.io architecture diagram from a text scenario, or refine a generated diagram against its source. Use for request, event, authentication or cross-cloud flows with deployment and system boundaries. Not for general flowcharts, infrastructure inventories, code/IaC reverse engineering or image tracing.
compatibility: Requires file access and draw.io v32.6.1 for editing and visual inspection. Optional icon lookup and catalog regeneration use Node.js 24; regeneration also requires Git and the pinned draw.io source checkout. No model endpoint is required.
metadata:
  internal: true
---

# Architecture Diagram

Produce one editable `.drawio` dynamic diagram in a deployment view. Preserve architectural meaning and make its structure visible.

## Establish the architecture

Identify the scenario, distinct instances, responsibilities, boundary membership, directed interactions and important conditions. Use supplied context before asking questions.

If the input contains several scenarios, ask which one to draw. Exclude struck-out text. Briefly disclose excluded business-rule details, schemas, sample data and unrelated alerting.

Check consequential vendor capabilities against official documentation when uncertain. If the input is contradictory or missing a fact that changes correctness, explain the issue and recommend a resolution. Wait for the user's decision before drawing that architecture. Do not invent a public endpoint, account owner, protocol or service capability. Keep nonessential unspecified details unspecified. Choose layout details yourself.

## Draw the meaning

Read [notation.md](references/notation.md) before composing the view. Read [drawio.md](references/drawio.md) when authoring or modifying the file.

- Show each distinct instance in its actual domain. Align repeated environments or branches so their similarities and differences are visible. Reuse drawing patterns, not entity identity.
- Connect participating components. Do not replace their existence or essential paths with “same as above” text or a mapping table.
- Choose a dominant reading direction. Place peers consistently and keep branches and joins recognizable. Placement must not invent sequence or ownership.
- Attach responsibilities to nodes, contracts to their exact hops, and conditions to their branches. Preserve distinctions such as wrapping XML in JSON versus converting XML to JSON.
- Keep every route inside domains shared by its endpoints. Cross only required boundaries. Move nodes or ports before adding detours; native inline labels interrupt their own stroke.
- Prefer supported visual structure and concise local labels to explanatory Notes. Use a table for a real repeated relation, such as firewall allowances, not as a substitute for topology. Never delete a fact just to reduce text.
- Use exact vendor/catalog matches. Use the documented plain-box fallback when no reliable match exists. Never borrow a similar icon.

## Inspect and deliver

Open or render the file with an available compatible draw.io viewer. Check the actual image, not XML alone.

Trace every entry through its intended destination, including auxiliary calls and explicit failures. Verify instances, memberships, protocols and conditions against the source. Check that branch selection cannot be mistaken for broadcast.

Check readable names, consistent typography, distinct paths, clear boundaries and labels attached to their lines. Prefer a direct orthogonal route where possible. Fix collisions without changing architectural meaning. Zero Notes and fewer bends do not establish quality.

Return the editable file and a brief account of unresolved assumptions, fallbacks and checks actually performed. State when visual or Desktop verification was unavailable. Do not claim that a diagram proves the real deployment is correct.
