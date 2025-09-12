import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ThinkingPatternReflectionSummary {
  id: string;
  originalThought: string;
  distortionType: string;
  reframedThought: string;
  prompt: string;
  summary: string;
  keyInsights: string[];
  date: string;
  sessionId: string;
}

export interface ThinkingPatternsProgress {
  totalReflections: number;
  mostCommonDistortion: string | null;
  recentReflections: ThinkingPatternReflectionSummary[];
  improvementTrends: {
    distortionType: string;
    reflectionCount: number;
  }[];
}

const STORAGE_KEYS = {
  THINKING_PATTERN_REFLECTIONS: 'thinking_pattern_reflection_summaries'
};

class ThinkingPatternsService {
  /**
   * Save a thinking pattern reflection summary
   */
  async saveReflectionSummary(reflectionData: {
    originalThought: string;
    distortionType: string;
    reframedThought: string;
    prompt: string;
    summary: string;
    keyInsights: string[];
    sessionId: string;
  }): Promise<void> {
    try {
      const existingReflections = await this.getReflectionSummaries();
      
      const newReflection: ThinkingPatternReflectionSummary = {
        id: `thinking_pattern_reflection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        originalThought: reflectionData.originalThought,
        distortionType: reflectionData.distortionType,
        reframedThought: reflectionData.reframedThought,
        prompt: reflectionData.prompt,
        summary: reflectionData.summary,
        keyInsights: reflectionData.keyInsights,
        date: new Date().toISOString(),
        sessionId: reflectionData.sessionId
      };

      const updatedReflections = [...existingReflections, newReflection];
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.THINKING_PATTERN_REFLECTIONS,
        JSON.stringify(updatedReflections)
      );
      
      console.log('✅ Thinking pattern reflection summary saved:', {
        id: newReflection.id,
        distortionType: newReflection.distortionType,
        insightCount: newReflection.keyInsights.length
      });
    } catch (error) {
      console.error('❌ Error saving thinking pattern reflection summary:', error);
      throw error;
    }
  }

  /**
   * Get all thinking pattern reflection summaries
   */
  async getReflectionSummaries(): Promise<ThinkingPatternReflectionSummary[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.THINKING_PATTERN_REFLECTIONS);
      if (!stored) return [];
      
      const reflections: ThinkingPatternReflectionSummary[] = JSON.parse(stored);
      
      // Sort by date (newest first)
      return reflections.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error('❌ Error loading thinking pattern reflections:', error);
      return [];
    }
  }

  /**
   * Get reflection summaries for a specific distortion type
   */
  async getReflectionsByDistortionType(distortionType: string): Promise<ThinkingPatternReflectionSummary[]> {
    const allReflections = await this.getReflectionSummaries();
    return allReflections.filter(reflection => 
      reflection.distortionType.toLowerCase().includes(distortionType.toLowerCase())
    );
  }

  /**
   * Get recent reflection summaries (last N)
   */
  async getRecentReflections(limit: number = 10): Promise<ThinkingPatternReflectionSummary[]> {
    const allReflections = await this.getReflectionSummaries();
    return allReflections.slice(0, limit);
  }

  /**
   * Delete a reflection summary
   */
  async deleteReflectionSummary(reflectionId: string): Promise<void> {
    try {
      const existingReflections = await this.getReflectionSummaries();
      const updatedReflections = existingReflections.filter(r => r.id !== reflectionId);
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.THINKING_PATTERN_REFLECTIONS,
        JSON.stringify(updatedReflections)
      );
      
      console.log('✅ Thinking pattern reflection deleted:', reflectionId);
    } catch (error) {
      console.error('❌ Error deleting thinking pattern reflection:', error);
      throw error;
    }
  }

  /**
   * Get thinking patterns progress analytics
   */
  async getProgress(): Promise<ThinkingPatternsProgress> {
    try {
      const allReflections = await this.getReflectionSummaries();
      
      // Count distortion types
      const distortionCounts: Record<string, number> = {};
      allReflections.forEach(reflection => {
        const distortion = reflection.distortionType;
        distortionCounts[distortion] = (distortionCounts[distortion] || 0) + 1;
      });

      // Find most common distortion
      const mostCommonDistortion = Object.keys(distortionCounts).reduce((a, b) => 
        distortionCounts[a] > distortionCounts[b] ? a : b
      , null);

      // Create improvement trends
      const improvementTrends = Object.entries(distortionCounts).map(([distortionType, count]) => ({
        distortionType,
        reflectionCount: count
      })).sort((a, b) => b.reflectionCount - a.reflectionCount);

      return {
        totalReflections: allReflections.length,
        mostCommonDistortion,
        recentReflections: allReflections.slice(0, 5),
        improvementTrends
      };
    } catch (error) {
      console.error('❌ Error getting thinking patterns progress:', error);
      return {
        totalReflections: 0,
        mostCommonDistortion: null,
        recentReflections: [],
        improvementTrends: []
      };
    }
  }

  /**
   * Clear all thinking pattern reflection data (for testing/debugging)
   */
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.THINKING_PATTERN_REFLECTIONS);
      console.log('✅ All thinking pattern reflection data cleared');
    } catch (error) {
      console.error('❌ Error clearing thinking pattern reflection data:', error);
      throw error;
    }
  }

  /**
   * Export all reflection data for backup
   */
  async exportData(): Promise<string> {
    try {
      const reflections = await this.getReflectionSummaries();
      return JSON.stringify(reflections, null, 2);
    } catch (error) {
      console.error('❌ Error exporting thinking pattern reflection data:', error);
      throw error;
    }
  }
}

export const thinkingPatternsService = new ThinkingPatternsService();