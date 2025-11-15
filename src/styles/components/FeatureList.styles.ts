/**
 * Feature List Styles
 *
 * Styles for premium features list display
 */

import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../tokens';

export const featureListStyles = StyleSheet.create({
  container: {
    gap: spacing['4'], // Increased spacing between features
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align to top for multi-line text
    gap: spacing['3'],
    paddingHorizontal: spacing['2'], // Add side padding
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2, // Align icon with first line of text
  },
  featureText: {
    flex: 1,
    fontFamily: typography.fontFamily.ubuntu,
    fontSize: 15,
    lineHeight: 23,
    color: '#1F2937',
    letterSpacing: 0.1,
  },
});

export default featureListStyles;
