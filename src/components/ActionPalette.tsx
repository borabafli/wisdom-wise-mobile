import React from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable, GestureResponderEvent } from 'react-native';
import { MessageCircle, BookOpen, Heart, PenTool } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { actionPaletteStyles as styles } from '../styles/components/ActionPalette.styles';
import { colors, gradients } from '../styles/tokens';

interface ActionPaletteProps {
  isVisible: boolean;
  onClose: () => void;
  onOptionSelect: (optionId: string) => void;
}

const ActionPalette: React.FC<ActionPaletteProps> = ({ isVisible, onClose, onOptionSelect }) => {
  const { t } = useTranslation();

  const actions = [
    {
      id: 'guided-session',
      iconImage: require('../../assets/images/New Icons/icon-1.png'),
      title: t('actionPalette.guidedSession.title'),
      description: t('actionPalette.guidedSession.description')
    },
    {
      id: 'guided-journaling',
      iconImage: require('../../assets/images/New Icons/icon-2.png'),
      title: t('actionPalette.guidedJournaling.title'),
      description: t('actionPalette.guidedJournaling.description')
    },
    {
      id: 'suggested-exercises',
      iconImage: require('../../assets/images/New Icons/icon-3.png'),
      title: t('actionPalette.quickExercise.title'),
      description: t('actionPalette.quickExercise.description')
    },
    {
      id: 'exercise-library',
      iconImage: require('../../assets/images/New Icons/icon-4.png'),
      title: t('actionPalette.exerciseLibrary.title'),
      description: t('actionPalette.exerciseLibrary.description')
    }
  ];

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable 
          style={styles.backdropTouchable}
          onPress={onClose}
        />
        <View style={styles.container}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.8)', '#F8FAFC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.gradient}
            >
              <Text style={styles.title}>
                {t('actionPalette.title')}
              </Text>
              
              <View style={styles.actionsList}>
                {actions.map((action, index) => {
                  return (
                    <TouchableOpacity
                      key={action.id}
                      onPress={() => onOptionSelect(action.id)}
                      style={styles.actionButton}
                      activeOpacity={0.9}
                    >
                      <LinearGradient
                        colors={['#D8E9E9', '#E7F3F1']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.actionCardGradient}
                      >
                        <View style={styles.actionContent}>
                          <View style={styles.iconContainer}>
                            <Image 
                              source={action.iconImage}
                              style={styles.iconImage}
                              contentFit="contain"
                            />
                          </View>
                          <View style={styles.textContainer}>
                            <Text style={styles.actionTitle}>
                              {action.title}
                            </Text>
                            <Text style={styles.actionDescription}>
                              {action.description}
                            </Text>
                          </View>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  );
                })}
              </View>
              
              <TouchableOpacity
                onPress={onClose}
                style={styles.cancelButton}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelText}>{t('actionPalette.cancel')}</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </View>
    </Modal>
  );
};


export default ActionPalette;