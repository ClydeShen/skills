# Personal Agent Skills

**Good results shouldn't disappear with the chat.**

Agent skills that you install into your own agent. One is released today: Architecture Diagram.

## Architecture Diagram

Turns a text description of a system into an editable draw.io diagram. It uses official AWS, Azure, Google Cloud and Kubernetes icons, and also gives you PNG and SVG files for documents and wikis.

<img src="https://raw.githubusercontent.com/ClydeShen/skills/main/incubator/architecture-diagram/examples/cross-cloud-private-api/diagram.png" alt="An architecture diagram drawn by the skill: Azure integration workloads reaching a private API Gateway in AWS through a VPN, a Transit Gateway and DNS forwarding" width="860">

<sub>Drawn by the skill from a text description, unedited.</sub>

Install it in your project:

```sh
npx --yes skills@1.7.4 add ClydeShen/skills --skill architecture-diagram
```

[See examples and what it checks →](./skills/architecture-diagram/README.md)

More skills are in testing. They appear here when they are released.

## Why you can rely on a release

Before a skill is published, it is compared with a fixed quality baseline, checked by the skills.sh security audit and approved by the owner. Each release records its checks and the decision, and a published version is never edited in place.

To build and check your own skills the same way, borrow the [lifecycle playbook and checklist](./knowledge/skill-lifecycle/README.md).

## Feedback

Try a skill and send what happened: your input, the first result and what you expected instead. Each skill's page has a feedback link.

<sub>Working on this repository? Start with [AGENTS.md](./AGENTS.md).</sub>
