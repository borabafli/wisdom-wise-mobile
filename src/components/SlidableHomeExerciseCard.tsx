import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
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
import { slidableHomeExerciseCardStyles } from '../styles/components/SlidableHomeExerciseCard.styles';

interface SlidableHomeExerciseCardProps {
  exercise: any;
  index: number;
  exerciseProgress: any;
  showTestButtons: boolean;
  onStartSession: (exercise: any) => void;
  onHideCard: (exerciseId: string, hideType: 'permanent' | 'temporary') => void;
  simulateExerciseCompletion?: (exerciseId: string, completed: boolean) => void;
  isLast?: boolean;
}

const SWIPE_THRESHOLD = 100;

const SlidableHomeExerciseCard: React.FC<SlidableHomeExerciseCardProps> = ({
  exercise,
  index,
  exerciseProgress,
  showTestButtons,
  onStartSession,
  onHideCard,
  simulateExerciseCompletion,
  isLast = false,
}) => {
  const translateX = useSharedValue(0);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const isCompleted = exerciseProgress[exercise.id]?.completed || false;

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
      translateX.value = translateX.value;
    },
    onActive: (event) => {
      // Only handle horizontal swipes to the right
      if (event.translationX > 0) {
        translateX.value = event.translationX;
      }
    },
    onEnd: (event) => {
      const shouldHideCard = event.translationX > SWIPE_THRESHOLD;

      if (shouldHideCard) {
        translateX.value = withTiming(400, { duration: 300 }, () => {
          runOnJS(showScheduleOptions)();
        });
      } else {
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

    return {
      transform: [{ translateX: translateX.value }],
      opacity,
    };
  });

  const blurAnimatedStyle = useAnimatedStyle(() => {
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

  const slideTextAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, 30, SWIPE_THRESHOLD],
      [0, 0.6, 1],
      Extrapolate.CLAMP
    );

    const scale = interpolate(
      translateX.value,
      [0, 30, SWIPE_THRESHOLD],
      [0.8, 0.95, 1],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <>
      <PanGestureHandler
        onGestureEvent={gestureHandler}
        activeOffsetX={[-999999, 15]}
        failOffsetY={[-15, 15]}
        shouldCancelWhenOutside={true}
      >
        <Animated.View style={[slidableHomeExerciseCardStyles.container]}>
          {/* Timeline elements - outside sliding container */}
          <View style={slidableHomeExerciseCardStyles.timelineContainer}>
            {index > 0 && <View style={slidableHomeExerciseCardStyles.timelineLineTop} />}
            {isLast ? (
              <View style={slidableHomeExerciseCardStyles.timelineLineBottomLastGradient}>
                <LinearGradient
                  colors={['#9CA3AF', 'rgba(156, 163, 175, 0.8)']}
                  style={slidableHomeExerciseCardStyles.dashSegment}
                />
                <View style={slidableHomeExerciseCardStyles.dashGap} />
                <LinearGradient
                  colors={['rgba(156, 163, 175, 0.7)', 'rgba(156, 163, 175, 0.5)']}
                  style={slidableHomeExerciseCardStyles.dashSegment}
                />
                <View style={slidableHomeExerciseCardStyles.dashGap} />
                <LinearGradient
                  colors={['rgba(156, 163, 175, 0.4)', 'rgba(156, 163, 175, 0.2)']}
                  style={slidableHomeExerciseCardStyles.dashSegment}
                />
                <View style={slidableHomeExerciseCardStyles.dashGap} />
                <LinearGradient
                  colors={['rgba(156, 163, 175, 0.1)', 'rgba(156, 163, 175, 0)']}
                  style={slidableHomeExerciseCardStyles.dashSegment}
                />
              </View>
            ) : (
              <View style={slidableHomeExerciseCardStyles.timelineLineBottom} />
            )}
            {index === 0 ? (
              <View style={[slidableHomeExerciseCardStyles.timelineCircle, slidableHomeExerciseCardStyles.timelineCircleFirst]}>
                <View style={slidableHomeExerciseCardStyles.timelineCircleFirstInner} />
              </View>
            ) : (
              <View style={slidableHomeExerciseCardStyles.timelineCircle} />
            )}
          </View>

          {/* Background slide text */}
          <Animated.View style={[slidableHomeExerciseCardStyles.slideTextContainer, slideTextAnimatedStyle]}>
            <Text style={slidableHomeExerciseCardStyles.slideText}>
              Slide to remove exercise
            </Text>
          </Animated.View>

          <Animated.View style={[cardAnimatedStyle]}>
            <View style={slidableHomeExerciseCardStyles.exerciseCardContainer}>
              {/* Checkbox for completed exercises */}
              {isCompleted && (
                <View style={[
                  slidableHomeExerciseCardStyles.checkboxContainer,
                  index === 0 && slidableHomeExerciseCardStyles.checkboxContainerFirst,
                  index === 1 && slidableHomeExerciseCardStyles.checkboxContainerSecond, 
                  index === 2 && slidableHomeExerciseCardStyles.checkboxContainerThird
                ]}>
                  <Image 
                    source={require('../../assets/images/Buttons/checkmark.png')}
                    style={[
                      slidableHomeExerciseCardStyles.checkmarkImage,
                      index === 0 && slidableHomeExerciseCardStyles.checkmarkImageFirst,
                      index === 1 && slidableHomeExerciseCardStyles.checkmarkImageSecond,
                      index === 2 && slidableHomeExerciseCardStyles.checkmarkImageThird
                    ]}
                    contentFit="contain"
                  />
                </View>
              )}
              
              <TouchableOpacity
                onPress={() => onStartSession({
                  type: exercise.type,
                  name: exercise.name,
                  duration: exercise.duration,
                  description: exercise.description
                })}
                style={slidableHomeExerciseCardStyles.exerciseCard}
                activeOpacity={0.9}
              >
                <Image
                  source={
                    index === 0
                      ? require('../../assets/new-design/Homescreen/Cards/sharper/card-1-less-height.png')
                      : index === 1
                      ? require('../../assets/new-design/Homescreen/Cards/sharper/card-2-less-height.png')
                      : require('../../assets/new-design/Homescreen/Cards/sharper/card-4-less-height.png')
                  }
                  style={slidableHomeExerciseCardStyles.exerciseCardFullSize}
                  contentFit="contain"
                />
                <View style={slidableHomeExerciseCardStyles.textOverlay}>
                  <Text style={slidableHomeExerciseCardStyles.exerciseName} numberOfLines={1}>
                    {exercise.name}
                  </Text>
                  <Text style={slidableHomeExerciseCardStyles.exerciseDescription}>
                    {exercise.description}
                  </Text>
                </View>
                
                {/* Blur overlay */}
                <Animated.View 
                  style={[
                    slidableHomeExerciseCardStyles.blurOverlay,
                    blurAnimatedStyle,
                  ]}
                  pointerEvents="none"
                >
                  <BlurView
                    intensity={50}
                    style={slidableHomeExerciseCardStyles.blurView}
                  />
                </Animated.View>
              </TouchableOpacity>
              
              {/* Test buttons when enabled */}
              {showTestButtons && simulateExerciseCompletion && (
                <View style={[
                  slidableHomeExerciseCardStyles.testButtonsContainer,
                  index === 0 && slidableHomeExerciseCardStyles.testButtonsContainerFirst,
                  index === 1 && slidableHomeExerciseCardStyles.testButtonsContainerSecond
                ]}>
                  <TouchableOpacity
                    onPress={() => simulateExerciseCompletion(exercise.id, true)}
                    style={[
                      slidableHomeExerciseCardStyles.testCheckmarkButton,
                      index === 0 && slidableHomeExerciseCardStyles.testCheckmarkButtonFirst,
                      index === 1 && slidableHomeExerciseCardStyles.testCheckmarkButtonSecond,
                      index === 2 && slidableHomeExerciseCardStyles.testCheckmarkButtonThird
                    ]}
                  >
                    <Image 
                      source={require('../../assets/images/Buttons/checkmark.png')}
                      style={[
                        slidableHomeExerciseCardStyles.testCheckmarkImage,
                        index === 0 && slidableHomeExerciseCardStyles.testCheckmarkImageFirst,
                        index === 1 && slidableHomeExerciseCardStyles.testCheckmarkImageSecond,
                        index === 2 && slidableHomeExerciseCardStyles.testCheckmarkImageThird
                      ]}
                      contentFit="contain"
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>

      {/* Schedule Options Modal */}
      <Modal
        visible={showScheduleModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowScheduleModal(false)}
      >
        <View style={slidableHomeExerciseCardStyles.modalOverlay}>
          <View style={slidableHomeExerciseCardStyles.modalContainer}>
            <Text style={slidableHomeExerciseCardStyles.modalTitle}>
              Remove Exercise?
            </Text>

            <View style={slidableHomeExerciseCardStyles.modalButtonRow}>
              <TouchableOpacity
                style={[slidableHomeExerciseCardStyles.modalButton, slidableHomeExerciseCardStyles.temporaryButton]}
                onPress={() => handleScheduleChoice('temporary')}
              >
                <Text style={[slidableHomeExerciseCardStyles.modalButtonText, slidableHomeExerciseCardStyles.temporaryButtonText]}>
                  For 7 days
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[slidableHomeExerciseCardStyles.modalButton, slidableHomeExerciseCardStyles.permanentButton]}
                onPress={() => handleScheduleChoice('permanent')}
              >
                <Text style={slidableHomeExerciseCardStyles.modalButtonText}>
                  Forever
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[slidableHomeExerciseCardStyles.modalButton, slidableHomeExerciseCardStyles.cancelButton]}
              onPress={() => {
                setShowScheduleModal(false);
                resetPosition();
              }}
            >
              <Text style={[slidableHomeExerciseCardStyles.modalButtonText, slidableHomeExerciseCardStyles.cancelButtonText]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default SlidableHomeExerciseCard;