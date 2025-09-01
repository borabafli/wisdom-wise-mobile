import { Brain, Wind, Eye, BookOpen, Heart } from 'lucide-react-native';

// Shared exercise library data used by both ExerciseLibrary and Chat components
export const exerciseLibraryData: Record<string, any> = {
  'automatic-thoughts': {
    id: 1,
    type: 'automatic-thoughts',
    name: 'Recognizing Automatic Thoughts',
    duration: '15 min',
    description: 'Identify and reframe negative thought patterns with CBT',
    category: 'CBT',
    difficulty: 'Intermediate',
    icon: Brain,
    color: ['#B5A7C6', '#D4B5D0'],
    image: require('../../assets/images/4.jpeg')
  },
  'breathing': {
    id: 2,
    type: 'breathing',
    name: '4-7-8 Breathing',
    duration: '5 min',
    description: 'Calm your nervous system with rhythmic breathing',
    category: 'Breathing',
    difficulty: 'Beginner',
    icon: Wind,
    color: ['#8FA5B3', '#C3D9E6'],
    image: require('../../assets/images/5.jpeg')
  },
  'mindfulness': {
    id: 3,
    type: 'mindfulness',
    name: 'Body Scan',
    duration: '10 min',
    description: 'Release tension through mindful awareness',
    category: 'Mindfulness',
    difficulty: 'Beginner',
    icon: Eye,
    color: ['#95B99C', '#B8C5A6'],
    image: require('../../assets/images/7.jpeg')
  },
  'gratitude': {
    id: 5,
    type: 'gratitude',
    name: 'Gratitude Practice',
    duration: '10 min',
    description: 'Shift focus to positive moments and appreciation',
    category: 'Mindfulness',
    difficulty: 'Beginner',
    icon: BookOpen,
    color: ['#FFD4BA', '#FFE5D4'],
    image: require('../../assets/images/8.jpeg')
  },
  'self-compassion': {
    id: 6,
    type: 'self-compassion',
    name: 'Self-Compassion Break',
    duration: '12 min',
    description: 'Practice kindness and understanding toward yourself',
    category: 'Self-Care',
    difficulty: 'Beginner',
    icon: Heart,
    color: ['#F4A1C7', '#F9D1E0'],
    image: require('../../assets/images/6.jpeg')
  }
};

// Exercise keyword mapping to match AI suggestions with library exercises
export const EXERCISE_KEYWORDS = {
  'breathing': ['breathing', 'breath', '4-7-8'],
  'automatic-thoughts': ['automatic thoughts', 'thought patterns', 'negative thoughts', 'cognitive', 'cbt'],
  'mindfulness': ['body scan', 'mindfulness', 'body awareness'],
  'gratitude': ['gratitude', 'appreciation', 'thankful'],
  'self-compassion': ['self-compassion', 'self compassion', 'kind to yourself', 'self-care']
};

// Helper function to get exercise data by type
export function getExerciseByType(exerciseType: string): any | null {
  return exerciseLibraryData[exerciseType] || null;
}