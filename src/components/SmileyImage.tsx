import React from 'react';
import { Image, ImageProps } from 'react-native';

// Map emojis to custom smiley images
const EMOJI_TO_SMILEY_MAP: { [key: string]: any } = {
  // Happy/Positive emotions -> smiley-5.png (happiest)
  '😊': require('../../assets/images/Teal Watercolor/smiley-5.png'),
  '😄': require('../../assets/images/Teal Watercolor/smiley-5.png'),
  '😃': require('../../assets/images/Teal Watercolor/smiley-5.png'),
  '🙂': require('../../assets/images/Teal Watercolor/smiley-4.png'),
  '🌟': require('../../assets/images/Teal Watercolor/smiley-5.png'),
  '👍': require('../../assets/images/Teal Watercolor/smiley-4.png'),
  
  // Neutral emotions -> smiley-3.png (neutral)
  '😐': require('../../assets/images/Teal Watercolor/smiley-3.png'),
  '😑': require('../../assets/images/Teal Watercolor/smiley-3.png'),
  '🤔': require('../../assets/images/Teal Watercolor/smiley-3.png'),
  
  // Calm/Relaxed emotions -> smiley-4.png (content)
  '😌': require('../../assets/images/Teal Watercolor/smiley-4.png'),
  '🧘🏼‍♀️': require('../../assets/images/Teal Watercolor/smiley-4.png'),
  
  // Slightly negative emotions -> smiley-2.png
  '😕': require('../../assets/images/Teal Watercolor/smiley-2.png'),
  '😞': require('../../assets/images/Teal Watercolor/smiley-2.png'),
  '😪': require('../../assets/images/Teal Watercolor/smiley-2.png'),
  '😴': require('../../assets/images/Teal Watercolor/smiley-2.png'),
  
  // Negative emotions -> smiley-1.png (saddest)
  '😔': require('../../assets/images/Teal Watercolor/smiley-1.png'),
  '😢': require('../../assets/images/Teal Watercolor/smiley-1.png'),
  '😭': require('../../assets/images/Teal Watercolor/smiley-1.png'),
  '😰': require('../../assets/images/Teal Watercolor/smiley-1.png'),
  '😱': require('../../assets/images/Teal Watercolor/smiley-1.png'),
  
  // Default fallback
  'default': require('../../assets/images/Teal Watercolor/smiley-3.png')
};

interface SmileyImageProps extends Omit<ImageProps, 'source'> {
  emoji?: string;
  smiley?: 1 | 2 | 3 | 4 | 5; // Direct smiley number
  size?: number;
}

export const SmileyImage: React.FC<SmileyImageProps> = ({ 
  emoji, 
  smiley, 
  size = 24, 
  style, 
  ...imageProps 
}) => {
  let imageSource;
  
  if (smiley) {
    // Direct smiley number provided
    imageSource = require(`../../assets/images/Teal Watercolor/smiley-${smiley}.png`);
  } else if (emoji) {
    // Map emoji to smiley
    imageSource = EMOJI_TO_SMILEY_MAP[emoji] || EMOJI_TO_SMILEY_MAP['default'];
  } else {
    // Fallback to neutral
    imageSource = EMOJI_TO_SMILEY_MAP['default'];
  }

  return (
    <Image
      source={imageSource}
      style={[{ width: size, height: size }, style]}
      {...imageProps}
    />
  );
};

// Convenience function to get smiley for mood ratings (1-5 scale)
export const getMoodSmiley = (rating: number): 1 | 2 | 3 | 4 | 5 => {
  if (rating <= 1) return 1; // smiley-1.png (sad)
  if (rating <= 2) return 2; // smiley-2.png (slightly sad)
  if (rating <= 3) return 3; // smiley-3.png (neutral)
  if (rating <= 4) return 4; // smiley-4.png (happy)
  return 5; // smiley-5.png (very happy)
};

// Helper component for mood ratings
export const MoodSmiley: React.FC<{ rating: number; size?: number; style?: any }> = ({ 
  rating, 
  size = 24, 
  style 
}) => (
  <SmileyImage 
    smiley={getMoodSmiley(rating)} 
    size={size} 
    style={style}
  />
);