import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight } from 'lucide-react-native';
import { onboardingCurrentStateStyles as styles } from '../../styles/components/onboarding/OnboardingCurrentState.styles';

const { width, height } = Dimensions.get('window');

interface OnboardingCurrentStateScreenProps {
  onContinue: (challenges: string[], goals: string[]) => void;
  onSkip: () => void;
}

const COMMON_CHALLENGES = [
  'Anxiety',
  'Stress',
  'Sleep issues',
  'Low mood',
  'Focus problems',
  'Relationship issues',
  'Work pressure',
  'Self-confidence',
];

const COMMON_GOALS = [
  'Better sleep',
  'Reduce anxiety',
  'Improve mood',
  'Better focus',
  'Stress management',
  'Self-care routine',
  'Mindfulness practice',
  'Emotional balance',
];

const OnboardingCurrentStateScreen: React.FC<OnboardingCurrentStateScreenProps> = ({ onContinue, onSkip }) => {
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  
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

  const toggleChallenge = (challenge: string) => {
    setSelectedChallenges(prev => 
      prev.includes(challenge) 
        ? prev.filter(c => c !== challenge)
        : [...prev, challenge]
    );
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const handleContinue = () => {
    onContinue(selectedChallenges, selectedGoals);
  };

  const canContinue = selectedChallenges.length > 0 || selectedGoals.length > 0;

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

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
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
              
              <Text style={styles.title}>What brings you here?</Text>
              <Text style={styles.subtitle}>Help me understand your current challenges and goals</Text>
            </View>

            {/* Challenges Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Current challenges (optional)</Text>
              <View style={styles.optionsContainer}>
                {COMMON_CHALLENGES.map((challenge) => (
                  <TouchableOpacity
                    key={challenge}
                    style={[
                      styles.optionButton,
                      selectedChallenges.includes(challenge) && styles.optionButtonSelected
                    ]}
                    onPress={() => toggleChallenge(challenge)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.optionText,
                      selectedChallenges.includes(challenge) && styles.optionTextSelected
                    ]}>
                      {challenge}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Goals Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>What would you like to work on? (optional)</Text>
              <View style={styles.optionsContainer}>
                {COMMON_GOALS.map((goal) => (
                  <TouchableOpacity
                    key={goal}
                    style={[
                      styles.optionButton,
                      selectedGoals.includes(goal) && styles.optionButtonSelected
                    ]}
                    onPress={() => toggleGoal(goal)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.optionText,
                      selectedGoals.includes(goal) && styles.optionTextSelected
                    ]}>
                      {goal}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.skipButton} 
            onPress={onSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.continueButton,
              canContinue && styles.continueButtonEnabled
            ]} 
            onPress={handleContinue}
            disabled={!canContinue}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.continueButtonText,
              canContinue && styles.continueButtonTextEnabled
            ]}>
              Continue
            </Text>
            <ChevronRight 
              size={20} 
              color={canContinue ? '#ffffff' : '#a0a0a0'} 
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default OnboardingCurrentStateScreen;