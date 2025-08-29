/**
 * Utility helper functions for WisdomWise app
 */

import { Exercise } from '../types';

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Format duration string
 */
export const formatDuration = (duration: string): string => {
  // Handle different duration formats
  if (duration.includes('min')) {
    return duration;
  }
  
  const minutes = parseInt(duration);
  if (!isNaN(minutes)) {
    return `${minutes} min`;
  }
  
  return duration;
};

/**
 * Get exercise type color
 */
export const getExerciseTypeColor = (type: Exercise['type']): string => {
  const colorMap: Record<Exercise['type'], string> = {
    'mindfulness': '#3b82f6',
    'stress-relief': '#06b6d4',
    'gratitude': '#f59e0b',
    'breathing': '#10b981',
    'meditation': '#8b5cf6',
    'journaling': '#f97316',
  };
  
  return colorMap[type] || '#64748b';
};

/**
 * Get exercise difficulty level
 */
export const getExerciseDifficulty = (duration: string): Exercise['difficulty'] => {
  const minutes = parseInt(duration);
  
  if (minutes <= 3) return 'beginner';
  if (minutes <= 10) return 'intermediate';
  return 'advanced';
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T => {
  let timeout: NodeJS.Timeout;
  
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  }) as T;
};

/**
 * Capitalize first letter of string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Format date for display
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Validate exercise object
 */
export const isValidExercise = (exercise: any): exercise is Exercise => {
  return (
    exercise &&
    typeof exercise === 'object' &&
    typeof exercise.type === 'string' &&
    typeof exercise.name === 'string' &&
    typeof exercise.description === 'string' &&
    typeof exercise.duration === 'string'
  );
};

/**
 * Sleep utility for async operations
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Safe JSON parse
 */
export const safeJsonParse = <T>(jsonString: string, fallback: T): T => {
  try {
    return JSON.parse(jsonString);
  } catch {
    return fallback;
  }
};