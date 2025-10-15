import { createContext, useContext } from 'react';

export interface OnboardingContextType {
  restartOnboarding: () => Promise<void>;
}

export const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboardingControl = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboardingControl must be used within AppContent');
  }
  return context;
};