import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { onboardingWelcomeStyles as styles } from '../../styles/components/onboarding/OnboardingWelcome.styles';

const { height } = Dimensions.get('window');

interface OnboardingWelcomeScreenProps {
  onContinue: () => void;
}

const OnboardingWelcomeScreen: React.FC<OnboardingWelcomeScreenProps> = ({ onContinue }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const secondTextFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered entrance animations
    Animated.sequence([
      // Image and "Hey, I'm Anu..." appear first
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
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={['#F8FAFB', '#E8F4F1']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Main Content */}
        <View style={styles.contentContainer}>
          {/* Anu Image - Full Screen */}
          <Animated.View 
            style={[
              styles.imageContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <Image
              source={require('../../../assets/images/onboarding/turtle-welcome-calm-smile.png')}
              style={styles.antuImage}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Text Content */}
          <View style={styles.textContainer}>
            {/* Initial greeting */}
            <Animated.View style={[styles.greetingContainer, { opacity: textFadeAnim }]}>
              <Text style={styles.greetingText}>Hey, I'm Anu...</Text>
            </Animated.View>

            {/* Animated subtitle */}
            <Animated.View style={[styles.subtitleContainer, { opacity: secondTextFadeAnim }]}>
              <Text style={styles.subtitleText}>...your personal guide on the path to self-discovery.</Text>
            </Animated.View>
          </View>

          {/* Action Button */}
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={onContinue}>
              <Text style={styles.primaryButtonText}>Nice to meet you!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default OnboardingWelcomeScreen;