import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Dimensions, PanResponder, Animated } from 'react-native';
import { X, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';

const { width, height } = Dimensions.get('window');

interface ExerciseCompletionRatingProps {
  visible: boolean;
  onClose: () => void;
  onRatingSubmit: (rating: number) => void;
  exerciseName: string;
}

const ExerciseCompletionRating: React.FC<ExerciseCompletionRatingProps> = ({
  visible,
  onClose,
  onRatingSubmit,
  exerciseName,
}) => {
  const [rating, setRating] = useState(3);
  const sliderAnimation = new Animated.Value(0.5); // Start at middle (rating 3)

  const getRatingText = (rating: number) => {
    if (rating <= 1) return 'Not helpful at all';
    if (rating <= 2) return 'Somewhat helpful';
    if (rating <= 3) return 'Moderately helpful';
    if (rating <= 4) return 'Very helpful';
    return 'Extremely helpful';
  };

  const getRatingEmoji = (rating: number) => {
    if (rating <= 1) return '😔';
    if (rating <= 2) return '😐';
    if (rating <= 3) return '🙂';
    if (rating <= 4) return '😊';
    return '🤩';
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const sliderWidth = width - 80; // Account for padding
      const normalizedX = Math.max(0, Math.min(gestureState.moveX - 40, sliderWidth));
      const progress = normalizedX / sliderWidth;
      const newRating = Math.round(progress * 4) + 1; // 1-5 scale
      
      setRating(newRating);
      sliderAnimation.setValue(progress);
    },
    onPanResponderRelease: () => {
      // Animation complete
    },
  });

  const handleSliderPress = (event: any) => {
    const { locationX } = event.nativeEvent;
    const sliderWidth = width - 80;
    const progress = Math.max(0, Math.min(locationX / sliderWidth, 1));
    const newRating = Math.round(progress * 4) + 1; // 1-5 scale
    
    setRating(newRating);
    sliderAnimation.setValue(progress);
  };

  const handleSubmit = () => {
    onRatingSubmit(rating);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.overlayBackground} 
          activeOpacity={1}
          onPress={onClose}
        />
        
        <View style={styles.popupContainer}>
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={styles.progressFilled} />
              <View style={styles.progressEmpty} />
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          
          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            <Image 
              source={require('../../assets/images/icons-1.png')}
              style={styles.illustrationIcon}
              contentFit="contain"
            />
          </View>
          
          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>How helpful was this exercise?</Text>
            <Text style={styles.subtitle}>
              We use your feedback to personalize your experience and suggest better exercises that suit your needs.
            </Text>
          </View>
          
          {/* Rating Display */}
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingLabel}>Today</Text>
            <Text style={styles.ratingText}>{getRatingText(rating)}</Text>
            <Text style={styles.ratingEmoji}>{getRatingEmoji(rating)}</Text>
          </View>
          
          {/* Slider */}
          <View style={styles.sliderContainer}>
            <View 
              style={styles.sliderTrack}
              onTouchStart={handleSliderPress}
              {...panResponder.panHandlers}
            >
              <View style={styles.sliderInactive} />
              <Animated.View 
                style={[
                  styles.sliderActive,
                  {
                    width: sliderAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                      extrapolate: 'clamp',
                    }),
                  },
                ]}
              />
              <Animated.View 
                style={[
                  styles.sliderThumb,
                  {
                    left: sliderAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, width - 120], // Account for padding and thumb width
                      extrapolate: 'clamp',
                    }),
                  },
                ]}
              />
            </View>
            
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabelText}>Not at all</Text>
              <Text style={styles.sliderLabelText}>Very</Text>
            </View>
          </View>
          
          {/* Submit Button */}
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <View style={styles.submitButtonContent}>
              <ChevronRight size={24} color="#ffffff" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  overlayBackground: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  popupContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 32,
    margin: 20,
    width: width - 40,
    maxHeight: height * 0.8,
  },
  
  // Progress Bar
  progressContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 40,
  },
  progressBar: {
    flexDirection: 'row' as const,
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden' as const,
    marginRight: 20,
  },
  progressFilled: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 2,
  },
  progressEmpty: {
    flex: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
  },
  closeButton: {
    padding: 4,
  },
  
  // Illustration
  illustrationContainer: {
    alignItems: 'center' as const,
    marginBottom: 40,
  },
  illustrationIcon: {
    width: 80,
    height: 80,
    opacity: 0.8,
  },
  
  // Title
  titleContainer: {
    alignItems: 'center' as const,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: '#111827',
    textAlign: 'center' as const,
    marginBottom: 16,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center' as const,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  
  // Rating Display
  ratingContainer: {
    alignItems: 'center' as const,
    marginBottom: 40,
  },
  ratingLabel: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500' as const,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 28,
    fontWeight: '600' as const,
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center' as const,
  },
  ratingEmoji: {
    fontSize: 32,
  },
  
  // Slider
  sliderContainer: {
    marginBottom: 40,
  },
  sliderTrack: {
    height: 60,
    justifyContent: 'center' as const,
    paddingHorizontal: 20,
    position: 'relative' as const,
  },
  sliderInactive: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
  },
  sliderActive: {
    position: 'absolute' as const,
    left: 20,
    height: 6,
    backgroundColor: '#000000',
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute' as const,
    top: 22,
    width: 36,
    height: 36,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#000000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  sliderLabels: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  sliderLabelText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500' as const,
  },
  
  // Submit Button
  submitButton: {
    alignSelf: 'center' as const,
  },
  submitButtonContent: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000000',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
};

export default ExerciseCompletionRating;