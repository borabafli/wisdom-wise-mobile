/**
 * Motivational and mindfulness quotes for WisdomWise app
 */

export interface Quote {
  id: string;
  text: string;
  author: string;
  category: 'mindfulness' | 'progress' | 'courage' | 'peace' | 'growth' | 'resilience';
}

export const motivationalQuotes: Quote[] = [
  // Progress & Growth
  {
    id: '1',
    text: 'Progress is progress, no matter how small',
    author: 'Daily Mindfulness',
    category: 'progress'
  },
  {
    id: '2', 
    text: 'You are not going to master the rest of your life in one day. Just relax. Master the day.',
    author: 'Unknown',
    category: 'progress'
  },
  {
    id: '3',
    text: 'Every moment is a fresh beginning',
    author: 'T.S. Eliot',
    category: 'growth'
  },
  {
    id: '4',
    text: 'What lies behind us and what lies before us are tiny matters compared to what lies within us',
    author: 'Ralph Waldo Emerson',
    category: 'courage'
  },

  // Mindfulness & Present Moment
  {
    id: '5',
    text: 'The present moment is the only time over which we have dominion',
    author: 'Thich Nhat Hanh',
    category: 'mindfulness'
  },
  {
    id: '6',
    text: 'Peace comes from within. Do not seek it without.',
    author: 'Buddha',
    category: 'peace'
  },
  {
    id: '7',
    text: 'Wherever you are, be there totally',
    author: 'Eckhart Tolle',
    category: 'mindfulness'
  },
  {
    id: '8',
    text: 'The way out is through',
    author: 'Robert Frost',
    category: 'resilience'
  },

  // Courage & Strength
  {
    id: '9',
    text: 'You have been assigned this mountain to show others it can be moved',
    author: 'Mel Robbins',
    category: 'courage'
  },
  {
    id: '10',
    text: 'The only way to make sense out of change is to plunge into it, move with it, and join the dance',
    author: 'Alan Watts',
    category: 'growth'
  },
  {
    id: '11',
    text: 'Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it',
    author: 'Rumi',
    category: 'growth'
  },
  {
    id: '12',
    text: 'Be yourself; everyone else is already taken',
    author: 'Oscar Wilde',
    category: 'courage'
  },

  // Resilience & Healing
  {
    id: '13',
    text: 'Healing is not linear. Be patient with yourself.',
    author: 'Unknown',
    category: 'resilience'
  },
  {
    id: '14',
    text: 'It does not matter how slowly you go as long as you do not stop',
    author: 'Confucius',
    category: 'progress'
  },
  {
    id: '15',
    text: 'The most beautiful people are those who have known suffering, known struggle, and have found their way out of the depths',
    author: 'Elisabeth Kübler-Ross',
    category: 'resilience'
  },
  {
    id: '16',
    text: 'You are braver than you believe, stronger than you seem, and smarter than you think',
    author: 'A.A. Milne',
    category: 'courage'
  },

  // Peace & Calm
  {
    id: '17',
    text: 'Almost everything will work again if you unplug it for a few minutes, including you',
    author: 'Anne Lamott',
    category: 'peace'
  },
  {
    id: '18',
    text: 'If you want to conquer the anxiety of life, live in the moment, live in the breath',
    author: 'Amit Ray',
    category: 'mindfulness'
  },
  {
    id: '19',
    text: 'Between stimulus and response there is a space. In that space is our power to choose our response.',
    author: 'Viktor Frankl',
    category: 'mindfulness'
  },
  {
    id: '20',
    text: 'The quieter you become, the more able you are to hear',
    author: 'Rumi',
    category: 'peace'
  },

  // Growth & Transformation
  {
    id: '21',
    text: 'What we plant in the soil of contemplation, we shall reap in the harvest of action',
    author: 'Meister Eckhart',
    category: 'growth'
  },
  {
    id: '22',
    text: 'The wound is the place where the Light enters you',
    author: 'Rumi',
    category: 'resilience'
  },
  {
    id: '23',
    text: 'Your only obligation in any lifetime is to be true to yourself',
    author: 'Richard Bach',
    category: 'courage'
  },
  {
    id: '24',
    text: 'Do not judge me by my success, judge me by how many times I fell down and got back up again',
    author: 'Nelson Mandela',
    category: 'resilience'
  }
];

/**
 * Get a random quote from the collection
 */
export const getRandomQuote = (): Quote => {
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
  return motivationalQuotes[randomIndex];
};

/**
 * Get a random quote from a specific category
 */
export const getRandomQuoteByCategory = (category: Quote['category']): Quote => {
  const categoryQuotes = motivationalQuotes.filter(quote => quote.category === category);
  if (categoryQuotes.length === 0) {
    return getRandomQuote(); // Fallback to any random quote
  }
  const randomIndex = Math.floor(Math.random() * categoryQuotes.length);
  return categoryQuotes[randomIndex];
};

/**
 * Get quote by ID
 */
export const getQuoteById = (id: string): Quote | undefined => {
  return motivationalQuotes.find(quote => quote.id === id);
};