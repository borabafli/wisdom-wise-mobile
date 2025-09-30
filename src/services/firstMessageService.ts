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
      const systemPrompt = this.buildFirstMessagePrompt(context, routingHint);

      // 5. Call AI with compact context
      const response = await this.callAIForFirstMessage(systemPrompt);
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
        lastSessionInfo
      ] = await Promise.all([
        storageService.getFirstName().catch(() => 'friend'),
        memoryService.getMemoryContext().catch(() => ({ insights: [], summaries: [] })),
        goalService.getActiveGoals().catch(() => []),
        thinkingPatternsService.getReflectionSummaries().catch(() => []),
        valuesService.getTopValues().catch(() => []),
        storageService.getUserProfile().catch(() => null),
        this.getLastSessionInfo().catch(() => null)
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
        lastSession: lastSessionInfo
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

    // Helper function to apply usage-based decay
    const applyUsageDecay = (baseWeight: number, variantName: RoutingVariant): number => {
      const usageCount = routingUsage[variantName] || 0;
      // Decay: reduce weight by 20% for each use, with minimum of 5%
      const decayFactor = Math.max(0.05, 1 - (usageCount * 0.2));
      const adjustedWeight = baseWeight * decayFactor;
      console.log(`📊 [${variantName}] Base: ${baseWeight}, Usage: ${usageCount}, Decay: ${decayFactor.toFixed(2)}, Final: ${adjustedWeight.toFixed(1)}`);
      return adjustedWeight;
    };

    // Build weighted options based on available context
    const options: Array<{ variant: RoutingVariant; weight: number }> = [];

    // Always include neutral opens with high base weight for variety (but still decay)
    options.push({
      variant: 'neutral_open',
      weight: applyUsageDecay(40, 'neutral_open')
    });

    // Recent reframe (< 72h) - high priority but with usage decay
    if (context.recentReflections.length > 0 && hoursSince < 72) {
      options.push({
        variant: 'reframe_followup',
        weight: applyUsageDecay(35, 'reframe_followup')
      });
    }

    // Thought patterns (within a week) - medium priority with usage decay
    const hasThoughtPatterns = context.memory.insights.some(
      insight => insight.category === 'automatic_thoughts'
    );
    if (hasThoughtPatterns && hoursSince < 168) {
      options.push({
        variant: 'thought_pattern_followup',
        weight: applyUsageDecay(20, 'thought_pattern_followup')
      });
    }

    // Values check - medium priority, decays over time AND usage
    if (context.topValues.length > 0) {
      const baseValueWeight = hoursSince < 168 ? 20 : 10;
      options.push({
        variant: 'values_check',
        weight: applyUsageDecay(baseValueWeight, 'values_check')
      });
    }

    // Active goals - lower weight with usage decay
    if (context.goals.length > 0) {
      options.push({
        variant: 'goal_check',
        weight: applyUsageDecay(15, 'goal_check')
      });
    }

    // Onboarding reference - starts high, decays with time AND usage
    if (context.onboarding.focusAreas && context.onboarding.focusAreas.length > 0) {
      // Higher initial weight, but decays based on time
      let baseOnboardingWeight = 50; // Increased from 30 to 40 for higher likelihood

      // Time-based decay (gentler decay)
      if (hoursSince > 336) { // After 2 weeks
        baseOnboardingWeight = 30; // Increased from 15 to 20
      }
      if (hoursSince > 672) { // After 4 weeks
        baseOnboardingWeight = 18; // Increased from 8 to 12
      }

      options.push({
        variant: 'onboarding_reference',
        weight: applyUsageDecay(baseOnboardingWeight, 'onboarding_reference')
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
  private buildFirstMessagePrompt(context: FirstMessageContext, routingHint: RoutingVariant): string {
    const languageInstruction = getLanguageInstruction();

    return `You are Anu, a compassionate therapist starting a new session with ${context.firstName}.

${languageInstruction}

**Your Task:** Generate a warm, personalized opening message (2-3 sentences max) and 4 contextual suggestion chips for the user to tap.

**Routing Priority:** ${routingHint}

**Available Context:**
${this.formatContextForPrompt(context, routingHint)}

**Guidelines Based on Routing:**
${this.getRoutingGuidelines(routingHint, context)}

**Response Format (JSON only, no other text):**
{
  "message": "Your warm, natural opening message. Use **bold** for key emotional words or concepts.",
  "chips": ["Client response 1", "Client response 2", "Client response 3", "Client response 4"]
}

**Critical Style Rules:**
- Natural and conversational, NOT formulaic or robotic
- VARIETY IS KEY: Don't ask about the same thing every session - mix it up
- Use casual greetings: "Hi", "Hey", or "Hello" (NEVER use "Welcome" or "Welcome back")
- Reference relevant context but don't force it - be flexible like a real therapist
- Stay open and inviting - make space for them to bring up anything
- Use their name (${context.firstName}) sparingly - once if it feels natural, or not at all
- Chips MUST be from the CLIENT's perspective (what they would say/feel)
- Provide variety in chips: specific topics, feelings, actions, or "guide me" options
- Keep it brief - therapists don't overwhelm at the start
- If context feels thin or forced, default to warm neutral opening
- Avoid repetitive patterns - vary your opening style each time

**Important:** You have permission to deviate from the routing hint if you sense it would feel more natural or fresh. Trust your therapeutic judgment and prioritize avoiding repetition.

Output ONLY valid JSON. No markdown, no code blocks, no explanations.`;
  }

  /**
   * Format context data for the AI prompt
   */
  private formatContextForPrompt(context: FirstMessageContext, routingHint: RoutingVariant): string {
    let formatted = '';

    // Recent reframe (highest priority if present)
    if (context.recentReflections.length > 0) {
      const latest = context.recentReflections[0];
      const daysAgo = this.getDaysAgo(latest.date);
      formatted += `**Recent Reframe (${daysAgo}):**\n`;
      formatted += `- Original thought: "${latest.originalThought}"\n`;
      formatted += `- Distortion type: ${latest.distortionType}\n`;
      formatted += `- Reframed thought: "${latest.reframedThought}"\n\n`;
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
  private getRoutingGuidelines(routingHint: RoutingVariant, context: FirstMessageContext): string {
    const guidelines: Record<RoutingVariant, string> = {
      reframe_followup: `**Reframe Followup Focus:**
- Gently reference their recent work on that distorted thought
- Ask if the pattern came up again or how the reframe felt
- Use casual greetings: Hi, Hey, or Hello (not "Welcome")
- Examples:
  • "Hey ${context.firstName}. Last time you worked on reframing that '${context.recentReflections[0]?.originalThought.substring(0, 40)}...' thought. Has that pattern shown up again?"
  • "Hi. I'm curious—did that reframe we explored help when similar thoughts came up?"
- Chips should include: check-in options, apply to new situation, talk about something else
- Stay flexible: if they want to discuss something new, that's perfectly fine`,

      thought_pattern_followup: `**Thought Pattern Followup:**
- Reference the recurring pattern you've noticed (e.g., catastrophizing, black-white thinking)
- Ask if it's been present lately without being diagnostic
- Example: "Hey ${context.firstName}. I've noticed [pattern type] in our conversations. Has that been showing up for you recently?"
- Keep it curious and open, not clinical
- Chips: Yes/No/A bit/New topic`,

      values_check: `**Values Check Focus:**
- Reference one of their top values naturally
- Use language that reflects whether this is from onboarding (they mentioned it) vs. past sessions (we talked about it)
- Example: "You mentioned that ${context.topValues[0]?.name} is important to you. Was there a moment recently where you felt connected to that, or wanted to be?"
- Keep it light and exploratory
- Chips: I lived it / I wanted to / New topic / Plan an action`,

      goal_check: `**Goal Check Focus:**
- Gently reference their active goal
- Ask about progress, a highlight, or a challenge
- Use casual greetings: Hi, Hey, or Hello (not "Welcome")
- Don't make it feel like homework—keep it supportive
- Example: "Hey ${context.firstName}. You've been working on ${context.goals[0]?.mainGoal.substring(0, 40)}... Want to share a highlight or something that's felt hard?"
- Chips: Highlight / Challenge / Show progress / Talk about something else`,

      onboarding_reference: `**Onboarding Reference:**
- Subtly reference something from their initial setup (focus area, challenge, motivation)
- IMPORTANT: Use "you mentioned" or "you shared" language, NOT "we talked about" since this is from onboarding
- Keep it open—they may want to talk about something completely different
- Example: "Hey ${context.firstName}. You mentioned that ${context.onboarding.focusAreas?.[0]} was something you wanted to explore. Has that been on your mind, or is there something else today?"
- Chips: That topic / Something else / Guide me / Quick exercise`,

      neutral_open: `**Neutral Open Focus:**
- Simple, warm, welcoming - no specific agenda
- ALWAYS use their name (${context.firstName}) in neutral opens - it adds warmth
- Ask what would help most right now
- Offer gentle guidance as an option
- Vary the style each time for freshness
- Example variations:
  • Simple opener: "Hey ${context.firstName}. Do you have something specific on your mind, or should I guide a short check-in?" → Chips: Something specific · Guide me · Mood 1–5 · Gratitude
  • Clarity first: "Hi ${context.firstName}. What would help most right now—space to talk, help organizing thoughts, or an exercise?" → Chips: Talk · Organize · 2-min reset · Quick plan
  • Present moment: "Hey ${context.firstName}. How are you feeling right now?" → Chips: Good · Mixed · Struggling · Not sure
  • Open invitation: "Hi ${context.firstName}. What's on your mind today?" → Chips: Something specific · Just talk · Quick check-in · Suggest something
  • Energy check: "Hey ${context.firstName}. What does your energy feel like today?" → Chips: Low · Anxious · Restless · Pretty good
- IMPORTANT: Pick one style randomly, don't combine multiple approaches
- Keep chips varied and action-oriented`
    };

    return guidelines[routingHint];
  }

  /**
   * Call AI service to generate first message
   */
  private async callAIForFirstMessage(systemPrompt: string): Promise<FirstMessageResponse> {
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