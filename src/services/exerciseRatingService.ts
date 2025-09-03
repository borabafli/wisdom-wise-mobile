import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ExerciseRating {
  id: string;
  exerciseId: string;
  exerciseName: string;
  rating: number; // 1-5 scale
  timestamp: number;
  duration?: number; // in minutes
  category?: string;
}

export interface RatingInsights {
  averageRating: number;
  totalRatings: number;
  ratingsByCategory: { [category: string]: number };
  recentRatings: ExerciseRating[];
  topRatedExercises: Array<{ exerciseName: string; averageRating: number; count: number }>;
  ratingTrends: Array<{ date: string; averageRating: number }>;
}

const STORAGE_KEY = 'exercise_ratings';

class ExerciseRatingService {
  async saveRating(rating: Omit<ExerciseRating, 'id' | 'timestamp'>): Promise<void> {
    try {
      const newRating: ExerciseRating = {
        ...rating,
        id: `rating_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
      };

      const existingRatings = await this.getAllRatings();
      const updatedRatings = [...existingRatings, newRating];

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRatings));
      
      console.log('Exercise rating saved:', newRating);
    } catch (error) {
      console.error('Failed to save exercise rating:', error);
      throw error;
    }
  }

  async getAllRatings(): Promise<ExerciseRating[]> {
    try {
      const ratingsJson = await AsyncStorage.getItem(STORAGE_KEY);
      if (!ratingsJson) return [];

      const ratings: ExerciseRating[] = JSON.parse(ratingsJson);
      return ratings.sort((a, b) => b.timestamp - a.timestamp); // Most recent first
    } catch (error) {
      console.error('Failed to get exercise ratings:', error);
      return [];
    }
  }

  async getRatingsByExercise(exerciseId: string): Promise<ExerciseRating[]> {
    const allRatings = await this.getAllRatings();
    return allRatings.filter(rating => rating.exerciseId === exerciseId);
  }

  async getAverageRating(exerciseId?: string): Promise<number> {
    const ratings = exerciseId 
      ? await this.getRatingsByExercise(exerciseId)
      : await this.getAllRatings();

    if (ratings.length === 0) return 0;

    const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return Math.round((sum / ratings.length) * 10) / 10; // Round to 1 decimal place
  }

  async getRatingInsights(): Promise<RatingInsights> {
    try {
      const allRatings = await this.getAllRatings();
      
      if (allRatings.length === 0) {
        return {
          averageRating: 0,
          totalRatings: 0,
          ratingsByCategory: {},
          recentRatings: [],
          topRatedExercises: [],
          ratingTrends: [],
        };
      }

      // Calculate average rating
      const averageRating = await this.getAverageRating();

      // Group ratings by category
      const ratingsByCategory: { [category: string]: number[] } = {};
      allRatings.forEach(rating => {
        const category = rating.category || 'Uncategorized';
        if (!ratingsByCategory[category]) {
          ratingsByCategory[category] = [];
        }
        ratingsByCategory[category].push(rating.rating);
      });

      const categoryAverages: { [category: string]: number } = {};
      Object.keys(ratingsByCategory).forEach(category => {
        const ratings = ratingsByCategory[category];
        const avg = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
        categoryAverages[category] = Math.round(avg * 10) / 10;
      });

      // Get recent ratings (last 10)
      const recentRatings = allRatings.slice(0, 10);

      // Calculate top rated exercises
      const exerciseGroups: { [name: string]: ExerciseRating[] } = {};
      allRatings.forEach(rating => {
        if (!exerciseGroups[rating.exerciseName]) {
          exerciseGroups[rating.exerciseName] = [];
        }
        exerciseGroups[rating.exerciseName].push(rating);
      });

      const topRatedExercises = Object.keys(exerciseGroups)
        .map(exerciseName => {
          const ratings = exerciseGroups[exerciseName];
          const avg = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
          return {
            exerciseName,
            averageRating: Math.round(avg * 10) / 10,
            count: ratings.length,
          };
        })
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, 5);

      // Calculate rating trends (last 7 days)
      const now = Date.now();
      const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
      const recentRatingsForTrends = allRatings.filter(r => r.timestamp >= sevenDaysAgo);

      const dailyRatings: { [date: string]: number[] } = {};
      recentRatingsForTrends.forEach(rating => {
        const date = new Date(rating.timestamp).toISOString().split('T')[0];
        if (!dailyRatings[date]) {
          dailyRatings[date] = [];
        }
        dailyRatings[date].push(rating.rating);
      });

      const ratingTrends = Object.keys(dailyRatings)
        .map(date => ({
          date,
          averageRating: Math.round(
            (dailyRatings[date].reduce((sum, r) => sum + r, 0) / dailyRatings[date].length) * 10
          ) / 10,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      return {
        averageRating,
        totalRatings: allRatings.length,
        ratingsByCategory: categoryAverages,
        recentRatings,
        topRatedExercises,
        ratingTrends,
      };
    } catch (error) {
      console.error('Failed to get rating insights:', error);
      throw error;
    }
  }

  async clearAllRatings(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      console.log('All exercise ratings cleared');
    } catch (error) {
      console.error('Failed to clear ratings:', error);
      throw error;
    }
  }

  // Get rating summary for a specific time period
  async getRatingSummary(days: number = 30): Promise<{
    averageRating: number;
    totalSessions: number;
    mostHelpfulExercise: string | null;
    improvementTrend: 'improving' | 'declining' | 'stable';
  }> {
    try {
      const allRatings = await this.getAllRatings();
      const now = Date.now();
      const timeAgo = now - (days * 24 * 60 * 60 * 1000);
      const periodRatings = allRatings.filter(r => r.timestamp >= timeAgo);

      if (periodRatings.length === 0) {
        return {
          averageRating: 0,
          totalSessions: 0,
          mostHelpfulExercise: null,
          improvementTrend: 'stable',
        };
      }

      // Calculate average
      const averageRating = periodRatings.reduce((sum, r) => sum + r.rating, 0) / periodRatings.length;

      // Find most helpful exercise
      const exerciseRatings: { [name: string]: number[] } = {};
      periodRatings.forEach(rating => {
        if (!exerciseRatings[rating.exerciseName]) {
          exerciseRatings[rating.exerciseName] = [];
        }
        exerciseRatings[rating.exerciseName].push(rating.rating);
      });

      let mostHelpfulExercise: string | null = null;
      let highestAverage = 0;

      Object.keys(exerciseRatings).forEach(exerciseName => {
        const ratings = exerciseRatings[exerciseName];
        const avg = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
        if (avg > highestAverage) {
          highestAverage = avg;
          mostHelpfulExercise = exerciseName;
        }
      });

      // Calculate improvement trend
      let improvementTrend: 'improving' | 'declining' | 'stable' = 'stable';
      if (periodRatings.length >= 4) {
        const firstHalf = periodRatings.slice(Math.floor(periodRatings.length / 2));
        const secondHalf = periodRatings.slice(0, Math.floor(periodRatings.length / 2));
        
        const firstHalfAvg = firstHalf.reduce((sum, r) => sum + r.rating, 0) / firstHalf.length;
        const secondHalfAvg = secondHalf.reduce((sum, r) => sum + r.rating, 0) / secondHalf.length;
        
        const difference = secondHalfAvg - firstHalfAvg;
        if (difference > 0.3) {
          improvementTrend = 'improving';
        } else if (difference < -0.3) {
          improvementTrend = 'declining';
        }
      }

      return {
        averageRating: Math.round(averageRating * 10) / 10,
        totalSessions: periodRatings.length,
        mostHelpfulExercise,
        improvementTrend,
      };
    } catch (error) {
      console.error('Failed to get rating summary:', error);
      throw error;
    }
  }
}

export const exerciseRatingService = new ExerciseRatingService();