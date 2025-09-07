// Final, corrected exerciseLibrary.ts
import { Brain, Wind, Eye, BookOpen, Heart, Star, Clock, Filter, FileText } from 'lucide-react-native';

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
  'box-breathing': {
    id: 10,
    type: 'breathing',
    name: 'Box Breathing',
    duration: '8 min',
    description: 'Balance your mind with equal breathing phases for focus and stress relief',
    category: 'Breathing',
    difficulty: 'Intermediate',
    icon: Wind,
    color: ['#7DD3FC', '#93C5FD'],
    image: require('../../assets/images/10.jpeg'),
    keywords: ['box breathing', 'square breathing', 'focus', 'stress relief', 'balance'],
  },
  'triangle-breathing': {
    id: 11,
    type: 'breathing',
    name: 'Triangle Breathing',
    duration: '6 min',
    description: 'Simple three-phase breathing for mindfulness and relaxation',
    category: 'Breathing',
    difficulty: 'Beginner',
    icon: Wind,
    color: ['#A7F3D0', '#6EE7B7'],
    image: require('../../assets/images/11.jpeg'),
    keywords: ['triangle breathing', 'three phase', 'mindfulness', 'simple', 'relaxation'],
  },
  'coherent-breathing': {
    id: 12,
    type: 'breathing',
    name: 'Coherent Breathing',
    duration: '10 min',
    description: 'Heart-focused breathing for emotional balance and coherence',
    category: 'Breathing',
    difficulty: 'Intermediate',
    icon: Wind,
    color: ['#FDE68A', '#FCD34D'],
    image: require('../../assets/images/12.jpeg'),
    keywords: ['coherent breathing', 'heart focused', 'emotional balance', 'coherence'],
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
  },
  'goal-setting': {
    id: 12,
    type: 'goal-setting',
    name: 'Therapy Goal-Setting',
    duration: '20 min',
    description: 'Create meaningful, achievable therapy goals aligned with your values',
    category: 'Self-Growth',
    difficulty: 'Intermediate',
    icon: Star,
    color: ['#FBBF24', '#F59E0B'],
    image: require('../../assets/images/10.jpeg'), // Reusing image for now
    keywords: ['goals', 'goal setting', 'therapy goals', 'values', 'motivation', 'purpose', 'direction', 'achievement', 'progress'],
  },
  'tell-your-story': {
    id: 13,
    type: 'tell-your-story',
    name: 'Tell Me Your Story',
    duration: '15-25 min',
    description: 'Reflect on your personal journey, identify strengths, and gain deeper self-understanding',
    category: 'Self-Discovery',
    difficulty: 'Beginner',
    icon: FileText,
    color: ['#FEF3C7', '#FDE68A'],
    image: require('../../assets/images/8.jpeg'), // Reusing appropriate image
    keywords: ['story', 'narrative', 'reflection', 'journey', 'personal history', 'strengths', 'self-understanding', 'life story', 'identity'],
  },
  'vision-of-future': {
    id: 14,
    type: 'vision-of-future',
    name: 'Vision of the Future',
    duration: '20-30 min',
    description: 'Imagine and emotionally connect to an inspiring future that guides your present',
    category: 'Self-Discovery',
    difficulty: 'Intermediate',
    icon: Star,
    color: ['#E0F2FE', '#7DD3FC'],
    image: require('../../assets/images/8.jpeg'), // Reusing appropriate image
    keywords: ['vision', 'future', 'goals', 'dreams', 'inspiration', 'values', 'purpose', 'life direction', 'imagination', 'hope'],
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
  },
  'goal-setting': {
    name: 'Therapy Goal-Setting',
    color: 'yellow',
    useAI: false, // This uses the custom GoalSettingExercise component
    isCustomComponent: true,
    steps: [
      {
        title: 'Introduction',
        stepNumber: 1,
        description: 'Understanding the purpose of therapy goal-setting.',
        instruction: 'Explain how therapy goals provide direction and motivation for personal growth.'
      },
      {
        title: 'Focus Area Selection',
        stepNumber: 2,
        description: 'Choose what area of life to focus on.',
        instruction: 'Help user select from emotional well-being, relationships, habits, or personal growth areas.'
      },
      {
        title: 'Goal Clarification',
        stepNumber: 3,
        description: 'Define what they want to be different.',
        instruction: 'Guide user to phrase their goal positively and specifically.'
      },
      {
        title: 'Practical Steps',
        stepNumber: 4,
        description: 'Break the goal into actionable steps.',
        instruction: 'Help identify one small, doable step they can take this week.'
      },
      {
        title: 'Motivation & Values',
        stepNumber: 5,
        description: 'Connect the goal to deeper meaning.',
        instruction: 'Explore why this goal matters and how it aligns with their values.'
      },
      {
        title: 'Timeline & Planning',
        stepNumber: 6,
        description: 'Set a realistic timeframe for progress.',
        instruction: 'Choose appropriate timeline and discuss progress tracking.'
      }
    ]
  },
  'tell-your-story': {
    name: 'Tell Me Your Story',
    color: 'yellow',
    useAI: false, // This uses the custom StorytellingExercise component
    isCustomComponent: true,
    steps: [
      {
        title: 'Introduction',
        stepNumber: 1,
        description: 'Understanding the purpose of sharing your story.',
        instruction: 'Explain how storytelling can help with self-reflection and identifying strengths.'
      },
      {
        title: 'Timeline Choice',
        stepNumber: 2,
        description: 'Choose how to frame your story.',
        instruction: 'Help user select between childhood to today, recent years, or a specific theme.'
      },
      {
        title: 'Open Sharing',
        stepNumber: 3,
        description: 'Tell your story in your own words.',
        instruction: 'Provide a safe space for the user to share what has shaped them most.'
      },
      {
        title: 'Deepening Questions',
        stepNumber: 4,
        description: 'Optional deeper reflection questions.',
        instruction: 'Ask follow-up questions about growth, strengths, and key insights.'
      },
      {
        title: 'Compassionate Reflection',
        stepNumber: 5,
        description: 'Receive supportive reflection on your story.',
        instruction: 'Provide compassionate summary highlighting strengths, resilience, and values.'
      }
    ]
  },
  'vision-of-future': {
    name: 'Vision of the Future',
    color: 'blue',
    useAI: true,
    steps: [
      {
        title: 'Welcome & Intention',
        stepNumber: 1,
        description: 'Setting the frame for exploring your future self',
        instruction: 'Welcome the user warmly and explain that this exercise is about imagining their future self and drawing inspiration from that vision. Encourage them to approach this with openness and curiosity, not as a rigid life plan but as a guiding compass.'
      },
      {
        title: 'Envisioning Daily Life',
        stepNumber: 2,
        description: 'Imagining your future self in daily life',
        instruction: 'Guide the user to envision their future self living a typical day. Ask them to describe what their daily life looks like, how they wake up, what their relationships feel like, how they approach work or activities, and what brings them joy. Encourage rich, sensory details about how this future self lives.'
      },
      {
        title: 'Character & Values Exploration',
        stepNumber: 3,
        description: 'Exploring the inner qualities of your future self',
        instruction: 'Encourage the user to focus on the character qualities and values that define their future self. Ask about what qualities they embody - perhaps grounded, confident, connected, joyful. How do these values shape their way of being? Focus on identity-based aspects rather than just achievements.'
      },
      {
        title: 'Life Domains Integration',
        stepNumber: 4,
        description: 'Exploring different areas of life',
        instruction: 'Help the user explore how their future self shows up across different life domains: relationships (family, friends, community), health and well-being, career or meaningful work, creativity or hobbies, and lifestyle choices. Ask how their core values express themselves in each area.'
      },
      {
        title: 'Emotional Connection',
        stepNumber: 5,
        description: 'Connecting emotionally with this future vision',
        instruction: 'Guide the user to connect with how it feels to be this future self. Ask them to sit with the emotional experience of living as this person. What does confidence feel like in their body? How does living aligned with their values affect their daily experience? Build motivation and emotional resonance.'
      },
      {
        title: 'Wisdom Exchange',
        stepNumber: 6,
        description: 'Receiving guidance from your future self',
        instruction: 'Invite the user to imagine their future self has some words of guidance or encouragement for their present self. What would this future self want them to know? What reassurance or perspective might they offer about current challenges? Foster a dialogue across time.'
      },
      {
        title: 'Present Integration',
        stepNumber: 7,
        description: 'Bringing the vision into today',
        instruction: 'Help the user identify 1-2 small, practical steps they could take today or this week that would align them with their future vision. Focus on embodying the qualities of their future self right now, rather than just achieving goals. Ask: "How can you be a little more like your future self today?"'
      },
      {
        title: 'Guiding Sentences',
        stepNumber: 8,
        description: 'Creating your personal compass',
        instruction: 'Support the user in creating 2-3 short, meaningful sentences that capture the essence of their vision - like personal mantras or affirmations they can return to. These should feel inspiring and authentic to them, serving as a compass for daily decisions.'
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