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
import { Lock, Leaf, Target } from 'lucide-react-native';
import { onboardingFinalStyles as styles } from '../../styles/components/onboarding/OnboardingFinal.styles';

const { height } = Dimensions.get('window');

interface OnboardingFinalScreenProps {
  onComplete: () => void;
}

const OnboardingFinalScreen: React.FC<OnboardingFinalScreenProps> = ({ onComplete }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  
  // Animation values for feature boxes
  const feature1Anim = useRef(new Animated.Value(0)).current;
  const feature2Anim = useRef(new Animated.Value(0)).current;
  const feature3Anim = useRef(new Animated.Value(0)).current;
  const tick1Anim = useRef(new Animated.Value(0)).current;
  const tick2Anim = useRef(new Animated.Value(0)).current;
  const tick3Anim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial entrance animations
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
    ]).start(() => {
      // Start loading animation after entrance animation completes
      startLoadingAnimation();
    });
  }, []);

  const startLoadingAnimation = () => {
    // Animate feature boxes in sequence with progress bar
    const totalDuration = 3000; // 3 seconds total
    const featureDelay = totalDuration / 3; // 1000ms each

    // Start progress bar animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: totalDuration,
      useNativeDriver: false,
    }).start();

    // Animate feature boxes smoothly in sync with progress bar
    // First box: starts at 0ms, completes at 1000ms (33% of progress)
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(feature1Anim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.sequence([
          Animated.delay(600),
          Animated.timing(tick1Anim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }, 200);

    // Second box: starts at 1000ms, completes at 2000ms (66% of progress)
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(feature2Anim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.sequence([
          Animated.delay(600),
          Animated.timing(tick2Anim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }, featureDelay + 200);

    // Third box: starts at 2000ms, completes at 3000ms (100% of progress)
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(feature3Anim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.sequence([
          Animated.delay(600),
          Animated.timing(tick3Anim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }, (featureDelay * 2) + 200);

    // Enable button after animation
    setTimeout(() => {
      setIsButtonEnabled(true);
    }, totalDuration);
  };

  const handleContinue = () => {
    onComplete();
  };

  const features = [
    {
      icon: Lock,
      title: "Your thoughts are safe with Anu",
      description: "Everything you share is secure & private",
      hasCheckmark: false,
    },
    {
      icon: Leaf,
      title: "Anu has learned about you",
      description: "Your experience with Anu is personalized",
      hasArrow: false,
    },
    {
      icon: Target,
      title: "Your exercises are prepard",
      description: "Anu will use your insights to provide truly personal guidance just for you",
      hasArrow: false,
    },
  ];


  return (
    <LinearGradient
      colors={['#F8FAFB', '#E8F4F1']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <Animated.View 
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.mainTitle}>Your journey with Anu begins!</Text>
            <Text style={styles.subtitle}>
              Your personalized mental wellness companion is ready to support you.
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              const featureAnim = index === 0 ? feature1Anim : index === 1 ? feature2Anim : feature3Anim;
              const tickAnim = index === 0 ? tick1Anim : index === 1 ? tick2Anim : tick3Anim;
              
              return (
                <Animated.View 
                  key={index} 
                  style={[
                    styles.featureItem,
                    {
                      backgroundColor: featureAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['rgba(255, 255, 255, 0.3)', '#FFFFFF'],
                      }),
                      borderColor: featureAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['rgba(45, 178, 157, 0.05)', 'rgba(45, 178, 157, 0.1)'],
                      }),
                    }
                  ]}
                >
                  <Animated.View 
                    style={[
                      styles.featureIconContainer,
                      {
                        backgroundColor: featureAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['rgba(45, 178, 157, 0.2)', 'rgba(45, 178, 157, 0.3)'],
                        }),
                      }
                    ]}
                  >
                    <IconComponent 
                      size={24} 
                      color="#2DB29D"
                      strokeWidth={2}
                    />
                  </Animated.View>
                  <View style={styles.featureContent}>
                    <Animated.Text 
                      style={[
                        styles.featureTitle,
                        {
                          color: featureAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['rgba(20, 83, 95, 0.3)', 'rgba(20, 83, 95, 1)'],
                          }),
                        }
                      ]}
                    >
                      {feature.title}
                    </Animated.Text>
                    <Animated.Text 
                      style={[
                        styles.featureDescription,
                        {
                          color: featureAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['rgba(31, 81, 88, 0.3)', 'rgba(31, 81, 88, 0.8)'],
                          }),
                        }
                      ]}
                    >
                      {feature.description}
                    </Animated.Text>
                  </View>
                  
                  {/* Animated tick that appears on the right */}
                  <Animated.View 
                    style={[
                      styles.tickContainer,
                      {
                        opacity: tickAnim,
                        transform: [
                          {
                            scale: tickAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.5, 1],
                            }),
                          },
                        ],
                      }
                    ]}
                  >
                    <Text style={styles.tickMark}>✓</Text>
                  </Animated.View>
                  
                  {feature.hasCheckmark && !tickAnim._value && (
                    <View style={styles.checkmarkContainer}>
                      <Text style={styles.checkmark}>✓</Text>
                    </View>
                  )}
                  {feature.hasArrow && !tickAnim._value && (
                    <View style={styles.arrowContainer}>
                      <Text style={styles.arrow}>〉</Text>
                    </View>
                  )}
                </Animated.View>
              );
            })}
          </View>


          {/* Bottom section with turtle */}
          <View style={styles.bottomSection}>
            {/* Turtle Image */}
            <View style={styles.mainTurtleContainer}>
              <Image
                source={require('../../../assets/images/onboarding/turtle-sitting-smiling.png')}
                style={styles.mainTurtleImage}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Bottom area with progress and button */}
          <View style={styles.bottomFixedArea}>
            {/* Progress Bar */}
            <View style={styles.mainProgressContainer}>
              <View style={styles.progressBarBackground}>
                <Animated.View 
                  style={[
                    styles.progressBarFill,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                    }
                  ]}
                />
              </View>
            </View>

            {/* Action Button */}
            <View style={styles.actionContainer}>
              <TouchableOpacity 
                style={[styles.primaryButton, !isButtonEnabled && styles.disabledButton]} 
                onPress={isButtonEnabled ? handleContinue : undefined}
                activeOpacity={isButtonEnabled ? 0.8 : 1}
                disabled={!isButtonEnabled}
              >
                <Text style={[styles.primaryButtonText, !isButtonEnabled && styles.disabledButtonText]}>
                  Start Your Journey
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default OnboardingFinalScreen;