/**
 * Exercise Priority System
 * Manages exercise recommendations based on completion status and user feedback
 */

export interface Exercise {
  id: string;
  type: string;
  name: string;
  duration: string;
  description: string;
  isCompleted: boolean;
  rating?: number; // 1-5 scale
  moodImprovement?: number; // 1-10 scale (before/after difference)
  iconSource: any;
}

export interface ExerciseProgress {
  [exerciseId: string]: {
    completed: boolean;
    completedCount: number;
    rating?: number;
    moodImprovement?: number;
    lastCompleted?: Date;
  };
}

// Core exercises with priority order
export const coreExercises: Exercise[] = [
  {
    id: 'tell-story',
    type: 'tell-your-story',
    name: 'Tell Your Story',
    duration: '15-25 min',
    description: 'Share your personal journey',
    isCompleted: false,
    iconSource: require('../../assets/images/8.jpeg'),
  },
  {
    id: 'goal-setting',
    type: 'goal-setting',
    name: 'Therapy Goal-Setting',
    duration: '20 min',
    description: 'Define your goals',
    isCompleted: false,
    iconSource: require('../../assets/images/10.jpeg'),
  },
  {
    id: 'vision-future',
    type: 'vision-of-future',
    name: 'Vision of the Future',
    duration: '20-30 min',
    description: 'Imagine your ideal future self',
    isCompleted: false,
    iconSource: require('../../assets/images/3.jpeg'),
  },
  {
    id: 'reframing-thoughts',
    type: 'automatic-thoughts',
    name: 'Reframing Thoughts',
    duration: '15 min',
    description: 'Transform negative thoughts',
    isCompleted: false,
    iconSource: require('../../assets/images/1.jpeg'),
  },
  {
    id: 'living-values',
    type: 'values-clarification',
    name: 'My Core Values',
    duration: '15 min',
    description: 'Align actions with core values',
    isCompleted: false,
    iconSource: require('../../assets/images/7.jpeg'),
  },
];

// Fallback exercises for when core exercises are completed
export const fallbackExercises: Exercise[] = [
  {
    id: 'mindfulness',
    type: 'morning-mindfulness',
    name: 'Morning Mindfulness',
    duration: '8 min',
    description: 'Start your day with gentle awareness',
    isCompleted: false,
    iconSource: require('../../assets/images/4.jpeg'),
  },
  {
    id: 'stress-relief',
    type: 'breathing',
    name: '4-7-8 Breathing',
    duration: '5 min',
    description: 'Reduce anxiety with proven breathing technique',
    isCompleted: false,
    iconSource: require('../../assets/images/2.jpeg'),
  },
  {
    id: 'gratitude',
    type: 'gratitude',
    name: 'Gratitude Practice',
    duration: '10 min',
    description: 'Build happiness through daily appreciation',
    isCompleted: false,
    iconSource: require('../../assets/images/5.jpeg'),
  },
];

/**
 * Calculate exercise priority score
 * @param exercise Exercise to evaluate
 * @param progress User's progress data
 * @returns Priority score (higher = more priority)
 */
export const calculateExercisePriority = (
  exercise: Exercise,
  progress: ExerciseProgress
): number => {
  const exerciseProgress = progress[exercise.id];
  
  // If never completed, highest priority
  if (!exerciseProgress || !exerciseProgress.completed) {
    return 1000; // High priority for uncompleted exercises
  }
  
  // For completed exercises, use rating and mood improvement (50:50 weight)
  const rating = exerciseProgress.rating || 0;
  const moodImprovement = exerciseProgress.moodImprovement || 0;
  
  // Normalize scores to 0-10 scale
  const ratingScore = (rating / 5) * 10; // Convert 1-5 to 0-10
  const moodScore = moodImprovement; // Already 0-10
  
  // 50:50 weighting
  const combinedScore = (ratingScore * 0.5) + (moodScore * 0.5);
  
  return combinedScore;
};

/**
 * Get top 3 exercises based on priority
 * @param progress User's progress data
 * @param hiddenIds Optional array of exercise IDs to exclude
 * @returns Array of top 3 exercises
 */
export const getTopExercises = (progress: ExerciseProgress, hiddenIds: string[] = []): Exercise[] => {
  // First, check for uncompleted core exercises (excluding hidden ones)
  const uncompletedCoreExercises = coreExercises.filter(exercise => {
    const exerciseProgress = progress[exercise.id];
    const isHidden = hiddenIds.includes(exercise.id);
    return !isHidden && (!exerciseProgress || !exerciseProgress.completed);
  });
  
  // If we have uncompleted core exercises, prioritize them
  if (uncompletedCoreExercises.length > 0) {
    const topUncompleted = uncompletedCoreExercises.slice(0, 3);
    // Fill remaining slots with highest-rated completed exercises if needed
    if (topUncompleted.length < 3) {
      const allExercises = [...coreExercises, ...fallbackExercises];
      const completedExercises = allExercises
        .filter(exercise => {
          const exerciseProgress = progress[exercise.id];
          const isHidden = hiddenIds.includes(exercise.id);
          return !isHidden && exerciseProgress && exerciseProgress.completed;
        })
        .map(exercise => ({
          ...exercise,
          priority: calculateExercisePriority(exercise, progress)
        }))
        .sort((a, b) => b.priority - a.priority);
      
      const needed = 3 - topUncompleted.length;
      const additionalExercises = completedExercises.slice(0, needed);
      
      return [...topUncompleted, ...additionalExercises];
    }
    
    return topUncompleted;
  }
  
  // All core exercises completed, use rating/mood system (excluding hidden ones)
  const allExercises = [...coreExercises, ...fallbackExercises];
  const scoredExercises = allExercises
    .filter(exercise => !hiddenIds.includes(exercise.id))
    .map(exercise => ({
      ...exercise,
      priority: calculateExercisePriority(exercise, progress)
    }))
    .sort((a, b) => b.priority - a.priority);
  
  return scoredExercises.slice(0, 3);
};

/**
 * Update exercise progress after completion
 */
export const updateExerciseProgress = (
  exerciseId: string,
  rating: number,
  moodBefore: number,
  moodAfter: number,
  currentProgress: ExerciseProgress
): ExerciseProgress => {
  const moodImprovement = Math.max(0, moodAfter - moodBefore);
  
  return {
    ...currentProgress,
    [exerciseId]: {
      completed: true,
      completedCount: (currentProgress[exerciseId]?.completedCount || 0) + 1,
      rating,
      moodImprovement,
      lastCompleted: new Date(),
    }
  };
};