/**
 * Onboarding Paywall Screen Styles
 *
 * Minimal & calm therapeutic design for paywall
 * Soft colors, ample spacing, non-aggressive
 */

import { StyleSheet, Dimensions } from 'react-native';
import { spacing, typography, shadows } from '../tokens';

const { width, height } = Dimensions.get('window');

export const onboardingPaywallStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF8F8', // Soft teal background - matches onboarding
  },
  safeArea: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    // top and right are set dynamically in component for safe area
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    ...shadows.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing['4'],
    paddingBottom: spacing['8'],
  },

  // Header Section
  header: {
    alignItems: 'center',
    paddingTop: spacing['8'],
    paddingBottom: spacing['6'],
  },
  illustrationContainer: {
    width: 120,
    height: 120,
    marginBottom: spacing['6'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustration: {
    width: 100,
    height: 100,
    tintColor: '#5BA3B8', // Therapeutic teal
  },
  title: {
    fontFamily: typography.fontFamily.ubuntuBold,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
    color: '#1F2937', // Deep charcoal - matches onboarding
    textAlign: 'center',
    marginBottom: spacing['3'],
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: typography.fontFamily.ubuntuMedium,
    fontSize: 20,
    lineHeight: 28,
    color: '#1F2937', // Match title color
    textAlign: 'center',
    paddingHorizontal: spacing['4'],
    opacity: 0.9,
  },

  // Pricing Section
  pricingSection: {
    marginVertical: spacing['6'],
  },
  pricingCards: {
    flexDirection: 'row',
    gap: spacing['3'],
    marginBottom: spacing['6'],
  },

  // Features Section
  featuresSection: {
    marginVertical: spacing['4'],
    paddingHorizontal: spacing['2'],
  },
  featuresTitle: {
    fontFamily: typography.fontFamily.ubuntuBold,
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: spacing['4'],
    textAlign: 'center',
  },

  // CTA Section
  ctaSection: {
    marginTop: 'auto',
    paddingTop: spacing['6'],
  },
  primaryButton: {
    backgroundColor: '#5BA3B8', // Therapeutic teal - matches onboarding
    borderRadius: 18,
    paddingVertical: spacing['4'],
    paddingHorizontal: spacing['6'],
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    ...shadows.md,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontFamily: typography.fontFamily.ubuntuMedium,
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },

  // Restore Purchases Button - Required by Apple
  restoreButton: {
    marginTop: spacing['4'],
    paddingVertical: spacing['2'],
    alignItems: 'center',
  },
  restoreButtonText: {
    fontFamily: typography.fontFamily.ubuntu,
    fontSize: 14,
    color: '#6B7280',
    textDecorationLine: 'underline',
  },

  // Legal Text
  legalText: {
    fontFamily: typography.fontFamily.ubuntu,
    fontSize: 12,
    lineHeight: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: spacing['4'],
    paddingHorizontal: spacing['4'],
    opacity: 0.8,
  },

  // Loading Overlay
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing['6'],
    alignItems: 'center',
    ...shadows.lg,
  },
  loadingText: {
    fontFamily: typography.fontFamily.ubuntuMedium,
    fontSize: 16,
    color: '#1F2937',
    marginTop: spacing['4'],
  },
});

export default onboardingPaywallStyles;
