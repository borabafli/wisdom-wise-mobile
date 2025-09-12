/**
 * VisionDetailsModal Component Styles
 * Modal interface for viewing detailed vision insights
 */

import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

const { width, height } = Dimensions.get('window');

export const visionDetailsModalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[20],
    paddingTop: 60,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[12],
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[800],
  },
  headerSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[500],
    marginTop: spacing[2],
  },
  closeButton: {
    padding: spacing[8],
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    fontSize: typography.fontSize.base,
    color: colors.neutral[500],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: spacing[40],
  },
  emptyTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[800],
    marginTop: spacing[16],
    marginBottom: spacing[8],
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    color: colors.neutral[500],
    textAlign: 'center',
    lineHeight: 24,
  },
  visionsContainer: {
    padding: spacing[20],
    paddingBottom: spacing[40],
  },
  visionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: spacing[16],
    ...shadows.medium,
    overflow: 'hidden',
  },
  visionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing[16],
  },
  visionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing[12],
  },
  visionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[12],
  },
  visionHeaderText: {
    flex: 1,
  },
  visionDate: {
    fontSize: typography.fontSize.xs,
    color: colors.primary[600],
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing[4],
  },
  visionPreview: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[800],
    lineHeight: 20,
  },
  visionContent: {
    paddingHorizontal: spacing[16],
    paddingBottom: spacing[16],
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  descriptionSection: {
    marginBottom: spacing[20],
    backgroundColor: colors.neutral[50],
    borderRadius: 12,
    padding: spacing[16],
    borderLeftWidth: 3,
    borderLeftColor: colors.teal[500],
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[700],
    marginBottom: spacing[8],
  },
  descriptionText: {
    fontSize: typography.fontSize.base,
    lineHeight: 24,
    color: colors.neutral[800],
    fontStyle: 'italic',
  },
  section: {
    marginBottom: spacing[16],
  },
  tagsContainer: {
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
  domainItem: {
    backgroundColor: colors.teal[50],
    borderRadius: 8,
    padding: spacing[12],
    marginBottom: spacing[8],
    borderWidth: 1,
    borderColor: colors.teal[200],
  },
  domainTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.teal[700],
    marginBottom: spacing[4],
  },
  domainDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[800],
    lineHeight: 20,
  },
  guidingSentence: {
    backgroundColor: colors.orange[100],
    borderRadius: 8,
    padding: spacing[12],
    marginBottom: spacing[8],
    borderWidth: 1,
    borderColor: colors.orange[200],
  },
  guidingText: {
    fontSize: typography.fontSize.sm,
    color: colors.orange[800],
    fontStyle: 'italic',
    textAlign: 'center',
  },
  takeawayItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing[8],
  },
  bulletPoint: {
    fontSize: typography.fontSize.base,
    color: colors.teal[500],
    fontWeight: 'bold',
    marginRight: spacing[8],
    marginTop: spacing[2],
  },
  takeawayText: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[800],
    lineHeight: 20,
    flex: 1,
  },
  emotionalText: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[800],
    lineHeight: 20,
    fontStyle: 'italic',
  },
  wisdomText: {
    fontSize: typography.fontSize.base,
    color: colors.green[600],
    lineHeight: 22,
    fontStyle: 'italic',
    fontWeight: typography.fontWeight.medium,
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
    marginTop: spacing[8],
  },
  reflectButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
});