import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { focusAreasStyles as styles } from '../../styles/components/onboarding/FocusAreas.styles';

interface FocusArea {
  id: string;
  name: string;
}

const focusAreas: FocusArea[] = [
  { id: '1', name: 'Anxiety' },
  { id: '2', name: 'Stress' },
  { id: '3', name: 'Sleep Issues' },
  { id: '4', name: 'Low Mood' },
  { id: '5', name: 'Focus Problems' },
  { id: '6', name: 'Relationship Issues' },
  { id: '7', name: 'Work Pressure' },
  { id: '8', name: 'Self-Confidence' },
];

interface FocusAreasScreenProps {
  onContinue: (selectedAreas: string[]) => void;
  onBack?: () => void;
}

const FocusAreasScreen: React.FC<FocusAreasScreenProps> = ({ onContinue, onBack }) => {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonFadeAnim = useRef(new Animated.Value(0)).current;
  const buttonSlideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Set Android navigation bar color to match background
    NavigationBar.setBackgroundColorAsync('#EDF8F8');

    // Entrance animations (turtle video/content appears earlier)
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600, // Reduced from 800ms to make content appear earlier
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600, // Reduced from 800ms to make content appear earlier
        useNativeDriver: true,
      }),
    ]).start();

    // Button appears later with delay
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(buttonFadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(buttonSlideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1400); // Increased delay to make button appear later (was immediate)
  }, []);

  const handleAreaToggle = (areaId: string) => {
    setSelectedAreas(prev => {
      if (prev.includes(areaId)) {
        // Remove if already selected
        return prev.filter(id => id !== areaId);
      } else {
        // Add if not selected (no limit specified)
        return [...prev, areaId];
      }
    });
  };

  const handleContinue = () => {
    const selectedAreaNames = focusAreas
      .filter(area => selectedAreas.includes(area.id))
      .map(area => area.name);
    onContinue(selectedAreaNames);
  };

  const renderAreaChip = (area: FocusArea) => {
    const isSelected = selectedAreas.includes(area.id);
    
    return (
      <TouchableOpacity
        key={area.id}
        style={[
          styles.areaChip,
          isSelected && styles.selectedAreaChip
        ]}
        onPress={() => handleAreaToggle(area.id)}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.areaChipText,
          isSelected && styles.selectedAreaChipText
        ]}>
          {area.name}
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
              <Text style={styles.headline}>What would you like to focus on?</Text>
              <Text style={styles.promptText}>
                Select areas where you'd like support (choose any that apply)
              </Text>
            </View>

            {/* Focus Areas Selection */}
            <View style={styles.areasContainer}>
              {focusAreas.map(renderAreaChip)}
            </View>

            {/* Continue Button */}
            <Animated.View
              style={[
                styles.actionContainer,
                {
                  opacity: buttonFadeAnim,
                  transform: [{ translateY: buttonSlideAnim }],
                }
              ]}
            >
              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinue}
                activeOpacity={0.8}
              >
                <Text style={styles.continueButtonText}>
                  Continue
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default FocusAreasScreen;