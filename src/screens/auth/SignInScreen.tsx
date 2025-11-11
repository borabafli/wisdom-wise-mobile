import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts';
import { authScreenStyles as styles } from '../../styles/components/AuthScreens.styles';
import { GoogleIcon } from '../../components/GoogleIcon';

export const SignInScreen: React.FC<{ onNavigateToSignUp: () => void }> = ({ onNavigateToSignUp }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signInWithGoogle, skipAuth, isLoading } = useAuth();

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync('#EDF8F8');
  }, []);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert(t('common.error'), t('errors.fillAllFields'));
      return;
    }

    try {
      await signIn(email, password);
    } catch (error: any) {
      Alert.alert(t('errors.signInFailed'), error.message || t('errors.genericError'));
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      Alert.alert(t('errors.googleSignInFailed'), error.message || t('errors.genericError'));
    }
  };

  const handleSkipAuth = () => {
    skipAuth();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" backgroundColor="#EDF8F8" translucent={false} />
      <View style={styles.container}>
        {/* Background Decorative Elements */}
        <View style={styles.decorativeElement} />
        <View style={styles.decorativeElement2} />
        
        {/* Header with Turtle */}
        <View style={styles.headerContainer}>
          <View style={styles.turtleContainer}>
            <Image
              source={require('../../../assets/images/onboarding/turtle-welcome-calm-smile.png')}
              style={styles.turtleImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>
            {t('auth.signIn.title')}
          </Text>
          <Text style={styles.subtitle}>
            {t('auth.signIn.subtitle')}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('auth.signIn.email')}</Text>
            <TextInput
              style={styles.textInput}
              placeholder={t('auth.signIn.emailPlaceholder')}
              placeholderTextColor={styles.inputLabel.color}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('auth.signIn.password')}</Text>
            <TextInput
              style={styles.textInput}
              placeholder={t('auth.signIn.passwordPlaceholder')}
              placeholderTextColor={styles.inputLabel.color}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="off"
              textContentType="none"
              passwordRules=""
            />
          </View>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              isLoading && styles.primaryButtonDisabled
            ]}
            onPress={handleSignIn}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>
              {isLoading ? t('auth.signIn.signingIn') : t('auth.signIn.signInButton')}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t('auth.signIn.orDivider')}</Text>
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
              {t('auth.signIn.googleButton')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <TouchableOpacity onPress={onNavigateToSignUp} activeOpacity={0.7}>
            <Text style={styles.footerText}>
              {t('auth.signIn.noAccount')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSkipAuth}
            activeOpacity={0.7}
            style={styles.skipButton}
          >
            <Text style={styles.skipButtonText}>
              {t('common.skip')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};