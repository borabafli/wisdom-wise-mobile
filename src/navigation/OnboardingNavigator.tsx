import React, { useState } from 'react';
import OnboardingWelcomeScreen from '../screens/onboarding/OnboardingWelcomeScreen';
import OnboardingValuePropScreen from '../screens/onboarding/OnboardingValuePropScreen';
import { OnboardingService } from '../services/onboardingService';

interface OnboardingNavigatorProps {
  onComplete: () => void;
}

export const OnboardingNavigator: React.FC<OnboardingNavigatorProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userProfile, setUserProfile] = useState<{ name?: string }>({});

  const handleContinueFromWelcome = () => {
    setCurrentStep(4); // Skip directly to value proposition screen
  };

  const handleContinueFromValueProp = async () => {
    // Complete onboarding directly after value prop
    await OnboardingService.completeOnboarding();
    onComplete();
  };

  // Removed unused handlers for disabled onboarding steps


  // Render current onboarding screen
  switch (currentStep) {
    case 1:
      return <OnboardingWelcomeScreen onContinue={handleContinueFromWelcome} />;
    
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