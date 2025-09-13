import { StyleSheet } from 'react-native';
import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { typography } from '../tokens/typography';

export const moodSliderStyles = StyleSheet.create({
  promptText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing[20],
    marginTop: spacing[16],
    paddingHorizontal: spacing[8],
    fontFamily: 'Poppins_700Bold',
    lineHeight: 32,
    letterSpacing: -0.4,
  },
  
  mainEmojiContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[16],
    position: 'relative',
  },
  
  mainEmojiImage: {
    width: 140, // Even bigger
    height: 140,
  },
  
  glowEffect: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(213, 232, 232, 0.6)',
    shadowColor: '#D5E8E8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  
  savedFeedback: {
    position: 'absolute',
    bottom: -40,
    backgroundColor: '#145458', // Updated box color
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  
  savedText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  
  questionMark: {
    fontSize: 48,
    fontWeight: '300',
    color: colors.text.tertiary,
    textAlign: 'center',
    marginBottom: spacing[16],
    fontFamily: 'Nunito_300Light',
    opacity: 0.7,
  },
  
  effectivenessImage: {
    width: 280,
    height: 72,
  },
  
  sliderContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[8],
    paddingHorizontal: spacing[20],
    position: 'relative',
  },
  
  trackBackground: {
    height: 6,
    width: 280,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  
  filledTrack: {
    height: '100%',
    backgroundColor: '#ADDCC7',
    borderRadius: 3,
  },
  
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#ADDCC7',
    top: -9,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  
  labelContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  
  currentLabel: {
    ...typography.textStyles.h3,
    color: colors.text.primary,
    fontWeight: '700',
    marginBottom: spacing.xs,
    fontSize: 20,
  },
  
  ratingValue: {
    ...typography.textStyles.bodySmall,
    color: colors.text.tertiary,
    fontWeight: '400',
    fontSize: 12,
  },
  
  extremeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[32],
    marginTop: spacing[4],
    marginBottom: spacing[8],
  },
  
  extremeLabel: {
    ...typography.textStyles.caption,
    color: colors.text.tertiary,
    fontSize: 14,
    fontWeight: '300',
    opacity: 0.8,
  },

  // Emoji selection row
  emojiSelectionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    marginBottom: spacing[8],
    marginTop: spacing[4], // Add top margin to replace question mark space
    gap: -8, // Much closer together
  },
  
  emojiOption: {
    width: 58, // Bigger touch area
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  selectedEmojiOption: {
    transform: [{ scale: 1.1 }],
  },
  
  unselectedEmojiOption: {
    opacity: 0.4,
  },
  
  optionEmojiImage: {
    width: 60, // Bigger emojis
    height: 60,
  },
  
  unselectedEmojiImage: {
    opacity: 0.5,
  },

  // Skip button
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[12],
    paddingVertical: spacing[4],
    marginTop: spacing[4],
    marginBottom: spacing[4],
  },
  
  skipText: {
    color: colors.text.tertiary,
    fontSize: 16, // Slightly bigger to match other text
    fontWeight: '600',
    marginRight: spacing[2], // Closer to chevron
    fontFamily: 'Inter_600SemiBold', // Match the new font family
    opacity: 0.8,
    letterSpacing: -0.1,
  },

  submitButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
});