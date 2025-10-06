import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';

import {
  getCurrentLanguage,
  getLanguageName,
} from '../services/i18nService';
import { languageSelectorStyles as styles } from '../styles/components/LanguageSelector.styles';

interface LanguageSelectorProps {
  onPress?: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onPress }) => {
  const { t } = useTranslation();
  const currentLanguage = getCurrentLanguage();
  const currentLanguageName = getLanguageName(currentLanguage);

  return (
    <TouchableOpacity
      style={styles.selectorButton}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={['#FFFFFF', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.selectorGradient}
      >
        <View style={styles.selectorContent}>
          <View style={styles.languageIconContainer}>
            <Image
              source={require('../../assets/images/New Icons/12.png')}
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
  );
};
