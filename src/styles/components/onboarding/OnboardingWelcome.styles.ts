import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';

const { width, height } = Dimensions.get('window');

export const onboardingWelcomeStyles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingVertical: spacing.large, // 24px
  },

  // Anu Image Container - Takes most of the screen
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxHeight: height * 0.6,
    marginTop: spacing.xl, // 32px
  },

  antuImage: {
    width: Math.min(width * 0.8, 350),
    height: Math.min(width * 0.8, 350),
    maxWidth: 350,
    maxHeight: 350,
  },

  // Text Content Container
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.large, // 24px
    marginBottom: spacing.medium, // 16px - reduced from 32px to bring text closer
  },

  // Initial greeting text
  greetingContainer: {
    marginBottom: spacing.small, // 8px - reduced from 16px to bring text closer
  },

  greetingText: {
    fontSize: 32, // Display Extra Large
    fontFamily: typography.fontFamily.ubuntuBold,
    color: colors.teal[800], // Hero Teal from design principles
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 38,
  },

  // Animated subtitle
  subtitleContainer: {
    paddingHorizontal: spacing.small, // 8px
  },

  subtitleText: {
    fontSize: 20, // H2 size
    fontFamily: typography.fontFamily.ubuntuMedium,
    color: colors.teal[600], // Soft Sage from design principles
    textAlign: 'center',
    lineHeight: 28,
    opacity: 0.9,
  },

  // Action Button Container
  actionContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: spacing.large, // 24px
    paddingBottom: 30, // Match other onboarding pages exactly
  },

  // Primary Button - Following design principles
  primaryButton: {
    paddingHorizontal: 32, // Standard button padding
    minWidth: 200, // Minimum width for button
    height: 48, // Design principles height
    backgroundColor: colors.teal[500], // Hero Teal
    borderRadius: 24, // Pill-shaped from design principles
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.teal[500],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  primaryButtonText: {
    fontSize: 16, // Button text size from design principles
    fontFamily: typography.fontFamily.ubuntuMedium,
    color: colors.white,
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