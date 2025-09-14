import { StyleSheet } from 'react-native';
import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { typography } from '../tokens/typography';

export const preExerciseMoodCardStyles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginVertical: spacing[6],
    marginHorizontal: 0, // Full width card
    paddingVertical: spacing[20],
    paddingHorizontal: spacing[8], // Minimal padding for more text space
    // No border
    overflow: 'hidden', // For gradient
  },
  
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },

  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  title: {
    fontSize: 18, // Smaller text (swapped)
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing[6],
    marginHorizontal: spacing[2], // Use more horizontal space
    paddingHorizontal: spacing[4],
    lineHeight: 26, // More vertical space
    fontFamily: 'Inter_600SemiBold', // Different font
    letterSpacing: -0.3,
  },

  subtitle: {
    fontSize: 22, // Bigger text (swapped)
    fontWeight: '700',
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing[12],
    marginHorizontal: spacing[2], // Use more horizontal space
    paddingHorizontal: spacing[4],
    lineHeight: 30, // More vertical space
    fontFamily: 'Lora_700Bold', // Different font
    letterSpacing: -0.2,
  },

  slidersContainer: {
    marginVertical: 0,
  },

  actions: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },

  skipText: {
    ...typography.textStyles.body,
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
});