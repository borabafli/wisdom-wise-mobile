/**
 * Pricing Card Styles
 *
 * Individual pricing card component styles
 * Minimal, calm, therapeutic design
 */

import { StyleSheet } from 'react-native';
import { colors, spacing, typography, shadows } from '../tokens';

export const pricingCardStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: spacing['5'],
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.md,
  },
  cardSelected: {
    borderColor: '#5BA3B8', // Therapeutic teal - matches onboarding
    backgroundColor: '#FFFFFF',
    ...shadows.lg,
    transform: [{ scale: 1.02 }],
  },
  cardBestValue: {
    borderColor: '#5BA3B8', // Therapeutic teal
  },

  // Best Value Badge
  bestValueBadge: {
    position: 'absolute',
    top: -10,
    right: spacing['4'],
    backgroundColor: '#4ADE80', // Soft green for success
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['1'],
    borderRadius: 12,
    ...shadows.sm,
  },
  bestValueText: {
    fontFamily: typography.fontFamily.ubuntuBold,
    fontSize: 11,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  // Content
  content: {
    alignItems: 'center',
  },
  planName: {
    fontFamily: typography.fontFamily.ubuntuBold,
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: spacing['2'],
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: spacing['3'],
  },
  price: {
    fontFamily: typography.fontFamily.ubuntuBold,
    fontSize: 32,
    fontWeight: '700',
    color: '#5BA3B8', // Therapeutic teal - matches onboarding
    lineHeight: 38,
  },
  pricePeriod: {
    fontFamily: typography.fontFamily.ubuntu,
    fontSize: 14,
    color: '#6B7280',
  },
  trialBadge: {
    backgroundColor: '#D4E8E4', // Soft teal background
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['1'],
    borderRadius: 8,
    marginBottom: spacing['2'],
  },
  trialText: {
    fontFamily: typography.fontFamily.ubuntuMedium,
    fontSize: 13,
    color: '#5BA3B8',
  },
  savingsText: {
    fontFamily: typography.fontFamily.ubuntuBold,
    fontSize: 13,
    fontWeight: '700',
    color: '#4ADE80', // Soft green for savings
    marginTop: spacing['1'],
  },
  monthlyEquivalent: {
    fontFamily: typography.fontFamily.ubuntu,
    fontSize: 12,
    color: '#6B7280',
    marginTop: spacing['1'],
  },

  // Loading State
  cardLoading: {
    opacity: 0.6,
  },
  loadingIndicator: {
    marginVertical: spacing['2'],
  },
});

export default pricingCardStyles;
