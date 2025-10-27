import { StyleSheet } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

export const editProfileModalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(12, 30, 49, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[20],
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  keyboardAvoider: {
    width: '100%',
    maxWidth: 600,
    flex: 1,
  },
  modalCard: {
    borderRadius: 28,
    overflow: 'hidden',
    ...shadows.lg,
  },
  cardInner: {
    paddingHorizontal: spacing[20],
    paddingTop: spacing[20],
    paddingBottom: spacing[16],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[12],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    flex: 1,
  },
  headerIconBadge: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: 'rgba(43, 71, 94, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(43, 71, 94, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconImage: {
    width: 40,
    height: 40,
  },
  headerTextGroup: {
    flex: 1,
    gap: spacing[1],
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: typography.fontWeight.semibold,
    color: '#2B475E',
    fontFamily: typography.fontFamily.primary,
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#577084',
    fontFamily: typography.fontFamily.primary,
    letterSpacing: 0.2,
  },
  closeButton: {
    padding: spacing[2],
    borderRadius: 12,
    backgroundColor: 'rgba(43, 71, 94, 0.08)',
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#3C5262',
    fontFamily: typography.fontFamily.primary,
    marginBottom: spacing[16],
  },
  formScroll: {
    maxHeight: 280,
  },
  form: {
    gap: spacing[12],
    paddingBottom: spacing[8],
  },
  inputGroup: {
    gap: spacing[2],
  },
  inputLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    fontFamily: typography.fontFamily.primary,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(43, 71, 94, 0.18)',
    ...shadows.sm,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  textInput: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    paddingHorizontal: spacing[16],
    paddingVertical: spacing[8],
    fontFamily: typography.fontFamily.primary,
    minHeight: 40,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    color: '#ef4444',
    fontFamily: typography.fontFamily.primary,
  },
  generalErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    paddingVertical: spacing[12],
    paddingHorizontal: spacing[12],
  },
  generalErrorText: {
    fontSize: typography.fontSize.sm,
    color: '#ef4444',
    fontFamily: typography.fontFamily.primary,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: spacing[12],
    marginTop: spacing[16],
  },
  cancelButton: {
    flex: 1,
    height: 48,
    paddingHorizontal: spacing[20],
    borderRadius: 16,
    backgroundColor: 'rgba(43, 71, 94, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: '#2B475E',
    fontFamily: typography.fontFamily.primary,
  },
  saveButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonGradient: {
    height: 48,
    paddingHorizontal: spacing[20],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    borderRadius: 16,
  },
  saveButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.white,
    fontFamily: typography.fontFamily.primary,
  },
});
