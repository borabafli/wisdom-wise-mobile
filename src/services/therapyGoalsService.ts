import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TherapyGoalsSummary {
  focusAreas: string[]; // e.g., ["managing anxiety", "improving relationships"]
  desiredChanges: string[]; // e.g., ["I'd feel comfortable in social situations", "I'd trust my decisions more"]
  createdDate: string;
  lastUpdated: string;
}

const STORAGE_KEY = 'therapy_goals_summary';

class TherapyGoalsService {
  /**
   * Save therapy goals summary from the Therapy Goals exercise
   * This will be used by AI context in future sessions
   */
  async saveTherapyGoals(focusAreas: string[], desiredChanges: string[]): Promise<void> {
    try {
      const existing = await this.getTherapyGoals();

      const summary: TherapyGoalsSummary = {
        focusAreas,
        desiredChanges,
        createdDate: existing?.createdDate || new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(summary));
      console.log('Therapy goals summary saved:', summary);
    } catch (error) {
      console.error('Failed to save therapy goals summary:', error);
      throw error;
    }
  }

  /**
   * Get the current therapy goals summary
   * Used by contextService to include in AI prompts
   */
  async getTherapyGoals(): Promise<TherapyGoalsSummary | null> {
    try {
      const summaryJson = await AsyncStorage.getItem(STORAGE_KEY);
      if (!summaryJson) return null;

      return JSON.parse(summaryJson);
    } catch (error) {
      console.error('Failed to get therapy goals summary:', error);
      return null;
    }
  }

  /**
   * Check if user has defined therapy goals
   */
  async hasTherapyGoals(): Promise<boolean> {
    const summary = await this.getTherapyGoals();
    return summary !== null && summary.focusAreas.length > 0;
  }

  /**
   * Get a formatted string of therapy goals for AI context
   */
  async getTherapyGoalsContext(): Promise<string> {
    const summary = await this.getTherapyGoals();
    if (!summary || summary.focusAreas.length === 0) {
      return '';
    }

    const focusAreasText = summary.focusAreas.join(', ');
    const changesText = summary.desiredChanges.join('; ');

    return `The user has defined their therapy focus areas as: ${focusAreasText}. They want to work toward: ${changesText}`;
  }

  /**
   * Update therapy goals (allows user to refine them later)
   */
  async updateTherapyGoals(focusAreas: string[], desiredChanges: string[]): Promise<void> {
    return this.saveTherapyGoals(focusAreas, desiredChanges);
  }

  /**
   * Clear therapy goals
   */
  async clearTherapyGoals(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      console.log('Therapy goals cleared');
    } catch (error) {
      console.error('Failed to clear therapy goals:', error);
      throw error;
    }
  }

  /**
   * Delete all therapy goals (alias for clearTherapyGoals)
   * Used by dataManagementService for bulk deletion
   */
  async deleteAllTherapyGoals(): Promise<void> {
    return this.clearTherapyGoals();
  }
}

export const therapyGoalsService = new TherapyGoalsService();
