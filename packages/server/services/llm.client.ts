import 'dotenv/config';
import OpenAI from 'openai';

export const LLM_MODEL = 'openai/gpt-oss-20b';

export const llmClient = new OpenAI({
   apiKey: process.env.GROQ_API_KEY!,
   baseURL: 'https://api.groq.com/openai/v1',
});
