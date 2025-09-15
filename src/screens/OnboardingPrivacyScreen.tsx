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
import { onboardingPrivacyStyles as styles } from '../styles/components/OnboardingPrivacy.styles';

const { height } = Dimensions.get('window');

interface OnboardingPrivacyScreenProps {
  onContinue: () => void;
}

const OnboardingPrivacyScreen: React.FC<OnboardingPrivacyScreenProps> = ({ 
  onContinue 
}) => {
  const [consentChecked, setConsentChecked] = useState(false);
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

  const handleConsentToggle = () => {
    setConsentChecked(!consentChecked);
  };

  const handleContinue = () => {
    if (consentChecked) {
      onContinue();
    }
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
          <Text style={styles.progressText}>2/10</Text>
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
            <Text style={styles.headline}>Your Privacy Matters</Text>
          </View>

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
                source={require('../../assets/images/turtle-for-privacy-secret1.png')}
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
                  End-to-end encryption protects your data
                </Text>
              </View>

              <View style={styles.privacyItem}>
                <CheckCircle size={20} color="#059669" />
                <Text style={styles.privacyText}>
                  We never share your personal information
                </Text>
              </View>

              <View style={styles.privacyItem}>
                <CheckCircle size={20} color="#059669" />
                <Text style={styles.privacyText}>
                  You can delete your data anytime
                </Text>
              </View>
            </View>


            {/* Consent Checkbox */}
            <TouchableOpacity 
              style={styles.consentContainer}
              onPress={handleConsentToggle}
              activeOpacity={0.7}
            >
              <View style={[
                styles.checkbox,
                consentChecked && styles.checkboxChecked
              ]}>
                {consentChecked && (
                  <CheckCircle size={16} color="#ffffff" />
                )}
              </View>
              <Text style={styles.consentText}>
                I consent to processing of health-related data for personalization
              </Text>
            </TouchableOpacity>

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
              style={[
                styles.primaryButton,
                !consentChecked && styles.primaryButtonDisabled
              ]} 
              onPress={handleContinue}
              disabled={!consentChecked}
            >
              <LinearGradient
                colors={consentChecked ? ['#14b8a6', '#0d9488'] : ['#94a3b8', '#64748b']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={[
                  styles.primaryButtonText,
                  !consentChecked && styles.primaryButtonTextDisabled
                ]}>
                  I Understand & Agree
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