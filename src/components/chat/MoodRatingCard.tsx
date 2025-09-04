import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MoodSlider } from './MoodSlider';
import { moodRatingService, MoodRating } from '../../services/moodRatingService';
import { moodRatingCardStyles as styles } from '../../styles/components/MoodRatingCard.styles';

interface MoodRatingCardProps {
  exerciseType: string;
  exerciseName: string;
  sessionId?: string;
  onComplete: (rating: MoodRating) => void;
  onSkip?: () => void;
}

export const MoodRatingCard: React.FC<MoodRatingCardProps> = ({
  exerciseType,
  exerciseName,
  sessionId,
  onComplete,
  onSkip
}) => {
  const [moodRating, setMoodRating] = useState<number>(2.5);
  const [helpfulnessRating, setHelpfulnessRating] = useState<number>(2.5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSlider, setCurrentSlider] = useState<'mood' | 'helpfulness'>('mood');

  const handleMoodComplete = (rating: number) => {
    setMoodRating(rating);
    setCurrentSlider('helpfulness');
  };

  const handleHelpfulnessComplete = async (rating: number) => {
    setHelpfulnessRating(rating);
    await submitRating(rating);
  };

  const submitRating = async (finalHelpfulnessRating?: number) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const rating: MoodRating = {
        id: Date.now().toString(),
        exerciseType,
        exerciseName,
        moodRating,
        helpfulnessRating: finalHelpfulnessRating || helpfulnessRating,
        sessionId,
        timestamp: new Date().toISOString(),
      };

      const success = await moodRatingService.saveMoodRating(rating);
      
      if (success) {
        console.log('Mood rating saved successfully:', rating);
        onComplete(rating);
      } else {
        console.error('Failed to save mood rating');
        // Still call onComplete to not block the UI
        onComplete(rating);
      }
    } catch (error) {
      console.error('Error submitting mood rating:', error);
      // Create a basic rating object even if save failed
      const rating: MoodRating = {
        id: Date.now().toString(),
        exerciseType,
        exerciseName,
        moodRating,
        helpfulnessRating: finalHelpfulnessRating || helpfulnessRating,
        sessionId,
        timestamp: new Date().toISOString(),
      };
      onComplete(rating);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
  };

  return (
    <LinearGradient
      colors={['rgba(59, 130, 246, 0.1)', 'rgba(147, 197, 253, 0.08)']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>How did this exercise affect you?</Text>
        <Text style={styles.subtitle}>Your feedback helps us personalize your experience</Text>
      </View>

      <View style={styles.slidersContainer}>
        {currentSlider === 'mood' && (
          <MoodSlider
            title="How are you feeling right now?"
            subtitle="Rate your current mood"
            initialValue={moodRating}
            type="mood"
            onRatingChange={setMoodRating}
            onComplete={handleMoodComplete}
          />
        )}
        
        {currentSlider === 'helpfulness' && (
          <MoodSlider
            title="How helpful was this exercise?"
            subtitle="Rate how much this exercise helped you"
            initialValue={helpfulnessRating}
            type="helpfulness"
            onRatingChange={setHelpfulnessRating}
            onComplete={handleHelpfulnessComplete}
          />
        )}
      </View>

      <View style={styles.progressIndicator}>
        <View style={[styles.progressDot, currentSlider === 'mood' && styles.activeDot]} />
        <View style={[styles.progressDot, currentSlider === 'helpfulness' && styles.activeDot]} />
      </View>

      <View style={styles.actions}>
        {onSkip && (
          <TouchableOpacity 
            style={styles.skipButton} 
            onPress={handleSkip}
            disabled={isSubmitting}
          >
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
};