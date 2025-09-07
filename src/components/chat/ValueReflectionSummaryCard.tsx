import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Check, X, BookOpen } from 'lucide-react-native';
import { valueReflectionSummaryCardStyles as styles } from '../../styles/components/ValueReflectionSummaryCard.styles';

interface ValueReflectionSummaryCardProps {
  valueContext: {
    valueId: string;
    valueName: string;
    valueDescription: string;
    prompt: string;
  };
  summary: {
    summary: string;
    keyInsights: string[];
  };
  onSave: () => void;
  onCancel: () => void;
}

export const ValueReflectionSummaryCard: React.FC<ValueReflectionSummaryCardProps> = ({
  valueContext,
  summary,
  onSave,
  onCancel
}) => {
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
            <BookOpen size={24} color="#4F46E5" />
            <Text style={styles.title}>Reflection Summary</Text>
          </View>
          <Text style={styles.subtitle}>Review your insights on "{valueContext.valueName}"</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.summaryText}>{summary.summary}</Text>
          </View>

          {summary.keyInsights && summary.keyInsights.length > 0 && (
            <View style={styles.insightsSection}>
              <Text style={styles.sectionTitle}>Key Insights</Text>
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
            <Text style={styles.cancelButtonText}>Continue Reflection</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            <Check size={20} color="white" />
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Saving...' : 'Save Summary'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </BlurView>
  );
};