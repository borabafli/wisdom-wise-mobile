import AsyncStorage from '@react-native-async-storage/async-storage';
import { PostHog } from 'posthog-react-native';

const COMPLETED_EXERCISES_KEY = 'completed_exercises';

// Store PostHog instance for tracking
let posthogInstance: PostHog | null = null;

export interface CompletedExercise {
  exerciseId: string;
  completedAt: number; // timestamp
  expiresAt: number; // timestamp (24 hours later)
}

export class ExerciseCompletionService {
  // Initialize PostHog instance (call this from App.tsx)
  static initializeAnalytics(posthog: PostHog | null): void {
    posthogInstance = posthog;
  }

  private static async getCompletedExercises(): Promise<CompletedExercise[]> {
    try {
      const completedExercisesJson = await AsyncStorage.getItem(COMPLETED_EXERCISES_KEY);
      if (!completedExercisesJson) return [];

      const completedExercises: CompletedExercise[] = JSON.parse(completedExercisesJson);

      // Clean up expired completions (older than 24 hours)
      const now = Date.now();
      const validCompletions = completedExercises.filter(exercise => {
        return now < exercise.expiresAt;
      });

      // Save cleaned up list back to storage if any completions were removed
      if (validCompletions.length !== completedExercises.length) {
        await this.saveCompletedExercises(validCompletions);
      }

      return validCompletions;
    } catch (error) {
      console.error('Error getting completed exercises:', error);
      return [];
    }
  }

  private static async saveCompletedExercises(completedExercises: CompletedExercise[]): Promise<void> {
    try {
      await AsyncStorage.setItem(COMPLETED_EXERCISES_KEY, JSON.stringify(completedExercises));
    } catch (error) {
      console.error('Error saving completed exercises:', error);
    }
  }

  static async markExerciseCompleted(exerciseId: string, exerciseName?: string, duration?: number): Promise<void> {
    try {
      const completedExercises = await this.getCompletedExercises();

      // Remove existing completion for this exercise if it exists
      const filteredExercises = completedExercises.filter(exercise => exercise.exerciseId !== exerciseId);

      const now = Date.now();
      const oneDayInMs = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      const newCompletion: CompletedExercise = {
        exerciseId,
        completedAt: now,
        expiresAt: now + oneDayInMs,
      };

      filteredExercises.push(newCompletion);
      await this.saveCompletedExercises(filteredExercises);

      // 🎯 Track exercise completion in PostHog
      posthogInstance?.capture('exercise_completed', {
        exerciseId,
        exerciseName: exerciseName || exerciseId,
        duration: duration || 0,
        completedAt: new Date().toISOString(),
      });

      console.log('[Analytics] Exercise completed tracked:', exerciseId);
    } catch (error) {
      console.error('Error marking exercise as completed:', error);
    }
  }

  static async isExerciseCompleted(exerciseId: string): Promise<boolean> {
    try {
      const completedExercises = await this.getCompletedExercises();
      return completedExercises.some(exercise => exercise.exerciseId === exerciseId);
    } catch (error) {
      console.error('Error checking if exercise is completed:', error);
      return false;
    }
  }

  static async getCompletedExerciseIds(): Promise<string[]> {
    try {
      const completedExercises = await this.getCompletedExercises();
      return completedExercises.map(exercise => exercise.exerciseId);
    } catch (error) {
      console.error('Error getting completed exercise IDs:', error);
      return [];
    }
  }

  static async removeCompletion(exerciseId: string): Promise<void> {
    try {
      const completedExercises = await this.getCompletedExercises();
      const filteredExercises = completedExercises.filter(exercise => exercise.exerciseId !== exerciseId);
      await this.saveCompletedExercises(filteredExercises);
    } catch (error) {
      console.error('Error removing exercise completion:', error);
    }
  }

  static async clearAllCompletions(): Promise<void> {
    try {
      await AsyncStorage.removeItem(COMPLETED_EXERCISES_KEY);
    } catch (error) {
      console.error('Error clearing completed exercises:', error);
    }
  }

  // Debug method to get all completed exercises with their info
  static async getAllCompletedExercisesInfo(): Promise<CompletedExercise[]> {
    return this.getCompletedExercises();
  }

  // 🎯 Track when user abandons an exercise (exits without completing)
  static trackExerciseAbandoned(exerciseId: string, exerciseName?: string, timeSpent?: number, reason?: string): void {
    try {
      posthogInstance?.capture('exercise_abandoned', {
        exerciseId,
        exerciseName: exerciseName || exerciseId,
        timeSpent: timeSpent || 0,
        reason: reason || 'unknown',
        abandonedAt: new Date().toISOString(),
      });

      console.log('[Analytics] Exercise abandoned tracked:', exerciseId);
    } catch (error) {
      console.error('Error tracking exercise abandonment:', error);
    }
  }
}