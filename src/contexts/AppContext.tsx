import React, { createContext, useContext, ReactNode } from 'react';
import { Exercise } from '../types';
import { useAppState } from '../hooks';

interface AppContextType {
  showChat: boolean;
  currentExercise: Exercise | null;
  chatWithActionPalette: boolean;
  handleStartSession: (exercise?: Exercise | null) => void;
  handleNewSession: () => void;
  handleBackFromChat: () => void;
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