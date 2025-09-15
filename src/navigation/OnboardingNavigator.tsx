import React, { useState } from 'react';
import OnboardingWelcomeScreen from '../screens/OnboardingWelcomeScreen';
import OnboardingPrivacyScreen from '../screens/OnboardingPrivacyScreen';
import OnboardingPersonalizationScreen from '../screens/OnboardingPersonalizationScreen';
import OnboardingValuePropScreen from '../screens/OnboardingValuePropScreen';
import { OnboardingService } from '../services/onboardingService';
import { storageService } from '../services/storageService';

interface OnboardingNavigatorProps {
  onComplete: () => void;
}

export const OnboardingNavigator: React.FC<OnboardingNavigatorProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userProfile, setUserProfile] = useState<{ name?: string }>({});

  const handleContinueFromWelcome = () => {
    setCurrentStep(2); // Navigate to privacy screen
  };

  const handleContinueFromPrivacy = () => {
    setCurrentStep(3); // Navigate to personalization screen
  };

  const handleContinueFromPersonalization = async (name: string) => {
    // Save user's name to local state
    setUserProfile({ name });
    
    // Use existing StorageService to save name (consistent with profile settings)
    if (name.trim()) {
      try {
        await storageService.updateUserProfile({
          firstName: name.trim(),
          lastName: '', // Default empty last name for onboarding
        });
      } catch (error) {
        console.error('Error saving name from onboarding:', error);
      }
    }
    
    // Navigate to value proposition screen
    setCurrentStep(4);
  };

  const handleContinueFromValueProp = async () => {
    // For now, complete onboarding after value prop screen
    // In the future, you can add more onboarding steps here
    // setCurrentStep(5); // Navigate to next screen
    
    // Complete onboarding and navigate to main app
    await OnboardingService.completeOnboarding();
    onComplete();
  };

  const handleSkipPersonalization = async () => {
    // Skip personalization and complete onboarding
    await OnboardingService.completeOnboarding();
    onComplete();
  };


  // Render current onboarding screen
  switch (currentStep) {
    case 1:
      return <OnboardingWelcomeScreen onContinue={handleContinueFromWelcome} />;
    
    case 2:
      return (
        <OnboardingPrivacyScreen 
          onContinue={handleContinueFromPrivacy}
        />
      );
    
    case 3:
      return (
        <OnboardingPersonalizationScreen 
          onContinue={handleContinueFromPersonalization}
          onSkip={handleSkipPersonalization}
        />
      );
    
    case 4:
      return (
        <OnboardingValuePropScreen 
          onContinue={handleContinueFromValueProp}
        />
      );
    
    default:
      return <OnboardingWelcomeScreen onContinue={handleContinueFromWelcome} />;
  }
};