import React, { useState, useRef } from 'react';
import { View, Text, PanResponder, Dimensions, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';
import { moodSliderStyles as styles } from '../../styles/components/MoodSlider.styles';

interface MoodSliderProps {
  onRatingChange: (rating: number) => void;
  onComplete: (rating: number) => void;
  onSkip?: () => void;
  title?: string;
  subtitle?: string;
  initialValue?: number;
  type?: 'mood' | 'helpfulness' | 'sleep' | 'energy' | 'anxiety' | 'custom';
  variant?: 'default' | 'test';
}

const SLIDER_WIDTH = 280;
const THUMB_SIZE = 24;

// Smiley image assets from Teal Watercolor collection
const smileyImages = {
  1: require('../../../assets/images/Teal Watercolor/smiley-1.png'),
  2: require('../../../assets/images/Teal Watercolor/smiley-2.png'),
  3: require('../../../assets/images/Teal Watercolor/smiley-3.png'),
  4: require('../../../assets/images/Teal Watercolor/smiley-4.png'),
  5: require('../../../assets/images/Teal Watercolor/smiley-5.png'),
};

export const MoodSlider: React.FC<MoodSliderProps> = ({
  onRatingChange,
  onComplete,
  onSkip,
  title = "How are you feeling right now?",
  subtitle = "Rate your current mood",
  initialValue = 2.5,
  type = 'mood',
  variant = 'default'
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

  const getCurrentSmileyImage = (rating: number) => {
    const index = Math.max(1, Math.min(5, Math.round(rating)));
    return smileyImages[index as keyof typeof smileyImages];
  };

  // Get colors based on variant
  const getColors = () => {
    if (variant === 'test') {
      return {
        fillColor: '#9AC0DF',
        borderColor: '#9AC0DF'
      };
    }
    return {
      fillColor: '#9AC0DF',
      borderColor: '#9AC0DF'
    };
  };

  const colors = getColors();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        <Text style={styles.promptText}>
          {variant === 'test' ? 'How helpful was this?' : 'I feel...'}
        </Text>
      </View>
      <View style={styles.smileyContainer}>
        {variant === 'test' ? (
          <Image 
            source={require('../../../assets/images/icons-effectiveness.png')}
            style={styles.effectivenessImage}
            resizeMode="contain"
          />
        ) : (
          <Image 
            source={getCurrentSmileyImage(currentRating)}
            style={styles.smileyImage}
            resizeMode="contain"
          />
        )}
      </View>
      <View style={styles.sliderContainer} {...panResponder.panHandlers}>
        <View style={styles.trackBackground}>
          <View 
            style={[
              styles.filledTrack, 
              { 
                width: thumbPosition,
                backgroundColor: colors.fillColor,
              }
            ]} 
          />
        </View>
        <View
          style={[
            styles.thumb,
            {
              left: Math.max(-THUMB_SIZE/2, Math.min(SLIDER_WIDTH - THUMB_SIZE/2, thumbPosition - THUMB_SIZE / 2)),
              transform: [{ scale: isDragging ? 1.1 : 1 }],
              borderColor: colors.borderColor,
            },
          ]}
        />
      </View>
      <View style={styles.extremeLabels}>
        <Text style={styles.extremeLabel}>
          {variant === 'test' ? 'Not at all' : 'Terrible'}
        </Text>
        <Text style={styles.extremeLabel}>
          {variant === 'test' ? 'Very helpful' : 'Great'}
        </Text>
      </View>
      <View style={styles.submitSection}>
        {onSkip ? (
          <TouchableOpacity onPress={onSkip}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity 
          style={[styles.submitButton, { backgroundColor: colors.fillColor }]}
          onPress={() => onComplete(currentRating)}
          activeOpacity={0.8}
        >
          <ChevronRight size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};