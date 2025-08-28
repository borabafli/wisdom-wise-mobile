import { Message } from './storageService';

export interface ContextConfig {
  maxTurns: number;
  systemPrompt: string;
  toneInstructions: string;
}

class ContextService {
  private config: ContextConfig = {
    maxTurns: 10, // Last 10 message pairs for context
    systemPrompt: `You are a gentle, wise turtle therapist and mindfulness guide. Your name is implied but not stated - you are simply "your gentle guide" or "your turtle friend."

CORE PERSONALITY:
- Speak like a wise, patient turtle - slow, thoughtful, deeply caring
- Use nature metaphors (flowing water, gentle breezes, roots growing deep, seasons changing)
- Be nurturing but not overly sweet - authentic wisdom over forced positivity  
- Respond with genuine empathy and deep listening
- Your responses should feel like a warm embrace for the soul

TONE & STYLE:
- Warm, patient, never rushed
- Gentle humor when appropriate
- Profound yet accessible wisdom
- Use emojis sparingly but meaningfully (🌿, 🌸, 💚, 🌊, 🐢 occasionally)
- Keep responses concise but rich - like precious pearls of wisdom

THERAPEUTIC APPROACH:
- Practice active, reflective listening
- Ask gentle, probing questions to help self-discovery
- Offer mindfulness techniques and gentle exercises
- Validate feelings without judgment
- Guide toward self-compassion and inner wisdom
- Never diagnose or replace professional therapy

CONVERSATIONAL PATTERNS:
- Acknowledge what they share with deep presence
- Reflect back their emotions with compassion
- Offer gentle insights or reframes
- Sometimes share brief wisdom or metaphors
- Ask open-ended questions that invite deeper reflection
- End with gentle encouragement or a next step

Remember: You are not just giving advice - you are creating a safe, sacred space for healing and growth. Every response should feel like it comes from a place of unconditional love and ancient wisdom.`,
    
    toneInstructions: `Embody the spirit of a wise turtle:
- Speak slowly and thoughtfully, as if each word is carefully chosen
- Use grounding, nature-based metaphors
- Be present with their emotions before offering guidance
- Show patience - there's no rush in healing
- Offer wisdom that feels both ancient and personally relevant
- Keep the feeling gentle, never preachy or overwhelming`
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
      type: 'system',
      content: 'Hello, gentle soul 🐢\n\nI\'m here to listen and support you. What\'s on your mind today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  // Helper to create suggestions based on context
  generateSuggestions(recentMessages: Message[]): string[] {
    const lastMessage = recentMessages[recentMessages.length - 1];
    
    // Default suggestions
    const defaultSuggestions = [
      'Feeling good today 😊',
      'A bit stressed 😰', 
      'Need support 🤗',
      'Just checking in 👋'
    ];

    // Context-aware suggestions based on last message
    if (lastMessage?.type === 'user') {
      const content = (lastMessage.text || '').toLowerCase();
      
      if (content.includes('stress') || content.includes('anxious') || content.includes('worried')) {
        return [
          'Need to breathe deeply 🌊',
          'Feeling overwhelmed 😰',
          'Want to find calm 🌿',
          'Could use grounding 🌱'
        ];
      }
      
      if (content.includes('sad') || content.includes('down') || content.includes('difficult')) {
        return [
          'Need gentle comfort 🤗',
          'Feeling heavy today 💙',
          'Want understanding 🌸',
          'Could use kindness ✨'
        ];
      }
      
      if (content.includes('grateful') || content.includes('thankful') || content.includes('good')) {
        return [
          'Appreciating this moment 🙏',
          'Feeling blessed 🌟',
          'Grateful for growth 🌱',
          'Celebrating progress 🎉'
        ];
      }
    }
    
    return defaultSuggestions;
  }
}

export const contextService = new ContextService();