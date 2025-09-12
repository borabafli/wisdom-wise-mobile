import { StyleSheet } from 'react-native';
import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { typography } from '../tokens/typography';

export const thinkingPatternSummaryCardStyles = StyleSheet.create({
  container: {
    borderRadius: 20,
    marginVertical: spacing.therapy.md,
    marginHorizontal: spacing.therapy.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    elevation: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    maxHeight: '80%', // Limit height to prevent overflow
  },

  glassOverlay: {
    padding: spacing.therapy.xl,
    borderRadius: 20,
    flex: 1,
  },
  
  header: {
    marginBottom: spacing.therapy.lg,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.therapy.xs,
    gap: spacing.therapy.sm,
  },
  
  title: {
    ...typography.textStyles.h4,
    color: colors.text.primary,
    textAlign: 'center',
  },
  
  subtitle: {
    ...typography.textStyles.bodySmall,
    color: colors.text.secondary,
    textAlign: 'center',
  },

  content: {
    flex: 1,
    marginBottom: spacing.therapy.lg,
  },

  patternSection: {
    marginBottom: spacing.therapy.lg,
  },

  summarySection: {
    marginBottom: spacing.therapy.md,
  },

  sectionTitle: {
    ...typography.textStyles.h6,
    color: colors.text.primary,
    marginBottom: spacing.therapy.sm,
    fontWeight: '600',
  },

  patternCard: {
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    borderRadius: 12,
    padding: spacing.therapy.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.purple[500],
  },

  distortionType: {
    ...typography.textStyles.bodySmall,
    color: colors.purple[600],
    fontWeight: '600',
    marginBottom: spacing.therapy.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  originalThought: {
    ...typography.textStyles.body,
    color: colors.text.secondary,
    lineHeight: 20,
    fontFamily: 'ClashGrotesk-Regular',
  },

  summaryText: {
    ...typography.textStyles.body,
    color: colors.text.secondary,
    lineHeight: 22,
    paddingHorizontal: spacing.therapy.sm,
    paddingVertical: spacing.therapy.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    fontStyle: 'italic',
  },

  insightsSection: {
    marginTop: spacing.therapy.md,
  },

  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.therapy.sm,
    paddingLeft: spacing.therapy.sm,
  },

  insightBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.purple[500],
    marginRight: spacing.therapy.sm,
    marginTop: 8, // Align with text
  },

  insightText: {
    ...typography.textStyles.body,
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 22,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.therapy.md,
  },

  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: spacing.therapy.md,
    paddingHorizontal: spacing.therapy.lg,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(107, 114, 128, 0.3)',
    gap: spacing.therapy.xs,
  },

  cancelButtonText: {
    ...typography.textStyles.body,
    color: colors.text.secondary,
    fontWeight: '500',
  },

  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: spacing.therapy.md,
    paddingHorizontal: spacing.therapy.lg,
    borderRadius: 12,
    backgroundColor: colors.purple[600],
    gap: spacing.therapy.xs,
  },

  saveButtonDisabled: {
    backgroundColor: colors.purple[400],
  },

  saveButtonText: {
    ...typography.textStyles.body,
    color: colors.white,
    fontWeight: '600',
  },
});