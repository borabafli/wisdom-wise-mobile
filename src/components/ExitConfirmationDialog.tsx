import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
  Platform,
  Switch,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, MessageCircle, Square, CheckSquare } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { exitConfirmationDialogStyles as styles } from '../styles/components/ExitConfirmationDialog.styles';

interface ExitConfirmationDialogProps {
  visible: boolean;
  onConfirmExit: (skipInsights: boolean) => void;
  onCancel: () => void;
  isExerciseSession?: boolean;
}

export const ExitConfirmationDialog: React.FC<ExitConfirmationDialogProps> = ({
  visible,
  onConfirmExit,
  onCancel,
  isExerciseSession = false,
}) => {
  const { t } = useTranslation();
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [allowInsights, setAllowInsights] = useState(true); // Default ON (opt-out)

  useEffect(() => {
    if (visible) {
      // Reset toggle to ON when dialog opens
      setAllowInsights(true);
      // Animate in
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 80,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleConfirm = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onConfirmExit(!allowInsights); // Pass skipInsights (inverse of allowInsights)
    });
  };

  const handleCancel = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onCancel();
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleCancel}
    >
      <TouchableWithoutFeedback onPress={handleCancel}>
        <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]}>
          {Platform.OS === 'ios' ? (
            <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
              <TouchableWithoutFeedback>
                <Animated.View
                  style={[
                    styles.dialogContainer,
                    {
                      transform: [{ scale: scaleAnim }],
                      opacity: opacityAnim,
                    },
                  ]}
                >
                  <View style={styles.dialog}>
                    {/* Icon */}
                    <View style={styles.iconContainer}>
                      <LinearGradient
                        colors={['#E8F4F1', '#D4E8E4']}
                        style={styles.iconGradient}
                      >
                        <Sparkles size={28} color="#4A9B8E" strokeWidth={2.5} />
                      </LinearGradient>
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>
                      {isExerciseSession
                        ? t('chat.exitConfirmation.exerciseTitle')
                        : t('chat.exitConfirmation.title')}
                    </Text>

                    {/* Message */}
                    <Text style={styles.message}>
                      {isExerciseSession
                        ? t('chat.exitConfirmation.exerciseMessage')
                        : t('chat.exitConfirmation.message')}
                    </Text>

                    {/* Toggle: Allow Insights */}
                    <View style={styles.toggleContainer}>
                      <Text style={styles.toggleLabel}>
                        {t('chat.exitConfirmation.allowInsightsLabel')}
                      </Text>
                      <Switch
                        value={allowInsights}
                        onValueChange={setAllowInsights}
                        trackColor={{ false: '#D1D5DB', true: '#9CD3C9' }}
                        thumbColor={allowInsights ? '#4A9B8E' : '#F3F4F6'}
                        ios_backgroundColor="#D1D5DB"
                      />
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                      {/* Primary: Save & Exit */}
                      <TouchableOpacity
                        onPress={handleConfirm}
                        activeOpacity={0.8}
                        style={styles.primaryButtonWrapper}
                      >
                        <LinearGradient
                          colors={['#4A9B8E', '#3D8B7F']}
                          style={styles.primaryButton}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        >
                          <Sparkles size={18} color="#ffffff" strokeWidth={2.5} />
                          <Text style={styles.primaryButtonText}>
                            {t('chat.exitConfirmation.confirmButton')}
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      {/* Secondary: Keep Chatting */}
                      <TouchableOpacity
                        onPress={handleCancel}
                        activeOpacity={0.7}
                        style={styles.secondaryButton}
                      >
                        <MessageCircle size={18} color="#4A9B8E" strokeWidth={2.5} />
                        <Text style={styles.secondaryButtonText}>
                          {t('chat.exitConfirmation.cancelButton')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Animated.View>
              </TouchableWithoutFeedback>
            </BlurView>
          ) : (
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.dialogContainer,
                  {
                    transform: [{ scale: scaleAnim }],
                    opacity: opacityAnim,
                  },
                ]}
              >
                <View style={styles.dialog}>
                  {/* Icon */}
                  <View style={styles.iconContainer}>
                    <LinearGradient
                      colors={['#E8F4F1', '#D4E8E4']}
                      style={styles.iconGradient}
                    >
                      <Sparkles size={28} color="#4A9B8E" strokeWidth={2.5} />
                    </LinearGradient>
                  </View>

                  {/* Title */}
                  <Text style={styles.title}>
                    {isExerciseSession
                      ? t('chat.exitConfirmation.exerciseTitle')
                      : t('chat.exitConfirmation.title')}
                  </Text>

                  {/* Message */}
                  <Text style={styles.message}>
                    {isExerciseSession
                      ? t('chat.exitConfirmation.exerciseMessage')
                      : t('chat.exitConfirmation.message')}
                  </Text>

                  {/* Toggle: Allow Insights */}
                  <View style={styles.toggleContainer}>
                    <Text style={styles.toggleLabel}>
                      {t('chat.exitConfirmation.allowInsightsLabel')}
                    </Text>
                    <Switch
                      value={allowInsights}
                      onValueChange={setAllowInsights}
                      trackColor={{ false: '#D1D5DB', true: '#9CD3C9' }}
                      thumbColor={allowInsights ? '#4A9B8E' : '#F3F4F6'}
                      ios_backgroundColor="#D1D5DB"
                    />
                  </View>

                  {/* Buttons */}
                  <View style={styles.buttonContainer}>
                    {/* Primary: Save & Exit */}
                    <TouchableOpacity
                      onPress={handleConfirm}
                      activeOpacity={0.8}
                      style={styles.primaryButtonWrapper}
                    >
                      <LinearGradient
                        colors={['#4A9B8E', '#3D8B7F']}
                        style={styles.primaryButton}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Sparkles size={18} color="#ffffff" strokeWidth={2.5} />
                        <Text style={styles.primaryButtonText}>
                          {t('chat.exitConfirmation.confirmButton')}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    {/* Secondary: Keep Chatting */}
                    <TouchableOpacity
                      onPress={handleCancel}
                      activeOpacity={0.7}
                      style={styles.secondaryButton}
                    >
                      <MessageCircle size={18} color="#4A9B8E" strokeWidth={2.5} />
                      <Text style={styles.secondaryButtonText}>
                        {t('chat.exitConfirmation.cancelButton')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          )}
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
