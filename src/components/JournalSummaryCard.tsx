import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { SafeAreaWrapper } from './SafeAreaWrapper';
import { X, Save, Sparkles } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { journalSummaryStyles as styles } from '../styles/components/JournalSummary.styles';
import { LinearGradient } from 'expo-linear-gradient';

interface JournalSummaryCardProps {
  visible: boolean;
  summary: string;
  insights: string[];
  onSave: () => void;
  onSaveAndPolish: () => void;
  onClose: () => void;
}

const JournalSummaryCard: React.FC<JournalSummaryCardProps> = ({
  visible,
  summary,
  insights,
  onSave,
  onSaveAndPolish,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <LinearGradient
        colors={['rgb(216, 235, 243)', 'rgba(255, 255, 255, 1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
        <SafeAreaWrapper style={styles.safeAreaWrapper}>
        <StatusBar style="dark" backgroundColor="transparent" translucent />
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Reflection</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#2B475E" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Summary Card */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryText}>{summary}</Text>

            {insights.length > 0 && (
              <View style={styles.insightsContainer}>
                <Text style={styles.insightsTitle}>Key Insights</Text>
                {insights.map((insight, index) => (
                  <View key={index} style={styles.insightItem}>
                    <View style={styles.insightBullet} />
                    <Text style={styles.insightText}>{insight}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Save Options */}
          <View style={styles.saveOptionsContainer}>
            <Text style={styles.saveOptionsTitle}>Would you like to save this entry?</Text>

            <TouchableOpacity
              style={styles.saveButtonContainer}
              onPress={onSave}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#4A6B7C', '#1A2B36']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.saveButton}
              >
                <Save size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveAndPolishButtonContainer}
              onPress={onSaveAndPolish}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#4A6B7C', '#1A2B36']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.saveAndPolishButton}
              >
                <Sparkles size={20} color="#FFFFFF" />
                <Text style={styles.saveAndPolishButtonText}>Save & Polish</Text>
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.polishDescription}>
              "Save & Polish" will structure your entry with headings and organize it beautifully
            </Text>
          </View>
        </ScrollView>
        </SafeAreaWrapper>
      </LinearGradient>
    </Modal>
  );
};

export default JournalSummaryCard;