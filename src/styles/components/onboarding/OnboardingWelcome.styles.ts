import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';

const { width, height } = Dimensions.get('window');

export const onboardingWelcomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF8F8',
  },

  safeArea: {
    flex: 1,
    paddingHorizontal: spacing.medium, // 16px
  },

  // Main Content Layout
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingVertical removed - handled dynamically in component for safe area
  },

  // Anu Image Container - Takes most of the screen
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxHeight: height * 0.6,
    marginTop: spacing.xl, // Restored to original 32px
  },

  videoContainer: {
    position: 'relative',
  },

  videoPlaceholder: {
    width: Math.min(width * 0.8, 350),
    height: Math.min(width * 0.8, 350),
    maxWidth: 350,
    maxHeight: 350,
    backgroundColor: '#EDF8F8', // Match screen background
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },

  antuImage: {
    width: Math.min(width * 0.8, 350),
    height: Math.min(width * 0.8, 350),
    maxWidth: 350,
    maxHeight: 350,
  },

  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#EDF8F8', // Match screen background
    zIndex: 1,
  },

  // Text Content Container
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.large,
    marginBottom: spacing[8], // Reduce bottom margin
    marginTop: -spacing[56], // Increased negative margin to bring text closer to video
  },

  // Initial greeting text
  greetingContainer: {
    marginBottom: spacing[16], // Reduced spacing between greeting and subtitle
  },

  greetingText: {
    fontSize: 32, // Display Extra Large
    fontFamily: typography.fontFamily.ubuntuBold,
    color: '#1F2937', // Match notification screen heading color
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 38,
  },

  // Animated subtitle
  subtitleContainer: {
    paddingHorizontal: spacing[32], // More side padding
    marginTop: -spacing[8], // Move subtitle higher
  },

  subtitleText: {
    fontSize: 20, // H2 size
    fontFamily: typography.fontFamily.ubuntuMedium,
    color: '#1F2937', // Match notification screen heading color
    textAlign: 'center',
    lineHeight: 28,
    opacity: 0.9,
  },

  // Action Button Container
  actionContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: spacing.large,
    paddingBottom: 0, // Bottom padding handled by contentContainer paddingBottom
    marginTop: spacing[8], // Positive margin for separation
    zIndex: 1000, // Absolute foreground
    position: 'relative',
  },

  // Primary Button - Following design principles
  primaryButton: {
    paddingHorizontal: 32, // Standard button padding
    minWidth: 200, // Minimum width for button
    height: 48, // Design principles height
    backgroundColor: '#5BA3B8', // Consistent app-wide button color
    borderRadius: 18, // Slightly less rounded
    alignItems: 'center',
    justifyContent: 'center',
    // No shadow to avoid white bar during animation
  },

  primaryButtonText: {
    fontSize: 16, // Button text size from design principles
    fontFamily: typography.fontFamily.ubuntuMedium,
    color: '#FFFFFF', // Match notification screen button text color
    letterSpacing: 0.2,
  },

  // Responsive adjustments for smaller screens
  '@media (max-height: 700)': {
    imageContainer: {
      maxHeight: height * 0.5,
      marginTop: spacing.medium,
    },
    
    antuImage: {
      width: Math.min(width * 0.7, 280),
      height: Math.min(width * 0.7, 280),
      maxWidth: 280,
      maxHeight: 280,
    },
    
    greetingText: {
      fontSize: 28,
      lineHeight: 34,
    },
    
    subtitleText: {
      fontSize: 18,
      lineHeight: 24,
    },
  },

  // Very small screens
  '@media (max-height: 600)': {
    textContainer: {
      marginBottom: spacing.large,
    },
    
    greetingText: {
      fontSize: 24,
      lineHeight: 30,
    },
    
    subtitleText: {
      fontSize: 16,
      lineHeight: 22,
    },
  },
});