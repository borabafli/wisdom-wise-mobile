import { StyleSheet, Dimensions } from 'react-native';
import { colors, spacing, typography } from '../tokens';

const { width } = Dimensions.get('window');

export const dailyPromptCardStyles = StyleSheet.create({
  container: {
    marginHorizontal: 0, // No margin - width will be controlled by parent section padding
    marginBottom: spacing[24],
  },

  cardBackground: {
    width: '100%',
    height: 260, // Increased from 220 to 260 for more space
    borderRadius: 20,
    overflow: 'hidden',
  },

  backgroundImage: {
    borderRadius: 20,
  },

  contentContainer: {
    flex: 1,
    padding: spacing[16],
    justifyContent: 'space-between',
  },

  promptContainer: {
    position: 'absolute',
    left: '8%', // Moved more to the left to give more space to the right (from 10% to 8%)
    top: '40%', // Moved higher up to give more space towards the top (from 45% to 40%)
    width: '85%', // Increased width for more space to the right (from 82% to 85%)
    maxHeight: 120, // Increased height slightly (from 110 to 120)
    transform: [{ translateY: -20 }], // Adjusted transform for new position (from -25 to -20)
    flex: 1,
    justifyContent: 'center',
  },

  promptText: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: 16,
    lineHeight: 18, // Reduced line height for tighter spacing (from 20 to 18)
    color: '#2D3748',
    textAlign: 'left',
    fontWeight: '500',
    flexShrink: 1,
    adjustsFontSizeToFit: true,
    numberOfLines: 0, // Allow unlimited lines
    minimumFontScale: 0.5, // Allow even more aggressive scaling (down to 50%)
  },

  startButton: {
    position: 'absolute',
    bottom: spacing[12], // Increased from spacing[8] to spacing[12] for more space from bottom
    left: '15%',
    backgroundColor: '#4c908b',
    paddingHorizontal: spacing[10],
    paddingVertical: spacing[5],
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  startButtonText: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
});