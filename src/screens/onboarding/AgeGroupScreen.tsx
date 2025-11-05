import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { useTranslation } from 'react-i18next';
import { ageGroupStyles as styles } from '../../styles/components/onboarding/AgeGroup.styles';

interface AgeGroup {
  id: string;
  name: string;
  range: string;
}

const ageGroups: AgeGroup[] = [
  { id: '1', name: '18-25', range: '18-25' },
  { id: '2', name: '26-35', range: '26-35' },
  { id: '3', name: '36-45', range: '36-45' },
  { id: '4', name: '46-55', range: '46-55' },
  { id: '5', name: '56-65', range: '56-65' },
  { id: '6', name: '65+', range: '65+' },
];

interface AgeGroupScreenProps {
  onContinue: (selectedAge: string) => void;
  onBack?: () => void;
}

const AgeGroupScreen: React.FC<AgeGroupScreenProps> = ({ onContinue, onBack }) => {
  const { t } = useTranslation();
  const [selectedAge, setSelectedAge] = useState<string>('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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

  const handleAgeSelect = (ageId: string) => {
    setSelectedAge(ageId);
  };

  const handleContinue = () => {
    if (selectedAge) {
      const selectedAgeGroup = ageGroups.find(age => age.id === selectedAge);
      onContinue(selectedAgeGroup?.name || '');
    }
  };

  const renderAgeChip = (ageGroup: AgeGroup) => {
    const isSelected = selectedAge === ageGroup.id;

    return (
      <TouchableOpacity
        key={ageGroup.id}
        style={[
          styles.ageChip,
          isSelected && styles.selectedAgeChip
        ]}
        onPress={() => handleAgeSelect(ageGroup.id)}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.ageChipText,
          isSelected && styles.selectedAgeChipText
        ]}>
          {ageGroup.name}
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
              <Text style={styles.headline}>{t('onboarding.ageGroup.headline')}</Text>
              <Text style={styles.promptText}>
                {t('onboarding.ageGroup.promptText')}
              </Text>
            </View>

            {/* Age Groups Selection */}
            <View style={styles.ageGroupsContainer}>
              {ageGroups.map(renderAgeChip)}
            </View>

          </Animated.View>
        </ScrollView>

        {/* Fixed Footer Button */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !selectedAge && styles.disabledButton
            ]}
            onPress={handleContinue}
            activeOpacity={selectedAge ? 0.8 : 1}
            disabled={!selectedAge}
          >
            <Text style={[
              styles.continueButtonText,
              !selectedAge && styles.disabledButtonText
            ]}>
              {t('onboarding.common.continueButton')}
            </Text>
          </TouchableOpacity>
        </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default AgeGroupScreen;