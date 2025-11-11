import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { useTranslation } from 'react-i18next';
import { personalValuesStyles as styles } from '../../styles/components/onboarding/PersonalValues.styles';

interface PersonalValue {
  id: string;
  name: string;
}

interface PersonalValuesScreenProps {
  onContinue: (selectedValues: string[]) => void;
  onBack?: () => void;
}

const PersonalValuesScreen: React.FC<PersonalValuesScreenProps> = ({ onContinue, onBack }) => {
  const { t } = useTranslation();
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const personalValues: PersonalValue[] = [
    { id: '1', name: t('onboarding.personalValues.values.healthVitality') },
    { id: '2', name: t('onboarding.personalValues.values.closeRelationships') },
    { id: '3', name: t('onboarding.personalValues.values.growthLearning') },
    { id: '4', name: t('onboarding.personalValues.values.peaceBalance') },
    { id: '5', name: t('onboarding.personalValues.values.freedomIndependence') },
    { id: '6', name: t('onboarding.personalValues.values.purposeMeaning') },
    { id: '7', name: t('onboarding.personalValues.values.creativityPlay') },
    { id: '8', name: t('onboarding.personalValues.values.achievementProgress') },
  ];

  useEffect(() => {
    // Set Android navigation bar color to match background
    NavigationBar.setBackgroundColorAsync('#EDF8F8');

    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleValueToggle = (valueId: string) => {
    setSelectedValues(prev => {
      if (prev.includes(valueId)) {
        // Remove if already selected
        return prev.filter(id => id !== valueId);
      } else {
        // Add to selection (no limit)
        return [...prev, valueId];
      }
    });
  };

  const handleContinue = () => {
    const selectedValueNames = personalValues
      .filter(value => selectedValues.includes(value.id))
      .map(value => value.name);
    onContinue(selectedValueNames);
  };

  const renderValueChip = (value: PersonalValue) => {
    const isSelected = selectedValues.includes(value.id);
    
    return (
      <TouchableOpacity
        key={value.id}
        style={[
          styles.valueChip,
          isSelected && styles.selectedValueChip
        ]}
        onPress={() => handleValueToggle(value.id)}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.valueChipText,
          isSelected && styles.selectedValueChipText
        ]}>
          {value.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#EDF8F8" translucent={false} />
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1 }}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
          {/* Back Button */}
          {onBack && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBack}
              activeOpacity={0.7}
            >
              <ChevronLeft size={24} color="#36657d" />
            </TouchableOpacity>
          )}

          {/* Content Section */}
          <Animated.View
            style={[
              styles.contentContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            {/* Header Text */}
            <View style={styles.headerContainer}>
              <Text style={styles.headline}>{t('onboarding.personalValues.headline')}</Text>
              <Text style={styles.promptText}>
                {t('onboarding.personalValues.promptText')}
              </Text>
            </View>

            {/* Values Selection */}
            <View style={styles.valuesContainer}>
              {personalValues.map(renderValueChip)}
            </View>

          </Animated.View>
        </ScrollView>

        {/* Fixed Footer Button - Visible immediately */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>
              {t('onboarding.common.continueButton')}
            </Text>
          </TouchableOpacity>
        </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default PersonalValuesScreen;