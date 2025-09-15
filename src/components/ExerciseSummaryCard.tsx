import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { Star, Clock, Tag, PlayCircle, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { exerciseRatingService } from '../services/exerciseRatingService';
import { exerciseSummaryCardStyles as styles } from '../styles/components/ExerciseSummaryCard.styles';

const { height } = Dimensions.get('window');

interface ExerciseStep {
  title: string;
  stepNumber: number;
  description?: string;
  instruction?: string;
}

interface Exercise {
  id?: string | number;
  type: string;
  name: string;
  duration: string;
  description: string;
  category?: string;
  difficulty?: string;
  image?: any;
  color?: string[];
  keywords?: string[];
  steps?: ExerciseStep[];
}

interface ExerciseSummaryCardProps {
  visible: boolean;
  exercise: Exercise;
  onStart: () => void;
  onClose: () => void;
}

const ExerciseSummaryCard: React.FC<ExerciseSummaryCardProps> = ({
  visible,
  exercise,
  onStart,
  onClose,
}) => {
  const [userRating, setUserRating] = useState<number>(0);
  const translateY = useSharedValue(height);
  const backgroundOpacity = useSharedValue(0);

  useEffect(() => {
    loadUserRating();
  }, [exercise]);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 20, stiffness: 300 });
      backgroundOpacity.value = withTiming(1, { duration: 300 });
    } else {
      translateY.value = withSpring(height, { damping: 20, stiffness: 300 });
      backgroundOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [visible]);

  const loadUserRating = async () => {
    try {
      const exerciseId = exercise.id?.toString() || exercise.type;
      const rating = await exerciseRatingService.getAverageRating(exerciseId);
      setUserRating(rating);
    } catch (error) {
      console.error('Failed to load exercise rating:', error);
      setUserRating(0);
    }
  };

  const handleStart = () => {
    translateY.value = withSpring(height, { damping: 20, stiffness: 300 });
    backgroundOpacity.value = withTiming(0, { duration: 300 });
    setTimeout(() => {
      onStart();
    }, 300);
  };

  const handleClose = () => {
    translateY.value = withSpring(height, { damping: 20, stiffness: 300 });
    backgroundOpacity.value = withTiming(0, { duration: 300 });
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          color={i <= rating ? '#F59E0B' : '#D1D5DB'}
          fill={i <= rating ? '#F59E0B' : 'transparent'}
        />
      );
    }
    return stars;
  };

  const renderSteps = () => {
    if (!exercise.steps || exercise.steps.length === 0) {
      return (
        <Text style={styles.noStepsText}>
          This exercise will guide you through the process step by step.
        </Text>
      );
    }

    return exercise.steps.slice(0, 3).map((step, index) => (
      <View key={step.stepNumber} style={styles.stepItem}>
        <View style={styles.stepNumber}>
          <Text style={styles.stepNumberText}>{step.stepNumber}</Text>
        </View>
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>{step.title}</Text>
          {step.description && (
            <Text style={styles.stepDescription}>{step.description}</Text>
          )}
        </View>
      </View>
    ));
  };

  const renderTags = () => {
    const tags = exercise.keywords || [exercise.category, exercise.difficulty].filter(Boolean);
    if (tags.length === 0) return null;

    return (
      <View style={styles.tagsContainer}>
        {tags.slice(0, 4).map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Tag size={12} color="#6B7280" />
            <Text style={styles.tagText}>{typeof tag === 'string' ? tag : String(tag)}</Text>
          </View>
        ))}
      </View>
    );
  };

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.background, backgroundAnimatedStyle]}>
        <TouchableOpacity
          style={styles.backgroundTouchable}
          activeOpacity={1}
          onPress={handleClose}
        >
          <BlurView intensity={20} style={styles.blurView} />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.card, cardAnimatedStyle]}>
        <LinearGradient
          colors={exercise.color || ['#3BB4F5', '#5BC0F8']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.header}>
            {exercise.image && (
              <View style={styles.imageContainer}>
                <Image
                  source={exercise.image}
                  style={styles.exerciseImage}
                  contentFit="cover"
                />
              </View>
            )}

            <View style={styles.headerInfo}>
              <Text style={styles.title}>{exercise.name}</Text>

              <View style={styles.ratingContainer}>
                <View style={styles.starsContainer}>
                  {renderStars(Math.round(userRating))}
                </View>
                <Text style={styles.ratingText}>
                  {userRating > 0 ? `${userRating}/5` : 'Not rated yet'}
                </Text>
              </View>

              <View style={styles.metaContainer}>
                <View style={styles.metaItem}>
                  <Clock size={16} color="#FFFFFF" />
                  <Text style={styles.metaText}>{exercise.duration}</Text>
                </View>
                {exercise.category && (
                  <View style={styles.metaItem}>
                    <Text style={styles.categoryText}>{exercise.category}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.description}>{exercise.description}</Text>

          {renderTags()}

          <View style={styles.stepsSection}>
            <Text style={styles.sectionTitle}>Exercise Steps</Text>
            <View style={styles.stepsContainer}>
              {renderSteps()}
              {exercise.steps && exercise.steps.length > 3 && (
                <Text style={styles.moreStepsText}>
                  +{exercise.steps.length - 3} more steps
                </Text>
              )}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStart}
            activeOpacity={0.8}
          >
            <PlayCircle size={24} color="#FFFFFF" />
            <Text style={styles.startButtonText}>Start Exercise</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default ExerciseSummaryCard;