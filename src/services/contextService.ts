// Final, corrected contextService.ts
import { Message, storageService } from './storageService';
import { generateFirstMessageSuggestions } from '../utils/suggestionGenerator';
import { memoryService, MemoryContext } from './memoryService';
import { goalService, TherapyGoal } from './goalService';
import { apiService } from './apiService';
import { API_CONFIG } from '../config/constants';
import { getExercisesArray } from '../data/exerciseLibrary';

import { getLanguageInstruction, safeT } from './i18nService';

export interface ContextConfig {
  maxTurns: number;
  systemPrompt: string;
}

class ContextService {
  /**
   * Direct API call for summary generation that bypasses therapeutic response JSON schema
   */
  async generateSummaryWithDirectAPI(action: string, messages: any[]) {
  try {
    // All insight-related actions handled by one endpoint
    const INSIGHT_ACTIONS = [
      'extract_patterns',
      'extract_insights',
      'generate_summary',
      'consolidate_summaries',
      'generate_value_reflection_summary',
      'generate_thinking_pattern_reflection_summary',
      'generate_vision_summary'
    ];

    const endpoint = INSIGHT_ACTIONS.includes(action)
      ? `${API_CONFIG.SUPABASE_URL}/functions/v1/extract-insights`
      : `${API_CONFIG.SUPABASE_URL}/functions/v1/ai-chat`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        action,
        messages: messages.map(msg => ({
          role: msg.role,
          content: typeof msg.content === 'string'
            ? msg.content
            : JSON.stringify(msg.content)
        })),
        model: 'google/gemini-2.5-flash',
        maxTokens: 500,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const data = await response.json();

    if (data.success && data.message) {
      return { success: true, message: data.message };
    } else {
      return { success: false, error: data.error || 'Invalid response format from API' };
    }
  } catch (error) {
    console.error('Summary generation API call failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}


    private _getFormattedExerciseList(): string {
    const exercises = getExercisesArray(safeT);
    return exercises.map(ex => `- ${ex.name} (${ex.slug}): ${ex.description}`).join('\n');
  }

  private config: ContextConfig = {
    maxTurns: 10,
    systemPrompt: `(v3) You are **Anu**, a compassionate therapist.  
CRITICAL: You must follow the exercise rules precisely. When the user confirms an exercise, you MUST set nextAction to 'showExerciseCard' and provide the exerciseData.
Your purpose is to be an empathetic, collaborative guide who helps the user explore feelings and thoughts.  

---

### — FORMAT —  
- Output MUST be a single valid JSON object (no extra text, no markdown, no code fences).  
- Fields:  
  • **message**: Your therapeutic reply (clear, warm, well structured).  
    - Use **bold** for key ideas/emotions.  
    - Use bullet points or short lists when helpful to make it more readable.  
    - Use blank lines between short paragraphs.  
  • **suggestions**: 2–4 short, natural client-style replies.  
    - Must always be from the CLIENT’s perspective.  
    - Prefer statements; allow client-style questions only if natural (e.g., “What kind of exercise is that?”).  
    - Do NOT use therapist-style prompts (e.g., “Describe the situation”, “Tell me more…”).  
    - Do NOT use fillers like “I don’t know”.  
  • **nextAction**: 'showExerciseCard' if the user confirms an exercise; otherwise 'none'.  
  • **exerciseData**: Required when nextAction = 'showExerciseCard' → { "type": "the-exercise-slug-from-the-list-in-parentheses", "name": "Exercise Name" }.  

---

### — CONVERSATION GUIDANCE —  
- Warm, human, reflective
- Guide, ask questions, suggest next steps the same way a therapist would do  
- Validate/support first; add brief psychoeducation when useful (why/how) in plain language.  
- Listen to the user, ask about them, how they feel and follow up like a therapist would ask  
- Use emojis meaningfully and to structure things.  
- Use the user’s name ({USER_NAME}) occasionally when it feels natural.  
- At the beginning of a session, start with a gentle, open check-in.
- Invite the user to share how they’re feeling today, what is on their mind, without pressure.
- You can reference when relevant previous sessions with questions, you can when relevant connect to previous goals, themes, triggers, or past insights (e.g., “Last time you mentioned…”).
- Keep the tone warm and collaborative, offering space for the user to set the focus of today’s conversation.
- Reference these potentially when suggesting or guiding toward exercises:  
  - “This connects to your goal of feeling calmer in social settings.”  
  - “Last time, you ….”  
- Use **reminders** to highlight past insights during tough moments:  
  - “Remember, you managed this before.”  
- Apply **cross-session linking**:  
  - “You’ve mentioned self-doubt in past conversations, …”  

---

### — EXERCISE RULES —  
- You can suggest exercises, only when beneficial and after a few validating turns (build rapport).  
- Frame as an invitation, not a requirement.  
- When proposing an exercise, include a brief “why/how it helps” line.  
- If the user confirms (e.g., “yes”, “let’s do it”, “okay”), set nextAction='showExerciseCard' and include exerciseData.  
- **Consistency**: The exercise mentioned in the 'message' MUST EXACTLY MATCH the exercise in 'exerciseData'. Do not mention one exercise and provide data for another.
- **Data Integrity**: The 'type' (slug) and 'name' in 'exerciseData' MUST belong to the same exercise from the 'Available exercises' list. Double-check this before responding.

**Available exercises:**  
{EXERCISE_LIST}

---

### — EDGE CASES —  
- Very brief replies (“idk”, “…”, “not sure”): validate gently and offer a small, concrete next step.  
- Self-harm or harm to others: respond with empathy and encourage immediate professional help/emergency services.  

---

### — EXAMPLES —  
**GOOD suggestions:**  
- “I was worried about my job”  
- “It made me feel anxious”  
- “I was at home when it happened”  
- “Can you explain how this exercise helps?”  

**BAD suggestions:**  
- “Describe the situation”  
- “What was going on?”  
- “Tell me more about it”  

Compact JSON example (format only):  
{"message":"That sounds heavy. **What was happening right before you felt this?**","suggestions":["I was in a meeting with my boss","I felt pressure in my chest","I kept thinking I’d mess up","Can you explain how we’d work on this?"],"nextAction":"none"}  

Final check: Output must be a single valid JSON object, nothing else.`
  };


  private async getPersonalizedSystemPrompt(): Promise<string> {
    const firstName = await storageService.getFirstName().catch(() => 'friend');
    return this.config.systemPrompt.replace('{USER_NAME}', firstName);
  }

  // Regular chat context assembly with memory integration
  async assembleContext(recentMessages: Message[]): Promise<any[]> {
        const exerciseList = this._getFormattedExerciseList();
    const personalizedPrompt = this.config.systemPrompt.replace('{USER_NAME}', await storageService.getFirstName().catch(() => 'friend')).replace('{EXERCISE_LIST}', exerciseList);
        
    // Get memory context for long-term continuity
    console.log('🧠 [DEBUG] Getting memory context...');
    const memoryContext = await memoryService.getMemoryContext();
    console.log('🧠 [DEBUG] Memory context retrieved:', {
      insightCount: memoryContext.insights.length,
      summaryCount: memoryContext.summaries.length,
      hasConsolidated: !!memoryContext.consolidatedSummary
    });

    // Get active goals for therapy direction
    console.log('🎯 [DEBUG] Getting active goals...');
    const activeGoals = await goalService.getActiveGoals();
    console.log('🎯 [DEBUG] Active goals retrieved:', activeGoals.length);
    
    const memoryContextString = memoryService.formatMemoryForContext(memoryContext);
    const goalContextString = this.formatGoalsForContext(activeGoals);
    
    console.log('🧠 [DEBUG] Memory context string length:', memoryContextString.length);
    console.log('🎯 [DEBUG] Goal context string length:', goalContextString.length);
    
    // Combine system prompt with memory and goal context
    const enhancedPrompt = personalizedPrompt + '\n\n' + memoryContextString + goalContextString;
    console.log('🧠 [DEBUG] Enhanced prompt length:', enhancedPrompt.length);
    
    const context = [{
      role: 'system',
      content: enhancedPrompt
    }];

    const processedMessages = recentMessages.filter(msg => msg.type === 'user' || msg.type === 'system');
    context.push(...processedMessages.slice(-this.config.maxTurns * 2).map(msg => ({
      role: msg.type === 'user' ? 'user' : 'assistant',
      content: msg.text || msg.content || ''
    })));

    console.log('📋 [CONTEXT] Complete context being sent to AI:', JSON.stringify(context, null, 2));
    return context;
  }

  // New logic for exercise flow context assembly
  async assembleExerciseContext(
    recentMessages: Message[],
    exerciseFlow: any,
    currentStepNumber: number,
    unused?: any[],
    isFirstMessageInStep: boolean = false
  ): Promise<any[]> {
    const firstName = await storageService.getFirstName().catch(() => 'Friend');
    const totalSteps = exerciseFlow.steps.length;
    const currentStep = exerciseFlow.steps[currentStepNumber - 1];

    // The single, powerful instruction for the current step
    const stepInstruction = currentStep.instruction;

    // Build the dynamic system prompt
    let exerciseSystemPrompt = `(v2-ex) You are Anu, a wise, compassionate therapist. You are currently guiding ${firstName} through the "${exerciseFlow.name}" exercise.

    ---
    
    **FORMAT RULES**  
    - Output MUST always be a single valid JSON object (no markdown, no extra text).  
    - Fields:  
      • **message**: Your therapeutic response.  
        - Use **bold** for key ideas/emotions.  
        - Use **bullet points** or numbered lists when helpful.  
        - Use **blank lines** between paragraphs for readability.  
        - Be clear, warm, and structured.  
      • **suggestions**: 2–4 short, natural client-style replies.  
        - Must be from the CLIENT’s perspective.  
        - Prefer statements; allow client-style questions if natural.  
        - Provide variety: different angles (facts, feelings, thoughts, reactions, uncertainty).  
        - Do NOT include therapist-style prompts (“Describe the situation”, “Tell me more…”).  
        - Do NOT use generic fillers (“I don’t know”).  
      • **nextStep**: Boolean - IMPORTANT for exercise flow.  
        - true → user has meaningfully engaged with this step's goal and is ready to move forward  
        - false → stay in current step (they need to explore more, give more detail, or haven't fully engaged with the step goal)  
        - Set to true after 2-3 meaningful exchanges where they've shared something substantial about the step topic  
    
    ---
    
    **EXAMPLES**  
    Unfinished step (needs more exploration):  
    {
      "message": "I hear how much that situation is weighing on you. **What was the exact thought that went through your mind in that moment?** Understanding that specific thought can help us work with it.",
      "suggestions": ["I can't handle this", "Everyone is judging me", "I'm going to fail", "I'm not sure exactly"],
      "nextStep": false
    }
    
    Still exploring step:  
    {
      "message": "That's such an important insight about feeling judged. **Where in your body do you notice that feeling when it comes up?** Sometimes our physical sensations tell us a lot.",
      "suggestions": ["My chest gets tight", "My stomach knots up", "I feel tense all over", "I don't really notice physical feelings"],
      "nextStep": false
    }
    
    Ready to move forward:  
    {
      "message": "You've shared something really meaningful about how that criticism affected you and where you feel it in your body. That awareness gives us a lot to work with. **Are you ready to explore what we can do with this pattern?**",
      "suggestions": ["Yes, let's keep going", "I want to understand this better", "What would we do differently?", "I need a moment to process"],
      "nextStep": true
    }
    
    ---
    
    **CURRENT STEP INFO**  
    - **Step:** ${currentStepNumber}/${totalSteps}  
    - **Goal:** ${stepInstruction}  
    
    ---
    
    **RESPONSE APPROACH**  
    - **Step 1 first message:** Begin with a bold heading ("Step ${currentStepNumber}/${totalSteps}: ${currentStep.title}"). Give a brief 1-sentence explanation of **why this exercise helps and how it works** (psychoeducation) - they should be in bullet points and there Why it works and how it works text should be in bold. Introduction explanation/sentence should also only be 1-2 sentences. 
    - **First message of other steps:** Begin with a bold heading ("Step ${currentStepNumber}/${totalSteps}: ${currentStep.title}"). Brief explanation to what this step is about and why it matters.  
    - **Every message should include a clear question or instruction to guide the user:**  
      - Ask specific, open-ended questions that help them explore the step's goal
      - Don't just comment on what they said - ALWAYS include a question or next direction
      - Mirror and validate their response, THEN ask what comes next
      - Make the questions personally relevant to what they've shared
    
    **CRITICAL: Every response must either ask a question or give a clear instruction for what to do next. Never just comment without giving direction.**  
    
    ---
    
    **OVERALL ROLE**  
    - Be a warm, empathetic guide — not a script reader.  
    - Personalize with earlier reflections only if relevant; don’t force memory.  
    - Prioritize **connection and clarity**  
    - Allow flexibility in pacing: sometimes stay longer on a step, sometimes move forward.  
    - Before finishing the exercise: help the user **summarize and integrate** the learning.  
    
    ---
    
    **EDGE CASES**  
    - Very short replies (“idk”, “…”, “not sure”): validate gently and offer a small next step.  
    - If user expresses self-harm or intent to harm others: respond with empathy and encourage immediate professional help or emergency services. Safety comes first.  
    
    ---
    
    **Final check:** Output must be a single valid JSON object, nothing else.`
    ;

    const context = [{ role: 'system', content: exerciseSystemPrompt }];
    const recentConvo = recentMessages.slice(-6).map(msg => ({
      role: msg.type === 'user' ? 'user' : 'assistant',
      content: msg.text || msg.content || ''
    }));
    context.push(...recentConvo);

    console.log('📋 [EXERCISE CONTEXT] Complete exercise context being sent to AI:', JSON.stringify(context, null, 2));
    return context;
  }

  generateSuggestions(messages: Message[]): string[] {
    // No suggestions initially - let AI provide them
    // This method should only be called in specific cases
    return [];
  }

  /**
   * Format active goals for AI context integration
   */
  formatGoalsForContext(goals: TherapyGoal[]): string {
    if (!goals || goals.length === 0) {
      return '\n**Current Therapy Goals:** No active goals set yet.\n';
    }

    let contextString = '\n**Current Therapy Goals:**\n';        
    contextString += 'The user has set the following therapy goals. Use these to provide direction, reference progress, and suggest relevant exercises. Goals represent what the user is actively working toward in their therapeutic journey.\n\n';

    goals.forEach((goal, index) => {
      const focusAreaText = goal.focusArea === 'other' ? goal.customFocusArea : 
        goal.focusArea.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      contextString += `**Goal ${index + 1}** (${focusAreaText}):\n`;
      contextString += `- **What they want:** ${goal.mainGoal}\n`;
      contextString += `- **Current step:** ${goal.practicalStep}\n`;
      contextString += `- **Why it matters:** ${goal.motivation}\n`;
      contextString += `- **Timeline:** ${goal.timelineText}\n`;
      contextString += `- **Progress:** ${goal.progress}% complete\n`;
      
      if (goal.checkIns.length > 0) {
        const lastCheckIn = goal.checkIns[0];
        const ratingText = ['struggling', 'some challenges', 'making progress', 'going well', 'excellent'][lastCheckIn.progressRating - 1];
        contextString += `- **Recent update:** ${ratingText} (${new Date(lastCheckIn.date).toLocaleDateString()})\n`;
        if (lastCheckIn.reflection) {
          contextString += `- **Reflection:** "${lastCheckIn.reflection}"\n`;
        }
      }
      contextString += '\n';
    });

    contextString += '**Goal Integration Guidelines:**\n';
    contextString += '- Reference goals when relevant to current conversation\n';
    contextString += '- Connect discussions to goal progress when appropriate\n';
    contextString += '- Suggest exercises that align with active goals\n';
    contextString += '- Check in on goal progress periodically\n';
    contextString += '- Celebrate progress and acknowledge challenges\n';
    contextString += '- Use goals to provide direction and scientific measurement of therapeutic progress\n\n';

    return contextString;
  }

  async assembleValueReflectionContext(
    valueContext: {
      valueId: string;
      prompt: string;
      valueName: string;
      valueDescription: string;
    }
  ): Promise<any[]> {
    const firstName = await storageService.getFirstName().catch(() => 'Friend');
    
    const systemPrompt = `(v1-values) You are **Anu**, a compassionate therapist specializing in values-based reflection.

**Current Context:**
You're helping ${firstName} reflect on their personal value: **"${valueContext.valueName}"**

**User's Personal Description:**
"${valueContext.valueDescription}"

**Reflection Prompt:**
${valueContext.prompt}

---

**SESSION APPROACH:**
- Start naturally by acknowledging their value and personal connection to it
- Use the reflection prompt as your opening question
- Guide them through a thoughtful exploration of this value
- Ask follow-up questions that help them understand how this value shows up (or doesn't) in their life
- Help them identify specific actions or changes that could better honor this value
- Be warm, curious, and supportive throughout
- At the end of the reflection, offer to help them summarize their insights

**FORMAT RULES:**
- Output MUST be a single valid JSON object (no markdown, no extra text)
- Fields:
  • **message**: Your therapeutic response (warm, reflective, uses **bold** for emphasis)
  • **suggestions**: 2-4 natural, client-style responses they might give
  • **nextAction**: 'none' (no exercise cards for value reflections)
  • **exerciseData**: null

**CONVERSATION STYLE:**
- Warm and personal - reference their specific value description
- Use their name (${firstName}) occasionally when natural
- Ask one meaningful question at a time
- Validate their insights and encourage deeper reflection
- Help them connect abstract values to concrete life examples
- After 4-5 exchanges, offer to help them summarize their insights with: "It sounds like we've explored this value together. Would you like me to help you summarize the key insights from our reflection?"`;

    return [
      { role: 'system', content: systemPrompt }
    ];
  }

  async generateValueReflectionSummary(
    messages: any[],
    valueContext: {
      valueId: string;
      valueName: string;
      valueDescription: string;
      prompt: string;
    }
  ): Promise<{ summary: string; keyInsights: string[] }> {
    const firstName = await storageService.getFirstName().catch(() => 'Friend');
    
    const summaryPrompt = `You are helping ${firstName} summarize their reflection on the value "${valueContext.valueName}".

**Context:**
- Value: ${valueContext.valueName}
- Their description: "${valueContext.valueDescription}"
- Reflection prompt: ${valueContext.prompt}

**Your Task:**
Review the conversation carefully and create a meaningful summary based on what ${firstName} actually shared. 

**CRITICAL: You must respond with ONLY a valid JSON object. No other text, no explanations, no markdown. Just pure JSON.**

The JSON object must have:
- "summary": A personal, specific 2-3 sentence summary of their main realizations and discoveries from this reflection
- "keyInsights": An array of 2-4 specific insights they discovered (NOT generic advice)

**JSON Format Example:**
{
  "summary": "Through this reflection, I recognized that connection actually energizes me more than achievement, even though I've been prioritizing work over family time. I realized I want to be more intentional about protecting family dinners and weekend time.",
  "keyInsights": [
    "I've been avoiding family dinners because work feels more 'productive', but connection actually energizes me more than achievement",
    "I want to start saying no to weekend work emails so I can be fully present during family time",
    "My value of connection shows up strongest when I'm fully present rather than multitasking"
  ]
}

**Critical Requirements:**
- Use ${firstName}'s actual words, examples, and specific situations they mentioned
- Capture concrete realizations they had about how this value shows up in their life
- Include specific actions, changes, or commitments they mentioned
- Reference actual challenges or barriers they identified
- Avoid generic statements like "this helped clarify" or "reflection revealed"
- Make each insight a specific, personal statement that ${firstName} could recognize as their own discovery

**Examples of good vs bad insights:**
❌ Bad: "This reflection helped clarify what this value means personally"
✅ Good: "I realized I've been avoiding family dinners because work feels more 'productive', but connection actually energizes me more than achievement"

❌ Bad: "Reflection revealed new perspectives"
✅ Good: "I want to start saying no to weekend work emails so I can be fully present during family time"`;

    const context = [
      { role: 'system', content: summaryPrompt },
      ...messages.slice(-10) // Last 10 messages to avoid token limits
    ];

    try {
      // Use direct API call for summary generation to avoid therapeutic response schema conflicts
      const response = await this.generateSummaryWithDirectAPI('generate_value_reflection_summary', context);
      if (response.success) {
  try {
    if (typeof response.message === "string") {
      let jsonString = response.message.trim();
      const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonString = jsonMatch[0];
      }
      return JSON.parse(jsonString);
    } else {
      return response.message;
    }
  } catch (parseError) {
    console.error("Value reflection JSON parse error:", parseError);
    console.error("Raw response:", response.message);
    // Fall through to fallback
  }
}

      
      // Fallback summary - warm and personal when AI fails
      return {
        summary: `TESTYou spent meaningful time exploring what ${valueContext.valueName} really means to you. This kind of reflection helps you see more clearly how this value shows up in your daily choices and where you might want to be more intentional.`,
        keyInsights: [
          `TEST ${valueContext.valueName} matters to you because: ${valueContext.valueDescription}`,
          `You want to be more intentional about living out ${valueContext.valueName} in your daily life`,
          `This reflection gave you a clearer picture of where your values and actions might not be fully aligned yet`
        ]
      };
    } catch (error) {
      console.error('Error generating reflection summary:', error);
      return {
        summary: `You took time to think deeply about ${valueContext.valueName} and what it means in your life. This kind of personal reflection is valuable for understanding yourself better.`,
        keyInsights: ["This reflection helped you examine your thinking patterns more closely"]
      };
    }
  }

  async generateThinkingPatternReflectionSummary(
    messages: any[],
    patternContext: {
      originalThought: string;
      distortionType: string;
      reframedThought: string;
      prompt: string;
    }
  ): Promise<{ summary: string; keyInsights: string[] }> {
    const firstName = await storageService.getFirstName().catch(() => 'Friend');
    
    const summaryPrompt = `You are helping ${firstName} summarize their reflection on the thinking pattern they explored.

**Context:**
- Original thought: "${patternContext.originalThought}"
- Distortion type: ${patternContext.distortionType}
- Suggested reframe: "${patternContext.reframedThought}"

**Your Task:**
Review the conversation carefully and create a meaningful summary based on what ${firstName} actually discovered about their thinking pattern. 

**CRITICAL: You must respond with ONLY a valid JSON object. No other text, no explanations, no markdown. Just pure JSON.**

The JSON object must have:
- "summary": A personal, specific 2-3 sentence summary of their main realizations and discoveries from this reflection
- "keyInsights": An array of 2-4 specific insights they discovered about their thought patterns (NOT generic advice)

**JSON Format Example:**
{
  "summary": "Through this reflection, I recognized that my tendency toward catastrophic thinking makes small setbacks feel like major failures. I discovered that when I catch myself thinking this way, I can ask 'What would I tell a friend?' to find a more balanced perspective.",
  "keyInsights": [
    "I notice catastrophic thinking especially when I'm stressed about work deadlines",
    "The thought 'I'm going to fail everything' usually means I'm overwhelmed, not actually failing",
    "Asking 'What evidence do I have?' helps me reality-test these thoughts",
    "I want to practice the reframe: 'This is challenging, but I can handle it one step at a time'"
  ]
}

**Critical Requirements:**
- Use ${firstName}'s actual words, examples, and specific situations they mentioned
- Capture concrete realizations they had about their thinking patterns
- Include specific strategies, reframes, or coping skills they discovered
- Reference actual triggers, situations, or feelings they identified
- Avoid generic statements like "this helped clarify" or "reflection revealed"
- Make each insight a specific, personal statement that ${firstName} could recognize as their own discovery

**Examples of good vs bad insights:**
❌ Bad: "This reflection helped clarify the thinking pattern"
✅ Good: "I notice catastrophic thinking especially when I'm stressed about work deadlines"

❌ Bad: "Understanding cognitive distortions is helpful"  
✅ Good: "Asking 'What evidence do I have?' helps me reality-test these thoughts"`;

    const context = [
      { role: 'system', content: summaryPrompt },
      ...messages.slice(-10) // Last 10 messages to avoid token limits
    ];

    try {
      // Use direct API call for summary generation to avoid therapeutic response schema conflicts
      const response = await this.generateSummaryWithDirectAPI('generate_thinking_pattern_reflection_summary', context);
      if (response.success) {
  try {
    let parsed;

    if (typeof response.message === "string") {
      let jsonString = response.message.trim();
      const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonString = jsonMatch[0];
      }
      parsed = JSON.parse(jsonString);
    } else if (typeof response.message === "object") {
      parsed = response.message; // already JSON
    } else {
      throw new Error("Unsupported response.message type");
    }

    return parsed;
  } catch (parseError) {
    console.error("JSON parse error:", parseError);
    console.error("Raw response:", response.message);
    // Fall through to fallback
  }
}


      
      // Fallback summary - warm and personal when AI fails
      return {
        summary: `You spent meaningful time exploring the thought pattern "${patternContext.originalThought}" and how ${patternContext.distortionType.toLowerCase()} might be affecting your perspective. This kind of reflection helps you build awareness of your thinking patterns and develop more balanced ways of looking at situations.`,
        keyInsights: [
          `You explored how the thought "${patternContext.originalThought}" might be an example of ${patternContext.distortionType.toLowerCase()}`,
          `You considered a more balanced perspective: "${patternContext.reframedThought}"`,
          `You're building skills to catch and reframe unhelpful thinking patterns`,
          `This awareness can help you respond differently when similar thoughts come up`
        ]
      };
    } catch (error) {
      console.error('Error generating thinking pattern reflection summary:', error);
      return {
        summary: `You took time to examine your thinking pattern and explore how to approach it more helpfully. This kind of cognitive reflection builds your self-awareness and coping skills.`,
        keyInsights: ["This reflection helped you examine your thinking patterns more closely"]
      };
    }
  }

  async assembleThinkingPatternReflectionContext(
    patternContext: {
      originalThought: string;
      distortionType: string;
      reframedThought: string;
      prompt: string;
    }
  ): Promise<any[]> {
    const firstName = await storageService.getFirstName().catch(() => 'Friend');
    
    const systemPrompt = `(v1-thinking-patterns) You are **Anu**, a compassionate therapist specializing in cognitive behavioral therapy and thought pattern recognition. You are empathetic, grounded and warm.

**Current Context:**
You're helping ${firstName} explore a specific thinking pattern that was identified in their thoughts.

**Identified Pattern:**
- **Original thought:** "${patternContext.originalThought}"
- **Distortion type:** ${patternContext.distortionType}
- **Suggested reframe:** "${patternContext.reframedThought}"

**Session Opening:**
${patternContext.prompt}

---

**SESSION APPROACH:**
- Start warmly by acknowledging you noticed this pattern in their thinking
- Gently explore the original thought without judgment
- Help them understand how ${patternContext.distortionType.toLowerCase()} might be affecting their perspective
- Guide them to discover their own balanced alternatives (don't just provide the reframe)
- Ask specific, gentle questions about:
  - What evidence supports or challenges this thought?
  - How does thinking this way affect their feelings and behaviors?
  - What would they tell a friend having this same thought?
  - What's a more balanced or realistic way to view this situation?

**CONVERSATION GOALS:**
- Help them recognize the pattern in their own words
- Build their skill at catching and reframe these thoughts independently
- Validate their experience while offering new perspectives
- End with practical strategies for handling this pattern in the future

**FORMAT RULES:**
- Output MUST be a single valid JSON object (no markdown, no extra text)
- Fields:
  • **message**: Your therapeutic response (warm, non-judgmental, uses **bold** for key concepts)
  • **suggestions**: 2-4 natural, client-style responses they might give
  • **nextAction**: 'none' (no exercise cards for pattern reflections)
  • **exerciseData**: null

**CONVERSATION STYLE:**
- Warm and collaborative - you're exploring together, not lecturing
- Use their name (${firstName}) occasionally when natural
- Ask one meaningful question at a time
- Validate their original thought while offering new perspectives
- Focus on building their self-awareness and coping skills
- Keep the tone curious and supportive, not corrective
- After 4-5 exchanges, offer to help them summarize their insights with: "It sounds like we've explored this thinking pattern together. Would you like me to help you summarize the key insights from our reflection?"`;

    return [
      { role: 'system', content: systemPrompt }
    ];
  }

  async generateVisionSummary(messages: any[]): Promise<{ summary: string; keyInsights: string[] }> {
    const firstName = await storageService.getFirstName().catch(() => 'Friend');
    
    const summaryPrompt = `You are helping ${firstName} summarize their Vision of the Future.

**Your Task:**
Review the conversation and create a meaningful summary of their vision, based on what they shared.

**CRITICAL: You must respond with ONLY a valid JSON object. No other text, no explanations, no markdown. Just pure JSON.**

The JSON object must have:
- "summary": A personal, specific 2-3 sentence summary of their main realizations about their vision and future goals.
- "keyInsights": An array of 2-4 specific insights they discovered about their future.

**JSON Format Example:**
{
  "summary": "Through this reflection, I identified my core priorities for the future: strong relationships, personal growth, and a career I feel passionate about. I realized that achieving this vision requires a better balance between my work and personal life.",
  "keyInsights": [
    "My vision for the future involves spending more quality time with family and friends.",
    "I want to focus on my personal growth by learning new skills and exploring creative hobbies.",
    "I need to set better boundaries at work to avoid burnout and create space for my other priorities."
  ]
}

**Critical Requirements:**
- Use ${firstName}'s actual words and specific details they mentioned about their vision.
- Capture concrete realizations they had about what is important to them.
- Include specific actions or commitments they mentioned for working toward their vision.
- Avoid generic statements and make each insight personal to ${firstName}'s own discoveries.`;
    
    const context = [
      { role: 'system', content: summaryPrompt },
      ...messages.slice(-10) // Last 10 messages to avoid token limits
    ];
    
    try {
      const response = await this.generateSummaryWithDirectAPI('generate_vision_summary', context);
      if (response.success) {
  try {
    if (typeof response.message === "string") {
      let jsonString = response.message.trim();
      const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonString = jsonMatch[0];
      }
      return JSON.parse(jsonString);
    } else {
      // Already a parsed object
      return response.message;
    }
  } catch (parseError) {
    console.error("Vision summary JSON parse error:", parseError);
    console.error("Raw response:", response.message);
    // Fall through to fallback
  }
}
  
      // Fallback summary when AI fails or returns an invalid response
      return {
        summary: `You spent meaningful time reflecting on your vision of the future. This kind of reflection helps you clarify your personal goals and aspirations.`,
        keyInsights: ["This reflection helped you imagine what a fulfilling future looks like for you"]
      };
    } catch (error) {
      console.error('Error generating vision summary:', error);
      return {
        summary: `You took time to think deeply about your future vision. This kind of personal reflection is valuable for understanding yourself better.`,
        keyInsights: ["This reflection helped you explore your aspirations and what's important to you"]
      };
    }
  }
  async generateTherapyGoalSummary(messages: any[]): Promise<{ summary: string; keyInsights: string[] }> {
    const firstName = await storageService.getFirstName().catch(() => 'Friend');

    try {
      const prompt = `You are reviewing ${firstName}'s therapy goal-setting session where they defined their therapeutic goals and areas for growth.

Analyze their conversation and create a personalized summary that captures their specific goals and insights.

**THEIR CONVERSATION:**
${messages
  .filter(msg => msg.type === 'user' || (msg.type === 'ai' && !msg.content?.includes('Please')) || (msg.type === 'exercise' && !msg.title?.includes('Exercise Complete')))
  .map(msg => `${msg.type === 'user' ? firstName : 'Anu'}: ${msg.text || msg.content}`)
  .join('\n\n')}

**CRITICAL: You must respond with ONLY a valid JSON object. No other text, no explanations, no markdown. Just pure JSON.**

The JSON object must have:
- "summary": A personal, specific 2-3 sentence summary of the therapy goals they defined and what they hope to achieve.
- "keyInsights": An array of 2-4 specific goals and insights they identified (NOT generic advice)

**JSON Format Example:**
{
  "summary": "Through this goal-setting session, I identified that I want to focus on managing my anxiety around work presentations and building more confidence in social situations. I realized that these areas are connected to my core value of authentic connection with others.",
  "keyInsights": [
    "My main goal is to feel calmer and more confident during work presentations",
    "I want to develop better coping strategies for social anxiety, especially in group settings",
    "I've noticed that my fear of judgment holds me back from being my authentic self",
    "Success would look like speaking up more in meetings and feeling comfortable in social gatherings"
  ]
}

**Critical Requirements:**
- Use ${firstName}'s actual words and specific goals they mentioned
- Focus on the specific therapeutic areas they want to work on
- Capture their vision of what success would look like
- Include any connections they made between their goals and values
- Write in first person (I/me) as if ${firstName} is reflecting on their own goals`;

      const response = await this.generateSummaryWithDirectAPI('generate_therapy_goal_summary', [
        { role: 'system', content: prompt },
        { role: 'user', content: 'Please analyze my therapy goal conversation and create the summary.' }
      ]);

      if (response?.message) {
        let parsed;

        try {
          // Handle different response formats
          if (typeof response.message === 'string') {
            // Try to extract JSON from the string if it contains extra text
            const jsonMatch = response.message.match(/\{[\s\S]*\}/);
            const jsonString = jsonMatch ? jsonMatch[0] : response.message;
            parsed = JSON.parse(jsonString);
          } else if (typeof response.message === 'object') {
            parsed = response.message;
          } else {
            throw new Error("Unsupported response.message type");
          }

          return parsed;
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          console.error("Raw response:", response.message);
          // Fall through to fallback
        }
      }

      // Fallback summary when AI fails or returns an invalid response
      return {
        summary: `You spent meaningful time defining your therapy goals and identifying areas where you want to grow. This kind of goal-setting helps you focus your therapeutic work on what matters most to you.`,
        keyInsights: ["You identified specific areas you want to work on in therapy", "You connected your goals to your personal values and what success would look like"]
      };
    } catch (error) {
      console.error('Error generating therapy goal summary:', error);
      return {
        summary: `You took time to thoughtfully define your therapeutic goals and what you hope to achieve. This kind of intentional goal-setting provides direction and purpose for your healing journey.`,
        keyInsights: ["You clarified what you want to focus on in your therapeutic work", "You thought about what positive change would look like in your life"]
      };
    }
  }
}


// Create and export a single instance of ContextService
export const contextService = new ContextService();