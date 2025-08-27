import React from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable, StyleSheet } from 'react-native';
import { MessageCircle, BookOpen, Heart, PenTool } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

interface ActionPaletteProps {
  isVisible: boolean;
  onClose: () => void;
  onOptionSelect: (optionId: string) => void;
}

const ActionPalette: React.FC<ActionPaletteProps> = ({ isVisible, onClose, onOptionSelect }) => {
  const actions = [
    {
      id: 'guided-session',
      icon: MessageCircle,
      title: 'Guided Session',
      description: 'Talk with your AI therapist',
      color: ['#3b82f6', '#1d4ed8']
    },
    {
      id: 'guided-journaling',
      icon: PenTool,
      title: 'Guided Journaling',
      description: 'Reflect through writing',
      color: ['#8b5cf6', '#7c3aed']
    },
    {
      id: 'suggested-exercises',
      icon: Heart,
      title: 'Quick Exercise',
      description: 'Start a mindfulness practice',
      color: ['#06b6d4', '#0891b2']
    },
    {
      id: 'exercise-library',
      icon: BookOpen,
      title: 'Exercise Library',
      description: 'Browse all exercises',
      color: ['#10b981', '#059669']
    }
  ];

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable 
        style={styles.backdrop} 
        onPress={onClose}
      >
        <View style={styles.container}>
          <Pressable style={styles.modalContent}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.95)', 'rgba(248, 250, 252, 0.9)']}
              style={styles.gradient}
            >
              <Text style={styles.title}>
                What would you like to do?
              </Text>
              
              <View style={styles.actionsList}>
                {actions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <TouchableOpacity
                      key={action.id}
                      onPress={() => onOptionSelect(action.id)}
                      style={styles.actionButton}
                      activeOpacity={0.8}
                    >
                      <View style={styles.actionContent}>
                        <LinearGradient
                          colors={action.color}
                          style={styles.iconContainer}
                        >
                          <Icon size={24} color="white" />
                        </LinearGradient>
                        <View style={styles.textContainer}>
                          <Text style={styles.actionTitle}>
                            {action.title}
                          </Text>
                          <Text style={styles.actionDescription}>
                            {action.description}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
              
              <TouchableOpacity
                onPress={onClose}
                style={styles.cancelButton}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </LinearGradient>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
  },
  gradient: {
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e293b',
    marginBottom: 24,
  },
  actionsList: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '400',
  },
  cancelButton: {
    marginTop: 24,
    padding: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ActionPalette;