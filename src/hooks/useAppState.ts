import { useState, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import { usePostHog } from 'posthog-react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { Exercise, ButtonPosition } from '../types';
import streakService from '../services/streakService';
import { navigationBarConfigs } from '../hooks/useNavigationBarStyle';
import { firstActionTracker } from '../services/firstActionTracker';
import { getExercisesArray } from '../data/exerciseLibrary';

type TFunction = (key: string) => string;

/**
 * Custom hook for managing app-level state
 */
export const useAppState = (t: TFunction) => {
  const posthog = usePostHog();
  const [showChat, setShowChat] = useState<boolean>(false);
  const [showBreathing, setShowBreathing] = useState<boolean>(false);
  const [showTherapyGoals, setShowTherapyGoals] = useState<boolean>(false);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [breathingExercise, setBreathingExercise] = useState<Exercise | null>(null);
  const [chatWithActionPalette, setChatWithActionPalette] = useState<boolean>(false);
  const [initialChatMessage, setInitialChatMessage] = useState<string | null>(null);
  const [buttonPosition, setButtonPosition] = useState<ButtonPosition | null>(null);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [hasCheckedInToday, setHasCheckedInToday] = useState<boolean>(false);

  const handleStartSession = useCallback(async (params: Exercise | ButtonPosition | null = null) => {
    console.log('=== START SESSION ===');
    console.log('Params passed to session:', params);

    // 🎯 Track first action - chat session started
    await firstActionTracker.trackFirstAction('chat_session_started', {
      hasExercise: !!(params && !('x' in params)),
      exerciseType: (params && !('x' in params) && 'type' in params) ? (params as Exercise).type : undefined,
    });

    // Record check-in if not already done today
    if (!hasCheckedInToday) {
      const newStreak = await streakService.recordCheckIn();
      setCurrentStreak(newStreak);
      setHasCheckedInToday(true);
    }

    // Check if params is a ButtonPosition (has x, y, width, height)
    if (params && 'x' in params && 'y' in params) {
      setButtonPosition(params as ButtonPosition);
      setCurrentExercise(null);
    } else {
      // It's an Exercise
      setCurrentExercise(params as Exercise | null);
      setButtonPosition(null);
    }

    setShowChat(true);
    console.log('Session state updated - should show chat');
  }, [hasCheckedInToday]);

  const handleNewSession = useCallback(() => {
    setShowChat(true);
    setChatWithActionPalette(true);
  }, []);

  const handleStartChatWithContext = useCallback((context: string) => {
    console.log('=== START CHAT WITH CONTEXT ===');
    console.log('Context:', context);
    setInitialChatMessage(context);
    setShowChat(true);
  }, []);

  const handleBackFromChat = useCallback(async (wasCompleted: boolean = false, exerciseData?: { exerciseId: string; exerciseName: string; timeSpent?: number }) => {
    console.log('handleBackFromChat called - starting cleanup');

    // 🎯 Track exercise abandonment if user is leaving an exercise without completing
    if (currentExercise && !wasCompleted && exerciseData) {
      const { ExerciseCompletionService } = await import('../services/exerciseCompletionService');
      ExerciseCompletionService.trackExerciseAbandoned(
        exerciseData.exerciseId,
        exerciseData.exerciseName,
        exerciseData.timeSpent,
        'back_button'
      );
    }

    // Immediately reset navigation bar color (before animation)
    if (Platform.OS === 'android') {
      try {
        await NavigationBar.setBackgroundColorAsync(navigationBarConfigs.homeScreen.backgroundColor);
        await NavigationBar.setButtonStyleAsync(navigationBarConfigs.homeScreen.style === 'light' ? 'dark' : 'light');
      } catch (error) {
        console.warn('Failed to reset navigation bar:', error);
      }
    }

    setShowChat(false);
    setChatWithActionPalette(false);
    setCurrentExercise(null);
    setInitialChatMessage(null);
    setButtonPosition(null); // Clear button position

    console.log('handleBackFromChat completed - should return to main app');
  }, [currentExercise]);

  const handleBackFromBreathing = useCallback(() => {
    console.log('handleBackFromBreathing called');
    setShowBreathing(false);
    setBreathingExercise(null);
    console.log('Returned to main app from breathing screen');
  }, []);

  const handleTherapyGoalsClick = useCallback(() => {
    console.log('handleTherapyGoalsClick called');
    setShowTherapyGoals(true);
    console.log('Opening therapy goals screen');
  }, []);

  const handleBackFromTherapyGoals = useCallback(() => {
    console.log('handleBackFromTherapyGoals called');
    setShowTherapyGoals(false);
    console.log('Returned to main app from therapy goals screen');
  }, []);

  const handleExerciseClick = useCallback((exercise?: Exercise, source: string = 'unknown') => {
    if (exercise) {
      // 🎯 Track exercise viewed
      posthog?.capture('exercise_viewed', {
        exerciseId: exercise.type,
        exerciseName: exercise.name,
        exerciseCategory: exercise.category,
        source
      });

      // Special handling for breathing exercises
      if (exercise.category === t('exerciseLibrary.categories.breathing') || exercise.type.includes('breathing')) {
        posthog?.capture('exercise_started', {
          exerciseId: exercise.type,
          exerciseName: exercise.name,
          exerciseType: 'breathing'
        });
        setBreathingExercise(exercise);
        setShowBreathing(true);
      } else {
        posthog?.capture('exercise_started', {
          exerciseId: exercise.type,
          exerciseName: exercise.name,
          exerciseType: exercise.type
        });
        handleStartSession(exercise);
      }
    } else {
      console.log('No exercise provided to handleExerciseClick');
    }
  }, [handleStartSession, posthog, t]);

  const handleInsightClick = useCallback((type: string, insight?: any) => {
    console.log('=== INSIGHT CLICK ===');
    console.log('Type:', type, 'Insight:', insight);
    
    switch (type) {
      case 'value_reflection':
        if (insight?.valueId && insight?.prompt) {
          // Create a special reflection exercise with the value context
          const reflectionExercise = {
            type: 'value_reflection',
            name: 'Values Reflection',
            duration: '10-15 min',
            description: 'Reflection on personal values',
            context: {
              valueId: insight.valueId,
              prompt: insight.prompt,
              valueName: insight.valueName,
              valueDescription: insight.valueDescription
            }
          };
          console.log('Starting values reflection with exercise:', reflectionExercise);
          handleStartSession(reflectionExercise);
        }
        break;
      case 'vision_reflection':
        if (insight?.visionInsight && insight?.prompt) {
          // Create a special reflection exercise with the vision context
          const visionReflectionExercise = {
            type: 'vision_reflection',
            name: 'Vision Reflection',
            duration: '10-15 min',
            description: 'Reflection on your future vision',
            context: {
              visionInsight: insight.visionInsight,
              prompt: insight.prompt,
              coreQualities: insight.visionInsight.coreQualities,
              fullDescription: insight.visionInsight.fullDescription
            }
          };
          console.log('Starting vision reflection with exercise:', visionReflectionExercise);
          handleStartSession(visionReflectionExercise);
        }
        break;
      case 'thinking_pattern_reflection':
        if (insight?.originalThought && insight?.distortionType) {
          // Create a special reflection exercise with the thinking pattern context
          const patternReflectionExercise = {
            type: 'thinking_pattern_reflection',
            name: 'Thinking Pattern Reflection',
            duration: '10-15 min',
            description: 'Explore and reframe cognitive patterns',
            context: {
              originalThought: insight.originalThought,
              distortionType: insight.distortionType,
              reframedThought: insight.reframedThought,
              prompt: insight.prompt
            }
          };
          console.log('Starting thinking pattern reflection with exercise:', patternReflectionExercise);
          handleStartSession(patternReflectionExercise);
        }
        break;
      case 'deeper_insight_reflection':
        if (insight?.insightContent && insight?.prompt) {
          // Create a reflection exercise for deeper insights
          const deeperInsightReflectionExercise = {
            type: 'thinking_pattern_reflection', // Reuse thinking pattern reflection flow
            name: 'Deeper Insight Reflection',
            duration: '10-15 min',
            description: 'Reflect on long-term patterns and insights',
            context: {
              originalThought: insight.insightContent,
              distortionType: insight.category || 'Pattern',
              reframedThought: '', // Not needed for deeper insights
              prompt: insight.prompt
            }
          };
          console.log('Starting deeper insight reflection with exercise:', deeperInsightReflectionExercise);
          handleStartSession(deeperInsightReflectionExercise);
        }
        break;
      case 'exercise':
        // Handle exercise type clicks
        if (insight?.type) {
          console.log('Starting exercise from insight:', insight.type);

          // Map of exercise types to their proper names
          const exerciseNames: Record<string, string> = {
            'automatic-thoughts': 'Automatic Thoughts',
            'vision-of-future': 'Vision of the Future',
            'sorting-thoughts': 'Sorting Thoughts',
            'breathing': 'Breathing Exercise',
            'values-clarification': 'Values Clarification',
            'goal-setting': 'Therapy Goal-Setting',
            'tell-your-story': 'Tell Your Story'
          };

          // Create exercise object from the insight data
          const exerciseFromInsight = {
            type: insight.type,
            name: exerciseNames[insight.type] || insight.name || 'Exercise',
            duration: '15-20 min',
            description: insight.description || 'Guided therapeutic exercise'
          };
          console.log('Starting exercise with proper name:', exerciseFromInsight);
          handleStartSession(exerciseFromInsight);
        } else {
          console.log('Exercise insight missing type:', insight);
        }
        break;
      case 'goal-setting':
        // Handle therapy goal setting button click
        console.log('Starting therapy goal setting exercise');

        // 🎯 Track first action - therapy goal setting started
        firstActionTracker.trackFirstAction('therapy_goal_setting_started');

        const goalSettingExercise = {
          type: 'goal-setting',
          name: 'Therapy Goal-Setting',
          duration: '20 min',
          description: 'Define your therapeutic goals for your healing journey'
        };
        handleStartSession(goalSettingExercise);
        break;
      case 'chat':
        // Handle direct chat navigation from insights
        console.log('Starting new chat session from insight');
        handleNewSession();
        break;
      default:
        console.log('Unhandled insight type:', type);
        // Handle other insight types as needed
    }
  }, [handleStartSession]);

  const handleActionSelect = useCallback((actionId: string) => {
    const allExercises = getExercisesArray(t);

    switch (actionId) {
      case 'guided-session':
        handleStartSession();
        break;
      case 'guided-journaling':
        const gratitudeExercise = allExercises.find(ex => ex.type === 'gratitude');
        handleStartSession(gratitudeExercise || {
          type: 'gratitude',
          name: 'Guided Journaling',
          duration: '10 min',
          description: 'gratitude journaling'
        });
        break;
      case 'suggested-exercises':
        const mindfulnessExercise = allExercises.find(ex => ex.type === 'mindfulness');
        handleStartSession(mindfulnessExercise || {
          type: 'mindfulness',
          name: 'Morning Mindfulness',
          duration: '8 min',
          description: 'Start your day with gentle awareness and presence'
        });
        break;
      case 'breathing':
      case 'featured-breathing':
        console.log('Opening breathing screen from quick actions');
        setBreathingExercise(null); // No specific exercise, will default to 4-7-8
        setShowBreathing(true);
        break;
      case 'goal-setting':
        // Handle therapy goal setting button click
        console.log('Starting therapy goal setting exercise');
        
        // Close the Therapy Goals screen first
        setShowTherapyGoals(false);
        
        // 🎯 Track first action - therapy goal setting started
        firstActionTracker.trackFirstAction('therapy_goal_setting_started');
        
        const goalSettingExercise = {
          type: 'goal-setting',
          name: 'Therapy Goal-Setting',
          duration: '20 min',
          description: 'Define your therapeutic goals for your healing journey'
        };
        handleStartSession(goalSettingExercise);
        break;
      default:
        handleStartSession();
    }
  }, [handleStartSession, t]);

  return {
    showChat,
    showBreathing,
    showTherapyGoals,
    currentExercise,
    breathingExercise,
    chatWithActionPalette,
    initialChatMessage,
    buttonPosition,
    handleStartSession,
    handleNewSession,
    handleStartChatWithContext,
    handleBackFromChat,
    handleBackFromBreathing,
    handleTherapyGoalsClick,
    handleBackFromTherapyGoals,
    handleExerciseClick,
    handleInsightClick,
    handleActionSelect,
  };
};