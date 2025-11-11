/**
 * Data Management Service
 *
 * Handles comprehensive user data deletion across all services and storage.
 * This service provides functionality to completely clear all user-generated data
 * including insights, chat history, mood data, exercises, and preferences.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { storageService } from './storageService';
import { moodRatingService } from './moodRatingService';
import { goalService } from './goalService';
import { valuesService } from './valuesService';
import { visionInsightsService } from './visionInsightsService';
import { thinkingPatternsService } from './thinkingPatternsService';
import { memoryService } from './memoryService';
import { exerciseRatingService } from './exerciseRatingService';
import { ExerciseCompletionService } from './exerciseCompletionService';
import streakService from './streakService';
import { journalStorageService } from './journalStorageService';
import { cardHidingService } from './cardHidingService';
import { storyReflectionService } from './storyReflectionService';

export interface DataDeletionResult {
  success: boolean;
  deletedItems: {
    chatSessions: number;
    thoughtPatterns: number;
    moodRatings: number;
    goals: number;
    values: number;
    visionInsights: number;
    memoryInsights: number;
    exerciseRatings: number;
    completedExercises: number;
    journalEntries: number;
    otherData: number;
  };
  errors: string[];
}

class DataManagementService {
  /**
   * Delete all user data with detailed tracking
   * This is a comprehensive deletion that removes all traces of user activity
   */
  async deleteAllUserData(): Promise<DataDeletionResult> {
    const result: DataDeletionResult = {
      success: true,
      deletedItems: {
        chatSessions: 0,
        thoughtPatterns: 0,
        moodRatings: 0,
        goals: 0,
        values: 0,
        visionInsights: 0,
        memoryInsights: 0,
        exerciseRatings: 0,
        completedExercises: 0,
        journalEntries: 0,
        otherData: 0
      },
      errors: []
    };

    try {
      // 1. Chat History & Sessions
      try {
        const chatHistory = await storageService.getChatHistory();
        result.deletedItems.chatSessions = chatHistory.length;
        await storageService.clearChatHistory();
      } catch (error) {
        result.errors.push('Failed to delete chat history');
        console.error('Error deleting chat history:', error);
      }

      // 2. Thought Patterns (Distorted Thoughts)
      try {
        const patterns = await storageService.getThoughtPatterns();
        result.deletedItems.thoughtPatterns = patterns.length;
        await storageService.clearAllThoughtPatterns();
      } catch (error) {
        result.errors.push('Failed to delete thought patterns');
        console.error('Error deleting thought patterns:', error);
      }

      // 3. Thinking Pattern Reflections
      try {
        await thinkingPatternsService.deleteAllReflections();
      } catch (error) {
        result.errors.push('Failed to delete thinking pattern reflections');
        console.error('Error deleting thinking pattern reflections:', error);
      }

      // 4. Mood Ratings & Insights
      try {
        const ratings = await moodRatingService.getAllRatings();
        result.deletedItems.moodRatings = ratings.length;
        await moodRatingService.clearAllRatings();
      } catch (error) {
        result.errors.push('Failed to delete mood ratings');
        console.error('Error deleting mood ratings:', error);
      }

      // 5. Therapy Goals
      try {
        const goals = await goalService.getAllGoals();
        result.deletedItems.goals = goals.length;
        await goalService.deleteAllGoals();
      } catch (error) {
        result.errors.push('Failed to delete therapy goals');
        console.error('Error deleting therapy goals:', error);
      }

      // 6. Values & Reflections
      try {
        const values = await valuesService.getAllValues();
        result.deletedItems.values = values.length;
        await valuesService.deleteAllValues();
        await valuesService.deleteAllReflections();
      } catch (error) {
        result.errors.push('Failed to delete values');
        console.error('Error deleting values:', error);
      }

      // 7. Vision Insights
      try {
        const visions = await visionInsightsService.getAllVisionInsights();
        result.deletedItems.visionInsights = visions.length;
        await visionInsightsService.deleteAllVisionInsights();
      } catch (error) {
        result.errors.push('Failed to delete vision insights');
        console.error('Error deleting vision insights:', error);
      }

      // 8. Memory Insights & Summaries
      try {
        const insights = await memoryService.getInsights();
        result.deletedItems.memoryInsights = insights.length;
        await memoryService.clearAllInsights();
        await memoryService.clearAllSummaries();
      } catch (error) {
        result.errors.push('Failed to delete memory insights');
        console.error('Error deleting memory insights:', error);
      }

      // 9. Exercise Ratings
      try {
        const ratings = await exerciseRatingService.getAllRatings();
        result.deletedItems.exerciseRatings = ratings.length;
        await exerciseRatingService.clearAllRatings();
      } catch (error) {
        result.errors.push('Failed to delete exercise ratings');
        console.error('Error deleting exercise ratings:', error);
      }

      // 10. Completed Exercises
      try {
        const completedExercises = await ExerciseCompletionService.getAllCompletedExercisesInfo();
        result.deletedItems.completedExercises = completedExercises.length;
        await ExerciseCompletionService.clearAllCompletions();
      } catch (error) {
        result.errors.push('Failed to delete completed exercises');
        console.error('Error deleting completed exercises:', error);
      }

      // 11. Journal Entries
      try {
        const entries = await journalStorageService.getAllJournalEntries();
        result.deletedItems.journalEntries = entries.length;
        await journalStorageService.deleteAllEntries();
      } catch (error) {
        result.errors.push('Failed to delete journal entries');
        console.error('Error deleting journal entries:', error);
      }

      // 12. Story Reflections
      try {
        await storyReflectionService.deleteAllReflections();
        result.deletedItems.otherData += 1;
      } catch (error) {
        result.errors.push('Failed to delete story reflections');
        console.error('Error deleting story reflections:', error);
      }

      // 13. Hidden Cards
      try {
        await cardHidingService.clearAllHiddenCards();
        result.deletedItems.otherData += 1;
      } catch (error) {
        result.errors.push('Failed to delete hidden cards');
        console.error('Error deleting hidden cards:', error);
      }

      // 14. Streak Data
      try {
        await streakService.resetStreak();
        result.deletedItems.otherData += 1;
      } catch (error) {
        result.errors.push('Failed to reset streak');
        console.error('Error resetting streak:', error);
      }

      // 15. Session Insights Storage
      try {
        await storageService.clearAllSessionInsights();
        result.deletedItems.otherData += 1;
      } catch (error) {
        result.errors.push('Failed to delete session insights');
        console.error('Error deleting session insights:', error);
      }

      // Determine overall success
      result.success = result.errors.length === 0;

      return result;
    } catch (error) {
      console.error('Critical error in deleteAllUserData:', error);
      result.success = false;
      result.errors.push('Critical failure during data deletion');
      return result;
    }
  }

  /**
   * Get a summary of how much data exists before deletion
   * Useful for showing users what will be deleted
   */
  async getDataSummary(): Promise<{
    chatSessions: number;
    thoughtPatterns: number;
    moodRatings: number;
    goals: number;
    values: number;
    visionInsights: number;
    memoryInsights: number;
    exerciseRatings: number;
    completedExercises: number;
    journalEntries: number;
    totalItems: number;
  }> {
    try {
      const [
        chatHistory,
        patterns,
        ratings,
        goals,
        values,
        visions,
        insights,
        exerciseRatings,
        completedExercises,
        journalEntries
      ] = await Promise.all([
        storageService.getChatHistory().catch(() => []),
        storageService.getThoughtPatterns().catch(() => []),
        moodRatingService.getAllRatings().catch(() => []),
        goalService.getAllGoals().catch(() => []),
        valuesService.getAllValues().catch(() => []),
        visionInsightsService.getAllVisionInsights().catch(() => []),
        memoryService.getInsights().catch(() => []),
        exerciseRatingService.getAllRatings().catch(() => []),
        ExerciseCompletionService.getAllCompletedExercisesInfo().catch(() => []),
        journalStorageService.getAllJournalEntries().catch(() => [])
      ]);

      const summary = {
        chatSessions: chatHistory.length,
        thoughtPatterns: patterns.length,
        moodRatings: ratings.length,
        goals: goals.length,
        values: values.length,
        visionInsights: visions.length,
        memoryInsights: insights.length,
        exerciseRatings: exerciseRatings.length,
        completedExercises: completedExercises.length,
        journalEntries: journalEntries.length,
        totalItems: 0
      };

      summary.totalItems = Object.values(summary).reduce((sum, val) => sum + val, 0) - summary.totalItems;

      return summary;
    } catch (error) {
      console.error('Error getting data summary:', error);
      return {
        chatSessions: 0,
        thoughtPatterns: 0,
        moodRatings: 0,
        goals: 0,
        values: 0,
        visionInsights: 0,
        memoryInsights: 0,
        exerciseRatings: 0,
        completedExercises: 0,
        journalEntries: 0,
        totalItems: 0
      };
    }
  }
}

export const dataManagementService = new DataManagementService();
