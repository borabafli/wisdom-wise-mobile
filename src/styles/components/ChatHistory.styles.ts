/**
 * ChatHistory Component Styles
 * Separated from component for better maintainability
 */

import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

const { width, height } = Dimensions.get('window');

export const chatHistoryStyles = StyleSheet.create({
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
    paddingHorizontal: spacing.layout.screenPadding,
    paddingVertical: spacing.components.cardPadding,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.6)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  headerTitle: {
    ...typography.textStyles.h3,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.bold,
  },
  closeButton: {
    padding: spacing[2],
  },
  clearAllButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.components.cardGap,
    paddingVertical: spacing[2],
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: spacing.radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  clearAllText: {
    color: colors.semantic.error,
    ...typography.textStyles.bodySmall,
    fontWeight: typography.fontWeight.medium,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.layout.screenPadding,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[15],
  },
  loadingText: {
    ...typography.textStyles.body,
    color: colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[15],
  },
  emptyTitle: {
    ...typography.textStyles.h4,
    color: colors.text.primary,
    marginTop: spacing.components.cardGap,
    marginBottom: spacing[2],
  },
  emptySubtitle: {
    ...typography.textStyles.bodySmall,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.normal,
    paddingHorizontal: spacing[8],
  },
  sessionsList: {
    paddingVertical: spacing.layout.screenPadding,
  },
  sessionCard: {
    marginBottom: spacing.components.cardGap,
    borderRadius: spacing.radius.lg,
    ...shadows.components.card,
  },
  sessionGradient: {
    borderRadius: spacing.radius.lg,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  sessionContent: {
    padding: spacing.components.cardPadding,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[3],
  },
  sessionDate: {
    ...typography.textStyles.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary[500],
    flex: 1,
    marginLeft: spacing[2],
  },
  deleteButton: {
    padding: spacing[1],
  },
  sessionPreview: {
    ...typography.textStyles.body,
    color: colors.text.primary,
    lineHeight: typography.lineHeight.relaxed,
    marginBottom: spacing[3],
  },
  sessionMeta: {
    flexDirection: 'row',
    gap: spacing.components.cardGap,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  metaText: {
    ...typography.textStyles.caption,
    color: colors.text.secondary,
  },
});
