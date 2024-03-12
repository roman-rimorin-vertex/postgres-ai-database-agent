  export async function prepareAgentPrompt(inputText: string): Promise<string> {
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
  