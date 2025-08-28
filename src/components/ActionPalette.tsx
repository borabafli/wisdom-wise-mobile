import React from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { MessageCircle, BookOpen, Heart, PenTool } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { actionPaletteStyles as styles } from '../styles/components/ActionPalette.styles';
import { colors, gradients } from '../styles/tokens';

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
      color: gradients.button.blue
    },
    {
      id: 'guided-journaling',
      icon: PenTool,
      title: 'Guided Journaling',
      description: 'Reflect through writing',
      color: gradients.button.purple
    },
    {
      id: 'suggested-exercises',
      icon: Heart,
      title: 'Quick Exercise',
      description: 'Start a mindfulness practice',
      color: gradients.button.cyan
    },
    {
      id: 'exercise-library',
      icon: BookOpen,
      title: 'Exercise Library',
      description: 'Browse all exercises',
      color: gradients.button.emerald
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
              colors={gradients.card.primary}
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
                          <Icon size={24} color={colors.text.inverse} />
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


export default ActionPalette;