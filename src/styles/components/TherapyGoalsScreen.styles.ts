import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

const { width } = Dimensions.get('window');

export const therapyGoalsScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },

  // Header - Enhanced with better spacing and visual hierarchy
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.layout.screenPadding,
    paddingVertical: spacing[5],
    backgroundColor: colors.appBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[150],
    ...shadows.sm,
  },

  backButton: {
    padding: spacing[2],
    marginRight: spacing[4],
    borderRadius: spacing.radius.full,
  },

  headerContent: {
    flex: 1,
  },

  headerTitle: {
    ...typography.textStyles.h2,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: -0.5,
  },

  headerSubtitle: {
    ...typography.textStyles.body,
    color: colors.text.secondary,
    marginTop: spacing[1.5],
    lineHeight: typography.lineHeight.relaxed,
  },

  addButton: {
    padding: spacing[2.5],
    backgroundColor: colors.teal[50],
    borderRadius: spacing.radius.full,
    ...shadows.sm,
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

  // Goal Card - Enhanced with professional design
  goalCard: {
    backgroundColor: colors.white,
    borderRadius: 16, // Per design guide
    padding: spacing[5],
    marginBottom: spacing[4],
    position: 'relative',
    ...shadows.components.card,
    borderWidth: 1,
    borderColor: colors.gray[150],
  },

  completedGoalCard: {
    backgroundColor: colors.green[50],
    borderWidth: 2,
    borderColor: colors.green[200],
  },

  goalCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
  },

  goalFocusArea: {
    backgroundColor: colors.teal[100],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1.5],
    borderRadius: spacing.radius.md,
  },

  goalFocusAreaText: {
    ...typography.textStyles.caption,
    color: colors.teal[700],
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontSize: 11,
  },

  completedBadge: {
    backgroundColor: colors.green[500],
    borderRadius: spacing.radius.full,
    padding: spacing[1.5],
    ...shadows.sm,
  },

  goalTitle: {
    ...typography.textStyles.h4,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing[2.5],
    lineHeight: typography.lineHeight.tight,
    letterSpacing: -0.3,
  },

  goalStep: {
    ...typography.textStyles.body,
    color: colors.text.secondary,
    fontStyle: 'italic',
    marginBottom: spacing[4],
    lineHeight: typography.lineHeight.relaxed,
  },

  goalProgressContainer: {
    marginBottom: spacing[4],
  },

  goalProgressBar: {
    height: 8,
    backgroundColor: colors.gray[200],
    borderRadius: 4,
    marginBottom: spacing[2],
    overflow: 'hidden',
  },

  goalProgressFill: {
    height: '100%',
    backgroundColor: colors.teal[500],
    borderRadius: 4,
  },

  goalProgressText: {
    ...typography.textStyles.caption,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.semibold,
    fontSize: 13,
  },

  goalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[5],
  },

  goalMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1.5],
  },

  goalMetaText: {
    ...typography.textStyles.caption,
    color: colors.text.tertiary,
    fontSize: 13,
  },

  goalCardArrow: {
    position: 'absolute',
    right: spacing[5],
    top: spacing[5],
  },

  // Empty State - Enhanced with better visual hierarchy
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing[16],
    paddingHorizontal: spacing[6],
  },

  emptyStateIcon: {
    marginBottom: spacing[8],
    opacity: 0.8,
  },

  emptyStateTitle: {
    ...typography.textStyles.h2,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    marginBottom: spacing[4],
    letterSpacing: -0.5,
  },

  emptyStateDescription: {
    ...typography.textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.relaxed,
    marginBottom: spacing[10],
    maxWidth: width * 0.85,
  },

  // Buttons - Enhanced with pill-shaped design and better shadows
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.teal[600],
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[8],
    borderRadius: 24, // Pill-shaped as per design guide
    marginBottom: spacing[4],
    gap: spacing[2],
    minWidth: width * 0.65,
    ...shadows.md,
  },

  primaryButtonText: {
    ...typography.textStyles.actionTitle,
    color: colors.white,
    fontWeight: typography.fontWeight.semibold,
    fontSize: 16,
  },

  secondaryButton: {
    paddingVertical: spacing[3.5],
    paddingHorizontal: spacing[8],
    borderRadius: 24, // Pill-shaped as per design guide
    borderWidth: 2,
    borderColor: colors.gray[300],
    backgroundColor: colors.white,
    minWidth: width * 0.65,
    ...shadows.sm,
  },

  secondaryButtonText: {
    ...typography.textStyles.actionTitle,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
    fontSize: 15,
  },

  addGoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.teal[500],
    borderStyle: 'dashed',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    borderRadius: spacing.radius.xl,
    marginTop: spacing[4],
    gap: spacing[2],
    ...shadows.sm,
  },

  addGoalButtonText: {
    ...typography.textStyles.actionTitle,
    color: colors.teal[600],
    fontWeight: typography.fontWeight.semibold,
  },
});