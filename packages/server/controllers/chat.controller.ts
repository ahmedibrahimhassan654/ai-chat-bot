import type { Request, Response } from 'express';
import z from 'zod';
import type { ChatService } from '../services/chat.service.ts';

const chatRequestSchema = z.object({
   prompt: z
      .string()
      .min(1, 'Prompt cannot be empty')
      .max(2000, 'Prompt cannot exceed 2000 characters'),
   conversationId: z.string().uuid(),
});

export interface ChatController {
   handleChat(req: Request, res: Response): Promise<void>;
}

export class HttpChatController implements ChatController {
   private service: ChatService;

   constructor(service: ChatService) {
      this.service = service;
   }

   async handleChat(req: Request, res: Response): Promise<void> {
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

         const assistantMessage = await this.service.sendMessage(
            validatedPrompt,
            validatedConversationId
         );

         res.json({ message: assistantMessage });
      } catch (error) {
         console.error(error);
         res.status(500).json({ error: 'Something went wrong' });
      }
   }
}
