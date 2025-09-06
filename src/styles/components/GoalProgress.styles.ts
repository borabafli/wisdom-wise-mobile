import { StyleSheet } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

export const goalProgressStyles = StyleSheet.create({
  // Compact view for insights dashboard
  compactCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },

  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  compactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  compactTitleContainer: {
    flex: 1,
    marginLeft: spacing.sm,
  },

  compactTitle: {
    ...typography.heading.sm,
    color: colors.gray[900],
    marginBottom: spacing.xs / 2,
  },

  compactSubtitle: {
    ...typography.body.sm,
    color: colors.gray[600],
  },

  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.orange[50],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.orange[200],
  },

  compactProgress: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },

  checkInReminder: {
    ...typography.body.xs,
    color: colors.orange[700],
    backgroundColor: colors.orange[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },

  // Full card view
  fullCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitleContainer: {
    flex: 1,
    marginLeft: spacing.sm,
  },

  cardTitle: {
    ...typography.heading.md,
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },

  cardSubtitle: {
    ...typography.body.sm,
    color: colors.gray[600],
  },

  // Progress stats
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.orange[50],
    borderRadius: 8,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },

  statItem: {
    alignItems: 'center',
  },

  statValue: {
    ...typography.heading.lg,
    color: colors.orange[700],
    marginBottom: spacing.xs,
  },

  statValueSuccess: {
    ...typography.heading.lg,
    color: colors.green[600],
    marginBottom: spacing.xs,
  },

  statLabel: {
    ...typography.body.xs,
    color: colors.orange[600],
    textAlign: 'center',
  },

  // Goal cards
  goalsContainer: {
    gap: spacing.sm,
  },

  goalCard: {
    backgroundColor: colors.gray[50],
    borderRadius: 8,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray[200],
  },

  goalCardNeedsCheckIn: {
    borderColor: colors.orange[300],
    backgroundColor: colors.orange[25],
  },

  goalContent: {
    flex: 1,
  },

  goalHeader: {
    marginBottom: spacing.sm,
  },

  goalTitle: {
    ...typography.body.md,
    color: colors.gray[900],
    fontWeight: '500',
    marginBottom: spacing.xs / 2,
  },

  goalTimeline: {
    ...typography.body.xs,
    color: colors.gray[500],
  },

  // Progress bar
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.gray[200],
    borderRadius: 3,
    marginRight: spacing.sm,
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.orange[500],
    borderRadius: 3,
  },

  progressText: {
    ...typography.body.xs,
    color: colors.orange[700],
    fontWeight: '500',
    minWidth: 30,
  },

  practicalStep: {
    ...typography.body.sm,
    color: colors.gray[600],
    fontStyle: 'italic',
    marginBottom: spacing.xs,
  },

  // Check-in button
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.orange[100],
    borderRadius: 6,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    alignSelf: 'flex-start',
    gap: spacing.xs,
  },

  checkInButtonText: {
    ...typography.body.xs,
    color: colors.orange[700],
    fontWeight: '500',
  },

  // View more button
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },

  viewMoreText: {
    ...typography.body.sm,
    color: colors.orange[700],
    fontWeight: '500',
  },

  // Empty state
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },

  emptyStateTitle: {
    ...typography.heading.sm,
    color: colors.gray[700],
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },

  emptyStateText: {
    ...typography.body.sm,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },

  createGoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.orange[500],
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },

  createGoalButtonText: {
    ...typography.body.sm,
    color: colors.white,
    fontWeight: '500',
  },

  // Loading state
  loadingText: {
    ...typography.body.md,
    color: colors.gray[500],
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
});