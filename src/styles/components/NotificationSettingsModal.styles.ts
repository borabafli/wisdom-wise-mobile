import { StyleSheet } from 'react-native';
import { colors, spacing, typography, shadows } from '../tokens';

export const notificationSettingsModalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    ...shadows.large,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing['5'],
    paddingTop: spacing['5'],
    paddingBottom: spacing['4'],
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
  },
  title: {
    ...typography.heading.h3,
    color: colors.text.primary,
  },
  closeButton: {
    padding: spacing['2'],
  },
  scrollView: {
    flex: 1,
  },
  loadingText: {
    ...typography.body.medium,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingVertical: spacing['8'],
  },
  permissionBanner: {
    backgroundColor: '#fef3c7',
    padding: spacing['4'],
    margin: spacing['4'],
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
  },
  section: {
    paddingHorizontal: spacing['5'],
    paddingVertical: spacing['4'],
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
    marginBottom: spacing['3'],
  },
  sectionTitle: {
    ...typography.heading.h4,
    color: colors.text.primary,
  },
  sectionDescription: {
    ...typography.body.small,
    color: colors.text.secondary,
    marginBottom: spacing['3'],
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing['3'],
    gap: spacing['4'],
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    ...typography.body.medium,
    color: colors.text.primary,
    marginBottom: spacing['1'],
  },
  settingDescription: {
    ...typography.body.small,
    color: colors.text.secondary,
  },
  infoSection: {
    backgroundColor: colors.background.secondary,
    padding: spacing['4'],
    margin: spacing['4'],
    borderRadius: 12,
  },
  infoText: {
    ...typography.body.small,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  footer: {
    padding: spacing['5'],
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    backgroundColor: '#ffffff',
  },
  saveButton: {
    backgroundColor: '#0f766e',
    paddingVertical: spacing['4'],
    borderRadius: 12,
    alignItems: 'center',
    ...shadows.small,
  },
  saveButtonText: {
    ...typography.body.mediumBold,
    color: '#ffffff',
  },
});
