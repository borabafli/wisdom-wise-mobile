import React, { useState, useRef } from 'react';
import { View, Text, PanResponder, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { moodSliderStyles as styles } from '../../styles/components/MoodSlider.styles';

interface MoodSliderProps {
  onRatingChange: (rating: number) => void;
  onComplete: (rating: number) => void;
  title?: string;
  subtitle?: string;
  initialValue?: number;
  type?: 'mood' | 'helpfulness' | 'sleep' | 'energy' | 'anxiety' | 'custom';
}

const SLIDER_WIDTH = 280;
const THUMB_SIZE = 28;

export const MoodSlider: React.FC<MoodSliderProps> = ({
  onRatingChange,
  onComplete,
  title = "How are you feeling right now?",
  subtitle = "Rate your current mood",
  initialValue = 2.5,
  type = 'mood'
}) => {
  const [currentRating, setCurrentRating] = useState(initialValue);
  const [thumbPosition, setThumbPosition] = useState((initialValue / 5) * SLIDER_WIDTH);
  const [isDragging, setIsDragging] = useState(false);

  const handleSliderTouch = (evt: any) => {
    const touchX = evt.nativeEvent.locationX;
    const newPosition = Math.max(0, Math.min(SLIDER_WIDTH, touchX));
    setThumbPosition(newPosition);
    
    const rating = (newPosition / SLIDER_WIDTH) * 5;
    setCurrentRating(rating);
    onRatingChange(rating);
    
    setTimeout(() => {
      onComplete(rating);
    }, 500);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        setIsDragging(true);
        // Handle initial touch
        const touchX = evt.nativeEvent.locationX;
        const newPosition = Math.max(0, Math.min(SLIDER_WIDTH, touchX));
        setThumbPosition(newPosition);
        
        const rating = (newPosition / SLIDER_WIDTH) * 5;
        setCurrentRating(rating);
        onRatingChange(rating);
      },
      onPanResponderMove: (evt, gestureState) => {
        const touchX = evt.nativeEvent.locationX;
        const newPosition = Math.max(0, Math.min(SLIDER_WIDTH, touchX));
        setThumbPosition(newPosition);
        
        const rating = (newPosition / SLIDER_WIDTH) * 5;
        setCurrentRating(rating);
        onRatingChange(rating);
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
        setTimeout(() => {
          onComplete(currentRating);
        }, 300);
      },
    })
  ).current;

  const getMoodLabel = (rating: number): string => {
    const labels = {
      mood: {
        1: 'Terrible', 2: 'Poor', 3: 'Okay', 4: 'Good', 5: 'Great'
      },
      helpfulness: {
        1: 'Not helpful', 2: 'Slightly helpful', 3: 'Moderately helpful', 4: 'Very helpful', 5: 'Extremely helpful'
      },
      sleep: {
        1: 'Awful', 2: 'Poor', 3: 'Okay', 4: 'Good', 5: 'Excellent'
      },
      energy: {
        1: 'Exhausted', 2: 'Low', 3: 'Moderate', 4: 'High', 5: 'Energetic'
      },
      anxiety: {
        1: 'Very calm', 2: 'Calm', 3: 'Neutral', 4: 'Anxious', 5: 'Very anxious'
      },
      custom: {
        1: 'Not at all', 2: 'Slightly', 3: 'Moderately', 4: 'Quite a bit', 5: 'Very much'
      }
    };
    
    const typeLabels = labels[type] || labels.custom;
    const index = Math.max(1, Math.min(5, Math.round(rating)));
    return typeLabels[index as keyof typeof typeLabels];
  };

  const getThumbColor = (rating: number): string => {
    if (type === 'anxiety') {
      // Reverse colors for anxiety (calm = green, anxious = red)
      if (rating < 1) return '#10b981'; // Emerald
      if (rating < 2) return '#84cc16'; // Lime
      if (rating < 3) return '#eab308'; // Yellow
      if (rating < 4) return '#f97316'; // Orange
      return '#ef4444'; // Red
    }
    
    // Standard colors (low = red, high = therapeutic blue)
    if (rating < 1) return '#ef4444'; // Red
    if (rating < 2) return '#f97316'; // Orange
    if (rating < 3) return '#eab308'; // Yellow
    if (rating < 4) return '#10b981'; // Emerald
    return '#006A8F'; // Therapeutic blue (matches home page theme)
  };

  const getEmojiForRating = (rating: number): string => {
    const emojis = {
      mood: {
        1: '😞', 2: '😕', 3: '😐', 4: '🙂', 5: '😊'
      },
      helpfulness: {
        1: '😐', 2: '🤔', 3: '👍', 4: '😊', 5: '🌟'
      },
      sleep: {
        1: '😴', 2: '😪', 3: '😐', 4: '🙂', 5: '😊'
      },
      energy: {
        1: '😴', 2: '😪', 3: '😐', 4: '⚡', 5: '🔥'
      },
      anxiety: {
        1: '😌', 2: '🙂', 3: '😐', 4: '😰', 5: '😱'
      },
      custom: {
        1: '😞', 2: '😕', 3: '😐', 4: '🙂', 5: '😊'
      }
    };
    
    const typeEmojis = emojis[type] || emojis.custom;
    const index = Math.max(1, Math.min(5, Math.round(rating)));
    return typeEmojis[index as keyof typeof typeEmojis];
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      
      {/* Emoji Face */}
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>{getEmojiForRating(currentRating)}</Text>
      </View>
      
      <View style={styles.sliderContainer} {...panResponder.panHandlers}>
        {/* Track */}
        <View style={styles.track}>
          <LinearGradient
            colors={type === 'anxiety' 
              ? ['#10b981', '#84cc16', '#eab308', '#f97316', '#ef4444'] // Reverse for anxiety
              : ['#ef4444', '#f97316', '#eab308', '#10b981', '#006A8F'] // Standard: red to therapeutic blue
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.trackGradient}
          />
        </View>
        
        {/* Thumb */}
        <View
          style={[
            styles.thumb,
            {
              left: Math.max(0, Math.min(SLIDER_WIDTH - THUMB_SIZE, thumbPosition - THUMB_SIZE / 2)),
              backgroundColor: getThumbColor(currentRating),
              transform: [{ scale: isDragging ? 1.1 : 1 }],
            },
          ]}
        />
      </View>
      
      {/* Labels */}
      <View style={styles.labelContainer}>
        <Text style={styles.currentLabel}>{getMoodLabel(currentRating)}</Text>
        <Text style={styles.ratingValue}>{currentRating.toFixed(1)}/5.0</Text>
      </View>
      
      <View style={styles.extremeLabels}>
        <Text style={styles.extremeLabel}>
          {type === 'mood' ? 'Terrible' : 
           type === 'helpfulness' ? 'Not helpful' :
           type === 'sleep' ? 'Awful' :
           type === 'energy' ? 'Exhausted' :
           type === 'anxiety' ? 'Very calm' :
           'Not at all'}
        </Text>
        <Text style={styles.extremeLabel}>
          {type === 'mood' ? 'Great' : 
           type === 'helpfulness' ? 'Extremely helpful' :
           type === 'sleep' ? 'Excellent' :
           type === 'energy' ? 'Energetic' :
           type === 'anxiety' ? 'Very anxious' :
           'Very much'}
        </Text>
      </View>
    </View>
  );
};