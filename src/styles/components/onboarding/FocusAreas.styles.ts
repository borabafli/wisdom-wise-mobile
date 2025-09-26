import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';

const { width } = Dimensions.get('window');

export const focusAreasStyles = StyleSheet.create({
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
    justifyContent: 'space-between', // Space content apart like other onboarding screens
    paddingHorizontal: spacing[24], // 24px
    paddingVertical: spacing[24], // 24px - match other onboarding screens
  },

  // Header
  headerContainer: {
    marginBottom: spacing[24], // 24px - optimized space for chips
    marginTop: spacing[8], // 8px - move title higher
  },

  headline: {
    fontSize: 24, // H1 size from design principles
    fontFamily: typography.fontFamily.ubuntuBold,
    color: colors.teal[800],
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: spacing[16], // 16px - space below title
  },

  promptText: {
    fontSize: 18, // H3 size
    fontFamily: typography.fontFamily.ubuntuMedium,
    color: colors.teal[700],
    textAlign: 'center',
    lineHeight: 24,
  },

  // Focus Areas Selection
  areasContainer: {
    alignItems: 'center', // Center the chips
    justifyContent: 'center', // Center vertically in available space
    paddingHorizontal: spacing[16], // 16px horizontal padding
    paddingBottom: spacing[32], // 32px bottom padding to separate from button
    gap: spacing[8], // 8px gap between chips - consistent with personal values
  },

  // Focus Area Chips
  areaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center the text
    backgroundColor: '#F8F9FA',
    borderWidth: 1.5,
    borderColor: colors.gray[300],
    borderRadius: 25, // Pill shape
    paddingHorizontal: 20,
    paddingVertical: 12, // Consistent with personal values
    width: width * 0.75, // Consistent width for all chips (75% of screen width)
    minHeight: 44, // Consistent height for all chips
    shadowColor: colors.gray[400],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  selectedAreaChip: {
    backgroundColor: colors.teal[50],
    borderColor: colors.teal[500],
    borderWidth: 2,
    shadowColor: colors.teal[300],
    shadowOpacity: 0.2,
    elevation: 4,
  },

  areaChipText: {
    fontSize: 16, // Large body
    fontFamily: typography.fontFamily.ubuntu,
    color: colors.gray[700],
    textAlign: 'center',
  },

  selectedAreaChipText: {
    color: colors.teal[800],
    fontFamily: typography.fontFamily.ubuntuMedium,
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
  },

  continueButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.ubuntuMedium,
    color: colors.white,
    letterSpacing: 0.2,
  },
});