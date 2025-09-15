import { useState, useCallback } from 'react';
import { exerciseLibraryData } from '../data/exerciseLibrary';

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

export const useExercisePreview = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewExercise, setPreviewExercise] = useState<Exercise | null>(null);
  const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | null>(null);

  const showExercisePreview = useCallback((exercise: Exercise, onConfirm: () => void) => {
    // Get complete exercise data from library
    const exerciseDetails = exerciseLibraryData[exercise.type] || exercise;
    const enhancedExercise = {
      ...exercise,
      ...exerciseDetails,
      // Preserve any context data that might have been passed
      context: exercise.context
    };

    setPreviewExercise(enhancedExercise);
    setOnConfirmCallback(() => onConfirm);
    setShowPreview(true);
  }, []);

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