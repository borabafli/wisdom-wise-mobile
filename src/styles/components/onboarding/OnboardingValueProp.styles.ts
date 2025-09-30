import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';

const { width, height } = Dimensions.get('window');

export const onboardingValuePropStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF8F8',
  },

  safeArea: {
    flex: 1,
  },

  // Main Content Layout
  contentContainer: {
    flex: 1,
  },

  // Swipable Container - Only for text
  swipeContainer: {
    height: height * 0.25, // Reduced height for text area
    marginTop: spacing[16], // 16px - closer to top
  },

  // Page Container - Only contains text
  pageContainer: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[20], // 20px - reduced padding from edges
    height: '100%',
  },

  // Text Content Container
  textContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  pageTitle: {
    fontSize: 28, // Display Large
    fontFamily: typography.fontFamily.ubuntuBold,
    color: '#1F2937', // Match notification screen heading color
    textAlign: 'center',
    lineHeight: 34,
    letterSpacing: -0.5,
    marginBottom: spacing[16], // 16px
    paddingHorizontal: spacing[16], // 16px - reduced padding
  },

  pageIcon: {
    width: 56, // Slightly bigger icon size (increased from 48px)
    height: 56, // Slightly bigger icon size (increased from 48px)
    alignSelf: 'center',
    marginBottom: spacing[16], // 16px space below icon
  },

  pageDescription: {
    fontSize: 18, // Increased from 16 to 18
    fontFamily: typography.fontFamily.ubuntu,
    color: '#1F2937', // Match notification screen heading color
    textAlign: 'center',
    lineHeight: 26, // Increased from 24 to 26 for better spacing
    opacity: 0.9,
    paddingHorizontal: spacing[16], // 16px - reduced padding
  },

  // Static Anu Image - Never moves
  staticAnuContainer: {
    alignItems: 'center', // Center the image
    justifyContent: 'center',
    flex: 1,
    paddingTop: 0,
    paddingBottom: spacing[48], // More space from button to move video higher
    marginTop: -spacing[24], // Move container up slightly
  },

  videoContainer: {
    position: 'relative',
  },

  videoPlaceholder: {
    width: Math.min(width * 0.85, 400),
    height: Math.min(width * 0.85, 400),
    maxWidth: 400,
    maxHeight: 400,
    backgroundColor: '#EDF8F8', // Match screen background
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },

  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Math.min(width * 0.6, 280), // Exact video dimensions
    height: Math.min(width * 0.6, 280), // Exact video dimensions
    backgroundColor: '#EDF8F8', // Match screen background
    zIndex: 2, // Above video only
    borderRadius: 8,
  },

  staticAnuImage: {
    width: Math.min(width * 0.6, 280), // Reduced from 0.85 to 0.6
    height: Math.min(width * 0.6, 280), // Reduced from 0.85 to 0.6
    maxWidth: 280, // Reduced from 400 to 280
    maxHeight: 280, // Reduced from 400 to 280
  },

  // Page Indicators - Right below text
  pageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing[12], // Reduced from 24px to 12px to bring dots closer to text
    paddingBottom: spacing[48], // 48px from Anu - increased spacing from image
    gap: spacing[8], // 8px
    position: 'relative',
    zIndex: 10, // Ensure dots appear above video
  },

  pageIndicator: {
    width: 12, // Increased from 8 to 12
    height: 12, // Increased from 8 to 12
    borderRadius: 6, // Increased from 4 to 6
    backgroundColor: colors.gray[300],
    opacity: 0.5,
  },

  activePageIndicator: {
    backgroundColor: '#36657d', // Match notification screen button color
    opacity: 1,
  },

  // Action Button Container - positioned at bottom
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: spacing[24], // 24px
    paddingBottom: 30, // Match other onboarding pages exactly
    backgroundColor: 'transparent',
    zIndex: 1000, // Absolute foreground
  },

  // Primary Button - Following design principles
  primaryButton: {
    paddingHorizontal: 48, // Larger padding for prominence
    minWidth: 240, // Wider button
    height: 48, // Design principles height
    backgroundColor: '#36657d', // Match notification screen button color
    borderRadius: 18, // Slightly less rounded
    alignItems: 'center',
    justifyContent: 'center',
    // No shadow to avoid white bar during animation
    zIndex: 1001, // Even higher z-index for button
    position: 'relative',
  },

  primaryButtonText: {
    fontSize: 16, // Button text size from design principles
    fontFamily: typography.fontFamily.ubuntuMedium,
    color: '#FFFFFF', // Match notification screen button text color
    letterSpacing: 0.2,
  },

  // Responsive adjustments for smaller screens
  '@media (max-height: 700)': {
    swipeContainer: {
      height: height * 0.22,
    },
    
    pageTitle: {
      fontSize: 24,
      lineHeight: 30,
    },
    
    pageDescription: {
      fontSize: 16, // Increased from 15 to 16
      lineHeight: 24, // Increased from 22 to 24
    },
    
    staticAnuImage: {
      width: Math.min(width * 0.55, 240), // Reduced proportionally
      height: Math.min(width * 0.55, 240), // Reduced proportionally
      maxWidth: 240,
      maxHeight: 240,
    },
  },

  // Very small screens
  '@media (max-height: 600)': {
    swipeContainer: {
      height: height * 0.2,
    },
    
    pageTitle: {
      fontSize: 22,
      lineHeight: 28,
    },
    
    pageDescription: {
      fontSize: 15, // Increased from 14 to 15
      lineHeight: 22, // Increased from 20 to 22
    },
    
    staticAnuImage: {
      width: Math.min(width * 0.5, 200), // Reduced proportionally
      height: Math.min(width * 0.5, 200), // Reduced proportionally
      maxWidth: 200,
      maxHeight: 200,
    },
  },
});