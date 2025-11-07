import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { authService } from '../../services/authService';
import { authScreenStyles as styles } from '../../styles/components/AuthScreens.styles';

interface VerificationScreenProps {
  email: string;
  onNavigateToSignIn: () => void;
  onVerificationSuccess: () => void;
}

export const VerificationScreen: React.FC<VerificationScreenProps> = ({ 
  email, 
  onNavigateToSignIn,
  onVerificationSuccess 
}) => {
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    // Start timer for resend button
    if (resendTimer > 0) {
      const timeout = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timeout);
    }
  }, [resendTimer]);

  const handleResendVerification = async () => {
    if (resendTimer > 0) return;

    setIsResending(true);
    try {
      await authService.resendVerification(email);
      Alert.alert('Email Sent', 'Verification email has been sent again. Please check your inbox.');
      setResendTimer(60); // 60 second cooldown
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user?.email_confirmed_at) {
        onVerificationSuccess();
      } else {
        Alert.alert('Not Verified', 'Please check your email and click the verification link first.');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to check verification status. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Background Decorative Elements */}
        <View style={styles.decorativeElement} />
        <View style={styles.decorativeElement2} />
        
        {/* Background Bird Image */}
        <Image 
          source={require('../../../assets/images/Teal watercolor single element/bird-background1.png')}
          style={styles.backgroundImage}
          resizeMode="contain"
        />

        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>
            Check Your Email
          </Text>
          <Text style={styles.subtitle}>
            We've sent a verification link to{'\n'}
            <Text style={styles.emailText}>{email}</Text>
          </Text>
        </View>

        {/* Instructions */}
        <View style={styles.formContainer}>
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsText}>
              Please check your email and click the verification link to activate your account.
            </Text>
            <Text style={styles.instructionsSubtext}>
              After clicking the link, come back here and tap "I've Verified" below.
            </Text>
          </View>

          {/* Verification Check Button */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleCheckVerification}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>
              I've Verified My Email
            </Text>
          </TouchableOpacity>

          {/* Resend Button */}
          <TouchableOpacity
            style={[
              styles.secondaryButton,
              (isResending || resendTimer > 0) && styles.secondaryButtonDisabled
            ]}
            onPress={handleResendVerification}
            disabled={isResending || resendTimer > 0}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>
              {isResending ? 'Sending...' : 
               resendTimer > 0 ? `Resend in ${resendTimer}s` : 
               'Resend Verification Email'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <TouchableOpacity onPress={onNavigateToSignIn} activeOpacity={0.7}>
            <Text style={styles.footerText}>
              Back to Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
