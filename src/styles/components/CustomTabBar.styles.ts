/**
 * CustomTabBar Component Styles
 * Separated from component for better maintainability
 */

import { StyleSheet } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

export const customTabBarStyles = StyleSheet.create({
  // Container
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  tabBarGradient: {
    borderTopWidth: 1,
    borderTopColor: colors.border.primary,
    ...shadows.components.tabBar,
    borderTopLeftRadius: spacing.radius['2xl'],
    borderTopRightRadius: spacing.radius['2xl'],
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
    borderWidth: 1,
    borderColor: colors.primaryAlpha[20],
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
    marginTop: -spacing.layout.screenPadding,
  },
  plusButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.components.floatingActionButton,
    borderWidth: 3,
    borderColor: colors.background.glass,
  },

  // Bottom Safe Area
  bottomSafeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background.secondary,
    zIndex: 49,
  },
});