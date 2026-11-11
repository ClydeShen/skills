# Knowledge and data platform on Azure

Employees sign in with Microsoft Entra ID. Azure Front Door, with a web application firewall policy, sends their traffic to Azure API Management in region `westeurope`.

API Management routes requests to three backends:

1. a chat front end on Azure App Service;
2. microservices on Azure Kubernetes Service (AKS), whose container images come from Azure Container Registry;
3. Azure Functions that handle document uploads.

For each question the chat service retrieves passages from Azure AI Search, calls Azure OpenAI to write the answer, keeps sessions in Azure Cache for Redis and stores the conversation in Azure Cosmos DB. The microservices read customer records from Azure SQL Database and exchange messages through Azure Service Bus.

Uploaded documents go to Azure Blob Storage. An Azure Function splits them and indexes them in Azure AI Search.

Device telemetry arrives in Azure Event Hubs. Azure Stream Analytics aggregates it and writes the results to Azure Data Lake Storage. Azure Machine Learning trains models on the data lake.

The App Service, the AKS services and the Functions read their secrets from Azure Key Vault. They send telemetry to Application Insights, and Azure Monitor and Log Analytics collect logs and metrics.

Azure DevOps pipelines build the images, push them to Azure Container Registry and deploy the services.
