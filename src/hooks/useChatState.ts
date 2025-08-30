import { useState, useCallback } from 'react';
import { ChatState, Exercise } from '../types';

/**
 * Custom hook for managing chat state
 */
export const useChatState = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
    currentExercise: null,
    isRecording: false,
    showActionPalette: false,
  });

  const setCurrentExercise = useCallback((exercise: Exercise | null) => {
    setChatState(prev => ({
      ...prev,
      currentExercise: exercise,
    }));
  }, []);

  const setIsLoading = useCallback((isLoading: boolean) => {
    setChatState(prev => ({
      ...prev,
      isLoading,
    }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setChatState(prev => ({
      ...prev,
      error,
    }));
  }, []);

  const setIsRecording = useCallback((isRecording: boolean) => {
    setChatState(prev => ({
      ...prev,
      isRecording,
    }));
  }, []);

  const setShowActionPalette = useCallback((showActionPalette: boolean) => {
    setChatState(prev => ({
      ...prev,
      showActionPalette,
    }));
  }, []);

  const addMessage = useCallback((message: string, sender: 'user' | 'assistant') => {
    setChatState(prev => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          id: Date.now().toString(),
          content: message,
          sender,
          timestamp: new Date(),
          type: 'text',
        },
      ],
    }));
  }, []);

  const clearMessages = useCallback(() => {
    setChatState(prev => ({
      ...prev,
      messages: [],
    }));
  }, []);

  const resetChatState = useCallback(() => {
    setChatState({
      messages: [],
      isLoading: false,
      error: null,
      currentExercise: null,
      isRecording: false,
      showActionPalette: false,
    });
  }, []);

  return {
    chatState,
    setCurrentExercise,
    setIsLoading,
    setError,
    setIsRecording,
    setShowActionPalette,
    addMessage,
    clearMessages,
    resetChatState,
  };
};