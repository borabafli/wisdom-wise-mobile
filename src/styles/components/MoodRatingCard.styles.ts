import { StyleSheet } from 'react-native';
import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { typography } from '../tokens/typography';

export const moodRatingCardStyles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginVertical: spacing[4],
    marginHorizontal: 0, // Remove all horizontal margins for maximum width
    paddingVertical: spacing[20],
    paddingHorizontal: spacing[8], // Minimal padding
    borderWidth: 0,
    borderColor: 'transparent',
    overflow: 'hidden', // Needed for gradient
  },
  
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing[8],
    marginHorizontal: spacing[2],
    paddingHorizontal: spacing[4],
    lineHeight: 24,
  },

  questionSection: {
    marginBottom: spacing[6],
  },

  questionText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing[4],
    lineHeight: 22,
  },

  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  
  slidersContainer: {
    marginBottom: spacing[8],
  },
  
  progressIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing[8],
  },
  
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray[300],
  },
  
  activeDot: {
    backgroundColor: '#87BAA3',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  
  actions: {
    alignItems: 'center',
  },
  
  skipButton: {
    paddingVertical: spacing[8],
    paddingHorizontal: spacing[16],
  },
  
  skipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
    textAlign: 'center',
  },
});