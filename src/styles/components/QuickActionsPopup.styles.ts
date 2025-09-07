/**
 * QuickActionsPopup Component Styles
 * Modal popup for quick action selection
 */

import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

const { width, height } = Dimensions.get('window');

export const quickActionsPopupStyles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: spacing[20],
    paddingHorizontal: spacing[20],
    paddingBottom: spacing[40],
    maxHeight: height * 0.8,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: colors.neutral[300],
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing[16],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[24],
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
  },
  closeButton: {
    padding: spacing[8],
  },
  scrollView: {
    flex: 1,
  },
  actionsGrid: {
    gap: spacing[12],
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing[12],
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    ...shadows.medium,
  },
  actionCardGradient: {
    padding: spacing[16],
    minHeight: 120,
    justifyContent: 'space-between',
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing[8],
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    overflow: 'hidden',
  },
  actionImage: {
    width: 40,
    height: 40,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    paddingHorizontal: spacing[8],
    paddingVertical: spacing[2],
  },
  categoryText: {
    fontSize: typography.fontSize['2xs'],
    color: colors.white,
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'uppercase',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    marginBottom: spacing[4],
  },
  actionDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.white,
    opacity: 0.9,
    lineHeight: 18,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing[40],
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    color: colors.neutral[500],
    textAlign: 'center',
    marginTop: spacing[16],
  },
});