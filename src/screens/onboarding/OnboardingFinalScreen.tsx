import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Leaf, Target, ChevronLeft } from 'lucide-react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { useTranslation } from 'react-i18next';
import { onboardingFinalStyles as styles } from '../../styles/components/onboarding/OnboardingFinal.styles';

const { height } = Dimensions.get('window');

interface OnboardingFinalScreenProps {
  onComplete: () => void;
  onBack?: () => void;
}

const OnboardingFinalScreen: React.FC<OnboardingFinalScreenProps> = ({ onComplete, onBack }) => {
  const { t } = useTranslation();
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

  // Loader states for each feature
  const [showLoader1, setShowLoader1] = useState(false);
  const [showLoader2, setShowLoader2] = useState(false);
  const [showLoader3, setShowLoader3] = useState(false);

  useEffect(() => {
    // Set Android navigation bar color to match background
    NavigationBar.setBackgroundColorAsync('#EDF8F8');

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
    // Animate feature boxes in sequence with longer loaders before checkmarks
    const featureDelay = 1500; // 1.5 seconds between each feature
    const loaderDuration = 1200; // Longer loader duration (was 800ms, now 1200ms)

    // First box
    setTimeout(() => {
      // Show feature box
      Animated.timing(feature1Anim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }).start();

      // Show loader
      setShowLoader1(true);

      // After longer loader time, show checkmark
      setTimeout(() => {
        setShowLoader1(false);
        Animated.timing(tick1Anim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, loaderDuration);
    }, 200);

    // Second box
    setTimeout(() => {
      Animated.timing(feature2Anim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }).start();

      setShowLoader2(true);

      setTimeout(() => {
        setShowLoader2(false);
        Animated.timing(tick2Anim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, loaderDuration);
    }, featureDelay + 200);

    // Third box
    setTimeout(() => {
      Animated.timing(feature3Anim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }).start();

      setShowLoader3(true);

      setTimeout(() => {
        setShowLoader3(false);
        Animated.timing(tick3Anim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, loaderDuration);
    }, (featureDelay * 2) + 200);

    // Enable button after all animations (adjusted for longer timing)
    setTimeout(() => {
      setIsButtonEnabled(true);
    }, 5200); // Updated timing: 200 + (1500*2) + 1200 + 300 = 5200ms
  };

  const handleContinue = () => {
    onComplete();
  };

  const features = [
    {
      icon: Settings,
      title: t('onboarding.final.features.analyzing.title'),
      description: "",
      hasCheckmark: false,
    },
    {
      icon: Leaf,
      title: t('onboarding.final.features.creating.title'),
      description: "",
      hasArrow: false,
    },
    {
      icon: Target,
      title: t('onboarding.final.features.preparing.title'),
      description: "",
      hasArrow: false,
    },
  ];


  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#EDF8F8" translucent={false} />
      <SafeAreaView style={styles.safeArea}>
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
          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.mainTitle}>{t('onboarding.final.mainTitle')}</Text>
            <Text style={styles.subtitle}>
              {t('onboarding.final.subtitle')}
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              const featureAnim = index === 0 ? feature1Anim : index === 1 ? feature2Anim : feature3Anim;
              const tickAnim = index === 0 ? tick1Anim : index === 1 ? tick2Anim : tick3Anim;
              const showLoader = index === 0 ? showLoader1 : index === 1 ? showLoader2 : showLoader3;

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
                        outputRange: ['rgba(54, 101, 125, 0.05)', 'rgba(54, 101, 125, 0.1)'],
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
                          outputRange: ['rgba(54, 101, 125, 0.2)', 'rgba(54, 101, 125, 0.3)'],
                        }),
                      }
                    ]}
                  >
                    <Animated.View
                      style={{
                        opacity: featureAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.3, 1],
                        }),
                      }}
                    >
                      <IconComponent
                        size={24}
                        color="#36657d"
                        strokeWidth={2}
                      />
                    </Animated.View>
                  </Animated.View>
                  <Animated.Text
                    style={[
                      styles.featureTitle,
                      {
                        color: featureAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['rgba(31, 41, 55, 0.3)', 'rgba(31, 41, 55, 1)'],
                        }),
                      }
                    ]}
                  >
                    {feature.title}
                  </Animated.Text>

                  {/* Show loader or checkmark */}
                  {showLoader ? (
                    <View style={styles.loaderContainer}>
                      <ActivityIndicator size="small" color="#36657d" />
                    </View>
                  ) : (
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
                source={require('../../../assets/images/onboarding/turtle-welcome-calm-sitting.png')}
                style={styles.mainTurtleImage}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Bottom area with button only */}
          <View style={styles.bottomFixedArea}>
            {/* Action Button */}
            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={[styles.primaryButton, !isButtonEnabled && styles.disabledButton]}
                onPress={isButtonEnabled ? handleContinue : undefined}
                activeOpacity={isButtonEnabled ? 0.8 : 1}
                disabled={!isButtonEnabled}
              >
                <Text style={[styles.primaryButtonText, !isButtonEnabled && styles.disabledButtonText]}>
                  {t('onboarding.final.continueButton')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

export default OnboardingFinalScreen;