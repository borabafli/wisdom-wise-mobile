/**
 * Emoji Utility Functions
 * Provides contextual emojis based on user preference
 */

export type EmojiPreference = 'female' | 'male' | 'neutral';

interface EmojiSet {
  meditation: string;
  wellness: string;
  time: string;
  target: string;
  star: string;
}

const emojiSets: Record<EmojiPreference, EmojiSet> = {
  female: {
    meditation: '🧘‍♀️',
    wellness: '🌿',
    time: '⏰',
    target: '🎯',
    star: '🌟'
  },
  male: {
    meditation: '🧘‍♂️',
    wellness: '🌿',
    time: '⏰',
    target: '🎯',
    star: '🌟'
  },
  neutral: {
    meditation: '🧘',
    wellness: '🌿',
    time: '⏰',
    target: '🎯',
    star: '🌟'
  }
};

/**
 * Get emoji based on context and user preference
 */
export const getContextualEmoji = (
  context: keyof EmojiSet,
  preference: EmojiPreference = 'neutral'
): string => {
  return emojiSets[preference][context];
};

/**
 * Get emojis for exercise library sections
 */
export const getExerciseEmojis = (preference: EmojiPreference = 'neutral') => ({
  title: getContextualEmoji('meditation', preference),
  subtitle: getContextualEmoji('wellness', preference),
  duration: getContextualEmoji('time', preference),
  benefits: getContextualEmoji('target', preference),
  approach: getContextualEmoji('star', preference)
});