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
    
    console.log(`🎭 ContextService: isFirstMessageInStep=${isFirstMessageInStep}, currentStep=${currentStep}`);
    
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
**Step Goal:** ${exerciseFlow.steps[currentStep - 1]?.description}

**Context-Aware Responding:**
You are having a natural therapeutic conversation. Respond directly to what the user just said, building on their words and energy. The exercise guidelines below are background context to inform your therapeutic approach, NOT rigid scripts to follow.

**Exercise Context (background guidance only):**
Exercise: ${exerciseFlow.name}
Current Step Goal: ${exerciseFlow.steps[currentStep - 1]?.description}

Therapeutic Approach: ${isFirstMessageInStep 
  ? exerciseFlow.steps[currentStep - 1]?.aiPromptInitial || exerciseFlow.steps[currentStep - 1]?.aiPrompt
  : exerciseFlow.steps[currentStep - 1]?.aiPromptDeepen || exerciseFlow.steps[currentStep - 1]?.aiPrompt}

**Exercise Background for Context:**
${exerciseFlow.name === 'Recognizing Automatic Thoughts' ? '• **Overall Purpose**: Help identify and reframe negative thought patterns using CBT techniques\n• **Therapeutic Framework**: Cognitive Behavioral Therapy (CBT)\n• **Key Benefit**: Understanding how thoughts create emotional distress and learning to challenge them' : ''}${exerciseFlow.name === '4-7-8 Breathing' ? '• **Overall Purpose**: Activate the parasympathetic nervous system to naturally calm anxiety and stress\n• **Therapeutic Framework**: Breathwork and nervous system regulation\n• **Key Benefit**: Provides immediate anxiety relief and builds long-term stress resilience' : ''}${exerciseFlow.name === 'Body Scan' ? '• **Overall Purpose**: Develop body awareness to release tension and increase mindfulness\n• **Therapeutic Framework**: Mindfulness-based stress reduction\n• **Key Benefit**: Connects mind and body, reduces physical tension, increases present-moment awareness' : ''}${exerciseFlow.name === 'Gratitude Practice' ? '• **Overall Purpose**: Shift focus from negative patterns to positive appreciation\n• **Therapeutic Framework**: Positive psychology and mindfulness\n• **Key Benefit**: Naturally improves mood, builds resilience, and rewires brain for positivity' : ''}${exerciseFlow.name === 'Self-Compassion Break' ? '• **Overall Purpose**: Replace self-criticism with kindness using the 3 components of self-compassion\n• **Therapeutic Framework**: Self-compassion therapy (Dr. Kristin Neff)\n• **Key Benefit**: Reduces shame and self-judgment, increases emotional resilience and self-acceptance' : ''}${exerciseFlow.name === 'Morning Mindfulness' ? '• **Overall Purpose**: Start the day with present-moment awareness and intentional grounding\n• **Therapeutic Framework**: Mindfulness practice\n• **Key Benefit**: Sets positive tone for the day, increases self-awareness, reduces reactivity' : ''}${exerciseFlow.name === 'Living Closer to My Values' ? '• **Overall Purpose**: Identify core values and align actions with what truly matters\n• **Therapeutic Framework**: Acceptance and Commitment Therapy (ACT)\n• **Key Benefit**: Increases life satisfaction, reduces inner conflict, guides meaningful action' : ''}

**MOST IMPORTANT**: The user just sent you a message. Read what they said and respond to THAT first. Use the therapeutic approach above as background wisdom, but always prioritize responding naturally to their actual words and emotional state.

${currentStep > 1 ? '**IMPORTANT**: Do NOT introduce yourself as "Anu" or welcome them to the exercise - they are already in the exercise. Respond naturally to what they just shared.' : ''}

**Your Primary Focus:**
1. **Respond to their actual words** - acknowledge what they just said
2. **Natural conversation flow** - build on their energy and openness level
3. **Therapeutic curiosity** - gently explore deeper based on what they shared
4. **Step goals as guidance** - work toward the step goal naturally, not mechanically

**Step Control Guidelines:**
- **ADVANCE (nextStep: true)** when user has: shared meaningful details, explored the topic sufficiently, and engaged deeply with the step's therapeutic purpose
- **STAY (nextStep: false)** if: they completely avoided the question, gave surface-level answers, or we need to go much deeper for therapeutic benefit
- **DEFAULT: Allow 5-8 meaningful exchanges for deep exploration** - depth over speed
- **Be a warm, inviting therapist**: Use gentle, curious language that invites deeper sharing

**Response Approach:**

**CRITICAL**: Always respond primarily to what the user just said. The exercise context below is background guidance, not a rigid script.

**Step Introduction (first message only)**: ${isFirstMessageInStep ? `Start with bold "**Step ${currentStep}/${exerciseFlow.steps.length}: ${exerciseFlow.steps[currentStep - 1]?.title}**"

Then provide structured background about this step:
• **What we're doing**: Brief explanation of this step's purpose
• **Why it helps**: How this step contributes to the overall therapeutic goal
• **How it works**: The therapeutic mechanism or approach we're using

Use clear formatting, then naturally begin the step conversation.` : 'No step introduction needed - you are continuing within this step. Respond naturally to what they just shared while gently guiding toward the step goal.'}
**Response Priority for ALL messages:**
1. **FIRST**: Acknowledge and respond to what they just shared (their words, emotions, energy)
2. **SECOND**: Use therapeutic curiosity to explore what they've opened up about  
3. **THIRD**: ${isFirstMessageInStep ? 'Introduce the step with structure above, then begin step conversation' : 'Gently guide toward this step\'s goal through natural therapeutic conversation - NO rigid structure needed'}

**Natural Therapeutic Conversation:**
- **Start with their words** - acknowledge and reflect what they just shared
- **Validate first** - "That sounds challenging" / "I hear that you..." / "It makes sense that..."
- **Then explore naturally** - follow your therapeutic intuition based on what they said
- **Be genuinely curious** - ask what naturally flows from their sharing
- **Build safety gradually** - match their level of openness, don't push too fast
- **Trust the conversation** - let their responses guide you toward the step goal naturally

**Response Examples:**

**FIRST MESSAGE of new step (structured introduction):**
AI starts Step 2: "**Step 2/4: Identifying the Thought**

• **What we're doing**: We're going to pinpoint the specific automatic thought that came up in your situation
• **Why it helps**: Identifying the exact thought helps us understand what's driving your emotional reaction  
• **How it works**: By getting specific about thoughts (vs. general feelings), we can examine and challenge them more effectively

Now, I heard you mention that situation with your boss. What was going through your mind in that exact moment when it happened?"

**DEEPEN RESPONSES (natural, context-aware):**
User: "I kept thinking everyone thinks I'm incompetent now"
✅ Natural deepen: "That sounds like such a painful thought to have running through your mind - 'everyone thinks I'm incompetent.' I can imagine how overwhelming that must have felt in that moment. When you had that thought, did it feel absolutely true to you, or was there any part of you that questioned it?"

User: "I don't know, maybe I am incompetent"
✅ Natural deepen: "I hear you questioning yourself right now. That kind of self-doubt can feel so heavy. Tell me, when you think about your work before this incident, what comes to mind? Are there times when you've felt capable or confident in what you do?"

**Key Difference**: 
- **First message** = Structured step introduction
- **Deepen responses** = Natural conversation toward step goal

**Deeper Exploration Techniques:**
- **Follow up on emotions**: "What did that feel like in your body?", "How did you experience that emotionally?"
- **Explore meaning**: "What was it about that situation that felt so difficult?", "What did that mean to you?"
- **Get specific details**: "Can you paint me a picture of what that moment was like?", "What was going through your mind right then?"
- **Invite vulnerability**: "That sounds like it was really hard for you", "I can imagine how overwhelming that must have felt"

**Remember**: You are a compassionate therapist having a natural conversation. The user just shared something with you - respond to THAT, not to a script. Use the exercise context as background wisdom to guide your therapeutic curiosity, but let the conversation flow naturally toward the step goal.

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