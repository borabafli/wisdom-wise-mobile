import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MoodEntry {
  date: string; // YYYY-MM-DD format
  rating: number; // 1-5 scale
  note?: string;
  sessionId?: string; // Link to therapy session if applicable
}

export interface WeeklyMoodSummary {
  weekStart: string; // Monday of the week
  weekEnd: string;
  averageRating: number;
  totalEntries: number;
  trend: 'improving' | 'stable' | 'declining';
  moodLabel: string; // e.g., "Comfortable", "Optimistic"
}

export interface MoodStats {
  currentWeek: WeeklyMoodSummary;
  previousWeek: WeeklyMoodSummary;
  last30Days: MoodEntry[];
  monthlyAverage: number;
  overallTrend: 'improving' | 'stable' | 'declining';
}

class MoodService {
  private readonly MOOD_KEY = 'mood_entries';

  // Mood rating to emoji and label mapping
  private readonly moodMap = {
    1: { emoji: '😞', label: 'Difficult', color: '#ef4444' },
    2: { emoji: '😕', label: 'Challenging', color: '#f97316' },
    3: { emoji: '😐', label: 'Okay', color: '#eab308' },
    4: { emoji: '🙂', label: 'Good', color: '#22c55e' },
    5: { emoji: '😊', label: 'Great', color: '#16a34a' }
  };

  async getAllMoodEntries(): Promise<MoodEntry[]> {
    try {
      const data = await AsyncStorage.getItem(this.MOOD_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading mood entries:', error);
      return [];
    }
  }

  async addMoodEntry(rating: number, note?: string, sessionId?: string): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const entries = await this.getAllMoodEntries();
      
      // Remove existing entry for today if it exists
      const filteredEntries = entries.filter(entry => entry.date !== today);
      
      // Add new entry
      const newEntry: MoodEntry = {
        date: today,
        rating,
        note,
        sessionId
      };
      
      filteredEntries.push(newEntry);
      filteredEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      await AsyncStorage.setItem(this.MOOD_KEY, JSON.stringify(filteredEntries));
    } catch (error) {
      console.error('Error saving mood entry:', error);
      throw new Error('Failed to save mood entry');
    }
  }

  async getMoodStats(): Promise<MoodStats> {
    const entries = await this.getAllMoodEntries();
    const now = new Date();
    
    // Get current week (Monday to Sunday)
    const currentWeekStart = this.getWeekStart(now);
    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekEnd.getDate() + 6);
    
    // Get previous week
    const previousWeekStart = new Date(currentWeekStart);
    previousWeekStart.setDate(previousWeekStart.getDate() - 7);
    const previousWeekEnd = new Date(previousWeekStart);
    previousWeekEnd.setDate(previousWeekEnd.getDate() + 6);
    
    // Filter entries
    const currentWeekEntries = entries.filter(entry => 
      this.isDateInRange(entry.date, currentWeekStart, currentWeekEnd)
    );
    
    const previousWeekEntries = entries.filter(entry => 
      this.isDateInRange(entry.date, previousWeekStart, previousWeekEnd)
    );
    
    // Get last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const last30Days = entries.filter(entry => 
      new Date(entry.date) >= thirtyDaysAgo
    );
    
    // Calculate summaries
    const currentWeek = this.calculateWeeklySummary(currentWeekEntries, currentWeekStart, currentWeekEnd);
    const previousWeek = this.calculateWeeklySummary(previousWeekEntries, previousWeekStart, previousWeekEnd);
    
    // Calculate monthly average
    const monthlyAverage = last30Days.length > 0 
      ? last30Days.reduce((sum, entry) => sum + entry.rating, 0) / last30Days.length
      : 3; // Default to neutral
    
    // Determine overall trend
    const overallTrend = this.calculateTrend(
      previousWeek.averageRating,
      currentWeek.averageRating
    );
    
    return {
      currentWeek,
      previousWeek,
      last30Days,
      monthlyAverage,
      overallTrend
    };
  }

  private calculateWeeklySummary(
    entries: MoodEntry[], 
    weekStart: Date, 
    weekEnd: Date
  ): WeeklyMoodSummary {
    const averageRating = entries.length > 0 
      ? entries.reduce((sum, entry) => sum + entry.rating, 0) / entries.length
      : 0;
    
    const moodLabel = this.getRatingLabel(Math.round(averageRating));
    
    // Calculate trend (simplified - could be enhanced)
    const trend: 'improving' | 'stable' | 'declining' = 
      averageRating > 3.5 ? 'improving' :
      averageRating < 2.5 ? 'declining' : 'stable';
    
    return {
      weekStart: weekStart.toISOString().split('T')[0],
      weekEnd: weekEnd.toISOString().split('T')[0],
      averageRating,
      totalEntries: entries.length,
      trend,
      moodLabel: entries.length > 0 ? moodLabel : 'No mood data'
    };
  }

  private calculateTrend(previousAvg: number, currentAvg: number): 'improving' | 'stable' | 'declining' {
    const difference = currentAvg - previousAvg;
    if (difference > 0.3) return 'improving';
    if (difference < -0.3) return 'declining';
    return 'stable';
  }

  private getWeekStart(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const monday = new Date(date.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  }

  private isDateInRange(dateString: string, start: Date, end: Date): boolean {
    const date = new Date(dateString);
    return date >= start && date <= end;
  }

  // Get chart data for mood over time visualization
  async getMoodChartData(days: number = 30): Promise<{
    labels: string[];
    datasets: [{
      data: number[];
      color: (opacity: number) => string;
      strokeWidth: number;
    }];
  }> {
    const entries = await this.getAllMoodEntries();
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Filter entries for the specified period
    const periodEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate && entryDate <= endDate;
    });
    
    // Group by week for cleaner visualization
    const weeklyData: { [key: string]: number[] } = {};
    
    periodEntries.forEach(entry => {
      const entryDate = new Date(entry.date);
      const weekStart = this.getWeekStart(new Date(entryDate));
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = [];
      }
      weeklyData[weekKey].push(entry.rating);
    });
    
    // Calculate weekly averages
    const labels: string[] = [];
    const data: number[] = [];
    
    const weeks = Object.keys(weeklyData).sort();
    weeks.slice(-8).forEach(weekKey => { // Last 8 weeks
      const weekEntries = weeklyData[weekKey];
      const average = weekEntries.reduce((sum, rating) => sum + rating, 0) / weekEntries.length;
      
      const weekDate = new Date(weekKey);
      const label = weekDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      
      labels.push(label);
      data.push(Math.round(average * 10) / 10); // Round to 1 decimal
    });
    
    return {
      labels,
      datasets: [{
        data,
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // Blue color
        strokeWidth: 3
      }]
    };
  }

  // Helper methods for UI
  getMoodEmoji(rating: number): string {
    return this.moodMap[rating as keyof typeof this.moodMap]?.emoji || '😐';
  }

  // Get smiley number for custom smiley images (1-5)
  getMoodSmiley(rating: number): 1 | 2 | 3 | 4 | 5 {
    return Math.max(1, Math.min(5, Math.round(rating))) as 1 | 2 | 3 | 4 | 5;
  }

  getRatingLabel(rating: number): string {
    return this.moodMap[rating as keyof typeof this.moodMap]?.label || 'Neutral';
  }

  getMoodColor(rating: number): string {
    return this.moodMap[rating as keyof typeof this.moodMap]?.color || '#eab308';
  }

  // Generate sample data for development/demo
  async generateSampleData(): Promise<void> {
    const entries: MoodEntry[] = [];
    const today = new Date();
    
    for (let i = 60; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate somewhat realistic mood pattern
      const baseRating = 3;
      const variation = (Math.random() - 0.5) * 2;
      const weekday = date.getDay();
      
      // Slight weekend boost
      const weekendBoost = (weekday === 0 || weekday === 6) ? 0.3 : 0;
      
      let rating = Math.round(baseRating + variation + weekendBoost);
      rating = Math.max(1, Math.min(5, rating)); // Clamp to 1-5
      
      // Don't add mood for every day to be more realistic
      if (Math.random() > 0.3) { // 70% chance of having mood entry
        entries.push({
          date: date.toISOString().split('T')[0],
          rating,
          note: i % 7 === 0 ? 'Weekly reflection' : undefined
        });
      }
    }
    
    await AsyncStorage.setItem(this.MOOD_KEY, JSON.stringify(entries));
  }
}

export const moodService = new MoodService();