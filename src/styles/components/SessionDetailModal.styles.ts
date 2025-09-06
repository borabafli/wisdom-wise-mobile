/**
 * SessionDetailModal Component Styles
 * Following design principles: calm, accessible, therapeutic
 */

import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

const { width, height } = Dimensions.get('window');

export const sessionDetailModalStyles = StyleSheet.create({
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
  
  // Header Section - Following "Calm is Our Canvas" principle
  header: {
    paddingHorizontal: spacing.layout.screenPadding, // Generous breathing room (24px)
    paddingVertical: spacing.components.cardPadding,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.6)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[4],
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    ...typography.textStyles.h3,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing[1],
  },
  headerSubtitle: {
    ...typography.textStyles.bodySmall,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.relaxed, // 1.75x for stressed readers
  },
  closeButton: {
    padding: spacing[2], // Accessible touch target (48x48px minimum)
    borderRadius: spacing.radius.md, // Soft geometry (16px)
  },
  
  // Metadata Section - Using "Gradients as Emotional Transitions"
  metadataContainer: {
    marginTop: spacing[2],
  },
  metadataGradient: {
    borderRadius: spacing.radius.lg, // Rounded corners (24px) for visual tranquility
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  metadataContent: {
    padding: spacing.components.cardPadding, // Breathing room (24px)
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    minWidth: 80,
  },
  metadataText: {
    ...typography.textStyles.caption,
    color: colors.text.secondary,
    fontSize: Math.max(16, typography.textStyles.caption.fontSize), // 16px minimum
  },
  
  // Messages Section
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: spacing.layout.screenPadding,
    paddingVertical: spacing[4],
    paddingBottom: spacing[8], // Extra bottom padding for comfort
  },
  messagesList: {
    gap: spacing[4], // Generous spacing between messages
  },
  messageWrapper: {
    // Additional wrapper for potential future enhancements
  },
  
  // Empty State - Following "Progressive Disclosure" principle
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[15],
    paddingHorizontal: spacing[6],
  },
  emptyTitle: {
    ...typography.textStyles.h4,
    color: colors.text.primary,
    marginTop: spacing.components.cardGap,
    marginBottom: spacing[2],
    textAlign: 'center',
  },
  emptySubtitle: {
    ...typography.textStyles.bodySmall,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.relaxed, // 1.75x for optimal readability
    paddingHorizontal: spacing[4],
  },
  
  // Footer - Gentle guidance following "Typography That Comforts"
  footer: {
    paddingHorizontal: spacing.layout.screenPadding,
    paddingVertical: spacing[4],
    borderTopWidth: 1,
    borderTopColor: 'rgba(226, 232, 240, 0.6)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  footerText: {
    ...typography.textStyles.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
    fontSize: Math.max(16, typography.textStyles.caption.fontSize), // Accessibility: 16px minimum
    lineHeight: typography.lineHeight.relaxed,
  },
  
  // Read-only message styles following design principles
  // User messages - right aligned with therapeutic color palette
  userMessageContainer: {
    alignItems: 'flex-end',
    marginBottom: spacing[4],
    paddingRight: spacing[2],
  },
  userMessageBubble: {
    backgroundColor: colors.primary[500], // Ocean Breath palette
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: spacing.radius.lg, // Soft geometry (24px)
    maxWidth: '80%',
    ...shadows.components.card, // Gentle elevation
  },
  userMessageText: {
    ...typography.textStyles.body,
    color: colors.white,
    fontSize: Math.max(16, typography.textStyles.body.fontSize), // 16px minimum
    lineHeight: typography.lineHeight.relaxed, // 1.75x for stressed readers
    marginBottom: spacing[1],
  },
  messageTimestamp: {
    ...typography.textStyles.caption,
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: Math.max(14, typography.textStyles.caption.fontSize),
    textAlign: 'right',
  },
  
  // AI messages - left aligned with calming gradients
  aiMessageContainer: {
    alignItems: 'flex-start',
    marginBottom: spacing[4],
    paddingLeft: spacing[2],
  },
  aiMessageContent: {
    maxWidth: '85%',
  },
  aiMessageBubble: {
    paddingHorizontal: spacing[4], // Breathing room (24px)
    paddingVertical: spacing[3],
    borderRadius: spacing.radius.lg, // Soft geometry
    borderWidth: 1,
    borderColor: colors.border.primary,
    ...shadows.components.card,
  },
  aiMessageText: {
    ...typography.textStyles.body,
    color: colors.text.primary,
    fontSize: Math.max(16, typography.textStyles.body.fontSize), // Accessibility
    lineHeight: typography.lineHeight.relaxed, // Optimal for stressed readers
    marginBottom: spacing[1],
  },
  
  // Exercise messages - special styling for therapeutic exercises
  exerciseMessageContainer: {
    alignItems: 'center',
    marginBottom: spacing[4],
    paddingHorizontal: spacing[2],
  },
  exerciseMessageBubble: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: spacing.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.2)', // Soft green border
    maxWidth: '90%',
    alignItems: 'center',
    ...shadows.components.card,
  },
  exerciseTitle: {
    ...typography.textStyles.h5,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing[2],
    textAlign: 'center',
  },
  exerciseText: {
    ...typography.textStyles.body,
    color: colors.text.secondary,
    fontSize: Math.max(16, typography.textStyles.body.fontSize),
    lineHeight: typography.lineHeight.relaxed,
    textAlign: 'center',
    marginBottom: spacing[1],
  },
});