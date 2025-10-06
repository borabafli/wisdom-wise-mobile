import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Check, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import {
  SUPPORTED_LANGUAGES,
  LANGUAGE_CODES,
  changeLanguage,
  getCurrentLanguage,
  getLanguageName,
} from '../services/i18nService';
import { languageSelectorStyles as styles } from '../styles/components/LanguageSelector.styles';

interface LanguageSelectorProps {
  onLanguageChange?: (language: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageChange }) => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pendingLanguage, setPendingLanguage] = useState<string | null>(null);
  const [isChanging, setIsChanging] = useState(false);

  const currentLanguage = getCurrentLanguage();
  const currentLanguageName = getLanguageName(currentLanguage);

  const handleLanguageSelect = async (languageCode: string) => {
    if (languageCode === currentLanguage || isChanging) {
      return;
    }

    setIsChanging(true);
    setPendingLanguage(languageCode);

    try {
      await changeLanguage(languageCode);
      onLanguageChange?.(languageCode);
      setIsModalVisible(false);
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsChanging(false);
      setPendingLanguage(null);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['rgba(161, 214, 242, 0.25)', 'rgba(184, 224, 245, 0.15)', 'rgba(255, 255, 255, 0.8)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.selectorGradient}
        >
          <View style={styles.selectorContent}>
            <View style={styles.languageIconContainer}>
              <Image
                source={require('../../assets/images/New Icons/icon-9.png')}
                style={styles.languageIconImage}
                contentFit="contain"
              />
            </View>
            <View style={styles.languageInfo}>
              <Text style={styles.languageLabel}>{t('language.currentLanguage')}</Text>
              <Text style={styles.languageSubtitle}>{t('language.changeLanguage')}</Text>
            </View>
            <View style={styles.languageActions}>
              <Text style={styles.languageName}>{currentLanguageName}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setIsModalVisible(false)}
        statusBarTranslucent
        hardwareAccelerated
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={35} tint="light" style={styles.modalBlur} />
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setIsModalVisible(false)}
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
                onPress={() => setIsModalVisible(false)}
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
    </>
  );
};

