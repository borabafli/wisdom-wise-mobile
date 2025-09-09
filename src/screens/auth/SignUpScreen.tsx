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

interface SignUpScreenProps {
  onNavigateToSignIn: () => void;
  onNavigateToVerification: (email: string) => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onNavigateToSignIn,
  onNavigateToVerification,
}) => {
  const { signUp, signInWithGoogle, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    privacyAccepted: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.privacyAccepted) {
      newErrors.privacy = 'You must accept the privacy policy to continue';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await signUp({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        privacyAccepted: formData.privacyAccepted,
      });
      
      if (response.success) {
        if (response.needsVerification) {
          onNavigateToVerification(formData.email.trim().toLowerCase());
        }
        // If no verification needed, user will be automatically signed in
      } else {
        Alert.alert('Sign Up Failed', response.error || 'An unexpected error occurred');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const response = await signInWithGoogle();
      
      if (!response.success) {
        Alert.alert('Google Sign Up Failed', response.error || 'An unexpected error occurred');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred during Google sign up.');
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
          showsVerticalScrollIndicator={false}
        >
          <View className={styles.container}>
            <View className={styles.contentContainer}>
              {/* Header */}
              <View className={styles.headerContainer}>
                <Text className={styles.title}>Create Account</Text>
                <Text className={styles.subtitle}>
                  Join WisdomWise and start your mindful wellness journey
                </Text>
              </View>

              {/* Form */}
              <View className={styles.formContainer}>
                {/* Name Inputs */}
                <View className="flex-row space-x-3">
                  <View className="flex-1">
                    <Text className={styles.label}>First Name</Text>
                    <TextInput
                      className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                      placeholder="First name"
                      placeholderTextColor="#9CA3AF"
                      value={formData.firstName}
                      onChangeText={(text) => {
                        setFormData({ ...formData, firstName: text });
                        if (errors.firstName) setErrors({ ...errors, firstName: '' });
                      }}
                      autoCapitalize="words"
                      editable={!isFormDisabled}
                    />
                    {errors.firstName && (
                      <Text className={styles.errorText}>{errors.firstName}</Text>
                    )}
                  </View>
                  
                  <View className="flex-1">
                    <Text className={styles.label}>Last Name</Text>
                    <TextInput
                      className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                      placeholder="Last name"
                      placeholderTextColor="#9CA3AF"
                      value={formData.lastName}
                      onChangeText={(text) => {
                        setFormData({ ...formData, lastName: text });
                        if (errors.lastName) setErrors({ ...errors, lastName: '' });
                      }}
                      autoCapitalize="words"
                      editable={!isFormDisabled}
                    />
                    {errors.lastName && (
                      <Text className={styles.errorText}>{errors.lastName}</Text>
                    )}
                  </View>
                </View>

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
                      placeholder="Create a password"
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

                {/* Confirm Password Input */}
                <View className={styles.inputContainer}>
                  <Text className={styles.label}>Confirm Password</Text>
                  <View className="relative">
                    <TextInput
                      className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''} pr-12`}
                      placeholder="Confirm your password"
                      placeholderTextColor="#9CA3AF"
                      value={formData.confirmPassword}
                      onChangeText={(text) => {
                        setFormData({ ...formData, confirmPassword: text });
                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                      }}
                      secureTextEntry={!showConfirmPassword}
                      editable={!isFormDisabled}
                    />
                    <TouchableOpacity
                      className="absolute right-3 top-3"
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isFormDisabled}
                    >
                      <Ionicons
                        name={showConfirmPassword ? 'eye-off' : 'eye'}
                        size={20}
                        color="#6B7280"
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.confirmPassword && (
                    <Text className={styles.errorText}>{errors.confirmPassword}</Text>
                  )}
                </View>

                {/* Privacy Policy Checkbox */}
                <View className={styles.inputContainer}>
                  <TouchableOpacity
                    className={styles.privacyContainer}
                    onPress={() => {
                      setFormData({ ...formData, privacyAccepted: !formData.privacyAccepted });
                      if (errors.privacy) setErrors({ ...errors, privacy: '' });
                    }}
                    disabled={isFormDisabled}
                  >
                    <View className={`${styles.checkbox} ${formData.privacyAccepted ? styles.checkboxChecked : ''}`}>
                      {formData.privacyAccepted && (
                        <Ionicons name="checkmark" size={14} color="white" />
                      )}
                    </View>
                    <Text className={styles.checkboxText}>
                      I trust Mind Wise to keep my information private and safe as outlined in{' '}
                      <Text className={styles.privacyLink}>Privacy Policy</Text>
                    </Text>
                  </TouchableOpacity>
                  {errors.privacy && (
                    <Text className={styles.errorText}>{errors.privacy}</Text>
                  )}
                </View>

                {/* Sign Up Button */}
                <TouchableOpacity
                  className={`${styles.primaryButton} ${
                    isFormDisabled ? styles.primaryButtonDisabled : ''
                  }`}
                  onPress={handleSignUp}
                  disabled={isFormDisabled}
                >
                  {isSubmitting ? (
                    <View className="flex-row items-center justify-center">
                      <ActivityIndicator size="small" color="white" />
                      <Text className={`${styles.primaryButtonText} ml-2`}>Creating Account...</Text>
                    </View>
                  ) : (
                    <Text className={styles.primaryButtonText}>Create Account</Text>
                  )}
                </TouchableOpacity>

                {/* Divider */}
                <View className={styles.dividerContainer}>
                  <View className={styles.dividerLine} />
                  <Text className={styles.dividerText}>or</Text>
                  <View className={styles.dividerLine} />
                </View>

                {/* Google Sign Up Button */}
                <TouchableOpacity
                  className={styles.googleButton}
                  onPress={handleGoogleSignUp}
                  disabled={isFormDisabled}
                >
                  <Ionicons name="logo-google" size={20} color="#DB4437" />
                  <Text className={styles.googleButtonText}>Continue with Google</Text>
                </TouchableOpacity>

                {/* Sign In Link */}
                <View className={styles.linkContainer}>
                  <Text className={styles.linkText}>Already have an account? </Text>
                  <TouchableOpacity
                    onPress={onNavigateToSignIn}
                    disabled={isFormDisabled}
                  >
                    <Text className={styles.link}>Sign In</Text>
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