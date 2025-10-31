import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';

const { width, height } = Dimensions.get('window');

export const personalValuesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF8F8',
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

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1, // Makes content container expand to fill space - required for marginTop: 'auto' to work
    paddingBottom: spacing[32], // Increased from 8 to 32 (64px) for better spacing
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
    marginTop: spacing[8], // 16px - standardized top margin
  },

  headline: {
    fontSize: 24, // H1 size from design principles
    fontFamily: typography.fontFamily.ubuntuBold,
    color: '#1F2937', // Match notification screen heading color
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: spacing[16], // 16px - reduced space below title
  },

  bodyText: {
    fontSize: 16, // Large body
    fontFamily: typography.fontFamily.ubuntu,
    color: '#1F2937', // Match notification screen heading color
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing[16], // 16px
    opacity: 0.9,
  },

  promptText: {
    fontSize: 18, // H3 size
    fontFamily: typography.fontFamily.ubuntuMedium,
    color: '#1F2937', // Match notification screen heading color
    textAlign: 'center',
    lineHeight: 24,
  },

  // Values Selection
  valuesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[16], // Same as Focus Areas
    paddingBottom: spacing[16], // Same as Focus Areas
    gap: spacing[4], // Reduced spacing between buttons
  },

  // Value Chips
  valueChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center the text
    backgroundColor: colors.white, // Completely white background
    borderWidth: 0, // No border
    borderRadius: 12, // Reduced from 24 to make corners less rounded
    paddingHorizontal: 20,
    paddingVertical: 12, // Same padding as Focus Areas
    width: width * 0.75, // Consistent width for all chips (75% of screen width)
    minHeight: 44, // Same height as Focus Areas
    // Remove all shadows to prevent fade-in artifacts
  },

  selectedValueChip: {
    backgroundColor: '#437690', // Selected state color
    borderWidth: 0, // Remove borders
    shadowColor: colors.teal[500],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },

  valueChipText: {
    fontSize: 16, // Large body
    fontFamily: typography.fontFamily.ubuntu, // Use Ubuntu regular for lighter font
    color: colors.gray[700],
    textAlign: 'center',
  },

  selectedValueChipText: {
    color: '#FFFFFF', // Match notification screen button text color
    fontFamily: typography.fontFamily.ubuntuBold, // Use Ubuntu Bold for more bold font
  },

  // Checkmark
  checkmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#437690', // Selected state color
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing[8], // 8px
  },

  checkmark: {
    fontSize: 14,
    fontFamily: typography.fontFamily.ubuntuBold,
    color: colors.white,
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

  continueButton: {
    paddingHorizontal: 48, // Standard padding to match other onboarding buttons
    minWidth: 240, // Standard width to match other onboarding buttons
    height: 48,
    backgroundColor: '#5BA3B8', // Consistent app-wide button color
    borderRadius: 18, // Slightly less rounded
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5BA3B8',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: spacing[8], // 8px
  },

  disabledButton: {
    backgroundColor: colors.gray[300],
    shadowOpacity: 0,
    elevation: 0,
  },

  continueButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.ubuntuBold, // Match selection buttons bold font
    color: '#FFFFFF', // Match notification screen button text color
    letterSpacing: 0.2,
  },

  disabledButtonText: {
    color: colors.gray[500],
  },

  selectionCount: {
    fontSize: 14,
    fontFamily: typography.fontFamily.ubuntu,
    color: colors.teal[600],
    opacity: 0.8,
  },

  // Responsive adjustments
  '@media (max-height: 700)': {
    curvedTopSection: {
      height: height * 0.3,
    },
    
    anuImage: {
      width: width * 0.25,
      height: width * 0.25,
      maxWidth: 100,
      maxHeight: 100,
    },
    
    headline: {
      fontSize: 22,
      lineHeight: 28,
    },
    
    bodyText: {
      fontSize: 15,
      lineHeight: 22,
    },
  },

  // Very small screens
  '@media (max-height: 600)': {
    curvedTopSection: {
      height: height * 0.25,
    },
    
    anuImage: {
      width: width * 0.22,
      height: width * 0.22,
      maxWidth: 90,
      maxHeight: 90,
    },
    
    headline: {
      fontSize: 20,
      lineHeight: 26,
    },
    
    bodyText: {
      fontSize: 14,
      lineHeight: 20,
    },
    
    valueChip: {
      paddingVertical: spacing[8], // 8px
    },
  },
});