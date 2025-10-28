import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../tokens/colors';
import { shadows } from '../../tokens/shadows';

const { width, height } = Dimensions.get('window');

export const onboardingMotivationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF8F8', // Same as other onboarding screens
  },

  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
  },

  // Progress Indicator Styles
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 20,
  },

  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(20, 184, 166, 0.2)',
    borderRadius: 2,
    marginRight: 12,
  },

  progressFill: {
    width: '100%', // 7/7 pages (final screen)
    height: '100%',
    backgroundColor: '#36657d', // Primary color
    borderRadius: 2,
  },

  progressText: {
    fontSize: 14,
    fontFamily: 'Ubuntu-Medium',
    color: colors.teal[600],
  },

  // Main Content Styles
  contentContainer: {
    flexGrow: 1,
    paddingVertical: 10,
  },

  // Character Section
  characterContainer: {
    alignItems: 'center',
    marginTop: height * 0.02,
    marginBottom: 24,
  },

  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(91, 163, 184, 0.1)',
    marginBottom: 16,
    shadowColor: '#5BA3B8',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },

  anuAvatar: {
    width: 100,
    height: 100,
  },

  speechBubble: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    maxWidth: width * 0.8,
    position: 'relative',
    shadowColor: '#5BA3B8',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(91, 163, 184, 0.1)',
  },

  speechText: {
    fontSize: 16,
    fontFamily: 'Ubuntu-Medium',
    color: '#1F2937', // Match notification screen heading color
    textAlign: 'center',
    lineHeight: 22,
  },

  speechTail: {
    position: 'absolute',
    top: -8,
    left: '50%',
    marginLeft: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.white,
  },

  // Header Section
  headerContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },

  title: {
    fontSize: 24,
    fontFamily: 'BubblegumSans-Regular',
    color: '#1F2937', // Match notification screen heading color
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 30,
  },

  anvavatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },

  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(91, 163, 184, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5BA3B8',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 5,
  },

  avatar: {
    width: 80,
    height: 80,
  },

  // Speech Bubble
  speechBubbleContainer: {
    marginTop: 16,
    alignItems: 'center',
  },

  speechBubble: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderTopLeftRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 16,
    maxWidth: width * 0.8,
    shadowColor: '#5BA3B8',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },

  speechText: {
    fontSize: 16,
    fontFamily: 'BubblegumSans-Regular',
    color: '#1F2937', // Match notification screen heading color
    textAlign: 'center',
    lineHeight: 22,
  },

  subtitle: {
    fontSize: 14,
    fontFamily: 'Ubuntu-Regular',
    color: '#1F2937', // Match notification screen heading color
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },

  // Input Section
  inputSection: {
    flex: 1,
    marginVertical: 24,
  },

  inputLabel: {
    fontSize: 16,
    fontFamily: 'Ubuntu-Medium',
    color: '#1F2937', // Match notification screen heading color
    marginBottom: 12,
  },

  textAreaContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(91, 163, 184, 0.2)',
    padding: 16,
    minHeight: 120,
    shadowColor: '#5BA3B8',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  textAreaContainerFocused: {
    borderColor: '#5BA3B8',
    shadowOpacity: 0.15,
  },

  textAreaContainerDisabled: {
    backgroundColor: '#F8FAFC',
    borderColor: 'rgba(148, 163, 184, 0.3)',
    opacity: 0.7,
  },

  textArea: {
    fontSize: 16,
    fontFamily: 'Ubuntu-Regular',
    color: '#1F2937', // Match notification screen heading color
    lineHeight: 22,
    textAlignVertical: 'top',
    minHeight: 88,
  },

  textAreaDisabled: {
    color: '#1F2937', // Match notification screen heading color
  },

  characterCount: {
    fontSize: 12,
    fontFamily: 'Ubuntu-Regular',
    color: '#1F2937', // Match notification screen heading color
    textAlign: 'right',
    marginTop: 8,
  },

  characterCountLimit: {
    color: '#EF4444', // Red when approaching limit
  },

  // Quick Chips Section
  chipsSection: {
    marginTop: 24,
  },

  chipsLabel: {
    fontSize: 14,
    fontFamily: 'Ubuntu-Medium',
    color: '#1F2937', // Match notification screen heading color
    marginBottom: 12,
    textAlign: 'center',
  },

  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },

  chip: {
    backgroundColor: 'rgba(91, 163, 184, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(91, 163, 184, 0.3)',
  },

  chipSelected: {
    backgroundColor: '#5BA3B8',
    borderColor: '#5BA3B8',
  },

  chipText: {
    fontSize: 14,
    fontFamily: 'Ubuntu-Medium',
    color: '#5BA3B8',
  },

  chipTextSelected: {
    color: colors.white,
  },

  // Selected Chips Summary (shown after response)
  selectedChipsSummary: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(91, 163, 184, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(91, 163, 184, 0.1)',
  },

  selectedChipsLabel: {
    fontSize: 12,
    fontFamily: 'Ubuntu-Medium',
    color: '#1F2937', // Match notification screen heading color
    marginBottom: 4,
  },

  selectedChipsText: {
    fontSize: 14,
    fontFamily: 'Ubuntu-Regular',
    color: '#1F2937', // Match notification screen heading color
    lineHeight: 20,
  },

  // AI Response Section
  responseSection: {
    marginVertical: 24,
  },

  responseVisible: {
    opacity: 1,
  },

  responseContainer: {
    backgroundColor: 'rgba(91, 163, 184, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(91, 163, 184, 0.2)',
  },

  responseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  responseAvatarSmall: {
    width: 40,
    height: 40,
    marginRight: 12,
  },

  responseLabel: {
    fontSize: 14,
    fontFamily: 'Ubuntu-Bold',
    color: '#5BA3B8',
  },

  responseText: {
    fontSize: 16,
    fontFamily: 'Ubuntu-Regular',
    color: '#1F2937', // Match notification screen heading color
    lineHeight: 24,
  },

  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },

  loadingText: {
    fontSize: 14,
    fontFamily: 'Ubuntu-Medium',
    color: '#5BA3B8',
    marginLeft: 12,
  },

  // Action Buttons
  actionContainer: {
    alignItems: 'center',
    paddingBottom: 20,
    marginTop: 16,
  },

  primaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 18, // Slightly less rounded
    shadowColor: '#5BA3B8',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },

  primaryButtonDisabled: {
    opacity: 0.6,
  },

  buttonGradient: {
    flex: 1,
    borderRadius: 18, // Slightly less rounded
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  primaryButtonText: {
    fontSize: 18,
    fontFamily: 'Ubuntu-Bold',
    color: colors.white,
    letterSpacing: 0.3,
    marginRight: 8,
  },

  skipButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },

  skipButtonText: {
    fontSize: 16,
    fontFamily: 'Ubuntu-Medium',
    color: '#1F2937', // Match notification screen heading color
    textAlign: 'center',
  },

  // Responsive adjustments
  '@media (max-height: 700)': {
    headerContainer: {
      marginTop: height * 0.01,
      marginBottom: 24,
    },

    avatarWrapper: {
      width: 80,
      height: 80,
    },

    avatar: {
      width: 64,
      height: 64,
    },

    speechBubble: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },

    speechText: {
      fontSize: 15,
      lineHeight: 20,
    },

    textAreaContainer: {
      minHeight: 100,
      padding: 14,
    },

    textArea: {
      fontSize: 15,
      minHeight: 72,
    },
  },
});