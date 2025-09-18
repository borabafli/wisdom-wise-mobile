import { Exercise } from './exercise';

// App State types
export interface AppState {
  showChat: boolean;
  currentExercise: Exercise | null;
  chatWithActionPalette: boolean;
  fontsLoaded: boolean;
}

// Component Props types
export interface HomeScreenProps {
  onStartSession: (exercise?: Exercise) => void;
  onExerciseClick: (exercise?: Exercise) => void;
  onInsightClick: (type: string, insight?: any) => void;
  onNavigateToExercises: () => void;
  onNavigateToInsights: () => void;
  navigation?: any;
}

export interface ChatInterfaceProps {
  onBack: () => void;
  currentExercise?: Exercise | null;
  startWithActionPalette: boolean;
  onActionSelect: (actionId: string) => void;
  onExerciseClick?: (exercise: Exercise) => void;
}

export interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
  onNewSession: () => void;
  onActionSelect: (actionId: string) => void;
}

// User Preferences
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  voiceEnabled: boolean;
  language: string;
  fontSize: 'small' | 'medium' | 'large';
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}