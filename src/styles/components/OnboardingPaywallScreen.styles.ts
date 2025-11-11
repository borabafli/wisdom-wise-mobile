/**
 * Onboarding Paywall Screen Styles
 *
 * Minimal & calm therapeutic design for paywall
 * Soft colors, ample spacing, non-aggressive
 */

import { StyleSheet, Dimensions } from 'react-native';
import { colors, spacing, typography, shadows } from '../tokens';

const { width, height } = Dimensions.get('window');

export const onboardingPaywallStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F5FF', // Soft lavender background
  },
  safeArea: {
    flex: 1,
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
    tintColor: '#8B7FD9', // Calming purple
  },
  title: {
    fontFamily: typography.fontFamily.display,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '600',
    color: '#2D2644', // Deep purple-gray
    textAlign: 'center',
    marginBottom: spacing['3'],
  },
  subtitle: {
    fontFamily: typography.fontFamily.body,
    fontSize: 16,
    lineHeight: 24,
    color: '#6B6B8A', // Muted purple
    textAlign: 'center',
    paddingHorizontal: spacing['4'],
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
    fontFamily: typography.fontFamily.display,
    fontSize: 18,
    fontWeight: '600',
    color: '#2D2644',
    marginBottom: spacing['4'],
    textAlign: 'center',
  },

  // CTA Section
  ctaSection: {
    marginTop: 'auto',
    paddingTop: spacing['6'],
  },
  primaryButton: {
    backgroundColor: '#8B7FD9', // Calming purple
    borderRadius: 16,
    paddingVertical: spacing['4'],
    paddingHorizontal: spacing['6'],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontFamily: typography.fontFamily.display,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    marginTop: spacing['4'],
    paddingVertical: spacing['3'],
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontFamily: typography.fontFamily.secondary,
    fontSize: 16,
    color: '#6B6B8A',
  },

  // Legal Text
  legalText: {
    fontFamily: typography.fontFamily.body,
    fontSize: 12,
    lineHeight: 18,
    color: '#9B9BAA',
    textAlign: 'center',
    marginTop: spacing['4'],
    paddingHorizontal: spacing['4'],
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
    ...shadows.large,
  },
  loadingText: {
    fontFamily: typography.fontFamily.secondary,
    fontSize: 16,
    color: '#2D2644',
    marginTop: spacing['4'],
  },
});

export default onboardingPaywallStyles;
