/**
 * ChatInterface Component Styles
 * Separated from component for better maintainability
 */

import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

const { width } = Dimensions.get('window');

export const chatInterfaceStyles = StyleSheet.create({
  // Container & Layout
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
  keyboardView: {
    flex: 1,
  },

  // Header
  header: {
    backgroundColor: colors.background.glass,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    paddingHorizontal: spacing.layout.screenPadding,
    paddingVertical: spacing.layout.screenPadding,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.components.cardGap,
  },
  backButton: {
    padding: spacing[6],
    borderRadius: spacing.radius.soft,
    backgroundColor: colors.gray[100],
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[6],
  },
  sessionIcon: {
    width: 40,
    height: 40,
    borderRadius: spacing.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  sessionDetails: {
    flex: 1,
  },
  sessionTitle: {
    ...typography.textStyles.sessionTitle,
    color: colors.text.primary,
  },
  sessionSubtitle: {
    ...typography.textStyles.sessionSubtitle,
    color: colors.text.tertiary,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginTop: spacing[2],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderRadius: spacing.radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.2)',
  },
  warningText: {
    ...typography.textStyles.caption,
    color: colors.semantic.warning,
    fontWeight: typography.fontWeight.medium,
    flex: 1,
  },

  // Messages Area
  messagesArea: {
    flex: 1,
    paddingHorizontal: spacing.components.cardGap,
  },
  messagesContent: {
    paddingVertical: spacing.components.contentGap,
    paddingBottom: spacing[10],
    flexGrow: 1,
  },

  // User Messages
  userMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing.components.messageGap,
  },
  userMessageWrapper: {
    maxWidth: width * 0.75,
    minWidth: 120,
  },
  userMessageBubble: {
    borderRadius: spacing.radius.lg,
    borderBottomRightRadius: spacing.radius.xs,
    paddingHorizontal: spacing.components.messagePadding,
    paddingVertical: spacing.components.messagePadding,
    ...shadows.components.messageBubble,
  },
  userMessageText: {
    ...typography.textStyles.chatMessage,
    color: colors.text.inverse,
    textAlign: 'left',
    flexWrap: 'wrap',
  },

  // System Messages
  systemMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: spacing.components.messageGap,
  },
  systemMessageBubble: {
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.dark,
    borderRadius: spacing.radius.lg,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    ...shadows.components.messageBubble,
    width: '95%',
    minWidth: 140,
  },
  systemMessageContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },

  // Turtle Avatar - FIXED SIZE
  turtleAvatarContainer: {
    width: 32,
    height: 32,
    marginRight: spacing[3],
    marginTop: 0,
    flexShrink: 0,
  },
  turtleAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },

  // Message Text
  systemMessageTextContainer: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
  },
  systemMessageText: {
    ...typography.textStyles.chatMessage,
    color: colors.text.primary,
    marginBottom: spacing[2],
    flexWrap: 'wrap',
    textAlign: 'left',
    lineHeight: 20,
  },

  // TTS Controls
  ttsControls: {
    alignItems: 'flex-start',
    marginTop: spacing[2],
  },
  ttsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: spacing.radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  ttsButtonActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  ttsButtonText: {
    ...typography.textStyles.caption,
    color: colors.primary[400],
    fontWeight: typography.fontWeight.medium,
  },

  // Typing Indicator
  typingContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  typingBubble: {
    backgroundColor: colors.background.glass,
    borderRadius: spacing.radius['2xl'],
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.4)',
    paddingHorizontal: spacing.components.messagePadding,
    paddingVertical: spacing.components.messagePadding,
    ...shadows.components.floating,
  },
  typingContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.components.cardGap,
  },
  typingAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  typingTextContainer: {
    flex: 1,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  typingDot: {
    width: 10,
    height: 10,
    backgroundColor: colors.primary[400],
    borderRadius: 5,
  },
  typingText: {
    ...typography.textStyles.caption,
    color: colors.text.tertiary,
    fontStyle: 'italic',
  },

  // Suggestions
  suggestionsContainer: {
    paddingHorizontal: spacing.layout.screenPadding,
    paddingBottom: spacing.components.cardGap,
  },
  suggestionsScroll: {
    gap: spacing[4],
  },
  suggestionChip: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing.components.cardGap,
    paddingVertical: spacing[4],
    borderRadius: spacing.radius.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  suggestionText: {
    color: colors.text.secondary,
    ...typography.textStyles.bodySmall,
    fontWeight: typography.fontWeight.medium,
  },

  // Input Area
  inputContainer: {
    paddingHorizontal: spacing.layout.screenPadding,
    paddingVertical: spacing.components.cardGap,
  },
  inputCard: {
    backgroundColor: colors.background.glass,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: spacing.radius.lg,
    ...shadows.components.card,
  },
  inputHeader: {
    paddingHorizontal: spacing.components.inputPadding,
    paddingVertical: spacing.components.cardGap,
  },
  inputPrompt: {
    ...typography.textStyles.caption,
    color: colors.text.tertiary,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing[6],
  },
  textInput: {
    ...typography.textStyles.body,
    color: colors.text.primary,
    minHeight: 60,
    maxHeight: 120,
    paddingTop: spacing[4],
    backgroundColor: 'transparent',
  },
  partialTranscriptOverlay: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    ...typography.textStyles.body,
    color: colors.primary[400],
    fontStyle: 'italic',
    opacity: 0.7,
    pointerEvents: 'none',
  },

  // Input Actions
  inputActions: {
    paddingHorizontal: spacing.components.inputPadding,
    paddingVertical: spacing[7],
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(241, 245, 249, 0.6)',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Mic Button
  micButtonBeautiful: {
    borderRadius: 50,
    ...shadows.components.therapyButton,
  },
  micButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Recording Controls
  recordingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Modern Recording Actions
  recordingActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.components.cardGap,
  },
  // Minimal Action Buttons
  minimalActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.glass,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  stopButtonBeautiful: {
    borderRadius: 50,
    ...shadows.components.stopButton,
  },
  stopButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Center Actions
  centerActions: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[4],
  },
  
  // Modern Sound Wave Visualization
  modernSoundWave: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    marginBottom: spacing[4],
    height: 48, // Increased height for better wave display
    paddingVertical: spacing[2],
  },
  modernWaveBar: {
    width: 4, // Slightly wider for better visibility
    backgroundColor: colors.primary[400],
    borderRadius: 2,
    minHeight: 4,
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  actionText: {
    ...typography.textStyles.bodySmall,
    color: colors.text.tertiary,
    textAlign: 'center',
  },

  // Send Button
  sendButton: {
    padding: spacing[6],
    borderRadius: spacing.radius.md,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.components.actionButton,
  },
  sendButtonActive: {
    backgroundColor: colors.primary[500],
  },
  sendButtonDisabled: {
    backgroundColor: colors.gray[200],
  },

});