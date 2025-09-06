import { memoryService } from './memoryService';
import { ApiError, handleApiError } from '../utils/apiErrorHandler';

export interface MoodInsight {
  id: string;
  text: string;
  category: 'strength' | 'progress' | 'clarity' | 'challenge' | 'growth';
  confidence: number; // 0-1 score
  sessionsReferenced: string[];
}

export interface MoodInsightsData {
  highlights: MoodInsight[];
  analysisDate: string;
  sessionsAnalyzed: number;
  weeksCovered: number;
}

class MoodInsightsService {
  private readonly baseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  private readonly apiKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  private readonly INSIGHTS_CACHE_KEY = 'mood_insights_cache';
  private readonly CACHE_DURATION = 2 * 24 * 60 * 60 * 1000; // 2 days (run every 2 days)

  async generateMoodInsights(): Promise<MoodInsightsData> {
    try {
      // Check cache first
      const cachedInsights = await this.getCachedInsights();
      if (cachedInsights) {
        return cachedInsights;
      }

      // Get session summaries from last 14 days
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
      
      const recentSessions = await memoryService.getSessionSummaries();
      const recentSessionsFiltered = recentSessions.filter(session => 
        new Date(session.timestamp) >= fourteenDaysAgo
      );

      if (recentSessionsFiltered.length === 0) {
        return this.getFallbackInsights();
      }

      // Prepare data for AI analysis
      const sessionData = recentSessionsFiltered.map(session => ({
        id: session.id,
        date: session.timestamp,
        summary: session.summary,
        keyTopics: session.keyTopics || [],
        sentiment: session.sentiment || 'neutral'
      }));

      // Generate insights using AI
      const insights = await this.generateInsightsWithAI(sessionData);
      
      const insightsData: MoodInsightsData = {
        highlights: insights,
        analysisDate: new Date().toISOString(),
        sessionsAnalyzed: recentSessionsFiltered.length,
        weeksCovered: 2
      };

      // Cache the results
      await this.cacheInsights(insightsData);
      
      return insightsData;
    } catch (error) {
      console.error('Error generating mood insights:', error);
      return this.getFallbackInsights();
    }
  }

  private async generateInsightsWithAI(sessionData: any[]): Promise<MoodInsight[]> {
    try {
      if (!this.baseUrl || !this.apiKey) {
        throw new ApiError('Configuration error', 500, 'MISSING_CONFIG');
      }

      const response = await fetch(`${this.baseUrl}/functions/v1/generate-mood-insights`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessions: sessionData,
          analysisType: 'positive_highlights',
          targetInsights: 3,
          focusPeriod: '14_days'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(
          errorData?.message || 'Failed to generate insights',
          response.status,
          errorData?.code || 'INSIGHTS_ERROR'
        );
      }

      const result = await response.json();
      return result.insights || [];
    } catch (error) {
      console.error('AI insights generation error:', error);
      
      // Fallback to rule-based insights
      return this.generateRuleBasedInsights(sessionData);
    }
  }

  private generateRuleBasedInsights(sessionData: any[]): MoodInsight[] {
    const insights: MoodInsight[] = [];
    
    // Analyze common themes across sessions
    const allTopics = sessionData.flatMap(session => session.keyTopics || []);
    const topicFrequency = allTopics.reduce((acc, topic) => {
      acc[topic] = (acc[topic] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const frequentTopics = Object.entries(topicFrequency)
      .filter(([topic, count]) => count >= 2)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    // Generate insights based on frequent topics
    frequentTopics.forEach(([topic, frequency], index) => {
      let category: MoodInsight['category'] = 'progress';
      let text = '';
      
      switch (topic.toLowerCase()) {
        case 'relationships':
        case 'social':
          category = 'strength';
          text = 'Building stronger connections and social confidence';
          break;
        case 'work':
        case 'career':
        case 'professional':
          category = 'progress';
          text = 'Making strides in professional growth and career clarity';
          break;
        case 'anxiety':
        case 'stress':
        case 'worry':
          category = 'clarity';
          text = 'Developing better tools to manage stress and uncertainty';
          break;
        case 'health':
        case 'wellness':
        case 'self-care':
          category = 'strength';
          text = 'Prioritizing wellbeing and building healthy habits';
          break;
        case 'goals':
        case 'future':
        case 'planning':
          category = 'growth';
          text = 'Creating clear direction and meaningful progress';
          break;
        case 'mindfulness':
        case 'meditation':
        case 'awareness':
          category = 'growth';
          text = 'Cultivating mindfulness and emotional awareness';
          break;
        default:
          category = 'progress';
          text = `Growing in ${topic} with consistent self-reflection`;
      }

      insights.push({
        id: `insight-${index}`,
        text,
        category,
        confidence: Math.min(0.7, 0.4 + (frequency * 0.1)),
        sessionsReferenced: sessionData
          .filter(session => session.keyTopics?.includes(topic))
          .map(session => session.id)
      });
    });

    // If we don't have enough insights, add general ones
    if (insights.length < 3) {
      const generalInsights = [
        {
          id: 'general-progress',
          text: 'Showing consistent commitment to personal growth and wellbeing',
          category: 'progress' as const,
          confidence: 0.7,
          sessionsReferenced: sessionData.map(s => s.id)
        },
        {
          id: 'general-growth',
          text: 'Building emotional awareness and positive coping strategies',
          category: 'growth' as const,
          confidence: 0.6,
          sessionsReferenced: sessionData.map(s => s.id)
        },
        {
          id: 'general-strength',
          text: 'Demonstrating resilience and openness to positive change',
          category: 'strength' as const,
          confidence: 0.6,
          sessionsReferenced: sessionData.map(s => s.id)
        }
      ];

      const needed = 3 - insights.length;
      insights.push(...generalInsights.slice(0, needed));
    }

    return insights.slice(0, 3);
  }

  private getFallbackInsights(): MoodInsightsData {
    return {
      highlights: [
        {
          id: 'fallback-1',
          text: 'Taking positive steps toward mental wellness and self-care',
          category: 'strength',
          confidence: 0.8,
          sessionsReferenced: []
        },
        {
          id: 'fallback-2',
          text: 'Building awareness and developing healthy coping tools',
          category: 'progress',
          confidence: 0.7,
          sessionsReferenced: []
        },
        {
          id: 'fallback-3',
          text: 'Showing courage and commitment to personal growth',
          category: 'growth',
          confidence: 0.7,
          sessionsReferenced: []
        }
      ],
      analysisDate: new Date().toISOString(),
      sessionsAnalyzed: 0,
      weeksCovered: 2
    };
  }

  private async getCachedInsights(): Promise<MoodInsightsData | null> {
    try {
      const AsyncStorage = await import('@react-native-async-storage/async-storage');
      const cached = await AsyncStorage.default.getItem(this.INSIGHTS_CACHE_KEY);
      
      if (!cached) return null;
      
      const data = JSON.parse(cached);
      const cacheAge = Date.now() - new Date(data.analysisDate).getTime();
      
      if (cacheAge > this.CACHE_DURATION) {
        return null; // Cache expired
      }
      
      return data;
    } catch (error) {
      console.error('Error reading insights cache:', error);
      return null;
    }
  }

  private async cacheInsights(data: MoodInsightsData): Promise<void> {
    try {
      const AsyncStorage = await import('@react-native-async-storage/async-storage');
      await AsyncStorage.default.setItem(this.INSIGHTS_CACHE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error caching insights:', error);
    }
  }

  // Get mood-specific insights based on trend analysis
  async getMoodTrendInsights(moodStats: any): Promise<string[]> {
    const insights: string[] = [];
    
    const { currentWeek, previousWeek, overallTrend } = moodStats;
    
    // Trend-based insights
    if (overallTrend === 'improving') {
      insights.push('Your mood has been trending upward - great progress!');
    } else if (overallTrend === 'declining') {
      insights.push('Notice some mood challenges - this is normal and temporary');
    } else {
      insights.push('Maintaining stable mood patterns with consistent self-care');
    }
    
    // Weekly comparison insights
    if (currentWeek.averageRating > previousWeek.averageRating) {
      insights.push('This week shows improvement from last week\'s patterns');
    } else if (currentWeek.averageRating < previousWeek.averageRating) {
      insights.push('Some fluctuation this week - remember that ups and downs are normal');
    } else {
      insights.push('Steady emotional patterns across recent weeks');
    }
    
    // Rating-specific insights
    if (currentWeek.averageRating >= 4) {
      insights.push('Strong positive mood patterns and emotional wellbeing');
    } else if (currentWeek.averageRating <= 2) {
      insights.push('Challenging period - consider reaching out for additional support');
    } else {
      insights.push('Balanced emotional state with room for growth');
    }
    
    return insights.slice(0, 3);
  }

  // Clear cached insights (useful for development/testing)
  async clearInsightsCache(): Promise<void> {
    try {
      const AsyncStorage = await import('@react-native-async-storage/async-storage');
      await AsyncStorage.default.removeItem(this.INSIGHTS_CACHE_KEY);
    } catch (error) {
      console.error('Error clearing insights cache:', error);
    }
  }
}

export const moodInsightsService = new MoodInsightsService();