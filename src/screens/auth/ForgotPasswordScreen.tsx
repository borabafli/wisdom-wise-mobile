import React, { useState } from 'react';
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

interface ForgotPasswordScreenProps {
  onNavigateBack: () => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onNavigateBack,
}) => {
  const { resetPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email address.');
      return;
    }

    if (!validateEmail(email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await resetPassword(email.trim().toLowerCase());
      
      if (response.success) {
        setEmailSent(true);
      } else {
        Alert.alert('Reset Failed', response.error || 'Failed to send reset email');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (emailSent) {
    return (
      <SafeAreaView className={styles.safeArea}>
        <View className={styles.container}>
          <View className={styles.contentContainer}>
            {/* Success Header */}
            <View className={styles.headerContainer}>
              <View className="items-center">
                <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
                  <Ionicons name="checkmark-circle" size={32} color="#10B981" />
                </View>
                <Text className={styles.title}>Check Your Email</Text>
                <Text className={styles.subtitle}>
                  We've sent password reset instructions to{'\n'}
                  <Text className="font-medium">{email}</Text>
                </Text>
              </View>
            </View>

            {/* Actions */}
            <View className={styles.forgotPasswordContainer}>
              <TouchableOpacity
                className={styles.primaryButton}
                onPress={onNavigateBack}
              >
                <Text className={styles.primaryButtonText}>Back to Sign In</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setEmailSent(false)}
                className="items-center mt-4"
              >
                <Text className={styles.link}>Try a different email</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

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
                <Ionicons name="lock-closed" size={32} color="#3B82F6" />
              </View>
              <Text className={styles.title}>Forgot Password?</Text>
              <Text className={styles.subtitle}>
                Enter your email address and we'll send you instructions to reset your password
              </Text>
            </View>
          </View>

          {/* Form */}
          <View className={styles.forgotPasswordContainer}>
            <View className={styles.inputContainer}>
              <Text className={styles.label}>Email</Text>
              <TextInput
                className={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isSubmitting}
              />
            </View>

            <TouchableOpacity
              className={`${styles.primaryButton} ${
                !email.trim() || isSubmitting ? styles.primaryButtonDisabled : ''
              }`}
              onPress={handleResetPassword}
              disabled={!email.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <View className="flex-row items-center justify-center">
                  <ActivityIndicator size="small" color="white" />
                  <Text className={`${styles.primaryButtonText} ml-2`}>Sending...</Text>
                </View>
              ) : (
                <Text className={styles.primaryButtonText}>Send Reset Email</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onNavigateBack}
              className="items-center mt-6"
              disabled={isSubmitting}
            >
              <Text className={styles.link}>Back to Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};