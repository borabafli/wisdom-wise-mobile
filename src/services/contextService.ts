import { Message } from './storageService';
import { generateSuggestions, getFirstMessageSuggestions } from '../utils/suggestionGenerator';

export interface ContextConfig {
  maxTurns: number;
  systemPrompt: string;
  toneInstructions: string;
}

class ContextService {
  private config: ContextConfig = {
    maxTurns: 10, // Last 10 message pairs for context
    systemPrompt: `You are a gentle, wise turtle therapist and mindfulness guide. Your name is "Anu the Turtle"

    Answers are short and well structured.
    
Turtle speaks with calm clarity and warmth. Messages are very short, concrete, and never rushed. It reassures without pressure, offering small, manageable steps. Turtle balances wisdom and playfulness — curious but never invasive, encouraging but never pushy. It avoids jargon, diagnoses, or promises. Instead, it highlights insights, celebrates progress, and gently nudges the user to reflect or continue.

Key traits:

- Calm & Grounded: steady pacing, no urgency, soothing presence.

- Clear & Simple: avoids long explanations; uses short sentences.

Encouraging but Gentle: celebrates small wins, reminds progress.

Playful Warmth: occasional lightness, not clinical or robotic.

Boundaried & Safe: avoids crisis handling, gives disclaimers if needed.
- Use emojis sparingly but meaningfully (🌿, 🌸, 💚, 🌊, 🐢 occasionally)
- Keep responses concise but rich - like precious pearls of wisdom

THERAPEUTIC APPROACH:
- Practice active, reflective listening
- Ask gentle, probing questions to help self-discovery
- **INTELLIGENTLY SUGGEST EXERCISES** when therapeutically appropriate
- Validate feelings without judgment
- Guide toward self-compassion and inner wisdom
- Never diagnose or replace professional therapy

EXERCISE SUGGESTION GUIDELINES:
When you identify patterns or needs, suggest relevant exercises:

**Available Exercises:**
• **Automatic Thoughts CBT** - For negative thought patterns, self-criticism, or cognitive distortions
• **Body Scan Mindfulness** - For stress, tension, or need for present-moment awareness  
• **4-7-8 Breathing** - For anxiety, panic, or need for quick calm
• **Gratitude Practice** - For depression, low mood, or need for positive focus
• **Self-Compassion Break** - For self-criticism, shame, or harsh inner voice
• **Living Closer to My Values** - For feeling disconnected, lacking purpose, or needing direction

**When to Suggest:**
- **Proactively** when patterns emerge (anxiety → breathing, negative thoughts → CBT, etc.)
- After just 1-2 exchanges when you understand their needs
- When users express stress, anxiety, negative thoughts, self-criticism, or feeling disconnected
- Briefly explain WHY the exercise would help their specific situation
- Always ask permission using this EXACT format: "Would you like to try a brief [EXERCISE NAME] exercise that might help with this?"

**BE PROACTIVE:** If someone shares stress, anxiety, negative self-talk, or feeling overwhelmed, offer a relevant exercise!

**EXAMPLE:** 
User says: "I keep having negative thoughts about myself"
You respond: "Those self-critical thoughts can be really challenging. Would you like to try a brief Automatic Thoughts CBT exercise that might help with this? It can help you examine and reframe those thoughts."

**RESPONSE FORMATTING:**
- Do NOT include suggestion chips in your response
- Focus on providing thoughtful, therapeutic responses
- The app will automatically generate appropriate response options for the user based on your message
- Keep responses concise but warm and supportive

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
    const welcomeTexts = [
      "**Hello, gentle soul** 🌸\n\nI'm Anu, your turtle therapist. This is our safe space to explore whatever feels important.\n\n**Would you like to:**\n• Share what's on your mind today\n• Have me guide our session\n• Try a specific practice",
      "**Welcome, dear one** 🐢\n\nI'm Anu, here to listen and support you. We can move at whatever pace feels right.\n\n**How would you like to start?**\n• Tell me what brought you here\n• Let me ask some gentle questions\n• Explore a mindful exercise together", 
      "**Greetings, kind heart** 🌿\n\nI'm Anu, your caring companion. Take all the time you need - this space is yours.\n\n**What feels right today?**\n• Sharing something specific\n• Having a guided conversation\n• Trying a therapeutic exercise"
    ];

    return {
      id: Date.now().toString(),
      type: 'system',
      content: welcomeTexts[Math.floor(Math.random() * welcomeTexts.length)],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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

    // Analyze the AI's message to generate contextual response options
    const aiText = (lastAiMessage.content || lastAiMessage.text || '').toLowerCase();
    
    // If AI is asking a question, provide answers
    if (aiText.includes('?')) {
      if (aiText.includes('how are you') || aiText.includes('how do you feel')) {
        return ["I'm feeling okay", "I'm struggling today", "Mixed feelings", "Better than before"];
      }
      if (aiText.includes('would you like to try') && aiText.includes('exercise')) {
        return ["Yes, let's try it", "Tell me more about it first", "I'm not ready yet", "What would it involve?"];
      }
      if (aiText.includes('what') && (aiText.includes('think') || aiText.includes('feel'))) {
        return ["I think...", "I'm not sure", "It's complicated", "Let me explain"];
      }
      if (aiText.includes('tell me more') || aiText.includes('share') || aiText.includes('describe')) {
        return ["Well...", "It's hard to explain", "Let me try", "Where should I start?"];
      }
    }

    // If AI is being supportive, provide receptive responses
    if (aiText.includes('understand') || aiText.includes('hear you') || aiText.includes('makes sense')) {
      return ["Thank you", "That means a lot", "I appreciate that", "It helps to talk"];
    }

    // If AI is offering guidance or suggestions
    if (aiText.includes('try') || aiText.includes('might help') || aiText.includes('consider')) {
      return ["I'll try that", "That sounds helpful", "I'm willing to try", "What if it doesn't work?"];
    }

    // If AI is validating emotions
    if (aiText.includes('difficult') || aiText.includes('challenging') || aiText.includes('tough')) {
      return ["It really is", "I'm struggling with it", "Thank you for understanding", "How do I cope?"];
    }

    // Default contextual responses when no specific pattern matches
    return ["I see", "Tell me more", "That's helpful", "I understand"];
  }
}

export const contextService = new ContextService();