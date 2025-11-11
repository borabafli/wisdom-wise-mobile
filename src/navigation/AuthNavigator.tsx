import React, { useState, useEffect } from 'react';
import { usePostHog } from 'posthog-react-native';
import { SignInScreen } from '../screens/auth/SignInScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { VerificationScreen } from '../screens/auth/VerificationScreen';

type AuthScreen = 'signin' | 'signup' | 'verification';

export const AuthNavigator: React.FC = () => {
  const posthog = usePostHog();
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('signin');
  const [pendingEmail, setPendingEmail] = useState<string>('');

  // 🎯 Track auth screen views
  useEffect(() => {
    posthog?.capture('auth_screen_viewed', {
      screen: currentScreen
    });
  }, [currentScreen, posthog]);

  const navigateToSignUp = () => setCurrentScreen('signup');
  const navigateToSignIn = () => setCurrentScreen('signin');
  const navigateToVerification = (email: string) => {
    setPendingEmail(email);
    setCurrentScreen('verification');
  };
  const onVerificationSuccess = () => setCurrentScreen('signin');

  if (currentScreen === 'verification') {
    return (
      <VerificationScreen 
        email={pendingEmail}
        onNavigateToSignIn={navigateToSignIn} 
        onVerificationSuccess={onVerificationSuccess}
      />
    );
  }

  if (currentScreen === 'signup') {
    return (
      <SignUpScreen 
        onNavigateToSignIn={navigateToSignIn} 
        onNavigateToVerification={navigateToVerification}
      />
    );
  }

  return <SignInScreen onNavigateToSignUp={navigateToSignUp} />;
};