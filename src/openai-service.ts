import OpenAI from 'openai';
import { prepareAgentPrompt } from './utils';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface QueryData {
  query: string;
  query_response: any[];
  error: string;
}

export const generateSQL = async (systemPrompt: string, userPrompt: string): Promise<string | null> => {
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

export async function getSQLFromNLP(userPrompt: string): Promise<QueryData> {
  const systemPrompt = await prepareAgentPrompt(userPrompt);

  let queryData: QueryData = { query: '', query_response: [], error: '' };
  let results: string | null = '';

  try {
    results = await generateSQL(systemPrompt, userPrompt);
    if (results) {
      const parsedResults = JSON.parse(results);
      queryData = { ...queryData, ...parsedResults };
    }
  } catch (error) {
    queryData.error = 'Error processing the prompt.';
  }

  return queryData;
}
