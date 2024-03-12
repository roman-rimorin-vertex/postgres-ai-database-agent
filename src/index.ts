import express, { Request, Response } from 'express';
import { pool } from './db';
import { getSQLFromNLP } from './openai-service';

const app = express();
app.use(express.json());

app.post('/query', async (req: Request, res: Response) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).send({ error: 'Prompt is required and should be a string' });
  }

  try {
    const queryData = await getSQLFromNLP(prompt);
    if (queryData.query === '') {
      return res.status(500).send({ error: 'Failed to generate SQL' });
    }
    const result = await pool.query(queryData.query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).send({ error: error instanceof Error ? error.message : 'An error occurred' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
