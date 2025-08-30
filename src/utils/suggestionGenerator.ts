/**
 * Dynamic sentence suggestion generator for chat interface
 * Analyzes the AI's response to provide contextual user suggestions
 */

export interface SuggestionConfig {
  keywords: string[];
  suggestions: string[];
  priority: number; // Higher priority = more likely to be selected
}

// Contextual suggestion patterns based on AI response content
const suggestionPatterns: SuggestionConfig[] = [
  // Questions and open-ended responses
  {
    keywords: ['what', 'how', 'which', 'tell me', 'describe', 'share', '?'],
    suggestions: [
      "Let me think about that",
      "I'm not sure exactly",
      "That's a good question",
      "It's complicated",
      "I haven't thought about it that way"
    ],
    priority: 8
  },

  // Stress and anxiety responses
  {
    keywords: ['stress', 'heavy', 'weight', 'anxious', 'overwhelm', 'pressure', 'burden'],
    suggestions: [
      "Work has been overwhelming",
      "I feel stuck in my thoughts",
      "Everything feels too much",
      "I can't seem to relax",
      "My mind won't stop racing"
    ],
    priority: 9
  },

  // Breathing and mindfulness
  {
    keywords: ['breathe', 'breath', 'present', 'moment', 'ground', 'center', 'calm'],
    suggestions: [
      "I'll try that breathing",
      "I want to feel more present",
      "Help me focus on now",
      "I need to slow down",
      "Let's do this together"
    ],
    priority: 9
  },

  // Emotions and feelings
  {
    keywords: ['feel', 'feeling', 'emotion', 'heart', 'inside', 'within'],
    suggestions: [
      "I'm feeling overwhelmed",
      "I'm not sure what I feel",
      "It's hard to describe",
      "I feel conflicted",
      "Something doesn't feel right"
    ],
    priority: 8
  },

  // Progress and growth
  {
    keywords: ['progress', 'grow', 'journey', 'step', 'move forward', 'better', 'improve'],
    suggestions: [
      "I want to get better",
      "I'm trying to improve",
      "It's been a slow process",
      "I feel like I'm stuck",
      "I want to make progress"
    ],
    priority: 7
  },

  // Support and encouragement
  {
    keywords: ['support', 'here', 'listen', 'understand', 'care', 'safe'],
    suggestions: [
      "Thank you for listening",
      "I appreciate your support",
      "That means a lot to me",
      "I feel heard",
      "This helps"
    ],
    priority: 8
  },

  // Past and reflection
  {
    keywords: ['remember', 'past', 'before', 'used to', 'history', 'childhood', 'experience'],
    suggestions: [
      "That reminds me of something",
      "I've been through this before",
      "It brings back memories",
      "I used to feel differently",
      "That's familiar"
    ],
    priority: 7
  },

  // Relationships and connections
  {
    keywords: ['family', 'friend', 'relationship', 'people', 'connect', 'alone', 'lonely'],
    suggestions: [
      "I struggle with relationships",
      "I feel disconnected",
      "People don't understand me",
      "I wish I could connect better",
      "I feel alone sometimes"
    ],
    priority: 8
  },

  // Work and daily life
  {
    keywords: ['work', 'job', 'daily', 'routine', 'busy', 'schedule'],
    suggestions: [
      "Work is really stressful",
      "I'm struggling with balance",
      "My routine feels overwhelming",
      "I can't keep up",
      "I need better boundaries"
    ],
    priority: 7
  },

  // Self-doubt and confidence
  {
    keywords: ['doubt', 'confidence', 'believe', 'capable', 'strong', 'weak', 'can\'t'],
    suggestions: [
      "I don't feel capable",
      "I doubt myself a lot",
      "I feel like I'm failing",
      "I'm not strong enough",
      "I wish I was more confident"
    ],
    priority: 8
  },

  // Sleep and rest
  {
    keywords: ['sleep', 'rest', 'tired', 'exhausted', 'energy', 'night'],
    suggestions: [
      "I'm having trouble sleeping",
      "I feel exhausted lately",
      "I can't seem to rest",
      "My sleep has been off",
      "I wake up tired"
    ],
    priority: 7
  },

  // General therapeutic responses
  {
    keywords: ['therapy', 'healing', 'better', 'help', 'change', 'different'],
    suggestions: [
      "I want things to change",
      "I'm open to trying new things",
      "I need help with this",
      "I want to feel better",
      "I'm ready to work on myself"
    ],
    priority: 6
  },

  // Default fallbacks for general conversation
  {
    keywords: ['and', 'the', 'is', 'you', 'me', 'i'], // Common words (fallback)
    suggestions: [
      "I'm feeling okay today",
      "Can you help me with something?",
      "I understand",
      "That makes sense",
      "I need some guidance"
    ],
    priority: 3 // Lowest priority
  }
];

// Default suggestions for first message or when no pattern matches
const defaultSuggestions = [
  "I'm feeling stressed today",
  "I need someone to talk to",
  "I'm struggling with something",
  "I want to feel better",
  "I'm having a hard time"
];

/**
 * Analyze AI response and generate contextual suggestions
 */
export const generateSuggestions = (aiResponse: string): string[] => {
  if (!aiResponse || aiResponse.trim().length === 0) {
    return defaultSuggestions;
  }

  const response = aiResponse.toLowerCase();
  const matchedPatterns: { pattern: SuggestionConfig; score: number }[] = [];

  // Score each pattern based on keyword matches
  for (const pattern of suggestionPatterns) {
    let score = 0;
    for (const keyword of pattern.keywords) {
      if (response.includes(keyword.toLowerCase())) {
        score += 1;
      }
    }
    
    if (score > 0) {
      matchedPatterns.push({
        pattern,
        score: score * pattern.priority
      });
    }
  }

  // Sort by score (highest first)
  matchedPatterns.sort((a, b) => b.score - a.score);

  // If we have matches, use the top scoring patterns
  if (matchedPatterns.length > 0) {
    const topPatterns = matchedPatterns.slice(0, 2); // Use top 2 patterns
    let suggestions: string[] = [];
    
    for (const { pattern } of topPatterns) {
      suggestions = suggestions.concat(pattern.suggestions);
    }
    
    // Shuffle and return unique suggestions
    const uniqueSuggestions = [...new Set(suggestions)];
    return shuffleArray(uniqueSuggestions).slice(0, 4); // Return max 4 suggestions
  }

  // Fallback to default suggestions
  return shuffleArray(defaultSuggestions).slice(0, 4);
};

/**
 * Shuffle array utility
 */
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Generate suggestions for first message (when starting conversation)
 */
export const getFirstMessageSuggestions = (): string[] => {
  const firstMessageSuggestions = [
    "I'm feeling stressed today",
    "I need someone to talk to", 
    "I'm struggling with anxiety",
    "I want to feel more peaceful",
    "I'm having trouble sleeping",
    "I feel overwhelmed lately",
    "I need help processing something",
    "I want to work on myself"
  ];
  
  return shuffleArray(firstMessageSuggestions).slice(0, 4);
};