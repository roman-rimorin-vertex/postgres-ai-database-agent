# Postgres AI Database Agent

This project is a Node.js application that leverages the OpenAI API to generate SQL queries based on natural language input. It interfaces with a PostgreSQL database, allowing users to interact with the database using plain English. This can be particularly useful for generating reports, querying data, or managing the database without in-depth knowledge of SQL syntax.

## Features

- Natural language processing to generate SQL queries.
- Direct interaction with PostgreSQL databases.
- Express server setup for handling requests.
- Utilizes OpenAI's powerful GPT models for query generation.

## Prerequisites

- Python and Pip
- Docker/Rancher Dektop
- Node.js (v14 or newer recommended)
- npm or yarn
- PostgreSQL database
- An OpenAI API key

## Installation

1. Clone the repository:

```bash
git clone https://github.com/roman-rimorin-vertex/postgres-ai-database-agent.git
cd postgres-ai-database-agent
```

2. Install dependencies:
```bash
npm install
```
3. Setup database
Open `database/sql_agent_with_postgres_langchain_open_ai.ipynb` then run the `notebook` step by step, this should setup the postgres in your `docker` with seed data. 

4. Setup environment variables:
Create a `.env` file in the root directory of the project and add the following variables:
```bash
DATABASE_URL=postgresql://username:password@localhost:5432/yourdatabase
OPENAI_API_KEY=your_openai_api_key_here
```
Replace `username`, `password`, `localhost`, `5432`, and `yourdatabase` with your PostgreSQL connection details. Replace `your_openai_api_key_here` with your actual OpenAI API key.

## Running the Server

To start the Express server, run:
```bash
npm start
```
The server will start, and you can now make POST requests to `http://localhost:3000/query` with a JSON body containing a prompt key for natural language inputs.

### Example Request

Experiment with the SQL agent by running the code snippet below and asking the following questions (one at a time): 

* What are the most popular products?
* What purchases have been made by user1?
* What colors do the Intelligent Racer come in?
* How many narrow shoes come in pink?
* Find me shoes that are in stock and available in size 15.

```bash
{
  "prompt": "What are the most popular products?"
}
```