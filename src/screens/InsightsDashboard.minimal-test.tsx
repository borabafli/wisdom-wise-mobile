import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { insightsDashboardStyles as styles } from '../styles/components/InsightsDashboard.styles';

interface InsightsDashboardProps {
  onInsightClick: (type: string, insight?: any) => void;
  onTherapyGoalsClick?: () => void;
}

const InsightsDashboard: React.FC<InsightsDashboardProps> = ({ onInsightClick, onTherapyGoalsClick }) => {
  const { t } = useTranslation();

  return (
    <SafeAreaWrapper style={styles.container}>
      <StatusBar style="dark" backgroundColor="transparent" translucent />

      <View
        style={[styles.backgroundGradient, { backgroundColor: '#e9eff1' }]}
        pointerEvents="none"
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerTitleContainer}>
              <Image
                source={require('../../assets/new-design/Turtle Hero Section/insights-hero.png')}
                style={styles.headerTurtleIcon}
                contentFit="contain"
              />
              <View style={styles.titleAndSubtitleContainer}>
                <Text style={styles.headerTitle}>Insights</Text>
                <Text style={styles.headerSubtitle}>Test Minimal Version</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={{ fontSize: 16, padding: 20 }}>
            If you can see this, the basic structure works!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default InsightsDashboard;
