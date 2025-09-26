import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

const { width } = Dimensions.get('window');

export const therapyGoalsScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.layout.screenPadding,
    paddingVertical: spacing[4],
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },

  backButton: {
    padding: spacing[2],
    marginRight: spacing[3],
  },

  headerContent: {
    flex: 1,
  },

  headerTitle: {
    ...typography.textStyles.h3,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.bold,
  },

  headerSubtitle: {
    ...typography.textStyles.body,
    color: colors.text.secondary,
    marginTop: spacing[1],
  },

  addButton: {
    padding: spacing[2],
    backgroundColor: colors.semantic.success.light,
    borderRadius: spacing.radius.lg,
  },

  // Scroll Content
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: spacing.layout.screenPadding,
    paddingVertical: spacing[6],
  },

  // Section
  section: {
    marginBottom: spacing[8],
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
  },

  sectionTitle: {
    ...typography.textStyles.h4,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.semibold,
  },

  sectionCount: {
    ...typography.textStyles.caption,
    color: colors.text.secondary,
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: spacing.radius.sm,
    overflow: 'hidden',
  },

  // Goal Card
  goalCard: {
    backgroundColor: colors.white,
    borderRadius: spacing.radius.lg,
    padding: spacing[4],
    marginBottom: spacing[3],
    position: 'relative',
    ...shadows.card,
  },

  completedGoalCard: {
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.semantic.success.light,
  },

  goalCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[3],
  },

  goalFocusArea: {
    backgroundColor: colors.semantic.info.light,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: spacing.radius.sm,
  },

  goalFocusAreaText: {
    ...typography.textStyles.caption,
    color: colors.semantic.info.dark,
    fontWeight: typography.fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  completedBadge: {
    backgroundColor: colors.semantic.success.default,
    borderRadius: spacing.radius.full,
    padding: spacing[1],
  },

  goalTitle: {
    ...typography.textStyles.h5,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing[2],
    lineHeight: typography.lineHeight.tight,
  },

  goalStep: {
    ...typography.textStyles.body,
    color: colors.text.secondary,
    fontStyle: 'italic',
    marginBottom: spacing[3],
  },

  goalProgressContainer: {
    marginBottom: spacing[3],
  },

  goalProgressBar: {
    height: 6,
    backgroundColor: colors.gray[200],
    borderRadius: 3,
    marginBottom: spacing[1],
  },

  goalProgressFill: {
    height: '100%',
    backgroundColor: colors.semantic.success.default,
    borderRadius: 3,
  },

  goalProgressText: {
    ...typography.textStyles.caption,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },

  goalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },

  goalMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },

  goalMetaText: {
    ...typography.textStyles.caption,
    color: colors.text.secondary,
  },

  goalCardArrow: {
    position: 'absolute',
    right: spacing[4],
    top: spacing[4],
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing[12],
    paddingHorizontal: spacing[6],
  },

  emptyStateIcon: {
    marginBottom: spacing[6],
    opacity: 0.6,
  },

  emptyStateTitle: {
    ...typography.textStyles.h3,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    marginBottom: spacing[3],
  },

  emptyStateDescription: {
    ...typography.textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.relaxed,
    marginBottom: spacing[8],
  },

  // Buttons
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.semantic.success.default,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[6],
    borderRadius: spacing.radius.lg,
    marginBottom: spacing[3],
    gap: spacing[2],
    minWidth: width * 0.6,
  },

  primaryButtonText: {
    ...typography.textStyles.actionTitle,
    color: colors.white,
    fontWeight: typography.fontWeight.semibold,
  },

  secondaryButton: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[6],
    borderRadius: spacing.radius.lg,
    borderWidth: 1,
    borderColor: colors.gray[300],
    minWidth: width * 0.6,
  },

  secondaryButtonText: {
    ...typography.textStyles.actionTitle,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },

  addGoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.semantic.success.default,
    borderStyle: 'dashed',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    borderRadius: spacing.radius.lg,
    marginTop: spacing[4],
    gap: spacing[2],
  },

  addGoalButtonText: {
    ...typography.textStyles.actionTitle,
    color: colors.semantic.success.default,
    fontWeight: typography.fontWeight.semibold,
  },
});