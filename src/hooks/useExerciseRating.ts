import { useState, useCallback } from 'react';
import { exerciseRatingService, ExerciseRating } from '../services/exerciseRatingService';

export interface UseExerciseRatingReturn {
  showRatingModal: boolean;
  exerciseName: string;
  openRatingModal: (exerciseName: string, exerciseId: string, category?: string) => void;
  closeRatingModal: () => void;
  submitRating: (rating: number) => Promise<void>;
  isSubmitting: boolean;
}

export const useExerciseRating = (): UseExerciseRatingReturn => {
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseId, setExerciseId] = useState('');
  const [category, setCategory] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openRatingModal = useCallback((name: string, id: string, exerciseCategory?: string) => {
    setExerciseName(name);
    setExerciseId(id);
    setCategory(exerciseCategory);
    setShowRatingModal(true);
  }, []);

  const closeRatingModal = useCallback(() => {
    setShowRatingModal(false);
    setExerciseName('');
    setExerciseId('');
    setCategory(undefined);
  }, []);

  const submitRating = useCallback(async (rating: number) => {
    if (!exerciseId || !exerciseName) {
      console.error('Missing exercise ID or name for rating submission');
      return;
    }

    setIsSubmitting(true);
    try {
      await exerciseRatingService.saveRating({
        exerciseId,
        exerciseName,
        rating,
        category,
      });

      console.log(`Exercise "${exerciseName}" rated: ${rating}/5`);
      
      // Close the modal after successful submission
      closeRatingModal();
    } catch (error) {
      console.error('Failed to submit rating:', error);
      // Could show an error toast here
    } finally {
      setIsSubmitting(false);
    }
  }, [exerciseId, exerciseName, category, closeRatingModal]);

  return {
    showRatingModal,
    exerciseName,
    openRatingModal,
    closeRatingModal,
    submitRating,
    isSubmitting,
  };
};