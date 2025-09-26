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
    backgroundColor: colors.appBackground,
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
  header: {
    paddingHorizontal: spacing.layout.screenPadding,
    paddingTop: spacing[16],
    paddingBottom: spacing[4],
  },
  headerContent: {
    alignItems: 'flex-start',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing[2],
    marginLeft: -spacing[16],
    marginTop: -spacing[12],
  },
  headerTurtleIcon: {
    width: 162,
    height: 162,
    marginRight: spacing[4],
    marginTop: -spacing[8],
  },
  titleAndSubtitleContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: -spacing[12],
    marginTop: spacing[20],
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#002d14',
    fontFamily: 'BubblegumSans-Regular',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: spacing[1],
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6b7280',
    fontFamily: 'Inter-Medium',
    letterSpacing: 0.2,
  },
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
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  userInfoCardGradient: {
    padding: spacing[12],
    borderRadius: 20,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
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
    fontSize: 20,
    color: '#002d14',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
    marginBottom: spacing[1],
    letterSpacing: -0.3,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  memberSince: {
    fontSize: 12,
    color: '#002d14',
    fontWeight: '400',
    marginBottom: spacing[1],
    opacity: 0.8,
    letterSpacing: 0.1,
  },
  premiumBadge: {
    fontSize: 11,
    color: '#002d14',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    opacity: 0.7,
  },
  // Stats Section - HomeScreen Style
  statsSection: {
    paddingHorizontal: spacing.layout.screenPadding,
    marginBottom: spacing.layout.screenPadding,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.components.cardGap,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002d14',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: 'Poppins-Bold',
  },
  statsGrid: {
    gap: 0,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.components.cardGap,
    marginBottom: spacing.components.cardGap,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'transparent',
    minHeight: 100,
  },
  statCardGradient: {
    padding: spacing[12],
    borderRadius: 20,
    minHeight: 100,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  statCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  statIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    marginRight: spacing[2],
  },
  statIconImage: {
    width: 40,
    height: 40,
  },
  statInfo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 18,
    color: '#002d14',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
    marginBottom: spacing[1],
    textAlign: 'center',
    letterSpacing: -0.3,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#002d14',
    fontWeight: '400',
    textAlign: 'center',
    opacity: 0.8,
    letterSpacing: 0.1,
  },
  // Menu Section - HomeScreen Style
  menuSection: {
    paddingHorizontal: spacing.layout.screenPadding,
    marginBottom: spacing.layout.screenPadding,
  },
  menuGrid: {
    gap: spacing.components.cardGap,
  },
  menuCard: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  menuCardGradient: {
    padding: spacing.components.cardGap,
    borderRadius: 18,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  menuCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.components.cardGap,
  },
  menuIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
  },
  menuIconImage: {
    width: 48,
    height: 48,
    borderRadius: 0,
  },
  menuTitleContainer: {
    flex: 1,
  },
  menuTitle: {
    color: '#002d14',
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
    marginBottom: spacing[1],
  },
  menuSubtitle: {
    color: '#002d14',
    fontSize: 12,
    fontWeight: '400',
    opacity: 0.8,
    letterSpacing: 0.1,
  },
  menuActions: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[2],
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
