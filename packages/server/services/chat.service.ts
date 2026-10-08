import OpenAI from 'openai';
import type {
   ConversationRepository,
   Message,
} from '../repositories/conversation.repository.ts';

export interface ChatService {
   sendMessage(prompt: string, conversationId: string): Promise<string>;
}

export interface ChatServiceOptions {
   baseURL?: string;
   model?: string;
   temperature?: number;
   maxTokens?: number;
   systemPrompt?: string;
}

export class GroqChatService implements ChatService {
   private client: OpenAI;
   private repository: ConversationRepository;
   private model: string;
   private temperature: number;
   private maxTokens: number;
   private systemPrompt: string;

   constructor(
      apiKey: string,
      repository: ConversationRepository,
      options?: ChatServiceOptions
   ) {
      this.client = new OpenAI({
         apiKey,
         baseURL: options?.baseURL ?? 'https://api.groq.com/openai/v1',
      });
      this.repository = repository;
      this.model = options?.model ?? 'openai/gpt-oss-20b';
      this.temperature = options?.temperature ?? 0.2;
      this.maxTokens = options?.maxTokens ?? 2000;
      this.systemPrompt = options?.systemPrompt ?? '';
   }

   async sendMessage(prompt: string, conversationId: string): Promise<string> {
      this.repository.createConversation(conversationId);

      const history = this.repository.getHistory(conversationId);
      const messages: Message[] = [
         ...history,
         { role: 'user', content: prompt },
      ];

      const requestMessages: Message[] = this.systemPrompt
         ? [{ role: 'system', content: this.systemPrompt }, ...messages]
         : messages;

      const response = await this.client.chat.completions.create({
         model: this.model,
         messages:
            requestMessages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
         temperature: this.temperature,
         max_tokens: this.maxTokens,
      });

      const choice = response.choices[0];
      const msg = choice?.message as
         | (OpenAI.Chat.Completions.ChatCompletionMessage & {
              reasoning?: string;
           })
         | undefined;
      const assistantMessage: string = msg?.content || msg?.reasoning || '';

      if (!assistantMessage) {
         throw new Error('No response from AI');
      }

      const updatedMessages: Message[] = [
         ...messages,
         { role: 'assistant', content: assistantMessage },
      ];
      this.repository.saveHistory(conversationId, updatedMessages);

      return assistantMessage;
   }
}
