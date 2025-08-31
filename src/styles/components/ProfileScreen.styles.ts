/**
 * ProfileScreen Component Styles
 * Separated from component for better maintainability
 */

import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

const { width, height } = Dimensions.get('window');

export const profileScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  header: {
    paddingHorizontal: spacing.layout.screenPadding,
    paddingTop: spacing.layout.screenPadding,
    paddingBottom: spacing.components.cardGap,
  },
  headerTitle: {
    ...typography.textStyles.h1,
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  userInfoSection: {
    paddingHorizontal: spacing.layout.screenPadding,
    marginBottom: spacing.layout.screenPadding,
  },
  userInfoCard: {
    borderRadius: spacing.radius['2xl'],
    ...shadows.components.modal,
    overflow: 'hidden',
  },
  userInfoContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: colors.border.primary,
    paddingVertical: spacing.components.cardPadding,
    paddingHorizontal: spacing.components.cardPadding,
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
  statsSection: {
    paddingHorizontal: spacing.layout.screenPadding,
    marginBottom: spacing.layout.screenPadding,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.components.cardGap,
  },
  statCard: {
    width: (width - 60) / 2,
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
  menuSection: {
    paddingHorizontal: spacing.layout.screenPadding,
    gap: spacing.components.cardGap,
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
