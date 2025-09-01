import { Message } from './storageService';
import { 
  generateSuggestions, 
  getFirstMessageSuggestions,
  getExerciseStartingSuggestions,
  getExerciseRecommendationSuggestions 
} from '../utils/suggestionGenerator';

export interface ContextConfig {
  maxTurns: number;
  systemPrompt: string;
  toneInstructions: string;
}

class ContextService {
  private config: ContextConfig = {
    maxTurns: 10, // Last 10 message pairs for context
    systemPrompt: `You're Anu, a wise turtle therapist. Keep responses short, warm, and structured.

**Core Style:**

Calm, empathetic, and compassionate

Respectful, non-judgmental, and supportive

Professional yet warm and approachable

**Communication Style:**

Short, clear, and soothing sentences

Gentle encouragement rather than direct instructions

Validates feelings and invites reflection

Uses simple, safe, and reassuring language

**Guidance & Exercises:**

Can suggest exercises, but only from the approved exercise library

Briefly explains why an exercise may be helpful (1–2 sentences max)

Frames exercises as an invitation, not an obligation (e.g., “Would you like to try…?”)

**Overall Goal:**

Create a safe, therapeutic space

Help the user feel understood, supported, and guided at their own pace

- Short sentences, clear
- Use structured responses, with bullet points and numerations if it makes sense.
- Encourage reflection without pressure
- Use emojis meaningfully
- Bold key **emotions** when reflecting back
- Blank lines between paragraphs


**Exercises Available:**
When therapeutically appropriate, suggest:
• **Automatic Thoughts CBT** - negative patterns
• **Body Scan** - stress/tension
• **4-7-8 Breathing** - anxiety
• **Gratitude Practice** - low mood
• **Self-Compassion** - self-criticism
• **Values** - feeling disconnected

Only suggest after building rapport. Ask: "Would you like to try a brief [EXERCISE] exercise?"

**Response Guidelines:**
Your therapeutic response will be automatically structured. Focus on:

- Providing warm, empathetic therapeutic responses
- Generate 2-4 contextual user reply suggestions that are DIRECT RESPONSES to what you say

**Suggestion Examples:**
- If you ask "How are you feeling today?" → user might reply: ["Pretty good", "Not great", "Very anxious", "Mixed feelings"]  
- If you ask "What's been bothering you most?" → user might reply: ["Work stress", "Relationship issues", "Health concerns", "Money worries"]
- If you suggest "Would you like to try a breathing exercise?" → user might reply: ["Yes, let's try", "Not right now", "Show me how", "I'm ready"]
- If you say "That sounds really difficult to handle." → user might reply: ["It really is", "I'm struggling", "I need help", "Thank you"]

Think: "If I just said this to someone, what would they naturally reply?" Generate authentic conversational responses.`,
    
    toneInstructions: `Wise turtle but still like a therapist would act and talk: thoughtful words, Never preachy.`
  };

  // Assemble context for AI API call
  assembleContext(recentMessages: Message[]): any[] {
    const context = [];
    
    // Add system prompt
    context.push({
      role: 'system',
      content: `${this.config.systemPrompt}\n\n${this.config.toneInstructions}`
    });

    // Process recent messages for context
    const processedMessages = this.processMessages(recentMessages);
    
    // Add conversation history (last N turns)
    const contextMessages = processedMessages.slice(-this.config.maxTurns * 2); // 2 messages per turn (user + assistant)
    
    for (const message of contextMessages) {
      if (message.type === 'user') {
        context.push({
          role: 'user',
          content: message.text || message.content || ''
        });
      } else if (message.type === 'system' && !this.isExerciseMessage(message)) {
        context.push({
          role: 'assistant',
          content: message.content || message.text || ''
        });
      }
    }

    return context;
  }

  // Process messages to clean and prepare them
  private processMessages(messages: Message[]): Message[] {
    return messages.filter(msg => {
      // Include user messages
      if (msg.type === 'user') return true;
      
      // Include system messages that aren't exercises
      if (msg.type === 'system' && !this.isExerciseMessage(msg)) return true;
      
      // Exclude exercise messages from context (they're guided experiences)
      return false;
    });
  }

  // Check if a message is from an exercise flow
  private isExerciseMessage(message: Message): boolean {
    return !!(message.exerciseType || message.title?.includes('mindfulness') || message.title?.includes('stress') || message.title?.includes('gratitude'));
  }

  // Get current context configuration
  getConfig(): ContextConfig {
    return { ...this.config };
  }

  // Update context configuration
  updateConfig(updates: Partial<ContextConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  // Generate a context summary for debugging
  getContextSummary(messages: Message[]): string {
    const processed = this.processMessages(messages);
    const contextMessages = processed.slice(-this.config.maxTurns * 2);
    
    return `Context: ${contextMessages.length} messages, ${processed.length} total processed from ${messages.length} raw messages`;
  }

  // Helper to create welcome message
  createWelcomeMessage(): Message {
    return {
      id: Date.now().toString(),
      type: 'welcome', // Special type for start screen
      content: "Tell me, what's on your mind?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      showName: true // Flag to show Anu name
    };
  }

  // Helper to create suggestions based on context - FOCUSED ON AI'S LAST MESSAGE
  generateSuggestions(recentMessages: Message[]): string[] {
    if (recentMessages.length === 0) {
      return getFirstMessageSuggestions();
    }

    // Find the last AI response to generate appropriate user replies
    const lastAiMessage = recentMessages
      .slice()
      .reverse()
      .find(msg => msg.type === 'system');

    if (!lastAiMessage) {
      return getFirstMessageSuggestions();
    }

    // Use the enhanced suggestion generator with the AI's message content
    const aiMessageContent = lastAiMessage.content || lastAiMessage.text || '';
    return generateSuggestions(aiMessageContent);
  }

  // Generate exercise starting suggestions
  getExerciseStartingSuggestions(exerciseType: string): string[] {
    return getExerciseStartingSuggestions(exerciseType);
  }

  // Generate exercise recommendation suggestions  
  getExerciseRecommendationSuggestions(exerciseType: string): string[] {
    return getExerciseRecommendationSuggestions(exerciseType);
  }
}

export const contextService = new ContextService();