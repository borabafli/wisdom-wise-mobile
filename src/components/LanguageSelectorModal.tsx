import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { Check, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import {
  SUPPORTED_LANGUAGES,
  LANGUAGE_CODES,
  changeLanguage,
  getCurrentLanguage,
  getLanguageName,
} from '../services/i18nService';
import { languageSelectorStyles as styles } from '../styles/components/LanguageSelector.styles';

interface LanguageSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onLanguageChange?: (language: string) => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({ visible, onClose, onLanguageChange }) => {
  const { t } = useTranslation();
  const [pendingLanguage, setPendingLanguage] = useState<string | null>(null);
  const [isChanging, setIsChanging] = useState(false);

  const currentLanguage = getCurrentLanguage();

  const handleLanguageSelect = async (languageCode: string) => {
    if (languageCode === currentLanguage || isChanging) {
      return;
    }

    setIsChanging(true);
    setPendingLanguage(languageCode);

    try {
      await changeLanguage(languageCode);
      onLanguageChange?.(languageCode);
      onClose();
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsChanging(false);
      setPendingLanguage(null);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
      hardwareAccelerated
    >
      <View style={styles.modalOverlay}>
        <BlurView intensity={35} tint="light" style={styles.modalBlur} />
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <LinearGradient
          colors={['#f9fdff', '#f1f7fb']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.sheetContainer}
        >
          <View style={styles.sheetHandle} />

          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>{t('language.selectLanguage')}</Text>
              <Text style={styles.modalSubtitle}>{t('language.changeLanguage')}</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              accessibilityLabel={t('common.close')}
            >
              <X size={18} color="#2B475E" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.languageList}
            contentContainerStyle={styles.languageListContent}
            showsVerticalScrollIndicator={false}
          >
            {LANGUAGE_CODES.map((code) => {
              const isSelected = code === currentLanguage;
              const languageName = SUPPORTED_LANGUAGES[code as keyof typeof SUPPORTED_LANGUAGES];

              return (
                <TouchableOpacity
                  key={code}
                  style={[
                    styles.languageOption,
                    isSelected && styles.selectedLanguageOption,
                  ]}
                  onPress={() => handleLanguageSelect(code)}
                  disabled={isChanging}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={isSelected
                      ? ['rgba(59, 180, 245, 0.18)', 'rgba(67, 156, 255, 0.12)']
                      : ['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0.2)']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.languageOptionGradient}
                  >
                    <View style={styles.languageOptionContent}>
                      <View style={styles.languageDetails}>
                        <Text
                          style={[
                            styles.languageOptionName,
                            isSelected && styles.selectedLanguageOptionName,
                          ]}
                        >
                          {String(languageName)}
                        </Text>
                        <View style={styles.languageMetaRow}>
                          <Text
                            style={[
                              styles.languageCode,
                              isSelected && styles.selectedLanguageCode,
                            ]}
                          >
                            {String(code.toUpperCase())}
                          </Text>
                          {isSelected && (
                            <View style={styles.currentBadge}>
                              <Text style={styles.currentBadgeText}>
                                {t('language.currentLanguage')}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>

                      {isSelected ? (
                        isChanging && pendingLanguage === code ? (
                          <ActivityIndicator size="small" color="#2B475E" />
                        ) : (
                          <View style={styles.checkContainer}>
                            <Check size={20} color="#2B475E" />
                          </View>
                        )
                      ) : null}
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsText}>{t('language.changeLanguage')}</Text>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};