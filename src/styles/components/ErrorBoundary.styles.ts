/**
 * ErrorBoundary Component Styles
 * Separated from component for better maintainability
 */

import { StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../tokens';

export const errorBoundaryStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary[50],
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.layout.screenPadding,
  },
  iconContainer: {
    marginBottom: spacing[24],
    opacity: 0.8,
  },
  title: {
    ...typography.textStyles.h2,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing[12],
  },
  description: {
    ...typography.textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing[32],
    lineHeight: typography.lineHeight.relaxed,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.semantic.error,
    paddingHorizontal: spacing[24],
    paddingVertical: spacing[12],
    borderRadius: spacing.radius.lg,
    gap: spacing[8],
  },
  retryText: {
    ...typography.textStyles.button,
    color: colors.text.inverse,
  },
  errorDetails: {
    marginTop: spacing[32],
    padding: spacing[16],
    backgroundColor: colors.gray[100],
    borderRadius: spacing.radius.md,
    width: '100%',
  },
  errorTitle: {
    ...typography.textStyles.bodySmall,
    fontWeight: typography.fontWeight.bold,
    color: colors.semantic.error,
    marginBottom: spacing[8],
  },
  errorMessage: {
    ...typography.textStyles.caption,
    color: colors.text.secondary,
    fontFamily: 'System',
    marginBottom: spacing[8],
  },
  errorStack: {
    ...typography.textStyles.caption,
    color: colors.text.tertiary,
    fontFamily: 'System',
  },
});
