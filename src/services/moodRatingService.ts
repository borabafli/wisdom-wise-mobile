import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MoodRating {
  id: string;
  userId?: string;
  exerciseType: string;
  exerciseName: string;
  moodRating: number; // 0-5 scale
  helpfulnessRating?: number; // 0-5 scale
  sessionId?: string;
  notes?: string;
  stage?: 'pre' | 'post' | 'baseline';
  timestamp: string;
}

export interface MoodStats {
  averageMoodRating: number;
  averageHelpfulnessRating: number;
  totalRatings: number;
  exerciseEffectiveness: { [exerciseType: string]: { avgMood: number; avgHelpfulness: number; count: number } };
  moodTrend: { date: string; rating: number }[];
}

class MoodRatingService {
  private readonly STORAGE_KEY = 'wisdom_wise_mood_ratings';

  async saveMoodRating(rating: MoodRating): Promise<boolean> {
    try {
      const existingRatings = await this.getAllRatings();
      const newRating: MoodRating = {
        ...rating,
        id: rating.id || Date.now().toString(),
        timestamp: rating.timestamp || new Date().toISOString(),
      };
      
      const updatedRatings = [...existingRatings, newRating];
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedRatings));
      
      console.log('Mood rating saved:', newRating);
      return true;
    } catch (error) {
      console.error('Error saving mood rating:', error);
      return false;
    }
  }

  async getAllRatings(): Promise<MoodRating[]> {
    try {
      const ratingsJson = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (!ratingsJson) return [];
      
      return JSON.parse(ratingsJson) as MoodRating[];
    } catch (error) {
      console.error('Error retrieving mood ratings:', error);
      return [];
    }
  }

  async getRatingsByExerciseType(exerciseType: string): Promise<MoodRating[]> {
    try {
      const allRatings = await this.getAllRatings();
      return allRatings.filter(rating => rating.exerciseType === exerciseType);
    } catch (error) {
      console.error('Error getting ratings by exercise type:', error);
      return [];
    }
  }

  async getRecentRatings(limit: number = 10): Promise<MoodRating[]> {
    try {
      const allRatings = await this.getAllRatings();
      return allRatings
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting recent ratings:', error);
      return [];
    }
  }

  async getMoodStats(dateRange?: { from: Date; to: Date }): Promise<MoodStats> {
    try {
      let allRatings = await this.getAllRatings();
      
      // Filter by date range if provided
      if (dateRange) {
        allRatings = allRatings.filter(rating => {
          const ratingDate = new Date(rating.timestamp);
          return ratingDate >= dateRange.from && ratingDate <= dateRange.to;
        });
      }

      if (allRatings.length === 0) {
        return {
          averageMoodRating: 0,
          averageHelpfulnessRating: 0,
          totalRatings: 0,
          exerciseEffectiveness: {},
          moodTrend: [],
        };
      }

      // Calculate averages
      const totalMoodRating = allRatings.reduce((sum, rating) => sum + rating.moodRating, 0);
      const helpfulnessRatings = allRatings.filter(rating => rating.helpfulnessRating !== undefined);
      const totalHelpfulnessRating = helpfulnessRatings.reduce((sum, rating) => sum + (rating.helpfulnessRating || 0), 0);

      // Calculate exercise effectiveness
      const exerciseGroups: { [key: string]: MoodRating[] } = {};
      allRatings.forEach(rating => {
        if (!exerciseGroups[rating.exerciseType]) {
          exerciseGroups[rating.exerciseType] = [];
        }
        exerciseGroups[rating.exerciseType].push(rating);
      });

      const exerciseEffectiveness: { [exerciseType: string]: { avgMood: number; avgHelpfulness: number; count: number } } = {};
      Object.keys(exerciseGroups).forEach(exerciseType => {
        const ratings = exerciseGroups[exerciseType];
        const avgMood = ratings.reduce((sum, rating) => sum + rating.moodRating, 0) / ratings.length;
        const helpfulnessRatingsForExercise = ratings.filter(rating => rating.helpfulnessRating !== undefined);
        const avgHelpfulness = helpfulnessRatingsForExercise.length > 0 
          ? helpfulnessRatingsForExercise.reduce((sum, rating) => sum + (rating.helpfulnessRating || 0), 0) / helpfulnessRatingsForExercise.length
          : 0;
        
        exerciseEffectiveness[exerciseType] = {
          avgMood,
          avgHelpfulness,
          count: ratings.length,
        };
      });

      // Calculate mood trend (last 30 days, grouped by day)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentRatings = allRatings.filter(rating => 
        new Date(rating.timestamp) >= thirtyDaysAgo
      );

      const dailyMoodMap: { [date: string]: number[] } = {};
      recentRatings.forEach(rating => {
        const date = new Date(rating.timestamp).toISOString().split('T')[0];
        if (!dailyMoodMap[date]) {
          dailyMoodMap[date] = [];
        }
        dailyMoodMap[date].push(rating.moodRating);
      });

      const moodTrend = Object.keys(dailyMoodMap).map(date => ({
        date,
        rating: dailyMoodMap[date].reduce((sum, rating) => sum + rating, 0) / dailyMoodMap[date].length,
      })).sort((a, b) => a.date.localeCompare(b.date));

      return {
        averageMoodRating: totalMoodRating / allRatings.length,
        averageHelpfulnessRating: helpfulnessRatings.length > 0 ? totalHelpfulnessRating / helpfulnessRatings.length : 0,
        totalRatings: allRatings.length,
        exerciseEffectiveness,
        moodTrend,
      };
    } catch (error) {
      console.error('Error calculating mood stats:', error);
      return {
        averageMoodRating: 0,
        averageHelpfulnessRating: 0,
        totalRatings: 0,
        exerciseEffectiveness: {},
        moodTrend: [],
      };
    }
  }

  async getMostEffectiveExercises(limit: number = 5): Promise<Array<{ exerciseType: string; effectiveness: number; count: number }>> {
    try {
      const stats = await this.getMoodStats();
      
      return Object.entries(stats.exerciseEffectiveness)
        .map(([exerciseType, data]) => ({
          exerciseType,
          effectiveness: (data.avgMood + data.avgHelpfulness) / 2, // Combined effectiveness score
          count: data.count,
        }))
        .sort((a, b) => b.effectiveness - a.effectiveness)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting most effective exercises:', error);
      return [];
    }
  }

  async clearAllRatings(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEY);
      console.log('All mood ratings cleared');
      return true;
    } catch (error) {
      console.error('Error clearing mood ratings:', error);
      return false;
    }
  }
}

export const moodRatingService = new MoodRatingService();