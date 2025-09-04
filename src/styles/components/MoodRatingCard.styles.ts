import { StyleSheet } from 'react-native';
import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { typography } from '../tokens/typography';

export const moodRatingCardStyles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: spacing.lg,
    marginVertical: spacing.md,
    marginHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  
  title: {
    ...typography.textStyles.h4,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  
  subtitle: {
    ...typography.textStyles.bodySmall,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  
  slidersContainer: {
    marginBottom: spacing.lg,
  },
  
  progressIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray[300],
  },
  
  activeDot: {
    backgroundColor: colors.blue[500],
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  
  actions: {
    alignItems: 'center',
  },
  
  skipButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  
  skipButtonText: {
    ...typography.textStyles.bodySmall,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});