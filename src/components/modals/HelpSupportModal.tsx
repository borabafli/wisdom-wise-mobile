import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  Animated,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react-native';
import { featureRequestService } from '../../services/featureRequestService';
import { helpSupportModalStyles as styles } from '../../styles/components/HelpSupportModal.styles';

interface HelpSupportModalProps {
  visible: boolean;
  onClose: () => void;
}

const HelpSupportModal: React.FC<HelpSupportModalProps> = ({
  visible,
  onClose,
}) => {
  const { t } = useTranslation();
  const [messageText, setMessageText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const successFadeAnim = useRef(new Animated.Value(0)).current;
  const successScaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      fadeAnim.setValue(0);
      slideAnim.setValue(30);

      // Entrance animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleTextChange = (text: string) => {
    setMessageText(text);
    setCharacterCount(text.length);
  };

  const handleSubmit = async () => {
    // Validate input
    const trimmedText = messageText.trim();

    if (trimmedText.length < 10) {
      Alert.alert(
        t('helpSupport.errorTitle'),
        t('helpSupport.tooShort')
      );
      return;
    }

    if (trimmedText.length > 500) {
      Alert.alert(
        t('helpSupport.errorTitle'),
        t('helpSupport.tooLong')
      );
      return;
    }

    // Submit the request with _help_ prefix
    setIsSubmitting(true);

    try {
      const prefixedMessage = `_help_ ${trimmedText}`;
      const response = await featureRequestService.submitFeatureRequest(prefixedMessage);

      if (response.success) {
        // Show success animation
        setShowSuccess(true);

        // Animate success screen
        Animated.parallel([
          Animated.timing(successFadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(successScaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ]).start();

        // Auto-close after showing success
        setTimeout(() => {
          setShowSuccess(false);
          successFadeAnim.setValue(0);
          successScaleAnim.setValue(0.8);
          setMessageText('');
          setCharacterCount(0);
          onClose();
        }, 2500);
      } else {
        Alert.alert(
          t('helpSupport.errorTitle'),
          response.error || t('helpSupport.errorMessage')
        );
      }
    } catch (error) {
      console.error('Error submitting help request:', error);
      Alert.alert(
        t('helpSupport.errorTitle'),
        t('helpSupport.errorMessage')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (messageText.trim().length > 0) {
      Alert.alert(
        t('helpSupport.discardTitle'),
        t('helpSupport.discardMessage'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('helpSupport.discard'),
            style: 'destructive',
            onPress: () => {
              setMessageText('');
              setCharacterCount(0);
              onClose();
            },
          },
        ]
      );
    } else {
      onClose();
    }
  };

  const isValid = messageText.trim().length >= 10 && messageText.trim().length <= 500;
  const showError = characterCount > 0 && characterCount < 10;
  const showWarning = characterCount > 450;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <ImageBackground
        source={require('../../../assets/images/background1.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            style={styles.keyboardContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            {showSuccess ? (
              // Success Screen
              <Animated.View
                style={[
                  styles.successContainer,
                  {
                    opacity: successFadeAnim,
                    transform: [{ scale: successScaleAnim }],
                  },
                ]}
              >
                <View style={styles.successContent}>
                  <View style={styles.successIconContainer}>
                    <Image
                      source={require('../../../assets/images/turtle-simple-3a.png')}
                      style={styles.successTurtle}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.successTitle}>
                    {t('helpSupport.successTitle')}
                  </Text>
                  <Text style={styles.successMessage}>
                    {t('helpSupport.successMessage')}
                  </Text>
                </View>
              </Animated.View>
            ) : (
              <>
                {/* Header */}
                <View style={styles.header}>
                  <TouchableOpacity onPress={handleClose} style={styles.backButton}>
                    <ChevronLeft size={24} color="#36657d" />
                  </TouchableOpacity>
                  <View style={styles.headerPlaceholder} />
                </View>

                <ScrollView
                  style={styles.scrollContainer}
                  contentContainerStyle={styles.scrollContent}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  <Animated.View
                    style={[
                      styles.contentContainer,
                      {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                      },
                    ]}
                  >
                    {/* Icon Section */}
                    <View style={styles.iconContainer}>
                      <View style={styles.iconCircle}>
                        <Image
                          source={require('../../../assets/images/New Icons/icon-16.png')}
                          style={styles.iconImage}
                          contentFit="contain"
                        />
                      </View>
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>{t('helpSupport.title')}</Text>

                    {/* Description */}
                    <Text style={styles.description}>
                      {t('helpSupport.description')}
                    </Text>

                    {/* Input Section */}
                    <View style={styles.inputSection}>
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.textInput}
                          value={messageText}
                          onChangeText={handleTextChange}
                          placeholder={t('helpSupport.placeholder')}
                          placeholderTextColor="#9CA3AF"
                          multiline
                          maxLength={500}
                          textAlignVertical="top"
                          autoFocus={false}
                          editable={!isSubmitting}
                        />
                      </View>

                      <View style={styles.inputFooter}>
                        <Text
                          style={[
                            styles.characterCount,
                            showError && styles.characterCountError,
                            showWarning && styles.characterCountWarning,
                          ]}
                        >
                          {t('helpSupport.characterCount', { count: characterCount })}
                        </Text>

                        {showError && (
                          <Text style={styles.validationMessage}>
                            {t('helpSupport.tooShort')}
                          </Text>
                        )}
                      </View>
                    </View>

                  </Animated.View>
                </ScrollView>

                {/* Footer with Buttons */}
                <View style={styles.footer}>
                  <TouchableOpacity
                    style={[
                      styles.primaryButton,
                      (!isValid || isSubmitting) && styles.primaryButtonDisabled,
                    ]}
                    onPress={handleSubmit}
                    activeOpacity={0.8}
                    disabled={!isValid || isSubmitting}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text style={styles.primaryButtonText}>
                        {t('helpSupport.submit')}
                      </Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={handleClose}
                    activeOpacity={0.8}
                    disabled={isSubmitting}
                  >
                    <Text style={styles.secondaryButtonText}>
                      {t('helpSupport.cancel')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>
    </Modal>
  );
};

export default HelpSupportModal;
