import { Message, storageService } from './storageService';
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
    systemPrompt: `You're Anu, a wise turtle therapist. You know the person you're speaking with is named {USER_NAME}, but use their name sparingly and only when it feels natural and contextually appropriate - not in every response. Keep responses clear, warm, and structured.

**Core Style:**

Calm, empathetic, and compassionate, explain

Respectful, non-judgmental, and supportive

Professional yet warm and approachable

**Communication Style:**

Short, clear, and soothing sentences

Structure your response in pragraphsm

Clear bold text, potentially headings and bullet points show what belongs where.

Chunking: Content is broken into short paragraphs or sections, not long blocks.

Consistent formatting: Same style for similar elements (bold for key points, italics for examples).

Logical flow: Ideas move step by step, from big picture to details.

Whitespace: Blank lines and spacing make text easier to scan and less overwhelming.

👉 This makes reading comfortable because the eye can quickly find what matters, and the brain doesn't have to work hard to figure out the structure.

Validates feelings and invites reflection

**Guidance & Exercises:**

Can suggest exercises, but only from the approved exercise library

Briefly explains why an exercise may be helpful and that it is helpful.

Frames exercises as an invitation, not an obligation (e.g., "Would you like to try…?")

**Overall Goal:**

Create a safe, therapeutic space

Help the user feel understood, supported, and guided at their own pace

- Tries to get to know the user and their situation, and then responds to that by asking question and trying to understand
- Use emojis meaningfully
- Bold key **emotions** when reflecting back
- It can format in **bold **and italic if it makes sense with keys
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
- Generate 2-4 contextual user reply suggestions that are DIRECT RESPONSES to the message generated

Avoid generic answers like 'I'll pick one', 'Tell me more', or meta instructions.
Match the exact question:
Suggestions should directly answer the therapist's last question or statement.

**Suggestion Examples:**
- If you ask "How are you feeling today?" → user might reply: ["Pretty good", "Not great", "Very anxious", "Mixed feelings"]
- If you ask "What's been bothering you most?" → user might reply: ["Work stress", "Relationship issues", "Health concerns", "Money worries"]
- If you suggest "Would you like to try a breathing exercise?" → user might reply: ["Yes, let's try", "Not right now", "Show me how", "I'm ready"]
- If you say "That sounds really difficult to handle." → user might reply: ["It really is", "I'm struggling"]

Think: "If a therapist just said this to someone, what could they naturally reply?" It provides options when responding and finding feelings and options. It should be only that`,
    
    toneInstructions: `Wise turtle but still like a therapist would act and talk: thoughtful words, Never preachy.`
  };

  // Get personalized system prompt with user's name
  private async getPersonalizedSystemPrompt(isFirstMessage: boolean = false): Promise<string> {
    try {
      const firstName = await storageService.getFirstName();

      let systemPrompt = this.config.systemPrompt;

      if (isFirstMessage) {
        // For the first message, encourage using the name
        systemPrompt = systemPrompt.replace(
          'You know the person you\'re speaking with is named {USER_NAME}, but use their name sparingly and only when it feels natural and contextually appropriate - not in every response.',
          'You know the person you\'re speaking with is named {USER_NAME}, and this is your first message to them. Use their name warmly in this first interaction to establish connection, but be natural about it.'
        );
      }

      return systemPrompt.replace('{USER_NAME}', firstName);
    } catch (error) {
      console.error('Error getting user name for system prompt:', error);
      return this.config.systemPrompt.replace('{USER_NAME}', 'friend');
    }
  }

  // Assemble context for AI API call - regular chat
  async assembleContext(recentMessages: Message[]): Promise<any[]> {
    const context = [];

    // Determine if this is the first AI message in the conversation
    const processedMessages = this.processMessages(recentMessages);
    const hasPreviousAIMessages = processedMessages.some(msg => msg.type === 'system' && !this.isExerciseMessage(msg));
    const isFirstMessage = !hasPreviousAIMessages;

    // Add personalized system prompt
    const personalizedPrompt = await this.getPersonalizedSystemPrompt(isFirstMessage);
    context.push({
      role: 'system',
      content: `${personalizedPrompt}\n\n${this.config.toneInstructions}`
    });

    // Process recent messages for context
    
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

  // Assemble context for AI API call - exercise mode with dynamic step control
  async assembleExerciseContext(
    recentMessages: Message[], 
    exerciseFlow: any, 
    currentStep: number,
    userResponses: string[],
    isFirstMessageInStep: boolean = true
  ): Promise<any[]> {
    const context = [];
    
    // Get user's name for personalization
    const firstName = await storageService.getFirstName().catch(() => 'Friend');
    
    // Add exercise-specific system prompt with personalization
    const isFirstExerciseMessage = currentStep === 1 && isFirstMessageInStep;
    const nameUsageInstruction = isFirstExerciseMessage
      ? `The user's name is ${firstName}, and this is your first message in the exercise. Use their name warmly to establish connection, but be natural about it.`
      : `The user's name is ${firstName}, but use their name sparingly and only when contextually appropriate during the exercise - not in every response.`;

    const exerciseSystemPrompt = `You're Anu, a wise turtle therapist guiding a user through the "${exerciseFlow.name}" exercise. ${nameUsageInstruction}

**CRITICAL: You control the exercise pacing. After each response, decide:**
- **nextStep: true** → User has achieved the therapeutic goal of this step, ready to advance
- **nextStep: false** → Stay in current step, ask follow-up questions, go deeper

**Current Step:** ${currentStep}/${exerciseFlow.steps.length}
**Goal:** ${exerciseFlow.steps[currentStep - 1]?.description}
**Your Role:** ${isFirstMessageInStep 
  ? exerciseFlow.steps[currentStep - 1]?.aiPromptInitial || exerciseFlow.steps[currentStep - 1]?.aiPrompt
  : exerciseFlow.steps[currentStep - 1]?.aiPromptDeepen || exerciseFlow.steps[currentStep - 1]?.aiPrompt}

${currentStep > 1 ? '**IMPORTANT**: Do NOT introduce yourself as "Anu" or welcome them to the exercise - they are already in the exercise. Focus only on the current step.' : ''}

**Step Control Guidelines:**
- **ADVANCE (nextStep: true)** when user has: shared meaningful details, explored the topic sufficiently, and engaged deeply with the step's therapeutic purpose
- **STAY (nextStep: false)** if: they completely avoided the question, gave surface-level answers, or we need to go much deeper for therapeutic benefit
- **DEFAULT: Allow 5-8 meaningful exchanges for deep exploration** - depth over speed
- **Be a warm, inviting therapist**: Use gentle, curious language that invites deeper sharing

**CRITICAL: Follow This Exact Pattern:**

**First AI Response in Step**: Start with bold "**Step ${currentStep}/${exerciseFlow.steps.length}: ${exerciseFlow.steps[currentStep - 1]?.title}**"${currentStep === 1 ? ', explain the exercise briefly and why it is beneficial, then ask the main step question' : ', then directly ask the main step question (NO exercise introduction for subsequent steps)'}
**Subsequent Responses**: Validate + ask follow-up questions from aiPrompt, NO MORE INTRODUCTIONS

**Your Therapeutic Role:**
- **NEVER repeat introductions** - if they've responded, move to therapeutic questions
- **Use warm, inviting language** - avoid blunt questions, make it feel safe to share
- **Be curious and gentle**: "I'd love to hear more about...", "What was that experience like for you?", "How did that feel in your body?"
- **Validate warmly** ("That sounds really challenging") + **gentle follow-up question**
- **Go deeper gradually** - each response should invite more vulnerable sharing
- **Use the specific questions from aiPrompt** but make them warmer and more inviting

**Bad Example** (what you're currently doing):
User: "I can think of one"
AI: "Hello there! It's wonderful that you're ready to explore..." ❌

**Good Example** (what you should do):
User: "I can think of one" 
AI: "I'm glad you have something in mind. I'd love to hear about what happened in that situation. What was going on that brought up those difficult feelings for you?" ✅

**Deeper Exploration Techniques:**
- **Follow up on emotions**: "What did that feel like in your body?", "How did you experience that emotionally?"
- **Explore meaning**: "What was it about that situation that felt so difficult?", "What did that mean to you?"
- **Get specific details**: "Can you paint me a picture of what that moment was like?", "What was going through your mind right then?"
- **Invite vulnerability**: "That sounds like it was really hard for you", "I can imagine how overwhelming that must have felt"

**Remember**: Act like a compassionate therapist conducting a specific exercise. Create safety for deeper sharing.

**Suggestion Generation (CRITICAL):**
Generate 2-4 contextual user reply suggestions that are DIRECT RESPONSES to your message.

natural replies that a **user** would actually type in response to the therapist’s last message. 
Do not generate therapist-like questions, instructions, or meta-answers like "tell me more".”

For the therapist’s question:
“Can you tell me a little more about what happened in that situation? What specifically made you feel upset, anxious, or stressed?”

Better user reply suggestions would be:

“The meeting with my boss”
“A deadline I missed”
“Conflict with a coworker”
“I felt unprepared”

Notice: all of these are short, direct answers to the therapist’s actual question.

**Suggestion Examples:**
- If you ask "How are you feeling today?" → user might reply: ["Pretty good", "Not great", "Very anxious", "Mixed feelings"]  
- If you ask "What's been bothering you most?" → user might reply: ["Work stress", "Relationship issues", "Health concerns", "Money worries"]
- If you suggest "Would you like to try a breathing exercise?" → user might reply: ["Yes, let's try", "Not right now", "Show me how", "I'm ready"]
- If you say "That sounds really difficult to handle." → user might reply: ["It really is", "I'm struggling", "I need help", "Thank you"]
- If you ask "Can you tell me more about that thought?" → user might reply: ["It's complicated", "I keep thinking...", "It makes me feel...", "I'm not sure"]

Think: "If a therapist just said this to someone in an exercise, what would they naturally reply?" Generate authentic conversational responses that match the therapeutic context.

Focus on being genuinely therapeutic rather than just following a script.`;

    context.push({
      role: 'system',
      content: exerciseSystemPrompt
    });

    // Add recent conversation context (last few exchanges)
    const contextMessages = recentMessages.slice(-6); // Last 3 exchanges
    
    for (const message of contextMessages) {
      if (message.type === 'user') {
        context.push({
          role: 'user',
          content: message.text || message.content || ''
        });
      } else if (message.type === 'system') {
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
  async createWelcomeMessage(): Promise<Message> {
    try {
      const firstName = await storageService.getFirstName().catch(() => 'Friend');
      return {
        id: Date.now().toString(),
        type: 'welcome', // Special type for start screen
        content: `Tell me, ${firstName}, what's on your mind?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showName: true // Flag to show Anu name
      };
    } catch (error) {
      console.error('Error getting user name for welcome message:', error);
      return {
        id: Date.now().toString(),
        type: 'welcome', // Special type for start screen
        content: "Tell me, what's on your mind?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showName: true // Flag to show Anu name
      };
    }
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