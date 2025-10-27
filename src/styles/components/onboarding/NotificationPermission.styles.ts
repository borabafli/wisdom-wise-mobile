import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';
import { shadows } from '../../tokens/shadows';

const { width, height } = Dimensions.get('window');

export const notificationPermissionStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF8F8',
  },

  safeArea: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[20],
  },

  loadingText: {
    ...typography.body.lg,
    color: colors.teal[600],
    textAlign: 'center',
  },

  backButton: {
    position: 'absolute',
    top: spacing[8],
    left: spacing[8],
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },

  contentContainer: {
    flex: 1,
    paddingTop: spacing[16],
    paddingHorizontal: spacing[16],
  },

  headerContainer: {
    alignItems: 'center',
    marginBottom: spacing[12], // Move everything slightly up (was 16, now 12)
    paddingTop: spacing[16], // Move header up (was 24, now 16)
    paddingHorizontal: spacing[2], // Even less padding to sides for heading
  },

  mainTitle: {
    ...typography.heading.lg,
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: spacing[8],
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
    paddingHorizontal: spacing[8], // Less padding to give more width (was 24, now 8)
  },

  subtitle: {
    ...typography.body.md,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22, // Increase line height
    fontSize: 16, // Make subtext bigger (was 14)
    paddingHorizontal: spacing[4], // Less padding for subtitle
  },

  previewImageContainer: {
    alignItems: 'flex-start', // Move image to the left
    marginBottom: -spacing[24], // More negative margin for greater overlap
    marginLeft: -spacing[12], // Negative left margin to push image left
    paddingHorizontal: 0, // Remove all horizontal padding
    zIndex: 0, // Place image behind cards
    position: 'relative',
  },

  previewImage: {
    width: 360, // Further increased from 320
    height: 180, // Further increased from 160
  },

  remindersContainer: {
    gap: spacing[2], // Even more reduced gap between cards (was 4, now 2)
    paddingBottom: spacing[4], // Add some padding at bottom
    paddingTop: spacing[5], // Slightly increased to move cards down a bit
    marginBottom: spacing[2], // Minimal margin before buttons
    zIndex: 1, // Ensure cards appear above image
    position: 'relative',
  },

  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4B5563',
    borderRadius: 10,
    padding: spacing[6], // Further reduced padding (was 8, now 6)
    minHeight: 38, // Further reduced height (was 42, now 38)
    marginHorizontal: spacing[4],
    ...shadows.components.onboardingCard,
  },

  reminderIconContainer: {
    width: 32, // Increased from 24 to make icons bigger
    height: 32, // Increased from 24 to make icons bigger
    borderRadius: 16,
    backgroundColor: '#6B7280',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[8], // Increased back from 6
  },

  reminderContent: {
    flex: 1,
    marginRight: spacing[6], // Reduced from 8
  },

  reminderLabel: {
    ...typography.heading.sm,
    color: '#FFFFFF',
    marginBottom: 0, // Remove bottom margin
    fontSize: 12, // Reduced from 13
    fontWeight: '600',
  },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0, // Removed margin to make more condensed
  },

  reminderTime: {
    ...typography.body.md,
    color: '#FFFFFF',
    marginRight: spacing[3], // Reduced from 4
    fontSize: 22, // Even bigger font size
    fontWeight: '800', // Extra bold
    fontFamily: typography.fontFamily.alanSansSemiBold, // Use bold font family
  },

  reminderDescription: {
    ...typography.body.sm,
    color: '#D1D5DB',
    fontSize: 10, // Further reduced from 11 for more condensed look
    lineHeight: 12, // Tighter line height
  },

  // Custom Toggle Styles
  customToggleTrack: {
    width: 52,          // Increased track width from 44
    height: 30,         // Increased track height from 26
    borderRadius: 15,   // Half of height for pill shape
    justifyContent: 'center',
    position: 'relative',
  },

  customToggleTrackInactive: {
    backgroundColor: '#374151', // Dark gray when off
  },

  customToggleTrackActive: {
    backgroundColor: '#5BA3B8', // Brand color when on
  },

  customToggleThumb: {
    width: 22,          // Decreased circle size from 26
    height: 22,         // Decreased circle size from 26
    borderRadius: 11,   // Half of width/height for perfect circle
    backgroundColor: '#4B5563', // Changed to match card color
    position: 'absolute',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },

  addReminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4B5563',
    borderRadius: 12,
    padding: spacing[10],
    minHeight: 48,
    marginHorizontal: spacing[4],
    ...shadows.md,
  },

  addIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6B7280',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[8],
  },

  addContent: {
    flex: 1,
  },

  addLabel: {
    ...typography.heading.sm,
    color: '#FFFFFF',
    marginBottom: spacing[2],
    fontSize: 14,
    fontWeight: '600',
  },

  addDescription: {
    ...typography.body.sm,
    color: '#D1D5DB',
    fontSize: 12,
    lineHeight: 16,
  },

  bottomSection: {
    paddingBottom: 30, // Match other onboarding screens
    paddingTop: spacing[24], // Increased from 4 (8px) to 24 (48px) for more space
    alignItems: 'center',
    zIndex: 10, // Bring button to foreground
    marginTop: 'auto', // Push buttons to bottom
  },

  nextButton: {
    backgroundColor: '#5BA3B8', // Changed to brand blue color
    paddingVertical: spacing[6], // Reduced from 10
    paddingHorizontal: spacing[20], // Reduced from 32
    borderRadius: 20, // Reduced from 24
    minWidth: 80, // Reduced from 100
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
    shadowColor: '#5BA3B8', // Changed shadow to match button color
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25, // Increased shadow opacity
    shadowRadius: 8,
    elevation: 4,
  },

  nextButtonText: {
    ...typography.body.md,
    fontWeight: '600',
    color: '#FFFFFF', // Changed to white text for blue button
    fontSize: 14, // Increased from 12
  },

  skipButton: {
    backgroundColor: 'transparent',
    paddingVertical: spacing[4], // Smaller padding for secondary action
    paddingHorizontal: spacing[16],
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing[3], // Small gap between buttons
  },

  skipButtonText: {
    ...typography.body.md,
    fontWeight: '500',
    color: '#6B7280', // Subtle gray for secondary action
    fontSize: 14,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  timePickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing[12], // Further reduced for more condensed
    margin: spacing[12], // Further reduced for more condensed
    minWidth: 280, // Reduced width for more compact design
    alignItems: 'center',
  },

  wheelTimePickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: spacing[16],
    margin: spacing[16],
    minWidth: 320,
    alignItems: 'center',
    // Enhanced shadow for the new wheel picker
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },

  modalTitle: {
    ...typography.heading.md,
    color: '#1F2937',
    marginBottom: spacing[8], // Further reduced for condensed design
    fontSize: 15, // Further reduced
    fontWeight: '600',
    fontFamily: typography.fontFamily.alanSansSemiBold,
  },

  timePickerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginVertical: spacing[8], // Further reduced for condensed design
  },

  timeColumn: {
    alignItems: 'center',
    width: 70, // Reduced width for more condensed design
  },

  columnLabel: {
    ...typography.body.sm,
    color: '#6B7280',
    marginBottom: spacing[6], // Reduced for condensed design
    fontSize: 11, // Smaller font
    fontWeight: '500',
    fontFamily: typography.fontFamily.alanSansSemiBold,
  },

  timeScroll: {
    maxHeight: 100, // Reduced height for more condensed design
    width: 70, // Match reduced column width
  },

  timeSeparator: {
    ...typography.heading.lg,
    color: '#1F2937',
    marginHorizontal: spacing[12], // Reduced spacing
    marginTop: spacing[16], // Reduced margin
    fontSize: 20, // Reduced size
    fontWeight: '600',
    fontFamily: typography.fontFamily.alanSansSemiBold,
  },

  timeOption: {
    paddingVertical: spacing[6], // Reduced for more condensed design
    paddingHorizontal: spacing[4], // Reduced padding
    borderRadius: 8, // Consistent radius with other buttons
    marginVertical: spacing[1],
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 45, // Further reduced width
    width: 45, // Further reduced width
    flexDirection: 'row',
  },

  selectedTimeOption: {
    backgroundColor: '#5BA3B8', // Changed to brand blue color
  },

  timeOptionText: {
    color: '#1F2937',
    fontSize: 13, // Further reduced for condensed design
    fontWeight: '600',
    fontFamily: typography.fontFamily.alanSansSemiBold,
    textAlign: 'center',
    numberOfLines: 1,
    lineHeight: 13,
  },

  selectedTimeOptionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontFamily: typography.fontFamily.alanSansSemiBold, // Using AlanSans-SemiBold font from typography tokens
  },

  modalButtons: {
    flexDirection: 'row',
    marginTop: spacing[8], // Further reduced for condensed design
    gap: spacing[6], // Further reduced gap
  },

  modalButton: {
    paddingVertical: spacing[6], // Reduced for more condensed design
    paddingHorizontal: spacing[12], // Reduced padding
    borderRadius: 8, // Consistent radius with other buttons
    minWidth: 70, // Reduced minimum width
    alignItems: 'center',
  },

  cancelButton: {
    backgroundColor: '#E5E7EB',
  },

  confirmButton: {
    backgroundColor: '#5BA3B8', // Changed to brand blue color
  },

  cancelButtonText: {
    ...typography.body.md,
    color: '#6B7280',
    fontWeight: '500',
    fontSize: 13, // Reduced font size
    fontFamily: typography.fontFamily.alanSansSemiBold,
  },

  confirmButtonText: {
    ...typography.body.md,
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13, // Reduced font size
    fontFamily: typography.fontFamily.alanSansSemiBold,
  },

  // Bottom Sheet Styles
  bottomSheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  bottomSheetBackdrop: {
    flex: 1,
  },

  bottomSheetContainer: {
    backgroundColor: '#EDF8F8', // Match main screen background
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: spacing[16],
    paddingBottom: spacing[20],
    paddingTop: spacing[8],
    minHeight: 240, // Much smaller min height
    maxHeight: '50%', // Reduced max height
  },

  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing[16],
  },

  bottomSheetTitle: {
    ...typography.heading.md,
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: spacing[12], // Less margin
    fontSize: 16, // Smaller title
    fontWeight: '600',
    fontFamily: typography.fontFamily.alanSansSemiBold,
  },

  bottomSheetButtons: {
    gap: spacing[4], // Move cancel closer to save button
    marginTop: spacing[12], // Less margin
  },

  bottomSheetSaveButton: {
    backgroundColor: '#5BA3B8', // Same as continue button
    paddingVertical: spacing[6], // Match continue button
    paddingHorizontal: spacing[16], // Less horizontal padding for narrower button
    borderRadius: 20, // Match continue button
    minWidth: 60, // Narrower button
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
    shadowColor: '#5BA3B8', // Match continue button shadow
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25, // Match continue button shadow
    shadowRadius: 8,
    elevation: 4,
  },

  bottomSheetSaveText: {
    ...typography.body.md,
    color: '#FFFFFF', // Match continue button text
    fontWeight: '600',
    fontSize: 14, // Match continue button text size
  },

  bottomSheetCancelButton: {
    backgroundColor: 'transparent',
    paddingVertical: spacing[6], // Match save button padding
    paddingHorizontal: spacing[16], // Match save button padding
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomSheetCancelText: {
    ...typography.body.md,
    color: '#6B7280',
    fontWeight: '500',
    fontSize: 14, // Same font size as save button
    fontFamily: typography.fontFamily.alanSansSemiBold,
  },
});