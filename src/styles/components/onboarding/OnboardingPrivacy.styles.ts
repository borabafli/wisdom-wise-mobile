import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../tokens/colors';

const { width, height } = Dimensions.get('window');

export const onboardingPrivacyStyles = StyleSheet.create({
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
    width: '20%', // 2/10
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
    paddingVertical: 10,
  },

  headerContainer: {
    alignItems: 'center',
    marginTop: height * 0.02,
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  headline: {
    fontSize: 28,
    fontFamily: 'BubblegumSans-Regular',
    color: colors.teal[800],
    textAlign: 'center',
    letterSpacing: -0.5,
  },

  // Character & Shield Animation Styles
  characterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
    minHeight: 140,
  },

  shieldContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(94, 234, 212, 0.15)',
    marginBottom: 16,
    position: 'relative',
    shadowColor: colors.teal[500],
    shadowOffset: {
      width: 80,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },

  checkmarkOverlay: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 2,
  },

  turtleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  turtleImage: {
    width: 80,
    height: 120,
  },

  // Privacy Content Styles
  privacyContent: {
    flex: 1,
    marginBottom: 20,
  },

  privacyList: {
    marginBottom: 24,
  },

  privacyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 8,
  },

  privacyText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Ubuntu-Regular',
    color: colors.teal[700],
    lineHeight: 22,
    marginLeft: 12,
  },


  // Consent Checkbox Styles
  consentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 8,
  },

  checkbox: {
    width: 80,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.teal[300],
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 1,
  },

  checkboxChecked: {
    backgroundColor: colors.teal[500],
    borderColor: colors.teal[500],
  },

  consentText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Ubuntu-Regular',
    color: colors.teal[700],
    lineHeight: 21,
  },

  // Legal Links Styles
  legalLinksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  legalLink: {
    fontSize: 14,
    fontFamily: 'Ubuntu-Medium',
    color: colors.teal[600],
    textDecorationLine: 'underline',
    textDecorationColor: colors.teal[400],
  },

  linkSeparator: {
    fontSize: 14,
    fontFamily: 'Ubuntu-Regular',
    color: colors.teal[400],
    marginHorizontal: 12,
  },

  // Action Button Styles
  actionContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },

  primaryButton: {
    width: '80%',
    height: 56,
    borderRadius: 28,
    marginBottom: 16,
    shadowColor: colors.teal[500],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },

  primaryButtonDisabled: {
    shadowOpacity: 0.1,
    elevation: 2,
  },

  buttonGradient: {
    flex: 1,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    fontSize: 18,
    fontFamily: 'Ubuntu-Bold',
    color: colors.white,
    letterSpacing: 0.3,
  },

  primaryButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.7)',
  },

  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },

  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Ubuntu-Medium',
    color: colors.teal[600],
    textDecorationLine: 'underline',
    textDecorationColor: colors.teal[400],
  },

  // Responsive adjustments
  '@media (max-height: 700)': {
    headerContainer: {
      marginTop: height * 0.01,
      marginBottom: 15,
    },
    
    characterContainer: {
      minHeight: 100,
      marginBottom: 15,
    },
    
    turtleImage: {
      width: 80,
      height: 80,
    },

    shieldContainer: {
      width: 80,
      height: 60,
      marginBottom: 12,
    },
  },
});