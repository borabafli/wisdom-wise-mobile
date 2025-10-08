import { getExerciseLibraryData } from './exerciseLibrary';

export function getExerciseTypeEnum() {
  const exerciseLibrary = getExerciseLibraryData(key => key);
  return Object.keys(exerciseLibrary).reduce((acc, key) => {
    acc[key] = key;
    return acc;
  }, {} as { [key: string]: string });
}