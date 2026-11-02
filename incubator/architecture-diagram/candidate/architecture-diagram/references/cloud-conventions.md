# Cloud conventions

Read only the section for each cloud in the view. Draw the hierarchy that cloud really has: a wrong nesting is a technical error, not a style choice. Show only levels the source supports, and collapse levels that change no decision.

## All clouds

- Use official service names and current icons. Do not crop, rotate, stretch or recolor them. Keep the name near the icon without overlapping it.
- Global services sit outside regions. A regional service sits in the region the source names for it and outside zones; when the source names no region for a service, do not place it in another element's region. A zonal resource sits in its zone.
- Draw a PaaS service outside a subnet unless it is really injected there. Show private access with an endpoint symbol on the boundary, not by moving the service inside.
- Draw one arrow from initiator to dependency. For traffic truly initiated from both sides, draw two connectors. Do not use a double-headed arrow.
- Layer rather than overload: an overview does not need subnets; a network view does not need every API call.

## AWS

Hierarchy: AWS Cloud, then Region, then VPC, then Availability Zone, then subnet. A VPC spans its Region's zones. A subnet belongs to exactly one zone, so a zone contains subnets and never the reverse.

- Use the catalog's `aws4Groups` styles: Region and Availability Zone are dashed, VPC is purple, a public subnet is green and a private subnet is teal. Choose public or private only when the source says so.
- An Auto Scaling group spans zones: draw one dashed group across them, not one per zone.
- A load balancer serves several zones: place it in the VPC above or between the zones, connecting to each target group.
- Route 53, CloudFront and IAM are global, so they sit outside the Region. S3 and DynamoDB are regional, so they sit in the Region and outside the VPC unless a gateway endpoint matters.
- When a VPC is drawn and the source names them, put the internet gateway on the VPC boundary and NAT gateways in public subnets.

## Azure

Hierarchy: Subscription, then Resource group, then Region, then Virtual network, then subnet. A virtual network and its subnets span the zones of a region, so a zone does not contain a subnet.

- Azure defines no official border styles. Use thin dashed outlines for region and virtual network, a light fill for subnets, and name each one.
- Show zones as a lane across subnets, or mark resources `Zone 1`. Draw a zonal resource in its zone, and a zone-redundant resource once, spanning the zones.
- A resource group is a management scope, not a network boundary. Draw it only if the source makes it matter; do not imply that it isolates traffic.
- App Service, Cosmos DB, Storage and Key Vault are PaaS, outside subnets. Show VNet integration or a private endpoint as its own connection.
- Application Gateway and Azure Firewall have dedicated subnets. Front Door and Traffic Manager are global.

## Google Cloud

Hierarchy: Organization, then Project, then VPC network, then Region, then subnet, then Zone. A VPC network is global and a subnet is regional, so one VPC can contain several regions and a subnet can hold resources in any zone of its region.

- Google defines no official border styles. Use one thin outline for project and VPC, and a light fill for subnets, and name each one.
- Use a core product icon where the catalog has one, otherwise the category icon with the exact service name, such as `Networking` for Cloud Load Balancing. Do not use legacy icons.
- An external Application Load Balancer is global and sits outside regions. A regional managed instance group can span zones, so draw one group across them.
- Cloud Storage, BigQuery and Spanner sit outside subnets at their real scope.

## Engineering review

Ask these before composing and again on the finished image:

1. Where does traffic enter, and is the entry visible from its origin?
2. What are the failure domains? Would an outage of one zone or region stop the path?
3. Where are the single points of failure? Let the layout show them: an empty cell in the second zone is information.
4. Which boundary does each connector cross, and does the drawing show why?

Report a design risk in the companion record. Do not correct the architecture on the canvas, and do not write the risk on it.
