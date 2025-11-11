import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../tokens/colors';
import { typography } from '../tokens/typography';
import { spacing } from '../tokens/spacing';
import { shadows } from '../tokens/shadows';

const { width } = Dimensions.get('window');

export const ITEM_HEIGHT = width > 400 ? 42 : 38; // Reduced height for compactness
const VISIBLE_ITEMS = 3; // Fewer items for compact design

export const wheelTimePickerStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  wheelPickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
  },

  wheelColumn: {
    width: width > 400 ? 60 : 55, // Much smaller column width
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    position: 'relative',
    alignItems: 'center',
    // Remove zIndex to ensure proper touch handling
  },

  focusBand: {
    position: 'absolute',
    top: ITEM_HEIGHT * 1, // Center position for 3 visible items (middle item)
    left: -40, // Extend beyond container to left
    right: -40, // Extend beyond container to right
    height: ITEM_HEIGHT,
    backgroundColor: 'rgba(91, 163, 184, 0.15)', // More subtle opacity
    borderRadius: 8,
  },

  wheelScroll: {
    flex: 1,
    width: '100%',
  },

  wheelScrollContent: {
    alignItems: 'center',
  },

  wheelItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },

  wheelItemText: {
    ...typography.body.lg,
    fontSize: 16,
    fontWeight: '500',
    color: '#36657D',
    fontFamily: 'Ubuntu-Medium',
    textAlign: 'center',
  },

  wheelItemTextSelected: {
    fontSize: width > 400 ? 18 : 17,
    fontWeight: '700',
    color: '#36657D',
    fontFamily: 'Ubuntu-Medium',
  },

  wheelItemTextFaded: {
    fontSize: 13, // Even smaller faded text
    fontWeight: '400',
    color: colors.text.light,
    fontFamily: typography.fontFamily.alanSansSemiBold, // Match notification screen
    opacity: 0.5,
    // No shadows
  },

  separator: {
    fontSize: 20,
    fontWeight: '700',
    color: '#36657D',
    marginHorizontal: spacing[6],
    fontFamily: 'Ubuntu-Medium',
    alignSelf: 'center',
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    textAlignVertical: 'center',
    lineHeight: ITEM_HEIGHT * VISIBLE_ITEMS,
  },
});