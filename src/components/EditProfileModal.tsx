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
import { editProfileModalStyles as styles } from '../styles/components/EditProfileModal.styles';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onProfileUpdated?: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ visible, onClose, onProfileUpdated }) => {
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
      nextErrors.firstName = 'First name is required';
    } else if (value.length > 50) {
      nextErrors.firstName = 'First name must be 50 characters or less';
    } else {
      nextErrors.firstName = 'Only letters, spaces, hyphens, and apostrophes are allowed';
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
          'Profile Updated',
          `Your profile has been updated successfully! Anu will now address you as ${trimmedFirstName}.`,
          [{ text: 'Great!', onPress: onClose }]
        );
      } else {
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to close without saving?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: onClose }
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
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                    <Text style={styles.headerSubtitle}>Refresh how Anu greets you across the app.</Text>
                  </View>
                </View>

              </View>

              <Text style={styles.description}>
                {isAnonymous
                  ? 'Customize your friendly alias so Anu can keep supporting you with a personal touch.'
                  : 'Keep your details current so guidance, insights, and reminders feel tailored to you.'}
              </Text>

              <ScrollView
                style={styles.formScroll}
                contentContainerStyle={styles.form}
                keyboardShouldPersistTaps='handled'
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>First Name</Text>
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
                      placeholder='Enter your first name'
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
                  <Text style={styles.cancelButtonText}>Cancel</Text>
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
                      <Text style={styles.saveButtonText}>Saving...</Text>
                    ) : (
                      <>
                        <Check size={18} color='white' />
                        <Text style={styles.saveButtonText}>Save</Text>
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
