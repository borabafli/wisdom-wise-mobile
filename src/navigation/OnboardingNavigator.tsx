import React, { useState, useEffect } from 'react';
import { usePostHog } from 'posthog-react-native';
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
  const posthog = usePostHog();
  const [currentStep, setCurrentStep] = useState(1);
  const [userProfile, setUserProfile] = useState<{ name?: string; values?: string[]; ageGroup?: string; focusAreas?: string[] }>({});

  // Helper to get step name
  const getStepName = (step: number) => {
    const steps = ['welcome', 'value_prop', 'personal_values', 'focus_areas', 'age_group', 'personalization', 'final', 'notifications'];
    return steps[step - 1] || 'unknown';
  };

  // 🎯 Track onboarding step viewed
  useEffect(() => {
    posthog?.capture('onboarding_step_viewed', {
      step: getStepName(currentStep),
      stepNumber: currentStep,
    });
  }, [currentStep, posthog]);

  const handleContinueFromWelcome = () => {
    posthog?.capture('onboarding_step_completed', { step: 'welcome', stepNumber: 1 });
    setCurrentStep(2); // Go to value proposition screen
  };

  const handleContinueFromValueProp = () => {
    posthog?.capture('onboarding_step_completed', { step: 'value_prop', stepNumber: 2 });
    setCurrentStep(3); // Go to personal values screen
  };

  const handleContinueFromPersonalValues = async (selectedValues: string[]) => {
    posthog?.capture('onboarding_step_completed', {
      step: 'personal_values',
      stepNumber: 3,
      valuesSelected: selectedValues.length
    });
    // Save selected values and move to focus areas screen
    setUserProfile(prev => ({ ...prev, values: selectedValues }));
    setCurrentStep(4); // Go to focus areas screen
  };

  const handleContinueFromFocusAreas = async (selectedAreas: string[]) => {
    posthog?.capture('onboarding_step_completed', {
      step: 'focus_areas',
      stepNumber: 4,
      areasSelected: selectedAreas.length
    });
    // Save selected focus areas and move to age group screen
    setUserProfile(prev => ({ ...prev, focusAreas: selectedAreas }));
    setCurrentStep(5); // Go to age group screen
  };

  const handleContinueFromAgeGroup = async (selectedAge: string) => {
    posthog?.capture('onboarding_step_completed', {
      step: 'age_group',
      stepNumber: 5,
      ageGroup: selectedAge
    });
    // Save selected age group and move to name screen
    setUserProfile(prev => ({ ...prev, ageGroup: selectedAge }));
    setCurrentStep(6); // Go to name screen
  };

  const handleContinueFromPersonalization = async (name: string) => {
    posthog?.capture('onboarding_step_completed', {
      step: 'personalization',
      stepNumber: 6,
      nameProvided: true
    });
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
    posthog?.capture('onboarding_step_completed', {
      step: 'personalization',
      stepNumber: 6,
      nameProvided: false,
      skipped: true
    });
    setCurrentStep(7); // Go to final screen without saving name
  };

  const handleContinueFromFinal = () => {
    posthog?.capture('onboarding_step_completed', { step: 'final', stepNumber: 7 });
    setCurrentStep(8); // Go to notification permission screen
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleCompleteOnboarding = async (notificationsEnabled?: boolean) => {
    posthog?.capture('onboarding_completed', {
      step: 'notifications',
      stepNumber: 8,
      notificationsEnabled: notificationsEnabled || false,
      totalSteps: 8
    });
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