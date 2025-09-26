import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Check, X, Lightbulb } from 'lucide-react-native';
import { thinkingPatternSummaryCardStyles as styles } from '../../styles/components/ThinkingPatternSummaryCard.styles';

interface ThinkingPatternSummaryCardProps {
  patternContext: {
    originalThought: string;
    distortionType: string;
    reframedThought: string;
  };
  summary: {
    summary: string;
    keyInsights: string[];
  };
  onSave: () => void;
  onCancel: () => void;
}

export const ThinkingPatternSummaryCard: React.FC<ThinkingPatternSummaryCardProps> = ({
  patternContext,
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
        colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0)']}
        locations={[0, 0.4, 1]}
        style={styles.glassOverlay}
      >
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Lightbulb size={24} color="#7C3AED" />
            <Text style={styles.title}>{t('chat.thinkingPatternSummary.title')}</Text>
          </View>
          <Text style={styles.subtitle}>{t('chat.thinkingPatternSummary.subtitle')}</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.patternSection}>
            <Text style={styles.sectionTitle}>{t('chat.thinkingPatternSummary.patternExplored')}</Text>
            <View style={styles.patternCard}>
              <Text style={styles.distortionType}>{patternContext.distortionType}</Text>
              <Text style={styles.originalThought}>"{patternContext.originalThought}"</Text>
            </View>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>{t('chat.thinkingPatternSummary.reflectionSummary')}</Text>
            <Text style={styles.summaryText}>"{summary.summary}"</Text>
          </View>

          {summary.keyInsights && summary.keyInsights.length > 0 && (
            <View style={styles.insightsSection}>
              <Text style={styles.sectionTitle}>{t('chat.thinkingPatternSummary.keyInsights')}</Text>
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
            <Text style={styles.cancelButtonText}>{t('chat.thinkingPatternSummary.continueReflection')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            <Check size={20} color="white" />
            <Text style={styles.saveButtonText}>
              {isSaving ? t('common.saving') : t('chat.thinkingPatternSummary.saveSummary')}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </BlurView>
  );
};