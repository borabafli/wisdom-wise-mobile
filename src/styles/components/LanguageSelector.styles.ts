import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

const { width, height } = Dimensions.get('window');

export const languageSelectorStyles = StyleSheet.create({
  // Selector Button
  selectorButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    marginVertical: spacing[2],
    borderWidth: 1,
    borderColor: 'rgba(43, 71, 94, 0.1)',
    ...shadows.card,
  },

  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  globeIcon: {
    marginRight: spacing[3],
  },

  languageInfo: {
    flex: 1,
  },

  languageLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    fontFamily: 'Ubuntu-Medium',
    marginBottom: 2,
  },

  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2B475E',
    fontFamily: 'Ubuntu-SemiBold',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },

  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.8,
    minHeight: 400, // Ensure minimum height for Android
    paddingBottom: spacing[6],
    elevation: 10, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[5],
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2B475E',
    fontFamily: 'Ubuntu-Bold',
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeButtonText: {
    fontSize: 20,
    color: '#6B7280',
    fontWeight: '400',
  },

  // Language List
  languageList: {
    flex: 1,
    paddingHorizontal: spacing[6],
    minHeight: 300, // Ensure minimum height for Android
  },

  languageOption: {
    borderRadius: 12,
    marginVertical: spacing[1],
    overflow: 'hidden',
    backgroundColor: '#FFFFFF', // Explicit background for Android
    elevation: 1, // Small elevation for Android visibility
  },

  selectedLanguageOption: {
    borderWidth: 1,
    borderColor: 'rgba(43, 71, 94, 0.2)',
  },

  languageOptionGradient: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
  },

  languageOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  languageDetails: {
    flex: 1,
  },

  languageOptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    fontFamily: 'Ubuntu-SemiBold',
    marginBottom: 2,
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
    color: '#6B7280',
  },

  checkContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Instructions
  instructionsContainer: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[4],
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },

  instructionsText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontFamily: 'Ubuntu-Regular',
  },
});