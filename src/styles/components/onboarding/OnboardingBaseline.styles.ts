import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../tokens/colors';

const { width, height } = Dimensions.get('window');

export const onboardingBaselineStyles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: '100%', // 7/7 pages
    height: '100%',
    backgroundColor: colors.teal[500],
    borderRadius: 2,
  },

  progressText: {
    fontSize: 14,
    fontFamily: 'Ubuntu-Medium',
    color: colors.teal[600],
  },

  // Main Content Styles
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },

  // Header with Anu
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },

  avatarWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.teal[500],
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 5,
  },

  avatar: {
    width: 64,
    height: 64,
  },

  headline: {
    fontSize: 28,
    fontFamily: 'BubblegumSans-Regular',
    color: colors.teal[800],
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 34,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    fontFamily: 'Ubuntu-Regular',
    color: colors.teal[600],
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.9,
  },

  // Mood Section
  moodSection: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  moodLabel: {
    fontSize: 20,
    fontFamily: 'Ubuntu-Bold',
    color: colors.teal[800],
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 26,
  },

  sliderContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  // Avatar styles
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.teal[500],
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 5,
  },

  avatarImage: {
    width: 64,
    height: 64,
  },

  // Text styles
  title: {
    fontSize: 28,
    fontFamily: 'BubblegumSans-Regular',
    color: colors.teal[800],
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 34,
    marginBottom: 8,
  },

  // Continue hint styles
  continueHint: {
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 20,
  },

  continueHintText: {
    fontSize: 14,
    fontFamily: 'Ubuntu-Medium',
    color: colors.teal[500],
    textAlign: 'center',
    opacity: 0.8,
  },

  // Continue Button Styles
  continueButtonContainer: {
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 20,
    width: '100%',
  },

  continueButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    shadowColor: '#5BA3B8',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },

  continueButtonGradient: {
    flex: 1,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  continueButtonText: {
    fontSize: 18,
    fontFamily: 'Ubuntu-Bold',
    color: colors.white,
    letterSpacing: 0.3,
    marginRight: 8,
  },


  // Action Buttons
  actionContainer: {
    alignItems: 'center',
    paddingBottom: 20,
    marginTop: 16,
  },

  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },

  skipButtonText: {
    fontSize: 16,
    fontFamily: 'Ubuntu-Medium',
    color: colors.teal[500],
    textAlign: 'center',
    textDecorationLine: 'underline',
    textDecorationColor: colors.teal[400],
  },

  // Responsive adjustments
  '@media (max-height: 700)': {
    headerContainer: {
      marginBottom: 24,
    },

    avatarWrapper: {
      width: 64,
      height: 64,
      marginBottom: 12,
    },

    avatar: {
      width: 48,
      height: 48,
    },

    headline: {
      fontSize: 24,
      lineHeight: 30,
    },

    subtitle: {
      fontSize: 14,
      lineHeight: 20,
    },

    moodLabel: {
      fontSize: 18,
      lineHeight: 24,
      marginBottom: 24,
    },
  },
});