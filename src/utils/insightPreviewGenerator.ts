/**
 * Utility functions to generate one-line previews for different types of insights
 * Used in the insights dashboard to give users a glimpse of the content
 */

import type { Insight } from '../services/memoryService';

/**
 * Generates a concise one-line preview of an insight based on its category and content
 */
export function generateInsightPreview(insight: Insight): string {
  const content = insight.content;
  const category = insight.category;

  // Helper function to extract key phrases from content
  const extractKeyPhrase = (text: string, maxLength: number = 60): string => {
    // Remove common prefixes that aren't helpful in previews
    let cleanText = text
      .replace(/^(You mentioned|I noticed|It seems|You've|You have|The user|Based on)/i, '')
      .replace(/^(that |about |how )/i, '')
      .trim();

    // If it's still too long, take the first meaningful sentence
    if (cleanText.length > maxLength) {
      const firstSentence = cleanText.split(/[.!?]/)[0];
      if (firstSentence.length > 0 && firstSentence.length <= maxLength + 20) {
        cleanText = firstSentence;
      } else {
        cleanText = cleanText.substring(0, maxLength).trim();
        // Avoid cutting off in the middle of a word
        const lastSpace = cleanText.lastIndexOf(' ');
        if (lastSpace > maxLength * 0.7) {
          cleanText = cleanText.substring(0, lastSpace);
        }
        cleanText += '...';
      }
    }

    return cleanText;
  };

  switch (category) {
    case 'automatic_thoughts':
      const thoughtPreview = extractKeyPhrase(content);
      return `Often noticing: "${thoughtPreview}"`;

    case 'emotions':
      const emotionPreview = extractKeyPhrase(content);
      return `Emotional patterns: "${emotionPreview}"`;

    case 'behaviors':
      const behaviorPreview = extractKeyPhrase(content);
      return `Recurring behaviors: "${behaviorPreview}"`;

    case 'values_goals':
      const valuesPreview = extractKeyPhrase(content);
      return `Values alignment: "${valuesPreview}"`;

    case 'strengths':
      const strengthPreview = extractKeyPhrase(content);
      return `Personal strengths: "${strengthPreview}"`;

    case 'life_context':
      const contextPreview = extractKeyPhrase(content);
      return `Life themes: "${contextPreview}"`;

    default:
      // Generic preview for unknown categories
      const genericPreview = extractKeyPhrase(content, 55);
      return `"${genericPreview}"`;
  }
}

/**
 * Gets a more descriptive category name for display
 */
export function getCategoryDisplayName(category: string): string {
  const categoryNames: { [key: string]: string } = {
    'automatic_thoughts': 'Automatic Thoughts',
    'emotions': 'Emotional Patterns',
    'behaviors': 'Behavioral Patterns',
    'values_goals': 'Values & Goals',
    'strengths': 'Personal Strengths',
    'life_context': 'Life Context'
  };

  return categoryNames[category] || category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Generates a contextual preview that hints at the insight's value
 */
export function generateContextualHint(insight: Insight): string {
  const category = insight.category;
  
  switch (category) {
    case 'automatic_thoughts':
      return 'Tap to explore thought patterns and reframing strategies';
    
    case 'emotions':
      return 'Tap to understand emotional themes and coping approaches';
    
    case 'behaviors':
      return 'Tap to review behavior patterns and potential changes';
    
    case 'values_goals':
      return 'Tap to explore values alignment and goal progress';
    
    case 'strengths':
      return 'Tap to celebrate strengths and growth opportunities';
    
    case 'life_context':
      return 'Tap to examine broader life themes and contexts';
    
    default:
      return 'Tap to view detailed insight';
  }
}