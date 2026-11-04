# Online store on AWS

Shoppers reach `shop.example.com` through Amazon Route 53, Amazon CloudFront and AWS WAF. CloudFront forwards dynamic requests to an Application Load Balancer in the primary region `eu-west-1`; `us-east-1` is a warm standby with the same stack, and Route 53 fails over to it on a health check.

In each region, one VPC spans three availability zones. Public subnets hold the load balancer and NAT gateways. Private subnets hold an Amazon EKS cluster and the data services. The cluster runs six services: storefront, catalog, search, cart, checkout and payments. Storefront calls catalog, search and cart. Catalog reads products from Amazon Aurora PostgreSQL, a global database whose writer is in `eu-west-1` and whose reader is in `us-east-1`. Search queries Amazon OpenSearch Service. Cart keeps sessions in Amazon ElastiCache for Redis.

Checkout:

1. The shopper places an order; storefront calls checkout.
2. Checkout reserves stock through catalog.
3. Checkout calls payments, which charges the card through Stripe over the internet via the NAT gateway.
4. Checkout writes the order to Aurora.
5. Checkout publishes an `OrderPlaced` event to Amazon EventBridge, which delivers it to an Amazon SQS queue read by a fulfilment worker on the same cluster.

Secrets for Stripe and the database are in AWS Secrets Manager. GitHub Actions builds container images, pushes them to Amazon ECR and updates a Git repository that Argo CD, running in each cluster, syncs. Datadog agents on every node send metrics and logs to Datadog.
