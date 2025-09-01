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
    backgroundColor: '#ffffff',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.45)', // Slightly increased opacity for better text readability
    zIndex: 0,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    zIndex: 1,
  },
  keyboardView: {
    flex: 1,
    zIndex: 2,
    justifyContent: 'space-between',
  },

  // Header - Ultra Modern Glass
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)', // Slightly more opaque for better readability
    borderBottomWidth: 0,
    paddingHorizontal: spacing.layout.screenPadding,
    paddingVertical: spacing.layout.screenPadding,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
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
    backgroundColor: 'rgba(243, 244, 246, 0.7)', // More transparent gray
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
  exerciseSessionIcon: {
    borderColor: 'rgba(100, 116, 139, 0.4)', // Subtle grey border for exercises
  },
  sessionDetails: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 20,
    fontFamily: 'System',
    fontWeight: '600',
    color: colors.text.primary,
    letterSpacing: 0.2,
  },
  exerciseTitle: {
    fontWeight: '700', // Bolder for exercises
    color: '#64748b', // Subtle grey-blue color for exercise titles
  },
  sessionSubtitle: {
    fontSize: 15,
    fontFamily: 'System',
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
    fontFamily: 'System',
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
    zIndex: 5,
  },
  userMessageWrapper: {
    maxWidth: width * 0.75,
    minWidth: 120,
  },
  userMessageBubble: {
    backgroundColor: '#519BC2',
    borderRadius: spacing.radius.lg,
    borderBottomRightRadius: spacing.radius.xs,
    borderWidth: 0,
    paddingHorizontal: spacing.components.messagePadding,
    paddingVertical: spacing.components.messagePadding,
    shadowColor: '#519BC2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  userMessageText: {
    fontSize: 15,
    fontFamily: 'System',
    fontWeight: '400',
    color: '#ffffff',
    textAlign: 'left',
    flexWrap: 'wrap',
    lineHeight: 30,
    letterSpacing: 0.4,
  },

  // System Messages - No Box Style
  systemMessageContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.components.messageGap * 3,
    paddingHorizontal: spacing[6],
    marginTop: spacing[16],
    zIndex: 5,
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
    alignItems: 'center',
    flex: 1,
    gap: spacing[6],
  },

  // Turtle Avatar - EXTRA LARGE, NO CIRCLE, TOP POSITIONED
  turtleAvatarContainer: {
    width: 120,
    height: 120,
    marginBottom: spacing[4],
    marginRight: 0,
    marginTop: spacing[8],
    alignSelf: 'center',
    flexShrink: 0,
  },
  turtleAvatar: {
    width: 120,
    height: 120,
    borderRadius: 0,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  therapistNameContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginTop: spacing[2],
    marginBottom: spacing[6],
  },
  therapistGreeting: {
    fontSize: 26,
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    color: colors.gray[600],
    letterSpacing: 0.5,
  },
  therapistName: {
    fontSize: 42,
    fontFamily: 'Caveat_400Regular',
    fontWeight: '400',
    color: '#519BC2',
    letterSpacing: 0.5,
  },
  welcomeMessageTextContainer: {
    alignItems: 'center',
    width: '100%',
    minWidth: 0,
    flexShrink: 1,
    marginTop: 0,
    paddingHorizontal: spacing[6],
  },
  welcomeMessageText: {
    fontSize: 18,
    fontFamily: 'Nunito-Regular',
    fontWeight: '500',
    color: colors.gray[700],
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: spacing[4],
    flexWrap: 'wrap',
    letterSpacing: 0.4,
    paddingHorizontal: spacing[4],
  },
  promptSuggestionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: spacing.radius.lg,
    paddingHorizontal: spacing[10],
    paddingVertical: spacing[8],
    marginTop: spacing[8],
    alignSelf: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  promptSuggestionText: {
    fontSize: 16,
    fontFamily: 'System',
    fontWeight: '500',
    color: colors.gray[700],
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  orDividerContainer: {
    alignItems: 'center',
    marginTop: spacing[4],
    marginBottom: spacing[2],
  },
  orText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    fontWeight: '400',
    color: colors.gray[400],
    textAlign: 'center',
    opacity: 0.7,
  },
  // Small turtle styles for ongoing conversations
  systemMessageContainerSmall: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: spacing.components.messageGap * 2,
    paddingHorizontal: spacing[4],
    marginTop: spacing[4],
  },
  systemMessageContentSmall: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
    gap: spacing[3],
  },
  turtleAvatarContainerSmall: {
    width: 50,
    height: 50,
    marginBottom: spacing[2],
    marginRight: 0,
    marginTop: 0,
    alignSelf: 'flex-start',
    flexShrink: 0,
  },
  turtleAvatarSmall: {
    width: 50,
    height: 50,
    borderRadius: 0,
    borderWidth: 0,
    borderColor: 'transparent',
  },

  // Message Text - Modern Typography, Full Width
  systemMessageTextContainer: {
    alignItems: 'flex-start',
    width: '100%',
    minWidth: 0,
    flexShrink: 1,
    marginTop: 0,
    paddingHorizontal: spacing[2],
  },
  systemMessageText: {
    fontSize: 16,
    fontFamily: 'System',
    fontWeight: '400',
    color: '#374151', // Darker grey for better readability
    textAlign: 'left',
    lineHeight: 24,
    marginBottom: spacing[2],
    flexWrap: 'wrap',
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
    fontFamily: 'System',
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
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  typingTurtleAvatar: {
    width: 36,
    height: 36,
    borderRadius: 0,
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
    fontFamily: 'System',
    fontWeight: '400',
    color: colors.text.tertiary,
    fontStyle: 'italic',
    letterSpacing: 0.1,
  },

  // Suggestions
  suggestionsContainer: {
    paddingHorizontal: spacing.layout.screenPadding,
    paddingBottom: spacing.components.cardGap,
    gap: spacing[4], // Space between the two rows
  },
  suggestionsScroll: {
    marginHorizontal: -spacing.layout.screenPadding, // Extend to screen edges
    paddingHorizontal: spacing.layout.screenPadding,
  },
  suggestionsScrollContent: {
    gap: spacing[4],
    paddingRight: spacing.layout.screenPadding, // Extra padding for last item
  },
  suggestionsStack: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[4],
    justifyContent: 'flex-start', // Left-aligned instead of centered
  },
  exerciseButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  suggestionChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // More transparent
    paddingHorizontal: spacing.components.cardGap + 2,
    paddingVertical: spacing[4] + 1,
    borderRadius: spacing.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(209, 213, 219, 0.6)', // Semi-transparent border
  },
  suggestionText: {
    fontSize: 16,
    fontFamily: 'System',
    fontWeight: '500',
    color: colors.text.secondary,
    letterSpacing: 0.2,
  },
  exerciseSuggestionButton: {
    backgroundColor: 'rgba(107, 70, 193, 0.1)', // Light purple background
    borderColor: 'rgba(107, 70, 193, 0.3)', // Purple border
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseSuggestionText: {
    color: '#6B46C1', // Purple text
    fontWeight: '600',
  },

  // Input Area - Modern Glass
  inputContainer: {
    paddingHorizontal: spacing.layout.screenPadding,
    paddingVertical: spacing.components.cardGap,
    paddingBottom: spacing.components.cardGap + 10, // Extra padding for keyboard
    zIndex: 10,
  },
  inputCard: {
    backgroundColor: 'rgba(248, 250, 255, 0.95)',
    borderWidth: 1,
    borderColor: '#e1f5fe',
    borderRadius: 25,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing[3],
    minHeight: 48,
  },
  inputButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  expandButton: {
    padding: spacing[2],
    borderRadius: 18,
    backgroundColor: 'transparent',
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButton: {
    padding: spacing[2],
    borderRadius: 22,
    backgroundColor: 'transparent',
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    marginRight: spacing[2],
  },
  iconButton: {
    padding: spacing[1],
    borderRadius: 16,
    backgroundColor: 'transparent',
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: spacing[4],
    marginTop: spacing[3],
    paddingHorizontal: spacing[2],
  },
  waveInInputContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[2],
    minHeight: 40,
  },
  recordingActions: {
    flexDirection: 'row',
    gap: spacing[2],
    zIndex: 2,
  },
  recordingButton: {
    padding: spacing[2],
    borderRadius: 18,
    backgroundColor: 'transparent',
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputHeader: {
    paddingHorizontal: spacing.components.inputPadding,
    paddingVertical: spacing.components.cardGap,
  },
  inputPrompt: {
    fontSize: 17,
    fontFamily: 'System',
    fontWeight: '500',
    color: colors.text.tertiary,
    marginBottom: spacing[6],
    letterSpacing: 0.3,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'System',
    fontWeight: '400',
    color: colors.text.primary,
    minHeight: 48,
    maxHeight: 200,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
    backgroundColor: 'transparent',
    lineHeight: 22,
    letterSpacing: 0.2,
    textAlignVertical: 'top',
    paddingTop: 14,
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

  // Fullscreen Input Modal Styles
  fullscreenInputContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  fullscreenInputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.layout.screenPadding,
    paddingVertical: spacing.components.cardGap,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  fullscreenCloseButton: {
    padding: spacing[2],
    borderRadius: 18,
    backgroundColor: 'transparent',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreenInputTitle: {
    fontSize: 18,
    fontFamily: 'System',
    fontWeight: '600',
    color: colors.text.primary,
    letterSpacing: 0.2,
  },
  fullscreenSendButton: {
    padding: spacing[2],
    borderRadius: 20,
    backgroundColor: '#519BC2',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreenSendButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  fullscreenInputContent: {
    flex: 1,
    padding: spacing.layout.screenPadding,
  },
  fullscreenTextInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'System',
    fontWeight: '400',
    color: colors.text.primary,
    backgroundColor: 'transparent',
    lineHeight: 24,
    letterSpacing: 0.2,
    textAlignVertical: 'top',
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
    fontFamily: 'System',
    fontWeight: '400',
    color: colors.text.tertiary,
    textAlign: 'center',
    letterSpacing: 0.2,
  },

  // Send Button - Match Mic Button
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#519BC2',
    shadowColor: '#519BC2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 2,
  },
  sendButtonActive: {
    backgroundColor: '#2563eb',
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
  },


});