import { StyleSheet, Dimensions } from 'react-native';
import { colors, spacing, typography, shadows } from '../tokens';

const { width, height } = Dimensions.get('window');

export const featureRequestModalStyles = StyleSheet.create({
  // Background Image
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  // Main Container
  safeArea: {
    flex: 1,
  },

  keyboardContainer: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['6'], // Increased from spacing['4'] to give more space from status bar
    paddingBottom: spacing['3'],
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  headerPlaceholder: {
    width: 44,
    height: 44,
  },

  // Scroll Content
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing['8'],
  },

  // Content Container
  contentContainer: {
    flex: 1,
    paddingHorizontal: spacing['6'],
    paddingTop: spacing['8'],
  },

  // Icon Section
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing['6'],
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },

  // Title
  title: {
    fontSize: 28,
    fontFamily: typography.fontFamily.ubuntuBold,
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: spacing['4'],
  },

  // Description
  description: {
    fontSize: 16,
    fontFamily: typography.fontFamily.ubuntu,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing['8'],
    paddingHorizontal: spacing['4'],
  },

  // Input Section
  inputSection: {
    marginBottom: spacing['6'],
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(54, 101, 125, 0.15)',
    overflow: 'hidden',
    ...shadows.sm,
  },
  textInput: {
    fontSize: 16,
    fontFamily: typography.fontFamily.ubuntu,
    color: '#1F2937',
    padding: spacing['5'],
    minHeight: 140,
    maxHeight: 200,
    textAlignVertical: 'top',
  },

  // Input Footer
  inputFooter: {
    marginTop: spacing['2'],
    paddingHorizontal: spacing['2'],
  },
  characterCount: {
    fontSize: 13,
    fontFamily: typography.fontFamily.ubuntu,
    color: '#6B7280',
    textAlign: 'right',
  },
  characterCountError: {
    color: colors.semantic.error,
  },
  characterCountWarning: {
    color: colors.semantic.warning,
  },
  validationMessage: {
    fontSize: 12,
    fontFamily: typography.fontFamily.ubuntu,
    color: colors.semantic.error,
    marginTop: spacing['1'],
    textAlign: 'right',
  },

  // Info Box
  infoBox: {
    backgroundColor: 'rgba(209, 250, 229, 0.5)', // Soft mint background
    padding: spacing['4'],
    borderRadius: 12,
    borderWidth: 0,
    marginTop: spacing['4'],
  },
  infoText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.ubuntu,
    color: '#065f46', // Darker teal for better readability
    lineHeight: 19,
  },

  // Footer with Buttons
  footer: {
    paddingHorizontal: spacing['6'],
    paddingTop: spacing['5'],
    paddingBottom: spacing['10'], // Increased from spacing['8'] to give more space from bottom edge
    alignItems: 'center',
  },

  // Primary Button (matching onboarding style)
  primaryButton: {
    width: '100%',
    maxWidth: 280,
    height: 50,
    backgroundColor: '#36657d',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['3'],
  },
  primaryButtonDisabled: {
    backgroundColor: '#94a3b8',
    opacity: 0.6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.ubuntuBold,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },

  // Secondary Button (matching onboarding style)
  secondaryButton: {
    paddingVertical: spacing['3'],
    paddingHorizontal: spacing['6'],
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.ubuntuBold,
    color: '#6B7280',
    textDecorationLine: 'underline',
    textDecorationColor: '#6B7280',
  },

  // Success Screen
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing['8'],
  },
  successContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: spacing['8'],
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    ...shadows.lg,
  },
  successIconContainer: {
    marginBottom: spacing['6'],
  },
  successTurtle: {
    width: 120,
    height: 120,
  },
  successTitle: {
    fontSize: 26,
    fontFamily: typography.fontFamily.ubuntuBold,
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: spacing['3'],
  },
  successMessage: {
    fontSize: 16,
    fontFamily: typography.fontFamily.ubuntu,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 24,
  },
});
