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
    paddingTop: spacing[12], // Reduced top padding
    paddingBottom: spacing[8], // Reduced bottom padding
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
    height: 300, // Further increased to ensure cards are fully visible
    marginBottom: spacing[4], // Reduced margin bottom
  },

  promptsScrollContent: {
    paddingLeft: spacing[6], // Reduced left padding to shift cards left
    paddingRight: spacing[18], // Increased right padding to balance
    alignItems: 'center', // Center cards vertically in scroll view
  },

  promptCardContainer: {
    alignItems: 'center', // Center the card within its container
    justifyContent: 'center',
    paddingRight: spacing[6], // Reduced right padding to shift cards left
  },

  promptCard: {
    width: '100%', // Full width within container
    height: 260, // Match DailyPromptCard height
    borderRadius: 20,
    overflow: 'hidden',
  },

  promptCardBackground: {
    borderRadius: 20,
  },

  promptCardTouchable: {
    flex: 1,
  },

  promptCardContent: {
    flex: 1,
    padding: spacing[16],
    justifyContent: 'space-between',
  },

  promptTextContainer: {
    position: 'absolute',
    left: '8%', // Match DailyPromptCard positioning
    top: '40%',
    width: '85%',
    maxHeight: 120,
    transform: [{ translateY: -20 }],
    flex: 1,
    justifyContent: 'center',
  },

  promptCardText: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: 16,
    lineHeight: 18, // Tighter line height like DailyPromptCard
    color: '#2D3748',
    textAlign: 'left',
    fontWeight: '500',
    flexShrink: 1,
    adjustsFontSizeToFit: true,
    numberOfLines: 0,
    minimumFontScale: 0.5,
  },

  promptCardButton: {
    position: 'absolute',
    bottom: spacing[12],
    left: '15%', // Match DailyPromptCard positioning
    backgroundColor: '#4c908b', // Match DailyPromptCard color
    paddingHorizontal: spacing[10],
    paddingVertical: spacing[5],
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  promptCardButtonText: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 13, // Match DailyPromptCard font size
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },

  pageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing[8], // Reduced top margin
    marginBottom: spacing[4], // Reduced bottom margin
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
    marginTop: spacing[12], // Reduced top margin
    marginBottom: spacing[8], // Reduced bottom margin
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