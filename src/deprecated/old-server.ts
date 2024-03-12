import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import OpenAI from 'openai'; // Adjusted import
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize OpenAI client with your API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateSQL = async (systemPrompt: string, userPrompt: string): Promise<string | null> => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0,
      max_tokens: 1000,
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating SQL:', error);
    throw error;
  }
};

app.post('/query', async (req: Request, res: Response) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).send({ error: 'Prompt is required and should be a string' });
  }

  try {
    const queryData = await getSQLFromNLP(prompt);
    console.log('queryData', queryData);
    if (queryData.query === '') {
      return res.status(500).send({ error: 'Failed to generate SQL' });
    }
    console.log(`Generated SQL: ${queryData.query}`);
    const result = await pool.query(queryData.query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).send({ error: error instanceof Error ? error.message : 'An error occurred' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

interface QueryData {
  query: string;
  query_response: any[];
  error: string;
}

async function getSQLFromNLP(userPrompt: string): Promise<QueryData> {

  const systemPrompt = await prepareAgentPrompt(userPrompt)

  let queryData: QueryData = { query: '', query_response: [], error: '' };
  let results:string | null = '';

  try {
      results = await generateSQL(systemPrompt, userPrompt);
      if (results) {
          console.log('results', results);
          const parsedResults = JSON.parse(results);
          queryData = { ...queryData, ...parsedResults };
          // if (isProhibitedQuery(queryData.sql)) {
          //     queryData.sql = '';
          //     queryData.error = 'Prohibited query.';
          // }
      }
  } catch (error) {
      console.log(error);
      // if (isProhibitedQuery(results)) {
      //     queryData.sql = '';
      //     queryData.error = 'Prohibited query.';
      // } else {
      //     queryData.error = results;
      // }
  }

  return queryData;
}

async function prepareAgentPrompt(inputText: string): Promise<string> {
  const dbSchema = `
  - products (product_id, name, price, color, width)
  - users (user_id, username, email)
  - purchases (purchase_id, user_id, product_id, purchase_date, quantity, total_price)
  - product_inventory (inventory_id, product_id, size, color, width, quantity)
  `;

  const agentPrompt = `
    Query the database using PostgreSQL syntax.

    The SQL will query a PostgreSQL database.
      
    PostgreSQL tables, with their columns:    

    ${dbSchema}

    Use the shoe_color enum to query the color. Do not query this column with any values not found in the shoe_color enum.
    Use the shoe_width enum to query the width. Do not query this column with any values not found in the shoe_width enum.

    The color and width columns are array types. The name column is of type VARCHAR.
    An example query using an array columns would be:
    SELECT * FROM products, unnest(color) as col WHERE col::text % SOME_COLOR;
    or
    SELECT * FROM products, unnest(width) as wid WHERE wid::text % SOME_WIDTH;

    An example query using the name column would be:
    select * from products where name ILIKE '%${inputText}%';

    It is not necessary to search on all columns, only those necessary for a query. 
    
    Generate a PostgreSQL query using the input: ${inputText}. 
    
    Answer needs to be in the format of a JSON object. 
    This object needs to have the key "query" with the SQL query and "query_response" as a JSON array of the query response.
  `;

  return agentPrompt;
}
