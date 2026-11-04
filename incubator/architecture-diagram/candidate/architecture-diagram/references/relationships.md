# Showing relationships

Prefer position and nesting, then connectors, then shape. The image must read when printed: no animation, hover, tooltip, layer or colour-only meaning. Use only the encodings this view needs, each with one meaning. [Notation](./notation.md#connectors) sets the two kinds of line, the arrowhead and the key; the tables below choose among them.

Boundaries come in two families: a network or deployment boundary has a solid or vendor-styled outline, and a logical boundary has a light fill.

## The drawing is enough

| Relationship                 | Draw                                                    |
| ---------------------------- | ------------------------------------------------------- |
| Contains, deployed in        | Real nesting; no connector                              |
| Tier, layer                  | Bands or shared alignment                               |
| Same kind, several instances | Repeated or stacked icons                               |
| Simple order                 | One reading direction                                   |
| Fan-out, fan-in              | A topic or bus element with one line in and several out |
| Crosses a boundary           | One connector through the boundary outline              |
| Parallel branches            | One connector from the splitting element to each branch |

## Add the smallest word

| Relationship                         | Draw                                                      | Add only                    |
| ------------------------------------ | --------------------------------------------------------- | --------------------------- |
| Asynchronous call                    | A queue or topic element between the parties              | Its name                    |
| Two-way traffic                      | One connector per direction                               | The protocol, if it matters |
| Auxiliary, such as DNS or monitoring | Dashed line, away from the main path                      | One word                    |
| Standby, replica                     | The same icon in its own boundary                         | The role                    |
| Logical ownership                    | Light-filled boundary, distinct from a deployment outline | The boundary name           |
| Same kind, different implementation  | Peers aligned in one boundary, each with its own icon     | The boundary name           |
| Trust boundary                       | A boundary like any other, named for the trust zone       | The boundary name           |
| Failure path                         | A separate return connector on its own track              | The result, such as `403`   |
| Version or time                      | One view per version or time                              | The version or date         |

## Words are required

| Relationship                 | The drawing shows                        | Add only                                     |
| ---------------------------- | ---------------------------------------- | -------------------------------------------- |
| Decision                     | A `rhombus` with several exits           | The condition on each exit                   |
| Call meaning                 | Who calls whom                           | One verb, if the structure leaves it unclear |
| Protocol or contract         | A connection exists                      | Its name                                     |
| Transformation               | A step on the path                       | The shortest form, such as `XML to JSON`     |
| Response content             | A return connector, only when it matters | The content name                             |
| Retry                        | A self-loop                              | The count                                    |
| Global order across branches | Local direction                          | Step numbers                                 |

## Cloud relationships

| Concern    | Relationship                                | Draw                                                                                              |
| ---------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Network    | Peering, VPN, private link between networks | The traffic it carries, as hops through the gateway or endpoint icons, with the link's kind named |
| Network    | Gateway, NAT or firewall on a path          | An icon on the path, splitting the connector into hops                                            |
| Network    | Private endpoint                            | An icon on the boundary, with the caller connected to it                                          |
| Traffic    | Load balancing                              | One line into the balancer, then one to the target group                                          |
| Traffic    | CDN and its origin                          | Arrow from the CDN to the origin; viewers connect to the CDN                                      |
| Traffic    | DNS                                         | Dashed line from the resolving client to the DNS icon, and from there to the endpoint it returns  |
| Data       | Read, write                                 | Arrow from the initiator; one verb only if it matters                                             |
| Data       | Cache in front of a database                | The application connects to each; no cache-to-database line unless stated                         |
| Data       | Replication, standby                        | Dashed line between the same icons in their own boundaries                                        |
| Data       | Backup, archive                             | Dashed line to the store, with one word                                                           |
| Events     | Queue, topic, stream, schedule              | An element between the parties; the consumer's arrow shows whether it polls                       |
| Identity   | Sign-in and tokens                          | Connectors in order, with the token named once                                                    |
| Identity   | Role, key vault, secrets                    | Dashed line to one identity or key icon                                                           |
| Security   | Firewall rules across many pairs            | A table of allowances, when topology would be unreadable                                          |
| Operations | Monitoring, logging across many resources   | One shared band or boundary, not a line per resource                                              |
| Operations | Deployment pipeline                         | A separate view, or a visually separate control band                                              |
| Resilience | Failover, disaster recovery                 | A second boundary that holds the standby, with one dashed relationship                            |

## Uncertain relationships

- When the source states a relationship that it does not explain, or that is technically doubtful, do not draw it as a connector. Describe it in the companion account: what the source says, and why the drawing does not show it as an operational path.
- When the source names a service but not its caller, attach the connector to the edge of the smallest boundary that contains all possible callers, without a port marker.
