/**
 * VisionInsightsCard Component Styles
 * Card component for displaying vision insights on dashboard
 */

import { StyleSheet } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

export const visionInsightsCardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginHorizontal: spacing[20],
    marginVertical: spacing[8],
    ...shadows.medium,
    overflow: 'hidden',
  },
  accent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.teal[500],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[20],
    paddingBottom: spacing[12],
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[12],
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary[700],
    marginBottom: spacing[2],
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[500],
  },
  content: {
    paddingHorizontal: spacing[20],
    paddingBottom: spacing[20],
  },
  visionDescription: {
    backgroundColor: colors.neutral[50],
    borderRadius: 12,
    padding: spacing[16],
    marginBottom: spacing[16],
    borderLeftWidth: 3,
    borderLeftColor: colors.teal[500],
  },
  descriptionText: {
    fontSize: typography.fontSize.base,
    lineHeight: 24,
    color: colors.neutral[800],
    fontStyle: 'italic',
    marginBottom: spacing[8],
  },
  visionDate: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral[500],
  },
  qualitiesContainer: {
    marginBottom: spacing[16],
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[700],
    marginBottom: spacing[8],
  },
  qualitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  qualityTag: {
    backgroundColor: colors.primary[50],
    borderRadius: 12,
    paddingHorizontal: spacing[10],
    paddingVertical: spacing[4],
  },
  qualityText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary[700],
    fontWeight: typography.fontWeight.medium,
  },
  domainsContainer: {
    marginBottom: spacing[20],
  },
  domainsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  domainBadge: {
    backgroundColor: colors.teal[50],
    borderRadius: 8,
    paddingHorizontal: spacing[8],
    paddingVertical: spacing[4],
    borderWidth: 1,
    borderColor: colors.teal[200],
  },
  domainText: {
    fontSize: typography.fontSize.xs,
    color: colors.teal[700],
    fontWeight: typography.fontWeight.medium,
  },
  buttonsContainer: {
    gap: spacing[12],
  },
  reflectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#599BC1',
    borderRadius: 12,
    paddingVertical: spacing[12],
    paddingHorizontal: spacing[16],
    gap: spacing[8],
  },
  reflectButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.teal[50],
    borderRadius: 12,
    paddingVertical: spacing[10],
    paddingHorizontal: spacing[16],
    gap: 6,
    borderWidth: 1,
    borderColor: colors.teal[200],
  },
  viewAllText: {
    color: colors.teal[700],
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  emptyState: {
    padding: spacing[20],
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[500],
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing[16],
  },
  startExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#599BC1',
    borderRadius: 12,
    paddingVertical: spacing[12],
    paddingHorizontal: spacing[16],
    gap: spacing[8],
    ...shadows.small,
  },
  startExerciseText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
});