import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { personalValuesStyles as styles } from '../../styles/components/onboarding/PersonalValues.styles';

interface PersonalValue {
  id: string;
  name: string;
}

const personalValues: PersonalValue[] = [
  { id: '1', name: 'Family & Connection' },
  { id: '2', name: 'Personal Growth' },
  { id: '3', name: 'Health & Wellness' },
  { id: '4', name: 'Creativity' },
  { id: '5', name: 'Freedom & Independence' },
  { id: '6', name: 'Achievement & Success' },
  { id: '7', name: 'Helping Others' },
  { id: '8', name: 'Adventure & Fun' },
];

interface PersonalValuesScreenProps {
  onContinue: (selectedValues: string[]) => void;
  onBack?: () => void;
}

const PersonalValuesScreen: React.FC<PersonalValuesScreenProps> = ({ onContinue, onBack }) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
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
              <Text style={styles.headline}>Let's personalize your experience with Anu.</Text>
              <Text style={styles.promptText}>
                What is most important to you?
              </Text>
            </View>

            {/* Values Selection */}
            <View style={styles.valuesContainer}>
              {personalValues.map(renderValueChip)}
            </View>

            {/* Continue Button */}
            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinue}
                activeOpacity={0.8}
              >
                <Text style={styles.continueButtonText}>
                  Continue
                </Text>
              </TouchableOpacity>

            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default PersonalValuesScreen;