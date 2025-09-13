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
    <View style={styles.container}>
      <LinearGradient
        colors={['#D5E8E8', '#C0DDD7', '#E0F0F0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      />
      <Text style={styles.title}>Before we start...</Text>
      <Text style={styles.subtitle}>How are you feeling right now?</Text>
      
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
  );
};