import { Exercise } from './exercise';

// Navigation types
export type RootTabParamList = {
  Home: undefined;
  Exercises: undefined;
  Insights: undefined;
  Profile: undefined;
  Chat: { currentExercise?: Exercise };
};