import { memoryService, MemoryContext } from './memoryService';
import { goalService, TherapyGoal } from './goalService';
import { thinkingPatternsService, ThinkingPatternReflectionSummary } from './thinkingPatternsService';
import { valuesService } from './valuesService';
import { storageService } from './storageService';
import { API_CONFIG } from '../config/constants';
import { getLanguageInstruction } from './i18nService';

interface FirstMessageContext {
  firstName: string;
  memory: MemoryContext;
  goals: TherapyGoal[];
  recentReflections: ThinkingPatternReflectionSummary[];
  topValues: any[];
  onboarding: {
    focusAreas?: string[];
    challenges?: string[];
    motivation?: string;
  };
  lastSession?: {
    date: string;
    hoursSince: number;
  };
  lastSessionSummary?: {
    text: string;
    date: string;
  } | null;
}

interface FirstMessageResponse {
  message: string;
  chips: string[];
}

type RoutingVariant =
  | 'reframe_followup'
  | 'thought_pattern_followup'
  | 'values_check'
  | 'goal_check'
  | 'onboarding_reference'
  | 'last_session_followup'
  | 'neutral_open';

class FirstMessageService {
  /**
   * Main entry point: Generate AI-powered first message for new session
   */
  async generateFirstMessage(): Promise<FirstMessageResponse> {
    try {
      console.log('🎯 [FIRST MESSAGE] Starting generation...');

      // 1. Gather all available context
      const context = await this.gatherContext();
      console.log('📊 [FIRST MESSAGE] Context gathered:', {
        hasRecentReflections: context.recentReflections.length > 0,
        hasLastSessionSummary: !!context.lastSessionSummary,
        insightCount: context.memory.insights.length,
        goalCount: context.goals.length,
        valueCount: context.topValues.length,
        hoursSinceLastSession: context.lastSession?.hoursSince
      });

      // 2. Determine routing priority with usage-based decay
      const routingHint = await this.determineRouting(context);
      console.log('🔀 [FIRST MESSAGE] Routing hint:', routingHint);

      // 3. Track the routing variant for usage-based decay
      await storageService.trackFirstMessageRouting(routingHint);

      // 4. Build specialized system prompt
      const systemPrompt = await this.buildFirstMessagePrompt(context, routingHint);

      // 5. Call AI with compact context
      const response = await this.callAIForFirstMessage(systemPrompt, routingHint);
      console.log('✅ [FIRST MESSAGE] Generated:', response);

      return response;
    } catch (error) {
      console.error('❌ [FIRST MESSAGE] Error generating first message:', error);
      // Fallback to neutral greeting
      return await this.getFallbackGreeting();
    }
  }

  /**
   * Gather all relevant context from various services
   */
  private async gatherContext(): Promise<FirstMessageContext> {
    try {
      const [
        firstName,
        memory,
        goals,
        recentReflections,
        topValues,
        profile,
        lastSessionInfo,
        lastSessionSummary
      ] = await Promise.all([
        storageService.getFirstName().catch(() => 'friend'),
        memoryService.getMemoryContext().catch(() => ({ insights: [], summaries: [] })),
        goalService.getActiveGoals().catch(() => []),
        thinkingPatternsService.getReflectionSummaries().catch(() => []),
        valuesService.getTopValues().catch(() => []),
        storageService.getUserProfile().catch(() => null),
        this.getLastSessionInfo().catch(() => null),
        memoryService.getLastSessionSummary().catch(() => null)
      ]);

      return {
        firstName,
        memory,
        goals,
        recentReflections: recentReflections.slice(0, 1), // Most recent only
        topValues: topValues.slice(0, 2), // Top 2 values
        onboarding: {
          focusAreas: profile?.onboardingFocusAreas || profile?.challenges || [],
          challenges: profile?.challenges || [],
          motivation: profile?.motivation
        },
        lastSession: lastSessionInfo,
        lastSessionSummary: lastSessionSummary ? {
          text: lastSessionSummary.text,
          date: lastSessionSummary.date
        } : null
      };
    } catch (error) {
      console.error('Error gathering context:', error);
      throw error;
    }
  }

  /**
   * Determine routing using weighted randomization with usage-based decay
   * Avoids repetitive greetings while still being contextually relevant
   */
  private async determineRouting(context: FirstMessageContext): Promise<RoutingVariant> {
    const hoursSince = context.lastSession?.hoursSince || Infinity;

    // Get routing usage history
    const routingUsage = await storageService.getFirstMessageRoutingUsage();
    console.log('📊 [ROUTING USAGE] Current counts:', routingUsage);

    // Get recent routing history for short-term repetition prevention
    const recentHistory = await storageService.getRecentRoutingHistory();
    console.log('📜 [ROUTING HISTORY] Recent variants:', recentHistory);

    // Helper function to apply usage-based decay with differentiated rates
    const applyUsageDecay = (baseWeight: number, variantName: RoutingVariant): number => {
      const usageCount = routingUsage[variantName] || 0;
      // Differentiated decay: onboarding decays faster (30%) vs others (20%)
      const isOnboarding = variantName === 'onboarding_reference';
      const decayRate = isOnboarding ? 0.3 : 0.2;
      const minDecay = isOnboarding ? 0.03 : 0.05;
      const decayFactor = Math.max(minDecay, 1 - (usageCount * decayRate));
      const adjustedWeight = baseWeight * decayFactor;
      console.log(`📊 [${variantName}] Base: ${baseWeight}, Usage: ${usageCount}, Rate: ${decayRate}, Decay: ${decayFactor.toFixed(2)}, Final: ${adjustedWeight.toFixed(1)}`);
      return adjustedWeight;
    };

    // Helper function to apply short-term repetition penalty
    const applyRepetitionPenalty = (weight: number, variantName: RoutingVariant): number => {
      const last3 = recentHistory.slice(0, 3);
      const last5 = recentHistory.slice(0, 5);

      const countInLast3 = last3.filter(v => v === variantName).length;
      const countInLast5 = last5.filter(v => v === variantName).length;

      let penalty = 1;
      if (countInLast3 >= 2) {
        penalty = 0.5; // 50% penalty if used 2+ times in last 3 sessions
        console.log(`⚠️ [${variantName}] Short-term penalty: used ${countInLast3}x in last 3 sessions (50% penalty)`);
      } else if (countInLast5 >= 3) {
        penalty = 0.3; // 70% penalty if used 3+ times in last 5 sessions
        console.log(`⚠️ [${variantName}] Medium-term penalty: used ${countInLast5}x in last 5 sessions (70% penalty)`);
      }

      return weight * penalty;
    };

    // Build weighted options based on available context
    const options: Array<{ variant: RoutingVariant; weight: number }> = [];

    // Always include neutral opens with HIGHER base weight for variety
    let neutralWeight = applyUsageDecay(50, 'neutral_open'); // Increased from 20 → 50
    neutralWeight = applyRepetitionPenalty(neutralWeight, 'neutral_open');
    options.push({
      variant: 'neutral_open',
      weight: neutralWeight
    });

    // Recent reframe (< 72h) - high priority but with usage decay
    if (context.recentReflections.length > 0 && hoursSince < 72) {
      let reframeWeight = applyUsageDecay(60, 'reframe_followup'); // Increased from 55 → 60
      reframeWeight = applyRepetitionPenalty(reframeWeight, 'reframe_followup');
      options.push({
        variant: 'reframe_followup',
        weight: reframeWeight
      });
    }

    // Last session followup (< 48h) - high continuity priority
    if (context.lastSessionSummary && hoursSince < 48) {
      options.push({
        variant: 'last_session_followup',
        weight: applyUsageDecay(50, 'last_session_followup')
      });
    }

    // Thought patterns (within a week) - medium priority with usage decay
    const hasThoughtPatterns = context.memory.insights.some(
      insight => insight.category === 'automatic_thoughts'
    );
    if (hasThoughtPatterns && hoursSince < 168) {
      let thoughtWeight = applyUsageDecay(25, 'thought_pattern_followup'); // Increased from 20 → 25
      thoughtWeight = applyRepetitionPenalty(thoughtWeight, 'thought_pattern_followup');
      options.push({
        variant: 'thought_pattern_followup',
        weight: thoughtWeight
      });
    }

    // Values check - medium priority, decays over time AND usage
    if (context.topValues.length > 0) {
      const baseValueWeight = hoursSince < 168 ? 25 : 15; // Increased from 20/10 → 25/15
      let valueWeight = applyUsageDecay(baseValueWeight, 'values_check');
      valueWeight = applyRepetitionPenalty(valueWeight, 'values_check');
      options.push({
        variant: 'values_check',
        weight: valueWeight
      });
    }

    // Active goals - reduced weight with usage decay
    if (context.goals.length > 0) {
      let goalWeight = applyUsageDecay(30, 'goal_check'); // Reduced from 45 → 30
      goalWeight = applyRepetitionPenalty(goalWeight, 'goal_check');
      options.push({
        variant: 'goal_check',
        weight: goalWeight
      });
    }

    // Onboarding reference - REDUCED initial weight, faster decay with time AND usage
    if (context.onboarding.focusAreas && context.onboarding.focusAreas.length > 0) {
      // Lower initial weight, faster time-based decay
      let baseOnboardingWeight = 40; // Reduced from 70 → 40

      // Time-based decay (more aggressive)
      if (hoursSince > 336) { // After 2 weeks
        baseOnboardingWeight = 25; // Reduced from 50 → 25
      }
      if (hoursSince > 672) { // After 4 weeks
        baseOnboardingWeight = 15; // Reduced from 28 → 15
      }

      let onboardingWeight = applyUsageDecay(baseOnboardingWeight, 'onboarding_reference');
      onboardingWeight = applyRepetitionPenalty(onboardingWeight, 'onboarding_reference');
      options.push({
        variant: 'onboarding_reference',
        weight: onboardingWeight
      });
    }

    // Weighted random selection
    const totalWeight = options.reduce((sum, opt) => sum + opt.weight, 0);
    let random = Math.random() * totalWeight;

    for (const option of options) {
      random -= option.weight;
      if (random <= 0) {
        console.log('🎯 Routing (weighted random):', option.variant, `(weight: ${option.weight}/${totalWeight})`);
        return option.variant;
      }
    }

    // Fallback (should never reach here)
    console.log('🎯 Routing: Neutral open (fallback)');
    return 'neutral_open';
  }

  /**
   * Build the system prompt for AI first message generation
   */
  private async buildFirstMessagePrompt(context: FirstMessageContext, routingHint: RoutingVariant): Promise<string> {
    const languageInstruction = getLanguageInstruction();
    const guidelines = await this.getRoutingGuidelines(routingHint, context);

    return `You are Anu, a compassionate therapist starting a new session with ${context.firstName}.

${languageInstruction}

**Your Task:** Generate a warm, personalized opening message (2-3 sentences max) and 4 contextual suggestion chips for the user to tap.

**Routing Priority:** ${routingHint}

**Available Context:**
${this.formatContextForPrompt(context, routingHint)}

**Guidelines Based on Routing:**
${guidelines}

**Response Format (JSON only, no other text):**
{
  "message": "Your warm, natural opening message. Use **bold** for key emotional words or concepts.",
  "chips": ["Client response 1", "Client response 2", "Client response 3", "Client response 4"]
}

**Critical Style Rules:**
- Natural and conversational, NOT formulaic or robotic
- Structure the message in paragraph: you must use \n (the newline character) 
- Try to be sharp and to the point, leading to deeper truths of their personal life, help them to reflect, be compassionate
- Use casual greetings: "Hi", "Hey", or "Hello" (NEVER use "Welcome" or "Welcome back")
- Reference relevant context but don't force it - be flexible like a real therapist
- Stay open and inviting - make space for them to bring up anything
- Use their name (${context.firstName}) sparingly - once if it feels natural, or not at all
- Chips MUST be from the CLIENT's perspective (what they would say/feel)
- Provide variety in chips: specific topics, feelings, actions, or "guide me" options
- Keep it brief - therapists don't overwhelm at the start
- If context feels thin or forced, default to warm neutral opening


**Important:** You have permission to deviate from the routing hint if you sense it would feel more natural or fresh. Trust your therapeutic judgment and prioritize avoiding repetition.

Output ONLY valid JSON. No markdown, no code blocks, no explanations.`;
  }

  /**
   * Format context data for the AI prompt
   */
  private formatContextForPrompt(context: FirstMessageContext, routingHint: RoutingVariant): string {
    let formatted = '';

    // CONTEXT FILTERING: For neutral_open, provide minimal context to prevent AI drift back to onboarding
    if (routingHint === 'neutral_open') {
      // Only show high-level context summary
      const hasContext = context.memory.insights.length > 0 ||
                        context.goals.length > 0 ||
                        context.topValues.length > 0 ||
                        (context.onboarding.focusAreas && context.onboarding.focusAreas.length > 0);

      if (hasContext) {
        formatted = `**Context Note:** User has established history with therapy work, but today is a fresh start. Don't reference specific past topics unless they bring them up.\n`;
      } else {
        formatted = `(No prior session data - this appears to be their first real conversation with you)\n`;
      }

      // Last session timing is always useful
      if (context.lastSession) {
        formatted += `**Last Session:** ${this.getDaysAgo(context.lastSession.date)}\n`;
      }

      return formatted;
    }

    // FULL CONTEXT: For all other routing variants, provide detailed context

    // Recent reframe (highest priority if present)
    if (context.recentReflections.length > 0) {
      const latest = context.recentReflections[0];
      const daysAgo = this.getDaysAgo(latest.date);
      formatted += `**Recent Reframe (${daysAgo}):**\n`;
      formatted += `- Original thought: "${latest.originalThought}"\n`;
      formatted += `- Distortion type: ${latest.distortionType}\n`;
      formatted += `- Reframed thought: "${latest.reframedThought}"\n\n`;
    }

    // Last session summary (for continuity)
    if (context.lastSessionSummary) {
      const daysAgo = this.getDaysAgo(context.lastSessionSummary.date);
      formatted += `**Last Session Summary (${daysAgo}):**\n`;
      formatted += `${context.lastSessionSummary.text}\n\n`;
    }

    // Insights (patterns discovered)
    if (context.memory.insights.length > 0) {
      formatted += `**Known Patterns & Insights:**\n`;
      context.memory.insights.slice(0, 3).forEach(insight => {
        formatted += `- ${insight.content} (${insight.category})\n`;
      });
      formatted += '\n';
    }

    // Top values
    if (context.topValues.length > 0) {
      formatted += `**Personal Values:**\n`;
      context.topValues.forEach((value: any) => {
        formatted += `- ${value.name}: "${value.userDescription}"\n`;
      });
      formatted += '\n';
    }

    // Active goals
    if (context.goals.length > 0) {
      formatted += `**Active Therapy Goals:**\n`;
      context.goals.slice(0, 2).forEach(goal => {
        formatted += `- ${goal.mainGoal} (${goal.progress}% progress)\n`;
        if (goal.checkIns.length > 0) {
          const lastCheckIn = goal.checkIns[0];
          formatted += `  Recent: ${['struggling', 'some challenges', 'making progress', 'going well', 'excellent'][lastCheckIn.progressRating - 1]}\n`;
        }
      });
      formatted += '\n';
    }

    // Onboarding context (subtle reference)
    if (context.onboarding.focusAreas && context.onboarding.focusAreas.length > 0) {
      formatted += `**Initial Focus Areas:** ${context.onboarding.focusAreas.join(', ')}\n`;
    }
    if (context.onboarding.motivation) {
      formatted += `**Why they're here:** ${context.onboarding.motivation}\n`;
    }
    if (formatted.includes('Initial Focus Areas') || formatted.includes('Why they\'re here')) {
      formatted += '\n';
    }

    // Last session timing
    if (context.lastSession) {
      formatted += `**Last Session:** ${this.getDaysAgo(context.lastSession.date)} (${context.lastSession.hoursSince}h ago)\n`;
    }

    return formatted || '(No prior session data - this appears to be their first real conversation with you)';
  }

  /**
   * Get routing-specific guidelines for the AI
   */
  private async getRoutingGuidelines(routingHint: RoutingVariant, context: FirstMessageContext): Promise<string> {
    // Get last used neutral styles to enforce variety
    const lastNeutralStyles = await storageService.getLastNeutralStyles();
    const avoidStyles = lastNeutralStyles.length > 0
      ? `\n**AVOID these recently used styles:** ${lastNeutralStyles.join(', ')}`
      : '';

    const guidelines: Record<RoutingVariant, string> = {
      reframe_followup: `**Reframe Followup Focus:**
- Gently reference their recent work on that distorted thought
- Ask if the pattern came up again or how the reframe felt
- Use casual greetings: Hi, Hey, or Hello (not "Welcome")
- Examples:
  • "Hey ${context.firstName}. Last time you worked on reframing that '${context.recentReflections[0]?.originalThought.substring(0, 40)}...' thought. Has that pattern shown up again?"
  • "Hi. I'm curious—did that reframe we explored help when similar thoughts came up?"
- Chips should include: check-in options, apply to new situation, talk about something else
- Stay flexible: if they want to discuss something new, that's perfectly fine. Ask about it in a second paragraph.`,

      thought_pattern_followup: `**Thought Pattern Followup:**
- Reference the recurring pattern you've noticed (e.g., catastrophizing, black-white thinking)
- Ask if it's been present lately without being diagnostic
- Example: "Hey ${context.firstName}. I've noticed [pattern type] in our conversations. Has that been showing up for you recently?"
- Keep it curious and open, not clinical
- Chips: Yes/No/A bit/New topic`,

      values_check: `**Values Check Focus:**
- Reference one of their top values naturally
- Use language that reflects whether this is from onboarding (they mentioned it) vs. past sessions (we talked about it)
- Keep it light and exploratory
- Chips: I lived it / I wanted to / New topic / Plan an action`,

      goal_check: `**Goal Check Focus:**
- Reference their active goal INDIRECTLY 70% of the time
- Indirect examples (prefer these):
  • Instead of "How is your sleep going?" → "What's been supporting your wellbeing this week?"
  • Instead of "Progress on your anxiety goal?" → "What felt different for you lately?"
  • Instead of "How's the stress management?" → "How have you been taking care of yourself?"
- Direct examples (use 30% of the time):
  • "Any progress on [goal]?"
  • "How did [goal] feel this week?"
- Use casual greetings: Hi, Hey, or Hello (not "Welcome")
- Don't make it feel like homework—keep it supportive, be the guide we all need in life
- Chips: A highlight · A challenge · Something else · Guide me`,

      onboarding_reference: `**Onboarding Reference:**
- Reference their initial focus area/challenge INDIRECTLY 70% of the time
- Indirect examples (prefer these):
  • Instead of "How's your sleep been?" → "What's been different in your daily rhythm lately?"
  • Instead of "Still dealing with anxiety?" → "What's been on your mind most this week?"
  • Instead of "Working on your relationships?" → "How have your connections been feeling?"
  • "What's been most important to you lately?"
  • "What's been taking up space in your thoughts?"
- Direct examples (use 30% of the time):
  • "You mentioned wanting to work on [focus area]. How's that feeling?"
  • "You shared that [challenge] was important. What's present with that?"
- IMPORTANT: Use "you mentioned" or "you shared" language, NOT "we talked about" since this is from onboarding
- Always ask a meaningful first question that guides toward growth
- Keep it open—they may want to talk about something completely different, use a second separate paragraph to ask about it.
- Chips: That topic · Something else · Guide me · Quick exercise`,

      last_session_followup: `**Last Session Followup:**
- Reference a key theme or insight from their last session (use the summary provided)
- Ask if they want to continue exploring it or if things have shifted
- Use casual greetings: Hi, Hey, or Hello (not "Welcome")
- Use "we talked about" or "we explored" language since this is from a previous session
- Examples:
  • "Hey ${context.firstName}. Last time we talked about [theme from summary]. How have things been with that?"
  • "Hi. I remember we explored [topic]. Want to pick up where we left off, or is something else on your mind?"
- Keep it open—use a second separate paragraph to ask if something else is on their mind
- Don't force continuity if the summary is too generic - be flexible
- Chips: Continue that · Something new · Update you · Guide me`,

      neutral_open: `**Neutral Open Focus:**
- Simple, warm, welcoming - no specific agenda
- ALWAYS use their name (${context.firstName}) in neutral opens - it adds warmth
- Ask what would help most right now
- Offer gentle guidance as an option
- Vary the style each time for maximum freshness${avoidStyles}
- Example variations (pick ONE randomly that hasn't been used recently):
  • Simple opener: "Hey ${context.firstName}. Do you have something specific on your mind, or should I guide a short check-in?" → Chips: Something specific · Guide me · Mood 1–5 · Gratitude
  • Clarity first: "Hi ${context.firstName}. What would help most right now—space to talk, help organizing thoughts, or an exercise?" → Chips: Talk · Organize · 2-min reset · Quick plan
  • Present moment: "Hey ${context.firstName}. How are you feeling right now?" → Chips: Good · Mixed · Struggling · Not sure
  • Open invitation: "Hi ${context.firstName}. What's on your mind today?" → Chips: Something specific · Just talk · Quick check-in · Suggest something
  • Energy check: "Hey ${context.firstName}. What does your energy feel like today?" → Chips: Low · Anxious · Restless · Pretty good
  • Curiosity spark: "Hey ${context.firstName}. What's been sitting with you lately?" → Chips: A thought · A feeling · A situation · Not sure yet
  • Gentle invitation: "Hi ${context.firstName}. I'm here when you're ready to share." → Chips: Ready now · Need a moment · Quick exercise · Guide me
  • Reflective opening: "Hey ${context.firstName}. What would be helpful to explore together today?" → Chips: Talk it through · Organize thoughts · Try an exercise · Not sure
  • Need-based: "Hi ${context.firstName}. What brought you here right now?" → Chips: Need to talk · Feeling stuck · Quick reset · Just checking in
- CRITICAL: Identify which style you're using by its keyword (e.g., "sitting", "helpful", "feeling", "mind", "energy", "ready", "brought") and include it in your response metadata
- IMPORTANT: Pick one style randomly, don't combine multiple approaches
- Keep chips varied and action-oriented
- These varied openings prevent the "what is present for you today" repetition problem`
    };

    return guidelines[routingHint];
  }

  /**
   * Call AI service to generate first message
   */
  private async callAIForFirstMessage(systemPrompt: string, routingHint: RoutingVariant): Promise<FirstMessageResponse> {
    try {
      const response = await fetch(`${API_CONFIG.SUPABASE_URL}/functions/v1/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          action: 'chat', // Required by edge function
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: 'Generate the opening message and chips for this session.' }
          ],
          model: 'google/gemini-2.5-flash', // Fast model for simple task
          temperature: 0.85, // Higher for variety
          maxTokens: 250,
          bypassJsonSchema: true // Don't use therapeutic response schema
        })
      });

      if (!response.ok) {
        throw new Error(`AI call failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 [FIRST MESSAGE] Raw API response:', data);

      // With bypassJsonSchema, the edge function now parses the JSON for us
      // The response format is: { success: true, message: "greeting", suggestions: ["chip1", ...] }
      if (data.success && data.message && Array.isArray(data.suggestions)) {
        // Track neutral style if this was a neutral_open routing
        if (routingHint === 'neutral_open') {
          this.detectAndTrackNeutralStyle(data.message);
        }

        return {
          message: data.message,
          chips: data.suggestions.slice(0, 4)
        };
      }

      // Fallback: try to parse if the response is still in the old format
      let parsed;
      if (typeof data.message === 'string') {
        // Try to extract JSON from response
        const jsonMatch = data.message.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
          if (parsed.message && Array.isArray(parsed.chips)) {
            // Track neutral style if this was a neutral_open routing
            if (routingHint === 'neutral_open') {
              this.detectAndTrackNeutralStyle(parsed.message);
            }

            return {
              message: parsed.message,
              chips: parsed.chips.slice(0, 4)
            };
          }
        }
      }

      throw new Error('Invalid response structure from AI');
    } catch (error) {
      console.error('Error calling AI for first message:', error);
      throw error;
    }
  }

  /**
   * Detect which neutral style was used and track it
   */
  private async detectAndTrackNeutralStyle(message: string): Promise<void> {
    const lowerMessage = message.toLowerCase();

    // Map keywords to style names
    const styleKeywords = [
      { keyword: 'sitting with you', style: 'sitting' },
      { keyword: 'helpful to explore', style: 'helpful' },
      { keyword: 'feeling right now', style: 'feeling' },
      { keyword: 'on your mind', style: 'mind' },
      { keyword: 'energy feel', style: 'energy' },
      { keyword: 'ready to share', style: 'ready' },
      { keyword: 'brought you here', style: 'brought' },
      { keyword: 'something specific', style: 'specific' },
      { keyword: 'would help most', style: 'clarity' }
    ];

    for (const { keyword, style } of styleKeywords) {
      if (lowerMessage.includes(keyword)) {
        await storageService.trackNeutralStyle(style);
        console.log(`🎨 [NEUTRAL STYLE] Detected and tracked: "${style}" (found "${keyword}")`);
        return;
      }
    }

    console.log('🎨 [NEUTRAL STYLE] No specific style detected in message');
  }

  /**
   * Get information about the last session
   */
  private async getLastSessionInfo(): Promise<{ date: string; hoursSince: number } | null> {
    try {
      const currentSession = await storageService.getCurrentSession();
      if (currentSession && currentSession.createdAt) {
        const lastSessionDate = new Date(currentSession.createdAt);
        const now = new Date();
        const hoursSince = (now.getTime() - lastSessionDate.getTime()) / (1000 * 60 * 60);

        return {
          date: currentSession.createdAt,
          hoursSince: Math.floor(hoursSince)
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting last session info:', error);
      return null;
    }
  }

  /**
   * Helper: Get "X days ago" string
   */
  private getDaysAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 24) {
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return '1 day ago';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      const weeks = Math.floor(diffDays / 7);
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    }
  }

  /**
   * Fallback greeting when AI generation fails
   */
  private async getFallbackGreeting(): Promise<FirstMessageResponse> {
    const firstName = await storageService.getFirstName().catch(() => '');
    const greeting = firstName ? `Hey ${firstName}. What's on your mind today?` : "Hey. What's on your mind today?";

    return {
      message: greeting,
      chips: [
        "Something specific",
        "Guide me",
        "Quick check-in",
        "Just talk"
      ]
    };
  }
}

export const firstMessageService = new FirstMessageService();
export type { FirstMessageResponse, FirstMessageContext, RoutingVariant };