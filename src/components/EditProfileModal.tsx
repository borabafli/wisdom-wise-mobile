import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaWrapper } from './SafeAreaWrapper';
import { X, User, Check, AlertCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserProfile } from '../hooks';
import { useAuth } from '../contexts';
import { editProfileModalStyles as styles } from '../styles/components/EditProfileModal.styles';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ visible, onClose }) => {
  const { profile: userProfile, updateProfile, isLoading, error } = useUserProfile();
  const { profile: authProfile, isAnonymous } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{firstName?: string; lastName?: string}>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Use auth profile for authenticated users, userProfile for local storage
  const currentProfile = isAnonymous ? userProfile : authProfile;

  // Initialize form with current profile data
  useEffect(() => {
    if (visible && currentProfile) {
      setFirstName(currentProfile.firstName || currentProfile.first_name || '');
      setLastName(currentProfile.lastName || currentProfile.last_name || '');
      setValidationErrors({});
      setHasChanges(false);
    } else if (visible && !currentProfile) {
      // New profile - start with empty fields or default for anonymous
      setFirstName(isAnonymous ? 'Friend' : '');
      setLastName('');
      setValidationErrors({});
      setHasChanges(false);
    }
  }, [visible, currentProfile, isAnonymous]);

  // Track changes
  useEffect(() => {
    const currentFirstName = currentProfile?.firstName || currentProfile?.first_name || '';
    const currentLastName = currentProfile?.lastName || currentProfile?.last_name || '';
    const hasChanged = firstName !== currentFirstName || lastName !== currentLastName;
    setHasChanges(hasChanged);
  }, [firstName, lastName, currentProfile]);

  // Validate input in real-time
  const validateField = (field: 'firstName' | 'lastName', value: string) => {
    const errors = { ...validationErrors };
    
    if (value.length < 1) {
      errors[field] = `${field === 'firstName' ? 'First' : 'Last'} name is required`;
    } else if (value.length > 50) {
      errors[field] = `${field === 'firstName' ? 'First' : 'Last'} name must be 50 characters or less`;
    } else if (!/^[a-zA-Z\s\-']+$/.test(value)) {
      errors[field] = 'Only letters, spaces, hyphens, and apostrophes are allowed';
    } else {
      delete errors[field];
    }
    
    setValidationErrors(errors);
  };

  const handleFirstNameChange = (value: string) => {
    setFirstName(value);
    validateField('firstName', value);
  };

  const handleLastNameChange = (value: string) => {
    setLastName(value);
    validateField('lastName', value);
  };

  const canSave = () => {
    return hasChanges && 
           firstName.length > 0 && 
           lastName.length > 0 && 
           Object.keys(validationErrors).length === 0 &&
           !isSaving;
  };

  const handleSave = async () => {
    if (!canSave()) return;

    setIsSaving(true);
    
    try {
      const success = await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim()
      });

      if (success) {
        Alert.alert(
          'Profile Updated',
          `Your profile has been updated successfully! Anu will now address you as ${firstName}.`,
          [
            {
              text: 'Great!',
              onPress: onClose
            }
          ]
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
          { 
            text: 'Discard', 
            style: 'destructive',
            onPress: onClose
          }
        ]
      );
    } else {
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaWrapper style={styles.container}>
        <LinearGradient
          colors={['#f0f9ff', '#e0f2fe']}
          style={styles.backgroundGradient}
        />

        <KeyboardAvoidingView 
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <X size={24} color="#475569" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            
            {/* Profile Icon */}
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={['#3b82f6', '#0ea5e9']}
                style={styles.iconGradient}
              >
                <User size={32} color="white" />
              </LinearGradient>
            </View>

            {/* Description */}
            <Text style={styles.description}>
              {isAnonymous 
                ? "Customize what Anu calls you during your sessions. Your profile is stored locally on your device."
                : "Let Anu, your turtle therapist, know what to call you during your sessions."
              }
            </Text>

            {/* Form */}
            <View style={styles.form}>
              
              {/* First Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>First Name</Text>
                <View style={[
                  styles.inputContainer,
                  validationErrors.firstName && styles.inputError
                ]}>
                  <TextInput
                    style={styles.textInput}
                    value={firstName}
                    onChangeText={handleFirstNameChange}
                    placeholder="Enter your first name"
                    placeholderTextColor="#9ca3af"
                    autoCapitalize="words"
                    autoCorrect={false}
                    returnKeyType="next"
                    maxLength={50}
                  />
                </View>
                {validationErrors.firstName && (
                  <View style={styles.errorContainer}>
                    <AlertCircle size={14} color="#ef4444" />
                    <Text style={styles.errorText}>{validationErrors.firstName}</Text>
                  </View>
                )}
              </View>

              {/* Last Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Last Name</Text>
                <View style={[
                  styles.inputContainer,
                  validationErrors.lastName && styles.inputError
                ]}>
                  <TextInput
                    style={styles.textInput}
                    value={lastName}
                    onChangeText={handleLastNameChange}
                    placeholder="Enter your last name"
                    placeholderTextColor="#9ca3af"
                    autoCapitalize="words"
                    autoCorrect={false}
                    returnKeyType="done"
                    maxLength={50}
                    onSubmitEditing={canSave() ? handleSave : undefined}
                  />
                </View>
                {validationErrors.lastName && (
                  <View style={styles.errorContainer}>
                    <AlertCircle size={14} color="#ef4444" />
                    <Text style={styles.errorText}>{validationErrors.lastName}</Text>
                  </View>
                )}
              </View>

              {/* General Error */}
              {error && (
                <View style={styles.generalErrorContainer}>
                  <AlertCircle size={16} color="#ef4444" />
                  <Text style={styles.generalErrorText}>{error}</Text>
                </View>
              )}

            </View>

            {/* Actions */}
            <View style={styles.actions}>
              
              {/* Cancel Button */}
              <TouchableOpacity
                onPress={handleCancel}
                style={styles.cancelButton}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['rgba(243, 244, 246, 0.9)', 'rgba(229, 231, 235, 0.9)']}
                  style={styles.cancelButtonGradient}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Save Button */}
              <TouchableOpacity
                onPress={handleSave}
                style={[
                  styles.saveButton,
                  !canSave() && styles.saveButtonDisabled
                ]}
                activeOpacity={canSave() ? 0.7 : 1}
                disabled={!canSave()}
              >
                <LinearGradient
                  colors={canSave() 
                    ? ['rgba(59, 130, 246, 0.9)', 'rgba(37, 99, 235, 0.9)']
                    : ['rgba(156, 163, 175, 0.9)', 'rgba(107, 114, 128, 0.9)']
                  }
                  style={styles.saveButtonGradient}
                >
                  {isSaving ? (
                    <Text style={styles.saveButtonText}>Saving...</Text>
                  ) : (
                    <>
                      <Check size={18} color="white" />
                      <Text style={styles.saveButtonText}>Save Changes</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

            </View>

          </View>
        </KeyboardAvoidingView>
      </SafeAreaWrapper>
    </Modal>
  );
};

export default EditProfileModal;