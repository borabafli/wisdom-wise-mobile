import AsyncStorage from '@react-native-async-storage/async-storage';
import { chatService } from './chatService';

export interface JournalEntry {
  id: string;
  date: string;
  timestamp: number;
  initialPrompt: string;
  entries: {
    prompt: string;
    response: string;
  }[];
  summary: string;
  insights: string[];
  isPolished: boolean;
  polishedContent?: string;
}

class JournalStorageService {
  private static STORAGE_KEY = 'journal_entries';
  private static ENTRY_PREFIX = 'journal_entry_';

  // Save a new journal entry
  static async saveJournalEntry(
    initialPrompt: string,
    entries: { prompt: string; response: string }[],
    summary: string,
    insights: string[],
    shouldPolish: boolean = false
  ): Promise<string> {
    try {
      const id = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const date = new Date().toISOString().split('T')[0];
      const timestamp = Date.now();
      let polishedContent = '';
      if (shouldPolish) {
        polishedContent = await this.polishJournalEntry(entries, summary, insights);
      }

      const journalEntry: JournalEntry = {
        id,
        date,
        timestamp,
        initialPrompt,
        entries,
        summary,
        insights,
        isPolished: shouldPolish,
        polishedContent: shouldPolish ? polishedContent : undefined,
      };

      // Save individual entry
      await AsyncStorage.setItem(
        `${this.ENTRY_PREFIX}${id}`,
        JSON.stringify(journalEntry)
      );

      // Update entries index
      await this.updateEntriesIndex(id);
      return id;
    } catch (error) {
      console.error('Error saving journal entry:', error);
      throw error;
    }
  }

  // Polish a journal entry with AI
  private static async polishJournalEntry(
    entries: { prompt: string; response: string }[],
    summary: string,
    insights: string[]
  ): Promise<string> {
    const rawContent = entries.map(entry =>
      `**${entry.prompt}**\n\n${entry.response}`
    ).join('\n\n---\n\n');

    const prompt = `Please polish and structure this journal entry beautifully with proper headings, organization, and formatting. Make it well-organized and structured while preserving the original thoughts and feelings.

Raw journal content:
${rawContent}

Summary: ${summary}

Key insights: ${insights.join(', ')}

Please format it with:
1. A meaningful title based on the content
2. Clear section headings
3. Well-organized paragraphs
4. Preserve the personal voice and authenticity
5. Include the insights naturally within the flow

Return only the polished content in markdown format.`;

    try {
      const polishedContent = await chatService.sendMessage(prompt, []);
      return polishedContent.trim();
    } catch (error) {
      console.error('Error polishing journal entry:', error);

      // Fallback: basic formatting
      return `# Journal Entry - ${new Date().toLocaleDateString()}

## Reflection

${entries.map(entry =>
  `### ${entry.prompt}\n\n${entry.response}`
).join('\n\n')}

## Summary

${summary}

## Key Insights

${insights.map(insight => `- ${insight}`).join('\n')}`;
    }
  }

  // Get all journal entries
  static async getAllJournalEntries(): Promise<JournalEntry[]> {
    try {
      const entriesIndex = await this.getEntriesIndex();
      const entries: JournalEntry[] = [];

      for (const entryId of entriesIndex) {
        try {
          const entryData = await AsyncStorage.getItem(`${this.ENTRY_PREFIX}${entryId}`);
          if (entryData) {
            const entry: JournalEntry = JSON.parse(entryData);
            entries.push(entry);
          }
        } catch (error) {
          console.error(`Error loading entry ${entryId}:`, error);
          // Continue with other entries
        }
      }

      // Sort by timestamp (newest first)
      return entries.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Error loading journal entries:', error);
      return [];
    }
  }

  // Get a specific journal entry
  static async getJournalEntry(id: string): Promise<JournalEntry | null> {
    try {
      const entryData = await AsyncStorage.getItem(`${this.ENTRY_PREFIX}${id}`);
      return entryData ? JSON.parse(entryData) : null;
    } catch (error) {
      console.error(`Error loading entry ${id}:`, error);
      return null;
    }
  }

  // Delete a journal entry
  static async deleteJournalEntry(id: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${this.ENTRY_PREFIX}${id}`);
      await this.removeFromEntriesIndex(id);
    } catch (error) {
      console.error(`Error deleting entry ${id}:`, error);
      throw error;
    }
  }

  // Get entries by date range
  static async getEntriesByDateRange(startDate: string, endDate: string): Promise<JournalEntry[]> {
    try {
      const allEntries = await this.getAllJournalEntries();
      return allEntries.filter(entry =>
        entry.date >= startDate && entry.date <= endDate
      );
    } catch (error) {
      console.error('Error filtering entries by date:', error);
      return [];
    }
  }

  // Get recent entries (last N entries)
  static async getRecentEntries(limit: number = 10): Promise<JournalEntry[]> {
    try {
      const allEntries = await this.getAllJournalEntries();
      return allEntries.slice(0, limit);
    } catch (error) {
      console.error('Error loading recent entries:', error);
      return [];
    }
  }

  // Search entries by keyword
  static async searchEntries(keyword: string): Promise<JournalEntry[]> {
    try {
      const allEntries = await this.getAllJournalEntries();
      const searchTerm = keyword.toLowerCase();

      return allEntries.filter(entry =>
        entry.initialPrompt.toLowerCase().includes(searchTerm) ||
        entry.summary.toLowerCase().includes(searchTerm) ||
        entry.entries.some(e =>
          e.prompt.toLowerCase().includes(searchTerm) ||
          e.response.toLowerCase().includes(searchTerm)
        ) ||
        entry.insights.some(insight =>
          insight.toLowerCase().includes(searchTerm)
        )
      );
    } catch (error) {
      console.error('Error searching entries:', error);
      return [];
    }
  }

  // Private helper methods
  private static async getEntriesIndex(): Promise<string[]> {
    try {
      const indexData = await AsyncStorage.getItem(this.STORAGE_KEY);
      return indexData ? JSON.parse(indexData) : [];
    } catch (error) {
      console.error('Error loading entries index:', error);
      return [];
    }
  }

  private static async updateEntriesIndex(entryId: string): Promise<void> {
    try {
      const currentIndex = await this.getEntriesIndex();
      if (!currentIndex.includes(entryId)) {
        currentIndex.unshift(entryId); // Add to beginning for newest first
        await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(currentIndex));
      }
    } catch (error) {
      console.error('Error updating entries index:', error);
    }
  }

  private static async removeFromEntriesIndex(entryId: string): Promise<void> {
    try {
      const currentIndex = await this.getEntriesIndex();
      const updatedIndex = currentIndex.filter(id => id !== entryId);
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedIndex));
    } catch (error) {
      console.error('Error removing from entries index:', error);
    }
  }

  // Get storage statistics
  static async getStorageStats(): Promise<{
    totalEntries: number;
    entriesThisWeek: number;
    entriesThisMonth: number;
    oldestEntry?: string;
    newestEntry?: string;
  }> {
    try {
      const allEntries = await this.getAllJournalEntries();
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const entriesThisWeek = allEntries.filter(entry =>
        new Date(entry.date) >= oneWeekAgo
      ).length;

      const entriesThisMonth = allEntries.filter(entry =>
        new Date(entry.date) >= oneMonthAgo
      ).length;

      return {
        totalEntries: allEntries.length,
        entriesThisWeek,
        entriesThisMonth,
        oldestEntry: allEntries.length > 0 ? allEntries[allEntries.length - 1].date : undefined,
        newestEntry: allEntries.length > 0 ? allEntries[0].date : undefined,
      };
    } catch (error) {
      console.error('Error calculating storage stats:', error);
      return {
        totalEntries: 0,
        entriesThisWeek: 0,
        entriesThisMonth: 0,
      };
    }
  }

  // Clear all journal entries and their index
  static async clearAllEntries(): Promise<void> {
    try {
      const entriesIndex = await this.getEntriesIndex();
      const allKeys = entriesIndex.map(id => `${this.ENTRY_PREFIX}${id}`);
      allKeys.push(this.STORAGE_KEY); // Also remove the index itself
      await AsyncStorage.multiRemove(allKeys);
      console.log('All journal entries and index cleared.');
    } catch (error) {
      console.error('Error clearing all journal entries:', error);
      throw error;
    }
  }
}

export default JournalStorageService;