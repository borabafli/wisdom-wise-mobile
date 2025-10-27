import { StyleSheet } from 'react-native';
import { colors, spacing, typography, shadows } from '../tokens';

export const notificationSettingsModalStyles = StyleSheet.create({
  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EDF8F8',
  },
  loadingText: {
    ...typography.body.medium,
    color: colors.teal[600],
    textAlign: 'center',
  },

  // Main Container
  safeArea: {
    flex: 1,
    backgroundColor: '#EDF8F8',
    paddingTop: spacing['28'],
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['4'],
    paddingTop: spacing['5'],
    backgroundColor: '#EDF8F8',
    borderBottomWidth: 0,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.heading.h3,
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing['2'],
  },
  headerPlaceholder: {
    width: 44,
    height: 44,
  },

  // ScrollView
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['8'],
  },

  // Permission Banner
  permissionBanner: {
    backgroundColor: '#fef3c7',
    padding: spacing['4'],
    marginHorizontal: spacing['5'],
    marginTop: spacing['4'],
    marginBottom: spacing['2'],
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing['3'],
  },
  permissionText: {
    ...typography.body.small,
    color: '#92400e',
    flex: 1,
    fontSize: 13,
  },
  enableButton: {
    backgroundColor: '#0f766e',
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['2'],
    borderRadius: 8,
  },
  enableButtonText: {
    ...typography.body.smallBold,
    color: '#ffffff',
    fontSize: 13,
  },

  // Preview Image
  previewImageContainer: {
    alignItems: 'center',
    marginTop: spacing['5'],
    marginBottom: spacing['4'],
    paddingHorizontal: spacing['6'],
  },
  previewImage: {
    width: 300,
    height: 150,
  },

  // Section
  section: {
    paddingHorizontal: spacing['5'],
    paddingTop: spacing['3'],
  },
  sectionHeader: {
    marginBottom: spacing['2'],
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: typography.fontFamily.alanSansSemiBold,
  },
  sectionDescription: {
    ...typography.body.medium,
    color: '#6B7280',
    marginBottom: spacing['4'],
    fontSize: 14,
    lineHeight: 20,
  },

  // Reminder Cards Container
  remindersContainer: {
    gap: spacing['3'],
    marginTop: spacing['2'],
  },

  // Individual Reminder Card
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4B5563',
    borderRadius: 10,
    padding: spacing['4'],
    minHeight: 80,
    marginHorizontal: spacing['1'],
    ...shadows.components.card,
  },
  reminderIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6B7280',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing['3'],
  },
  reminderContent: {
    flex: 1,
    marginRight: spacing['3'],
  },
  reminderLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: spacing['0.5'],
    fontFamily: typography.fontFamily.alanSansSemiBold,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing['0.5'],
  },
  timeDisplay: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: typography.fontFamily.alanSansSemiBold,
  },
  reminderDescription: {
    fontSize: 11,
    color: '#D1D5DB',
    lineHeight: 14,
  },

  // Custom Toggle
  customToggleTrack: {
    width: 52,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    position: 'relative',
  },
  customToggleTrackInactive: {
    backgroundColor: '#374151',
  },
  customToggleTrackActive: {
    backgroundColor: '#5BA3B8',
  },
  customToggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#4B5563',
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

  // Add Reminder Card
  addReminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6B7280',
    borderRadius: 10,
    padding: spacing['4'],
    minHeight: 70,
    marginTop: spacing['2'],
    marginHorizontal: spacing['1'],
    ...shadows.components.card,
  },
  addIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#5BA3B8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing['3'],
  },
  addContent: {
    flex: 1,
  },
  addLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: spacing['1'],
    fontFamily: typography.fontFamily.alanSansSemiBold,
  },
  addDescription: {
    fontSize: 11,
    color: '#D1D5DB',
    lineHeight: 14,
  },

  // Info Section
  infoSection: {
    backgroundColor: '#D8E9E9',
    padding: spacing['4'],
    marginHorizontal: spacing['5'],
    marginTop: spacing['5'],
    marginBottom: spacing['3'],
    borderRadius: 12,
  },
  infoText: {
    ...typography.body.small,
    color: '#1F2937',
    lineHeight: 18,
    fontSize: 12,
  },

  // Footer
  footer: {
    padding: spacing['14'],
    paddingTop: spacing['14'],
    paddingBottom: spacing['18'],
    backgroundColor: '#EDF8F8',
    borderTopWidth: 1,
    borderTopColor: '#D1D5DB',
  },
  saveButton: {
    backgroundColor: '#5BA3B8',
    paddingVertical: spacing['4'],
    borderRadius: 12,
    alignItems: 'center',
    ...shadows.small,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: typography.fontFamily.alanSansSemiBold,
  },

  // Time Picker Modal
  timePickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timePickerContainer: {
    backgroundColor: '#ffffff',
    borderRadius: spacing['4'],
    padding: spacing['5'],
    width: '85%',
    alignItems: 'center',
    ...shadows.medium,
  },
  timePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: spacing['4'],
    fontFamily: typography.fontFamily.alanSansSemiBold,
  },
  timePickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: spacing['5'],
    gap: spacing['3'],
  },
  timePickerButton: {
    flex: 1,
    paddingVertical: spacing['3'],
    borderRadius: spacing['3'],
    alignItems: 'center',
    backgroundColor: colors.gray[200],
  },
  timePickerButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
    fontFamily: typography.fontFamily.alanSansSemiBold,
  },
  timePickerSaveButton: {
    backgroundColor: '#5BA3B8',
  },
  timePickerSaveButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
