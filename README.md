# postgres-ai-database-agent
This agent utilizes openai to create a flow that takes user questions in plain English, then uses an LLM (Large Language Model) to generate a SQL request. It executes the request on your database and then uses the LLM again to respond as a human would, or to convert the response into a JSON object for your downstream APIs.
