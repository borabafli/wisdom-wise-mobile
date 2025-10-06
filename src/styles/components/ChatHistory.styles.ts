/**
 * ChatHistory Component Styles
 * Separated from component for better maintainability
 */

import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

const { width, height } = Dimensions.get('window');

export const chatHistoryStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    paddingHorizontal: spacing.layout.screenPadding,
    paddingVertical: spacing.components.cardPadding,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(107, 179, 165, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Ubuntu-Bold',
    color: '#2D3436',
    fontWeight: '700',
  },
  closeButton: {
    padding: spacing[2],
  },
  clearAllButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.components.cardGap,
    paddingVertical: spacing[2],
    backgroundColor: 'rgba(128, 128, 128, 0.15)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.3)',
  },
  clearAllText: {
    color: '#6B7280',
    fontSize: 13,
    fontFamily: 'Ubuntu-Medium',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.layout.screenPadding,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[15],
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Ubuntu-Regular',
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[15],
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Ubuntu-Medium',
    fontWeight: '500',
    color: '#2D3436',
    marginTop: spacing.components.cardGap,
    marginBottom: spacing[2],
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Ubuntu-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: spacing[8],
  },
  sessionsList: {
    paddingVertical: spacing.layout.screenPadding,
  },
  sessionCard: {
    marginBottom: spacing[4],
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    marginHorizontal: spacing[4],
  },
  sessionContent: {
    padding: spacing[12],
  },
  cardContentWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing[8],
  },
  chatIcon: {
    width: 40,
    height: 40,
    marginRight: spacing[12],
    marginTop: spacing[4],
  },
  mainTextContent: {
    flex: 1,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  sessionDate: {
    fontSize: 16,
    fontFamily: 'Ubuntu-Medium',
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  deleteButton: {
    padding: spacing[4],
  },
  sessionPreview: {
    fontSize: 16,
    fontFamily: 'Ubuntu-Medium',
    fontWeight: '600',
    color: '#111827',
    lineHeight: 22,
    marginBottom: spacing[4],
  },
  sessionMeta: {
    flexDirection: 'row',
    gap: spacing[8],
    marginTop: spacing[4],
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  metaText: {
    fontSize: 13,
    fontFamily: 'Ubuntu-Medium',
    fontWeight: '500',
    color: '#36657D',
  },
});
