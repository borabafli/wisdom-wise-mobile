/**
 * ChatInterface Component Styles
 * Separated from component for better maintainability
 */

import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

const { width } = Dimensions.get('window');

export const chatInterfaceStyles = StyleSheet.create({
  // Container & Layout - Ultra Transparent
  container: {
    flex: 1,
    backgroundColor: 'rgba(248, 250, 252, 0.95)',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.6,
  },
  keyboardView: {
    flex: 1,
  },

  // Header - Ultra Modern Glass
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
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
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    fontWeight: '600',
    color: colors.text.primary,
    letterSpacing: 0.2,
  },
  sessionSubtitle: {
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
    fontWeight: '400',
    color: colors.text.tertiary,
    letterSpacing: 0.1,
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
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
    fontWeight: '500',
    color: colors.semantic.warning,
    flex: 1,
    letterSpacing: 0.1,
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
    backgroundColor: '#3b82f6',
    borderRadius: spacing.radius.lg,
    borderBottomRightRadius: spacing.radius.xs,
    borderWidth: 0,
    paddingHorizontal: spacing.components.messagePadding,
    paddingVertical: spacing.components.messagePadding,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userMessageText: {
    fontSize: 19,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
    fontWeight: '400',
    color: colors.text.inverse,
    textAlign: 'left',
    flexWrap: 'wrap',
    lineHeight: 30,
    letterSpacing: 0.4,
  },

  // System Messages - No Box Style
  systemMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: spacing.components.messageGap,
    paddingHorizontal: spacing[2],
  },
  systemMessageBubble: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderRadius: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    width: '100%',
    minWidth: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  systemMessageContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
    gap: spacing[3], // Increased gap between turtle and message
  },

  // Turtle Avatar - EXTRA LARGE, NO CIRCLE, TOP POSITIONED
  turtleAvatarContainer: {
    width: 64,
    height: 64,
    marginBottom: spacing[2],
    marginRight: 0,
    marginTop: 0,
    alignSelf: 'flex-start',
    flexShrink: 0,
  },
  turtleAvatar: {
    width: 64,
    height: 64,
    borderRadius: 0,
    borderWidth: 0,
    borderColor: 'transparent',
  },

  // Message Text - Modern Typography, Full Width
  systemMessageTextContainer: {
    flex: 1,
    width: '100%',
    minWidth: 0,
    flexShrink: 1,
  },
  systemMessageText: {
    fontSize: 14, // Reduced from 16 to 14
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
    fontWeight: '400',
    color: colors.text.primary,
    marginBottom: spacing[2],
    flexWrap: 'wrap',
    textAlign: 'left',
    lineHeight: 20, // Adjusted line height proportionally
    letterSpacing: 0.3,
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
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
    fontWeight: '500',
    color: colors.primary[400],
    letterSpacing: 0.1,
  },

  // Typing Indicator - Modern Glass
  typingContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  typingBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: spacing.radius['2xl'],
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
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
  typingTurtleAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
    fontWeight: '400',
    color: colors.text.tertiary,
    fontStyle: 'italic',
    letterSpacing: 0.1,
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
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
    fontWeight: '500',
    color: colors.text.secondary,
    letterSpacing: 0.2,
  },

  // Input Area - Modern Glass
  inputContainer: {
    paddingHorizontal: spacing.layout.screenPadding,
    paddingVertical: spacing.components.cardGap,
  },
  inputCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: spacing.radius.lg,
    ...shadows.components.card,
  },
  inputHeader: {
    paddingHorizontal: spacing.components.inputPadding,
    paddingVertical: spacing.components.cardGap,
  },
  inputPrompt: {
    fontSize: 17,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
    fontWeight: '500',
    color: colors.text.tertiary,
    marginBottom: spacing[6],
    letterSpacing: 0.3,
  },
  textInput: {
    fontSize: 19,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
    fontWeight: '400',
    color: colors.text.primary,
    minHeight: 60,
    maxHeight: 120,
    paddingTop: spacing[4],
    backgroundColor: 'transparent',
    lineHeight: 30,
    letterSpacing: 0.4,
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

  // Input Actions - Glass Effect
  inputActions: {
    paddingHorizontal: spacing.components.inputPadding,
    paddingVertical: spacing[7],
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
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
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
    fontWeight: '400',
    color: colors.text.tertiary,
    textAlign: 'center',
    letterSpacing: 0.2,
  },

  // Send Button - Match Mic Button
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.components.actionButton,
  },
  sendButtonActive: {
    backgroundColor: '#3b82f6',
  },
  sendButtonDisabled: {
    backgroundColor: colors.gray[200],
  },

  // Exercise Suggestion Card
  exerciseCardContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  exerciseSuggestionCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  exerciseCardHeader: {
    marginBottom: 12,
  },
  exerciseCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  exerciseCardSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  exerciseCardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  exerciseStartButton: {
    flex: 1,
  },
  exerciseStartButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  exerciseStartButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  exerciseDismissButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseDismissButtonText: {
    color: colors.text.tertiary,
    fontSize: 14,
    fontWeight: '500',
  },

  // Exercise Progress Indicator
  exerciseProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    transition: 'all 0.3s ease',
  },


});