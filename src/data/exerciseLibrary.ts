// Final, corrected exerciseLibrary.ts
import { Brain, Wind, Eye, BookOpen, Heart, Star, Clock, Filter } from 'lucide-react-native';

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
    image: require('../../assets/images/1.jpeg'),
    keywords: ['automatic thoughts', 'thought patterns', 'negative thoughts', 'cognitive', 'cbt'],
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
    image: require('../../assets/images/2.jpeg'),
    keywords: ['breathing', 'breath', '4-7-8'],
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
    image: require('../../assets/images/3.jpeg'),
    keywords: ['body scan', 'mindfulness', 'body awareness'],
  },
  'morning-mindfulness': {
    id: 4,
    type: 'morning-mindfulness',
    name: 'Morning Mindfulness',
    duration: '8 min',
    description: 'Start your day with gentle awareness and presence',
    category: 'Mindfulness',
    difficulty: 'Beginner',
    icon: Eye,
    color: ['#E0F2FE', '#BAE6FD'],
    image: require('../../assets/images/4.jpeg'),
    keywords: ['morning', 'start day', 'morning mindfulness'],
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
    image: require('../../assets/images/5.jpeg'),
    keywords: ['gratitude', 'appreciation', 'thankful'],
  },
  'self-compassion': {
    id: 6,
    type: 'self-compassion',
    name: 'Self-Compassion Break',
    duration: '5 min',
    description: 'Practice kindness towards yourself',
    category: 'Self-Care',
    difficulty: 'Beginner',
    icon: Heart,
    color: ['#E8B5A6', '#F5E6D3'],
    image: require('../../assets/images/6.jpg'),
    keywords: ['self-compassion', 'self compassion', 'kind to yourself', 'self-care'],
  },
  'values-clarification': {
    id: 7,
    type: 'values-clarification',
    name: 'Living Closer to My Values',
    duration: '15 min',
    description: 'Discover what truly matters to you and align your actions (ACT)',
    category: 'ACT',
    difficulty: 'Intermediate',
    icon: Star,
    color: ['#D4C5B9', '#E5E5E5'],
    image: require('../../assets/images/7.jpeg'),
    keywords: ['values', 'meaning', 'purpose', 'what matters'],
  },
  'future-self-journaling': {
    id: 8,
    type: 'future-self-journaling',
    name: 'Future Self Journaling',
    duration: '20 min',
    description: 'Connect with your future self to gain clarity and perspective',
    category: 'Self-Discovery',
    difficulty: 'Intermediate',
    icon: Clock,
    color: ['#99F6E4', '#5EEAD4'],
    image: require('../../assets/images/8.jpeg'),
    keywords: ['future self', 'vision', 'future', 'goals', 'dreams', 'journaling', 'clarity'],
  },
  'sorting-thoughts': {
    id: 9,
    type: 'sorting-thoughts',
    name: 'Sorting Thoughts',
    duration: '10 min',
    description: 'Organize and clarify overwhelming thoughts',
    category: 'CBT',
    difficulty: 'Beginner',
    icon: Filter,
    color: ['#93C5FD', '#60A5FA'],
    image: require('../../assets/images/9.jpeg'),
    keywords: ['sorting thoughts', 'organize thoughts', 'clarity', 'overwhelmed', 'mental clutter', 'clear mind'],
  }
};

export const exerciseFlows: Record<string, any> = {
  'automatic-thoughts': {
    name: 'Recognizing Automatic Thoughts',
    color: 'purple',
    useAI: true,
    steps: [
      {
        title: 'Welcome & Awareness',
        stepNumber: 1,
        description: 'Introduction to automatic thoughts',
        instruction: 'Ask the user to think of a recent situation where they felt upset, anxious, or stressed, and encourage them to share what happened.'
      },
      {
        title: 'Identifying the Thought',
        stepNumber: 2,
        description: 'Finding the specific thought',
        instruction: 'Help the user identify the specific automatic thought that came up in that situation. Ask "What was going through your mind in that moment?"'
      },
      {
        title: 'Examining the Evidence',
        stepNumber: 3,
        description: 'Looking at the thought objectively',
        instruction: 'Guide the user to examine their automatic thought more objectively. Ask questions like: "What evidence supports this thought? What evidence goes against it?"'
      },
      {
        title: 'Reframing & Integration',
        stepNumber: 4,
        description: 'Developing a balanced perspective',
        instruction: 'Help the user develop a more balanced, realistic thought to replace the automatic one. End by praising their work and suggesting they practice this skill daily.'
      }
    ]
  },
  'breathing': {
    name: '4-7-8 Breathing',
    color: 'blue',
    useAI: true,
    steps: [
      {
        title: 'Setup & First Cycle',
        stepNumber: 1,
        description: 'Learning and practicing the 4-7-8 technique',
        instruction: 'Guide the user to get comfortable. Explain the 4-7-8 pattern and walk them through one slow cycle together, counting aloud.'
      },
      {
        title: 'Guided Practice Session',
        stepNumber: 2,
        description: 'Practicing multiple cycles with guidance',
        instruction: 'Guide the user through 4-5 complete cycles of 4-7-8 breathing. Count each cycle clearly and offer gentle encouragement between them.'
      },
      {
        title: 'Integration & Daily Use',
        stepNumber: 3,
        description: 'Applying the technique in daily life',
        instruction: 'Ask the user how they feel now compared to when they started. Discuss when they might use this technique in their daily life.'
      }
    ]
  },
  'mindfulness': {
    name: 'Body Scan',
    color: 'green',
    useAI: true,
    steps: [
      {
        title: 'Settling In',
        stepNumber: 1,
        description: 'Preparing for body awareness',
        instruction: 'Guide the user to find a comfortable position. Ask them to close their eyes if they wish and to just be present with the sensation of their body.'
      },
      {
        title: 'Guided Scan',
        stepNumber: 2,
        description: 'Mindfully scanning the body',
        instruction: 'Guide the user to bring their attention to different parts of their body, starting with their feet and moving slowly up to their head.'
      },
      {
        title: 'Integration',
        stepNumber: 3,
        description: 'Bringing the awareness into the present moment',
        instruction: 'Ask the user to notice any shifts in how they feel and to bring this feeling of awareness into the rest of their day.'
      }
    ]
  },
  'gratitude': {
    name: 'Gratitude Practice',
    color: 'orange',
    useAI: true,
    steps: [
      {
        title: 'Finding the Feeling',
        stepNumber: 1,
        description: 'Recalling moments of gratitude',
        instruction: 'Ask the user to think of a few things they are truly grateful for and to share one with you.'
      },
      {
        title: 'Deepening the Feeling',
        stepNumber: 2,
        description: 'Exploring the feeling of gratitude',
        instruction: 'Help the user explore what made them grateful for that moment. Ask them to describe how it felt in their body.'
      },
      {
        title: 'Expanding the Practice',
        stepNumber: 3,
        description: 'Integrating gratitude into daily life',
        instruction: 'Ask the user to reflect on how they can bring more of this feeling into their daily life and end the exercise on an encouraging note.'
      }
    ]
  },
  'self-compassion': {
    name: 'Self-Compassion Break',
    color: 'pink',
    useAI: true,
    steps: [
      {
        title: 'Acknowledging the Struggle',
        stepNumber: 1,
        description: 'Recognizing a difficult moment',
        instruction: 'Ask the user to bring to mind a situation that is currently causing them suffering or pain.'
      },
      {
        title: 'Common Humanity',
        stepNumber: 2,
        description: 'Connecting to others',
        instruction: 'Guide the user to reflect on the idea that they are not alone in their suffering. Remind them that all humans struggle sometimes.'
      },
      {
        title: 'Self-Kindness',
        stepNumber: 3,
        description: 'Responding with kindness',
        instruction: 'Ask the user to offer themselves a kind, comforting phrase that they would give a friend who was suffering in the same way.'
      }
    ]
  },
  'values-clarification': {
    name: 'Living Closer to My Values',
    color: 'gray',
    useAI: true,
    steps: [
      {
        title: 'Identifying Values',
        stepNumber: 1,
        description: 'Discovering core values',
        instruction: 'Ask the user to think about what is most important to them in their life. Encourage them to share a few core values that come to mind.'
      },
      {
        title: 'Aligning Actions',
        stepNumber: 2,
        description: 'Connecting values to behavior',
        instruction: 'Ask the user to think of a recent action they took. Ask them to reflect on whether that action was in line with their values.'
      },
      {
        title: 'Setting Intentions',
        stepNumber: 3,
        description: 'Creating a values-driven path',
        instruction: 'Guide the user to set a small, actionable intention for the week that will help them live more in line with their values.'
      }
    ]
  },
  'future-self-journaling': {
    name: 'Future Self Journaling',
    color: 'teal',
    useAI: true,
    steps: [
      {
        title: 'Welcome & Intention',
        stepNumber: 1,
        description: 'Introducing the practice and setting a gentle focus.',
        instruction: 'Encourage the user to open the exercise with presence and set an intention for exploring their future self.'
      },
      {
        title: 'Envisioning the Future Self',
        stepNumber: 2,
        description: 'Imagining a future version of oneself in daily life.',
        instruction: 'Guide the user to create a vision of their future self, noticing how they live, feel, and carry themselves in different aspects of life.'
      },
      {
        title: 'Exploring Character & Values',
        stepNumber: 3,
        description: 'Deepening the vision by reflecting on inner qualities.',
        instruction: 'Encourage the user to focus on the qualities, strengths, and values that define their future self and how these shape their way of being.'
      },
      {
        title: 'Dialogue Across Time',
        stepNumber: 4,
        description: 'Creating a connection between present and future.',
        instruction: 'Invite the user to imagine an exchange with their future self, noticing what guidance, reassurance, or perspective arises.'
      },
      {
        title: 'Integration & Takeaway',
        stepNumber: 5,
        description: 'Bringing insights from the vision into the present.',
        instruction: 'Support the user in capturing one key takeaway from their future self and grounding it as a reminder for daily life.'
      }
    ]
  },
  'sorting-thoughts': {
    name: 'Sorting Thoughts',
    color: 'blue',
    useAI: true,
    steps: [
      {
        title: 'Welcome & Awareness',
        stepNumber: 1,
        description: 'Opening space to share current thoughts.',
        instruction: 'Invite the user to share the thoughts on their mind right now.'
      },
      {
        title: 'Organizing',
        stepNumber: 2,
        description: 'Bringing structure and clarity.',
        instruction: 'Support the user in sorting these thoughts, noticing what feels most important and what feels secondary.'
      },
      {
        title: 'Integration',
        stepNumber: 3,
        description: 'Ending with reflection.',
        instruction: 'Encourage the user to notice how it feels to see their thoughts more clearly, and what takeaway they want to hold onto.'
      }
    ]
  }
};

// Unified data for rendering cards in the UI
export const exercisesArray = Object.values(exerciseLibraryData);

// Helper functions for accessing exercise data
export function getExerciseByType(type: string) {
  return exerciseLibraryData[type];
}

export function getExerciseFlow(type: string) {
  return exerciseFlows[type];
}

// Exercise keyword mapping to match AI suggestions with library exercises
export const EXERCISE_KEYWORDS = Object.entries(exerciseLibraryData).reduce((acc, [key, value]) => {
  acc[key] = value.keywords;
  return acc;
}, {} as Record<string, string[]>);