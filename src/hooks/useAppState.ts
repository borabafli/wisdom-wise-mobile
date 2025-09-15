import { useState, useCallback } from 'react';
import { Exercise } from '../types';

/**
 * Custom hook for managing app-level state
 */
export const useAppState = () => {
  const [showChat, setShowChat] = useState<boolean>(false);
  const [showBreathing, setShowBreathing] = useState<boolean>(false);
  const [showTherapyGoals, setShowTherapyGoals] = useState<boolean>(false);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [chatWithActionPalette, setChatWithActionPalette] = useState<boolean>(false);

  const handleStartSession = useCallback((exercise: Exercise | null = null) => {
    console.log('=== START SESSION ===');
    console.log('Exercise passed to session:', exercise);
    setCurrentExercise(exercise);
    setShowChat(true);
    console.log('Session state updated - should show chat with exercise:', exercise?.type);
  }, []);

  const handleNewSession = useCallback(() => {
    setShowChat(true);
    setChatWithActionPalette(true);
  }, []);

  const handleBackFromChat = useCallback(() => {
    console.log('handleBackFromChat called - starting cleanup');
    console.log('Current state - showChat:', showChat, 'chatWithActionPalette:', chatWithActionPalette, 'currentExercise:', currentExercise);
    
    setShowChat(false);
    setChatWithActionPalette(false);
    setCurrentExercise(null);
    
    console.log('handleBackFromChat completed - should return to main app');
  }, [showChat, chatWithActionPalette, currentExercise]);

  const handleBackFromBreathing = useCallback(() => {
    console.log('handleBackFromBreathing called');
    setShowBreathing(false);
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

  const handleExerciseClick = useCallback((exercise?: Exercise) => {
    console.log('=== EXERCISE CLICK ===');
    console.log('Exercise clicked:', exercise);
    if (exercise) {
      console.log('Starting session with exercise:', exercise.type, exercise.name);
      
      // Special handling for breathing exercises
      if (exercise.type === 'breathing') {
        setShowBreathing(true);
        console.log('Opening dedicated breathing screen');
      } else {
        handleStartSession(exercise);
      }
    } else {
      console.log('No exercise provided to handleExerciseClick');
    }
  }, [handleStartSession]);

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
      case 'exercise':
        // Handle exercise type clicks
        if (insight?.type) {
          console.log('Starting exercise from insight:', insight.type);
          // Create exercise object from the insight data
          const exerciseFromInsight = {
            type: insight.type,
            name: insight.type === 'vision-of-future' ? 'Vision of the Future' : insight.name || 'Exercise',
            duration: '15-20 min',
            description: insight.description || 'Guided therapeutic exercise'
          };
          handleStartSession(exerciseFromInsight);
        } else {
          console.log('Exercise insight missing type:', insight);
        }
        break;
      default:
        console.log('Unhandled insight type:', type);
        // Handle other insight types as needed
    }
  }, [handleStartSession]);

  const handleActionSelect = useCallback((actionId: string) => {
    switch (actionId) {
      case 'guided-session':
        handleStartSession();
        break;
      case 'guided-journaling':
        handleStartSession({ 
          type: 'gratitude', 
          name: 'Guided Journaling', 
          duration: '10 min', 
          description: 'gratitude journaling' 
        });
        break;
      case 'suggested-exercises':
        handleStartSession({ 
          type: 'mindfulness', 
          name: 'Morning Mindfulness', 
          duration: '8 min', 
          description: 'Start your day with gentle awareness and presence' 
        });
        break;
      default:
        handleStartSession();
    }
  }, [handleStartSession]);

  return {
    showChat,
    showBreathing,
    showTherapyGoals,
    currentExercise,
    chatWithActionPalette,
    handleStartSession,
    handleNewSession,
    handleBackFromChat,
    handleBackFromBreathing,
    handleTherapyGoalsClick,
    handleBackFromTherapyGoals,
    handleExerciseClick,
    handleInsightClick,
    handleActionSelect,
  };
};