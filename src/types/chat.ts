import { Exercise } from './exercise';

// Chat and messaging types
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'voice' | 'exercise';
  exercise?: Exercise;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  currentExercise: Exercise | null;
  isRecording: boolean;
  showActionPalette: boolean;
}

// Action Palette types
export type ActionPaletteOption = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  action: 'guided-session' | 'guided-journaling' | 'suggested-exercises' | 'exercise-library' | 'mindfulness-check';
};

// Audio/STT types
export interface AudioTranscriptionResult {
  success: boolean;
  transcript?: string;
  error?: string;
  confidence?: number;
}