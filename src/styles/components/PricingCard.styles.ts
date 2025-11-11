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
    ...shadows.medium,
  },
  cardSelected: {
    borderColor: '#8B7FD9', // Calming purple
    backgroundColor: '#FFFFFF',
    ...shadows.large,
    transform: [{ scale: 1.02 }],
  },
  cardBestValue: {
    borderColor: '#6EC1B8', // Therapeutic teal
  },

  // Best Value Badge
  bestValueBadge: {
    position: 'absolute',
    top: -10,
    right: spacing['4'],
    backgroundColor: '#FFD700', // Gold
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['1'],
    borderRadius: 12,
    ...shadows.small,
  },
  bestValueText: {
    fontFamily: typography.fontFamily.display,
    fontSize: 11,
    fontWeight: '600',
    color: '#2D2644',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  // Content
  content: {
    alignItems: 'center',
  },
  planName: {
    fontFamily: typography.fontFamily.display,
    fontSize: 16,
    fontWeight: '600',
    color: '#2D2644',
    marginBottom: spacing['2'],
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: spacing['3'],
  },
  price: {
    fontFamily: typography.fontFamily.display,
    fontSize: 32,
    fontWeight: '700',
    color: '#8B7FD9', // Calming purple
    lineHeight: 38,
  },
  pricePeriod: {
    fontFamily: typography.fontFamily.body,
    fontSize: 14,
    color: '#6B6B8A',
  },
  trialBadge: {
    backgroundColor: '#F0EEFF',
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['1'],
    borderRadius: 8,
    marginBottom: spacing['2'],
  },
  trialText: {
    fontFamily: typography.fontFamily.body,
    fontSize: 13,
    color: '#8B7FD9',
  },
  savingsText: {
    fontFamily: typography.fontFamily.display,
    fontSize: 13,
    fontWeight: '600',
    color: '#6EC1B8', // Therapeutic teal
    marginTop: spacing['1'],
  },
  monthlyEquivalent: {
    fontFamily: typography.fontFamily.body,
    fontSize: 12,
    color: '#9B9BAA',
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
