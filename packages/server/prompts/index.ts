import chatbotTemplate from './chatbot.txt' with { type: 'text' };
import parkInfo from './WonderWorld.md' with { type: 'text' };

export const PARK_INFO_PLACEHOLDER = '{{parkInfo}}';

export function buildSystemPrompt(): string {
   if (!chatbotTemplate.includes(PARK_INFO_PLACEHOLDER)) {
      throw new Error(
         `Prompt template is missing the "${PARK_INFO_PLACEHOLDER}" placeholder`
      );
   }

   return chatbotTemplate.replaceAll(PARK_INFO_PLACEHOLDER, parkInfo.trim());
}

export const systemPrompt = buildSystemPrompt();
