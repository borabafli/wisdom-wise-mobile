import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import { Check, AlertCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useUserProfile } from '../hooks';
import { useAuth } from '../contexts';
import { useLocalization } from '../contexts/LocalizationContext';
import { editProfileModalStyles as styles } from '../styles/components/EditProfileModal.styles';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onProfileUpdated?: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ visible, onClose, onProfileUpdated }) => {
  const { t } = useLocalization();
  const { profile: userProfile, updateProfile, error } = useUserProfile();
  const { profile: authProfile, isAnonymous } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ firstName?: string }>({});
  const [hasChanges, setHasChanges] = useState(false);

  const currentProfile = isAnonymous ? userProfile : authProfile;

  useEffect(() => {
    if (visible && currentProfile) {
      setFirstName(currentProfile.firstName || currentProfile.first_name || '');
      setValidationErrors({});
      setHasChanges(false);
    } else if (visible && !currentProfile) {
      setFirstName(isAnonymous ? 'Friend' : '');
      setValidationErrors({});
      setHasChanges(false);
    }
  }, [visible, currentProfile, isAnonymous]);

  useEffect(() => {
    const currentFirstName = currentProfile?.firstName || currentProfile?.first_name || '';
    const changed = firstName !== currentFirstName;
    setHasChanges(changed);
  }, [firstName, currentProfile]);

  const validateField = (value: string) => {
    const nextErrors: { firstName?: string } = {};

    if (value.length > 0 && value.length <= 50 && /^[a-zA-Z\s\-']+$/.test(value)) {
      // Valid
    } else if (value.length < 1) {
      nextErrors.firstName = t('profile.editProfile.validation.required');
    } else if (value.length > 50) {
      nextErrors.firstName = t('profile.editProfile.validation.maxLength');
    } else {
      nextErrors.firstName = t('profile.editProfile.validation.invalidCharacters');
    }

    setValidationErrors(nextErrors);
  };

  const handleFirstNameChange = (value: string) => {
    setFirstName(value);
    validateField(value);
  };

  const canSave = () =>
    hasChanges &&
    firstName.length > 0 &&
    Object.keys(validationErrors).length === 0 &&
    !isSaving;

  const handleSave = async () => {
    if (!canSave()) return;

    setIsSaving(true);

    try {
      const trimmedFirstName = firstName.trim();

      const success = await updateProfile({
        firstName: trimmedFirstName,
        lastName: '' // Always empty since we removed last name field
      });

      if (success) {
        // Notify parent to refresh
        if (onProfileUpdated) {
          onProfileUpdated();
        }
        Alert.alert(
          t('profile.editProfile.success.title'),
          t('profile.editProfile.success.message', { name: trimmedFirstName }),
          [{ text: t('profile.editProfile.success.button'), onPress: onClose }]
        );
      } else {
        Alert.alert(t('profile.editProfile.error.title'), t('profile.editProfile.error.message'));
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      Alert.alert(t('profile.editProfile.error.title'), t('profile.editProfile.error.message'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        t('profile.editProfile.unsavedChanges.title'),
        t('profile.editProfile.unsavedChanges.message'),
        [
          { text: t('profile.editProfile.unsavedChanges.keep'), style: 'cancel' },
          { text: t('profile.editProfile.unsavedChanges.discard'), style: 'destructive', onPress: onClose }
        ]
      );
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType='fade'
      transparent
      onRequestClose={handleCancel}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleCancel} />

        <KeyboardAvoidingView
          behavior='padding'
          style={styles.keyboardAvoider}
        >
          <LinearGradient
            colors={['#F4FAFD', '#E3EEF3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.modalCard}
          >
            <View style={styles.cardInner}>
              <View style={styles.cardHeader}>
                <View style={styles.headerLeft}>
                  <View style={styles.headerIconBadge}>
                    <Image
                      source={require('../../assets/images/New Icons/15.png')}
                      style={styles.headerIconImage}
                      contentFit='contain'
                    />
                  </View>
                  <View style={styles.headerTextGroup}>
                    <Text style={styles.headerTitle}>{t('profile.editProfile.title')}</Text>
                    <Text style={styles.headerSubtitle}>{t('profile.editProfile.subtitle')}</Text>
                  </View>
                </View>

              </View>

              <Text style={styles.description}>
                {isAnonymous
                  ? t('profile.editProfile.descriptionAnon')
                  : t('profile.editProfile.descriptionUser')}
              </Text>

              <ScrollView
                style={styles.formScroll}
                contentContainerStyle={styles.form}
                keyboardShouldPersistTaps='handled'
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{t('profile.editProfile.firstNameLabel')}</Text>
                  <View
                    style={[
                      styles.inputContainer,
                      validationErrors.firstName && styles.inputError
                    ]}
                  >
                    <TextInput
                      style={styles.textInput}
                      value={firstName}
                      onChangeText={handleFirstNameChange}
                      placeholder={t('profile.editProfile.firstNamePlaceholder')}
                      placeholderTextColor='#94a3b8'
                      autoCapitalize='words'
                      autoCorrect={false}
                      returnKeyType='done'
                      maxLength={50}
                      onSubmitEditing={canSave() ? handleSave : undefined}
                    />
                  </View>
                  {validationErrors.firstName && (
                    <View style={styles.errorContainer}>
                      <AlertCircle size={14} color='#ef4444' />
                      <Text style={styles.errorText}>{validationErrors.firstName}</Text>
                    </View>
                  )}
                </View>

                {error && (
                  <View style={styles.generalErrorContainer}>
                    <AlertCircle size={16} color='#ef4444' />
                    <Text style={styles.generalErrorText}>{error}</Text>
                  </View>
                )}
              </ScrollView>

              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={handleCancel}
                  style={styles.cancelButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSave}
                  style={[styles.saveButton, !canSave() && styles.saveButtonDisabled]}
                  activeOpacity={canSave() ? 0.7 : 1}
                  disabled={!canSave()}
                >
                  <LinearGradient
                    colors={canSave() ? ['#36657D', '#2A5060'] : ['#A6B3BC', '#7B858D']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.saveButtonGradient}
                  >
                    {isSaving ? (
                      <Text style={styles.saveButtonText}>{t('common.saving')}</Text>
                    ) : (
                      <>
                        <Check size={18} color='white' />
                        <Text style={styles.saveButtonText}>{t('common.save')}</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default EditProfileModal;
