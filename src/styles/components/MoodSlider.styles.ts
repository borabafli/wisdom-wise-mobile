import { StyleSheet } from 'react-native';
import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { typography } from '../tokens/typography';

export const moodSliderStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: spacing.lg,
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  
  header: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  
  title: {
    ...typography.textStyles.h4,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
    fontSize: 22,
    fontWeight: '600',
  },
  
  subtitle: {
    ...typography.textStyles.bodySmall,
    color: colors.text.secondary,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  
  emojiContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    height: 80,
  },
  
  emoji: {
    fontSize: 60,
    lineHeight: 70,
  },
  
  sliderContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  
  track: {
    height: 8,
    width: 280,
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
    overflow: 'hidden',
  },
  
  trackGradient: {
    flex: 1,
    borderRadius: 20,
  },
  
  thumb: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 4,
    borderColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
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
    paddingHorizontal: spacing.lg,
  },
  
  extremeLabel: {
    ...typography.textStyles.caption,
    color: colors.text.tertiary,
    fontSize: 12,
  },
});