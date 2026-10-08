import { Router, type Request, type Response } from 'express';
import { HttpChatController } from './controllers/chat.controller.ts';
import { GroqChatService } from './services/chat.service.ts';
import { InMemoryConversationRepository } from './repositories/conversation.repository.ts';

export function createApiRouter(): Router {
   const router = Router();

   const conversationRepository = new InMemoryConversationRepository();
   const chatService = new GroqChatService(
      process.env.GROQ_API_KEY!,
      conversationRepository
   );
   const chatController = new HttpChatController(chatService);

   router.get('/message', (req: Request, res: Response) => {
      res.json({ message: 'Hello from the server' });
   });

   router.post('/chat', (req: Request, res: Response) =>
      chatController.handleChat(req, res)
   );

   return router;
}

export function createRootRouter(): Router {
   const router = Router();

   router.get('/', (req: Request, res: Response) => {
      res.send(process.env.GROQ_API_KEY);
   });

   return router;
}
