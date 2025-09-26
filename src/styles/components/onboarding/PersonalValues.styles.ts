import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';

const { width, height } = Dimensions.get('window');

export const personalValuesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  safeArea: {
    flex: 1,
  },

  // Content Section
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between', // Space content apart like Welcome screen
    paddingHorizontal: spacing[24], // 24px
    paddingVertical: spacing[24], // 24px - match Welcome screen
  },

  // Header
  headerContainer: {
    marginBottom: spacing[24], // 24px - optimized space for chips
    marginTop: spacing[8], // 8px - move title even higher
  },

  headline: {
    fontSize: 24, // H1 size from design principles
    fontFamily: typography.fontFamily.ubuntuBold,
    color: colors.teal[800],
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: spacing[16], // 16px - reduced space below title
  },

  bodyText: {
    fontSize: 16, // Large body
    fontFamily: typography.fontFamily.ubuntu,
    color: colors.gray[600],
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing[16], // 16px
    opacity: 0.9,
  },

  promptText: {
    fontSize: 18, // H3 size
    fontFamily: typography.fontFamily.ubuntuMedium,
    color: colors.teal[700],
    textAlign: 'center',
    lineHeight: 24,
  },

  // Values Selection (removed ScrollView styles)

  valuesContainer: {
    alignItems: 'center', // Center the chips
    justifyContent: 'center', // Center vertically in available space
    paddingHorizontal: spacing[16], // 16px horizontal padding
    paddingBottom: spacing[32], // 32px bottom padding to separate from button
    gap: spacing[8], // 8px gap between chips - reduced spacing
  },

  // Value Chips
  valueChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center the text
    backgroundColor: '#F8F9FA',
    borderWidth: 1.5,
    borderColor: colors.gray[300],
    borderRadius: 25, // Pill shape
    paddingHorizontal: 20,
    paddingVertical: 12, // Reduced vertical padding
    width: width * 0.75, // Consistent width for all chips (75% of screen width)
    minHeight: 44, // Slightly smaller consistent height
    shadowColor: colors.gray[400],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  selectedValueChip: {
    backgroundColor: colors.teal[50],
    borderColor: colors.teal[500],
    borderWidth: 2,
    shadowColor: colors.teal[300],
    shadowOpacity: 0.2,
    elevation: 4,
  },

  valueChipText: {
    fontSize: 16, // Large body
    fontFamily: typography.fontFamily.ubuntu,
    color: colors.gray[700],
    textAlign: 'center',
  },

  selectedValueChipText: {
    color: colors.teal[800],
    fontFamily: typography.fontFamily.ubuntuMedium,
  },

  // Checkmark
  checkmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.teal[500],
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
    paddingHorizontal: spacing[24], // 24px - match other onboarding pages
    paddingBottom: spacing[24], // 24px - match other onboarding pages
  },

  continueButton: {
    paddingHorizontal: 48, // Standard padding to match other onboarding buttons
    minWidth: 240, // Standard width to match other onboarding buttons
    height: 48,
    backgroundColor: colors.teal[500],
    borderRadius: 24, // Pill-shaped
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
    marginBottom: spacing[8], // 8px
  },

  disabledButton: {
    backgroundColor: colors.gray[300],
    shadowOpacity: 0,
    elevation: 0,
  },

  continueButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.ubuntuMedium,
    color: colors.white,
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