import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  Dimensions,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shield, CheckCircle } from 'lucide-react-native';
import { onboardingPrivacyStyles as styles } from '../../styles/components/onboarding/OnboardingPrivacy.styles';

const { height } = Dimensions.get('window');

interface OnboardingPrivacyScreenProps {
  onContinue: () => void;
}

const OnboardingPrivacyScreen: React.FC<OnboardingPrivacyScreenProps> = ({ 
  onContinue 
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const shieldPulseAnim = useRef(new Animated.Value(1)).current;

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

    // Shield pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shieldPulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(shieldPulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, []);

  const handlePrivacyPolicyPress = async () => {
    // Open privacy policy link
    try {
      await Linking.openURL('https://wisdomwise.app/privacy');
    } catch (error) {
      console.error('Could not open Privacy Policy URL:', error);
      // You could show an alert here if needed
    }
  };

  const handleTermsOfServicePress = async () => {
    // Open terms of service link  
    try {
      await Linking.openURL('https://wisdomwise.app/terms');
    } catch (error) {
      console.error('Could not open Terms of Service URL:', error);
      // You could show an alert here if needed
    }
  };

  const handleContinue = () => {
    onContinue();
  };

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

        <Animated.View 
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          {/* Privacy Character & Shield */}
          <View style={styles.characterContainer}>
            <Animated.View
              style={[
                styles.shieldContainer,
                {
                  transform: [{ scale: shieldPulseAnim }],
                }
              ]}
            >
              <Shield size={40} color="#14b8a6" />
              <View style={styles.checkmarkOverlay}>
                <CheckCircle size={20} color="#059669" />
              </View>
            </Animated.View>
            
            <View style={styles.turtleContainer}>
              <Image
                source={require('../../../assets/images/turtle-for-privacy-secret1.png')}
                style={styles.turtleImage}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Privacy Points */}
          <ScrollView style={styles.privacyContent} showsVerticalScrollIndicator={false}>
            <View style={styles.privacyList}>
              <View style={styles.privacyItem}>
                <CheckCircle size={20} color="#059669" />
                <Text style={styles.privacyText}>
                  Your conversations are kept private and secure
                </Text>
              </View>

              <View style={styles.privacyItem}>
                <CheckCircle size={20} color="#059669" />
                <Text style={styles.privacyText}>
                  We only use your data to provide better support
                </Text>
              </View>

              <View style={styles.privacyItem}>
                <CheckCircle size={20} color="#059669" />
                <Text style={styles.privacyText}>
                  You control your information and can delete it anytime
                </Text>
              </View>
            </View>

            {/* Legal Links */}
            <View style={styles.legalLinksContainer}>
              <TouchableOpacity onPress={handlePrivacyPolicyPress}>
                <Text style={styles.legalLink}>Privacy Policy</Text>
              </TouchableOpacity>
              <Text style={styles.linkSeparator}>|</Text>
              <TouchableOpacity onPress={handleTermsOfServicePress}>
                <Text style={styles.legalLink}>Terms of Service</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#5BA3B8', '#357A8A']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.primaryButtonText}>
                  Got it, let's continue
                </Text>
              </LinearGradient>
            </TouchableOpacity>

          </View>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default OnboardingPrivacyScreen;