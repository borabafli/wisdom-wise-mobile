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
    height: 260,
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
    left: '10%', // Slightly increased from 4% to 6% for better left spacing
    top: '38%', // Moved higher up to give more space towards the top (from 45% to 40%)
    width: '93%', // Adjusted width to maintain good right spacing (from 92% to 90%)
    maxHeight: 120, // Increased height slightly (from 110 to 120)
    transform: [{ translateY: -20 }], // Adjusted transform for new position (from -25 to -20)
    flex: 1,
    justifyContent: 'center',
  },

  promptText: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: 18, // Increased from 16 to 18 as base size
    lineHeight: 22, // Increased line height proportionally (from 18 to 22)
    color: '#2D3748',
    textAlign: 'left',
    fontWeight: '500',
    flexShrink: 1,
    adjustsFontSizeToFit: true,
    numberOfLines: 0, // Allow unlimited lines
    minimumFontScale: 0.6, // Slightly less aggressive scaling (from 0.5 to 0.6)
  },

  startButtonContainer: {
    position: 'absolute',
    bottom: spacing[12], // Increased from spacing[8] to spacing[12] for more space from bottom
    left: '15%',
    borderRadius: 12, // Increased from 8 to 12 for larger appearance
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  startButton: {
    paddingHorizontal: spacing[16], // Increased from spacing[10] to spacing[16]
    paddingVertical: spacing[8], // Increased from spacing[5] to spacing[8]
    borderRadius: 12, // Increased from 8 to 12 for larger appearance
    alignItems: 'center',
    justifyContent: 'center',
  },

  startButtonText: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 15, // Increased from 13 to 15
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
});