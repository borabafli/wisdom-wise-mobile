import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts';
import { authStyles as styles } from '../../styles/components/AuthComponents.styles';

interface SignInScreenProps {
  onNavigateToSignUp: () => void;
  onNavigateToForgotPassword: () => void;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({
  onNavigateToSignUp,
  onNavigateToForgotPassword,
}) => {
  const { signIn, signInWithGoogle, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await signIn(formData.email.trim().toLowerCase(), formData.password);
      
      if (!response.success) {
        Alert.alert('Sign In Failed', response.error || 'An unexpected error occurred');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const response = await signInWithGoogle();
      
      if (!response.success) {
        Alert.alert('Google Sign In Failed', response.error || 'An unexpected error occurred');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred during Google sign in.');
    }
  };

  const isFormDisabled = isLoading || isSubmitting;

  return (
    <SafeAreaView className={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className={styles.keyboardView}
      >
        <ScrollView 
          className={styles.scrollContainer}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className={styles.container}>
            <View className={styles.contentContainer}>
              {/* Header */}
              <View className={styles.headerContainer}>
                <Text className={styles.title}>Welcome Back</Text>
                <Text className={styles.subtitle}>
                  Sign in to continue your mindful journey with WisdomWise
                </Text>
              </View>

              {/* Form */}
              <View className={styles.formContainer}>
                {/* Email Input */}
                <View className={styles.inputContainer}>
                  <Text className={styles.label}>Email</Text>
                  <TextInput
                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    value={formData.email}
                    onChangeText={(text) => {
                      setFormData({ ...formData, email: text });
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isFormDisabled}
                  />
                  {errors.email && (
                    <Text className={styles.errorText}>{errors.email}</Text>
                  )}
                </View>

                {/* Password Input */}
                <View className={styles.inputContainer}>
                  <Text className={styles.label}>Password</Text>
                  <View className="relative">
                    <TextInput
                      className={`${styles.input} ${errors.password ? styles.inputError : ''} pr-12`}
                      placeholder="Enter your password"
                      placeholderTextColor="#9CA3AF"
                      value={formData.password}
                      onChangeText={(text) => {
                        setFormData({ ...formData, password: text });
                        if (errors.password) setErrors({ ...errors, password: '' });
                      }}
                      secureTextEntry={!showPassword}
                      editable={!isFormDisabled}
                    />
                    <TouchableOpacity
                      className="absolute right-3 top-3"
                      onPress={() => setShowPassword(!showPassword)}
                      disabled={isFormDisabled}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={20}
                        color="#6B7280"
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.password && (
                    <Text className={styles.errorText}>{errors.password}</Text>
                  )}
                </View>

                {/* Forgot Password Link */}
                <TouchableOpacity
                  onPress={onNavigateToForgotPassword}
                  disabled={isFormDisabled}
                  className="items-end mb-6"
                >
                  <Text className={styles.link}>Forgot Password?</Text>
                </TouchableOpacity>

                {/* Sign In Button */}
                <TouchableOpacity
                  className={`${styles.primaryButton} ${
                    isFormDisabled ? styles.primaryButtonDisabled : ''
                  }`}
                  onPress={handleSignIn}
                  disabled={isFormDisabled}
                >
                  {isSubmitting ? (
                    <View className="flex-row items-center justify-center">
                      <ActivityIndicator size="small" color="white" />
                      <Text className={`${styles.primaryButtonText} ml-2`}>Signing In...</Text>
                    </View>
                  ) : (
                    <Text className={styles.primaryButtonText}>Sign In</Text>
                  )}
                </TouchableOpacity>

                {/* Divider */}
                <View className={styles.dividerContainer}>
                  <View className={styles.dividerLine} />
                  <Text className={styles.dividerText}>or</Text>
                  <View className={styles.dividerLine} />
                </View>

                {/* Google Sign In Button */}
                <TouchableOpacity
                  className={styles.googleButton}
                  onPress={handleGoogleSignIn}
                  disabled={isFormDisabled}
                >
                  <Ionicons name="logo-google" size={20} color="#DB4437" />
                  <Text className={styles.googleButtonText}>Continue with Google</Text>
                </TouchableOpacity>

                {/* Sign Up Link */}
                <View className={styles.linkContainer}>
                  <Text className={styles.linkText}>Don't have an account? </Text>
                  <TouchableOpacity
                    onPress={onNavigateToSignUp}
                    disabled={isFormDisabled}
                  >
                    <Text className={styles.link}>Sign Up</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};