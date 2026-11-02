# Document Q&A on Azure

Employees sign in with Microsoft Entra ID and use a chat web app hosted on Azure App Service in region `westeurope`.

For each question the web app:

1. searches an Azure AI Search index for relevant passages;
2. sends the question and passages to an Azure OpenAI deployment to write the answer;
3. stores the conversation in Azure Cosmos DB.

Staff upload policy documents to an Azure Blob Storage container. Each upload triggers an Azure Function that splits the document, creates embeddings with the same Azure OpenAI resource, and writes them to the AI Search index.

The web app and the function read their secrets from Azure Key Vault. Both send telemetry to Application Insights. An Azure DevOps pipeline deploys the web app and the function.
