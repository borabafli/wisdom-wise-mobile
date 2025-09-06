import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MoodSlider } from './MoodSlider';
import { preExerciseMoodCardStyles as styles } from '../../styles/components/PreExerciseMoodCard.styles';

interface PreExerciseMoodCardProps {
  exerciseName: string;
  onComplete: (rating: number) => void;
  onSkip?: () => void;
}

export const PreExerciseMoodCard: React.FC<PreExerciseMoodCardProps> = ({
  exerciseName,
  onComplete,
  onSkip
}) => {
  const [moodRating, setMoodRating] = useState<number>(2.5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = (rating: number) => {
    setIsSubmitting(true);
    console.log('Pre-exercise mood rating:', rating);
    onComplete(rating);
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
  };

  return (
    <BlurView
      intensity={20}
      tint="light"
      style={styles.container}
    >
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
        style={styles.glassOverlay}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Before we start the {exerciseName}</Text>
          <Text style={styles.subtitle}>How are you feeling right now?</Text>
        </View>

        <View style={styles.slidersContainer}>
          <MoodSlider
            title=""
            subtitle=""
            initialValue={moodRating}
            type="mood"
            onRatingChange={setMoodRating}
            onComplete={handleComplete}
            onSkip={onSkip ? handleSkip : undefined}
          />
        </View>
      </LinearGradient>
    </BlurView>
  );
};