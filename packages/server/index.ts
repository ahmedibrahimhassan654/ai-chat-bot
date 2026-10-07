import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import z from 'zod';

dotenv.config();

const client = new OpenAI({
   apiKey: process.env.GROQ_API_KEY,
   baseURL: 'https://api.groq.com/openai/v1',
});

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
   res.send(process.env.GROQ_API_KEY);
});

app.get('/api/message', (req: Request, res: Response) => {
   res.json({ message: 'Hello from the server' });
});

const conversations = new Map<
   string,
   Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
>();
const chatRequestSchema = z.object({
   prompt: z
      .string()
      .min(1, 'Prompt cannot be empty')
      .max(2000, 'Prompt cannot exceed 2000 characters'),
   conversationId: z.string().uuid(),
});
app.post('/api/chat', async (req: Request, res: Response) => {
   try {
      const { prompt, conversationId } = req.body;
      const result = chatRequestSchema.safeParse({ prompt, conversationId });

      if (!result.success) {
         res.status(400).json(result.error.format());
         return;
      }

      const {
         prompt: validatedPrompt,
         conversationId: validatedConversationId,
      } = result.data;

      if (!conversations.has(validatedConversationId)) {
         conversations.set(validatedConversationId, []);
      }

      const history = conversations.get(validatedConversationId)!;
      history.push({ role: 'user', content: validatedPrompt });

      const response = await client.chat.completions.create({
         model: 'openai/gpt-oss-20b',
         messages: history,
         temperature: 0.2,
         max_tokens: 2000,
      });

      console.log('Response:', JSON.stringify(response, null, 2));

      const choice = response.choices[0];
      const msg = choice?.message as any;
      const assistantMessage = msg?.content || msg?.reasoning || '';
      if (!assistantMessage) {
         throw new Error('No response from AI');
      }
      history.push({ role: 'assistant', content: assistantMessage });

      res.json({ message: assistantMessage });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
   }
});

app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
