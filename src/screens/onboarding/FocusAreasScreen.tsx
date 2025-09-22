import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
}

const FocusAreasScreen: React.FC<FocusAreasScreenProps> = ({ onContinue }) => {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
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
      <SafeAreaView style={styles.safeArea}>
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
      </SafeAreaView>
    </View>
  );
};

export default FocusAreasScreen;