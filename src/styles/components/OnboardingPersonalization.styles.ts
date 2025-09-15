import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../tokens/colors';

const { width, height } = Dimensions.get('window');

export const onboardingPersonalizationStyles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
  },

  keyboardContainer: {
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
    width: '30%', // 3/10
    height: '100%',
    backgroundColor: colors.teal[500],
    borderRadius: 2,
  },

  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.teal[600],
  },


  // Main Content Styles
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 10,
    zIndex: 1,
  },

  headerContainer: {
    alignItems: 'center',
    marginTop: height * 0.02,
    paddingHorizontal: 20,
  },

  headline: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: colors.teal[800],
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 32,
  },

  // Anu Avatar and Speech Bubble
  anuContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },

  anuAvatarContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(94, 234, 212, 0.1)',
    marginBottom: 16,
    shadowColor: colors.teal[500],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },

  anuAvatar: {
    width: 80,
    height: 80,
  },

  heartContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#f43f5e',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  speechBubble: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    position: 'relative',
    shadowColor: colors.teal[500],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(94, 234, 212, 0.2)',
  },

  speechText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: colors.teal[700],
    textAlign: 'center',
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

  // Input Section Styles
  inputSection: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginBottom: 40,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  inputIcon: {
    marginRight: 12,
    marginTop: 2,
  },

  textInputWrapper: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 2,
    shadowColor: colors.teal[500],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 12,
    elevation: 4,
  },

  textInput: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: colors.teal[800],
    paddingHorizontal: 20,
    paddingVertical: 16,
    textAlign: 'center',
  },

  inputCaption: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.teal[500],
    textAlign: 'center',
    fontStyle: 'italic',
    marginLeft: 32, // Account for icon space
  },

  // Action Button Styles
  actionContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },

  primaryButton: {
    width: '100%',
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

  buttonGradient: {
    flex: 1,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: colors.white,
    letterSpacing: 0.3,
  },

  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },

  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: colors.teal[600],
    textDecorationLine: 'underline',
    textDecorationColor: colors.teal[400],
  },

  // Responsive adjustments
  '@media (max-height: 700)': {
    headerContainer: {
      marginTop: height * 0.01,
    },
    
    
    anuAvatarContainer: {
      width: 80,
      height: 80,
      marginBottom: 12,
    },
    
    anuAvatar: {
      width: 60,
      height: 60,
    },

    headline: {
      fontSize: 24,
      marginBottom: 24,
    },
  },
});