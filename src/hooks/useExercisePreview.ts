import { useState, useCallback } from 'react';
import { getExerciseLibraryData, getExerciseFlows } from '../data/exerciseLibrary';

interface Exercise {
  id?: string | number;
  type: string;
  name: string;
  duration: string;
  description: string;
  category?: string;
  difficulty?: string;
  image?: any;
  color?: string[];
  keywords?: string[];
  steps?: any[];
  context?: any;
}

export const useExercisePreview = (t?: (key: string) => string) => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewExercise, setPreviewExercise] = useState<Exercise | null>(null);
  const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | null>(null);

  const showExercisePreview = useCallback((exercise: Exercise, onConfirm: () => void) => {
    // Get exercise data with proper translations
    const translationFn = t || ((key: string) => key);
    const exerciseLibraryData = getExerciseLibraryData(translationFn);
    const exerciseFlows = getExerciseFlows(translationFn);

    // Get complete exercise data from library
    const exerciseDetails = exerciseLibraryData[exercise.type] || exercise;

    // Get exercise steps from flows
    const exerciseFlow = exerciseFlows[exercise.type];
    const steps = exerciseFlow?.steps || [];

    const enhancedExercise = {
      ...exercise,
      ...exerciseDetails,
      steps, // Add the steps from exerciseFlows
      // Preserve any context data that might have been passed
      context: exercise.context
    };

    setPreviewExercise(enhancedExercise);
    setOnConfirmCallback(() => onConfirm);
    setShowPreview(true);
  }, [t]);

  const hideExercisePreview = useCallback(() => {
    setShowPreview(false);
    setPreviewExercise(null);
    setOnConfirmCallback(null);
  }, []);

  const confirmExerciseStart = useCallback(() => {
    if (onConfirmCallback) {
      onConfirmCallback();
    }
    hideExercisePreview();
  }, [onConfirmCallback, hideExercisePreview]);

  return {
    showPreview,
    previewExercise,
    showExercisePreview,
    hideExercisePreview,
    confirmExerciseStart,
  };
};