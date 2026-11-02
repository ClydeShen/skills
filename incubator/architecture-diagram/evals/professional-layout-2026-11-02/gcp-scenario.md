# Synthetic Google Cloud scenario

An order service runs on Google Cloud in one project, on a single VPC network named `orders-vpc`.

Customers reach `shop.example.com`. Cloud DNS resolves the name to a global external Application Load Balancer, which forwards requests to a regional managed instance group of Compute Engine VMs in `europe-west1`. The instance group runs across zones `europe-west1-b` and `europe-west1-c`, in subnet `orders-subnet`.

The VMs read and write orders in a Cloud SQL for PostgreSQL instance in high-availability configuration, with its primary in `europe-west1-b` and its standby in `europe-west1-c`. The two replicate synchronously. The VMs connect to Cloud SQL by private IP.

When an order is accepted, the VMs publish an event to a Pub/Sub topic. A Cloud Run service subscribes to the topic and writes invoices to a Cloud Storage bucket. Static product images are served from another Cloud Storage bucket behind Cloud CDN, on the same load balancer.

Cloud Monitoring collects metrics from the VMs and the Cloud Run service.
