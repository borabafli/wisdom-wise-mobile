/**
 * Sample Mood Data Generator
 * Creates realistic mood data for testing and demo purposes
 */

import { moodRatingService, type MoodRating } from '../services/moodRatingService';

export const generateSampleMoodData = async (): Promise<boolean> => {
  try {
    const sampleData: Omit<MoodRating, 'id' | 'timestamp'>[] = [
      // This week's data
      {
        userId: 'demo-user',
        exerciseType: 'breathing',
        exerciseName: 'Box Breathing',
        moodRating: 4.2,
        helpfulnessRating: 4.5,
        sessionId: 'session-1',
        notes: 'Felt much calmer after the breathing exercise'
      },
      {
        userId: 'demo-user',
        exerciseType: 'meditation',
        exerciseName: 'Mindful Body Scan',
        moodRating: 3.8,
        helpfulnessRating: 4.0,
        sessionId: 'session-2'
      },
      {
        userId: 'demo-user',
        exerciseType: 'gratitude',
        exerciseName: 'Three Good Things',
        moodRating: 4.5,
        helpfulnessRating: 4.8,
        sessionId: 'session-3'
      },
      {
        userId: 'demo-user',
        exerciseType: 'breathing',
        exerciseName: 'Progressive Relaxation',
        moodRating: 3.9,
        helpfulnessRating: 4.2,
        sessionId: 'session-4'
      },
      {
        userId: 'demo-user',
        exerciseType: 'mindfulness',
        exerciseName: '5-4-3-2-1 Grounding',
        moodRating: 4.1,
        helpfulnessRating: 4.3,
        sessionId: 'session-5'
      }
    ];

    // Generate sequential timestamps over the past 7 days for better chart display
    const now = new Date();
    const timestamps: Date[] = [];
    
    // Create more realistic sequential data spread across recent days
    const daysToSpread = Math.min(7, sampleData.length);
    for (let i = 0; i < sampleData.length; i++) {
      const dayOffset = Math.floor((i / sampleData.length) * daysToSpread);
      const timestamp = new Date(now);
      timestamp.setDate(now.getDate() - (daysToSpread - 1 - dayOffset));
      
      // Add some random hours but keep it realistic (between 9 AM and 9 PM)
      const hour = 9 + Math.floor(Math.random() * 12);
      timestamp.setHours(hour, Math.floor(Math.random() * 60), 0, 0);
      
      timestamps.push(timestamp);
    }

    // Timestamps are already in chronological order

    // Create mood ratings with generated timestamps
    const moodRatings: MoodRating[] = sampleData.map((data, index) => ({
      ...data,
      id: `sample-${index + 1}`,
      timestamp: timestamps[index].toISOString()
    }));

    // Save all sample ratings
    for (const rating of moodRatings) {
      await moodRatingService.saveMoodRating(rating);
    }

    console.log('Sample mood data generated successfully:', moodRatings.length, 'entries');
    return true;
  } catch (error) {
    console.error('Error generating sample mood data:', error);
    return false;
  }
};

export const clearSampleData = async (): Promise<boolean> => {
  try {
    await moodRatingService.clearAllRatings();
    console.log('Sample mood data cleared');
    return true;
  } catch (error) {
    console.error('Error clearing sample data:', error);
    return false;
  }
};