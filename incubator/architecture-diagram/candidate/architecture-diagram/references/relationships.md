# Showing relationships

Prefer position and nesting, then connectors, then shape and line style. The image must read when printed: no animation, hover, tooltip, layer or color-only meaning. Use only the encodings this view needs, each with one meaning.

## Visual grammar

- **Neutral lines:** vendor symbols carry the color. Lines stay one dark neutral; only a failure path may use one accent, plus its own line style.
- **Two outline families:** solid or vendor-styled for deployment boundaries, light fill for logical groups.
- **Text hierarchy:** title, then boundary names, then element names, then connector labels, which are the smallest.

## The drawing is enough

| Relationship                 | Draw                                                 |
| ---------------------------- | ---------------------------------------------------- |
| Contains, deployed in        | Real nesting; no connector                           |
| Tier, layer                  | Bands or shared alignment                            |
| Same kind, several instances | Repeated or stacked symbols                          |
| Simple order                 | One reading direction                                |
| Fan-out, fan-in              | A topic or bus node with one line in and several out |
| Crosses a boundary           | One connector through the boundary                   |

## Add the smallest word

| Relationship                        | Draw                                                      | Add only                        |
| ----------------------------------- | --------------------------------------------------------- | ------------------------------- |
| Asynchronous call                   | A queue or topic node between the parties                 | Its name                        |
| Connected, no direction             | Avoid for flows; give each direction its own arrow        | Protocol if it matters          |
| Auxiliary such as DNS or monitoring | Thin dashed line, away from the main path                 | One word                        |
| Standby, replica                    | Same symbol in its own boundary                           | The role                        |
| Logical ownership                   | Light-filled boundary, distinct from a deployment outline | The boundary name               |
| Same kind, different implementation | Peers aligned in one boundary, each with its own symbol   | The boundary name               |
| Trust boundary                      | One fixed, stronger outline                               | The boundary name               |
| Failure path                        | Separate return connector in one fixed line style         | The result, such as `403`       |
| Parallel split                      | Shape other than the decision diamond                     | Nothing, if the key explains it |

## Words are required

| Relationship                 | The drawing shows                            | Add only                                     |
| ---------------------------- | -------------------------------------------- | -------------------------------------------- |
| Decision                     | A `rhombus` with several exits               | The condition on each exit                   |
| Call meaning                 | Who calls whom                               | One verb, if the structure leaves it unclear |
| Protocol or contract         | A connection exists                          | Its name                                     |
| Transformation               | A step on the path                           | The shortest form, such as `XML to JSON`     |
| Response content             | A return connector, only when it matters     | The content name                             |
| Retry                        | A self-loop                                  | The count                                    |
| Global order across branches | Local direction                              | Sequence numbers, as a last resort           |
| Version or time              | Solid and dashed outlines, or separate views | The version or date                          |

## Cloud relationships

| Concern    | Relationship                                | Draw                                                                                                    |
| ---------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Network    | Peering, VPN, private link between networks | Undirected line between the two network boundaries                                                      |
| Network    | Gateway, NAT or firewall on a path          | A symbol on the path, splitting the connector into hops                                                 |
| Network    | Private endpoint                            | A symbol on the boundary, with the caller connected to it                                               |
| Traffic    | Load balancing                              | One line into the balancer, then one to the target group                                                |
| Traffic    | CDN and its origin                          | Arrow from CDN to origin; viewers connect to the CDN                                                    |
| Traffic    | DNS                                         | Thin dashed line from the resolving client to the DNS symbol, and from there to the endpoint it returns |
| Data       | Read, write                                 | Arrow from the initiator; one verb only if it matters                                                   |
| Data       | Cache in front of a database                | The application connects to each; no cache-to-database line unless stated                               |
| Data       | Replication, standby                        | Dashed line between same symbols in their own boundaries                                                |
| Data       | Backup, archive                             | Thin dashed line to the store, with one word                                                            |
| Events     | Queue, topic, stream, schedule              | A node between the parties; the consumer's arrow shows whether it polls                                 |
| Identity   | Sign-in and tokens                          | Connectors in order, with the token named once                                                          |
| Identity   | Role, key vault, secrets                    | Thin dashed line to one identity or key symbol                                                          |
| Security   | Firewall rules across many pairs            | A table of allowances, when topology would be unreadable                                                |
| Operations | Monitoring, logging across many resources   | One shared band or group, not a line per resource                                                       |
| Operations | Deployment pipeline                         | A separate view, or a visually separate control band                                                    |
| Resilience | Failover, disaster recovery                 | A second boundary holding the standby, with one dashed relationship                                     |

## Text limits

Visible text is a name, role, verb, protocol, or a condition or value. Keep a connector label to about three words. A phrase describing what a line is, such as `logical tier processing`, does not qualify.

## Uncertain relationships

Keep a relationship the source states but does not explain as an unlabeled dashed connector, and explain it in the companion record. When the source names a service but not its caller, attach the connector to the edge of the smallest boundary containing all possible callers, without a port marker.

List in the key every encoding this view uses whose meaning no common standard fixes; see [composition](./composition.md).
