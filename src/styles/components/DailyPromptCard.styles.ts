import { StyleSheet, Dimensions } from 'react-native';
import { colors, spacing, typography } from '../tokens';

const { width } = Dimensions.get('window');

export const dailyPromptCardStyles = StyleSheet.create({
  container: {
    marginHorizontal: spacing[8], // Much smaller margins for wider card (was spacing.layout.screenPadding)
    marginBottom: spacing[24],
  },

  cardBackground: {
    width: '100%',
    height: 220, // Increased from 180 to 220 for more space
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
    left: '8%', // Moved slightly more to the right from 5%
    top: '55%', // Moved up slightly for more vertical space (from 60% back to 55%)
    width: '78%', // Reduced width to give less space on right side (from 85% to 78%)
    maxHeight: 85, // Increased for more vertical text space (from 70 to 85)
    transform: [{ translateY: -30 }], // Adjusted transform for better centering (from -25 to -30)
  },

  promptText: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: 16,
    lineHeight: 22,
    color: '#2D3748',
    textAlign: 'left',
    fontWeight: '500',
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