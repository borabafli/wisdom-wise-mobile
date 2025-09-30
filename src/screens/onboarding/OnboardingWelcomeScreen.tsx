import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, ResizeMode } from 'expo-av';
import * as NavigationBar from 'expo-navigation-bar';
import { useTranslation } from 'react-i18next';
import { onboardingWelcomeStyles as styles } from '../../styles/components/onboarding/OnboardingWelcome.styles';

const { height } = Dimensions.get('window');

interface OnboardingWelcomeScreenProps {
  onContinue: () => void;
}

const OnboardingWelcomeScreen: React.FC<OnboardingWelcomeScreenProps> = ({ onContinue }) => {
  const { t } = useTranslation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const secondTextFadeAnim = useRef(new Animated.Value(0)).current;
  const overlayFadeAnim = useRef(new Animated.Value(1)).current; // Start visible, fade out
  const videoFloatAnim = useRef(new Animated.Value(20)).current; // Float in animation
  const buttonFadeAnim = useRef(new Animated.Value(0)).current; // Button fades in
  const buttonSlideAnim = useRef(new Animated.Value(30)).current; // Button floats in

  useEffect(() => {
    // Set Android navigation bar color to match background
    NavigationBar.setBackgroundColorAsync('#EDF8F8');
    // Start animations immediately to prevent black flash
    Animated.sequence([
      // Shorter delay to reduce black flash
      Animated.delay(200),
      // Parallel video float and overlay fade for smoother effect
      Animated.parallel([
        // Video floats in gently
        Animated.timing(videoFloatAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        // Overlay fades out to reveal video
        Animated.timing(overlayFadeAnim, {
          toValue: 0,
          duration: 1200, // Smooth fade
          useNativeDriver: true,
        }),
      ]),
      // Small delay before text appears
      Animated.delay(200),
      // Then text content appears
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(textFadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Animated text appears after a delay
      Animated.timing(secondTextFadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
      // Delay then button fade + float in
      Animated.delay(500),
      Animated.parallel([
        Animated.timing(buttonFadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(buttonSlideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#EDF8F8" translucent={false} />
      <SafeAreaView style={styles.safeArea}>
        {/* Main Content */}
        <View style={styles.contentContainer}>
          {/* Anu Video - Full Screen - Always visible, with floating animation */}
          <Animated.View
            style={[
              styles.imageContainer,
              {
                transform: [{ translateY: videoFloatAnim }],
              }
            ]}
          >
            <View style={styles.videoContainer}>
              {/* Video - starts immediately */}
              <Video
                source={require('../../../assets/images/onboarding/videos/confetti-turtle-screen-3.mp4')}
                style={styles.antuImage}
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay={true}
                isLooping={true}
                isMuted={true}
                useNativeControls={false}
              />
              {/* Solid overlay that fades out */}
              <Animated.View
                style={[
                  styles.backgroundOverlay,
                  {
                    opacity: overlayFadeAnim,
                  }
                ]}
              />
            </View>
          </Animated.View>

          {/* Text Content */}
          <View style={styles.textContainer}>
            {/* Initial greeting */}
            <Animated.View style={[styles.greetingContainer, { opacity: textFadeAnim }]}>
              <Text style={styles.greetingText}>{t('onboarding.welcome.greeting')}</Text>
            </Animated.View>

            {/* Animated subtitle */}
            <Animated.View style={[styles.subtitleContainer, { opacity: secondTextFadeAnim }]}>
              <Text style={styles.subtitleText}>{t('onboarding.welcome.subtitle')}</Text>
            </Animated.View>
          </View>

          {/* Action Button */}
          <Animated.View
            style={[
              styles.actionContainer,
              {
                opacity: buttonFadeAnim,
                transform: [{ translateY: buttonSlideAnim }],
              }
            ]}
          >
            <TouchableOpacity style={styles.primaryButton} onPress={onContinue}>
              <Text style={styles.primaryButtonText}>{t('onboarding.welcome.startButton')}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default OnboardingWelcomeScreen;