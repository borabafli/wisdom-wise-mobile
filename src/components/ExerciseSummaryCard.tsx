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
import { Star, Clock, Tag, PlayCircle, X, CheckCircle } from 'lucide-react-native';
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
      translateY.value = withSpring(0, {
        damping: 25,
        stiffness: 200,
        mass: 0.8,
        overshootClamping: true
      });
      backgroundOpacity.value = withTiming(1, { duration: 350 });
    } else {
      translateY.value = withTiming(height, { duration: 250 });
      backgroundOpacity.value = withTiming(0, { duration: 250 });
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
    translateY.value = withTiming(height, { duration: 250 });
    backgroundOpacity.value = withTiming(0, { duration: 250 });
    setTimeout(() => {
      onStart();
    }, 250);
  };

  const handleClose = () => {
    translateY.value = withTiming(height, { duration: 250 });
    backgroundOpacity.value = withTiming(0, { duration: 250 });
    setTimeout(() => {
      onClose();
    }, 250);
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
    // Check if steps exist in the exercise data
    const steps = exercise.steps || [];

    if (steps.length === 0) {
      return (
        <View style={styles.noStepsContainer}>
          <Text style={styles.noStepsText}>
            This exercise will guide you through the process step by step.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <View key={step.stepNumber || index + 1} style={styles.stepItem}>
            {/* Step Circle and Connector Line */}
            <View style={styles.stepIndicatorContainer}>
              <View style={styles.stepCircle}>
                <Text style={styles.stepCircleNumber}>
                  {step.stepNumber || index + 1}
                </Text>
              </View>
              {index < steps.length - 1 && <View style={styles.stepConnectorLine} />}
            </View>

            {/* Step Content */}
            <View style={styles.stepContent}>
              <View style={[
                styles.stepContentCard,
                index === steps.length - 1 && { borderBottomWidth: 0 }
              ]}>
                <Text style={styles.stepTitle}>
                  {step.title || step.name || `Step ${index + 1}`}
                </Text>
                {(step.description || step.instruction) && (
                  <Text style={styles.stepDescription}>
                    {step.description || step.instruction}
                  </Text>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderTags = () => {
    const tags = [];

    // Add duration tag with clock icon
    if (exercise.duration) {
      tags.push({
        text: exercise.duration,
        type: 'duration',
        icon: 'clock'
      });
    }

    // Add category tag
    if (exercise.category) {
      tags.push({
        text: exercise.category,
        type: 'category',
        icon: 'tag'
      });
    }

    // Extract benefit from description (words like "reduce", "improve", "enhance", etc.)
    if (exercise.description) {
      const benefitKeywords = ['reduce', 'improve', 'enhance', 'boost', 'calm', 'relax', 'focus', 'clarity', 'balance'];
      const descriptionWords = exercise.description.toLowerCase().split(' ');
      const foundBenefits = benefitKeywords.filter(keyword =>
        descriptionWords.some(word => word.includes(keyword))
      );

      if (foundBenefits.length > 0) {
        tags.push({
          text: `${foundBenefits[0]} stress`,
          type: 'benefit',
          icon: 'heart'
        });
      }
    }

    // Add approach (CBT, mindfulness, etc. from keywords)
    if (exercise.keywords && Array.isArray(exercise.keywords)) {
      const approachKeywords = ['cbt', 'mindfulness', 'meditation', 'breathing', 'cognitive'];
      const foundApproach = exercise.keywords.find(keyword =>
        approachKeywords.includes(keyword.toLowerCase())
      );

      if (foundApproach) {
        tags.push({
          text: foundApproach.toUpperCase(),
          type: 'approach',
          icon: 'brain'
        });
      }
    }

    if (tags.length === 0) return null;

    return tags.slice(0, 4).map((tag, index) => (
      <View key={index} style={[styles.tag, styles[`tag${tag.type.charAt(0).toUpperCase() + tag.type.slice(1)}`]]}>
        <Text style={[styles.tagText, styles[`tagText${tag.type.charAt(0).toUpperCase() + tag.type.slice(1)}`]]}>{tag.text}</Text>
      </View>
    ));
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
        {/* Full-width Image Header */}
        <View style={styles.imageHeader}>
          {exercise.image ? (
            <Image
              source={exercise.image}
              style={styles.fullWidthImage}
              contentFit="cover"
            />
          ) : (
            <LinearGradient
              colors={exercise.color || ['#3BB4F5', '#5BC0F8']}
              style={styles.fallbackGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          )}

          {/* Close Button Overlay */}
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Star Rating Overlay */}
          <View style={styles.ratingOverlay}>
            <View style={styles.starsContainer}>
              {renderStars(Math.round(userRating))}
            </View>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Exercise Name in Ubuntu Bold */}
          <Text style={styles.exerciseName}>{exercise.name}</Text>

          {/* Short Description */}
          {exercise.shortDescription && (
            <Text style={styles.exerciseShortDescription}>{exercise.shortDescription}</Text>
          )}

          {/* Benefit Tags */}
          <View style={styles.benefitTagsContainer}>
            {renderTags()}
          </View>

          {/* Steps Count and Duration */}
          <View style={styles.metaInfoContainer}>
            <View style={styles.metaItem}>
              <CheckCircle size={16} color="#6B7280" />
              <Text style={styles.metaText}>
                {exercise.steps ? exercise.steps.length : 3} steps
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Clock size={16} color="#6B7280" />
              <Text style={styles.metaText}>{exercise.duration}</Text>
            </View>
          </View>

          {/* Exercise Steps with Connected Circles */}
          <View style={styles.stepsSection}>
            <Text style={styles.sectionTitle}>Steps</Text>
            {renderSteps()}
          </View>
        </ScrollView>

        {/* Start Exercise Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStart}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>Start Exercise</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default ExerciseSummaryCard;