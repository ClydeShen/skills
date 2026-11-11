<div align="center">

# Architecture Diagram

**Describe your system in plain text. Get an editable architecture diagram with real cloud icons.**

[![License: MIT](https://img.shields.io/badge/license-MIT-2ea44f)](./LICENSE)
[![Node.js 24](https://img.shields.io/badge/node-24-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![draw.io 32.6.1](https://img.shields.io/badge/draw.io-32.6.1-F08705?logo=diagramsdotnet&logoColor=white)](https://www.drawio.com/)
[![Agents: any skills.sh agent](https://img.shields.io/badge/agents-any%20skills.sh%20agent-D97757)](#install)
[![Output: .drawio, PNG and SVG](https://img.shields.io/badge/output-.drawio%20%C2%B7%20PNG%20%C2%B7%20SVG-3b82f6)](#what-you-get)
[![Icons: AWS, Azure, Google Cloud, Kubernetes](https://img.shields.io/badge/icons-AWS%20%C2%B7%20Azure%20%C2%B7%20Google%20Cloud%20%C2%B7%20Kubernetes-232F3E)](#why-use-it)
[![skills.sh](https://img.shields.io/badge/skills.sh-architecture--diagram-000000)](https://www.skills.sh/clydeshen/skills/architecture-diagram)

![AWS](https://img.shields.io/badge/-AWS-FF9900?style=flat-square)
![Azure](https://img.shields.io/badge/-Azure-0078D4?style=flat-square)
![Google Cloud](https://img.shields.io/badge/-Google%20Cloud-4285F4?style=flat-square)
![Kubernetes](https://img.shields.io/badge/-Kubernetes-326CE5?style=flat-square)
![Cross-cloud](https://img.shields.io/badge/-cross--cloud-6f42c1?style=flat-square)
![draw.io](https://img.shields.io/badge/-draw.io-F08705?style=flat-square)
![Architecture diagrams](https://img.shields.io/badge/-architecture%20diagrams-1f2937?style=flat-square)
![Agent skill](https://img.shields.io/badge/-agent%20skill-0ea5e9?style=flat-square)

<img src="https://raw.githubusercontent.com/ClydeShen/skills/main/incubator/architecture-diagram/examples/aws-order-platform/diagram.png" alt="An architecture diagram of an order and analytics platform on AWS, drawn by the skill: CloudFront, API Gateway and Lambda functions inside a Region boundary, with DynamoDB, SQS, EventBridge, Step Functions, SNS, OpenSearch, Bedrock, Kinesis, Glue, Athena, Secrets Manager, KMS, CloudWatch, X-Ray, CodePipeline and CodeBuild, each with its official icon" width="900">

<sub>Drawn by this skill from the description under [See it work](#see-it-work). Unedited output of a clean agent session.</sub>

[Install](#install) · [See it work](#see-it-work) · [Examples](#examples) · [What it checks](#what-it-checks) · [FAQ](#faq)

</div>

---

## Install

Run this in your project. The [skills CLI](https://www.npmjs.com/package/skills) asks which agent to install into and handles the rest:

```sh
npx --yes skills@1.7.4 add ClydeShen/skills --skill architecture-diagram
```

Start a fresh agent session afterwards and confirm that `architecture-diagram` appears in its skill list. The skill needs an agent that reads `SKILL.md`, writes files into your project and runs Node.js 24 scripts. PNG export uses draw.io Desktop, or Git and Chromium or Chrome with network access on first use. Without those you still get the editable file and a browser link for viewing and export.

## Why use it

You know how the system works. Everyone else has to picture it. This skill turns a description of requests, services and boundaries into a diagram you can bring to a design review, paste into a wiki or keep editing.

| Benefit                          | In practice                                                                                                                                                                                                                                                 |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Layout that carries meaning**  | Boundaries show real membership. An arrowhead points where a request or data moves. Solid lines carry the main flow; dashed lines carry deployment, telemetry, secrets and DNS. One page by default, and a repeated structure is drawn once with its count. |
| **Real icons, never lookalikes** | More than 1,700 official AWS, Azure, Google Cloud and Kubernetes icons from the draw.io libraries, plus 75 bundled marks for platforms and AI services such as Cloudflare, GitHub, OpenAI, Pinecone and Langfuse. No exact icon? A plain labelled box.      |
| **Editable, not just a picture** | A `.drawio` file to open and change in draw.io, plus a PNG and an SVG of every page for documents and wikis.                                                                                                                                                |
| **It questions your source**     | A technical contradiction in your text is raised with a recommendation instead of being drawn as fact. Assumptions and open questions go into a short companion account, not onto the canvas.                                                               |
| **It checks its own work**       | Scripts report overlapping text, crossings, shared segments, detours and missing keys. The agent must read every rendered PNG before it hands the result over.                                                                                              |

## See it work

**You write** a description of how the system behaves. This is the whole input behind the picture above:

<details open>
<summary><strong>Order and analytics platform on AWS</strong> (input, verbatim)</summary>

> Shoppers load a web app that is stored in Amazon S3 and served through Amazon CloudFront. AWS WAF protects CloudFront, Amazon Route 53 resolves the site name, and shoppers sign in with Amazon Cognito.
>
> The web app calls Amazon API Gateway in region `eu-west-1`. API Gateway checks the Cognito token and invokes AWS Lambda functions:
>
> 1. The orders function writes the order to Amazon DynamoDB and puts a message on an Amazon SQS queue.
> 2. The fulfilment function reads the queue, reads stock levels from Amazon Aurora and publishes an `OrderShipped` event to Amazon EventBridge.
> 3. EventBridge starts an AWS Step Functions workflow that sends a notification through Amazon SNS to the shopper and to operators.
>
> The Lambda functions cache product lookups in Amazon ElastiCache for Redis. Amazon OpenSearch Service holds the product search index, which the catalog function queries. A recommendations function calls Amazon Bedrock.
>
> The web app sends clickstream events to Amazon Kinesis Data Streams. A Lambda function enriches them and writes them to an S3 data lake. AWS Glue catalogs the lake and Amazon Athena queries it.
>
> The Lambda functions read their secrets from AWS Secrets Manager, which uses AWS KMS keys. Amazon CloudWatch collects their logs and metrics, and AWS X-Ray traces their requests.
>
> AWS CodePipeline and AWS CodeBuild build and deploy the Lambda functions.

</details>

**You get** four files: `diagram.drawio`, `diagram.png`, `diagram.svg` and `agent-report.md`. The report is where the skill says what it assumed. Two lines from this run, verbatim:

> - **Shoppers appears twice** (origin and notification recipient) to avoid a return line across the whole diagram. Both are the same actor.
> - All icons are exact AWS catalog matches. Amazon S3 has no service icon in the catalog, only the Bucket resource icon, so the two S3 elements use it, with captions "S3 web app" and "S3 data lake".

[Open the example folder](https://github.com/ClydeShen/skills/tree/main/incubator/architecture-diagram/examples/aws-order-platform) for the input, the editable file and the full report.

## Examples

Every example is unedited output of a clean agent session: only this package and the scenario, nothing else. Each scenario was run more than once and the denser result is shown, so these pictures are the skill at its better end, not an average. Each folder holds the scenario, `diagram.drawio`, PNG, SVG and the companion account.

### Knowledge and data platform on Azure

A chat app with search, a model, caches and databases; microservices on AKS; document uploads; a telemetry pipeline into a data lake and machine learning; secrets, monitoring and a deployment pipeline.

<img src="https://raw.githubusercontent.com/ClydeShen/skills/main/incubator/architecture-diagram/examples/azure-knowledge-platform/diagram.png" alt="An Azure architecture diagram: Employees, Front Door and API Management in front of a chat front end, AKS microservices and Azure Functions, with AI Search, Azure OpenAI, Cosmos DB, Redis, SQL, Service Bus and Blob Storage, a telemetry lane from Event Hubs through Stream Analytics and Data Lake Storage to Machine Learning, and Key Vault, Application Insights, Azure Monitor, Log Analytics, Container Registry and Azure DevOps" width="900">

- The Microsoft Azure boundary carries the Azure mark and the region sits in a boundary of its own.
- The three backends form one group, so one connector says that all three use secrets, telemetry and deployment.
- Steps the source numbers (chat, microservices, uploads) are numbered on their connectors.
- Where the catalog has no exact match, the skill says so. From its report:

> - **Azure Data Lake Storage:** the catalog's only match is "Data Lake Storage Gen1" (a retired product). Gen2 normally uses the Storage Accounts icon, which is also used for Blob Storage. I used the Gen1 icon for the data lake to keep it distinct, and the caption says "Data Lake Storage".

[Input, editable file and report](https://github.com/ClydeShen/skills/tree/main/incubator/architecture-diagram/examples/azure-knowledge-platform)

### Private access from Azure to AWS

Function Apps in three Azure environments reach private API Gateways in AWS through a VPN, a Transit Gateway, DNS forwarding and a firewall inspection VPC.

<img src="https://raw.githubusercontent.com/ClydeShen/skills/main/incubator/architecture-diagram/examples/cross-cloud-private-api/diagram.png" alt="A cross-cloud architecture diagram: Azure spoke, hub and DNS VNets connected by a site-to-site VPN and a Transit Gateway to AWS ingress, inspection and egress VPCs and workload accounts" width="900">

- The DNS path (dashed) and the API path (solid) run side by side without sharing a line.
- The three Azure environments and the three AWS workload accounts are drawn once, with a count.
- The skill did not draw a statement that it judged technically doubtful. From its report:

> Step 5 says the Route 53 Resolver outbound endpoint forwards the request to the API Gateway VPC endpoint. An outbound endpoint forwards DNS queries to other resolvers. It does not carry API HTTPS traffic. I drew the outbound endpoint in the egress VPC with no connector, and the API path goes from the Network Firewall to the VPC endpoint. Please confirm what the outbound endpoint is for.

[Input, editable file and report](https://github.com/ClydeShen/skills/tree/main/incubator/architecture-diagram/examples/cross-cloud-private-api)

## What you get

| File              | What it is                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| `diagram.drawio`  | The editable diagram, one page per view. Open it in draw.io and change anything.                        |
| `diagram.png`     | A PNG of each page, sized for a wiki or a document.                                                     |
| `diagram.svg`     | A vector copy of each page.                                                                             |
| `agent-report.md` | The companion account: scope, assumptions, doubts about the source, design risks and the checks it ran. |

The PNG is rendered with draw.io's own viewer, so it matches the file.

## What it checks

The package ships its own scripts, so the agent can verify a diagram without a model or a network call:

- **Layout:** text that overlaps, connectors that cross or share a segment, detours around text, boundaries that a line leaves and re-enters, and pages wider than a reader can use.
- **Notation:** one kind of arrowhead, two kinds of line, a key whenever there is more than one kind, and no symbols that imitate connectors.
- **Steps:** every step your source numbers appears on a connector, in the order the drawn architecture runs.
- **Icons:** each icon is the exact upstream artwork, verified by hash, at one standard size.
- **Colour:** a contrast calculator for palette choices. Meaning never depends on colour alone.

Checks catch what can mislead a reader; they do not prove the architecture is right. The agent still has to read the picture, and so should you.

## Try it

```text
Use the architecture-diagram skill to create diagram.drawio from this scenario:

A browser calls an API in AWS. The API publishes jobs to a queue.
A worker consumes jobs and stores results in a database in the same VPC.
Show the request path and background processing separately. Do not invent subnets.
```

Read the first diagram against your source: what is connected, which way each path goes and what sits inside each boundary. Then ask for corrections or edit the file yourself.

## How to read the result

| You see                             | It means                                                                                     |
| ----------------------------------- | -------------------------------------------------------------------------------------------- |
| A solid line                        | The main flow: a request or data moving between components.                                  |
| A dashed line with a one-word label | A supporting flow: deployment, management, telemetry, secrets, DNS or replication.           |
| An arrowhead                        | Where the request or data moves. A read from a queue or a secret store points to its reader. |
| A boundary with a provider mark     | A cloud, account, region or network the elements really belong to.                           |
| `×3` or "same stack" in a title     | A structure that repeats identically, drawn once.                                            |
| Numbers on connectors               | The order of execution, where your source states an order or the order matters.              |
| A plain labelled box                | A service with no exact icon available. The skill never borrows a similar one.               |

## FAQ

<details>
<summary><strong>Can I edit the result?</strong></summary>

Yes. `diagram.drawio` is a normal draw.io file. Boundaries are containers and icons are real shapes, so moving an element keeps its connectors attached.

</details>

<details>
<summary><strong>What if my architecture is not on AWS, Azure or Google Cloud?</strong></summary>

Kubernetes, many platforms and AI services have icons too (for example Cloudflare, GitHub, Argo CD, Kafka, OpenAI, Anthropic and Pinecone). Anything without an exact icon becomes a plain labelled box with its true name.

</details>

<details>
<summary><strong>Does it send my description anywhere?</strong></summary>

The package scripts do not send your scenario anywhere. The first render downloads the pinned draw.io viewer from GitHub, and the agent you run is whatever you chose. Use sanitized scenarios, as you would with any agent.

</details>

<details>
<summary><strong>What is it not for?</strong></summary>

It does not generate infrastructure code, reverse-engineer a codebase, trace an image or draw general flowcharts. It draws architecture from a text description.

</details>

<details>
<summary><strong>Is it safe to run?</strong></summary>

The scripts start local programs: Git to fetch the pinned draw.io viewer once, and Chromium to render. Rendering runs headless with its sandbox disabled, serves only a local page and resolves no name other than `127.0.0.1`. Read the scripts before you install, as you would for any skill.

</details>

## Good to know

- **Check the picture.** A static check is not proof of architectural correctness. Inspect the first diagram against your source.
- **Restricted environments.** If the environment cannot start a browser or reach the network, PNG export may be unavailable. You still receive the `.drawio` file and a link for viewing and export.
- **License.** Original instructions and scripts use the [MIT license](./LICENSE). Third-party artwork retains its own terms in the [asset catalog](./assets/vendor-icons.json); this is not blanket MIT licensing of icons. Redistribution clearance and output attribution for some bundled artwork are not complete; the [third-party notices](./THIRD-PARTY-NOTICES.md) list what is cleared and what remains open.

Something drawn wrongly, or a scenario it struggles with? Share the input, the first diagram, the agent and model, the installed revision and what you expected in [the feedback issue](https://github.com/ClydeShen/skills/issues/7).
