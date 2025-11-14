/**
 * Feature List Component
 *
 * Displays list of premium features with icons
 * Used in paywall screen
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Sparkles, Mic, Heart, Brain, BookOpen, Clock } from 'lucide-react-native';
import { featureListStyles as styles } from '../../styles/components/FeatureList.styles';
import { useTranslation } from 'react-i18next';

interface Feature {
  icon: React.ReactNode;
  text: string;
}

interface FeatureListProps {
  compact?: boolean;
}

export const FeatureList: React.FC<FeatureListProps> = ({ compact = false }) => {
  const { t } = useTranslation();

  const features: Feature[] = [
    {
      icon: <Sparkles size={20} color="#5BA3B8" strokeWidth={2.5} />,
      text: t('paywall.features.unlimited_conversations'),
    },
    {
      icon: <Mic size={20} color="#5BA3B8" strokeWidth={2.5} />,
      text: t('paywall.features.unlimited_voice'),
    },
    {
      icon: <Heart size={20} color="#5BA3B8" strokeWidth={2.5} />,
      text: t('paywall.features.full_exercises'),
    },
    {
      icon: <Brain size={20} color="#5BA3B8" strokeWidth={2.5} />,
      text: t('paywall.features.advanced_insights'),
    },
    {
      icon: <BookOpen size={20} color="#5BA3B8" strokeWidth={2.5} />,
      text: t('paywall.features.unlimited_journaling'),
    },
    {
      icon: <Clock size={20} color="#5BA3B8" strokeWidth={2.5} />,
      text: t('paywall.features.full_history'),
    },
  ];

  const displayFeatures = compact ? features.slice(0, 4) : features;

  return (
    <View style={styles.container}>
      {displayFeatures.map((feature, index) => (
        <View key={index} style={styles.featureItem}>
          <View style={styles.iconContainer}>
            {feature.icon}
          </View>
          <Text style={styles.featureText}>{feature.text}</Text>
        </View>
      ))}
    </View>
  );
};

export default FeatureList;
