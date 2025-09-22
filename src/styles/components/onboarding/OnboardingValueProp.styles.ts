import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';

const { width, height } = Dimensions.get('window');

export const onboardingValuePropStyles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  // Main Content Layout
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
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
    color: colors.teal[800],
    textAlign: 'center',
    lineHeight: 34,
    letterSpacing: -0.5,
    marginBottom: spacing[16], // 16px
    paddingHorizontal: spacing[16], // 16px - reduced padding
  },

  pageDescription: {
    fontSize: 16, // Large body
    fontFamily: typography.fontFamily.ubuntu,
    color: colors.gray[600],
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
    paddingHorizontal: spacing[16], // 16px - reduced padding
  },

  // Static Anu Image - Never moves
  staticAnuContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingTop: 0, // No top padding
    paddingBottom: spacing[32], // 32px from button
  },

  staticAnuImage: {
    width: Math.min(width * 0.85, 400),
    height: Math.min(width * 0.85, 400),
    maxWidth: 400,
    maxHeight: 400,
  },

  // Page Indicators - Right below text
  pageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing[16], // 16px from text - increased spacing from text
    paddingBottom: spacing[32], // 32px from Anu - increased spacing from image
    gap: spacing[8], // 8px
  },

  pageIndicator: {
    width: 12, // Increased from 8 to 12
    height: 12, // Increased from 8 to 12
    borderRadius: 6, // Increased from 4 to 6
    backgroundColor: colors.gray[300],
    opacity: 0.5,
  },

  activePageIndicator: {
    backgroundColor: colors.teal[500],
    opacity: 1,
  },

  // Action Button Container
  actionContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing[24], // 24px
    paddingBottom: spacing[24], // 24px
  },

  // Primary Button - Following design principles
  primaryButton: {
    paddingHorizontal: 48, // Larger padding for prominence
    minWidth: 240, // Wider button
    height: 48, // Design principles height
    backgroundColor: colors.teal[500], // Hero Teal
    borderRadius: 24, // Pill-shaped from design principles
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.teal[500],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },

  primaryButtonText: {
    fontSize: 16, // Button text size from design principles
    fontFamily: typography.fontFamily.ubuntuMedium,
    color: colors.white,
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
      fontSize: 15,
      lineHeight: 22,
    },
    
    staticAnuImage: {
      width: Math.min(width * 0.8, 340),
      height: Math.min(width * 0.8, 340),
      maxWidth: 340,
      maxHeight: 340,
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
      fontSize: 14,
      lineHeight: 20,
    },
    
    staticAnuImage: {
      width: Math.min(width * 0.75, 300),
      height: Math.min(width * 0.75, 300),
      maxWidth: 300,
      maxHeight: 300,
    },
  },
});