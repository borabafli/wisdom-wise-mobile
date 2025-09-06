import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

const { height } = Dimensions.get('window');

export const goalCheckInStyles = StyleSheet.create({
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

  headerSubtitle: {
    ...typography.body.md,
    color: colors.orange[700],
  },

  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },

  // Goal summary
  goalSummary: {
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    padding: spacing.lg,
    marginVertical: spacing.lg,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },

  goalTitle: {
    ...typography.heading.sm,
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },

  goalStep: {
    ...typography.body.sm,
    color: colors.gray[600],
    marginBottom: spacing.md,
    fontStyle: 'italic',
  },

  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    ...typography.body.sm,
    color: colors.orange[700],
    fontWeight: '500',
  },

  // Rating section
  ratingContainer: {
    marginBottom: spacing.xl,
  },

  sectionTitle: {
    ...typography.heading.sm,
    color: colors.gray[800],
    marginBottom: spacing.lg,
  },

  sectionTitleOptional: {
    ...typography.body.md,
    color: colors.gray[700],
    marginBottom: spacing.sm,
    fontWeight: '500',
  },

  ratingButtons: {
    gap: spacing.sm,
  },

  ratingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.gray[200],
    ...shadows.sm,
  },

  ratingButtonSelected: {
    backgroundColor: colors.orange[50],
    borderWidth: 2,
  },

  ratingEmoji: {
    fontSize: 24,
    marginRight: spacing.sm,
  },

  ratingLabel: {
    ...typography.body.md,
    color: colors.gray[600],
    flex: 1,
  },

  ratingLabelSelected: {
    color: colors.orange[800],
    fontWeight: '500',
  },

  // Form sections
  section: {
    marginBottom: spacing.lg,
  },

  textArea: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    padding: spacing.md,
    ...typography.body.md,
    minHeight: 100,
    textAlignVertical: 'top',
    ...shadows.sm,
  },

  textInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    padding: spacing.md,
    ...typography.body.md,
    minHeight: 60,
    textAlignVertical: 'top',
  },

  // Footer
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },

  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    ...shadows.md,
  },

  submitButtonDisabled: {
    opacity: 0.6,
  },

  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },

  submitButtonText: {
    ...typography.body.lg,
    color: colors.white,
    fontWeight: '600',
  },
});