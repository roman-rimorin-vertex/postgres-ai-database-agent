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

```bash
{
  "prompt": "What are the most popular products?"
}
```

Experiment with the SQL agent by running the code snippet below and asking the following questions (one at a time): 

* What are the most popular products?
* What purchases have been made by user1?
* What colors do the Intelligent Racer come in?
* How many narrow shoes come in pink?
* Find me shoes that are in stock and available in size 15.

### Complext prompts

1. High-Value Customers Report: -
```
Identify all customers who have spent more than $500 in total on orders. Include their name, total amount spent, and email address. Sort the results by total amount spent in descending order.
```

2. Product Popularity Report: -
```
List the top 10 most purchased products in the last year. For each product, show the product ID, total quantity sold, and total sales amount. Order the results by total quantity sold in descending order.
```

3. Customer Loyalty Insight: -
```
Generate a list of customers who have placed more than 5 orders since their first purchase. Include customer ID, name, email, and the total number of orders. Sort by the total number of orders in descending order.
```

4. Order Summary by Product:
```
Summarize total sales and number of orders per product for the last 6 months. Include the product name, total sales amount, and total number of orders. Order the results by total sales amount in descending order.
```

5. Frequent Customers:
```
Identify customers who have placed more than 3 orders. List their ID, name, and email. Sort the list alphabetically by name.
```

6. Annual Sales Trend Report:
```
For each month in the past year, calculate the total sales amount and the total number of orders. Present the data month by month, showing the trend of sales and orders over the year.
```

7. Detailed Order History for Specific Customer: -
```
Given user1@example.com. Display a detailed order history for a customer specified by their email address. For each order, show the order date, list of products purchased (including quantity and price per item), and the total order amount. Sort the orders by date, from newest to oldest.
```
