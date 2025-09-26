import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';

const { width, height } = Dimensions.get('window');

export const onboardingFinalStyles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    paddingHorizontal: spacing[8], // 16px
  },

  // Main Content Layout
  contentContainer: {
    flex: 1,
    paddingVertical: spacing[12], // 24px
  },


  // Header Section
  headerContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing[8],
    marginBottom: spacing[24], // 48px - increased spacing
    marginTop: spacing[12], // 24px
  },

  mainTitle: {
    fontSize: 32, // Display Extra Large
    fontFamily: typography.fontFamily.ubuntuBold,
    color: colors.teal[800],
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 38,
    marginBottom: spacing[8], // 16px
  },

  subtitle: {
    fontSize: 18, // H3 size
    fontFamily: typography.fontFamily.ubuntuMedium,
    color: colors.teal[600],
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
    paddingHorizontal: spacing[4], // 8px
  },

  // Features Section
  featuresContainer: {
    flex: 1,
    paddingHorizontal: spacing[8],
    justifyContent: 'flex-start',
    paddingTop: spacing[4], // Add some top padding
    marginTop: -spacing[8], // Move boxes slightly higher
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing[8], // 16px - reduced spacing
    paddingVertical: spacing[6], // 12px - reduced padding
    paddingHorizontal: spacing[8], // 16px
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(45, 178, 157, 0.1)',
  },

  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.teal[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[8], // 16px
    marginTop: 2, // Slight adjustment for alignment
  },

  featureContent: {
    flex: 1,
    paddingRight: spacing[4], // 8px
  },

  featureTitle: {
    fontSize: 18, // H3 size
    fontFamily: typography.fontFamily.ubuntuBold,
    color: colors.teal[800],
    lineHeight: 24,
    marginBottom: spacing[4], // 8px
  },

  featureDescription: {
    fontSize: 16, // Body text
    fontFamily: typography.fontFamily.ubuntu,
    color: colors.teal[600],
    lineHeight: 22,
    opacity: 0.8,
  },

  checkmarkContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkmark: {
    fontSize: 18,
    color: colors.teal[500],
    fontWeight: 'bold',
  },

  arrowContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  arrow: {
    fontSize: 16,
    color: colors.teal[400],
    fontWeight: 'bold',
  },

  // Action Button
  actionContainer: {
    alignItems: 'center',
    width: '100%',
  },

  primaryButton: {
    paddingHorizontal: 40,
    minWidth: 240,
    height: 52,
    backgroundColor: colors.teal[500],
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.teal[500],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },

  primaryButtonText: {
    fontSize: 18,
    fontFamily: typography.fontFamily.ubuntuBold,
    color: colors.white,
    letterSpacing: 0.2,
  },

  // Bottom section container
  bottomSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Loading boxes container for main screen
  loadingBoxesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[8], // 16px
    paddingHorizontal: spacing[16],
  },

  loadingBox: {
    width: width * 0.12,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.teal[300],
    marginHorizontal: spacing[2], // Small gap between boxes
  },

  // Main Screen Turtle and Progress
  mainTurtleContainer: {
    alignItems: 'center',
    marginBottom: -spacing[24], // Negative margin to position turtle on progress bar
    zIndex: 10, // Higher z-index to appear above loading bar
  },

  mainTurtleImage: {
    width: Math.min(width * 0.35, 160),
    height: Math.min(width * 0.35, 160),
    maxWidth: 160,
    maxHeight: 160,
  },

  mainProgressContainer: {
    width: 220, // Same width as button (minWidth: 240)
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: spacing[4], // 16px
  },

  progressBarBackground: {
    width: '100%',
    height: 8, // Made thicker
    backgroundColor: colors.teal[200],
    borderRadius: 4,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: colors.teal[500],
    borderRadius: 4,
  },

  // Disabled Button Styles
  disabledButton: {
    backgroundColor: colors.teal[300],
    opacity: 0.6,
  },

  disabledButtonText: {
    opacity: 0.8,
  },

  // Tick animation styles
  tickContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.teal[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing[4], // 8px
  },

  tickMark: {
    fontSize: 16,
    color: colors.white,
    fontWeight: 'bold',
  },

  // Bottom fixed area for progress and button
  bottomFixedArea: {
    position: 'absolute',
    bottom: -30,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: spacing[12], // 24px
    paddingBottom: 40, // Increase bottom padding for better positioning
    paddingTop: spacing[8], // Add top padding for separation
    backgroundColor: 'transparent',
  },

});