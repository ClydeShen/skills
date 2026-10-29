# Architecture layout and fidelity

Date: 2026-10-29. Question: how should spatial arrangement improve architectural understanding without changing the system? Context: the owner requested repairs to the round-trip findings and research into intuitive directions, house interiors and unnecessary bends.

## Conclusion

Use a deliberate dominant direction, nested semantic groups and consistent alignment. Choose the direction from the diagram's question, not a universal compass. Preserve domain membership, endpoint identity and call meaning before optimizing crossings, bends and page area. [inference] These recommendations implement the owner's request; their general effectiveness still needs reader evidence.

Confidence in this project direction: high, 3.5/4 (owner 1; research 0.75; reasoning 0.75; project history 1). Evidence supports grouping and directed layout, but does not establish a universally optimal arrangement for cloud diagrams.

## Evidence and implications

| Opened source | Observed guidance | Project implication |
| --- | --- | --- |
| [Microsoft architecture diagrams](https://learn.microsoft.com/en-us/azure/well-architected/architect-role/design-diagrams) | Choose the view for its audience/question; maintain consistent notation and accurate placement. Its example warns against depicting a PaaS service inside a subnet merely because access uses a private endpoint. [official] | Containment asserts architecture. Never change it to make routing easier. |
| [C4 notation](https://c4model.com/diagrams/notation) | C4 is notation-independent; specify scope, element responsibilities and directional labeled relationships. [official] | C4 does not mandate that clients are at the top or databases at the bottom. Retain the project's dynamic deployment view. |
| [NN/g common region](https://www.nngroup.com/articles/common-region/) | Enclosure makes objects appear related and can dominate other grouping signals. [official] | A house is a meaningful domain, not spare whitespace. An unknown owner cannot be represented safely by arbitrary placement outside a known account. |
| [NN/g proximity](https://www.nngroup.com/articles/gestalt-proximity/) | Nearness and whitespace communicate relatedness. [official] | Place local notes near their named subject; align peers and distinguish spacing within and between groups. Proximity alone cannot identify a binding. |
| [yWorks layered layout](https://www.yworks.com/pages/layered-graph-layout) | Directed layers expose sequence/dependencies; its process assigns layers, reduces crossings, then assigns coordinates. Nested groups, labels, ports and incremental layouts are separate concerns. [official] | Plan the main flow and houses before coordinates. Preserve recognizable order when revising. A commercial implementation is evidence of a method, not a required dependency. |
| [yWorks orthogonal layout](https://www.yworks.com/pages/drawing-orthogonal-diagrams) | Topology, shape and metrics are separate stages; bends and crossings are optimized alongside nested groups and label placement. [official] | Choose facing ports and shared rows/columns first. Add bends for actual obstacles, not a label's own background. |
| [Purchase 1997 paper record](https://research.monash.edu/en/publications/which-aesthetic-has-the-greatest-effect-on-human-understanding/) | The abstract reports crossing reduction as the strongest tested aesthetic; bends/symmetry had smaller effects, orthogonal-grid effects were not significant. [official · summary only] | Prioritize traceability over decorative symmetry. Do not claim that right angles alone scientifically guarantee comprehension. The full paper and transfer to cloud diagrams were not verified. |

## Direction is a convention with a purpose

For the project's English labels, left-to-right is a useful default for a request or processing sequence. A top-to-bottom dependency view can place clients above entry points, application work and deeper dependencies. These are design defaults [inference], not universal psychological laws. In a network view, peer clouds, regions and environments are often better aligned as peers than ranked by supposed depth. An auxiliary identity provider is not necessarily a deeper layer or an output sink.

Within a house, continue the chosen flow where practical: place entry-facing nodes near the incoming side, related work together and outgoing nodes near the destination-facing side. Use rows/columns and whitespace for visual lanes without inventing new domain boundaries. A side axis may separate environments or parallel branches; explain it when the meaning is not obvious. Return traffic remains folded into request labels under the accepted convention. Do not move a callee to an artificial "output" region just to satisfy a left/right rule.

## Platform evidence changes the F1 interpretation

[AWS Transit Gateway documentation](https://docs.aws.amazon.com/vpc/latest/tgw/working-with-transit-gateways.html) explicitly requires a Site-to-Site VPN attachment to be created in the account that owns the transit gateway. [official] Given Scenario 02's named Transit Gateway account and VPN attachment, that account membership is a supported derivation, not a project preference requiring another interview.

The frozen experiment remains a fidelity failure: L0 omitted the statement, L1 placed the VPN outside the account, and later levels changed its location. Its result does not establish that the later membership is factually wrong. The repair makes the attachment explicit inside the network services account, adds the derived fact to a new resolved input, and preserves the original run. This is baseline repair, not a same-input prompt victory.

[Azure Private Resolver documentation](https://learn.microsoft.com/en-us/azure/dns/private-resolver-endpoints-rulesets) distinguishes ruleset associations with outbound endpoints from ruleset links to VNets. [official] Name the outbound endpoint in the diagram's ruleset note. Preserve the supplied namespace pattern as a conceptual matching description; this drawing is not a validated Azure configuration file.

## What remains uncertain

No universal top/bottom/left/right law was established. NN/g's guidance concerns visual interfaces; applying it to architectural houses is a reasoned transfer. yWorks documents its algorithms, not controlled user studies of these specific artifacts. No eye-tracking study, reader-speed measurement, live cloud deployment, offline draw.io Desktop test or global layout optimality proof was performed. The two revised examples are repairs, not an estimated success rate.

Current reusable guidance is maintained in [architecture layout](../../../knowledge/diagrams/architecture-layout.md). Prototype-specific decisions and evidence belong to the [initiative](../../../incubator/architecture-diagram/README.md).
