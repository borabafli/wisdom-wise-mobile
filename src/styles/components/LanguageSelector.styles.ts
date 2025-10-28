import { StyleSheet, Dimensions } from 'react-native';
import { spacing } from '../tokens';

const { height } = Dimensions.get('window');

export const languageSelectorStyles = StyleSheet.create({
  selectorButton: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
    marginBottom: spacing.components.cardGap,
  },

  selectorGradient: {
    padding: spacing.components.cardGap,
    borderRadius: 18,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },

  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.components.cardGap,
  },

  languageIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
  },

  languageIconImage: {
    width: 48,
    height: 48,
  },

  languageInfo: {
    flex: 1,
  },

  languageLabel: {
    color: '#002d14',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: spacing[1],
  },

  languageSubtitle: {
    color: '#002d14',
    fontSize: 12,
    fontWeight: '400',
    opacity: 0.8,
    letterSpacing: 0.1,
  },

  languageActions: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[2],
  },

  languageName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#002d14',
    opacity: 0.9,
    letterSpacing: 0.1,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  modalBlur: {
    ...StyleSheet.absoluteFillObject,
  },

  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  sheetContainer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: spacing[5],
    paddingBottom: spacing[8],
    paddingHorizontal: spacing[6],
    maxHeight: height * 0.82,
    shadowColor: 'rgba(27, 63, 89, 0.25)',
    shadowOpacity: 0.32,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -6 },
    elevation: 16,
  },

  sheetHandle: {
    alignSelf: 'center',
    width: 58,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(43, 71, 94, 0.18)',
    marginBottom: spacing[4],
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2B475E',
    fontFamily: 'Ubuntu-Bold',
  },

  modalSubtitle: {
    marginTop: spacing[1],
    fontSize: 12,
    color: 'rgba(43, 71, 94, 0.7)',
    fontFamily: 'Ubuntu-Regular',
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(43, 71, 94, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  languageList: {
    // flex: 1, // This was causing the scrollview to collapse
  },

  languageListContent: {
    paddingBottom: spacing[2],
  },

  languageOption: {
    borderRadius: 18,
    marginBottom: spacing[3],
    overflow: 'hidden',
  },

  selectedLanguageOption: {
    borderWidth: 0, // Border removed as per request
    borderColor: 'rgba(59, 180, 245, 0.35)',
  },

  languageOptionGradient: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    borderRadius: 17,
  },

  languageOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  languageDetails: {
    flex: 1,
  },

  languageMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginTop: spacing[1],
  },

  languageOptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    fontFamily: 'Ubuntu-SemiBold',
  },

  selectedLanguageOptionName: {
    color: '#2B475E',
  },

  languageCode: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
    fontFamily: 'Ubuntu-Medium',
  },

  selectedLanguageCode: {
    color: '#2B475E',
  },

  currentBadge: {
    backgroundColor: 'rgba(59, 180, 245, 0.15)',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 999,
  },

  currentBadgeText: {
    fontSize: 10,
    color: '#2B475E',
    fontFamily: 'Ubuntu-Medium',
    letterSpacing: 0.2,
  },

  checkContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(43, 71, 94, 0.12)',
  },

  instructionsContainer: {
    marginTop: spacing[4],
    paddingTop: spacing[3],
    borderTopWidth: 1,
    borderTopColor: 'rgba(43, 71, 94, 0.1)',
  },

  instructionsText: {
    fontSize: 12,
    color: 'rgba(43, 71, 94, 0.7)',
    textAlign: 'center',
    fontFamily: 'Ubuntu-Regular',
    letterSpacing: 0.2,
  },
});

