import { StyleSheet, Dimensions } from 'react-native';
import { spacing, colors } from '../tokens';

const { width, height } = Dimensions.get('window');

export const journalScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: 16,
    color: '#6B7280',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[20],
    paddingVertical: spacing[16],
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  headerTitle: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },

  newEntryButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },

  listContainer: {
    paddingBottom: spacing[24],
  },

  // Swipable Prompts Section
  promptsSection: {
    paddingVertical: spacing[20],
  },

  sectionTitle: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: spacing[16],
    paddingHorizontal: spacing[20],
  },

  swipableContainer: {
    height: 140,
  },

  promptsScrollContent: {
    paddingHorizontal: spacing[20],
  },

  promptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing[20],
    marginRight: spacing[16],
    minHeight: 120,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  promptCardText: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: 16,
    lineHeight: 22,
    color: '#374151',
    flex: 1,
    marginBottom: spacing[12],
  },

  promptCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#065F46',
    paddingHorizontal: spacing[12],
    paddingVertical: spacing[8],
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: spacing[6],
  },

  promptCardButtonText: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  pageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing[12],
    gap: spacing[6],
  },

  pageIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
  },

  pageIndicatorDotActive: {
    backgroundColor: '#065F46',
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Entries Section
  entriesSection: {
    marginTop: spacing[24],
    marginBottom: spacing[16],
  },

  entryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: spacing[16],
    marginHorizontal: spacing[20],
    marginBottom: spacing[12],
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  entryCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[12],
  },

  entryDate: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },

  deleteButton: {
    padding: spacing[4],
  },

  entryPrompt: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
    marginBottom: spacing[8],
    lineHeight: 22,
  },

  entrySummary: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: spacing[12],
  },

  insightsPreview: {
    marginBottom: spacing[8],
  },

  insightsLabel: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 12,
    color: '#065F46',
    fontWeight: '600',
    marginBottom: spacing[4],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  insightsText: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: 13,
    color: '#059669',
    lineHeight: 18,
    fontStyle: 'italic',
  },

  polishedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: spacing[8],
    paddingVertical: spacing[4],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE047',
  },

  polishedBadgeText: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 11,
    color: '#92400E',
    fontWeight: '600',
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[48],
    paddingHorizontal: spacing[32],
  },

  emptyTitle: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: spacing[16],
    marginBottom: spacing[8],
    textAlign: 'center',
  },

  emptyText: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});