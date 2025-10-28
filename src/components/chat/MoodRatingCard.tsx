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
  const [showTestSlider, setShowTestSlider] = useState(false);

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
        stage: 'post',
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
        stage: 'post',
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
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(59, 130, 246, 0.25)', 'rgba(147, 197, 253, 0.18)', 'rgba(186, 230, 253, 0.22)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      />
      <Text style={styles.title}>Before we finish...</Text>
      
      {currentSlider === 'mood' && (
        <MoodSlider
          title=""
          subtitle=""
          initialValue={moodRating}
          type="mood"
          onRatingChange={setMoodRating}
          onComplete={handleMoodComplete}
          onSkip={onSkip ? handleSkip : undefined}
        />
      )}
      
      {currentSlider === 'helpfulness' && (
        <MoodSlider
          title=""
          subtitle=""
          initialValue={helpfulnessRating}
          type="helpfulness"
          variant="test"
          onRatingChange={setHelpfulnessRating}
          onComplete={handleHelpfulnessComplete}
          onSkip={onSkip ? handleSkip : undefined}
        />
      )}
    </View>
  );
};