import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Clock } from 'lucide-react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
  withSpring,
  interpolate,
  Extrapolate,
  withTiming,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { slidableExerciseCardStyles } from '../styles/components/SlidableExerciseCard.styles';

interface SlidableExerciseCardProps {
  exercise: any;
  index: number;
  benefit: string;
  isLargeButton: boolean;
  buttonImage: any;
  onExerciseClick: (exercise: any) => void;
  onHideCard: (exerciseId: string, hideType: 'permanent' | 'temporary') => void;
}

const SWIPE_THRESHOLD = 100;

const SlidableExerciseCard: React.FC<SlidableExerciseCardProps> = ({
  exercise,
  index,
  benefit,
  isLargeButton,
  buttonImage,
  onExerciseClick,
  onHideCard,
}) => {
  const translateX = useSharedValue(0);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const showScheduleOptions = () => {
    setShowScheduleModal(true);
  };

  const handleScheduleChoice = (hideType: 'permanent' | 'temporary') => {
    setShowScheduleModal(false);
    onHideCard(exercise.id, hideType);
  };

  const resetPosition = () => {
    translateX.value = withSpring(0, {
      damping: 15,
      stiffness: 150,
    });
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      // Cancel any ongoing animations
      translateX.value = translateX.value;
    },
    onActive: (event) => {
      // Only allow rightward swipes
      if (event.translationX > 0) {
        translateX.value = event.translationX;
      }
    },
    onEnd: (event) => {
      const shouldHideCard = event.translationX > SWIPE_THRESHOLD;
      
      if (shouldHideCard) {
        // Slide out completely before showing modal
        translateX.value = withTiming(400, { duration: 300 }, () => {
          runOnJS(showScheduleOptions)();
        });
      } else {
        // Reset position
        runOnJS(resetPosition)();
      }
    },
  });

  const cardAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD, 200],
      [1, 0.7, 0.3],
      Extrapolate.CLAMP
    );

    const blur = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 10],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateX: translateX.value }],
      opacity,
    };
  });

  const blurAnimatedStyle = useAnimatedStyle(() => {
    const intensity = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 50],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD / 2, SWIPE_THRESHOLD],
      [0, 0.3, 0.8],
      Extrapolate.CLAMP
    );

    return {
      opacity,
    };
  });

  return (
    <>
      <View style={[slidableExerciseCardStyles.container]}>
        <View>
          <TouchableOpacity
            style={slidableExerciseCardStyles.exerciseCard}
            onPress={() => onExerciseClick(exercise)}
            activeOpacity={0.8}
          >
              {/* Card pattern background in top right */}
              <Image
                source={
                  index % 3 === 0
                    ? require('../../assets/new-design/Homescreen/Cards/card pattern-blue.png')
                    : index % 3 === 1
                    ? require('../../assets/new-design/Homescreen/Cards/card pattern.png')
                    : require('../../assets/new-design/Homescreen/Cards/card pattern-purple.png')
                }
                style={[
                  slidableExerciseCardStyles.cardPatternBackground,
                  index % 3 === 2 && slidableExerciseCardStyles.cardPatternBackgroundPurple
                ]}
                contentFit="cover"
              />
              <View style={slidableExerciseCardStyles.exerciseCardGradient}>
                {/* Left side image */}
                <View style={slidableExerciseCardStyles.exerciseImageContainer}>
                  <Image
                    source={exercise.image || require('../../assets/images/new-icon1.png')}
                    style={slidableExerciseCardStyles.exerciseImage}
                    contentFit="cover"
                  />
                </View>

                {/* Right side content */}
                <View style={slidableExerciseCardStyles.exerciseContent}>
                  <Text style={slidableExerciseCardStyles.exerciseTitle} numberOfLines={2}>
                    {exercise.name}
                  </Text>

                  <Text style={slidableExerciseCardStyles.exerciseDescription} numberOfLines={2}>
                    {exercise.description}
                  </Text>
                </View>

                {/* Benefits tag positioned at bottom left */}
                <View style={[
                  slidableExerciseCardStyles.categoryTagContainer,
                  slidableExerciseCardStyles.categoryTagContainerSmall,
                  slidableExerciseCardStyles.categoryTagContainerBottomLeft
                ]}>
                  <Text style={[
                    slidableExerciseCardStyles.categoryTagText,
                    slidableExerciseCardStyles.categoryTagTextSmall
                  ]}>
                    {benefit}
                  </Text>
                </View>

                {/* Duration tag positioned at bottom right */}
                <View style={[
                  slidableExerciseCardStyles.durationContainer,
                  slidableExerciseCardStyles.durationContainerBottomRight
                ]}>
                  <Clock size={12} color="#002244" />
                  <Text style={slidableExerciseCardStyles.exerciseDuration}>{exercise.duration}</Text>
                </View>
              </View>

          </TouchableOpacity>
        </View>
      </View>

      {/* Schedule Options Modal */}
      <Modal
        visible={showScheduleModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowScheduleModal(false)}
      >
        <View style={slidableExerciseCardStyles.modalOverlay}>
          <View style={slidableExerciseCardStyles.modalContainer}>
            <Text style={slidableExerciseCardStyles.modalTitle}>
              What would you like to do with this exercise?
            </Text>
            
            <TouchableOpacity
              style={[slidableExerciseCardStyles.modalButton, slidableExerciseCardStyles.temporaryButton]}
              onPress={() => handleScheduleChoice('temporary')}
            >
              <Text style={slidableExerciseCardStyles.modalButtonText}>
                Show again in 7 days
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[slidableExerciseCardStyles.modalButton, slidableExerciseCardStyles.permanentButton]}
              onPress={() => handleScheduleChoice('permanent')}
            >
              <Text style={slidableExerciseCardStyles.modalButtonText}>
                Don't show again
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[slidableExerciseCardStyles.modalButton, slidableExerciseCardStyles.cancelButton]}
              onPress={() => {
                setShowScheduleModal(false);
                resetPosition();
              }}
            >
              <Text style={[slidableExerciseCardStyles.modalButtonText, slidableExerciseCardStyles.cancelButtonText]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default SlidableExerciseCard;