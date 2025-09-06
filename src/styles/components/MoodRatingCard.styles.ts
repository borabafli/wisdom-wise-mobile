import { StyleSheet } from 'react-native';
import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { typography } from '../tokens/typography';

export const moodRatingCardStyles = StyleSheet.create({
  container: {
    borderRadius: 20,
    marginVertical: spacing.md,
    marginHorizontal: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    elevation: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },

  glassOverlay: {
    padding: spacing.xl,
    borderRadius: 20,
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
    marginBottom: 0,
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
  
  skipText: {
    ...typography.textStyles.body,
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
});