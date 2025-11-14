/**
 * Feature List Styles
 *
 * Styles for premium features list display
 */

import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../tokens';

export const featureListStyles = StyleSheet.create({
  container: {
    gap: spacing['3'],
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
    fontFamily: typography.fontFamily.ubuntu,
    fontSize: 15,
    lineHeight: 22,
    color: '#1F2937',
  },
});

export default featureListStyles;
