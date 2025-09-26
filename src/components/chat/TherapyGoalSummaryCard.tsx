import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Check, X, Target, Sparkles } from 'lucide-react-native';
import { therapyGoalSummaryCardStyles as styles } from '../../styles/components/TherapyGoalSummaryCard.styles';

interface TherapyGoalSummaryCardProps {
  summary: {
    summary: string;
    keyInsights: string[];
  };
  onSave: () => void;
  onCancel: () => void;
}

export const TherapyGoalSummaryCard: React.FC<TherapyGoalSummaryCardProps> = ({
  summary,
  onSave,
  onCancel
}) => {
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BlurView
      intensity={20}
      tint="light"
      style={styles.container}
    >
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
        style={styles.glassOverlay}
      >
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Target size={24} color="#8B5CF6" />
            <Text style={styles.title}>{t('chat.therapyGoalSummary.title')}</Text>
          </View>
          <Text style={styles.subtitle}>{t('chat.therapyGoalSummary.subtitle')}</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>{t('chat.therapyGoalSummary.yourGoals')}</Text>
            <Text style={styles.summaryText}>"{summary.summary}"</Text>
          </View>

          {summary.keyInsights && summary.keyInsights.length > 0 && (
            <View style={styles.insightsSection}>
              <Text style={styles.sectionTitle}>{t('chat.therapyGoalSummary.keyInsights')}</Text>
              {summary.keyInsights.map((insight, index) => (
                <View key={index} style={styles.insightItem}>
                  <View style={styles.insightBullet} />
                  <Text style={styles.insightText}>{insight}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
            disabled={isSaving}
          >
            <X size={20} color="#6B7280" />
            <Text style={styles.cancelButtonText}>{t('chat.therapyGoalSummary.continueGoals')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            <Check size={20} color="white" />
            <Text style={styles.saveButtonText}>
              {isSaving ? t('common.saving') : t('chat.therapyGoalSummary.saveGoals')}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </BlurView>
  );
};