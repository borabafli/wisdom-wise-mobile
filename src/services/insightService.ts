import { Message, ThoughtPattern, storageService } from './storageService';
import { API_CONFIG } from '../config/constants';

interface ExtractInsightsResponse {
  success: boolean;
  patterns?: ThoughtPattern[];
  error?: string;
  processingTime?: number;
}

interface InsightServiceConfig {
  supabaseUrl?: string;
  enabled: boolean;
  batchSize: number;
  minConfidence: number;
  autoExtract: boolean;
}

class InsightService {
  private config: InsightServiceConfig = {
    supabaseUrl: API_CONFIG.SUPABASE_URL,
    enabled: true,
    batchSize: 999, // Disabled - only extract at session end
    minConfidence: 0.6, // Only store patterns with 60%+ confidence
    autoExtract: false // Disabled automatic extraction during conversation
  };

  private processingQueue: Set<string> = new Set();
  
  /**
   * Extract insights from current conversation
   */
  async extractFromCurrentSession(): Promise<ThoughtPattern[]> {
    try {
      const session = await storageService.getCurrentSession();
      if (!session || session.messages.length === 0) {
        return [];
      }

      return await this.extractFromMessages(session.messages, session.id);
    } catch (error) {
      console.error('Error extracting from current session:', error);
      return [];
    }
  }

  /**
   * Extract insights at session end - optimized for full conversation analysis
   */
  async extractAtSessionEnd(): Promise<ThoughtPattern[]> {
    try {
      const session = await storageService.getCurrentSession();
      if (!session || session.messages.length === 0) {
        console.log('No session or messages to analyze');
        return [];
      }

      // Filter for meaningful user messages
      const userMessages = session.messages.filter(msg => 
        msg.type === 'user' && 
        (msg.text || msg.content) && 
        (msg.text || msg.content)!.length > 20 // Longer threshold for quality
      );

      if (userMessages.length < 2) {
        console.log('Not enough meaningful user messages for analysis');
        return [];
      }

      console.log(`Analyzing full conversation: ${session.messages.length} total messages, ${userMessages.length} user messages`);
      
      // Use the full conversation context for better analysis
      const patterns = await this.extractFromMessages(session.messages, session.id);
      
      if (patterns.length > 0) {
        console.log(`Session analysis complete: extracted ${patterns.length} thought patterns`);
      } else {
        console.log('No significant thought patterns detected in this session');
      }

      return patterns;
    } catch (error) {
      console.error('Error in session-end extraction:', error);
      return [];
    }
  }

  /**
   * Extract insights from specific messages
   */
  async extractFromMessages(messages: Message[], sessionId: string): Promise<ThoughtPattern[]> {
    if (!this.config.enabled || this.processingQueue.has(sessionId)) {
      return [];
    }

    try {
      this.processingQueue.add(sessionId);

      // Filter for meaningful messages
      const userMessages = messages.filter(msg => 
        msg.type === 'user' && 
        (msg.text || msg.content) && 
        (msg.text || msg.content)!.length > 15 // Minimum meaningful length
      );

      if (userMessages.length === 0) {
        return [];
      }

      // Call Supabase function
      const response = await this.callInsightExtractionFunction(messages, sessionId);
      
      if (!response.success || !response.patterns) {
        console.warn('Insight extraction failed:', response.error);
        return [];
      }

      // Filter by confidence and save high-quality patterns
      const highConfidencePatterns = response.patterns.filter(
        pattern => pattern.confidence >= this.config.minConfidence
      );

      if (highConfidencePatterns.length > 0) {
        await storageService.saveSessionInsights(sessionId, highConfidencePatterns);
        console.log(`Extracted ${highConfidencePatterns.length} thought patterns`);
      }

      return highConfidencePatterns;

    } catch (error) {
      console.error('Error extracting insights:', error);
      return [];
    } finally {
      this.processingQueue.delete(sessionId);
    }
  }

  /**
   * Check if conversation should trigger insight extraction
   */
  shouldExtractInsights(messages: Message[]): boolean {
    if (!this.config.autoExtract || !this.config.enabled) {
      return false;
    }

    const userMessageCount = messages.filter(msg => msg.type === 'user').length;
    return userMessageCount > 0 && userMessageCount % this.config.batchSize === 0;
  }

  /**
   * Get recent thought patterns for dashboard
   */
  async getRecentPatterns(limit: number = 10): Promise<ThoughtPattern[]> {
    try {
      return await storageService.getRecentThoughtPatterns(limit);
    } catch (error) {
      console.error('Error loading recent patterns:', error);
      return [];
    }
  }

  /**
   * Get patterns by distortion type
   */
  async getPatternsByDistortion(distortionType: string): Promise<ThoughtPattern[]> {
    try {
      const allPatterns = await storageService.getThoughtPatterns();
      return allPatterns.filter(pattern => 
        pattern.distortionTypes.includes(distortionType)
      );
    } catch (error) {
      console.error('Error loading patterns by distortion:', error);
      return [];
    }
  }

  /**
   * Get insight statistics
   */
  async getInsightStats(): Promise<{
    totalPatterns: number;
    commonDistortions: { name: string; count: number }[];
    recentActivity: number;
    confidenceAverage: number;
  }> {
    try {
      const patterns = await storageService.getThoughtPatterns();
      
      if (patterns.length === 0) {
        return {
          totalPatterns: 0,
          commonDistortions: [],
          recentActivity: 0,
          confidenceAverage: 0
        };
      }

      // Count distortions
      const distortionCounts: Record<string, number> = {};
      let totalConfidence = 0;
      let recentActivity = 0;
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      patterns.forEach(pattern => {
        totalConfidence += pattern.confidence;
        
        if (new Date(pattern.timestamp) > oneWeekAgo) {
          recentActivity++;
        }

        pattern.distortionTypes.forEach(distortion => {
          distortionCounts[distortion] = (distortionCounts[distortion] || 0) + 1;
        });
      });

      const commonDistortions = Object.entries(distortionCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return {
        totalPatterns: patterns.length,
        commonDistortions,
        recentActivity,
        confidenceAverage: totalConfidence / patterns.length
      };
    } catch (error) {
      console.error('Error calculating insight stats:', error);
      return {
        totalPatterns: 0,
        commonDistortions: [],
        recentActivity: 0,
        confidenceAverage: 0
      };
    }
  }

  /**
   * Call Supabase edge function for insight extraction
   */
  private async callInsightExtractionFunction(
    messages: Message[], 
    sessionId: string
  ): Promise<ExtractInsightsResponse> {
    try {
      const functionUrl = `${this.config.supabaseUrl}/functions/v1/extract-insights`;
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.SUPABASE_ANON_KEY}`,
          'apikey': API_CONFIG.SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          messages,
          sessionId,
          userId: 'current_user' // TODO: Replace with actual user ID when auth is implemented
        })
      });

      if (!response.ok) {
        throw new Error(`Function call failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calling insight extraction function:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Update service configuration
   */
  updateConfig(newConfig: Partial<InsightServiceConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration
   */
  getConfig(): InsightServiceConfig {
    return { ...this.config };
  }

  /**
   * Enable/disable insight extraction
   */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
  }

  /**
   * Clear all stored patterns (for testing/debugging)
   */
  async clearAllPatterns(): Promise<void> {
    try {
      await storageService.clearThoughtPatterns();
    } catch (error) {
      console.error('Error clearing patterns:', error);
      throw error;
    }
  }
}

export const insightService = new InsightService();
export type { ThoughtPattern, ExtractInsightsResponse, InsightServiceConfig };