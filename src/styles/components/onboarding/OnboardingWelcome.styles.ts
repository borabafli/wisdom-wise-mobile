import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../tokens/colors';

const { width, height } = Dimensions.get('window');

export const onboardingWelcomeStyles = StyleSheet.create({
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
    width: '10%', // 1/10
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

  headerContainer: {
    alignItems: 'center',
    marginTop: height * 0.08,
    paddingHorizontal: 20,
  },

  headline: {
    fontSize: 32,
    fontFamily: 'BubblegumSans-Regular',
    color: colors.teal[800],
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },

  subtext: {
    fontSize: 17,
    fontFamily: 'Ubuntu-Regular',
    color: colors.teal[600],
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
  },

  // Character Animation Styles
  characterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    position: 'relative',
    minHeight: 280,
  },

  turtleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(94, 234, 212, 0.1)',
    shadowColor: colors.teal[500],
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },

  turtleImage: {
    width: 200,
    height: 200,
  },

  sparkleContainer: {
    position: 'absolute',
    top: 20,
    right: 40,
    zIndex: 1,
  },

  sparkleContainer2: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    zIndex: 1,
  },

  // Action Button Styles
  actionContainer: {
    width: '100%',
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
    fontFamily: 'Ubuntu-Bold',
    color: colors.white,
    letterSpacing: 0.3,
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

  // Modal Styles
  modalContainer: {
    flex: 1,
  },

  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(94, 234, 212, 0.15)',
    marginBottom: 24,
  },

  modalTitleContainer: {
    flex: 1,
  },

  modalTitle: {
    fontSize: 24,
    fontFamily: 'Ubuntu-Bold',
    color: colors.teal[800],
  },

  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(94, 234, 212, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalScroll: {
    flex: 1,
  },

  modalBodyContainer: {
    paddingBottom: 40,
  },
  
  modalAnuContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  
  modalAnuImage: {
    width: 120,
    height: 120,
  },

  modalDescription: {
    fontSize: 16,
    fontFamily: 'Ubuntu-Regular',
    color: colors.teal[700],
    lineHeight: 24,
    marginBottom: 28,
  },

  featureList: {
    marginBottom: 28,
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingRight: 16,
  },

  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.teal[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    marginTop: 1,
  },

  checkmarkText: {
    fontSize: 14,
    fontFamily: 'Ubuntu-Bold',
    color: colors.white,
  },

  featureText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Ubuntu-Regular',
    color: colors.teal[700],
    lineHeight: 22,
  },

  modalFooter: {
    fontSize: 15,
    fontFamily: 'Ubuntu-Regular',
    color: colors.teal[600],
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 16,
    fontStyle: 'italic',
  },

  // Responsive adjustments
  '@media (max-height: 700)': {
    headerContainer: {
      marginTop: height * 0.04,
    },
    
    characterContainer: {
      minHeight: 200,
    },
    
    turtleContainer: {
      width: 180,
      height: 180,
    },
    
    turtleImage: {
      width: 150,
      height: 150,
    },
  },
});