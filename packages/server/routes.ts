import 'dotenv/config';
import { Router, type Request, type Response } from 'express';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from './generated/prisma/client.ts';
import { HttpChatController } from './controllers/chat.controller.ts';
import { GroqChatService } from './services/chat.service.ts';
import { InMemoryConversationRepository } from './repositories/conversation.repository.ts';
import { buildSystemPrompt } from './prompts/index.ts';

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

export function createApiRouter(): Router {
   const router = Router();

   const conversationRepository = new InMemoryConversationRepository();
   const chatService = new GroqChatService(
      process.env.GROQ_API_KEY!,
      conversationRepository,
      { systemPrompt: buildSystemPrompt(), maxTokens: 4000 }
   );
   const chatController = new HttpChatController(chatService);

   router.get('/message', (req: Request, res: Response) => {
      res.json({ message: 'Hello from the server' });
   });

   router.get(
      '/products/:id/reviews',
      async (req: Request, res: Response): Promise<void> => {
         const productId = Number(req.params.id);

         if (isNaN(productId)) {
            res.status(400).json({ error: 'Invalid product ID' });
            return;
         }

         const reviews = await prisma.review.findMany({
            where: { productId },
            orderBy: { createdAt: 'desc' },
         });

         res.json(reviews);
      }
   );

   router.post('/chat', (req: Request, res: Response) =>
      chatController.handleChat(req, res)
   );

   return router;
}

export function createRootRouter(): Router {
   const router = Router();

   router.get('/', (req: Request, res: Response) => {
      res.json({
         status: 'ok',
         service: 'WonderWorld AI Guest Assistant',
         configured: Boolean(process.env.GROQ_API_KEY),
      });
   });

   return router;
}
