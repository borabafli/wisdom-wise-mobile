import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';
import { shadows } from '../../tokens/shadows';

const { width, height } = Dimensions.get('window');

export const onboardingFinalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF8F8',
  },

  safeArea: {
    flex: 1,
    paddingHorizontal: spacing[8], // 16px
  },

  // Back button
  backButton: {
    position: 'absolute',
    top: spacing[8], // 16px - standardized position
    left: spacing[8], // 16px - moved more to the left, standardized
    zIndex: 10,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Main Content Layout
  contentContainer: {
    flex: 1,
    paddingVertical: spacing[4], // 8px - much more compact
  },


  // Header Section
  headerContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing[12], // 24px - reduced horizontal padding for headings
    marginBottom: spacing[20], // Reduced from 24px to move content up
    marginTop: spacing[40], // Reduced from 64px to move header up
  },

  mainTitle: {
    fontSize: 28, // Smaller for compactness
    fontFamily: typography.fontFamily.ubuntuBold,
    color: '#1F2937', // Match notification screen heading color
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 32, // Tighter line height
    marginBottom: spacing[6], // Reduced from 8px to move content up
  },

  subtitle: {
    fontSize: 16, // Smaller for compactness
    fontFamily: typography.fontFamily.ubuntuMedium,
    color: '#1F2937', // Match notification screen heading color
    textAlign: 'center',
    lineHeight: 22, // Tighter line height
    opacity: 0.9,
    paddingHorizontal: spacing[4], // 8px
  },

  // Features Section
  featuresContainer: {
    flex: 1,
    paddingHorizontal: spacing[4], // Reduced from spacing[8] to allow wider boxes
    justifyContent: 'flex-start',
    paddingTop: spacing[2], // Reduced from spacing[6] to move features up
    marginTop: -spacing[4], // Increased negative margin to move features up (was -spacing[2])
    marginBottom: -spacing[8], // Negative margin to reduce gap before turtle
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[3],
    paddingVertical: 20, // Increased from 16 to make boxes thicker/taller
    paddingHorizontal: spacing[4],
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '86%', // Restored to original width
    alignSelf: 'center',
  },

  featureIconContainer: {
    width: 36, // Increased from 28 to make icons bigger
    height: 36, // Increased from 28 to make icons bigger
    borderRadius: 18, // Increased to match new size
    backgroundColor: '#e6eff5', // Light blue-gray background
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[4], // 8px - more compact
  },

  featureTitle: {
    flex: 1,
    fontSize: 15, // Increased from 13 to make text bigger
    fontFamily: typography.fontFamily.ubuntu,
    color: '#1F2937',
    textAlign: 'left',
    marginRight: spacing[3],
  },

  featureDescription: {
    fontSize: 14,
    fontFamily: typography.fontFamily.ubuntu,
    color: '#1F2937',
    lineHeight: 20,
    opacity: 0.8,
    textAlign: 'left',
  },

  checkmarkContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkmark: {
    fontSize: 18,
    color: '#437690', // Selected state color
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
    color: '#437690', // Selected state color
    fontWeight: 'bold',
  },

  // Action Button
  actionContainer: {
    alignItems: 'center',
    width: '100%',
    zIndex: 1004, // Higher than turtle to ensure button is clickable
    position: 'relative',
    elevation: 11, // Android elevation higher than turtle
  },

  primaryButton: {
    paddingHorizontal: 40,
    minWidth: 240,
    height: 52,
    backgroundColor: '#5BA3B8', // Consistent app-wide button color
    borderRadius: 18, // Slightly less rounded
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.components.onboardingButton,
    shadowColor: '#5BA3B8', // Consistent with button color
    zIndex: 1005, // Ensure button is on top
    elevation: 12, // Android elevation
  },

  primaryButtonText: {
    fontSize: 18,
    fontFamily: typography.fontFamily.ubuntuBold,
    color: '#FFFFFF', // Match notification screen button text color
    letterSpacing: 0.2,
  },

  // Bottom section container
  bottomSection: {
    flex: 1,
    justifyContent: 'flex-end', // Changed from 'center' to 'flex-end' to position turtle lower
    alignItems: 'center',
    paddingBottom: spacing[20], // Increased from spacing[16] to move turtle slightly up
    zIndex: 1002, // Higher than button to ensure turtle stays in front
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
    backgroundColor: '#9bb3c7', // Medium blue-gray background
    marginHorizontal: spacing[2], // Small gap between boxes
  },

  // Main Screen Turtle and Progress
  mainTurtleContainer: {
    alignItems: 'center',
    marginBottom: spacing[2], // Reduced from spacing[4] to bring turtle closer to button
    marginTop: 0, // Removed negative margin since bottomSection handles positioning
    zIndex: 1003, // Even higher z-index to ensure turtle stays in front of button
    elevation: 10, // Android elevation to ensure it's on top
  },

  mainTurtleImage: {
    width: Math.min(width * 0.35, 150),
    height: Math.min(width * 0.35, 150),
    maxWidth: 150,
    maxHeight: 150,
    zIndex: 1003, // Ensure image itself has high z-index
    elevation: 10, // Android elevation
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
    backgroundColor: '#c2d1de', // Medium-light blue-gray background
    borderRadius: 4,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: '#5BA3B8', // Consistent app-wide color
    borderRadius: 4,
  },

  // Disabled Button Styles
  disabledButton: {
    backgroundColor: colors.gray[300], // Same gray as age screen
    shadowOpacity: 0, // Remove shadow when disabled
    elevation: 0, // Remove elevation when disabled
  },

  disabledButtonText: {
    color: colors.gray[500], // Same gray text as age screen
  },

  // Loader container
  loaderContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(30, 114, 109, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing[4], // 8px
  },

  // Tick animation styles
  tickContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#5BA3B8', // Consistent app-wide color
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
    bottom: 0, // Standardize placement to bottom
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: spacing[12], // 24px
    paddingBottom: 30, // Standardize bottom padding with other screens
    paddingTop: spacing[8], // Add top padding for separation
    backgroundColor: 'transparent',
    zIndex: 1004, // Higher than turtle to ensure button area is clickable
    elevation: 11, // Android elevation
  },

});