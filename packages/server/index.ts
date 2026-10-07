import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const client = new OpenAI({
   apiKey: process.env.GROQ_API_KEY, // Your free key from Groq
   baseURL: 'https://api.groq.com/openai/v1', // Groq's OpenAI-compatible endpoint
});

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
   res.send(process.env.groq_API_KEY);
});

app.get('/api/message', (req: Request, res: Response) => {
   res.json({ message: 'Hello from the server' });
});

app.post('/api/chat', async (req: Request, res: Response) => {
   try {
      const { prompt } = req.body;

      const response = await client.responses.create({
         model: 'openai/gpt-oss-20b', // Free fast model instead of "gpt-4o"
         input: prompt,
         temperature: 0.2,
         max_output_tokens: 200,
      });

      res.json({ message: response.output_text });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
   }
});
app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
