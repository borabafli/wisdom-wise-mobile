import { StyleSheet, Dimensions } from 'react-native';
import { spacing, colors } from '../tokens';

const { width, height } = Dimensions.get('window');

export const journalScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: colors.appBackground,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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

  // Header Section - Matching ExerciseLibrary style
  header: {
    paddingHorizontal: spacing.layout.screenPadding,
    paddingTop: spacing[16],
    paddingBottom: spacing[4],
  },
  headerContent: {
    alignItems: 'flex-start',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing[2],
    marginLeft: -spacing[8],
    marginTop: -spacing[12],
  },
  headerTurtleIcon: {
    width: 162,
    height: 162,
    marginRight: spacing[4],
    marginTop: -spacing[4],
  },
  titleAndSubtitleContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: -spacing[4],
    marginTop: spacing[20],
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#002d14',
    fontFamily: 'BubblegumSans-Regular',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: spacing[1],
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6b7280',
    fontFamily: 'Inter-Medium',
    letterSpacing: 0.2,
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
    paddingTop: spacing[8], // Further reduced top padding
    paddingBottom: spacing[4], // Further reduced bottom padding
  },

  sectionTitle: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: spacing[12],
    paddingHorizontal: spacing[20],
  },

  swipableContainer: {
    height: 280,
    marginBottom: spacing[2],
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
    width: '100%',
    height: 260,
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
    left: '15%',
    backgroundColor: '#36657D',
    paddingHorizontal: spacing[16],
    paddingVertical: spacing[8],
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  promptCardButtonText: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },

  pageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing[8],
    marginBottom: spacing[4],
    gap: spacing[6],
  },

  pageIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
  },

  pageIndicatorDotActive: {
    backgroundColor: '#36657D',
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Entries Section
  entriesSection: {
    marginTop: spacing[8], // Further reduced top margin
    marginBottom: spacing[4], // Further reduced bottom margin
  },

  entryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: spacing[12],
    marginHorizontal: spacing[12],
    marginBottom: spacing[12],
  },

  entryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },

  cardContentWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing[8],
  },

  journalIcon: {
    width: 40,
    height: 40,
    marginRight: spacing[12],
    marginTop: spacing[4],
  },

  mainTextContent: {
    flex: 1,
  },

  entryHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  entryNumber: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: 18,
    color: '#36657D',
    marginRight: spacing[4],
    fontWeight: '700',
  },

  entryDate: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
    flex: 1,
  },

  entryPrompt: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
    marginBottom: spacing[4],
    lineHeight: 22,
  },

  entrySummary: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: spacing[8],
  },

  insightsPreview: {
    marginBottom: spacing[4],
  },

  insightsLabel: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 12,
    color: '#36657D',
    fontWeight: '600',
    marginBottom: spacing[8],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  insightsChipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[8],
  },

  insightsChip: {
    backgroundColor: 'rgba(54, 101, 125, 0.1)',
    borderRadius: 16,
    paddingVertical: spacing[6],
    paddingHorizontal: spacing[12],
    borderWidth: 1,
    borderColor: 'rgba(54, 101, 125, 0.2)',
  },

  insightsChipText: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: 13,
    color: '#36657D',
    fontWeight: '500',
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
    paddingVertical: spacing[24],
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