# Cloud conventions

Read "All clouds" and "Boundaries", then only the section for each cloud in the view. Draw the hierarchy that the cloud really has: a wrong nesting is a technical error, not a style choice. Show only the levels that the source supports, and fold the levels that change no decision.

## All clouds

- Use official service names. [Notation](./notation.md#elements-and-icons) sets how to use icons.
- Global services sit outside regions. A regional service sits in its region and outside zones; decide that region from the source first, then from platform constraints and standard practice, as [composition](./composition.md) describes. A zonal resource sits in its zone.
- Draw a PaaS service outside a subnet unless it is really injected there. Show private access with an endpoint icon on the boundary; do not move the service inside.
- Do not put every level in one view: an overview does not need subnets, and a network view does not need every API call.

## Boundaries

A boundary answers one of four questions: who owns its members and where they run (cloud, account, subscription, project, region), what can reach what (VPC, VNet, subnet), what the members run on (cluster, scaling group, workflow), or which services share one job (a light-filled logical boundary).

- Draw a level only when it separates elements that the reader must tell apart, such as a trust, failure or exposure boundary, or when it holds at least two drawn members. Otherwise, fold it: put a single region in its parent's title, omit subnets whose role decides nothing, and draw a host with no drawn members as one icon.
- A boundary that represents a service is that service. Put its service icon at the top left with the name beside it, using the vendor boundary style where the catalog has one and a generic boundary with the service icon otherwise. Never draw that service again as an element inside it.
- Every drawn AWS, Azure or Google Cloud cloud-level boundary has its provider marker and a readable title. Preserve a native boundary's built-in corner icon; use the exact provider mark for a generic cloud boundary. Do not add a cloud outline merely to display a logo. Query `find-icon.mjs --boundary` with the identities below. For deeper scopes, choose their actual identity, such as `Subscriptions` or `Virtual Networks`, rather than the cloud brand. Attach a marker to its boundary's title, not its traffic paths. A provider logo does not imply an unspecified subscription, region or network. For other boundaries with no reliable identity, use the text-only boundary that `find-icon.mjs --boundary` returns without an identity; do not borrow a service icon or duplicate a native corner marker.

| Cloud boundary  | Exact lookup with `--boundary`                   | Source                                                                        |
| --------------- | ------------------------------------------------ | ----------------------------------------------------------------------------- |
| AWS Cloud       | `--vendor AWS --id aws4-61258b1e47d472ca`        | Native AWS Cloud boundary with its corner icon                                |
| Microsoft Azure | `--vendor Azure --title "Microsoft Azure"`       | Pinned provider artwork, not an Azure service                                 |
| Google Cloud    | `--vendor "Google Cloud" --title "Google Cloud"` | Pinned provider artwork, not Distributed Cloud, Marketplace or a product icon |

- Put every boundary title in the same place: inside the outline at the top left. A boundary with a corner icon or marker starts its title beside it; a boundary without one starts its title at the same corner. Do not centre a title or move it to another edge. The styles that `find-icon.mjs --boundary` returns place it there.

- Draw zones only when zonal redundancy is the point, in the cloud's own hierarchy below.
- Security groups and network security groups are policy, not location. Outside a security view, state the access rule on the connector or in the companion account; do not draw a boundary per group.
- Use the vendor boundary style where the catalog has one; its dashes and colours are that vendor's notation. Draw every other boundary with one thin solid neutral outline, or a light fill. Name its kind in the title, not by dashes, colour or weight. Any other boundary style needs a key row.
- Nest at most three outlines in one view; a light fill without an outline does not count. Split deeper detail into its own view.

## AWS

Hierarchy: AWS Cloud, then Region, then VPC, then Availability Zone, then subnet. A VPC spans its Region's zones. A subnet belongs to exactly one zone, so a zone contains subnets and never the reverse.

- Use the catalog's `aws4Groups` styles: Region and Availability Zone are dashed, VPC is purple, a public subnet is green and a private subnet is teal. Choose public or private only when the source says so.
- An Auto Scaling group spans zones: draw one boundary across them in its vendor style, not one per zone.
- A load balancer serves several zones: place it in the VPC above or between the zones, connecting to each target group.
- Route 53, CloudFront and IAM are global, so they sit outside the Region. S3 and DynamoDB are regional, so they sit in the Region and outside the VPC unless a gateway endpoint matters.
- When a VPC is drawn and the source names them, put the internet gateway on the VPC boundary and NAT gateways in public subnets.

## Azure

Hierarchy: Subscription, then Resource group, then Region, then Virtual network, then subnet. A virtual network and its subnets span the zones of a region, so a zone does not contain a subnet.

- Azure defines no official border styles. Use thin solid outlines for region and virtual network, a light fill for subnets, and name each one in its title.
- Azure has no region icon. The Microsoft Azure mark labels the cloud level only; never put it on a region. With one region, draw one outline: the Microsoft Azure boundary, with the region in its title, such as "Microsoft Azure, region westeurope". Draw a separate text-only region outline inside it only when the view has two or more regions, or an Azure element that must sit outside the region, such as a global service.
- Show zones as a lane across the subnets, or mark resources `Zone 1`. Draw a zonal resource in its zone, and a zone-redundant resource once, spanning the zones.
- A resource group is a management scope, not a network boundary. Draw it only if the source makes it matter; do not imply that it isolates traffic.
- App Service, Cosmos DB, Storage and Key Vault are PaaS, outside subnets. Show VNet integration or a private endpoint as its own connection.
- Application Gateway and Azure Firewall have dedicated subnets. Front Door and Traffic Manager are global.

## Google Cloud

Hierarchy: Organization, then Project, then VPC network, then Region, then subnet, then Zone. A VPC network is global and a subnet is regional, so one VPC can contain several regions and a subnet can hold resources in any zone of its region.

- Google defines no official border styles. Use one thin outline for project and VPC, and a light fill for subnets, and name each one.
- Use a core product icon where the catalog has one, otherwise the category icon with the exact service name, such as `Networking` for Cloud Load Balancing. Do not use legacy icons.
- An external Application Load Balancer is global and sits outside regions. A regional managed instance group can span zones, so draw one boundary across them.
- Cloud Storage, BigQuery and Spanner sit outside subnets at their real scope.

## Engineering review

Ask these questions before you compose the view, and again on the finished image:

1. Where does traffic enter, and is the entry visible from its origin?
2. What are the failure domains? Would an outage of one zone or region stop the path?
3. Where are the single points of failure? Let the layout show them: an empty cell in the second zone is information.
4. Which boundary does each connector cross, and does the drawing show why?

Report a design risk in the companion account. Do not correct the architecture on the canvas, and do not write the risk on it.
