/**
 * ActionPalette Component Styles
 * Separated from component for better maintainability
 */

import { StyleSheet } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

export const actionPaletteStyles = StyleSheet.create({
  // Modal & Backdrop
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdropTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    padding: spacing.layout.screenPadding,
    width: '100%',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.white,
    borderRadius: spacing.radius['2xl'],
    ...shadows.components.modal,
  },
  gradient: {
    borderRadius: spacing.radius['2xl'],
    padding: spacing.layout.screenPadding,
    ...shadows.components.modal,
  },

  // Title
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#002d14',
    fontFamily: 'BubblegumSans-Regular',
    textAlign: 'center',
    marginBottom: spacing.layout.screenPadding,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  // Actions List
  actionsList: {
    gap: spacing.components.cardGap,
  },
  actionButton: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  actionCardGradient: {
    padding: spacing[12],
    borderRadius: 20,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.components.cardGap,
  },

  // Action Icon
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
  iconImage: {
    width: 60,
    height: 60,
  },

  // Text Content
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: 20,
    color: '#002d14',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
    marginBottom: spacing[1],
    textAlign: 'center',
    letterSpacing: -0.3,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  actionDescription: {
    fontSize: 12,
    color: '#002d14',
    fontWeight: '400',
    lineHeight: 17,
    textAlign: 'center',
    opacity: 0.8,
    letterSpacing: 0.1,
  },

  // Cancel Button
  cancelButton: {
    marginTop: spacing.layout.screenPadding,
    padding: spacing.components.cardGap,
    alignItems: 'center',
  },
  cancelText: {
    color: '#002d14',
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});