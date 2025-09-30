import React, { useState } from 'react';
import OnboardingWelcomeScreen from '../screens/onboarding/OnboardingWelcomeScreen';
import OnboardingValuePropScreen from '../screens/onboarding/OnboardingValuePropScreen';
import PersonalValuesScreen from '../screens/onboarding/PersonalValuesScreen';
import AgeGroupScreen from '../screens/onboarding/AgeGroupScreen';
import OnboardingPersonalizationScreen from '../screens/onboarding/OnboardingPersonalizationScreen';
import FocusAreasScreen from '../screens/onboarding/FocusAreasScreen';
import OnboardingFinalScreen from '../screens/onboarding/OnboardingFinalScreen';
import NotificationPermissionScreen from '../screens/onboarding/NotificationPermissionScreen';
import { OnboardingService } from '../services/onboardingService';
import { storageService } from '../services/storageService';

interface OnboardingNavigatorProps {
  onComplete: () => void;
}

export const OnboardingNavigator: React.FC<OnboardingNavigatorProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userProfile, setUserProfile] = useState<{ name?: string; values?: string[]; ageGroup?: string; focusAreas?: string[] }>({});

  const handleContinueFromWelcome = () => {
    setCurrentStep(2); // Go to value proposition screen
  };

  const handleContinueFromValueProp = () => {
    setCurrentStep(3); // Go to personal values screen
  };

  const handleContinueFromPersonalValues = async (selectedValues: string[]) => {
    // Save selected values and move to focus areas screen
    setUserProfile(prev => ({ ...prev, values: selectedValues }));
    setCurrentStep(4); // Go to focus areas screen
  };

  const handleContinueFromFocusAreas = async (selectedAreas: string[]) => {
    // Save selected focus areas and move to age group screen
    setUserProfile(prev => ({ ...prev, focusAreas: selectedAreas }));
    setCurrentStep(5); // Go to age group screen
  };

  const handleContinueFromAgeGroup = async (selectedAge: string) => {
    // Save selected age group and move to name screen
    setUserProfile(prev => ({ ...prev, ageGroup: selectedAge }));
    setCurrentStep(6); // Go to name screen
  };

  const handleContinueFromPersonalization = async (name: string) => {
    // Save name and move to final screen
    try {
      await storageService.updateUserProfile({
        firstName: name, // Use firstName instead of onboardingName
        onboardingValues: userProfile.values || [],
        onboardingFocusAreas: userProfile.focusAreas || [],
        onboardingAgeGroup: userProfile.ageGroup,
        valuesTimestamp: new Date().toISOString(),
        focusAreasTimestamp: new Date().toISOString(),
      });
      console.log('Saved personal values:', userProfile.values);
      console.log('Saved focus areas:', userProfile.focusAreas);
      console.log('Saved age group:', userProfile.ageGroup);
      console.log('Saved name:', name);
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    }

    setCurrentStep(7); // Go to final screen
  };

  const handleSkipPersonalization = () => {
    setCurrentStep(7); // Go to final screen without saving name
  };

  const handleContinueFromFinal = () => {
    setCurrentStep(8); // Go to notification permission screen
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
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
          onBack={currentStep > 1 ? handleBack : undefined}
        />
      );

    case 4:
      return (
        <FocusAreasScreen
          onContinue={handleContinueFromFocusAreas}
          onBack={currentStep > 1 ? handleBack : undefined}
        />
      );

    case 5:
      return (
        <AgeGroupScreen
          onContinue={handleContinueFromAgeGroup}
          onBack={currentStep > 1 ? handleBack : undefined}
        />
      );

    case 6:
      return (
        <OnboardingPersonalizationScreen
          onContinue={handleContinueFromPersonalization}
          onSkip={handleSkipPersonalization}
          onBack={currentStep > 1 ? handleBack : undefined}
        />
      );

    case 7:
      return (
        <OnboardingFinalScreen
          onComplete={handleContinueFromFinal}
          onBack={currentStep > 1 ? handleBack : undefined}
        />
      );

    case 8:
      return (
        <NotificationPermissionScreen
          onContinue={handleCompleteOnboarding}
          onBack={currentStep > 1 ? handleBack : undefined}
        />
      );
    
    default:
      return <OnboardingWelcomeScreen onContinue={handleContinueFromWelcome} />;
  }
};