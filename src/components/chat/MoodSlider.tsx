import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';
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
  allowReselection?: boolean;
}

// Emoji image assets
const emojiImages = {
  1: require('../../../assets/images/emojis/1.png'),
  2: require('../../../assets/images/emojis/2.png'),
  3: require('../../../assets/images/emojis/3.png'),
  4: require('../../../assets/images/emojis/4.png'),
  5: require('../../../assets/images/emojis/5.png'),
};

export const MoodSlider: React.FC<MoodSliderProps> = ({
  onRatingChange,
  onComplete,
  onSkip,
  title = "How are you feeling right now?",
  subtitle = "Rate your current mood",
  initialValue = 3,
  type = 'mood',
  variant = 'default',
  allowReselection = false
}) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const savedAnim = useRef(new Animated.Value(0)).current;

  const handleEmojiPress = (rating: number) => {
    if (isLocked && !allowReselection) return; // Prevent multiple selections unless reselection is allowed
    
    setSelectedRating(rating);
    if (!allowReselection) setIsLocked(true);
    onRatingChange(rating);
    
    // Start animations
    Animated.parallel([
      // Bounce animation
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      // Glow pulse animation
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Show "Saved!" feedback
      setShowSaved(true);
      Animated.timing(savedAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        // Hide "Saved!" after 1 second and complete
        setTimeout(() => {
          Animated.timing(savedAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onComplete(rating);
          });
        }, 1000);
      });
    });
  };

  return (
    <>
      {(title || variant === 'test') && (
        <Text style={styles.promptText}>
{variant === 'test' ? 'How helpful was this?' : title ? 'I feel...' : null}
        </Text>
      )}
      
      {/* Main emoji display with animations */}
      {selectedRating && (
        <View style={styles.mainEmojiContainer}>
          {/* Glow effect */}
          <Animated.View 
            style={[
              styles.glowEffect,
              {
                opacity: glowAnim,
                transform: [{ scale: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1.2]
                })}]
              }
            ]}
          />
          {/* Animated emoji */}
          <Animated.Image 
            source={emojiImages[selectedRating as keyof typeof emojiImages]}
            style={[
              styles.mainEmojiImage,
              {
                transform: [{ scale: bounceAnim }]
              }
            ]}
            resizeMode="contain"
          />
          {/* Saved feedback */}
          {showSaved && (
            <Animated.View 
              style={[
                styles.savedFeedback,
                {
                  opacity: savedAnim,
                  transform: [{ 
                    translateY: savedAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0]
                    })
                  }]
                }
              ]}
            >
              <Text style={styles.savedText}>Saved! ✓</Text>
            </Animated.View>
          )}
        </View>
      )}

      {/* Emoji selection row */}
      <View style={styles.emojiSelectionRow}>
        {[1, 2, 3, 4, 5].map((rating) => (
          <TouchableOpacity
            key={rating}
            onPress={() => handleEmojiPress(rating)}
            disabled={isLocked}
            style={[
              styles.emojiOption,
              selectedRating === rating && styles.selectedEmojiOption,
              isLocked && rating !== selectedRating && styles.unselectedEmojiOption
            ]}
          >
            <Image 
              source={emojiImages[rating as keyof typeof emojiImages]}
              style={[
                styles.optionEmojiImage,
                isLocked && rating !== selectedRating && styles.unselectedEmojiImage
              ]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Skip option */}
      {onSkip && (
        <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
          <ChevronRight size={16} color="#9CA3AF" />
        </TouchableOpacity>
      )}
    </>
  );
};