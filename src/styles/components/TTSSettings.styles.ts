/**
 * TTSSettings Component Styles
 * Separated from component for better maintainability
 */

import { StyleSheet } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

export const ttsSettingsStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.layout.screenPadding,
    paddingVertical: spacing.components.cardPadding,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.6)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  headerTitle: {
    ...typography.textStyles.h3,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.bold,
  },
  closeButton: {
    padding: spacing[2],
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.layout.screenPadding,
    paddingVertical: spacing.layout.screenPadding,
  },
  settingCard: {
    marginBottom: spacing.components.cardGap,
    borderRadius: spacing.radius.lg,
    ...shadows.components.card,
  },
  settingGradient: {
    borderRadius: spacing.radius.lg,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  settingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.components.cardPadding,
  },
  settingContent: {
    padding: spacing.components.cardPadding,
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.components.cardGap,
  },
  settingTitle: {
    ...typography.textStyles.actionTitle,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  settingDescription: {
    ...typography.textStyles.bodySmall,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.normal,
  },
  settingValue: {
    ...typography.textStyles.h4,
    color: colors.primary[500],
    textAlign: 'center',
    marginBottom: spacing.components.cardGap,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.components.cardGap,
  },
  sliderLabel: {
    ...typography.textStyles.caption,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  sliderWrapper: {
    flex: 1,
  },
  sliderPlaceholder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.gray[100],
    borderRadius: spacing.radius.sm,
    padding: spacing[1],
  },
  sliderButton: {
    flex: 1,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: spacing.radius.xs,
    alignItems: 'center',
  },
  sliderButtonActive: {
    backgroundColor: colors.primary[500],
  },
  sliderButtonText: {
    ...typography.textStyles.caption,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  testContainer: {
    marginTop: spacing.layout.screenPadding,
  },
  testButton: {
    borderRadius: spacing.radius.md,
    ...shadows.components.actionButton,
  },
  testButtonActive: {
    // Additional styles when active
  },
  testButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.components.cardGap,
    paddingHorizontal: spacing.layout.screenPadding,
    borderRadius: spacing.radius.md,
    gap: spacing[2],
  },
  testButtonText: {
    ...typography.textStyles.button,
    color: colors.text.inverse,
  },
});
