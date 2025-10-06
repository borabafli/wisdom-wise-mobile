import React, { createContext, useContext, ReactNode } from 'react';
import { Exercise, ButtonPosition } from '../types';
import { useAppState } from '../hooks';

interface AppContextType {
  showChat: boolean;
  showBreathing: boolean;
  currentExercise: Exercise | null;
  breathingExercise: Exercise | null;
  chatWithActionPalette: boolean;
  initialChatMessage: string | null;
  buttonPosition: ButtonPosition | null;
  handleStartSession: (params?: Exercise | ButtonPosition | null) => void;
  handleNewSession: () => void;
  handleStartChatWithContext: (context: string) => void;
  handleBackFromChat: () => void;
  handleBackFromBreathing: () => void;
  handleExerciseClick: (exercise?: Exercise) => void;
  handleInsightClick: (type: string, insight?: any) => void;
  handleActionSelect: (actionId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const appState = useAppState();

  return (
    <AppContext.Provider value={appState}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};