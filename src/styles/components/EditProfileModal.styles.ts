import { StyleSheet } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

export const editProfileModalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(12, 30, 49, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[16],
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  keyboardAvoider: {
    width: '100%',
    maxWidth: 600,
    justifyContent: 'center',
  },
  modalCard: {
    borderRadius: 24,
    overflow: 'hidden',
    ...shadows.lg,
  },
  cardInner: {
    paddingHorizontal: spacing[16],
    paddingTop: spacing[16],
    paddingBottom: spacing[12],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[8],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    flex: 1,
  },
  headerIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(43, 71, 94, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(43, 71, 94, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconImage: {
    width: 32,
    height: 32,
  },
  headerTextGroup: {
    flex: 1,
    gap: spacing[1],
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: typography.fontWeight.semibold,
    color: '#2B475E',
    fontFamily: typography.fontFamily.primary,
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 12,
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
    fontSize: 13,
    lineHeight: 20,
    color: '#3C5262',
    fontFamily: typography.fontFamily.primary,
    marginBottom: spacing[12],
  },
  formScroll: {
    maxHeight: 240,
  },
  form: {
    gap: spacing[8],
    paddingBottom: spacing[4],
  },
  inputGroup: {
    gap: spacing[1],
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    fontFamily: typography.fontFamily.primary,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(43, 71, 94, 0.18)',
    ...shadows.sm,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  textInput: {
    fontSize: 14,
    color: colors.text.primary,
    paddingHorizontal: spacing[12],
    paddingVertical: spacing[8],
    fontFamily: typography.fontFamily.primary,
    minHeight: 36,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    marginTop: spacing[1],
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    fontFamily: typography.fontFamily.primary,
  },
  generalErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 10,
    paddingVertical: spacing[8],
    paddingHorizontal: spacing[10],
  },
  generalErrorText: {
    fontSize: 12,
    color: '#ef4444',
    fontFamily: typography.fontFamily.primary,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: spacing[8],
    marginTop: spacing[12],
  },
  cancelButton: {
    flex: 1,
    height: 42,
    paddingHorizontal: spacing[16],
    borderRadius: 14,
    backgroundColor: 'rgba(43, 71, 94, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: '#2B475E',
    fontFamily: typography.fontFamily.primary,
  },
  saveButton: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonGradient: {
    height: 42,
    paddingHorizontal: spacing[16],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    borderRadius: 14,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: colors.white,
    fontFamily: typography.fontFamily.primary,
  },
});
