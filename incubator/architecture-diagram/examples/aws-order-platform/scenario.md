# Order and analytics platform on AWS

Shoppers load a web app that is stored in Amazon S3 and served through Amazon CloudFront. AWS WAF protects CloudFront, Amazon Route 53 resolves the site name, and shoppers sign in with Amazon Cognito.

The web app calls Amazon API Gateway in region `eu-west-1`. API Gateway checks the Cognito token and invokes AWS Lambda functions:

1. The orders function writes the order to Amazon DynamoDB and puts a message on an Amazon SQS queue.
2. The fulfilment function reads the queue, reads stock levels from Amazon Aurora and publishes an `OrderShipped` event to Amazon EventBridge.
3. EventBridge starts an AWS Step Functions workflow that sends a notification through Amazon SNS to the shopper and to operators.

The Lambda functions cache product lookups in Amazon ElastiCache for Redis. Amazon OpenSearch Service holds the product search index, which the catalog function queries. A recommendations function calls Amazon Bedrock.

The web app sends clickstream events to Amazon Kinesis Data Streams. A Lambda function enriches them and writes them to an S3 data lake. AWS Glue catalogs the lake and Amazon Athena queries it.

The Lambda functions read their secrets from AWS Secrets Manager, which uses AWS KMS keys. Amazon CloudWatch collects their logs and metrics, and AWS X-Ray traces their requests.

AWS CodePipeline and AWS CodeBuild build and deploy the Lambda functions.
