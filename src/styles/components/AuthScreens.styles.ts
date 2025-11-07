/**
 * WisdomWise Design System - Auth Screens Styles
 * Mindful, calming authentication interface following style guide
 */

import { StyleSheet } from 'react-native';
import { colors, gradients, shadows, spacing, typography } from '../tokens';

export const authScreenStyles = StyleSheet.create({
  // Main Container
  safeArea: {
    flex: 1,
    backgroundColor: '#EDF8F8', // Match onboarding background
  },

  scrollContainer: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.layout.screenPadding,
    paddingVertical: spacing.therapy.sm,
    paddingBottom: spacing.therapy.xl, // Extra padding at bottom for keyboard
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.layout.screenPadding,
  },

  // Background Elements
  backgroundImage: {
    position: 'absolute',
    top: 40,
    right: -30,
    width: 180,
    height: 180,
    opacity: 0.2,
    tintColor: colors.teal[500],
  },

  // Header Section
  headerContainer: {
    alignItems: 'center',
    marginBottom: spacing.therapy.lg, // Reduced from xl
  },

  headerContainerSignUp: {
    alignItems: 'center',
    marginBottom: spacing.therapy.md, // Reduced from xl
    marginTop: spacing.therapy.sm, // Reduced from md
  },

  turtleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[12], // Reduced from 16
  },

  turtleImage: {
    width: 100, // Reduced from 120
    height: 100, // Reduced from 120
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937', // Match onboarding heading color
    marginBottom: spacing.therapy.sm,
    fontFamily: 'Ubuntu-Bold', // Match onboarding font
    textAlign: 'center',
    lineHeight: 38,
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#1F2937', // Match onboarding heading color
    textAlign: 'center',
    lineHeight: 28,
    fontFamily: 'Ubuntu-Medium', // Match onboarding font
    paddingHorizontal: spacing.therapy.lg,
    opacity: 0.9,
  },

  // Form Section
  formContainer: {
    marginTop: spacing.therapy.sm,
  },

  inputGroup: {
    marginBottom: spacing.therapy.sm, // Reduced margin
  },

  nameFieldsRow: {
    flexDirection: 'row',
    gap: spacing.therapy.sm,
  },

  nameFieldContainer: {
    flex: 1,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
    marginBottom: spacing.therapy.xs,
    fontFamily: 'Inter',
  },

  textInput: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 16, // Increased from 12 for softer geometry
    paddingHorizontal: spacing.therapy.md, // Reduced padding
    paddingVertical: spacing.therapy.sm, // Reduced padding
    fontSize: 16,
    fontFamily: 'Inter',
    color: colors.text.primary,
    ...shadows.sm,
    minHeight: 48, // Reduced height
  },

  textInputFocused: {
    borderColor: '#5BA3B8', // Primary blue-teal from style guide
    backgroundColor: colors.white,
    ...shadows.md,
    transform: [{ scale: 1.02 }], // Subtle scale for focus
  },

  // Password Strength Indicator
  passwordStrengthContainer: {
    marginTop: spacing.therapy.xs,
  },

  passwordStrengthWeak: {
    color: colors.semantic.error,
    fontSize: 12,
    fontFamily: 'Inter',
  },

  passwordStrengthMedium: {
    color: colors.semantic.warning,
    fontSize: 12,
    fontFamily: 'Inter',
  },

  passwordStrengthStrong: {
    color: colors.semantic.success,
    fontSize: 12,
    fontFamily: 'Inter',
  },

  // Privacy Policy Checkbox
  checkboxContainer: {
    marginTop: spacing.therapy.sm, // Reduced margin
    paddingHorizontal: spacing.therapy.xs,
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6, // Softer corners
    borderWidth: 2,
    borderColor: '#E1E8ED', // Medium gray from style guide
    marginRight: spacing.therapy.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },

  checkboxChecked: {
    backgroundColor: '#5BA3B8', // Primary blue-teal from style guide
    borderColor: '#5BA3B8',
  },

  checkboxText: {
    flex: 1,
    fontSize: 14, // Slightly larger for better readability
    color: colors.text.secondary,
    lineHeight: 20,
    fontFamily: 'Inter',
  },

  privacyPolicyLink: {
    color: '#5BA3B8', // Primary blue-teal from style guide
    textDecorationLine: 'underline',
    fontWeight: '500',
  },

  checkmark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },

  // Primary Button
  primaryButton: {
    backgroundColor: '#5BA3B8', // Consistent app-wide button color
    borderRadius: 18, // Match onboarding button radius
    paddingVertical: spacing.therapy.md,
    paddingHorizontal: 32,
    marginTop: spacing.therapy.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },

  primaryButtonDisabled: {
    backgroundColor: '#A8D5E8',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Ubuntu-Medium', // Match onboarding button font
    letterSpacing: 0.2,
  },

  // Google Sign-In Button
  googleButton: {
    backgroundColor: colors.white,
    borderRadius: 18, // Match primary button border radius for consistency
    paddingVertical: spacing.therapy.md, // Reduced padding
    paddingHorizontal: spacing.therapy.lg,
    marginTop: spacing.therapy.sm, // Reduced margin
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48, // Reduced height
    borderWidth: 1,
    borderColor: '#E1E8ED',
    flexDirection: 'row',
  },

  googleButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter',
    marginLeft: spacing.therapy.sm,
  },

  googleIcon: {
    width: 20,
    height: 20,
  },

  // Divider for "or" section
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.therapy.lg,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E1E8ED',
  },

  dividerText: {
    marginHorizontal: spacing.therapy.md,
    fontSize: 14,
    color: colors.text.secondary,
    fontFamily: 'Inter',
  },

  // Footer Section
  footerContainer: {
    alignItems: 'center',
    marginTop: spacing.therapy.md, // Reduced margin
    paddingBottom: spacing.therapy.md, // Reduced padding
  },

  footerText: {
    fontSize: 16,
    color: '#5BA3B8', // Primary blue-teal from style guide
    fontWeight: '500',
    fontFamily: 'Inter',
    textAlign: 'center',
  },

  skipButton: {
    marginTop: spacing.therapy.md,
  },

  skipButtonText: {
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: '500',
    fontFamily: 'Inter',
    textAlign: 'center',
  },

  // Gesture and Animation
  touchableOpacity: {
    // activeOpacity is handled by TouchableOpacity component, not style
  },

  // Hero Gradient Background (Alternative option)
  heroGradientContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    opacity: 0.03,
  },

  // Calming Visual Elements - REMOVED for cleaner look matching onboarding
  decorativeElement: {
    display: 'none', // Hide background bubbles
  },

  decorativeElement2: {
    display: 'none', // Hide background bubbles
  },

  // Responsive adjustments
  compactContainer: {
    paddingHorizontal: spacing.components.containerPadding,
  },

  compactTitle: {
    fontSize: typography.textStyles.h2.fontSize,
  },

  compactSubtitle: {
    fontSize: typography.textStyles.caption.fontSize,
  },
});

export const authAnimations = {
  fadeIn: {
    opacity: 0,
    transform: [{ translateY: 20 }],
  },
  fadeInActive: {
    opacity: 1,
    transform: [{ translateY: 0 }],
  },
  buttonPress: {
    scale: 0.98,
  },
  inputFocus: {
    scale: 1.02,
  },

  // Verification Screen Styles
  emailText: {
    color: colors.teal[600],
    fontWeight: '600',
    fontFamily: typography.fontFamily.secondary,
  },
  instructionsContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: colors.teal[50],
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.teal[100],
  },
  instructionsText: {
    fontSize: 16,
    color: colors.text.primary,
    fontFamily: typography.fontFamily.secondary,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  instructionsSubtext: {
    fontSize: 14,
    color: colors.text.secondary,
    fontFamily: typography.fontFamily.primary,
    textAlign: 'center',
    lineHeight: 20,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.teal[300],
    marginTop: 12,
  },
  secondaryButtonText: {
    color: colors.teal[600],
    fontSize: 16,
    fontWeight: '600',
    fontFamily: typography.fontFamily.secondary,
    textAlign: 'center',
  },
  secondaryButtonDisabled: {
    borderColor: colors.gray[300],
    backgroundColor: colors.gray[50],
  },
};

export type AuthScreenStyles = typeof authScreenStyles;