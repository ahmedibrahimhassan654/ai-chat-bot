import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import { InMemoryConversationRepository } from './repositories/conversation.repository.ts';
import { GroqChatService } from './services/chat.service.ts';
import { HttpChatController } from './controllers/chat.controller.ts';

dotenv.config();

const conversationRepository = new InMemoryConversationRepository();

const chatService = new GroqChatService(
   process.env.GROQ_API_KEY!,
   conversationRepository
);

const chatController = new HttpChatController(chatService);

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
   res.send(process.env.GROQ_API_KEY);
});

app.get('/api/message', (req: Request, res: Response) => {
   res.json({ message: 'Hello from the server' });
});

app.post('/api/chat', (req, res) => chatController.handleChat(req, res));

app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
