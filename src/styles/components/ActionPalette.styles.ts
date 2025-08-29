/**
 * ActionPalette Component Styles
 * Separated from component for better maintainability
 */

import { StyleSheet } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

export const actionPaletteStyles = StyleSheet.create({
  // Modal & Backdrop
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdropTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    padding: spacing.layout.screenPadding,
    width: '100%',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.white,
    borderRadius: spacing.radius['2xl'],
    ...shadows.components.modal,
  },
  gradient: {
    borderRadius: spacing.radius['2xl'],
    padding: spacing.layout.screenPadding,
    ...shadows.components.modal,
  },

  // Title
  title: {
    ...typography.textStyles.h3,
    textAlign: 'center',
    color: colors.text.primary,
    marginBottom: spacing.layout.screenPadding,
    fontWeight: typography.fontWeight.bold,
  },

  // Actions List
  actionsList: {
    gap: spacing.components.cardGap,
  },
  actionButton: {
    backgroundColor: colors.background.glass,
    borderRadius: spacing.radius.lg,
    padding: spacing.components.cardPadding,
    borderWidth: 1,
    borderColor: colors.border.light,
    ...shadows.components.actionButton,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.components.cardGap,
  },

  // Action Icon
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: spacing.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.components.actionButton,
  },

  // Text Content
  textContainer: {
    flex: 1,
  },
  actionTitle: {
    ...typography.textStyles.actionTitle,
    color: colors.text.primary,
    marginBottom: spacing[2],
    fontWeight: typography.fontWeight.semibold,
  },
  actionDescription: {
    ...typography.textStyles.bodySmall,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.regular,
  },

  // Cancel Button
  cancelButton: {
    marginTop: spacing.layout.screenPadding,
    padding: spacing.components.cardGap,
    alignItems: 'center',
  },
  cancelText: {
    color: colors.text.secondary,
    ...typography.textStyles.body,
    fontWeight: typography.fontWeight.medium,
  },
});