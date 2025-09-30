import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Heart, ChevronLeft } from 'lucide-react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { useTranslation } from 'react-i18next';
import { onboardingPersonalizationStyles as styles } from '../../styles/components/onboarding/OnboardingPersonalization.styles';

const { height } = Dimensions.get('window');

interface OnboardingPersonalizationScreenProps {
  onContinue: (name: string) => void;
  onSkip: () => void;
  onBack?: () => void;
}

const OnboardingPersonalizationScreen: React.FC<OnboardingPersonalizationScreenProps> = ({
  onContinue,
  onSkip,
  onBack
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const heartPulseAnim = useRef(new Animated.Value(1)).current;
  const inputFocusAnim = useRef(new Animated.Value(0)).current;
  const buttonFadeAnim = useRef(new Animated.Value(0)).current;
  const buttonSlideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Set Android navigation bar color to match background
    NavigationBar.setBackgroundColorAsync('#EDF8F8');

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

    // Button fades in after main animations (no float/slide)
    setTimeout(() => {
      Animated.timing(buttonFadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 1200); // Appear after main content

    // Heart pulse animation
    const heartAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(heartPulseAnim, {
          toValue: 1.2,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(heartPulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    heartAnimation.start();

    return () => {
      heartAnimation.stop();
    };
  }, []);

  // Input focus animations
  useEffect(() => {
    Animated.timing(inputFocusAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const handleContinue = () => {
    onContinue(name.trim());
  };

  const handleSkip = () => {
    onSkip();
  };

  const inputBorderColor = inputFocusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(20, 184, 166, 0.3)', 'rgba(20, 184, 166, 1)'],
  });

  const inputShadowOpacity = inputFocusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.3],
  });

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#EDF8F8" translucent={false} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Back Button */}
            {onBack && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={onBack}
                activeOpacity={0.7}
              >
                <ChevronLeft size={24} color="#36657d" />
              </TouchableOpacity>
            )}
            <Animated.View
              style={[
                styles.contentContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }
              ]}
            >
            {/* Header Text */}
            <View style={styles.headerContainer}>
              <Text style={styles.headline}>{t('onboarding.personalization.headline')}</Text>
              <Text style={styles.promptText}>
                {t('onboarding.personalization.promptText')}
              </Text>
            </View>

            {/* Turtle Image */}
            <View style={styles.imageContainer}>
              <Image
                source={require('../../../assets/images/onboarding/turtle-welcome-calm-smile.png')}
                style={styles.turtleImage}
                resizeMode="contain"
              />
            </View>

            {/* Name Input Section */}
            <View style={styles.inputSection}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder={t('onboarding.personalization.placeholder')}
                  placeholderTextColor="#9CA3AF"
                  value={name}
                  onChangeText={setName}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  autoCapitalize="words"
                  autoCorrect={false}
                  maxLength={30}
                />
              </View>

              <Text style={styles.inputCaption}>
                {t('onboarding.personalization.caption')}
              </Text>
            </View>

            {/* Action Buttons */}
            <Animated.View
              style={[
                styles.actionContainer,
                {
                  opacity: buttonFadeAnim,
                }
              ]}
            >
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleContinue}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>{t('onboarding.personalization.continueButton')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleSkip}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>{t('onboarding.personalization.skipButton')}</Text>
              </TouchableOpacity>
            </Animated.View>

            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default OnboardingPersonalizationScreen;