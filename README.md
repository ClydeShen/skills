# Personal Agent Skills

**Good results shouldn't disappear with the chat.**

A diagram you can bring to a review. A useful next step when a conversation stalls. This collection turns recurring needs like these into skills you can install and use with your own agent.

## Put your architecture on the page

Describe how your system works. **Architecture Diagram** turns it into an editable draw.io diagram with real cloud icons: follow a request, see the boundaries, and bring something concrete to the discussion.

<img src="https://raw.githubusercontent.com/ClydeShen/skills/main/incubator/architecture-diagram/examples/cross-cloud-private-api/diagram.png" alt="An architecture diagram drawn by the skill: Azure integration workloads reaching a private API Gateway in AWS through a VPN, a Transit Gateway and DNS forwarding" width="860">

<sub>Drawn by the skill from a text description, unedited.</sub>

```sh
npx --yes skills@1.7.4 add ClydeShen/skills --skill architecture-diagram
```

[Examples, what it checks and how to start →](./skills/architecture-diagram/README.md)

More skills are in testing. They appear here when they are released.

## Why you can rely on a skill here

A skill is published only after it has been compared with a fixed quality baseline, checked for security by the skills.sh audit and approved by the owner. The checks and the decision are recorded for each release, and a published version is never edited in place.

Want to build and check your own skills the same way? Borrow the [lifecycle playbook and checklist](./knowledge/skill-lifecycle/README.md).

## Feedback

Try a skill and tell us what happened: your input, the first result and what you wished it had done differently. Each skill's page has a feedback link.

<sub>Working on this repository? Start with [AGENTS.md](./AGENTS.md).</sub>
