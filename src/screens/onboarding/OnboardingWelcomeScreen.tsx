import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Sparkles } from 'lucide-react-native';
import { onboardingWelcomeStyles as styles } from '../../styles/components/onboarding/OnboardingWelcome.styles';

const { height } = Dimensions.get('window');

interface OnboardingWelcomeScreenProps {
  onContinue: () => void;
}

const OnboardingWelcomeScreen: React.FC<OnboardingWelcomeScreenProps> = ({ onContinue }) => {
  const [showModal, setShowModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const turtleWaveAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

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

    // Turtle wave animation (subtle)
    const waveAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(turtleWaveAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(turtleWaveAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    waveAnimation.start();

    // Sparkle animation
    const sparkleAnimation = Animated.loop(
      Animated.timing(sparkleAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    );
    sparkleAnimation.start();
  }, []);

  const turtleRotation = turtleWaveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '2deg'],
  });

  const sparkleOpacity = sparkleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  });

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
          <Text style={styles.progressText}>1/10</Text>
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
          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.headline}>Hi, I'm Anu 🐢</Text>
            <Text style={styles.subtext}>
              Your personalized AI therapist, here to help you feel{'\n'}
              calmer and understand yourself better.
            </Text>
          </View>

          {/* Anu Character */}
          <View style={styles.characterContainer}>
            <Animated.View
              style={[
                styles.sparkleContainer,
                {
                  opacity: sparkleOpacity,
                }
              ]}
            >
              <Sparkles size={20} color="#5eead4" />
            </Animated.View>
            
            <Animated.View
              style={[
                styles.turtleContainer,
                {
                  transform: [{ rotate: turtleRotation }],
                }
              ]}
            >
              <Image
                source={require('../../../assets/images/Teal watercolor single element/home-background.png')}
                style={styles.turtleImage}
                resizeMode="contain"
              />
            </Animated.View>

            <Animated.View
              style={[
                styles.sparkleContainer2,
                {
                  opacity: sparkleOpacity,
                }
              ]}
            >
              <Sparkles size={16} color="#2dd4bf" />
            </Animated.View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={onContinue}>
              <LinearGradient
                colors={['#14b8a6', '#0d9488']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.primaryButtonText}>Nice to meet you!</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryButton} 
              onPress={() => setShowModal(true)}
            >
              <Text style={styles.secondaryButtonText}>Learn about Anu</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Learn About Anu Modal */}
        <Modal
          visible={showModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowModal(false)}
        >
          <LinearGradient
            colors={['#f0fdfa', '#ffffff']}
            style={styles.modalContainer}
          >
            <SafeAreaView style={styles.modalContent}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleContainer}>
                  <Text style={styles.modalTitle}>🐢 About Anu</Text>
                </View>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowModal(false)}
                >
                  <X size={24} color="#64748b" />
                </TouchableOpacity>
              </View>

              {/* Modal Content */}
              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                <View style={styles.modalBodyContainer}>
                  {/* Anu Image */}
                  <View style={styles.modalAnuContainer}>
                    <Image
                      source={require('../../../assets/images/Teal watercolor single element/home-background.png')}
                      style={styles.modalAnuImage}
                      resizeMode="contain"
                    />
                  </View>

                  <Text style={styles.modalDescription}>
                    I'm your personalized AI therapist powered by advanced AI models. 
                    Here's what makes me special:
                  </Text>

                  <View style={styles.featureList}>
                    <View style={styles.featureItem}>
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                      <Text style={styles.featureText}>
                        I remember our conversations and learn about you over time
                      </Text>
                    </View>

                    <View style={styles.featureItem}>
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                      <Text style={styles.featureText}>
                        I provide personalized insights based on your unique patterns
                      </Text>
                    </View>

                    <View style={styles.featureItem}>
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                      <Text style={styles.featureText}>
                        I suggest exercises tailored to your specific needs
                      </Text>
                    </View>

                    <View style={styles.featureItem}>
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                      <Text style={styles.featureText}>
                        I'm available 24/7 whenever you need support
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.modalFooter}>
                    I combine evidence-based therapy techniques (CBT, ACT, Mindfulness) 
                    with AI to provide you with the most effective support possible.
                  </Text>
                </View>
              </ScrollView>
            </SafeAreaView>
          </LinearGradient>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default OnboardingWelcomeScreen;