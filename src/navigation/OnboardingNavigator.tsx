import React, { useState } from 'react';
import OnboardingWelcomeScreen from '../screens/onboarding/OnboardingWelcomeScreen';
import OnboardingValuePropScreen from '../screens/onboarding/OnboardingValuePropScreen';
import PersonalValuesScreen from '../screens/onboarding/PersonalValuesScreen';
import FocusAreasScreen from '../screens/onboarding/FocusAreasScreen';
import OnboardingFinalScreen from '../screens/onboarding/OnboardingFinalScreen';
import { OnboardingService } from '../services/onboardingService';
import { storageService } from '../services/storageService';

interface OnboardingNavigatorProps {
  onComplete: () => void;
}

export const OnboardingNavigator: React.FC<OnboardingNavigatorProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userProfile, setUserProfile] = useState<{ name?: string; values?: string[]; focusAreas?: string[] }>({});

  const handleContinueFromWelcome = () => {
    setCurrentStep(2); // Go to value proposition screen
  };

  const handleContinueFromValueProp = () => {
    setCurrentStep(3); // Go to personal values screen
  };

  const handleContinueFromPersonalValues = async (selectedValues: string[]) => {
    // Save selected values and move to focus areas
    setUserProfile(prev => ({ ...prev, values: selectedValues }));
    setCurrentStep(4); // Go to focus areas screen
  };

  const handleContinueFromFocusAreas = async (selectedAreas: string[]) => {
    // Save selected focus areas and move to final screen
    try {
      await storageService.updateUserProfile({
        onboardingValues: userProfile.values || [],
        onboardingFocusAreas: selectedAreas,
        valuesTimestamp: new Date().toISOString(),
        focusAreasTimestamp: new Date().toISOString(),
      });
      console.log('Saved personal values:', userProfile.values);
      console.log('Saved focus areas:', selectedAreas);
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    }

    setCurrentStep(5); // Go to final screen
  };

  const handleCompleteOnboarding = async () => {
    // Complete onboarding
    await OnboardingService.completeOnboarding();
    onComplete();
  };

  // Removed unused handlers for disabled onboarding steps


  // Render current onboarding screen
  switch (currentStep) {
    case 1:
      return <OnboardingWelcomeScreen onContinue={handleContinueFromWelcome} />;
    
    case 2:
      return (
        <OnboardingValuePropScreen 
          onContinue={handleContinueFromValueProp}
        />
      );

    case 3:
      return (
        <PersonalValuesScreen 
          onContinue={handleContinueFromPersonalValues}
        />
      );

    case 4:
      return (
        <FocusAreasScreen 
          onContinue={handleContinueFromFocusAreas}
        />
      );

    case 5:
      return (
        <OnboardingFinalScreen 
          onComplete={handleCompleteOnboarding}
        />
      );
    
    default:
      return <OnboardingWelcomeScreen onContinue={handleContinueFromWelcome} />;
  }
};