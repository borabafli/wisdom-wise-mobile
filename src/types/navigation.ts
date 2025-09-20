import { NavigatorScreenParams } from '@react-navigation/native';
import { Exercise } from './exercise';
import { JournalEntry } from '../services/journalStorageService';

// Navigation types
export type RootTabParamList = {
  Home: undefined;
  Exercises: undefined;
  Journal: NavigatorScreenParams<JournalStackParamList>;
  Insights: undefined;
  Profile: undefined;
  Chat: { currentExercise?: Exercise };
};

export type JournalStackParamList = {
  JournalHome: undefined;
  GuidedJournal: { initialPrompt: string };
  JournalEntryDetail: { entry: JournalEntry };
};