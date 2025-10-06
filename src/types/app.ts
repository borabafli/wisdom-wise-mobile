import { Exercise } from './exercise';

// Button position for animations
export interface ButtonPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

// App State types
export interface AppState {
  showChat: boolean;
  currentExercise: Exercise | null;
  chatWithActionPalette: boolean;
  fontsLoaded: boolean;
  buttonPosition?: ButtonPosition | null;
}

// Component Props types
export interface HomeScreenProps {
  onStartSession: (params?: Exercise | ButtonPosition) => void;
  onExerciseClick: (exercise?: Exercise) => void;
  onInsightClick: (type: string, insight?: any) => void;
  onNavigateToExercises: () => void;
  onNavigateToInsights: () => void;
  navigation?: any;
  onActionSelect?: (actionId: string) => void;
}

export interface ChatInterfaceProps {
  onBack: () => void;
  currentExercise?: Exercise | null;
  startWithActionPalette: boolean;
  initialMessage?: string | null;
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