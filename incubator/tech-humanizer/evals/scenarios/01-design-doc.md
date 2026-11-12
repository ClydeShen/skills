# Design document section: Gateway migration

Maintainer notes (not shown to the agent or reviewer): expect `Gateway API`, `HTTPRoute`, `Ingress`, `p99`, `canary` kept exactly; the 40 ms figure and the Q1 date unchanged; no new claim about cost or security; promotional framing removed.

> Please humanize this section of our design document. It is for engineers on the platform team.
>
> ## Routing migration
>
> It is important to note that our robust migration to the Gateway API represents a pivotal milestone in our journey toward a seamless, scalable platform. By leveraging HTTPRoute resources, we are able to unlock a holistic approach to traffic management that seamlessly replaces the legacy Ingress setup.
>
> In today's fast-paced cloud landscape, p99 latency is crucial. Our initial canary showed p99 latency of 40 ms on the checkout route, which underscores the transformative power of this innovative approach. We plan to move the remaining routes in Q1. The rollback plan has not been tested yet.
