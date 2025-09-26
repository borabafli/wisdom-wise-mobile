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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Heart } from 'lucide-react-native';
import { onboardingPersonalizationStyles as styles } from '../../styles/components/onboarding/OnboardingPersonalization.styles';

const { height } = Dimensions.get('window');

interface OnboardingPersonalizationScreenProps {
  onContinue: (name: string) => void;
  onSkip: () => void;
}

const OnboardingPersonalizationScreen: React.FC<OnboardingPersonalizationScreenProps> = ({ 
  onContinue, 
  onSkip 
}) => {
  const [name, setName] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const heartPulseAnim = useRef(new Animated.Value(1)).current;
  const inputFocusAnim = useRef(new Animated.Value(0)).current;

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
    <LinearGradient
      colors={['#f0fdfa', '#e6fffa', '#ccfbf1']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Animated.View
            style={[
              styles.contentContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={styles.progressFill} />
              </View>
            </View>
              
            {/* Anu Avatar with Message */}
            <View style={styles.anuContainer}>
              <View style={styles.anuAvatarContainer}>
                <Image
                  source={require('../../../assets/images/turtle-anu-greetings.png')}
                  style={styles.anuAvatar}
                  resizeMode="contain"
                />
              </View>
              
              <View style={styles.speechBubble}>
                <Text style={styles.speechText}>What should I call you?</Text>
                <View style={styles.speechTail} />
              </View>
            </View>

            {/* Name Input Section */}
            <View style={styles.inputSection}>
              <View style={styles.inputContainer}>
                <User size={20} color="#14b8a6" style={styles.inputIcon} />
                <Animated.View
                  style={[
                    styles.textInputWrapper,
                    {
                      borderColor: inputBorderColor,
                      shadowOpacity: inputShadowOpacity,
                    }
                  ]}
                >
                  <TextInput
                    style={styles.textInput}
                    placeholder="Your preferred name"
                    placeholderTextColor="rgba(20, 184, 166, 0.5)"
                    value={name}
                    onChangeText={setName}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    autoCapitalize="words"
                    autoCorrect={false}
                    maxLength={30}
                  />
                </Animated.View>
              </View>
              
              <Text style={styles.inputCaption}>
                You can always change this later in settings
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionContainer}>
              <TouchableOpacity 
                style={styles.primaryButton} 
                onPress={handleContinue}
              >
                <LinearGradient
                  colors={['#5BA3B8', '#357A8A']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.primaryButtonText}>Continue</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.secondaryButton} 
                onPress={handleSkip}
              >
                <Text style={styles.secondaryButtonText}>Skip for now</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default OnboardingPersonalizationScreen;