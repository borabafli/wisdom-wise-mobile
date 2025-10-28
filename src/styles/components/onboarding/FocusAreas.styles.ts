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
    paddingBottom: spacing[8],
  },

  // Content Section
  contentContainer: {
    paddingHorizontal: spacing[24],
    paddingVertical: spacing[24],
    minHeight: '100%',
    justifyContent: 'center',
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
    paddingBottom: spacing[16],
    gap: spacing[4], // Reduced from spacing[8] (16px) to spacing[4] (8px) to bring buttons closer
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
    paddingVertical: 12, // Consistent with personal values
    width: width * 0.75, // Consistent width for all chips (75% of screen width)
    minHeight: 44, // Consistent height for all chips
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
    marginTop: spacing[12], // 24px - standardized spacing from content to button
    zIndex: 1000, // Absolute foreground
    position: 'relative',
  },

  continueButton: {
    paddingHorizontal: 48, // Standard padding to match other onboarding buttons
    minWidth: 240, // Standard width to match other onboarding buttons
    height: 48,
    backgroundColor: '#36657d', // Match notification screen button color
    borderRadius: 18, // Slightly less rounded
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

  continueButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.ubuntuBold, // Match selection buttons bold font
    color: '#FFFFFF', // Match notification screen button text color
    letterSpacing: 0.2,
  },
});