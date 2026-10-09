import { apiFetch } from './client';

export interface ChatResponse {
   message: string;
}

export function sendChat(prompt: string, conversationId: string) {
   return apiFetch<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify({ prompt, conversationId }),
   });
}
