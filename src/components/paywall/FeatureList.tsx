/**
 * Feature List Component
 *
 * Displays list of premium features with icons
 * Used in paywall screen
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Sparkles, Brain, Lightbulb, Heart, BookOpen, Pencil } from 'lucide-react-native';
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
      icon: <Brain size={20} color="#5BA3B8" strokeWidth={2.5} />,
      text: t('paywall.features.deep_analysis'),
    },
    {
      icon: <Lightbulb size={20} color="#5BA3B8" strokeWidth={2.5} />,
      text: t('paywall.features.distorted_thoughts'),
    },
    {
      icon: <Heart size={20} color="#5BA3B8" strokeWidth={2.5} />,
      text: t('paywall.features.full_exercises'),
    },
    {
      icon: <BookOpen size={20} color="#5BA3B8" strokeWidth={2.5} />,
      text: t('paywall.features.personal_insights'),
    },
    {
      icon: <Pencil size={20} color="#5BA3B8" strokeWidth={2.5} />,
      text: t('paywall.features.unlimited_journaling'),
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
