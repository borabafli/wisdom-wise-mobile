import { Message } from '../services/storageService';

/**
 * Generates initial suggestions for the welcome message.
 */
export function generateFirstMessageSuggestions(): string[] {
  return [
    'I feel stressed.',
    "I'm having a hard time.",
    'I need to talk to someone.',
    'I feel lost.'
  ];
}

/**
 * A placeholder for a more advanced contextual generator.
 * In the modern design, this logic is handled by the AI itself.
 */
export function generateContextualSuggestions(lastMessages: Message[]): string[] {
  return []; // The AI will provide the suggestions, so we return an empty array here.
}
