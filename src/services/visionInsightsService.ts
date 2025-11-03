import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_CONFIG } from '../config/constants';

export interface VisionInsight {
  id: string;
  date: string;
  coreQualities: string[]; // e.g. ['grounded', 'confident', 'connected', 'joyful']
  lifeDomains: {
    relationships?: string;
    health?: string;
    career?: string;
    creativity?: string;
    lifestyle?: string;
  };
  guidingSentences: string[]; // short affirmations or summaries
  practicalTakeaways: string[]; // 1-2 small steps for today/this week
  fullDescription: string; // detailed AI-written description
  emotionalConnection: string; // how it feels to live as this future self
  wisdomExchange: string; // guidance from future self
  confidence: number; // 0-1 score of vision clarity
  sourceSessionId: string;
}

const STORAGE_KEY = 'vision_insights';

const VISION_EXTRACTION_PROMPT = `Analyze this Vision of the Future exercise session and extract structured insights. The user has completed an exercise imagining their future self and connecting emotionally with that vision.

**EXTRACT THE FOLLOWING:**

1. **Core Qualities/Values**: Character traits and values the future self embodies (e.g., grounded, confident, connected, joyful, balanced, calm, etc.)

2. **Life Domains**: How the future self shows up in different areas:
   - Relationships (family, friends, community)
   - Health & Well-being (physical, mental, spiritual practices)
   - Career/Work (meaningful work, professional qualities)
   - Creativity/Hobbies (creative expression, personal interests)
   - Lifestyle (daily routines, environment, way of living)

3. **Guiding Sentences**: 2-3 short, meaningful affirmations or mantras that capture the essence of their vision (like "I live with balance and calm" or "I trust myself and my choices")

4. **Practical Takeaways**: 1-2 specific, small steps they identified for today/this week to align with their future self

5. **Full Description**: A beautifully written 2-3 sentence summary of their complete vision that they can return to for inspiration

6. **Emotional Connection**: How it feels to embody this future self (emotional states, body sensations, overall feeling)

7. **Wisdom Exchange**: Any guidance, encouragement, or perspective their future self offered to their present self

**RESPONSE FORMAT:**
Return a JSON object with this structure:
{
  "coreQualities": ["quality1", "quality2"],
  "lifeDomains": {
    "relationships": "description of relationship vision",
    "health": "description of health/wellbeing vision",
    "career": "description of work/career vision",
    "creativity": "description of creative/hobby vision",
    "lifestyle": "description of lifestyle vision"
  },
  "guidingSentences": ["sentence1", "sentence2"],
  "practicalTakeaways": ["takeaway1", "takeaway2"],
  "fullDescription": "Beautiful 2-3 sentence vision summary",
  "emotionalConnection": "How it feels to be this future self",
  "wisdomExchange": "Guidance from future self to present self",
  "confidence": 0.85
}

**Only include domains that were meaningfully discussed. If a domain wasn't explored, omit it from lifeDomains.**

**CONVERSATION TO ANALYZE:**`;

class VisionInsightsService {
  async saveVisionInsight(insight: VisionInsight): Promise<void> {
    try {
      const insights = await this.getVisionInsights();
      insights.unshift(insight); // Add to beginning (most recent first)
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(insights));
    } catch (error) {
      console.error('Error saving vision insight:', error);
      throw error;
    }
  }

  async getVisionInsights(): Promise<VisionInsight[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (!data) return [];

      const insights: VisionInsight[] = JSON.parse(data);
      return insights.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error('Error loading vision insights:', error);
      return [];
    }
  }

  /**
   * Get all vision insights (alias for getVisionInsights)
   * Used by dataManagementService for bulk deletion
   */
  async getAllVisionInsights(): Promise<VisionInsight[]> {
    return this.getVisionInsights();
  }

  async getLatestVisionInsight(): Promise<VisionInsight | null> {
    const insights = await this.getVisionInsights();
    return insights.length > 0 ? insights[0] : null;
  }

  async extractVisionInsight(messages: any[], sessionId: string): Promise<VisionInsight | null> {
    try {
      // Filter messages to find Vision of the Future exercise content
      const relevantMessages = messages
        .filter(msg => msg.text && msg.text.length > 20) // Filter out short responses
        .slice(-30) // Take last 30 messages for context
        .map(msg => `${msg.type}: ${msg.text}`)
        .join('\n');

      // Since this method is now only called with explicit exercise context,
      // we don't need to filter by keywords - we know it's a vision exercise
      console.log('📌 [VISION DEBUG] Processing vision exercise content (called with explicit context)');

      // Prepare messages for API call with proper format for edge function
      const apiMessages = messages.slice(-30)
        .filter(msg => msg.text || msg.content) // Ensure we have content
        .map(msg => ({
          id: msg.id || `msg_${Date.now()}_${Math.random()}`,
          type: msg.type === 'user' ? 'user' : 'system',
          text: msg.text || msg.content || '',
          timestamp: msg.timestamp || new Date().toISOString()
        }))
        .filter(msg => msg.text.trim().length > 0); // Remove empty messages

      if (apiMessages.length === 0) {
        console.log('📌 [VISION DEBUG] No valid messages to process');
        return null;
      }

      console.log('📌 [VISION DEBUG] Calling edge function with', apiMessages.length, 'messages');

      const requestPayload = {
        action: 'extract_vision_insights',
        messages: apiMessages,
        sessionId: sessionId
      };

      console.log('📌 [VISION DEBUG] Request payload:', JSON.stringify(requestPayload, null, 2));
      console.log('📌 [VISION DEBUG] Endpoint:', `${API_CONFIG.SUPABASE_URL}/functions/v1/extract-insights`);

      // Call the Supabase Edge Function for vision insight extraction
      const response = await axios.post(`${API_CONFIG.SUPABASE_URL}/functions/v1/extract-insights`, requestPayload, {
        headers: {
          'Authorization': `Bearer ${API_CONFIG.SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      });

      if (!response.data.success || !response.data.visionInsights) {
        console.log('📌 [VISION DEBUG] No vision insights generated from API');
        return null;
      }

      const extracted = response.data.visionInsights;

      const visionInsight: VisionInsight = {
        id: 'vision_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(),
        coreQualities: extracted.coreQualities || [],
        lifeDomains: extracted.lifeDomains || {},
        guidingSentences: extracted.guidingSentences || [],
        practicalTakeaways: extracted.practicalTakeaways || [],
        fullDescription: extracted.fullDescription || 'A meaningful vision of your future self was explored.',
        emotionalConnection: extracted.emotionalConnection || '',
        wisdomExchange: extracted.wisdomExchange || '',
        confidence: extracted.confidence || 0.7,
        sourceSessionId: sessionId
      };

      await this.saveVisionInsight(visionInsight);
      console.log('✨ [VISION DEBUG] Vision insight saved successfully');

      return visionInsight;

    } catch (error) {
      console.error('📌 [VISION DEBUG] Error extracting vision insight:', error);
      
      if (error.response) {
        console.error('📌 [VISION DEBUG] API Response Error:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          url: error.response.config?.url,
          method: error.response.config?.method
        });
        
        // Show user-friendly error based on status
        if (error.response.status === 400) {
          console.error('📌 [VISION DEBUG] Bad Request - Check request payload format');
        } else if (error.response.status === 401 || error.response.status === 403) {
          console.error('📌 [VISION DEBUG] Authentication Error - Check API key');
        } else if (error.response.status >= 500) {
          console.error('📌 [VISION DEBUG] Server Error - Edge function might be down');
        }
      } else if (error.request) {
        console.error('📌 [VISION DEBUG] API Request Error - No response received:', error.request);
      } else {
        console.error('📌 [VISION DEBUG] General Error:', error.message);
      }
      
      return null;
    }
  }

  async shouldExtractVisionInsight(messages: any[]): Promise<boolean> {
    // Check if this session contains Vision of the Future exercise
    const relevantText = messages
      .map(msg => (msg.text || msg.content || '').toLowerCase())
      .join(' ');

    // Check for explicit exercise context first (most reliable)
    const exerciseContextIndicators = [
      'vision of the future',
      'vision exercise',
      'your ideal future',
      'imagine your future',
      'envisioning'
    ];

    // Check if there are explicit Vision of the Future exercise indicators
    const hasExplicitExercise = exerciseContextIndicators.some(keyword => relevantText.includes(keyword));
    
    // If we find explicit exercise indicators, check for substantial vision content
    if (hasExplicitExercise) {
      // Look for substantial future-oriented content (multiple indicators)
      const visionContentKeywords = [
        'years from now',
        'future vision',
        'how will you live',
        'your future life',
        'future you'
      ];
      
      const visionContentCount = visionContentKeywords.filter(keyword => relevantText.includes(keyword)).length;
      const hasSubstantialContent = visionContentCount >= 2 || relevantText.includes('vision of the future');
      
      console.log('📌 [VISION DEBUG] Found explicit exercise context. Content score:', visionContentCount);
      return hasSubstantialContent;
    }

    // Filter out common false positives from thinking pattern reflections
    const thinkingPatternIndicators = [
      'thinking pattern',
      'cognitive distortion',
      'reframe',
      'distortion',
      'thought pattern',
      'negative thought',
      'catastrophic thinking'
    ];
    
    const hasThinkingPatternContext = thinkingPatternIndicators.some(indicator => relevantText.includes(indicator));
    
    if (hasThinkingPatternContext) {
      console.log('📌 [VISION DEBUG] Detected thinking pattern reflection context - skipping vision extraction');
      return false;
    }

    // If no explicit exercise context and no thinking pattern context, be conservative
    console.log('📌 [VISION DEBUG] No clear exercise context found - skipping vision extraction');
    return false;
  }

  formatVisionForDisplay(insight: VisionInsight): {
    title: string;
    summary: string;
    domains: Array<{ name: string; description: string }>;
    qualities: string[];
    guidance: string;
  } {
    const domains = Object.entries(insight.lifeDomains)
      .filter(([_, description]) => description && description.trim())
      .map(([name, description]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        description: description!
      }));

    return {
      title: `Vision from ${new Date(insight.date).toLocaleDateString()}`,
      summary: insight.fullDescription,
      domains,
      qualities: insight.coreQualities,
      guidance: insight.wisdomExchange || insight.emotionalConnection
    };
  }

  async getVisionStats(): Promise<{
    totalVisions: number;
    latestVisionDate: string | null;
    commonQualities: Array<{ quality: string; count: number }>;
    domainsExplored: string[];
  }> {
    try {
      const insights = await this.getVisionInsights();

      if (insights.length === 0) {
        return {
          totalVisions: 0,
          latestVisionDate: null,
          commonQualities: [],
          domainsExplored: []
        };
      }

      // Count common qualities
      const qualityCounts = insights
        .flatMap(insight => insight.coreQualities)
        .reduce((acc, quality) => {
          acc[quality] = (acc[quality] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

      const commonQualities = Object.entries(qualityCounts)
        .map(([quality, count]) => ({ quality, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Get explored domains
      const domainsExplored = Array.from(new Set(
        insights.flatMap(insight => Object.keys(insight.lifeDomains))
      ));

      return {
        totalVisions: insights.length,
        latestVisionDate: insights[0].date,
        commonQualities,
        domainsExplored
      };
    } catch (error) {
      console.error('Error getting vision stats:', error);
      return {
        totalVisions: 0,
        latestVisionDate: null,
        commonQualities: [],
        domainsExplored: []
      };
    }
  }

  async clearVisionInsights(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing vision insights:', error);
      throw error;
    }
  }

  /**
   * Delete all vision insights (alias for clearVisionInsights)
   * Used by dataManagementService for bulk deletion
   */
  async deleteAllVisionInsights(): Promise<void> {
    return this.clearVisionInsights();
  }
}

export const visionInsightsService = new VisionInsightsService();