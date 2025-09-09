import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts';
import { authScreenStyles as styles } from '../../styles/components/AuthScreens.styles';

export const SignUpScreen: React.FC<{ 
  onNavigateToSignIn: () => void;
  onNavigateToVerification: (email: string) => void;
}> = ({ onNavigateToSignIn, onNavigateToVerification }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const { signUp, isLoading } = useAuth();

  const validateForm = () => {
    if (!firstName.trim()) {
      Alert.alert('Error', 'Please enter your first name');
      return false;
    }
    if (!lastName.trim()) {
      Alert.alert('Error', 'Please enter your last name');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    if (!privacyAccepted) {
      Alert.alert('Error', 'Please accept the privacy policy to continue');
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    try {
      await signUp(email, password, firstName, lastName);
      // Navigate to verification screen after successful signup
      onNavigateToVerification(email);
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message || 'Please try again');
    }
  };

  const getPasswordStrength = () => {
    if (password.length === 0) return '';
    if (password.length < 6) return 'Weak';
    if (password.length < 10) return 'Medium';
    return 'Strong';
  };

  const getPasswordColor = () => {
    const strength = getPasswordStrength();
    if (strength === 'Weak') return 'text-red-500';
    if (strength === 'Medium') return 'text-yellow-500';
    if (strength === 'Strong') return 'text-green-500';
    return '';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
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
        <View style={styles.headerContainerSignUp}>
          <Text style={styles.title}>
            Create Account
          </Text>
          <Text style={styles.subtitle}>
            Join your mindfulness journey with WisdomWise
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Name Fields */}
          <View style={styles.nameFieldsRow}>
            <View style={styles.nameFieldContainer}>
              <Text style={styles.inputLabel}>First Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="First name"
                placeholderTextColor={styles.inputLabel.color}
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
            <View style={styles.nameFieldContainer}>
              <Text style={styles.inputLabel}>Last Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Last name"
                placeholderTextColor={styles.inputLabel.color}
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your email"
              placeholderTextColor={styles.inputLabel.color}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Create a password"
              placeholderTextColor={styles.inputLabel.color}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="off"
              textContentType="none"
              passwordRules=""
            />
            {password.length > 0 && (
              <View style={styles.passwordStrengthContainer}>
                <Text style={[
                  getPasswordStrength() === 'Weak' && styles.passwordStrengthWeak,
                  getPasswordStrength() === 'Medium' && styles.passwordStrengthMedium,
                  getPasswordStrength() === 'Strong' && styles.passwordStrengthStrong,
                ]}>
                  Password strength: {getPasswordStrength()}
                </Text>
              </View>
            )}
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Confirm your password"
              placeholderTextColor={styles.inputLabel.color}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoComplete="off"
              textContentType="none"
              passwordRules=""
            />
          </View>

          {/* Privacy Policy Checkbox */}
          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => setPrivacyAccepted(!privacyAccepted)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.checkbox,
              privacyAccepted && styles.checkboxChecked
            ]}>
              {privacyAccepted && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
            <Text style={styles.checkboxText}>
              I trust WisdomWise to keep my information private and safe as outlined in{' '}
              <Text style={styles.privacyPolicyLink}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          {/* Create Account Button */}
          <TouchableOpacity
            style={[
              styles.primaryButton,
              isLoading && styles.primaryButtonDisabled
            ]}
            onPress={handleSignUp}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <TouchableOpacity onPress={onNavigateToSignIn} activeOpacity={0.7}>
            <Text style={styles.footerText}>
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};