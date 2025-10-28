import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserValue {
  id: string;
  name: string;
  userDescription: string; // User's own words about what this value means
  importance: number; // 1-5 scale
  createdDate: string;
  updatedDate: string;
  sourceSessionId?: string; // Where it was extracted from
  tags: string[]; // Related keywords
}

export interface ValueInsight {
  id: string;
  valueId: string;
  insight: string;
  date: string;
  sessionId: string;
  confidence: number;
}

export interface ValuesProgress {
  totalValues: number;
  averageImportance: number;
  mostImportantValue: UserValue | null;
  recentlyIdentified: UserValue[];
  alignmentScore: number; // How well actions align with values
}

export interface ValueReflectionSummary {
  id: string;
  valueId: string;
  valueName: string;
  prompt: string;
  summary: string;
  keyInsights: string[];
  date: string;
  sessionId: string;
}

const STORAGE_KEYS = {
  VALUES: 'user_values',
  VALUE_INSIGHTS: 'value_insights',
  VALUE_REFLECTIONS: 'value_reflection_summaries'
};

const CORE_VALUE_SUGGESTIONS = [
  'Family', 'Friendship', 'Connection', 'Growth', 'Learning', 'Creativity',
  'Adventure', 'Stability', 'Health', 'Freedom', 'Security', 'Achievement',
  'Authenticity', 'Compassion', 'Justice', 'Peace', 'Beauty', 'Wisdom',
  'Courage', 'Integrity', 'Spirituality', 'Service', 'Excellence', 'Balance'
];

class ValuesService {
  async saveValue(value: Omit<UserValue, 'id' | 'createdDate' | 'updatedDate'>): Promise<UserValue> {
    try {
      const newValue: UserValue = {
        ...value,
        id: `value_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString()
      };

      const existingValues = await this.getAllValues();
      
      // Check for duplicate values
      const duplicate = existingValues.find(v => 
        v.name.toLowerCase() === newValue.name.toLowerCase()
      );

      if (duplicate) {
        // Update existing value with new information
        const updatedValue = {
          ...duplicate,
          userDescription: newValue.userDescription,
          importance: newValue.importance,
          updatedDate: new Date().toISOString(),
          sourceSessionId: newValue.sourceSessionId,
          tags: [...new Set([...duplicate.tags, ...newValue.tags])]
        };
        
        await this.updateValue(duplicate.id, updatedValue);
        return updatedValue;
      }

      const updatedValues = [...existingValues, newValue];
      await AsyncStorage.setItem(STORAGE_KEYS.VALUES, JSON.stringify(updatedValues));
      
      console.log('Value saved:', newValue);
      return newValue;
    } catch (error) {
      console.error('Failed to save value:', error);
      throw error;
    }
  }

  async getAllValues(): Promise<UserValue[]> {
    try {
      const valuesJson = await AsyncStorage.getItem(STORAGE_KEYS.VALUES);
      if (!valuesJson) return [];

      const values: UserValue[] = JSON.parse(valuesJson);
      return values.sort((a, b) => b.importance - a.importance || new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime());
    } catch (error) {
      console.error('Failed to get values:', error);
      return [];
    }
  }

  async getValue(valueId: string): Promise<UserValue | null> {
    const allValues = await this.getAllValues();
    return allValues.find(value => value.id === valueId) || null;
  }

  async updateValue(valueId: string, updates: Partial<UserValue>): Promise<void> {
    try {
      const allValues = await this.getAllValues();
      const updatedValues = allValues.map(value => 
        value.id === valueId 
          ? { ...value, ...updates, updatedDate: new Date().toISOString() }
          : value
      );

      await AsyncStorage.setItem(STORAGE_KEYS.VALUES, JSON.stringify(updatedValues));
    } catch (error) {
      console.error('Failed to update value:', error);
      throw error;
    }
  }

  async deleteValue(valueId: string): Promise<void> {
    try {
      const allValues = await this.getAllValues();
      const filteredValues = allValues.filter(value => value.id !== valueId);
      await AsyncStorage.setItem(STORAGE_KEYS.VALUES, JSON.stringify(filteredValues));
    } catch (error) {
      console.error('Failed to delete value:', error);
      throw error;
    }
  }

  async getValuesByImportance(): Promise<UserValue[]> {
    const values = await this.getAllValues();
    return values.sort((a, b) => b.importance - a.importance);
  }

  async getTopValues(limit: number = 3): Promise<UserValue[]> {
    const values = await this.getAllValues();
    return values.slice(0, limit); // Already sorted by importance in getAllValues
  }

  async getValuesProgress(): Promise<ValuesProgress> {
    try {
      const values = await this.getAllValues();
      
      if (values.length === 0) {
        return {
          totalValues: 0,
          averageImportance: 0,
          mostImportantValue: null,
          recentlyIdentified: [],
          alignmentScore: 0
        };
      }

      const totalValues = values.length;
      const averageImportance = values.reduce((sum, value) => sum + value.importance, 0) / totalValues;
      const mostImportantValue = values.reduce((max, value) => 
        value.importance > max.importance ? value : max
      );

      // Get recently identified values (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentlyIdentified = values.filter(value => 
        new Date(value.createdDate) > thirtyDaysAgo
      ).slice(0, 3);

      // Simple alignment score based on importance distribution
      const alignmentScore = this.calculateAlignmentScore(values);

      return {
        totalValues,
        averageImportance: Math.round(averageImportance * 10) / 10,
        mostImportantValue,
        recentlyIdentified,
        alignmentScore
      };
    } catch (error) {
      console.error('Failed to get values progress:', error);
      return {
        totalValues: 0,
        averageImportance: 0,
        mostImportantValue: null,
        recentlyIdentified: [],
        alignmentScore: 0
      };
    }
  }

  private calculateAlignmentScore(values: UserValue[]): number {
    if (values.length === 0) return 0;
    
    // Score based on having clearly defined top values with high importance
    const highImportanceValues = values.filter(v => v.importance >= 4).length;
    const hasTopValues = highImportanceValues >= Math.min(3, values.length);
    const importanceDistribution = values.some(v => v.importance >= 4) && values.some(v => v.importance <= 3);
    
    let score = (highImportanceValues / Math.max(3, values.length)) * 100;
    if (hasTopValues) score += 20;
    if (importanceDistribution) score += 10;
    
    return Math.min(100, Math.round(score));
  }

  // VALUE INSIGHTS
  async saveValueInsight(insight: Omit<ValueInsight, 'id'>): Promise<ValueInsight> {
    try {
      const newInsight: ValueInsight = {
        ...insight,
        id: `value_insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      const existingInsights = await this.getValueInsights();
      const updatedInsights = [...existingInsights, newInsight];

      await AsyncStorage.setItem(STORAGE_KEYS.VALUE_INSIGHTS, JSON.stringify(updatedInsights));
      
      return newInsight;
    } catch (error) {
      console.error('Failed to save value insight:', error);
      throw error;
    }
  }

  async getValueInsights(): Promise<ValueInsight[]> {
    try {
      const insightsJson = await AsyncStorage.getItem(STORAGE_KEYS.VALUE_INSIGHTS);
      if (!insightsJson) return [];

      const insights: ValueInsight[] = JSON.parse(insightsJson);
      return insights.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error('Failed to get value insights:', error);
      return [];
    }
  }

  async getInsightsForValue(valueId: string): Promise<ValueInsight[]> {
    const insights = await this.getValueInsights();
    return insights.filter(insight => insight.valueId === valueId);
  }

  // EXTRACTION HELPERS
  
  async extractValuesFromText(text: string, sessionId: string): Promise<UserValue[]> {
    // This would typically call an AI service to extract values
    // For now, return empty array - will be implemented when integrating with AI
    return [];
  }

  getCoreValueSuggestions(): string[] {
    return CORE_VALUE_SUGGESTIONS;
  }

  // Generate importance suggestions based on user's description
  suggestImportance(userDescription: string, valueName: string): number {
    const highImportanceKeywords = [
      'most important', 'essential', 'core', 'fundamental', 'crucial', 
      'everything', 'life', 'always', 'deeply', 'passionate'
    ];
    
    const mediumImportanceKeywords = [
      'important', 'matters', 'care about', 'value', 'meaningful', 'significant'
    ];

    const text = `${userDescription} ${valueName}`.toLowerCase();
    
    if (highImportanceKeywords.some(keyword => text.includes(keyword))) {
      return 5;
    } else if (mediumImportanceKeywords.some(keyword => text.includes(keyword))) {
      return 4;
    } else {
      return 3; // Default moderate importance
    }
  }

  async clearAllValues(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.VALUES, STORAGE_KEYS.VALUE_INSIGHTS]);
      console.log('All values data cleared');
    } catch (error) {
      console.error('Failed to clear values:', error);
      throw error;
    }
  }

  // Get values formatted for display in charts
  async getValuesForChart(): Promise<Array<{name: string; importance: number; description: string}>> {
    const values = await this.getValuesByImportance();
    return values.map(value => ({
      name: value.name,
      importance: value.importance,
      description: value.userDescription.length > 50 
        ? value.userDescription.substring(0, 47) + '...'
        : value.userDescription
    }));
  }

  async saveReflectionSummary(summary: Omit<ValueReflectionSummary, 'id' | 'date'>): Promise<ValueReflectionSummary> {
    try {
      const newSummary: ValueReflectionSummary = {
        ...summary,
        id: `reflection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        date: new Date().toISOString()
      };

      const existingSummaries = await this.getReflectionSummaries();
      const updatedSummaries = [...existingSummaries, newSummary];
      
      await AsyncStorage.setItem(STORAGE_KEYS.VALUE_REFLECTIONS, JSON.stringify(updatedSummaries));
      return newSummary;
    } catch (error) {
      console.error('Error saving reflection summary:', error);
      throw error;
    }
  }

  async getReflectionSummaries(): Promise<ValueReflectionSummary[]> {
    try {
      const summariesData = await AsyncStorage.getItem(STORAGE_KEYS.VALUE_REFLECTIONS);
      return summariesData ? JSON.parse(summariesData) : [];
    } catch (error) {
      console.error('Error getting reflection summaries:', error);
      return [];
    }
  }

  async getReflectionSummariesForValue(valueId: string): Promise<ValueReflectionSummary[]> {
    try {
      const allSummaries = await this.getReflectionSummaries();
      return allSummaries
        .filter(summary => summary.valueId === valueId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error('Error getting reflection summaries for value:', error);
      return [];
    }
  }

  async deleteReflectionSummary(summaryId: string): Promise<void> {
    try {
      const existingSummaries = await this.getReflectionSummaries();
      const updatedSummaries = existingSummaries.filter(s => s.id !== summaryId);
      await AsyncStorage.setItem(STORAGE_KEYS.VALUE_REFLECTIONS, JSON.stringify(updatedSummaries));
    } catch (error) {
      console.error('Error deleting reflection summary:', error);
      throw error;
    }
  }
}

export const valuesService = new ValuesService();