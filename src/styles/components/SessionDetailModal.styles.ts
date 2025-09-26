/**
 * SessionDetailModal Component Styles
 * Following design principles: calm, accessible, therapeutic
 */

import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

const { width, height } = Dimensions.get('window');

export const sessionDetailModalStyles = StyleSheet.create({
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
  
  // Header Section - Following "Calm is Our Canvas" principle
  header: {
    paddingHorizontal: spacing.layout.screenPadding, // Generous breathing room (24px)
    paddingVertical: spacing.components.cardPadding,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(107, 179, 165, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[4],
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Ubuntu-Bold',
    color: '#2D3436',
    fontWeight: '700',
    marginBottom: spacing[1],
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Ubuntu-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  closeButton: {
    padding: spacing[2], // Accessible touch target (48x48px minimum)
    borderRadius: spacing.radius.md, // Soft geometry (16px)
  },
  
  // Metadata Section - Using "Gradients as Emotional Transitions"
  metadataContainer: {
    marginTop: spacing[2],
  },
  metadataGradient: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(107, 179, 165, 0.2)',
  },
  metadataContent: {
    padding: spacing.components.cardPadding, // Breathing room (24px)
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    minWidth: 80,
  },
  metadataText: {
    fontSize: 13,
    fontFamily: 'Ubuntu-Medium',
    color: '#4A9B8E',
    fontWeight: '500',
  },
  
  // Messages Section
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: spacing.layout.screenPadding,
    paddingVertical: spacing[4],
    paddingBottom: spacing[8], // Extra bottom padding for comfort
  },
  messagesList: {
    gap: spacing[4], // Generous spacing between messages
  },
  messageWrapper: {
    // Additional wrapper for potential future enhancements
  },
  
  // Empty State - Following "Progressive Disclosure" principle
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[15],
    paddingHorizontal: spacing[6],
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Ubuntu-Medium',
    color: '#2D3436',
    fontWeight: '500',
    marginTop: spacing.components.cardGap,
    marginBottom: spacing[2],
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Ubuntu-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: spacing[4],
  },
  
  // Footer - Gentle guidance following "Typography That Comforts"
  footer: {
    paddingHorizontal: spacing.layout.screenPadding,
    paddingVertical: spacing[4],
    borderTopWidth: 1,
    borderTopColor: 'rgba(107, 179, 165, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Ubuntu-Light',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  
  // Read-only message styles following design principles
  // User messages - right aligned with therapeutic color palette
  userMessageContainer: {
    alignItems: 'flex-end',
    marginBottom: spacing[4],
    paddingRight: spacing[2],
  },
  userMessageBubble: {
    backgroundColor: '#4A9B8E',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: 16,
    maxWidth: '80%',
    shadowColor: 'rgba(74, 155, 142, 0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  userMessageText: {
    fontSize: 15,
    fontFamily: 'Ubuntu-Regular',
    color: '#FFFFFF',
    lineHeight: 22,
    marginBottom: spacing[1],
  },
  messageTimestamp: {
    fontSize: 11,
    fontFamily: 'Ubuntu-Light',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
  },
  
  // AI messages - left aligned with calming gradients
  aiMessageContainer: {
    alignItems: 'flex-start',
    marginBottom: spacing[4],
    paddingLeft: spacing[2],
  },
  aiMessageContent: {
    maxWidth: '85%',
  },
  aiMessageBubble: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(107, 179, 165, 0.2)',
    shadowColor: 'rgba(74, 155, 142, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  aiMessageText: {
    fontSize: 15,
    fontFamily: 'Ubuntu-Regular',
    color: '#2D3436',
    lineHeight: 22,
    marginBottom: spacing[1],
  },
  
  // Exercise messages - special styling for therapeutic exercises
  exerciseMessageContainer: {
    alignItems: 'center',
    marginBottom: spacing[4],
    paddingHorizontal: spacing[2],
  },
  exerciseMessageBubble: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(107, 179, 165, 0.3)',
    maxWidth: '90%',
    alignItems: 'center',
    shadowColor: 'rgba(74, 155, 142, 0.15)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  exerciseTitle: {
    fontSize: 16,
    fontFamily: 'Ubuntu-Bold',
    color: '#2D3436',
    fontWeight: '700',
    marginBottom: spacing[2],
    textAlign: 'center',
  },
  exerciseText: {
    fontSize: 15,
    fontFamily: 'Ubuntu-Regular',
    color: '#6B7280',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: spacing[1],
  },
});