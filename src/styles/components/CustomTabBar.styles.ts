/**
 * CustomTabBar Component Styles
 * Separated from component for better maintainability
 */

import { StyleSheet } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

export const customTabBarStyles = StyleSheet.create({
  // Container
  container: {
    backgroundColor: 'transparent', // No background - let LinearGradient handle it
  },
  tabBarGradient: {
    borderTopWidth: 1,
    borderTopColor: colors.gray[200], // Use more visible border color
    ...shadows.components.tabBar,
    backgroundColor: colors.white, // Force white background to override dark mode
  },
  tabBarContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12, // Reduced vertical space for more condensed look
    paddingHorizontal: spacing.components.cardPadding,
    flex: 1, // Take full width
    minHeight: 75, // Reduced height for more compact design
  },

  // Tab Buttons
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1], // Reduced gap between icon and text
    paddingVertical: 8, // Reduced vertical padding for more condensed look
    paddingHorizontal: 4, // Less horizontal padding for more text space
    borderRadius: spacing.radius.lg,
    flex: 1,
    maxWidth: 110, // Wider to allow full text
    minHeight: 50, // Reduced height for more compact design
  },
  tabButtonActive: {
    backgroundColor: 'rgba(13, 148, 136, 0.1)', // Light teal background
  },
  tabLabel: {
    ...typography.textStyles.caption,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
    numberOfLines: 1,
  },

  // Center Plus Button
  centerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[4],

    marginTop: -8,

  },
  plusButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow removed
  },


});