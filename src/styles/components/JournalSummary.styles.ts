import { StyleSheet } from 'react-native';
import { spacing } from '../tokens';

export const journalSummaryStyles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safeAreaWrapper: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[8],
    paddingVertical: spacing[2],
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },

  headerTitle: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 16,
    fontWeight: '600',
    color: '#2B475E',
    flex: 1,
    textAlign: 'center',
  },

  closeButton: {
    padding: spacing[8],
  },

  scrollView: {
    flex: 1,
    paddingHorizontal: spacing[16],
  },

  scrollContent: {
    paddingBottom: spacing[24],
    flexGrow: 1,
  },

  summaryCard: {
    marginTop: spacing[1],
    marginBottom: spacing[12],
    borderRadius: 20,
    paddingHorizontal: spacing[12],
    paddingBottom: spacing[1],
    paddingTop: spacing[1],
    backgroundColor: 'transparent',
  },

  summaryHeader: {
    alignItems: 'center',
    marginBottom: spacing[8],
  },

  summaryHeaderVisual: {
    alignItems: 'center',
    marginBottom: spacing[14],
  },

  summaryHeaderImage: {
    width: 88,
    height: 88,
    marginBottom: spacing[1],
  },

  summaryMainTitle: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: 22,
    fontWeight: '700',
    color: '#1F3E56',
    textAlign: 'center',
    marginBottom: spacing[2],
  },

  summarySubtitle: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 14,
    color: '#2B475E',
    textAlign: 'center',
  },

  summaryText: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: 15,
    lineHeight: 22,
    color: '#2B475E',
    textAlign: 'left',
    marginBottom: spacing[6],
  },

  insightsContainer: {
    marginTop: spacing[8],
    paddingTop: spacing[8],
    borderTopWidth: 1,
    borderTopColor: 'rgba(43, 71, 94, 0.3)',
  },

  insightsTitle: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 17,
    fontWeight: '700',
    color: '#2B475E',
    marginBottom: spacing[6],
  },

  insightText: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: 15,
    lineHeight: 20,
    color: '#2B475E',
    fontStyle: 'italic',
  },

  saveOptionsContainer: {
    paddingVertical: spacing[8],
  },

  saveOptionsTitle: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 16,
    fontWeight: '600',
    color: '#2B475E',
    textAlign: 'center',
    marginBottom: spacing[12],
  },

  saveButtonContainer: {
    borderRadius: 16,
    marginBottom: spacing[10],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: spacing[16],
    borderRadius: 16,
    gap: spacing[6],
  },

  saveButtonText: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  saveAndPolishButtonContainer: {
    borderRadius: 16,
    marginBottom: spacing[6],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  saveAndPolishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: spacing[16],
    borderRadius: 16,
    gap: spacing[6],
  },

  saveAndPolishButtonText: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  polishDescription: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: 11,
    color: 'rgba(43, 71, 94, 0.8)',
    textAlign: 'center',
    lineHeight: 15,
    fontStyle: 'italic',
    paddingHorizontal: spacing[8],
    marginTop: spacing[2],
  },
});
