import { useState, useCallback } from 'react';
import { Exercise } from '../types';

/**
 * Custom hook for managing app-level state
 */
export const useAppState = () => {
  const [showChat, setShowChat] = useState<boolean>(false);
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

  const handleExerciseClick = useCallback((exercise?: Exercise) => {
    console.log('=== EXERCISE CLICK ===');
    console.log('Exercise clicked:', exercise);
    if (exercise) {
      console.log('Starting session with exercise:', exercise.type, exercise.name);
      handleStartSession(exercise);
    } else {
      console.log('No exercise provided to handleExerciseClick');
    }
  }, [handleStartSession]);

  const handleInsightClick = useCallback((_type: string, _insight?: any) => {
    // Handle insight navigation - placeholder for future implementation
  }, []);

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
          duration: '5 min', 
          description: 'mindfulness practice' 
        });
        break;
      default:
        handleStartSession();
    }
  }, [handleStartSession]);

  return {
    showChat,
    currentExercise,
    chatWithActionPalette,
    handleStartSession,
    handleNewSession,
    handleBackFromChat,
    handleExerciseClick,
    handleInsightClick,
    handleActionSelect,
  };
};