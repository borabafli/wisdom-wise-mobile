import React, { useState } from 'react';
import { SignInScreen } from '../screens/auth/SignInScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { VerificationScreen } from '../screens/auth/VerificationScreen';

type AuthScreen = 'signin' | 'signup' | 'verification';

export const AuthNavigator: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('signin');
  const [pendingEmail, setPendingEmail] = useState<string>('');

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