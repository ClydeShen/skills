# Resolved-input changes

Date: 2026-10-29. Authority: owner requested repair of actual diagram defects, preservation of architectural meaning and researched layout improvements. These are revised synthetic fixtures, not newly confirmed real deployments.

The [previous frozen inputs](../full-roundtrip-2026-10-29/inputs/l0-02.txt) and sibling Scenario 03 input remain unchanged. New descriptions preserve their other assumptions, exclusions and unknowns byte-for-byte outside the changes below. The correction generators revise the old L1 artifacts; this is a reviewed-artifact repair, not fresh-context L0 generation or a controlled old/new prompt comparison.

| Case | Change to resolved L0 | Authority and scope |
| --- | --- | --- |
| [02](./inputs/l0-02.txt) | Explicitly place the AWS Site-to-Site VPN attachment in the network services account owning Transit Gateway; clarify what the VPN symbol represents | [AWS constraint](https://docs.aws.amazon.com/vpc/latest/tgw/working-with-transit-gateways.html), researched before drawing. This supplies a missing derivable fact; it is not a claim that the old source contained it. |
| [03](./inputs/l0-03.txt) | Make API-Route-Processor → Common-Authx-Handler a solid main workflow call and retain the dashed role query | [Owner-approved draft](../scenario-03.md), expected step 4. Repairs normalization loss; it is not a new authorization design. |

Diagram-only repairs preserve the revised L0: the forwarding note explicitly names the outbound endpoint; the internal API Gateway → Lambda label no longer asserts JSON response; the external amend API still returns JSON; the two SOAP branches, method-to-role mapping, profile requirement and excluded struck-out operations remain unchanged. Layout changes alter positions, ports, routing, boundary dimensions and label wrapping. They do not add resources, merge calls or change other parents.

The original round-trip failures remain valid against their original source. A new same-information chain must give each generator only its immediate description and the same general policy, and each reader only its immediate raster. Research enrichment must not occur between levels. The present repair's blind readouts check the frozen revised images; they are not a completed L0/L2/L4 chain.
