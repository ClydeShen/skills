# Support assistant on AWS

Customers open the support site at `help.example.com`. Cloudflare proxies the site and forwards requests to an Application Load Balancer in AWS region `us-east-1`.

The load balancer sends requests to an assistant service that runs on an Amazon EKS cluster. The assistant is a LangGraph agent. For each question it:

1. retrieves related help articles from a Pinecone index;
2. calls Anthropic Claude through Amazon Bedrock to write the answer;
3. looks up the customer's open cases through an MCP server that also runs on the EKS cluster and reads from Salesforce.

Every agent run is traced to Langfuse Cloud. The EKS cluster's metrics go to Grafana Cloud.

Help articles are maintained in a GitHub repository. A GitHub Actions workflow embeds changed articles with OpenAI's embeddings API and writes them to the Pinecone index. Terraform, run from the same workflow, manages the AWS resources.
