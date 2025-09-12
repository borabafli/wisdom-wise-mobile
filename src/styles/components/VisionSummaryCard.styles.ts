import { StyleSheet } from 'react-native';
import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { typography } from '../tokens/typography';

export const visionSummaryCardStyles = StyleSheet.create({
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
    maxHeight: '80%',
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

  summarySection: {
    marginBottom: spacing.therapy.lg,
  },

  sectionTitle: {
    ...typography.textStyles.h6,
    color: colors.text.primary,
    marginBottom: spacing.therapy.sm,
    fontWeight: '600',
  },

  summaryText: {
    ...typography.textStyles.body,
    color: colors.text.secondary,
    lineHeight: 22,
    paddingHorizontal: spacing.therapy.sm,
    paddingVertical: spacing.therapy.sm,
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 12,
  },

  insightsSection: {
    marginBottom: spacing.therapy.md,
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
    backgroundColor: '#0EA5E9',
    marginRight: spacing.therapy.sm,
    marginTop: 8,
  },

  insightText: {
    ...typography.textStyles.body,
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 20,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.therapy.sm,
    paddingTop: spacing.therapy.sm,
  },

  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.therapy.sm + 2,
    paddingHorizontal: spacing.therapy.md,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(107, 114, 128, 0.2)',
    gap: spacing.therapy.xs,
    minWidth: 140,
  },

  cancelButtonText: {
    ...typography.textStyles.bodySmall,
    color: colors.text.secondary,
    fontWeight: '500',
    fontSize: 13,
  },

  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.therapy.sm + 2,
    paddingHorizontal: spacing.therapy.md + 4,
    borderRadius: 16,
    backgroundColor: '#0EA5E9',
    gap: spacing.therapy.xs,
    minWidth: 140,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  saveButtonDisabled: {
    backgroundColor: '#94a3b8',
  },

  saveButtonText: {
    ...typography.textStyles.bodySmall,
    color: colors.white,
    fontWeight: '600',
    fontSize: 13,
  },
});