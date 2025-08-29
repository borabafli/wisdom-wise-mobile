/**
 * CustomTabBar Component Styles
 * Separated from component for better maintainability
 */

import { StyleSheet } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

export const customTabBarStyles = StyleSheet.create({
  // Container
  container: {
    backgroundColor: colors.background.secondary,
  },
  tabBarGradient: {
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    ...shadows.components.tabBar,
    paddingBottom: 20, // Add padding for Android navigation gestures
  },
  tabBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.components.cardGap,
    paddingHorizontal: spacing.components.cardPadding,
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
    backgroundColor: colors.primaryAlpha[10],
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