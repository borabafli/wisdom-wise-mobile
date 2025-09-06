import { StyleSheet } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

export const goalDetailsStyles = StyleSheet.create({
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
    backgroundColor: colors.orange[100],
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },

  editButton: {
    position: 'absolute',
    top: spacing.xl,
    left: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.orange[100],
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
    color: colors.orange[800],
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },

  focusArea: {
    ...typography.body.md,
    color: colors.orange[700],
    marginBottom: spacing.md,
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },

  status_active: {
    backgroundColor: colors.green[100],
  },

  status_completed: {
    backgroundColor: colors.green[200],
  },

  status_paused: {
    backgroundColor: colors.gray[200],
  },

  status_archived: {
    backgroundColor: colors.gray[100],
  },

  statusText: {
    ...typography.body.xs,
    fontWeight: '600',
    color: colors.green[800],
  },

  timelineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.orange[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    gap: spacing.xs,
  },

  timelineText: {
    ...typography.body.xs,
    color: colors.orange[800],
    fontWeight: '500',
  },

  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },

  detailsContainer: {
    paddingVertical: spacing.md,
  },

  section: {
    marginBottom: spacing.xl,
  },

  sectionTitle: {
    ...typography.heading.sm,
    color: colors.gray[800],
    marginBottom: spacing.sm,
  },

  sectionSubtitle: {
    ...typography.body.sm,
    color: colors.gray[600],
    marginBottom: spacing.md,
  },

  goalText: {
    ...typography.body.lg,
    color: colors.gray[900],
    lineHeight: 24,
    backgroundColor: colors.gray[50],
    padding: spacing.md,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.orange[400],
  },

  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: colors.gray[200],
    borderRadius: 4,
    marginRight: spacing.sm,
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.orange[500],
    borderRadius: 4,
  },

  progressText: {
    ...typography.body.md,
    color: colors.orange[700],
    fontWeight: '600',
    minWidth: 40,
  },

  checkInsText: {
    ...typography.body.sm,
    color: colors.gray[600],
  },

  stepText: {
    ...typography.body.md,
    color: colors.gray[800],
    backgroundColor: colors.blue[50],
    padding: spacing.md,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.blue[400],
    fontStyle: 'italic',
  },

  motivationText: {
    ...typography.body.md,
    color: colors.gray[800],
    backgroundColor: colors.orange[50],
    padding: spacing.md,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.orange[400],
    lineHeight: 22,
  },

  textArea: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    padding: spacing.md,
    ...typography.body.md,
    minHeight: 80,
    textAlignVertical: 'top',
    ...shadows.sm,
  },

  // Exercises section
  exercisesList: {
    gap: spacing.sm,
  },

  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
    ...shadows.sm,
  },

  exerciseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },

  exerciseContent: {
    flex: 1,
  },

  exerciseName: {
    ...typography.body.md,
    color: colors.gray[900],
    fontWeight: '500',
    marginBottom: spacing.xs / 2,
  },

  exerciseDuration: {
    ...typography.body.sm,
    color: colors.gray[600],
  },

  // Sessions section
  sessionsList: {
    gap: spacing.sm,
  },

  sessionCard: {
    backgroundColor: colors.gray[50],
    borderRadius: 8,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },

  sessionDate: {
    ...typography.body.sm,
    color: colors.gray[600],
    marginBottom: spacing.xs,
    fontWeight: '500',
  },

  sessionSummary: {
    ...typography.body.sm,
    color: colors.gray[800],
    lineHeight: 20,
  },

  noSessionsText: {
    ...typography.body.sm,
    color: colors.gray[500],
    fontStyle: 'italic',
    textAlign: 'center',
    padding: spacing.lg,
  },

  footer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },

  // Edit actions
  editActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },

  cancelButton: {
    flex: 1,
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },

  cancelButtonText: {
    ...typography.body.md,
    color: colors.gray[600],
    fontWeight: '500',
  },

  saveButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },

  saveGradient: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveButtonText: {
    ...typography.body.md,
    color: colors.white,
    fontWeight: '600',
  },

  // Action buttons
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },

  actionButton: {
    flex: 1,
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    paddingVertical: spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },

  actionButtonText: {
    ...typography.body.md,
    color: colors.gray[700],
    fontWeight: '500',
  },

  completeButton: {
    backgroundColor: colors.green[500],
  },

  completeButtonText: {
    ...typography.body.md,
    color: colors.white,
    fontWeight: '600',
  },
});