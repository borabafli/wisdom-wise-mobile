import React from 'react';
import { View, Text, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { X, Heart, Brain, Wind, BookOpen, Zap, Mic } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';

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
  const quickActions = [
    {
      id: 'breathing',
      title: 'Breathing Exercise',
      description: 'Quick 3-minute breathing exercise',
      icon: require('../../assets/images/new-icon4.png'),
      category: 'Wellness',
    },
    {
      id: 'gratitude',
      title: 'Gratitude Practice',
      description: 'Daily gratitude reflection',
      icon: require('../../assets/images/new-icon5.png'),
      category: 'Mindfulness',
    },
    {
      id: 'meditation',
      title: 'Quick Meditation',
      description: '5-minute mindful meditation',
      icon: require('../../assets/images/new-icon6.png'),
      category: 'Meditation',
    },
    {
      id: 'journaling',
      title: 'Mood Check-in',
      description: 'Track how you\'re feeling',
      icon: require('../../assets/images/new-icon7.png'),
      category: 'Journaling',
    },
    {
      id: 'stress-relief',
      title: 'Stress Relief',
      description: 'Progressive muscle relaxation',
      icon: require('../../assets/images/new-icon8.png'),
      category: 'Wellness',
    },
    {
      id: 'voice-session',
      title: 'Voice Session',
      description: 'Talk with your AI companion',
      icon: require('../../assets/images/new-icon9.png'),
      category: 'Chat',
    },
  ];

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
            <Text style={styles.headerTitle}>Quick Actions</Text>
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
            activeOpacity={0.8}
          >
            <View style={styles.featuredActionLeft}>
              <View style={styles.featuredActionIcon}>
                <Image 
                  source={require('../../assets/images/new-icon4.png')}
                  style={styles.featuredActionIconImage}
                  contentFit="contain"
                />
              </View>
            </View>
            <View style={styles.featuredActionRight}>
              <Text style={styles.featuredActionCategory}>Recommended</Text>
              <Text style={styles.featuredActionTitle}>Deep Breathing</Text>
              <Text style={styles.featuredActionDescription}>
                Start with a calming breathing exercise to center yourself.
              </Text>
            </View>
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
                activeOpacity={0.8}
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
              <Text style={styles.quickStartText}>Start Voice Session</Text>
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
    backgroundColor: '#ffffff',
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
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  
  // Featured Action
  featuredAction: {
    flexDirection: 'row' as const,
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
    width: 40,
    height: 40,
  },
  featuredActionRight: {
    flex: 1,
  },
  featuredActionCategory: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500' as const,
    marginBottom: 4,
  },
  featuredActionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#111827',
    marginBottom: 6,
  },
  featuredActionDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
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
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  actionIconContainer: {
    marginBottom: 12,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  actionIconImage: {
    width: 64,
    height: 64,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#111827',
    textAlign: 'center' as const,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center' as const,
    lineHeight: 16,
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