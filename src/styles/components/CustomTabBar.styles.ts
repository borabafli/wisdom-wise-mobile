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
    backgroundColor: colors.white, // Force white background to override dark mode
    paddingTop: 4, // More space at the top
    paddingBottom: 8, // More space at the bottom
    overflow: 'visible', // Allow plus button to extend outside
  },
  tabBarContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start', // Align to top
    paddingVertical: 8, // More vertical space for text
    paddingHorizontal: spacing.components.cardPadding,
    flex: 1, // Take full width
    minHeight: 90, // Much more height for text
    overflow: 'visible', // Allow plus button to extend outside
  },

  // Tab Buttons
  tabButton: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: spacing[1],
    paddingTop: 0, // Remove top padding to move content up
    paddingBottom: 14, // More bottom padding to prevent text cutoff
    paddingHorizontal: 4,
    borderRadius: spacing.radius.xl,
    flex: 1,
    maxWidth: 110,
    minHeight: 78, // Slightly more height for text
    backgroundColor: 'transparent',
    borderWidth: 0,
    shadowColor: 'transparent',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    position: 'relative',
    overflow: 'hidden', // Cut off tap circles at tab button level only
  },
  tabButtonActive: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    shadowColor: 'transparent',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  // Simple single circle animation effect
  tabCircle1: {
    position: 'absolute',
    backgroundColor: 'rgba(20, 184, 166, 0.15)', // Light teal
    width: 100, // Bigger circle
    height: 100,
    borderRadius: 50, // Exactly half of width/height for perfect circle
    left: '50%', // Centered horizontally
    top: '25%', // Even higher position to be cut off at optimal point
    marginLeft: -50, // Exactly half of width for perfect centering
    marginTop: -50, // Exactly half of height for perfect centering
    zIndex: -1, // Behind all icons and text
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
    marginTop: -20, // Even less negative margin to move it lower
    zIndex: 999, // Highest z-index to ensure it's on top
    elevation: 999, // For Android
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