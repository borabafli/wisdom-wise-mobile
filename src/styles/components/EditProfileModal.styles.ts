/**
 * EditProfileModal Component Styles
 * Separated from component for better maintainability
 */

import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

const { width } = Dimensions.get('window');

export const editProfileModalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  keyboardView: {
    flex: 1,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[20],
    paddingVertical: spacing[16],
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 246, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    fontFamily: typography.fontFamily.primary,
  },
  closeButton: {
    padding: spacing[4],
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: spacing[20],
    paddingTop: spacing[24],
  },
  
  // Profile Icon
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing[20],
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },

  // Description
  description: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing[24],
    lineHeight: 24,
    fontFamily: typography.fontFamily.primary,
  },

  // Form
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: spacing.therapy.lg,
  },
  inputLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    marginBottom: spacing.therapy.xs,
    fontFamily: typography.fontFamily.primary,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    ...shadows.sm,
  },
  inputError: {
    borderColor: '#ef4444',
    borderWidth: 1.5,
  },
  textInput: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    paddingHorizontal: spacing[16],
    paddingVertical: spacing[16],
    fontFamily: typography.fontFamily.primary,
    minHeight: 48,
  },

  // Error Messages
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.therapy.xs,
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    color: '#ef4444',
    marginLeft: spacing.therapy.xs,
    fontFamily: typography.fontFamily.primary,
  },
  generalErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: spacing.therapy.md,
    paddingVertical: spacing.therapy.sm,
    borderRadius: 8,
    marginTop: spacing.therapy.md,
  },
  generalErrorText: {
    fontSize: typography.fontSize.sm,
    color: '#ef4444',
    marginLeft: spacing.therapy.xs,
    fontFamily: typography.fontFamily.primary,
  },

  // Actions
  actions: {
    flexDirection: 'row',
    paddingVertical: spacing.therapy.lg,
    paddingHorizontal: 0,
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  
  // Cancel Button
  cancelButton: {
    flex: 1,
    marginRight: spacing.therapy.md,
    borderRadius: 12,
    overflow: 'hidden',
    ...shadows.sm,
  },
  cancelButtonGradient: {
    paddingVertical: spacing[16],
    paddingHorizontal: spacing[16],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  cancelButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.secondary,
    fontFamily: typography.fontFamily.primary,
  },

  // Save Button
  saveButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
    ...shadows.sm,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonGradient: {
    paddingVertical: spacing[16],
    paddingHorizontal: spacing[16],
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: 48,
  },
  saveButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: 'white',
    marginLeft: spacing.therapy.xs,
    fontFamily: typography.fontFamily.primary,
  },
});