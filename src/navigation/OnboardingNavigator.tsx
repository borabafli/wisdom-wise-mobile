import React, { useState } from 'react';
import OnboardingWelcomeScreen from '../screens/onboarding/OnboardingWelcomeScreen';
import OnboardingPrivacyScreen from '../screens/onboarding/OnboardingPrivacyScreen';
import OnboardingPersonalizationScreen from '../screens/onboarding/OnboardingPersonalizationScreen';
import OnboardingValuePropScreen from '../screens/onboarding/OnboardingValuePropScreen';
import OnboardingMotivationScreen from '../screens/onboarding/OnboardingMotivationScreen';
import OnboardingCurrentStateScreen from '../screens/onboarding/OnboardingCurrentStateScreen';
import OnboardingBaselineScreen from '../screens/onboarding/OnboardingBaselineScreen';
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

  const handleContinueFromValueProp = () => {
    // Navigate to motivation discovery screen
    setCurrentStep(5);
  };

  const handleContinueFromMotivation = async (motivation: string) => {
    // Save motivation data is already handled in the component
    console.log('User motivation:', motivation);
    
    // Navigate to current state & goals screen
    setCurrentStep(6);
  };

  const handleContinueFromCurrentState = async (challenges: string[], goals: string[]) => {
    // Save current state and goals data
    console.log('User challenges:', challenges);
    console.log('User goals:', goals);
    
    try {
      await storageService.updateUserProfile({
        challenges: challenges,
        goals: goals,
        challengesTimestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error saving current state data:', error);
    }
    
    // Navigate to baseline check-in screen
    setCurrentStep(7);
  };

  const handleSkipMotivation = async () => {
    // Skip motivation and go to current state screen
    setCurrentStep(6);
  };

  const handleContinueFromBaseline = async (moodRating: number) => {
    // Baseline mood is saved in the component
    console.log('User baseline mood:', moodRating);
    
    // Complete onboarding and navigate to main app
    await OnboardingService.completeOnboarding();
    onComplete();
  };

  const handleSkipCurrentState = async () => {
    // Skip current state and go to baseline screen
    setCurrentStep(7);
  };

  const handleSkipBaseline = async () => {
    // Skip baseline and complete onboarding
    await OnboardingService.completeOnboarding();
    onComplete();
  };

  const handleSkipPersonalization = async () => {
    // Skip personalization and go to value proposition screen
    setCurrentStep(4);
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
    
    case 5:
      return (
        <OnboardingMotivationScreen 
          onContinue={handleContinueFromMotivation}
          onSkip={handleSkipMotivation}
        />
      );
    
    case 6:
      return (
        <OnboardingCurrentStateScreen 
          onContinue={handleContinueFromCurrentState}
          onSkip={handleSkipCurrentState}
        />
      );
    
    case 7:
      return (
        <OnboardingBaselineScreen 
          onContinue={handleContinueFromBaseline}
          onSkip={handleSkipBaseline}
        />
      );
    
    default:
      return <OnboardingWelcomeScreen onContinue={handleContinueFromWelcome} />;
  }
};