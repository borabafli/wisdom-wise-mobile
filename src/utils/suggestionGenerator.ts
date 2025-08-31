/**
 * Dynamic sentence suggestion generator for chat interface
 * Analyzes the AI's response to provide contextual user suggestions
 */

export interface SuggestionConfig {
  keywords: string[];
  suggestions: string[];
  priority: number; // Higher priority = more likely to be selected
}

// Enhanced contextual suggestion patterns based on AI response content
const suggestionPatterns: SuggestionConfig[] = [
  // Questions and open-ended responses
  {
    keywords: ['what', 'how', 'which', 'tell me', 'describe', 'share', '?', 'wonder', 'explore', 'curious'],
    suggestions: [
      "Let me think about that",
      "I'm not sure exactly",
      "That's a good question",
      "It's complicated",
      "I haven't thought about it",
      "I'd like to explore this",
      "Help me understand"
    ],
    priority: 9
  },

  // Stress and anxiety responses
  {
    keywords: ['stress', 'heavy', 'weight', 'anxious', 'overwhelm', 'pressure', 'burden', 'racing', 'panic', 'worry'],
    suggestions: [
      "Work has been overwhelming",
      "I feel stuck in my thoughts", 
      "Everything feels too much",
      "I can't seem to relax",
      "My mind won't stop racing",
      "I'm worried about everything",
      "I feel so anxious"
    ],
    priority: 10
  },

  // Breathing and mindfulness exercises
  {
    keywords: ['breathe', 'breath', 'present', 'moment', 'ground', 'center', 'calm', 'exercise', 'try'],
    suggestions: [
      "I'll try that breathing",
      "I want to feel more present",
      "Help me focus on now", 
      "I need to slow down",
      "Let's do this together",
      "I want to try that",
      "Show me how"
    ],
    priority: 10
  },

  // Emotions and feelings exploration
  {
    keywords: ['feel', 'feeling', 'emotion', 'heart', 'inside', 'within', 'valid', 'makes sense'],
    suggestions: [
      "I'm feeling overwhelmed",
      "I'm not sure what I feel",
      "It's hard to describe",
      "I feel conflicted", 
      "Something doesn't feel right",
      "That resonates with me",
      "I feel understood"
    ],
    priority: 9
  },

  // Therapeutic validation responses
  {
    keywords: ['valid', 'understand', 'makes sense', 'normal', 'human', 'hear you', 'not alone'],
    suggestions: [
      "That means a lot to hear",
      "I feel less alone now",
      "Thank you for understanding",
      "I needed to hear that",
      "That validates how I feel",
      "I don't feel so weird now"
    ],
    priority: 9
  },

  // Exercise suggestions and therapeutic tools
  {
    keywords: ['exercise', 'practice', 'tool', 'technique', 'cbt', 'mindfulness', 'body scan', 'gratitude', 'compassion'],
    suggestions: [
      "I want to try that",
      "How does that work?",
      "I'm ready to practice",
      "Let's do it together",
      "I need help with this",
      "Can you guide me?",
      "I'm open to trying"
    ],
    priority: 10
  },

  // Progress and growth
  {
    keywords: ['progress', 'grow', 'journey', 'step', 'move forward', 'better', 'improve', 'healing', 'change'],
    suggestions: [
      "I want to get better",
      "I'm trying to improve",
      "It's been a slow process",
      "I feel like I'm stuck",
      "I want to make progress",
      "I'm ready for change",
      "Help me move forward"
    ],
    priority: 8
  },

  // Support and encouragement acknowledgment
  {
    keywords: ['support', 'here', 'listen', 'understand', 'care', 'safe', 'space', 'presence'],
    suggestions: [
      "Thank you for listening",
      "I appreciate your support",
      "That means a lot to me",
      "I feel heard",
      "This helps so much",
      "I feel safe here",
      "Your presence is calming"
    ],
    priority: 8
  },

  // Self-criticism and inner critic work
  {
    keywords: ['inner critic', 'harsh', 'hard on yourself', 'self-criticism', 'judge', 'critical voice'],
    suggestions: [
      "I am hard on myself",
      "My inner critic is loud",
      "I judge myself constantly", 
      "I'm never good enough",
      "I want to be kinder to me",
      "How do I stop this voice?",
      "I need more self-compassion"
    ],
    priority: 10
  },

  // Thought patterns and CBT
  {
    keywords: ['thoughts', 'thinking', 'mind', 'pattern', 'automatic', 'cognitive', 'distortion'],
    suggestions: [
      "My thoughts spiral a lot",
      "I think the worst always",
      "These patterns are exhausting",
      "I want to change my thinking",
      "My mind traps me",
      "Help me see this differently",
      "I need new perspectives"
    ],
    priority: 9
  },

  // Relationships and connections
  {
    keywords: ['family', 'friend', 'relationship', 'people', 'connect', 'alone', 'lonely', 'boundaries'],
    suggestions: [
      "I struggle with relationships",
      "I feel disconnected",
      "People don't understand me",
      "I wish I could connect better",
      "I feel alone sometimes",
      "I need better boundaries",
      "It's hard to trust people"
    ],
    priority: 8
  },

  // Values and purpose
  {
    keywords: ['values', 'purpose', 'meaning', 'direction', 'important', 'matter', 'aligned'],
    suggestions: [
      "I feel lost right now",
      "What matters to me?",
      "I need more purpose",
      "I want to live meaningfully",
      "Help me find direction",
      "I feel disconnected from values",
      "I want to be more aligned"
    ],
    priority: 8
  },

  // Work and life balance
  {
    keywords: ['work', 'job', 'daily', 'routine', 'busy', 'schedule', 'balance', 'burnout'],
    suggestions: [
      "Work is really stressful",
      "I'm struggling with balance",
      "My routine feels overwhelming", 
      "I can't keep up",
      "I need better boundaries",
      "I think I'm burning out",
      "I work too much"
    ],
    priority: 7
  },

  // Self-doubt and confidence
  {
    keywords: ['doubt', 'confidence', 'believe', 'capable', 'strong', 'weak', 'can\'t', 'imposter'],
    suggestions: [
      "I don't feel capable",
      "I doubt myself a lot",
      "I feel like I'm failing",
      "I'm not strong enough",
      "I wish I was more confident",
      "I feel like a fraud",
      "Everyone else seems better"
    ],
    priority: 8
  },

  // Sleep and physical wellness
  {
    keywords: ['sleep', 'rest', 'tired', 'exhausted', 'energy', 'night', 'body', 'tension'],
    suggestions: [
      "I'm having trouble sleeping",
      "I feel exhausted lately",
      "I can't seem to rest",
      "My sleep has been off",
      "I wake up tired",
      "My body holds tension",
      "I need to rest more"
    ],
    priority: 7
  },

  // Gratitude and positive focus
  {
    keywords: ['grateful', 'appreciate', 'thankful', 'positive', 'good', 'blessing', 'fortunate'],
    suggestions: [
      "I want to feel more grateful",
      "Help me see the good",
      "I forget to appreciate things",
      "I need more positivity",
      "What am I grateful for?",
      "I want to focus on blessings",
      "That's a good reminder"
    ],
    priority: 7
  },

  // Default fallbacks for general conversation
  {
    keywords: ['and', 'the', 'is', 'you', 'me', 'i'], // Common words (fallback)
    suggestions: [
      "I'm feeling okay today",
      "Can you help me with something?",
      "I understand",
      "That makes sense",
      "I need some guidance",
      "Tell me more",
      "I'm listening"
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
 * Enhanced AI response analysis for better contextual suggestions
 */
export const generateSuggestions = (aiResponse: string): string[] => {
  if (!aiResponse || aiResponse.trim().length === 0) {
    return shuffleArray(defaultSuggestions).slice(0, 4);
  }

  const response = aiResponse.toLowerCase();
  const matchedPatterns: { pattern: SuggestionConfig; score: number }[] = [];
  
  // Enhanced scoring with multiple factors
  for (const pattern of suggestionPatterns) {
    let score = 0;
    let keywordMatches = 0;
    
    // Count keyword matches with position weighting
    for (const keyword of pattern.keywords) {
      const keywordLower = keyword.toLowerCase();
      if (response.includes(keywordLower)) {
        keywordMatches += 1;
        
        // Give higher score to keywords that appear earlier in the response
        const firstIndex = response.indexOf(keywordLower);
        const positionWeight = Math.max(0.5, 1 - (firstIndex / response.length));
        score += positionWeight;
      }
    }
    
    if (keywordMatches > 0) {
      // Boost score for multiple keyword matches from same pattern
      const keywordBonus = keywordMatches > 1 ? 1.5 : 1;
      const finalScore = score * pattern.priority * keywordBonus;
      
      matchedPatterns.push({
        pattern,
        score: finalScore
      });
    }
  }

  // Sort by score (highest first)
  matchedPatterns.sort((a, b) => b.score - a.score);

  // If we have strong matches, use them
  if (matchedPatterns.length > 0) {
    // Use weighted selection - favor higher scored patterns but include variety
    const suggestions: string[] = [];
    const topPatterns = matchedPatterns.slice(0, 3); // Consider top 3 patterns
    
    for (const { pattern } of topPatterns) {
      const shuffledPatternSuggestions = shuffleArray(pattern.suggestions);
      // Take 1-2 suggestions from each high-scoring pattern
      const takeCount = pattern === topPatterns[0].pattern ? 2 : 1;
      suggestions.push(...shuffledPatternSuggestions.slice(0, takeCount));
    }
    
    // Fill remaining slots with diverse suggestions if needed
    if (suggestions.length < 4) {
      const remainingPatterns = matchedPatterns.slice(3);
      for (const { pattern } of remainingPatterns) {
        if (suggestions.length >= 4) break;
        const randomSuggestion = pattern.suggestions[Math.floor(Math.random() * pattern.suggestions.length)];
        if (!suggestions.includes(randomSuggestion)) {
          suggestions.push(randomSuggestion);
        }
      }
    }
    
    // Return unique, shuffled suggestions
    const uniqueSuggestions = [...new Set(suggestions)];
    return shuffleArray(uniqueSuggestions).slice(0, 4);
  }

  // Fallback to contextually appropriate defaults
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