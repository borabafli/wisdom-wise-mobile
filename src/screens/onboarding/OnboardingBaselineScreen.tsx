import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight } from 'lucide-react-native';
import { onboardingBaselineStyles as styles } from '../../styles/components/onboarding/OnboardingBaseline.styles';
import { MoodSlider } from '../../components/chat/MoodSlider';
import { storageService } from '../../services/storageService';
import { moodRatingService } from '../../services/moodRatingService';

const { width, height } = Dimensions.get('window');

interface OnboardingBaselineScreenProps {
  onContinue: (moodRating: number) => void;
  onSkip: () => void;
}

const OnboardingBaselineScreen: React.FC<OnboardingBaselineScreenProps> = ({ onContinue, onSkip }) => {
  const [moodRating, setMoodRating] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const avatarPulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for avatar
    const pulseAnimation = () => {
      Animated.sequence([
        Animated.timing(avatarPulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(avatarPulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]).start(() => pulseAnimation());
    };
    pulseAnimation();
  }, []);

  const handleMoodSelect = (rating: number) => {
    setMoodRating(rating);
    // Don't auto-complete, just store the selection
  };

  const handleContinue = async () => {
    if (moodRating === null) return;
    
    setIsCompleted(true);
    
    // Save baseline mood data to both systems
    try {
      // 1. Save to UserProfile for baseline record
      await storageService.updateUserProfile({
        baselineMood: moodRating,
        baselineMoodTimestamp: new Date().toISOString(),
      });

      // 2. Save to moodRatingService so it appears in mood tracking/insights
      await moodRatingService.saveMoodRating({
        id: `baseline_${Date.now()}`,
        exerciseType: 'onboarding',
        exerciseName: 'Baseline Check-in',
        moodRating: moodRating,
        notes: 'Initial baseline mood from onboarding',
        stage: 'baseline',
        timestamp: new Date().toISOString(),
      });

      console.log('Baseline mood saved to both systems:', moodRating);
    } catch (error) {
      console.error('Error saving baseline mood:', error);
    }

    onContinue(moodRating);
  };

  const canContinue = moodRating !== null;

  return (
    <LinearGradient
      colors={['#f0fdfa', '#e6fffa', '#ccfbf1']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
        </View>

        {/* Main Content */}
        <Animated.View 
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <Animated.View
              style={[
                styles.avatarContainer,
                {
                  transform: [{ scale: avatarPulseAnim }],
                }
              ]}
            >
              <Image
                source={require('../../../assets/images/turtle-anu-greetings.png')}
                style={styles.avatarImage}
                resizeMode="contain"
              />
            </Animated.View>
            
            <Text style={styles.title}>Let's check in</Text>
            <Text style={styles.subtitle}>This helps me track your progress over time</Text>
          </View>

          {/* Mood Slider Section */}
          <View style={styles.moodSection}>
            <Text style={styles.moodLabel}>How's your mood today?</Text>
            
            <View style={styles.sliderContainer}>
              <MoodSlider
                onRatingChange={handleMoodSelect}
                onComplete={() => {}} // Disable auto-complete for onboarding
                title=""
                subtitle=""
                type="mood"
                variant="default"
                allowReselection={true}
              />
            </View>
          </View>

          {/* Continue Button - show when mood is selected */}
          {!isCompleted && canContinue && (
            <View style={styles.continueButtonContainer}>
              <TouchableOpacity 
                style={styles.continueButton} 
                onPress={handleContinue}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#5BA3B8', '#357A8A']}
                  style={styles.continueButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.continueButtonText}>Continue</Text>
                  <ChevronRight size={20} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        {/* Skip Button */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.skipButton} 
            onPress={onSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default OnboardingBaselineScreen;