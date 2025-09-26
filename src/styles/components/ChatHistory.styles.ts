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
    backgroundColor: 'rgba(255, 181, 160, 0.15)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 181, 160, 0.3)',
  },
  clearAllText: {
    color: '#FFB5A0',
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
    marginBottom: spacing.components.cardGap,
    borderRadius: 16,
    shadowColor: 'rgba(74, 155, 142, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  sessionGradient: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(107, 179, 165, 0.2)',
  },
  sessionContent: {
    padding: spacing.components.cardPadding,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[3],
  },
  sessionDate: {
    fontSize: 13,
    fontFamily: 'Ubuntu-Medium',
    fontWeight: '500',
    color: '#4A9B8E',
    flex: 1,
    marginLeft: spacing[2],
  },
  deleteButton: {
    padding: spacing[1],
  },
  sessionPreview: {
    fontSize: 15,
    fontFamily: 'Ubuntu-Regular',
    color: '#2D3436',
    lineHeight: 22,
    marginBottom: spacing[3],
  },
  sessionMeta: {
    flexDirection: 'row',
    gap: spacing.components.cardGap,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'Ubuntu-Light',
    color: '#6B7280',
  },
});
