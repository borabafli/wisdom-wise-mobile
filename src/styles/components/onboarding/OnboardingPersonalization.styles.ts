import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';

const { width, height } = Dimensions.get('window');

export const onboardingPersonalizationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF8F8', // Same as other onboarding screens
  },

  safeArea: {
    flex: 1,
  },

  backButton: {
    position: 'absolute',
    top: spacing[8], // 16px
    left: spacing[8], // 16px - moved more to the left from spacing[16]
    zIndex: 10,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  keyboardContainer: {
    flex: 1,
  },

  scrollContainer: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1, // Makes content container expand to fill space - required for marginTop: 'auto' to work
    paddingBottom: spacing[32], // Increased from 8 to 32 (64px) for better spacing
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
    backgroundColor: '#5BA3B8', // Consistent app-wide color
    borderRadius: 2,
  },

  progressText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.ubuntuMedium,
    color: colors.teal[600],
  },


  // Content Section
  contentContainer: {
    flex: 1, // Changed from minHeight: '100%' for natural flow
    paddingHorizontal: spacing[16], // 16px - reduced from 24px
    paddingVertical: spacing[16], // 16px - reduced from 24px
    // Removed justifyContent: 'center' to prevent content jumping
  },

  // Header
  headerContainer: {
    paddingHorizontal: spacing[12], // 24px - reduced horizontal padding for headings
    marginBottom: spacing[20], // 40px - standardized spacing to content
    marginTop: spacing[16], // Move heading slightly lower (was 8px, now 16px)
  },

  headline: {
    fontSize: 24, // H1 size from design principles
    fontFamily: typography.fontFamily.ubuntuBold,
    color: '#1F2937', // Match notification screen heading color
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: spacing[16], // 16px - reduced space below title
  },

  promptText: {
    fontSize: 18, // H3 size
    fontFamily: typography.fontFamily.ubuntuMedium,
    color: '#1F2937', // Match notification screen heading color
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic', // Italic font as requested
  },

  // Image Container
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing[16], // 32px spacing around image
  },

  turtleImage: {
    width: 160,
    height: 160,
  },

  // Anu Avatar and Speech Bubble
  anuContainer: {
    alignItems: 'center',
    marginTop: 20,
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
    width: 100,
    height: 150,
  },

  heartContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#EDF8F8',
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
    backgroundColor: '#EDF8F8',
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
    fontFamily: typography.fontFamily.ubuntuMedium,
    color: '#1F2937', // Match notification screen heading color
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[16],
    marginVertical: spacing[16],
  },

  inputContainer: {
    width: '92%', // Make input box wider (was 85%, now 92%)
    marginBottom: spacing[8],
  },

  textInput: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 0, // Remove border
    fontSize: 17,
    fontFamily: typography.fontFamily.ubuntu,
    color: '#1F2937',
    paddingHorizontal: 20,
    paddingVertical: 14,
    textAlign: 'center',
    minHeight: 50, // Slightly bigger (was 44, now 50)
  },

  inputCaption: {
    fontSize: 12, // Make text smaller (was 14, now 12)
    fontFamily: typography.fontFamily.ubuntu,
    color: '#6B7280', // Gray color like other screens
    textAlign: 'center',
    opacity: 0.8,
  },

  // Action Section
  actionContainer: {
    alignItems: 'center',
    paddingBottom: 30, // Standardized across all personalization screens
    paddingTop: spacing[8], // 16px top padding
    marginTop: 'auto', // Pushes button to bottom for consistent positioning across all screens
    zIndex: 1000, // Absolute foreground
    position: 'relative',
  },

  primaryButton: {
    paddingHorizontal: 48, // Standard padding to match other onboarding buttons
    minWidth: 240, // Standard width to match other onboarding buttons
    height: 48,
    backgroundColor: '#5BA3B8', // Consistent app-wide button color
    borderRadius: 18, // Slightly less rounded
    marginBottom: spacing[8], // 8px
    alignItems: 'center',
    justifyContent: 'center',
    // Remove all shadows
  },

  buttonGradient: {
    flex: 1,
    borderRadius: 18, // Match button border radius
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.ubuntuBold, // Match selection buttons bold font
    color: '#FFFFFF', // Match notification screen button text color
    letterSpacing: 0.2,
  },

  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },

  secondaryButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.ubuntuBold,
    color: '#6B7280', // Match other screens gray color
    textDecorationLine: 'underline',
    textDecorationColor: '#6B7280',
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