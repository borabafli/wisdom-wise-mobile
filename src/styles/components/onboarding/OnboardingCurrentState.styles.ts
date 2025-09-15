import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../tokens/colors';

const { width, height } = Dimensions.get('window');

export const onboardingCurrentStateStyles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
  },

  scrollView: {
    flex: 1,
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
    width: '71%', // 5/7 pages
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
    paddingVertical: 20,
    paddingBottom: 40,
  },

  // Header with Anu
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },

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

  title: {
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

  // Section Styles
  sectionContainer: {
    marginBottom: 32,
  },

  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Ubuntu-Bold',
    color: colors.teal[800],
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 26,
  },

  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },

  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(20, 184, 166, 0.2)',
    marginHorizontal: 4,
    marginVertical: 4,
    minWidth: 80,
    alignItems: 'center',
    shadowColor: colors.teal[300],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  optionButtonSelected: {
    backgroundColor: colors.teal[500],
    borderColor: colors.teal[600],
    shadowColor: colors.teal[500],
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  optionText: {
    fontSize: 14,
    fontFamily: 'Ubuntu-Medium',
    color: colors.teal[700],
    textAlign: 'center',
  },

  optionTextSelected: {
    color: 'white',
    fontFamily: 'Ubuntu-Bold',
  },

  // Action Buttons
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: 30,
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

  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(20, 184, 166, 0.3)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(20, 184, 166, 0.4)',
    minWidth: 120,
    shadowColor: colors.teal[300],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },

  continueButtonEnabled: {
    backgroundColor: colors.teal[500],
    borderColor: colors.teal[600],
    shadowColor: colors.teal[500],
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },

  continueButtonText: {
    fontSize: 16,
    fontFamily: 'Ubuntu-Bold',
    color: '#a0a0a0',
    marginRight: 8,
  },

  continueButtonTextEnabled: {
    color: 'white',
  },

  // Responsive adjustments
  '@media (max-height: 700)': {
    headerContainer: {
      marginBottom: 24,
    },

    avatarContainer: {
      width: 64,
      height: 64,
      marginBottom: 12,
    },

    avatarImage: {
      width: 48,
      height: 48,
    },

    title: {
      fontSize: 24,
      lineHeight: 30,
    },

    subtitle: {
      fontSize: 14,
      lineHeight: 20,
    },

    sectionTitle: {
      fontSize: 18,
      lineHeight: 24,
      marginBottom: 16,
    },

    sectionContainer: {
      marginBottom: 24,
    },
  },
});