import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Check, ChevronDown, Globe, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import {
  SUPPORTED_LANGUAGES,
  LANGUAGE_CODES,
  changeLanguage,
  getCurrentLanguage,
  getLanguageName
} from '../services/i18nService';
import { languageSelectorStyles as styles } from '../styles/components/LanguageSelector.styles';

interface LanguageSelectorProps {
  onLanguageChange?: (language: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageChange }) => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  const currentLanguage = getCurrentLanguage();
  const currentLanguageName = getLanguageName(currentLanguage);

  console.log('LanguageSelector render - isModalVisible:', isModalVisible);
  console.log('LANGUAGE_CODES length:', LANGUAGE_CODES.length);


  const handleLanguageSelect = async (languageCode: string) => {
    if (languageCode === currentLanguage || isChanging) return;

    setIsChanging(true);
    try {
      await changeLanguage(languageCode);
      onLanguageChange?.(languageCode);
      setIsModalVisible(false);
    } catch (error) {
      console.error('Failed to change language:', error);
      // Could show an error toast here
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <>
      {/* Language Selection Button - Styled like Profile Menu Buttons */}
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => {
          console.log('Language selector button pressed!');
          setIsModalVisible(true);
        }}
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

      {/* Language Selection Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsModalVisible(false)}
        statusBarTranslucent
        hardwareAccelerated
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('language.selectLanguage')}</Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Language List */}
            <ScrollView style={styles.languageList}>
              {LANGUAGE_CODES.map((code) => {
                const isSelected = code === currentLanguage;
                const languageName = SUPPORTED_LANGUAGES[code as keyof typeof SUPPORTED_LANGUAGES];
                console.log(`Rendering language: ${code} - ${languageName}`);

                return (
                  <TouchableOpacity
                    key={code}
                    style={[
                      styles.languageOption,
                      isSelected && styles.selectedLanguageOption
                    ]}
                    onPress={() => handleLanguageSelect(code)}
                    disabled={isChanging}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={isSelected
                        ? ['rgba(43, 71, 94, 0.1)', 'rgba(43, 71, 94, 0.05)']
                        : ['transparent', 'transparent']
                      }
                      style={styles.languageOptionGradient}
                    >
                      <View style={styles.languageOptionContent}>
                        <View style={styles.languageDetails}>
                          <Text style={[
                            styles.languageOptionName,
                            isSelected && styles.selectedLanguageOptionName
                          ]}>
                            {String(languageName)}
                          </Text>
                          <Text style={[
                            styles.languageCode,
                            isSelected && styles.selectedLanguageCode
                          ]}>
                            {String(code.toUpperCase())}
                          </Text>
                        </View>

                        {isSelected && (
                          <View style={styles.checkContainer}>
                            <Check size={20} color="#2B475E" />
                          </View>
                        )}
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Instructions */}
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsText}>
                {t('language.changeLanguage')}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};