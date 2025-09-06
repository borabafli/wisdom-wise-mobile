import { StyleSheet } from 'react-native';
import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { typography } from '../tokens/typography';

export const preExerciseMoodCardStyles = StyleSheet.create({
  container: {
    borderRadius: 20,
    margin: 16,
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
    padding: 24,
    borderRadius: 20,
  },

  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  title: {
    ...typography.textStyles.h3,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
    fontSize: 20,
    fontWeight: '600',
  },

  subtitle: {
    ...typography.textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
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