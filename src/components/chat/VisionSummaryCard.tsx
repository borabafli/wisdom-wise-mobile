import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Check, X, Star, Sparkles } from 'lucide-react-native';
import { visionSummaryCardStyles as styles } from '../../styles/components/VisionSummaryCard.styles';

interface VisionSummaryCardProps {
  summary: {
    summary: string;
    keyInsights: string[];
  };
  onSave: () => void;
  onCancel: () => void;
}

export const VisionSummaryCard: React.FC<VisionSummaryCardProps> = ({
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
            <Star size={24} color="#0EA5E9" />
            <Text style={styles.title}>Vision Summary</Text>
          </View>
          <Text style={styles.subtitle}>Your inspiring future self revealed</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>Your Vision</Text>
            <Text style={styles.summaryText}>"{summary.summary}"</Text>
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
            <Text style={styles.cancelButtonText}>Continue Vision</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            <Check size={20} color="white" />
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Saving...' : 'Save Vision'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </BlurView>
  );
};