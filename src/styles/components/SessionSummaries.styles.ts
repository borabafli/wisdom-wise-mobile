import { StyleSheet } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

export const sessionSummariesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  header: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    position: 'relative',
  },

  closeButton: {
    position: 'absolute',
    top: spacing.xl,
    right: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.green[100],
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },

  headerContent: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },

  headerTitle: {
    ...typography.heading.xl,
    color: colors.green[800],
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },

  headerSubtitle: {
    ...typography.body.md,
    color: colors.green[700],
  },

  // Filter bar
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.gray[50],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    gap: spacing.sm,
  },

  filterButton: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray[300],
  },

  filterButtonActive: {
    backgroundColor: colors.green[500],
    borderColor: colors.green[500],
  },

  filterText: {
    ...typography.body.sm,
    color: colors.gray[600],
    fontWeight: '500',
  },

  filterTextActive: {
    color: colors.white,
  },

  // Summaries list
  summariesList: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },

  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
    ...shadows.sm,
  },

  summaryHeader: {
    marginBottom: spacing.md,
  },

  summaryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },

  typeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },

  typeBadgeSession: {
    backgroundColor: colors.blue[100],
  },

  typeBadgeConsolidated: {
    backgroundColor: colors.purple[100],
  },

  typeBadgeText: {
    ...typography.body.xs,
    fontWeight: '600',
  },

  typeBadgeTextSession: {
    color: colors.blue[800],
  },

  typeBadgeTextConsolidated: {
    color: colors.purple[800],
  },

  summaryTitle: {
    ...typography.heading.sm,
    color: colors.gray[900],
    flex: 1,
  },

  summaryMeta: {
    flexDirection: 'row',
    gap: spacing.md,
  },

  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },

  metaText: {
    ...typography.body.xs,
    color: colors.gray[600],
  },

  summaryContent: {
    ...typography.body.md,
    color: colors.gray[800],
    lineHeight: 22,
    marginBottom: spacing.sm,
  },

  consolidatedInfo: {
    backgroundColor: colors.purple[50],
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
  },

  consolidatedInfoText: {
    ...typography.body.xs,
    color: colors.purple[700],
    fontWeight: '500',
  },

  // Empty state
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },

  emptyStateTitle: {
    ...typography.heading.md,
    color: colors.gray[700],
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },

  emptyStateText: {
    ...typography.body.md,
    color: colors.gray[600],
    textAlign: 'center',
    lineHeight: 22,
  },

  // Loading state
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    ...typography.body.md,
    color: colors.gray[500],
  },
});