import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { X, Save, Sparkles } from 'lucide-react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { Image } from 'expo-image';

import { SafeAreaWrapper } from '../components/SafeAreaWrapper';
import { journalSummaryStyles as styles } from '../styles/components/JournalSummary.styles';
import JournalStorageService from '../services/journalStorageService';
import { JournalStackParamList } from '../types/navigation';

interface JournalSummaryScreenProps
  extends StackScreenProps<JournalStackParamList, 'JournalSummary'> {}

export const JournalSummaryScreen: React.FC<JournalSummaryScreenProps> = ({
  navigation,
  route,
}) => {
  const { t } = useTranslation();
  const { summary, insights, initialPrompt, entries } = route.params;
  const primaryInsight = insights?.[0];

  const handleSave = async (shouldPolish: boolean) => {
    try {
      await JournalStorageService.saveJournalEntry(
        initialPrompt,
        entries,
        summary,
        insights,
        shouldPolish
      );

      Alert.alert(
        t('journal.journalSaved'),
        shouldPolish ? t('journal.entrySavedPolished') : t('journal.entrySaved'),
        [
          {
            text: t('common.ok'),
            onPress: () => navigation.popToTop(),
          },
        ]
      );
    } catch (error) {
      console.error('Error saving journal entry:', error);
      Alert.alert(t('common.error'), t('journal.failedToSave'));
    }
  };

  return (
    <LinearGradient
      colors={['rgb(216, 235, 243)', 'rgba(255, 255, 255, 1)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <SafeAreaWrapper style={styles.safeAreaWrapper}>
        <StatusBar style="dark" backgroundColor="transparent" translucent />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <X size={24} color="#2B475E" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeaderVisual}>
              <Image
                source={require('../../assets/images/hand-heart-4.png')}
                style={styles.summaryHeaderImage}
                contentFit="contain"
              />
              <Text style={styles.summaryMainTitle}>{t('journal.summaryWellDone', 'Well done!')}</Text>
              <Text style={styles.summarySubtitle}>{t('journal.summarySubheading', 'You gave your thoughts a voice today.')}</Text>
            </View>
            <Text style={styles.summaryText}>{summary}</Text>

            {primaryInsight && (
              <View style={styles.insightsContainer}>
                <Text style={styles.insightsTitle}>{t('journal.keyInsights', 'Key Insights')}</Text>
                <Text style={styles.insightText}>{primaryInsight}</Text>
              </View>
            )}
          </View>

          <View style={styles.saveOptionsContainer}>
            <Text style={styles.saveOptionsTitle}>
              {t('journal.savePrompt', 'Would you like to save this entry?')}
            </Text>

            <TouchableOpacity
              style={styles.saveButtonContainer}
              onPress={() => handleSave(false)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#4A6B7C', '#1A2B36']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.saveButton}
              >
                <Save size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>{t('journal.save', 'Save')}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveAndPolishButtonContainer}
              onPress={() => handleSave(true)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#4A6B7C', '#1A2B36']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.saveAndPolishButton}
              >
                <Sparkles size={20} color="#FFFFFF" />
                <Text style={styles.saveAndPolishButtonText}>{t('journal.saveAndPolish', 'Save & Polish')}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.polishDescription}>
              {t(
                'journal.saveAndPolishDescription',
                '"Save & Polish" will structure your entry with headings and organize it beautifully'
              )}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaWrapper>
    </LinearGradient>
  );
};

export default JournalSummaryScreen;
