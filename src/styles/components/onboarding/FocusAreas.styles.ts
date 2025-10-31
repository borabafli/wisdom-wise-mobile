import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';

const { width } = Dimensions.get('window');

export const focusAreasStyles = StyleSheet.create({
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
    paddingHorizontal: spacing[24],
    paddingVertical: spacing[24],
    // Removed justifyContent: 'center' to prevent content jumping
  },

  // Header
  headerContainer: {
    paddingHorizontal: spacing[12], // 24px - reduced horizontal padding for headings
    marginBottom: spacing[12], // Reduced from 40px to 24px for tighter spacing
    marginTop: spacing[8], // 16px - standardized top margin
  },

  headline: {
    fontSize: 24, // H1 size from design principles
    fontFamily: typography.fontFamily.ubuntuBold,
    color: '#1F2937', // Match notification screen heading color
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: spacing[16], // 16px - space below title
  },

  promptText: {
    fontSize: 18, // H3 size
    fontFamily: typography.fontFamily.ubuntuMedium,
    color: '#1F2937', // Match notification screen heading color
    textAlign: 'center',
    lineHeight: 24,
  },

  // Focus Areas Selection
  areasContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[16],
    paddingBottom: spacing[8], // Reduced from 16px to 8px
    gap: spacing[2], // Reduced from 8px to 4px to bring buttons even closer
  },

  // Focus Area Chips
  areaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center the text
    backgroundColor: colors.white, // Completely white background
    borderWidth: 0, // No border
    borderRadius: 12, // Reduced from 24 to make corners less rounded
    paddingHorizontal: 20,
    paddingVertical: 10, // Reduced from 12px to 10px for more compact chips
    width: width * 0.75, // Consistent width for all chips (75% of screen width)
    minHeight: 42, // Reduced from 44px to 42px for slightly smaller chips
    // Remove all shadows to prevent fade-in artifacts
  },

  selectedAreaChip: {
    backgroundColor: '#437690', // Selected state color
    borderColor: '#437690',
    borderWidth: 2,
    shadowColor: colors.teal[500],
    shadowOpacity: 0.25,
    elevation: 6,
  },

  areaChipText: {
    fontSize: 16, // Large body
    fontFamily: typography.fontFamily.ubuntu, // Use Ubuntu regular for lighter font
    color: colors.gray[700],
    textAlign: 'center',
  },

  selectedAreaChipText: {
    color: '#FFFFFF', // Match notification screen button text color
    fontFamily: typography.fontFamily.ubuntuBold, // Use Ubuntu Bold for more bold font
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
  },

  continueButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.ubuntuBold, // Match selection buttons bold font
    color: '#FFFFFF', // Match notification screen button text color
    letterSpacing: 0.2,
  },
});