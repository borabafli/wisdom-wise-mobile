import React from 'react';
import { View, Text, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { X, Heart, Brain, Wind, BookOpen, Zap, Mic } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

interface QuickActionsPopupProps {
  visible: boolean;
  onClose: () => void;
  onActionSelect: (action: string) => void;
}

const QuickActionsPopup: React.FC<QuickActionsPopupProps> = ({
  visible,
  onClose,
  onActionSelect,
}) => {
  const { t } = useTranslation();

  const quickActions = [
    {
      id: 'breathing',
      title: t('quickActions.breathing.title'),
      description: t('quickActions.breathing.description'),
      icon: require('../../assets/images/New Icons/icon-1.png'),
      category: t('quickActions.breathing.category'),
    },
    {
      id: 'gratitude',
      title: t('quickActions.gratitude.title'),
      description: t('quickActions.gratitude.description'),
      icon: require('../../assets/images/New Icons/icon-2.png'),
      category: t('quickActions.gratitude.category'),
    },
    {
      id: 'meditation',
      title: t('quickActions.meditation.title'),
      description: t('quickActions.meditation.description'),
      icon: require('../../assets/images/New Icons/icon-3.png'),
      category: t('quickActions.meditation.category'),
    },
    {
      id: 'journaling',
      title: t('quickActions.journaling.title'),
      description: t('quickActions.journaling.description'),
      icon: require('../../assets/images/New Icons/icon-4.png'),
      category: t('quickActions.journaling.category'),
    },
    {
      id: 'stress-relief',
      title: t('quickActions.stressRelief.title'),
      description: t('quickActions.stressRelief.description'),
      icon: require('../../assets/images/New Icons/icon-5.png'),
      category: t('quickActions.stressRelief.category'),
    },
    {
      id: 'voice-session',
      title: t('quickActions.voiceSession.title'),
      description: t('quickActions.voiceSession.description'),
      icon: require('../../assets/images/New Icons/icon-6.png'),
      category: t('quickActions.voiceSession.category'),
    },
  ];

  // Don't render anything if not visible
  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.overlayBackground} 
          activeOpacity={1}
          onPress={onClose}
        />
        
        <View style={styles.popupContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t('quickActions.title')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          
          {/* Featured Action */}
          <TouchableOpacity 
            style={styles.featuredAction}
            onPress={() => {
              onActionSelect('featured-breathing');
              onClose();
            }}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#D8E9E9', '#E7F3F1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featuredActionGradient}
            >
              <View style={styles.featuredActionLeft}>
                <View style={styles.featuredActionIcon}>
                  <Image 
                    source={require('../../assets/images/New Icons/icon-1.png')}
                    style={styles.featuredActionIconImage}
                    contentFit="contain"
                  />
                </View>
              </View>
              <View style={styles.featuredActionRight}>
                <Text style={styles.featuredActionCategory}>{t('quickActions.recommended')}</Text>
                <Text style={styles.featuredActionTitle}>{t('quickActions.deepBreathing')}</Text>
                <Text style={styles.featuredActionDescription}>
                  {t('quickActions.startDescription')}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
          
          {/* Actions Grid */}
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={() => {
                  onActionSelect(action.id);
                  onClose();
                }}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#D8E9E9', '#E7F3F1']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionCardGradient}
                >
                  <View style={styles.actionIconContainer}>
                    <Image 
                      source={action.icon}
                      style={styles.actionIconImage}
                      contentFit="contain"
                    />
                  </View>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionDescription}>{action.description}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Quick Start Button */}
          <TouchableOpacity 
            style={styles.quickStartButton}
            onPress={() => {
              onActionSelect('chat');
              onClose();
            }}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#04CCEF', '#0898D3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.quickStartGradient}
            >
              <Mic size={20} color="#ffffff" />
              <Text style={styles.quickStartText}>{t('quickActions.startVoiceSession')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  overlayBackground: {
    flex: 1,
  },
  popupContainer: {
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: height * 0.8,
  },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#002d14',
    fontFamily: 'BubblegumSans-Regular',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  closeButton: {
    padding: 4,
  },
  
  // Featured Action
  featuredAction: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    marginBottom: 24,
    overflow: 'hidden' as const,
  },
  featuredActionGradient: {
    flexDirection: 'row' as const,
    padding: 16,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  featuredActionLeft: {
    marginRight: 16,
  },
  featuredActionIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  featuredActionIconImage: {
    width: 64,
    height: 64,
  },
  featuredActionRight: {
    flex: 1,
  },
  featuredActionCategory: {
    fontSize: 11,
    color: '#002d14',
    fontWeight: '500' as const,
    marginBottom: 4,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.4,
    opacity: 0.7,
  },
  featuredActionTitle: {
    fontSize: 20,
    color: '#002d14',
    fontWeight: 'bold' as const,
    fontFamily: 'Poppins-Bold',
    marginBottom: 6,
    letterSpacing: -0.3,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  featuredActionDescription: {
    fontSize: 12,
    color: '#002d14',
    fontWeight: '400' as const,
    lineHeight: 17,
    opacity: 0.8,
    letterSpacing: 0.1,
  },
  
  // Actions Grid
  actionsGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    width: (width - 52) / 2, // Account for padding and gap
    backgroundColor: 'transparent',
    borderRadius: 20,
    overflow: 'hidden' as const,
  },
  actionCardGradient: {
    padding: 16,
    alignItems: 'center' as const,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  actionIconContainer: {
    marginBottom: 12,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  actionIconImage: {
    width: 48,
    height: 48,
  },
  actionTitle: {
    fontSize: 16,
    color: '#002d14',
    fontWeight: 'bold' as const,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center' as const,
    marginBottom: 4,
    letterSpacing: -0.3,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  actionDescription: {
    fontSize: 11,
    color: '#002d14',
    fontWeight: '400' as const,
    textAlign: 'center' as const,
    lineHeight: 16,
    opacity: 0.8,
    letterSpacing: 0.1,
  },
  
  // Quick Start Button
  quickStartButton: {
    borderRadius: 16,
    overflow: 'hidden' as const,
  },
  quickStartGradient: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  quickStartText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#ffffff',
  },
};

export default QuickActionsPopup;