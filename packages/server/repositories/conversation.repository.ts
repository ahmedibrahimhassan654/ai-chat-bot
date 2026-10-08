export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
   role: MessageRole;
   content: string;
}

export interface ConversationRepository {
   getHistory(conversationId: string): Message[];
   saveHistory(conversationId: string, messages: Message[]): void;
   createConversation(conversationId: string): void;
   deleteConversation(conversationId: string): boolean;
   getAllConversationIds(): string[];
}

const UUID_REGEX =
   /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function validateConversationId(conversationId: string): void {
   if (!UUID_REGEX.test(conversationId)) {
      throw new Error('Invalid conversationId: must be a valid UUID');
   }
}

export class InMemoryConversationRepository implements ConversationRepository {
   private conversations = new Map<string, Message[]>();

   getHistory(conversationId: string): Message[] {
      validateConversationId(conversationId);
      return this.conversations.get(conversationId) ?? [];
   }

   saveHistory(conversationId: string, messages: Message[]): void {
      validateConversationId(conversationId);
      this.conversations.set(conversationId, [...messages]);
   }

   createConversation(conversationId: string): void {
      validateConversationId(conversationId);
      if (!this.conversations.has(conversationId)) {
         this.conversations.set(conversationId, []);
      }
   }

   deleteConversation(conversationId: string): boolean {
      validateConversationId(conversationId);
      return this.conversations.delete(conversationId);
   }

   getAllConversationIds(): string[] {
      return Array.from(this.conversations.keys());
   }
}

export const conversationRepository = new InMemoryConversationRepository();
