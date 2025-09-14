/**
 * ProfileScreen Component Styles
 * Separated from component for better maintainability
 */

import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

const { width, height } = Dimensions.get('window');

export const profileScreenStyles = StyleSheet.create({
  // Container & Layout - Consistent with Insights
  container: {
    flex: 1,
    position: 'relative',
  },
  
  // Scrollable Background - Match Insights Pattern
  scrollableBackgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  scrollableBackgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  
  // Content Container - Positioned above background
  contentContainer: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
  
  // Header Styles - Match Insights
  scrollableHeader: {
    paddingHorizontal: spacing.layout.screenPadding,
    paddingTop: spacing[16],
    paddingBottom: spacing[8],
    alignItems: 'flex-start',
  },
  compactTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#002d14',
    fontFamily: 'BubblegumSans-Regular',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: spacing[2],
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
    fontFamily: 'Inter-Medium',
    letterSpacing: 0.2,
  },
  
  // Legacy styles for backward compatibility
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  watercolorBlob: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.4,
  },
  blob1: {
    top: 80,
    left: -72,
    width: 288,
    height: 224,
    backgroundColor: 'rgba(186, 230, 253, 0.5)',
  },
  blob2: {
    top: height * 0.25,
    right: -80,
    width: 320,
    height: 256,
    backgroundColor: 'rgba(191, 219, 254, 0.3)',
  },
  blob3: {
    top: height * 0.65,
    left: width * 0.25,
    width: 256,
    height: 192,
    backgroundColor: 'rgba(125, 211, 252, 0.4)',
  },
  blob4: {
    bottom: 128,
    right: width * 0.33,
    width: 224,
    height: 168,
    backgroundColor: 'rgba(191, 219, 254, 0.25)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  // Header Section - Consistent with HomeScreen
  header: {
    paddingHorizontal: spacing.layout.screenPadding,
    paddingTop: spacing[32],
    paddingBottom: spacing.layout.screenPadding,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#002d14', // Consistent with HomeScreen green theme
    fontFamily: 'BubblegumSans-Regular',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  userInfoSection: {
    paddingHorizontal: spacing.layout.screenPadding,
    marginBottom: spacing[8],
  },
  userInfoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: spacing.radius['2xl'],
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.4)',
    padding: spacing[12],
    marginBottom: spacing[8],
    overflow: 'hidden',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  userInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.components.cardGap,
  },
  avatarContainer: {
    flexShrink: 0,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: spacing.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.components.actionButton,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    ...typography.textStyles.actionTitle,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  memberSince: {
    ...typography.textStyles.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing[1],
  },
  premiumBadge: {
    ...typography.textStyles.caption,
    color: colors.blue[600],
    fontWeight: typography.fontWeight.medium,
  },
  // Stats Card - Insights Style
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: spacing.radius['2xl'],
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.4)',
    padding: spacing[12],
    marginHorizontal: spacing.layout.screenPadding,
    marginBottom: spacing[8],
    overflow: 'hidden',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsSection: {
    paddingHorizontal: spacing.layout.screenPadding,
    marginBottom: spacing.layout.screenPadding,
  },
  statsGrid: {
    gap: spacing.components.cardGap,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.components.cardGap,
  },
  statCard: {
    flex: 1,
    borderRadius: spacing.radius.lg,
    ...shadows.components.actionButton,
  },
  statCardGradient: {
    borderRadius: spacing.radius.lg,
    borderWidth: 1,
    borderColor: colors.border.primary,
    padding: spacing.components.cardGap,
  },
  statCardContent: {
    alignItems: 'flex-start',
  },
  statIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing[1],
  },
  statValue: {
    ...typography.textStyles.h4,
    color: colors.text.primary,
  },
  statLabel: {
    ...typography.textStyles.bodySmall,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  menuCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: spacing.radius['2xl'],
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.4)',
    padding: spacing[12],
    marginHorizontal: spacing.layout.screenPadding,
    marginBottom: spacing[8],
    overflow: 'hidden',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  menuSection: {
    gap: spacing.components.cardGap,
  },
  
  // Insights-style menu items
  menuItemInsights: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.components.cardGap,
    paddingVertical: spacing[4],
  },
  menuIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconBackground: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitleContainer: {
    flex: 1,
  },
  menuTitle: {
    ...typography.textStyles.h4,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  menuTitleDanger: {
    color: '#ef4444',
  },
  menuSubtitle: {
    ...typography.textStyles.body,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
    fontSize: 14,
  },
  menuArrow: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[2],
  },
  menuItem: {
    borderRadius: spacing.radius.lg,
    ...shadows.sm,
    overflow: 'hidden',
  },
  menuItemDanger: {
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  menuItemGradient: {
    borderRadius: spacing.radius.lg,
    paddingVertical: spacing.components.cardGap,
    paddingHorizontal: spacing.components.cardGap,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.components.cardGap,
  },
  menuItemLabel: {
    flex: 1,
    ...typography.textStyles.body,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
  },
  menuItemLabelDanger: {
    color: colors.semantic.error,
  },
  badge: {
    backgroundColor: colors.blue[600],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 50,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.text.inverse,
    ...typography.textStyles.caption,
    fontWeight: typography.fontWeight.medium,
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  versionSection: {
    paddingHorizontal: spacing.layout.screenPadding,
    paddingTop: spacing[8],
    alignItems: 'center',
  },
  versionText: {
    ...typography.textStyles.caption,
    color: colors.text.secondary,
    marginBottom: spacing[1],
  },
  versionSubtext: {
    ...typography.textStyles.caption,
    color: colors.text.secondary,
  },
});
