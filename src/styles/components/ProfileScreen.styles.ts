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
    paddingBottom: spacing[32],
  },
  
  // Header Styles - Match Insights
  header: {
    paddingHorizontal: spacing.layout.screenPadding,
    paddingTop: spacing[8],
    paddingBottom: spacing[4],
  },
  headerContent: {
    alignItems: 'flex-start',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing[2],
    paddingRight: spacing[8],
    marginLeft: -spacing[8],
  },
  headerTurtleIcon: {
    width: 162,
    height: 162,
    marginRight: spacing[4],
    marginTop: -spacing[8],
    flexShrink: 0,
  },
  titleAndSubtitleContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: spacing[12],
    flex: 1,
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
    paddingBottom: 40, // Reduced from 120 to remove excessive bottom space
  },
  planCardContainer: {
    paddingHorizontal: spacing.layout.screenPadding,
    marginBottom: spacing[8],
  },
  planCardGradient: {
    borderRadius: spacing.radius.xl,
    padding: spacing[12],
    shadowColor: 'rgba(31, 79, 76, 0.15)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(31, 79, 76, 0.12)',
  },
  planCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
  },
  planCardTag: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    color: '#1F4F4C',
    letterSpacing: 1,
    textTransform: 'uppercase',
    backgroundColor: 'rgba(31, 79, 76, 0.12)',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: spacing.radius.pill,
  },
  planCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#145458',
    letterSpacing: 0.2,
    marginBottom: spacing[2],
  },
  planCardSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
    color: '#335F66',
    lineHeight: 20,
    marginBottom: spacing[6],
  },
  planCardButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#145458',
    paddingHorizontal: spacing[10],
    paddingVertical: spacing[3],
    borderRadius: spacing.radius.pill,
    shadowColor: 'rgba(20, 84, 88, 0.25)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  planCardButtonText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    letterSpacing: 0.3,
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
    alignItems: 'flex-start',
    gap: spacing.components.cardGap,
  },
  avatarContainer: {
    flexShrink: 0,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(43, 71, 94, 0.12)',
    padding: spacing[4],
    ...shadows.sm,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  userDetails: {
    flex: 1,
    paddingRight: spacing[4],
  },
  userEditButton: {
    padding: spacing[3],
    borderRadius: 16,
    backgroundColor: 'rgba(43, 71, 94, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
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
    height: 100,
  },
  statCardGradient: {
    padding: spacing[12],
    borderRadius: 20,
    height: 100,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  statCardContent: {
    flex: 1,
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
    flexWrap: 'nowrap',
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
    marginBottom: spacing[1],
  },
  menuSubtitle: {
    color: '#002d14',
    fontSize: 12,
    fontWeight: '400',
    opacity: 0.8,
    letterSpacing: 0.1,
    flexWrap: 'nowrap',
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
  menuIconBackground: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
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
  legalLink: {
    marginBottom: spacing[4],
    paddingVertical: spacing[2],
  },
  legalLinkText: {
    fontSize: 13,
    color: '#36657d',
    fontWeight: '500',
    textDecorationLine: 'underline',
    textDecorationColor: '#36657d',
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


