// Final, corrected exerciseLibrary.ts
import { Brain, Wind, Eye, BookOpen, Heart, Star, Clock, Filter, FileText } from 'lucide-react-native';

// Function to get translated exercise library data
export const getExerciseLibraryData = (t: (key: string) => string): Record<string, any> => ({
  'automatic-thoughts': {
    id: 1,
    type: 'automatic-thoughts',
    name: t('exerciseLibrary.names.automaticThoughts'),
    duration: '15 min',
    description: t('exerciseLibrary.descriptions.automaticThoughts'),
    shortDescription: t('exerciseLibrary.shortDescriptions.automaticThoughts'),
    category: t('exerciseLibrary.categories.cbt'),
    difficulty: t('exerciseLibrary.difficulties.intermediate'),
    icon: Brain,
    color: ['#B5A7C6', '#D4B5D0'],
    image: require('../../assets/images/1.jpeg'),
    keywords: ['automatic thoughts', 'thought patterns', 'negative thoughts', 'cognitive', 'cbt'],
  },
  'breathing': {
    id: 2,
    type: 'breathing',
    name: t('exerciseLibrary.names.breathing'),
    duration: '5 min',
    description: t('exerciseLibrary.descriptions.breathing'),
    shortDescription: t('exerciseLibrary.shortDescriptions.breathing'),
    category: t('exerciseLibrary.categories.breathing'),
    difficulty: t('exerciseLibrary.difficulties.beginner'),
    icon: Wind,
    color: ['#8FA5B3', '#C3D9E6'],
    image: require('../../assets/images/2.jpeg'),
    keywords: ['breathing', 'breath', '4-7-8'],
  },
  'tell-your-story': {
    id: 13,
    type: 'tell-your-story',
    name: t('exerciseLibrary.names.tellYourStory'),
    duration: '15-25 min',
    description: t('exerciseLibrary.descriptions.tellYourStory'),
    shortDescription: t('exerciseLibrary.shortDescriptions.tellYourStory'),
    category: t('exerciseLibrary.categories.selfDiscovery'),
    difficulty: t('exerciseLibrary.difficulties.beginner'),
    icon: FileText,
    color: ['#FEF3C7', '#FDE68A'],
    image: require('../../assets/images/16.png'),
    keywords: ['story', 'narrative', 'reflection', 'journey', 'personal history', 'strengths', 'self-understanding', 'life story', 'identity'],
  },
  'vision-of-future': {
    id: 14,
    type: 'vision-of-future',
    name: t('exerciseLibrary.names.visionOfFuture'),
    duration: '20-30 min',
    description: t('exerciseLibrary.descriptions.visionOfFuture'),
    shortDescription: t('exerciseLibrary.shortDescriptions.visionOfFuture'),
    category: t('exerciseLibrary.categories.selfDiscovery'),
    difficulty: t('exerciseLibrary.difficulties.intermediate'),
    icon: Star,
    color: ['#E0F2FE', '#7DD3FC'],
    image: require('../../assets/images/18.png'),
    keywords: ['vision', 'future', 'goals', 'dreams', 'inspiration', 'values', 'purpose', 'life direction', 'imagination', 'hope'],
  },
  'box-breathing': {
    id: 10,
    type: 'breathing',
    name: t('exerciseLibrary.names.boxBreathing'),
    duration: '8 min',
    description: t('exerciseLibrary.descriptions.boxBreathing'),
    shortDescription: t('exerciseLibrary.shortDescriptions.boxBreathing'),
    category: t('exerciseLibrary.categories.breathing'),
    difficulty: t('exerciseLibrary.difficulties.intermediate'),
    icon: Wind,
    color: ['#7DD3FC', '#93C5FD'],
    image: require('../../assets/images/10.jpeg'),
    keywords: ['box breathing', 'square breathing', 'focus', 'stress relief', 'balance'],
  },
  'triangle-breathing': {
    id: 11,
    type: 'breathing',
    name: t('exerciseLibrary.names.triangleBreathing'),
    duration: '6 min',
    description: t('exerciseLibrary.descriptions.triangleBreathing'),
    shortDescription: t('exerciseLibrary.shortDescriptions.triangleBreathing'),
    category: t('exerciseLibrary.categories.breathing'),
    difficulty: t('exerciseLibrary.difficulties.beginner'),
    icon: Wind,
    color: ['#A7F3D0', '#6EE7B7'],
    image: require('../../assets/images/11.jpeg'),
    keywords: ['triangle breathing', 'three phase', 'mindfulness', 'simple', 'relaxation'],
  },
  'coherent-breathing': {
    id: 12,
    type: 'breathing',
    name: t('exerciseLibrary.names.coherentBreathing'),
    duration: '10 min',
    description: t('exerciseLibrary.descriptions.coherentBreathing'),
    shortDescription: t('exerciseLibrary.shortDescriptions.coherentBreathing'),
    category: t('exerciseLibrary.categories.breathing'),
    difficulty: t('exerciseLibrary.difficulties.intermediate'),
    icon: Wind,
    color: ['#FDE68A', '#FCD34D'],
    image: require('../../assets/images/12.jpeg'),
    keywords: ['coherent breathing', 'heart focused', 'emotional balance', 'coherence'],
  },
  'morning-mindfulness': {
    id: 4,
    type: 'morning-mindfulness',
    name: t('exerciseLibrary.names.morningMindfulness'),
    duration: '8 min',
    description: t('exerciseLibrary.descriptions.morningMindfulness'),
    shortDescription: t('exerciseLibrary.shortDescriptions.morningMindfulness'),
    category: t('exerciseLibrary.categories.mindfulness'),
    difficulty: t('exerciseLibrary.difficulties.beginner'),
    icon: Eye,
    color: ['#E0F2FE', '#BAE6FD'],
    image: require('../../assets/images/4.jpeg'),
    keywords: ['morning', 'start day', 'morning mindfulness'],
  },
  'gratitude': {
    id: 5,
    type: 'gratitude',
    name: t('exerciseLibrary.names.gratitude'),
    duration: '10 min',
    description: t('exerciseLibrary.descriptions.gratitude'),
    shortDescription: t('exerciseLibrary.shortDescriptions.gratitude'),
    category: t('exerciseLibrary.categories.mindfulness'),
    difficulty: t('exerciseLibrary.difficulties.beginner'),
    icon: BookOpen,
    color: ['#FFD4BA', '#FFE5D4'],
    image: require('../../assets/images/5.jpeg'),
    keywords: ['gratitude', 'appreciation', 'thankful'],
  },
  'self-compassion': {
    id: 6,
    type: 'self-compassion',
    name: t('exerciseLibrary.names.selfCompassion'),
    duration: '5 min',
    description: t('exerciseLibrary.descriptions.selfCompassion'),
    shortDescription: t('exerciseLibrary.shortDescriptions.selfCompassion'),
    category: t('exerciseLibrary.categories.selfCare'),
    difficulty: t('exerciseLibrary.difficulties.beginner'),
    icon: Heart,
    color: ['#E8B5A6', '#F5E6D3'],
    image: require('../../assets/images/6.jpg'),
    keywords: ['self-compassion', 'self compassion', 'kind to yourself', 'self-care'],
  },
  'values-clarification': {
    id: 7,
    type: 'values-clarification',
    name: t('exerciseLibrary.names.valuesClarity'),
    duration: '15 min',
    description: t('exerciseLibrary.descriptions.valuesClarity'),
    shortDescription: t('exerciseLibrary.shortDescriptions.valuesClarity'),
    category: t('exerciseLibrary.categories.act'),
    difficulty: t('exerciseLibrary.difficulties.intermediate'),
    icon: Star,
    color: ['#D4C5B9', '#E5E5E5'],
    image: require('../../assets/images/7.jpeg'),
    keywords: ['values', 'meaning', 'purpose', 'what matters'],
  },
  'future-self-journaling': {
    id: 8,
    type: 'future-self-journaling',
    name: t('exerciseLibrary.names.futureSelfJournaling'),
    duration: '20 min',
    description: t('exerciseLibrary.descriptions.futureSelfJournaling'),
    shortDescription: t('exerciseLibrary.shortDescriptions.futureSelfJournaling'),
    category: t('exerciseLibrary.categories.selfDiscovery'),
    difficulty: t('exerciseLibrary.difficulties.intermediate'),
    icon: Clock,
    color: ['#99F6E4', '#5EEAD4'],
    image: require('../../assets/images/8.jpeg'),
    keywords: ['future self', 'vision', 'future', 'goals', 'dreams', 'journaling', 'clarity'],
  },
  'sorting-thoughts': {
    id: 9,
    type: 'sorting-thoughts',
    name: t('exerciseLibrary.names.sortingThoughts'),
    duration: '10 min',
    description: t('exerciseLibrary.descriptions.sortingThoughts'),
    shortDescription: t('exerciseLibrary.shortDescriptions.sortingThoughts'),
    category: t('exerciseLibrary.categories.cbt'),
    difficulty: t('exerciseLibrary.difficulties.beginner'),
    icon: Filter,
    color: ['#93C5FD', '#60A5FA'],
    image: require('../../assets/images/9.jpeg'),
    keywords: ['sorting thoughts', 'organize thoughts', 'clarity', 'overwhelmed', 'mental clutter', 'clear mind'],
  },
  'goal-setting': {
    id: 12,
    type: 'goal-setting',
    name: t('exerciseLibrary.names.goalSetting'),
    duration: '20 min',
    description: t('exerciseLibrary.descriptions.goalSetting'),
    shortDescription: t('exerciseLibrary.shortDescriptions.goalSetting'),
    category: t('exerciseLibrary.categories.selfGrowth'),
    difficulty: t('exerciseLibrary.difficulties.intermediate'),
    icon: Star,
    color: ['#FBBF24', '#F59E0B'],
    image: require('../../assets/images/10.jpeg'), // Reusing image for now
    keywords: ['goals', 'goal setting', 'therapy goals', 'values', 'motivation', 'purpose', 'direction', 'achievement', 'progress'],
  },
  'mindfulness': {
    id: 3,
    type: 'mindfulness',
    name: t('exerciseLibrary.names.mindfulness'),
    duration: '10 min',
    description: t('exerciseLibrary.descriptions.mindfulness'),
    shortDescription: t('exerciseLibrary.shortDescriptions.mindfulness'),
    category: t('exerciseLibrary.categories.mindfulness'),
    difficulty: t('exerciseLibrary.difficulties.beginner'),
    icon: Eye,
    color: ['#95B99C', '#B8C5A6'],
    image: require('../../assets/images/3.jpeg'),
    keywords: ['body scan', 'mindfulness', 'body awareness'],
  }
});

// Legacy export for backward compatibility
export const exerciseLibraryData = getExerciseLibraryData((key: string) => key);

export const getExerciseFlows = (t: (key: string) => string): Record<string, any> => ({
  'automatic-thoughts': {
    name: t('exerciseLibrary.names.automaticThoughts'),
    color: 'purple',
    useAI: true,
    steps: [
      {
        title: t('exerciseLibrary.steps.automaticThoughts.step1.title'),
        stepNumber: 1,
        description: t('exerciseLibrary.steps.automaticThoughts.step1.description'),
        instruction: t('exerciseLibrary.steps.automaticThoughts.step1.instruction')
      },
      {
        title: t('exerciseLibrary.steps.automaticThoughts.step2.title'),
        stepNumber: 2,
        description: t('exerciseLibrary.steps.automaticThoughts.step2.description'),
        instruction: t('exerciseLibrary.steps.automaticThoughts.step2.instruction')
      },
      {
        title: t('exerciseLibrary.steps.automaticThoughts.step3.title'),
        stepNumber: 3,
        description: t('exerciseLibrary.steps.automaticThoughts.step3.description'),
        instruction: t('exerciseLibrary.steps.automaticThoughts.step3.instruction')
      },
      {
        title: t('exerciseLibrary.steps.automaticThoughts.step4.title'),
        stepNumber: 4,
        description: t('exerciseLibrary.steps.automaticThoughts.step4.description'),
        instruction: t('exerciseLibrary.steps.automaticThoughts.step4.instruction')
      }
    ]
  },
  'breathing': {
    name: t('exerciseLibrary.names.breathing'),
    color: 'blue',
    useAI: true,
    steps: [
      {
        title: t('exerciseLibrary.steps.breathing.step1.title'),
        stepNumber: 1,
        description: t('exerciseLibrary.steps.breathing.step1.description'),
        instruction: t('exerciseLibrary.steps.breathing.step1.instruction')
      },
      {
        title: t('exerciseLibrary.steps.breathing.step2.title'),
        stepNumber: 2,
        description: t('exerciseLibrary.steps.breathing.step2.description'),
        instruction: t('exerciseLibrary.steps.breathing.step2.instruction')
      },
      {
        title: t('exerciseLibrary.steps.breathing.step3.title'),
        stepNumber: 3,
        description: t('exerciseLibrary.steps.breathing.step3.description'),
        instruction: t('exerciseLibrary.steps.breathing.step3.instruction')
      }
    ]
  },
  'mindfulness': {
    name: t('exerciseLibrary.names.mindfulness'),
    color: 'green',
    useAI: true,
    steps: [
      {
        title: t('exerciseLibrary.steps.mindfulness.step1.title'),
        stepNumber: 1,
        description: t('exerciseLibrary.steps.mindfulness.step1.description'),
        instruction: t('exerciseLibrary.steps.mindfulness.step1.instruction')
      },
      {
        title: t('exerciseLibrary.steps.mindfulness.step2.title'),
        stepNumber: 2,
        description: t('exerciseLibrary.steps.mindfulness.step2.description'),
        instruction: t('exerciseLibrary.steps.mindfulness.step2.instruction')
      },
      {
        title: t('exerciseLibrary.steps.mindfulness.step3.title'),
        stepNumber: 3,
        description: t('exerciseLibrary.steps.mindfulness.step3.description'),
        instruction: t('exerciseLibrary.steps.mindfulness.step3.instruction')
      }
    ]
  },
  'gratitude': {
    name: t('exerciseLibrary.names.gratitude'),
    color: 'orange',
    useAI: true,
    steps: [
      {
        title: t('exerciseLibrary.steps.gratitude.step1.title'),
        stepNumber: 1,
        description: t('exerciseLibrary.steps.gratitude.step1.description'),
        instruction: t('exerciseLibrary.steps.gratitude.step1.instruction')
      },
      {
        title: t('exerciseLibrary.steps.gratitude.step2.title'),
        stepNumber: 2,
        description: t('exerciseLibrary.steps.gratitude.step2.description'),
        instruction: t('exerciseLibrary.steps.gratitude.step2.instruction')
      },
      {
        title: t('exerciseLibrary.steps.gratitude.step3.title'),
        stepNumber: 3,
        description: t('exerciseLibrary.steps.gratitude.step3.description'),
        instruction: t('exerciseLibrary.steps.gratitude.step3.instruction')
      }
    ]
  },
  'self-compassion': {
    name: t('exerciseLibrary.names.selfCompassion'),
    color: 'pink',
    useAI: true,
    steps: [
      {
        title: t('exerciseLibrary.steps.selfCompassion.step1.title'),
        stepNumber: 1,
        description: t('exerciseLibrary.steps.selfCompassion.step1.description'),
        instruction: t('exerciseLibrary.steps.selfCompassion.step1.instruction')
      },
      {
        title: t('exerciseLibrary.steps.selfCompassion.step2.title'),
        stepNumber: 2,
        description: t('exerciseLibrary.steps.selfCompassion.step2.description'),
        instruction: t('exerciseLibrary.steps.selfCompassion.step2.instruction')
      },
      {
        title: t('exerciseLibrary.steps.selfCompassion.step3.title'),
        stepNumber: 3,
        description: t('exerciseLibrary.steps.selfCompassion.step3.description'),
        instruction: t('exerciseLibrary.steps.selfCompassion.step3.instruction')
      }
    ]
  },
  'values-clarification': {
    name: t('exerciseLibrary.names.valuesClarity'),
    color: 'gray',
    useAI: true,
    steps: [
      {
        title: t('exerciseLibrary.steps.valuesClarity.step1.title'),
        stepNumber: 1,
        description: t('exerciseLibrary.steps.valuesClarity.step1.description'),
        instruction: t('exerciseLibrary.steps.valuesClarity.step1.instruction')
      },
      {
        title: t('exerciseLibrary.steps.valuesClarity.step2.title'),
        stepNumber: 2,
        description: t('exerciseLibrary.steps.valuesClarity.step2.description'),
        instruction: t('exerciseLibrary.steps.valuesClarity.step2.instruction')
      },
      {
        title: t('exerciseLibrary.steps.valuesClarity.step3.title'),
        stepNumber: 3,
        description: t('exerciseLibrary.steps.valuesClarity.step3.description'),
        instruction: t('exerciseLibrary.steps.valuesClarity.step3.instruction')
      }
    ]
  },
  'future-self-journaling': {
    name: t('exerciseLibrary.names.futureSelfJournaling'),
    color: 'teal',
    useAI: true,
    steps: [
      {
        title: t('exerciseLibrary.steps.futureSelfJournaling.step1.title'),
        stepNumber: 1,
        description: t('exerciseLibrary.steps.futureSelfJournaling.step1.description'),
        instruction: t('exerciseLibrary.steps.futureSelfJournaling.step1.instruction')
      },
      {
        title: t('exerciseLibrary.steps.futureSelfJournaling.step2.title'),
        stepNumber: 2,
        description: t('exerciseLibrary.steps.futureSelfJournaling.step2.description'),
        instruction: t('exerciseLibrary.steps.futureSelfJournaling.step2.instruction')
      },
      {
        title: t('exerciseLibrary.steps.futureSelfJournaling.step3.title'),
        stepNumber: 3,
        description: t('exerciseLibrary.steps.futureSelfJournaling.step3.description'),
        instruction: t('exerciseLibrary.steps.futureSelfJournaling.step3.instruction')
      },
      {
        title: t('exerciseLibrary.steps.futureSelfJournaling.step4.title'),
        stepNumber: 4,
        description: t('exerciseLibrary.steps.futureSelfJournaling.step4.description'),
        instruction: t('exerciseLibrary.steps.futureSelfJournaling.step4.instruction')
      },
      {
        title: t('exerciseLibrary.steps.futureSelfJournaling.step5.title'),
        stepNumber: 5,
        description: t('exerciseLibrary.steps.futureSelfJournaling.step5.description'),
        instruction: t('exerciseLibrary.steps.futureSelfJournaling.step5.instruction')
      }
    ]
  },
  'sorting-thoughts': {
    name: t('exerciseLibrary.names.sortingThoughts'),
    color: 'blue',
    useAI: true,
    steps: [
      {
        title: t('exerciseLibrary.steps.sortingThoughts.step1.title'),
        stepNumber: 1,
        description: t('exerciseLibrary.steps.sortingThoughts.step1.description'),
        instruction: t('exerciseLibrary.steps.sortingThoughts.step1.instruction')
      },
      {
        title: t('exerciseLibrary.steps.sortingThoughts.step2.title'),
        stepNumber: 2,
        description: t('exerciseLibrary.steps.sortingThoughts.step2.description'),
        instruction: t('exerciseLibrary.steps.sortingThoughts.step2.instruction')
      },
      {
        title: t('exerciseLibrary.steps.sortingThoughts.step3.title'),
        stepNumber: 3,
        description: t('exerciseLibrary.steps.sortingThoughts.step3.description'),
        instruction: t('exerciseLibrary.steps.sortingThoughts.step3.instruction')
      }
    ]
  },
  'goal-setting': {
    name: t('exerciseLibrary.names.goalSetting'),
    color: 'yellow',
    useAI: false, // This uses the custom GoalSettingExercise component
    isCustomComponent: true,
    steps: [
      {
        title: t('exerciseLibrary.steps.goalSetting.step1.title'),
        stepNumber: 1,
        description: t('exerciseLibrary.steps.goalSetting.step1.description'),
        instruction: t('exerciseLibrary.steps.goalSetting.step1.instruction')
      },
      {
        title: t('exerciseLibrary.steps.goalSetting.step2.title'),
        stepNumber: 2,
        description: t('exerciseLibrary.steps.goalSetting.step2.description'),
        instruction: t('exerciseLibrary.steps.goalSetting.step2.instruction')
      },
      {
        title: t('exerciseLibrary.steps.goalSetting.step3.title'),
        stepNumber: 3,
        description: t('exerciseLibrary.steps.goalSetting.step3.description'),
        instruction: t('exerciseLibrary.steps.goalSetting.step3.instruction')
      },
      {
        title: t('exerciseLibrary.steps.goalSetting.step4.title'),
        stepNumber: 4,
        description: t('exerciseLibrary.steps.goalSetting.step4.description'),
        instruction: t('exerciseLibrary.steps.goalSetting.step4.instruction')
      },
      {
        title: t('exerciseLibrary.steps.goalSetting.step5.title'),
        stepNumber: 5,
        description: t('exerciseLibrary.steps.goalSetting.step5.description'),
        instruction: t('exerciseLibrary.steps.goalSetting.step5.instruction')
      },
      {
        title: t('exerciseLibrary.steps.goalSetting.step6.title'),
        stepNumber: 6,
        description: t('exerciseLibrary.steps.goalSetting.step6.description'),
        instruction: t('exerciseLibrary.steps.goalSetting.step6.instruction')
      }
    ]
  },
  'tell-your-story': {
    name: t('exerciseLibrary.names.tellYourStory'),
    color: 'yellow',
    useAI: true, // Changed to AI-guided for conversational flow
    isCustomComponent: false,
    steps: [
      {
        title: 'Set the Scene',
        stepNumber: 1,
        description: 'Start with who you are today.',
        instruction: "You are Anu, a calm, supportive guide. Ask the user to describe who they are today in 3-5 short sentences (age range, roles, where they live, what matters right now). Keep tone warm and neutral. Ask exactly one open question. Then wait. Do not analyze yet. If user seems unsure, offer 3 quick prompts as chips: ['work/study', 'relationships', 'health/wellbeing']."
      },
      {
        title: 'Chapters & Turning Points',
        stepNumber: 2,
        description: '3-5 life chapters and key moments.',
        instruction: "Invite the user to split their life into 3–5 simple chapters with a title and a key turning point for each (e.g., 'Moving cities', 'First big job', 'A loss', 'New start'). Ask for bullet points. One request at a time. Keep it short and pressure-free. If helpful, suggest a template: 'Chapter title – turning point – how it changed me (1 line)'."
      },
      {
        title: 'Meanings & Beliefs',
        stepNumber: 3,
        description: 'What beliefs grew from those moments?',
        instruction: "Ask the user to pick 1–2 turning points that still affect them and write the belief that formed (helpful or unhelpful). Then ask for evidence for and against each belief (1–2 bullets each). Use CBT tone: curious, non-judgmental. One belief at a time. Offer optional chips: ['evidence for', 'evidence against', 'how it helped', 'how it limited me']."
      },
      {
        title: 'Reframe & Strengths',
        stepNumber: 4,
        description: 'Rewrite the belief and name strengths.',
        instruction: "Guide a concise reframe for each chosen belief (1–2 sentences) using the user's own words and evidence. Then ask them to list 2–3 strengths shown in their story (e.g., persistence, kindness, courage, learning). Keep it practical and kind. If they struggle, offer a short menu of strengths to choose from."
      },
      {
        title: 'Next Chapter',
        stepNumber: 5,
        description: 'Choose a small action and a chapter title.',
        instruction: "Ask the user to name a 7-day, small, doable action that fits their reframe (must be specific, time-bound, <15 minutes). Then ask them to title their 'next chapter' in 3–5 words, hopeful and concrete. End with a 2-sentence summary: new belief, strength highlights, and the next action. Offer to save as a note and set a reminder."
      }
    ]
  },
  'vision-of-future': {
    name: t('exerciseLibrary.names.visionOfFuture'),
    color: 'blue',
    useAI: true,
    steps: [
      {
        title: t('exerciseLibrary.steps.visionOfFuture.step1.title'),
        stepNumber: 1,
        description: t('exerciseLibrary.steps.visionOfFuture.step1.description'),
        instruction: t('exerciseLibrary.steps.visionOfFuture.step1.instruction')
      },
      {
        title: t('exerciseLibrary.steps.visionOfFuture.step2.title'),
        stepNumber: 2,
        description: t('exerciseLibrary.steps.visionOfFuture.step2.description'),
        instruction: t('exerciseLibrary.steps.visionOfFuture.step2.instruction')
      },
      {
        title: t('exerciseLibrary.steps.visionOfFuture.step3.title'),
        stepNumber: 3,
        description: t('exerciseLibrary.steps.visionOfFuture.step3.description'),
        instruction: t('exerciseLibrary.steps.visionOfFuture.step3.instruction')
      },
      {
        title: t('exerciseLibrary.steps.visionOfFuture.step4.title'),
        stepNumber: 4,
        description: t('exerciseLibrary.steps.visionOfFuture.step4.description'),
        instruction: t('exerciseLibrary.steps.visionOfFuture.step4.instruction')
      }
    ]
  }
});

// Legacy export for backward compatibility
export const exerciseFlows = getExerciseFlows((key: string) => key);

// Unified data for rendering cards in the UI - now a function
export const getExercisesArray = (t: (key: string) => string) =>
  Object.entries(getExerciseLibraryData(t)).map(([slug, exercise]) => ({
    ...exercise,
    slug,
  }));

// Helper functions for accessing exercise data
export function getExerciseByType(type: string, t: (key: string) => string) {
  return getExerciseLibraryData(t)[type];
}

export function getExerciseFlow(type: string, t: (key: string) => string) {
  return getExerciseFlows(t)[type];
}

// Exercise keyword mapping to match AI suggestions with library exercises
export const EXERCISE_KEYWORDS = Object.entries(exerciseLibraryData).reduce((acc, [key, value]) => {
  acc[key] = value.keywords;
  return acc;
}, {} as Record<string, string[]>);

