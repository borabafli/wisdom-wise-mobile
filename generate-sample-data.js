/**
 * Direct sample data generation script
 * Run this to populate mood data for testing
 */

const generateDirectSampleData = () => {
  // Generate realistic 21-day mood tracking data
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

  const sampleData = [];

  // Generate data for the past 21 days with realistic patterns
  for (let dayOffset = 21; dayOffset >= 0; dayOffset--) {
    const currentDate = new Date(now);
    currentDate.setDate(now.getDate() - dayOffset);
    
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
      
      // Set realistic time of day
      const isEvening = session === 1 || Math.random() < 0.4;
      const hour = isEvening ? 18 + Math.floor(Math.random() * 4) : 9 + Math.floor(Math.random() * 6);
      const minute = Math.floor(Math.random() * 60);
      
      currentDate.setHours(hour, minute, 0, 0);
      
      // Randomly add notes (60% chance)
      const hasNotes = Math.random() < 0.6;
      const note = hasNotes ? notes[Math.floor(Math.random() * notes.length)] : undefined;
      
      sampleData.push({
        id: `sample-${dayOffset}-${session}-${Date.now()}`,
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

  console.log('Generated sample data:');
  console.log('Total entries:', sampleData.length);
  console.log('Date range:', sampleData[0]?.timestamp.split('T')[0], 'to', sampleData[sampleData.length-1]?.timestamp.split('T')[0]);
  console.log('Sample entries:', sampleData.slice(0, 3));
  
  return sampleData;
};

// Log the sample data structure so you can copy it
const data = generateDirectSampleData();
console.log('JSON data to add to AsyncStorage:');
console.log(JSON.stringify(data, null, 2));