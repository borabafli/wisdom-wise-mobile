import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts';
import { authStyles as styles } from '../../styles/components/AuthComponents.styles';

interface VerificationScreenProps {
  email: string;
  onNavigateBack: () => void;
}

export const VerificationScreen: React.FC<VerificationScreenProps> = ({
  email,
  onNavigateBack,
}) => {
  const { verifyEmail, resendVerification } = useAuth();
  
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const inputRef = useRef<TextInput>(null);

  // Countdown for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerify = async () => {
    if (code.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter the 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await verifyEmail(code);
      
      if (!response.success) {
        Alert.alert('Verification Failed', response.error || 'Invalid verification code');
      }
      // If successful, user will be automatically signed in
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);
    try {
      const response = await resendVerification(email);
      
      if (response.success) {
        Alert.alert('Code Sent', 'A new verification code has been sent to your email.');
        setResendCooldown(60); // 60 second cooldown
        setCode(''); // Clear current code
      } else {
        Alert.alert('Resend Failed', response.error || 'Failed to resend verification code');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleCodeChange = (text: string) => {
    // Only allow numbers and limit to 6 digits
    const numericCode = text.replace(/[^0-9]/g, '').slice(0, 6);
    setCode(numericCode);
  };

  return (
    <SafeAreaView className={styles.safeArea}>
      <View className={styles.container}>
        <View className={styles.contentContainer}>
          {/* Header */}
          <View className={styles.headerContainer}>
            <TouchableOpacity
              onPress={onNavigateBack}
              className="absolute left-0 top-0"
            >
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            
            <View className="items-center">
              <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
                <Ionicons name="mail" size={32} color="#3B82F6" />
              </View>
              <Text className={styles.title}>Verify Your Email</Text>
              <Text className={styles.subtitle}>
                We've sent a 6-digit verification code to{'\n'}
                <Text className="font-medium">{email}</Text>
              </Text>
            </View>
          </View>

          {/* Verification Form */}
          <View className={styles.verificationContainer}>
            <Text className={styles.label}>Verification Code</Text>
            <TextInput
              ref={inputRef}
              className={styles.verificationInput}
              placeholder="000000"
              placeholderTextColor="#9CA3AF"
              value={code}
              onChangeText={handleCodeChange}
              keyboardType="numeric"
              maxLength={6}
              autoFocus
              editable={!isSubmitting}
            />

            <TouchableOpacity
              className={`${styles.primaryButton} ${
                code.length !== 6 || isSubmitting ? styles.primaryButtonDisabled : ''
              }`}
              onPress={handleVerify}
              disabled={code.length !== 6 || isSubmitting}
            >
              {isSubmitting ? (
                <View className="flex-row items-center justify-center">
                  <ActivityIndicator size="small" color="white" />
                  <Text className={`${styles.primaryButtonText} ml-2`}>Verifying...</Text>
                </View>
              ) : (
                <Text className={styles.primaryButtonText}>Verify Email</Text>
              )}
            </TouchableOpacity>

            {/* Resend Code */}
            <View className="items-center mt-6">
              <Text className={styles.linkText}>Didn't receive the code?</Text>
              <TouchableOpacity
                onPress={handleResendCode}
                disabled={resendCooldown > 0 || isResending}
                className="mt-2"
              >
                {isResending ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator size="small" color="#3B82F6" />
                    <Text className={`${styles.link} ml-2`}>Sending...</Text>
                  </View>
                ) : resendCooldown > 0 ? (
                  <Text className="text-gray-400 text-base">
                    Resend in {resendCooldown}s
                  </Text>
                ) : (
                  <Text className={styles.link}>Resend Code</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};