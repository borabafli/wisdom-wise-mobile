import AsyncStorage from '@react-native-async-storage/async-storage';
import { valuesService } from './valuesService';
import { visionInsightsService } from './visionInsightsService';
import { thinkingPatternsService } from './thinkingPatternsService';
import { memoryService } from './memoryService';
import { insightService } from './insightService';
import { goalService } from './goalService';
import { chatService } from './chatService';

export interface JournalPrompt {
  id: string;
  text: string;
  category: 'general' | 'insights-based';
  date: string;
  insightData?: {
    values?: string[];
    visionOfFuture?: string[];
    thoughtPatterns?: string[];
    longTermMemory?: string[];
    therapyGoals?: string[];
  };
}

interface DailyPrompts {
  date: string;
  prompts: JournalPrompt[];
}

class JournalPromptService {
  private static STORAGE_KEY = 'daily_journal_prompts';
  private static LAST_GENERATION_DATE_KEY = 'last_prompt_generation_date';

  // Fallback prompts organized by universal themes
  private static fallbackPrompts = {
    gratitude: [
      "What moment today fills my heart when I think about it?",
      "Who in my life deserves appreciation that I haven't expressed lately?",
      "What challenge I've overcome recently actually deserves celebration?"
    ],
    selfKindness: [
      "How did I treat myself today - and what would I say to my best friend in my situation?",
      "What part of me needs more compassion right now?",
      "If I could give myself one gift today, what would nurture my soul?"
    ],
    character: [
      "What did my actions today reveal about the person I'm becoming?",
      "When did I feel most authentic and true to myself today?",
      "What values guided my choices today, even in small moments?"
    ],
    strength: [
      "What inner strength did I draw on today that I might not have noticed?",
      "How did I handle something difficult today that shows my growth?",
      "What quality in myself am I grateful for right now?"
    ],
    vision: [
      "What dream or aspiration felt alive in me today?",
      "How did I take a step toward the person I want to become?",
      "What future version of myself would be proud of today's choices?"
    ]
  };

  // Generate today's prompts with prioritized logic
  static async generateDailyPrompts(): Promise<JournalPrompt[]> {
    const today = new Date().toISOString().split('T')[0];
    const lastGenerationDate = await AsyncStorage.getItem(this.LAST_GENERATION_DATE_KEY);

    // Check if we've already generated prompts for today
    if (lastGenerationDate === today) {
      return this.getTodaysPrompts();
    }

    const prompts: JournalPrompt[] = [];

    // Check for prioritized insights first
    const { hasInsights, availableTypes } = await this.checkForPrioritizedInsights();

    if (hasInsights) {
      // Generate insight-based prompts from prioritized types
      const insightPrompts = await this.generatePrioritizedInsightPrompts(availableTypes);
      prompts.push(...insightPrompts);
    }

    // Fill remaining slots with fallback prompts (total of 5 prompts per day)
    const remainingSlots = 5 - prompts.length;
    const fallbackPrompts = this.generateFallbackPrompts(remainingSlots);
    prompts.push(...fallbackPrompts);

    // Save prompts and update generation date
    await this.saveDailyPrompts(today, prompts);
    await AsyncStorage.setItem(this.LAST_GENERATION_DATE_KEY, today);

    return prompts;
  }

  // Get today's main prompt (first in the list)
  static async getTodaysMainPrompt(): Promise<string> {
    const prompts = await this.generateDailyPrompts();
    return prompts[0]?.text || this.genericPrompts[0];
  }

  // Get all of today's prompts
  static async getTodaysPrompts(): Promise<JournalPrompt[]> {
    const today = new Date().toISOString().split('T')[0];

    try {
      const storedData = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (storedData) {
        const dailyPrompts: DailyPrompts = JSON.parse(storedData);
        if (dailyPrompts.date === today) {
          return dailyPrompts.prompts;
        }
      }
    } catch (error) {
      console.error('Error fetching today\'s prompts:', error);
    }

    // If no stored prompts for today, generate new ones
    return this.generateDailyPrompts();
  }

  // Check for prioritized insights using services from insights dashboard
  private static async checkForPrioritizedInsights(): Promise<{
    hasInsights: boolean;
    availableTypes: string[];
  }> {
    try {
      const availableTypes: string[] = [];

      // Check values from valuesService (same as before)
      const userValues = await valuesService.getAllValues();
      if (userValues.length > 0) availableTypes.push('values');

      // Check vision insights from visionInsightsService (same as before)
      const visionInsights = await visionInsightsService.getVisionInsights();
      if (visionInsights.length > 0) availableTypes.push('visionOfFuture');

      // Check thinking patterns from insightService (used in insights dashboard)
      const recentPatterns = await insightService.getRecentPatterns(5);
      if (recentPatterns.length > 0) availableTypes.push('thoughtPatterns');

      // Check memory insights from memoryService (used in insights dashboard)
      const memoryInsights = await memoryService.getInsights();
      if (memoryInsights.length > 0) availableTypes.push('longTermMemory');

      // Check therapy goals from goalService (used in insights dashboard)
      const activeGoals = await goalService.getActiveGoals();
      if (activeGoals.length > 0) availableTypes.push('therapyGoals');

      return {
        hasInsights: availableTypes.length > 0,
        availableTypes
      };
    } catch (error) {
      console.error('Error checking insights:', error);
      return { hasInsights: false, availableTypes: [] };
    }
  }

  // Generate AI-based prompts using stored insights
  private static async generatePrioritizedInsightPrompts(availableTypes: string[]): Promise<JournalPrompt[]> {
    const today = new Date().toISOString().split('T')[0];
    const prompts: JournalPrompt[] = [];

    try {
      // Collect available insights data
      const insightsData: any = {};

      if (availableTypes.includes('values')) {
        const userValues = await valuesService.getAllValues();
        insightsData.values = userValues.slice(0, 3).map(v => ({
          name: v.name,
          description: v.userDescription,
          importance: v.importance
        }));
      }

      if (availableTypes.includes('visionOfFuture')) {
        const visionInsights = await visionInsightsService.getVisionInsights();
        insightsData.visionInsights = visionInsights.slice(0, 2).map(v => ({
          coreQualities: v.coreQualities,
          guidingSentences: v.guidingSentences,
          practicalTakeaways: v.practicalTakeaways
        }));
      }

      if (availableTypes.includes('thoughtPatterns')) {
        const recentPatterns = await insightService.getRecentPatterns(3);
        insightsData.thoughtPatterns = recentPatterns.map(p => ({
          type: p.type,
          description: p.description,
          context: p.context
        }));
      }

      if (availableTypes.includes('therapyGoals')) {
        const activeGoals = await goalService.getActiveGoals();
        insightsData.therapyGoals = activeGoals.slice(0, 2).map(g => ({
          title: g.title,
          description: g.description,
          progress: g.progress
        }));
      }

      if (availableTypes.includes('longTermMemory')) {
        const memoryInsights = await memoryService.getInsights();
        insightsData.memoryInsights = memoryInsights.slice(0, 3).map(m => ({
          category: m.category,
          content: m.content,
          confidence: m.confidence
        }));
      }

      // Generate AI prompts based on available insights
      const aiPrompts = await this.generateAIPrompts(insightsData);

      // Convert AI responses to JournalPrompt format
      aiPrompts.forEach((promptText, index) => {
        if (prompts.length < 3) { // Limit to 3 AI-generated prompts
          prompts.push({
            id: `ai_insights_${today}_${index}`,
            text: promptText,
            category: 'insights-based',
            date: today,
            insightData: insightsData
          });
        }
      });

    } catch (error) {
      console.error('Error generating AI insight prompts:', error);
    }

    return prompts;
  }

  // Generate prompts using AI based on user's insights
  private static async generateAIPrompts(insightsData: any): Promise<string[]> {
    try {
      const prompt = `Based on the user's Insights:
${JSON.stringify(insightsData, null, 2)}

Your task is to generate exactly three personalized journaling questions. You MUST follow these rules:

1.  Provide ONLY the three questions.
2.  DO NOT include any introductory phrases, greetings, or explanations.
3.  Each question must be on a new line.
4.  Each question must end with a question mark.
5.  Each question must be warm, thought-provoking, and reference their specific insights.

Your 3 questions (start immediately below this line):`;

      const messages = [
        {
          role: 'system',
          content: 'You are a direct and concise prompt generator. Your job is to create journaling questions for me. You will not engage in conversation. You will not add any extra text, only the questions. Based on provided user insights enerate exactly 3 personalized journaling questions.'
        },
        {
          role: 'user',
          content: prompt
        }
      ];

      const response = await chatService.getChatCompletionWithContext(messages);

      if (response.success && response.message) {
        return response.message.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .filter(line => {
            // Filter out introductory/explanatory text - only keep lines that look like questions
            const lowerLine = line.toLowerCase();
            return !lowerLine.includes('here are') &&
                   !lowerLine.includes('questions:') &&
                   !lowerLine.includes('prompts:') &&
                   !lowerLine.includes('based on') &&
                   !lowerLine.includes('considering') &&
                   line.includes('?') || line.includes('what') || line.includes('how') || line.includes('when') || line.includes('where') || line.includes('why');
          })
          .map(line => {
            // Clean up the line - remove quotes, numbering, bullets
            let cleaned = line.replace(/^["'`]*|["'`]*$/g, ''); // Remove quotes
            cleaned = cleaned.replace(/^\d+[\.\)]\s*/, ''); // Remove numbering like "1. " or "1) "
            cleaned = cleaned.replace(/^[-*]\s*/, ''); // Remove bullets like "- " or "* "

            // Ensure it ends with a question mark
            if (!cleaned.endsWith('?')) {
              cleaned += '?';
            }

            return cleaned;
          })
          .filter(line => line.length > 15) // Filter out very short responses
          .slice(0, 3); // Ensure max 3 prompts
      }

      return [];
    } catch (error) {
      console.error('Error generating AI prompts:', error);
      return [];
    }
  }

  // Generate fallback prompts from universal themes
  private static generateFallbackPrompts(count: number): JournalPrompt[] {
    const today = new Date().toISOString().split('T')[0];
    const prompts: JournalPrompt[] = [];
    const themes = Object.keys(this.fallbackPrompts) as (keyof typeof this.fallbackPrompts)[];
    const shuffledThemes = this.shuffleArray([...themes]);

    for (let i = 0; i < count; i++) {
      const theme = shuffledThemes[i % shuffledThemes.length];
      const themePrompts = this.fallbackPrompts[theme];
      const randomPrompt = themePrompts[Math.floor(Math.random() * themePrompts.length)];

      prompts.push({
        id: `fallback_${theme}_${today}_${i}`,
        text: randomPrompt,
        category: 'general',
        date: today,
      });
    }

    return prompts;
  }

  // Save daily prompts to storage
  private static async saveDailyPrompts(date: string, prompts: JournalPrompt[]): Promise<void> {
    try {
      const dailyPrompts: DailyPrompts = { date, prompts };
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(dailyPrompts));
    } catch (error) {
      console.error('Error saving daily prompts:', error);
    }
  }

  // Utility function to shuffle array
  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Note: User insights are now managed by dedicated services:
  // - valuesService for user values
  // - visionInsightsService for vision insights
  // - thinkingPatternsService for thought patterns
  // - memoryService for long-term memory insights

  // Force regeneration of daily prompts (for testing)
  static async forceRegeneratePrompts(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.LAST_GENERATION_DATE_KEY);
    } catch (error) {
      console.error('Error forcing prompt regeneration:', error);
    }
  }
}

export default JournalPromptService;