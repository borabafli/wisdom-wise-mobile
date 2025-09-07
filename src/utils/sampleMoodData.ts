/**
 * Sample Mood Data Generator
 * Creates realistic mood data for testing and demo purposes
 */

import { moodRatingService, type MoodRating } from '../services/moodRatingService';
import { memoryService } from '../services/memoryService';

export const generateSampleMoodData = async (): Promise<boolean> => {
  try {
    // Clear existing data first to ensure clean generation
    await moodRatingService.clearAllRatings();
    console.log('🧹 Cleared existing mood data');
    
    // Generate a realistic 3-week journey of mood tracking data
    const now = new Date();
    const exercises = [
      'Box Breathing', 'Progressive Relaxation', '4-7-8 Breathing', 'Belly Breathing',
      'Mindful Body Scan', 'Loving-Kindness Meditation', 'Walking Meditation', 'Breathing Space',
      'Three Good Things', 'Gratitude Letter', 'Best Possible Self', 'Gratitude Journal',
      '5-4-3-2-1 Grounding', 'Mindful Listening', 'Present Moment Awareness', 'Body Awareness',
      'Thought Challenging', 'Reframing Exercise', 'Problem Solving', 'Worry Time'
    ];
    
    const exerciseTypes = ['breathing', 'meditation', 'gratitude', 'mindfulness', 'cognitive'];
    const notes = [
      'Felt much calmer after the exercise',
      'Really helped with my anxiety today',
      'Found it hard to focus at first but got better',
      'Perfect timing - was feeling stressed',
      'This is becoming a helpful habit',
      'Noticed my shoulders were tense, this helped',
      'Mind was racing but this slowed it down',
      'Felt more grounded after this exercise',
      'Good way to start/end the day',
      'Helped me gain perspective on my worries',
      'Feeling more optimistic now',
      'This reminded me of what I\'m grateful for'
    ];

    const sampleData: Omit<MoodRating, 'id' | 'timestamp'>[] = [];

    // Generate data for the past 21 days with realistic patterns
    for (let dayOffset = 21; dayOffset >= 0; dayOffset--) {
      // Skip some days randomly to simulate real usage patterns
      if (Math.random() < 0.25) continue; // 25% chance to skip a day
      
      // Some days have multiple sessions
      const sessionsToday = Math.random() < 0.3 ? 2 : 1;
      
      for (let session = 0; session < sessionsToday; session++) {
        // Create mood progression over time (gradual improvement)
        const progressFactor = (21 - dayOffset) / 21; // 0 to 1
        const baseMood = 2.5 + (progressFactor * 1.5); // 2.5 to 4.0 base progression
        
        // Add daily and weekly variance
        const weekProgress = Math.sin((dayOffset * Math.PI) / 3.5) * 0.4; // Weekly cycle
        const dailyVariance = (Math.random() - 0.5) * 0.8; // Random daily variance
        
        // Calculate final mood rating (2.0 to 5.0 range)
        let moodRating = Math.max(2.0, Math.min(5.0, baseMood + weekProgress + dailyVariance));
        moodRating = Math.round(moodRating * 10) / 10; // Round to 1 decimal
        
        // Helpfulness rating typically correlates with mood but with some variance
        let helpfulnessRating = moodRating + (Math.random() - 0.3) * 0.6;
        helpfulnessRating = Math.max(2.0, Math.min(5.0, helpfulnessRating));
        helpfulnessRating = Math.round(helpfulnessRating * 10) / 10;
        
        // Pick random exercise
        const exerciseIndex = Math.floor(Math.random() * exercises.length);
        const exerciseName = exercises[exerciseIndex];
        const exerciseType = exerciseTypes[Math.floor(exerciseIndex / 4)]; // Group exercises by type
        
        // Create a fresh date object for each entry (CRITICAL FIX)
        const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOffset);
        
        // Set realistic time of day
        const isEvening = session === 1 || Math.random() < 0.4;
        const hour = isEvening ? 18 + Math.floor(Math.random() * 4) : 9 + Math.floor(Math.random() * 6);
        const minute = Math.floor(Math.random() * 60);
        
        currentDate.setHours(hour, minute, 0, 0);
        
        // Randomly add notes (60% chance)
        const hasNotes = Math.random() < 0.6;
        const note = hasNotes ? notes[Math.floor(Math.random() * notes.length)] : undefined;
        
        sampleData.push({
          userId: 'demo-user',
          exerciseType,
          exerciseName,
          moodRating,
          helpfulnessRating,
          sessionId: `session-${dayOffset}-${session}`,
          notes: note,
          timestamp: currentDate.toISOString()
        });
      }
    }

    // Sort by timestamp to ensure chronological order
    sampleData.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    // Create mood ratings with proper IDs
    const moodRatings: MoodRating[] = sampleData.map((data, index) => ({
      ...data,
      id: `sample-${index + 1}`
    }));

    console.log('🔍 Sample data debug:');
    console.log('- Total entries to save:', moodRatings.length);
    console.log('- Date range:', moodRatings[0]?.timestamp, 'to', moodRatings[moodRatings.length-1]?.timestamp);
    console.log('- Sample entries:');
    moodRatings.slice(0, 5).forEach((rating, i) => {
      console.log(`  ${i+1}. ${rating.timestamp.split('T')[0]} - ${rating.moodRating} (${rating.exerciseName})`);
    });

    // Save all sample ratings
    for (const rating of moodRatings) {
      await moodRatingService.saveMoodRating(rating);
    }

    // Verify what was actually saved
    const savedRatings = await moodRatingService.getAllRatings();
    console.log('🔍 Verification after saving:');
    console.log('- Total saved ratings:', savedRatings.length);
    console.log('- Saved date range:', savedRatings[0]?.timestamp, 'to', savedRatings[savedRatings.length-1]?.timestamp);

    // Generate complementary session summaries for better insights
    await generateSampleSessionSummaries();

    console.log('Sample mood data generated successfully:', moodRatings.length, 'entries over 21 days');
    return true;
  } catch (error) {
    console.error('Error generating sample mood data:', error);
    return false;
  }
};

const generateSampleSessionSummaries = async (): Promise<void> => {
  const sessionSummaries = [
    {
      sessionId: 'session-demo-1',
      summary: 'Discussed work stress and learned box breathing technique. User expressed feeling overwhelmed with deadlines but found the breathing exercise helpful for immediate anxiety relief.',
      keyInsights: ['Work stress is primary concern', 'Breathing exercises show immediate benefit', 'User responds well to structured techniques'],
      moodBefore: 2.8,
      moodAfter: 4.1,
      exercisesCompleted: ['Box Breathing'],
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
    },
    {
      sessionId: 'session-demo-2',
      summary: 'Explored gratitude practice and discussed relationship challenges. User identified three things they were grateful for and noticed shift in perspective.',
      keyInsights: ['Gratitude practice creates positive mindset shift', 'Relationship concerns affecting mood', 'User benefits from perspective-taking exercises'],
      moodBefore: 3.2,
      moodAfter: 4.3,
      exercisesCompleted: ['Three Good Things', 'Gratitude Journal'],
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
    },
    {
      sessionId: 'session-demo-3',
      summary: 'Addressed sleep difficulties and anxiety loops. Introduced progressive muscle relaxation which user found very effective for pre-sleep routine.',
      keyInsights: ['Sleep anxiety is affecting daily mood', 'Physical relaxation techniques are highly effective', 'User needs consistent bedtime routine'],
      moodBefore: 3.0,
      moodAfter: 4.0,
      exercisesCompleted: ['Progressive Relaxation', 'Body Scan'],
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
    },
    {
      sessionId: 'session-demo-4',
      summary: 'Worked on thought challenging around perfectionism. User recognized all-or-nothing thinking patterns and practiced reframing negative self-talk.',
      keyInsights: ['Perfectionism is creating stress', 'All-or-nothing thinking patterns identified', 'Cognitive reframing shows promise'],
      moodBefore: 2.9,
      moodAfter: 3.8,
      exercisesCompleted: ['Thought Challenging', 'Reframing Exercise'],
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
    },
    {
      sessionId: 'session-demo-5',
      summary: 'Focused on mindfulness and present-moment awareness. User practiced 5-4-3-2-1 grounding technique and found it helpful for managing overwhelm.',
      keyInsights: ['Mindfulness helps with overwhelm', 'Grounding techniques are effective', 'User benefits from sensory-based exercises'],
      moodBefore: 3.1,
      moodAfter: 4.2,
      exercisesCompleted: ['5-4-3-2-1 Grounding', 'Mindful Listening'],
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days ago
    }
  ];

  // Save session summaries
  for (const summaryData of sessionSummaries) {
    const summary = {
      id: summaryData.sessionId + '_summary_' + Date.now(),
      text: summaryData.summary,
      date: summaryData.date,
      type: 'session' as const,
      messageCount: 10 // Approximate message count for sample data
    };
    await memoryService.saveSummary(summary);
  }

  console.log('Sample session summaries generated successfully:', sessionSummaries.length, 'entries');
};

export const clearSampleData = async (): Promise<boolean> => {
  try {
    await moodRatingService.clearAllRatings();
    // Clear session summaries too if the method exists
    try {
      const summaries = await memoryService.getSessionSummaries();
      for (const summary of summaries) {
        if (summary.sessionId.includes('demo')) {
          // Clear demo session summaries if there's a delete method
          console.log('Clearing demo session:', summary.sessionId);
        }
      }
    } catch (error) {
      console.log('Session summaries may not need clearing');
    }
    console.log('Sample mood data cleared');
    return true;
  } catch (error) {
    console.error('Error clearing sample data:', error);
    return false;
  }
};