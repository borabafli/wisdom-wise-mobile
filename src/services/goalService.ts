import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TherapyGoal {
  id: string;
  focusArea: string;
  customFocusArea?: string;
  mainGoal: string;
  practicalStep: string;
  motivation: string;
  timeline: 'short' | 'medium' | 'long';
  timelineText: string;
  createdDate: string;
  status: 'active' | 'completed' | 'paused' | 'archived';
  progress: number; // 0-100
  checkIns: GoalCheckIn[];
  linkedExercises: string[]; // Exercise IDs that support this goal
}

export interface GoalCheckIn {
  id: string;
  date: string;
  progressRating: number; // 1-5 scale
  reflection: string;
  challenges?: string;
  wins?: string;
  nextSteps?: string;
}

export interface GoalProgress {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  averageProgress: number;
  recentActivity: number; // Check-ins in last week
}

const STORAGE_KEYS = {
  GOALS: 'therapy_goals',
  GOAL_SETTINGS: 'goal_settings'
};

const FOCUS_AREAS = [
  {
    id: 'emotional',
    title: 'Emotional well-being',
    subtitle: 'anxiety, mood, self-esteem',
    examples: ['Feel calmer in social situations', 'Build confidence in daily tasks', 'Manage overwhelming emotions']
  },
  {
    id: 'relationships',
    title: 'Relationships',
    subtitle: 'friends, family, partner',
    examples: ['Communicate needs more clearly', 'Build deeper friendships', 'Set healthy boundaries']
  },
  {
    id: 'habits',
    title: 'Habits & lifestyle',
    subtitle: 'sleep, fitness, routines',
    examples: ['Establish consistent sleep schedule', 'Create morning routine', 'Practice self-care regularly']
  },
  {
    id: 'growth',
    title: 'Self-growth',
    subtitle: 'confidence, purpose, resilience',
    examples: ['Discover personal strengths', 'Build resilience to setbacks', 'Find sense of purpose']
  },
  {
    id: 'other',
    title: 'Other',
    subtitle: 'something else important to you',
    examples: []
  }
];

const TIMELINE_OPTIONS = [
  { id: 'short', label: '1-4 weeks', description: 'Quick wins and immediate changes' },
  { id: 'medium', label: '1-3 months', description: 'Building habits and steady progress' },
  { id: 'long', label: '6-12 months', description: 'Deep growth and lasting change' }
];

class GoalService {
  async saveGoal(goal: Omit<TherapyGoal, 'id' | 'createdDate' | 'status' | 'progress' | 'checkIns'>): Promise<TherapyGoal> {
    try {
      const newGoal: TherapyGoal = {
        ...goal,
        id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdDate: new Date().toISOString(),
        status: 'active',
        progress: 0,
        checkIns: [],
        linkedExercises: this.getLinkableExercises(goal.focusArea)
      };

      const existingGoals = await this.getAllGoals();
      const updatedGoals = [...existingGoals, newGoal];

      await AsyncStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(updatedGoals));
      
      console.log('Therapy goal saved:', newGoal);
      return newGoal;
    } catch (error) {
      console.error('Failed to save therapy goal:', error);
      throw error;
    }
  }

  async getAllGoals(): Promise<TherapyGoal[]> {
    try {
      const goalsJson = await AsyncStorage.getItem(STORAGE_KEYS.GOALS);
      if (!goalsJson) return [];

      const goals: TherapyGoal[] = JSON.parse(goalsJson);
      return goals.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    } catch (error) {
      console.error('Failed to get therapy goals:', error);
      return [];
    }
  }

  async getActiveGoals(): Promise<TherapyGoal[]> {
    const allGoals = await this.getAllGoals();
    return allGoals.filter(goal => goal.status === 'active');
  }

  async getGoal(goalId: string): Promise<TherapyGoal | null> {
    const allGoals = await this.getAllGoals();
    return allGoals.find(goal => goal.id === goalId) || null;
  }

  async updateGoal(goalId: string, updates: Partial<TherapyGoal>): Promise<void> {
    try {
      const allGoals = await this.getAllGoals();
      const updatedGoals = allGoals.map(goal => 
        goal.id === goalId ? { ...goal, ...updates } : goal
      );

      await AsyncStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(updatedGoals));
    } catch (error) {
      console.error('Failed to update goal:', error);
      throw error;
    }
  }

  async addCheckIn(goalId: string, checkIn: Omit<GoalCheckIn, 'id' | 'date'>): Promise<void> {
    try {
      const goal = await this.getGoal(goalId);
      if (!goal) throw new Error('Goal not found');

      const newCheckIn: GoalCheckIn = {
        ...checkIn,
        id: `checkin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        date: new Date().toISOString()
      };

      // Update progress based on check-in rating
      const newProgress = Math.min(100, goal.progress + (checkIn.progressRating * 5));

      const updatedGoal: TherapyGoal = {
        ...goal,
        checkIns: [newCheckIn, ...goal.checkIns],
        progress: newProgress,
        status: newProgress >= 100 ? 'completed' : goal.status
      };

      await this.updateGoal(goalId, updatedGoal);
    } catch (error) {
      console.error('Failed to add check-in:', error);
      throw error;
    }
  }

  async getGoalProgress(): Promise<GoalProgress> {
    try {
      const allGoals = await this.getAllGoals();
      
      const totalGoals = allGoals.length;
      const activeGoals = allGoals.filter(g => g.status === 'active').length;
      const completedGoals = allGoals.filter(g => g.status === 'completed').length;
      
      const averageProgress = totalGoals > 0 
        ? allGoals.reduce((sum, goal) => sum + goal.progress, 0) / totalGoals
        : 0;

      // Count recent check-ins (last 7 days)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const recentActivity = allGoals.reduce((count, goal) => {
        return count + goal.checkIns.filter(checkIn => 
          new Date(checkIn.date) > oneWeekAgo
        ).length;
      }, 0);

      return {
        totalGoals,
        activeGoals,
        completedGoals,
        averageProgress: Math.round(averageProgress),
        recentActivity
      };
    } catch (error) {
      console.error('Failed to get goal progress:', error);
      return {
        totalGoals: 0,
        activeGoals: 0,
        completedGoals: 0,
        averageProgress: 0,
        recentActivity: 0
      };
    }
  }

  async getGoalsNeedingCheckIn(): Promise<TherapyGoal[]> {
    try {
      const activeGoals = await this.getActiveGoals();
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      return activeGoals.filter(goal => {
        const lastCheckIn = goal.checkIns[0];
        return !lastCheckIn || new Date(lastCheckIn.date) < threeDaysAgo;
      });
    } catch (error) {
      console.error('Failed to get goals needing check-in:', error);
      return [];
    }
  }

  private getLinkableExercises(focusArea: string): string[] {
    const exerciseMapping: { [key: string]: string[] } = {
      'emotional': ['breathing', 'mindfulness', 'body-scan', 'grounding', 'thought-challenging'],
      'relationships': ['communication', 'boundary-setting', 'empathy', 'conflict-resolution'],
      'habits': ['habit-tracking', 'routine-building', 'sleep-hygiene', 'energy-management'],
      'growth': ['strengths', 'values-clarification', 'goal-setting', 'self-compassion'],
      'other': ['journaling', 'reflection', 'mindfulness']
    };

    return exerciseMapping[focusArea] || exerciseMapping['other'];
  }

  getFocusAreas() {
    return FOCUS_AREAS;
  }

  getTimelineOptions() {
    return TIMELINE_OPTIONS;
  }

  async clearAllGoals(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.GOALS);
      console.log('All therapy goals cleared');
    } catch (error) {
      console.error('Failed to clear goals:', error);
      throw error;
    }
  }

  /**
   * Delete all goals (alias for clearAllGoals)
   * Used by dataManagementService for bulk deletion
   */
  async deleteAllGoals(): Promise<void> {
    return this.clearAllGoals();
  }

  // Generate AI-friendly goal suggestions based on focus area
  getGoalSuggestions(focusArea: string): string[] {
    const suggestions: { [key: string]: string[] } = {
      'emotional': [
        'I want to feel calmer during stressful situations',
        'I want to build confidence in my daily decisions',
        'I want to better manage overwhelming emotions',
        'I want to develop a kinder inner voice'
      ],
      'relationships': [
        'I want to communicate my needs more clearly',
        'I want to build deeper, more meaningful friendships',
        'I want to set healthy boundaries with others',
        'I want to resolve conflicts more peacefully'
      ],
      'habits': [
        'I want to establish a consistent sleep schedule',
        'I want to create a nurturing morning routine',
        'I want to practice self-care regularly',
        'I want to build healthy daily habits'
      ],
      'growth': [
        'I want to discover and use my personal strengths',
        'I want to build resilience to life\'s setbacks',
        'I want to find a sense of purpose and meaning',
        'I want to develop greater self-awareness'
      ]
    };

    return suggestions[focusArea] || suggestions['emotional'];
  }

  // Generate practical step suggestions
  getPracticalStepSuggestions(mainGoal: string, focusArea: string): string[] {
    const baseSteps: { [key: string]: string[] } = {
      'emotional': [
        'Practice 5 minutes of deep breathing daily',
        'Write down 3 things I\'m grateful for each evening',
        'Notice and name my emotions when they arise',
        'Use a calming phrase when feeling overwhelmed'
      ],
      'relationships': [
        'Reach out to one friend or family member each week',
        'Practice active listening in one conversation daily',
        'Express one genuine compliment to someone each day',
        'Set one small boundary this week'
      ],
      'habits': [
        'Go to bed 15 minutes earlier each night',
        'Do one small self-care activity daily',
        'Set a consistent wake-up time',
        'Create a 10-minute evening wind-down routine'
      ],
      'growth': [
        'Journal for 10 minutes three times this week',
        'Identify one personal strength each day',
        'Try one new thing outside my comfort zone',
        'Reflect on my values for 5 minutes weekly'
      ]
    };

    return baseSteps[focusArea] || baseSteps['emotional'];
  }
}

export const goalService = new GoalService();
export { FOCUS_AREAS, TIMELINE_OPTIONS };