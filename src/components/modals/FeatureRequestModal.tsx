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
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Lightbulb } from 'lucide-react-native';
import { featureRequestService } from '../../services/featureRequestService';
import { featureRequestModalStyles as styles } from '../../styles/components/FeatureRequestModal.styles';

interface FeatureRequestModalProps {
  visible: boolean;
  onClose: () => void;
}

const FeatureRequestModal: React.FC<FeatureRequestModalProps> = ({
  visible,
  onClose,
}) => {
  const { t } = useTranslation();
  const [featureText, setFeatureText] = useState('');
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
    setFeatureText(text);
    setCharacterCount(text.length);
  };

  const handleSubmit = async () => {
    // Validate input
    const trimmedText = featureText.trim();

    if (trimmedText.length < 10) {
      Alert.alert(
        t('featureRequest.errorTitle'),
        t('featureRequest.tooShort')
      );
      return;
    }

    if (trimmedText.length > 500) {
      Alert.alert(
        t('featureRequest.errorTitle'),
        t('featureRequest.tooLong')
      );
      return;
    }

    // Submit the request
    setIsSubmitting(true);

    try {
      const response = await featureRequestService.submitFeatureRequest(trimmedText);

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
          setFeatureText('');
          setCharacterCount(0);
          onClose();
        }, 2500);
      } else {
        Alert.alert(
          t('featureRequest.errorTitle'),
          response.error || t('featureRequest.errorMessage')
        );
      }
    } catch (error) {
      console.error('Error submitting feature request:', error);
      Alert.alert(
        t('featureRequest.errorTitle'),
        t('featureRequest.errorMessage')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (featureText.trim().length > 0) {
      Alert.alert(
        t('featureRequest.discardTitle'),
        t('featureRequest.discardMessage'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('featureRequest.discard'),
            style: 'destructive',
            onPress: () => {
              setFeatureText('');
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

  const isValid = featureText.trim().length >= 10 && featureText.trim().length <= 500;
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
                    {t('featureRequest.successTitle')}
                  </Text>
                  <Text style={styles.successMessage}>
                    {t('featureRequest.successMessage')}
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
                        <Lightbulb size={48} color="#36657d" strokeWidth={2} />
                      </View>
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>{t('featureRequest.title')}</Text>
                    
                    {/* Description */}
                    <Text style={styles.description}>
                      {t('featureRequest.description')}
                    </Text>

                    {/* Input Section */}
                    <View style={styles.inputSection}>
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.textInput}
                          value={featureText}
                          onChangeText={handleTextChange}
                          placeholder={t('featureRequest.placeholder')}
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
                          {t('featureRequest.characterCount', { count: characterCount })}
                        </Text>

                        {showError && (
                          <Text style={styles.validationMessage}>
                            {t('featureRequest.tooShort')}
                          </Text>
                        )}
                      </View>
                    </View>

                    {/* Info Box */}
                    <View style={styles.infoBox}>
                      <Text style={styles.infoText}>
                        {t('featureRequest.infoText')}
                      </Text>
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
                        {t('featureRequest.submit')}
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
                      {t('featureRequest.cancel')}
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

export default FeatureRequestModal;
