/**
 * Exit Confirmation Dialog Styles
 * Therapeutic design with calming colors and smooth animations
 */

import { StyleSheet } from 'react-native';
import { colors } from '../tokens/colors';
import { typography } from '../tokens/typography';
import { shadows } from '../tokens/shadows';
import { spacing } from '../tokens/spacing';

export const exitConfirmationDialogStyles = StyleSheet.create({
  // Backdrop
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  blurContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Dialog Container
  dialogContainer: {
    width: '85%',
    maxWidth: 400,
    alignSelf: 'center',
  },

  // Main Dialog Card
  dialog: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.layout.screenPadding,
    alignItems: 'center',
    ...shadows.components.modal,
  },

  // Icon Container
  iconContainer: {
    marginBottom: spacing.layout.sectionGap,
  },

  iconGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },

  // Typography
  title: {
    ...typography.textStyles.h3,
    color: '#2D3436', // Deep Charcoal from design guide
    textAlign: 'center',
    marginBottom: spacing.components.cardGap,
  },

  message: {
    ...typography.textStyles.body,
    color: '#6B7280', // Soft Gray from design guide
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.components.cardGap,
  },

  // Toggle Container
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.components.cardGap,
    backgroundColor: '#F9FAFB', // Very light gray background
    borderRadius: 12,
  },

  toggleLabel: {
    ...typography.textStyles.body,
    fontSize: 14,
    color: '#4B5563', // Darker gray for better readability
    flex: 1,
    marginRight: spacing.sm,
  },

  // Button Container
  buttonContainer: {
    width: '100%',
    gap: spacing.components.cardGap,
  },

  // Primary Button (Save & Exit)
  primaryButtonWrapper: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    ...shadows.components.actionButton,
  },

  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: spacing.components.cardPadding,
    gap: 8,
    borderRadius: 24,
  },

  primaryButtonText: {
    ...typography.textStyles.button,
    color: colors.white,
    fontSize: 16,
  },

  // Secondary Button (Keep Chatting)
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: spacing.components.cardPadding,
    gap: 8,
    backgroundColor: '#E8F4F1', // Mint Whisper from design guide
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#4A9B8E', // Hero Teal from design guide
  },

  secondaryButtonText: {
    ...typography.textStyles.button,
    color: '#4A9B8E', // Hero Teal from design guide
    fontSize: 16,
  },
});
