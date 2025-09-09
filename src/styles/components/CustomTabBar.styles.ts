/**
 * CustomTabBar Component Styles
 * Separated from component for better maintainability
 */

import { StyleSheet } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

export const customTabBarStyles = StyleSheet.create({
  // Container
  container: {
    backgroundColor: colors.white, // Force white background for container
  },
  tabBarGradient: {
    borderTopWidth: 1,
    borderTopColor: colors.gray[200], // Use more visible border color
    ...shadows.components.tabBar,
    backgroundColor: colors.white, // Force white background to override dark mode
  },
  tabBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.components.cardGap,
    paddingHorizontal: spacing.components.cardPadding,
    flex: 0, // Don't stretch to fill available space
  },

  // Tab Buttons
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    padding: spacing.components.cardGap,
    borderRadius: spacing.radius.lg,
    minWidth: 60,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(59, 180, 245, 0.1)', // Light sky blue background that matches the accent
  },
  tabLabel: {
    ...typography.textStyles.caption,
    fontWeight: typography.fontWeight.medium,
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
    ...shadows.components.floatingActionButton,

  },


});