import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts';
import { authScreenStyles as styles } from '../../styles/components/AuthScreens.styles';
import { GoogleIcon } from '../../components/GoogleIcon';
import { LEGAL_URLS } from '../../constants/legal';

export const SignUpScreen: React.FC<{
  onNavigateToSignIn: () => void;
  onNavigateToVerification: (email: string) => void;
}> = ({ onNavigateToSignIn, onNavigateToVerification }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const { signUp, signInWithGoogle, isLoading } = useAuth();

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync('#EDF8F8');
  }, []);

  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert(t('common.error'), t('errors.enterEmail'));
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert(t('common.error'), t('errors.enterValidEmail'));
      return false;
    }
    if (password.length < 6) {
      Alert.alert(t('common.error'), t('errors.passwordTooShort'));
      return false;
    }
    if (!privacyAccepted) {
      Alert.alert(t('common.error'), t('errors.acceptPrivacyPolicy'));
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    try {
      // Pass empty strings for firstName and lastName since we're not collecting them
      await signUp(email, password, '', '');
      // Navigate to verification screen after successful signup
      onNavigateToVerification(email);
    } catch (error: any) {
      Alert.alert(t('errors.signUpFailed'), error.message || t('errors.genericError'));
    }
  };

  const getPasswordStrength = () => {
    if (password.length === 0) return '';
    if (password.length < 6) return t('auth.signUp.passwordStrengthWeak');
    if (password.length < 10) return t('auth.signUp.passwordStrengthMedium');
    return t('auth.signUp.passwordStrengthStrong');
  };

  const getPasswordColor = () => {
    const strength = getPasswordStrength();
    if (strength === t('auth.signUp.passwordStrengthWeak')) return 'text-red-500';
    if (strength === t('auth.signUp.passwordStrengthMedium')) return 'text-yellow-500';
    if (strength === t('auth.signUp.passwordStrengthStrong')) return 'text-green-500';
    return '';
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      Alert.alert(t('errors.googleSignInFailed'), error.message || t('errors.genericError'));
    }
  };

  const handleOpenPrivacyPolicy = async () => {
    try {
      const canOpen = await Linking.canOpenURL(LEGAL_URLS.PRIVACY_POLICY);
      if (canOpen) {
        await Linking.openURL(LEGAL_URLS.PRIVACY_POLICY);
      } else {
        Alert.alert(t('common.error'), t('auth.signUp.failedToOpenPrivacy'));
      }
    } catch (error) {
      console.error('Error opening privacy policy:', error);
      Alert.alert(t('common.error'), t('auth.signUp.failedToOpenPrivacy'));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" backgroundColor="#EDF8F8" translucent={false} />
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        alwaysBounceVertical={true}
      >
        {/* Background Decorative Elements */}
        <View style={styles.decorativeElement} />
        <View style={styles.decorativeElement2} />
        
        {/* Header with Turtle */}
        <View style={styles.headerContainerSignUp}>
          <View style={styles.turtleContainer}>
            <Image
              source={require('../../../assets/images/onboarding/turtle-welcome-calm-smile.png')}
              style={styles.turtleImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>
            {t('auth.signUp.title')}
          </Text>
          <Text style={styles.subtitle}>
            {t('auth.signUp.subtitle')}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('auth.signUp.email')}</Text>
            <TextInput
              style={styles.textInput}
              placeholder={t('auth.signUp.emailPlaceholder')}
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
            <Text style={styles.inputLabel}>{t('auth.signUp.password')}</Text>
            <TextInput
              style={styles.textInput}
              placeholder={t('auth.signUp.passwordPlaceholder')}
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
                  getPasswordStrength() === t('auth.signUp.passwordStrengthWeak') && styles.passwordStrengthWeak,
                  getPasswordStrength() === t('auth.signUp.passwordStrengthMedium') && styles.passwordStrengthMedium,
                  getPasswordStrength() === t('auth.signUp.passwordStrengthStrong') && styles.passwordStrengthStrong,
                ]}>
                  {t('auth.signUp.passwordStrength', { strength: getPasswordStrength() })}
                </Text>
              </View>
            )}
          </View>

          {/* Privacy Policy Checkbox */}
          <View style={styles.checkboxContainer}>
            <TouchableOpacity 
              style={styles.checkboxRow}
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
                {t('auth.signUp.privacyAccept')}{' '}
                <Text
                  style={styles.privacyPolicyLink}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleOpenPrivacyPolicy();
                  }}
                >
                  {t('auth.signUp.privacyPolicy')}
                </Text>
                {' '}{t('auth.signUp.and')}{' '}
                <Text
                  style={styles.privacyPolicyLink}
                  onPress={async (e) => {
                    e.stopPropagation();
                    try {
                      await Linking.openURL(LEGAL_URLS.TERMS_OF_SERVICE);
                    } catch (error) {
                      console.error('Error opening terms:', error);
                      Alert.alert(t('common.error'), t('auth.signUp.failedToOpenTerms'));
                    }
                  }}
                >
                  {t('auth.signUp.termsOfService')}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

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
              {isLoading ? t('auth.signUp.creatingAccount') : t('auth.signUp.createAccountButton')}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t('auth.signUp.orDivider')}</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Sign In Button */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <GoogleIcon size={20} />
            <Text style={styles.googleButtonText}>
              {t('auth.signUp.googleButton')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <TouchableOpacity onPress={onNavigateToSignIn} activeOpacity={0.7}>
            <Text style={styles.footerText}>
              {t('auth.signUp.alreadyHaveAccount')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};