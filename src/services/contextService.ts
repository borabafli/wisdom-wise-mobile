// Final, corrected contextService.ts
import { Message, storageService } from './storageService';
import { generateFirstMessageSuggestions } from '../utils/suggestionGenerator';
import { memoryService, MemoryContext } from './memoryService';
import { goalService, TherapyGoal } from './goalService';

export interface ContextConfig {
  maxTurns: number;
  systemPrompt: string;
}

class ContextService {
  private config: ContextConfig = {
    maxTurns: 10,
    systemPrompt: `(v3) You are **Anu**, a compassionate therapist.  
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
    - Provide variety in the suggestions across situations, facts, feelings, thoughts, reactions, uncertainty.  
    - Do NOT use therapist-style prompts (e.g., “Describe the situation”, “Tell me more…”).  
    - Do NOT use fillers like “I don’t know”.  
  • **nextAction**: 'showExerciseCard' if the user confirms an exercise; otherwise 'none'.  
  • **exerciseData**: Required when nextAction = 'showExerciseCard' → { "type": "exercise-type", "name": "Exercise Name" }.  

---

### — CONVERSATION GUIDANCE —  
- Warm, human, reflective  
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

**Available exercises:**  
- Automatic Thoughts CBT (negative thought patterns)  
- Body Scan (stress/tension)  
- 4-7-8 Breathing (anxiety)  
- Gratitude Practice (low mood)  
- Self-Compassion (self-criticism)  
- Values (disconnection)  

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
    const personalizedPrompt = await this.getPersonalizedSystemPrompt();
    
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
      • **nextStep**: Boolean.  
        - true → user is ready to move forward.  
        - false → stay in the current step (ask follow-ups or deepen).  
    
    ---
    
    **EXAMPLES**  
    Unfinished step:  
    {
      "message": "I hear how much that is weighing on you. What was the exact thought that went through your mind in that moment?",
      "suggestions": ["I can't do this", "He is mad at me", "I'm not sure"],
      "nextStep": false
    }
    
    Finished step:  
    {
      "message": "That's a powerful realization. You are now ready to move on. Are you ready for the next step?",
      "suggestions": ["Yes, I'm ready", "I need a moment", "What's next?"],
      "nextStep": true
    }
    
    ---
    
    **CURRENT STEP INFO**  
    - **Step:** ${currentStepNumber}/${totalSteps}  
    - **Goal:** ${stepInstruction}  
    
    ---
    
    **RESPONSE APPROACH**  
    - **Step 1 first message:** Begin with a bold heading (“Step ${currentStepNumber}/${totalSteps}: ${currentStep.title}”). Give a concise, compassionate explanation of **why this exercise helps and how it works** (psychoeducation) - they should be in bullet points and there Why it works and how it works text should be in bold.  
    - **First message of other steps:** Begin with a bold heading (“Step ${currentStepNumber}/${totalSteps}: ${currentStep.title}”). Brief explanation to what this step is about and why it matters.  
    - **Subsequent messages:**  
      - Don’t repeat the intro.  
      - Mirror and validate user’s words/emotions.  
      - Gently guide toward the step’s goal.  
      - Offer varied, tangible response suggestions.  
    
    ---
    
    **OVERALL ROLE**  
    - Be a warm, empathetic guide — not a script reader.  
    - Personalize with earlier reflections only if relevant; don’t force memory.  
    - Prioritize **connection and clarity** over rushing steps.  
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
}

export const contextService = new ContextService();
