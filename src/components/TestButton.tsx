import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Play, Zap } from 'lucide-react-native';
import { 
  getNextSampleAnswer, 
  hasTestData, 
  THINKING_PATTERN_TEST_DATA,
  VALUE_REFLECTION_TEST_DATA 
} from '../utils/testUtils';

interface TestButtonProps {
  exerciseMode: boolean;
  exerciseData: any;
  isValueReflection: boolean;
  isThinkingPatternReflection: boolean;
  exerciseStep?: number;
  onSendMessage: (message: string) => void;
  onStartExercise?: (exerciseType: string) => void;
}

export const TestButton: React.FC<TestButtonProps> = ({
  exerciseMode,
  exerciseData,
  isValueReflection,
  isThinkingPatternReflection,
  exerciseStep = 0,
  onSendMessage,
  onStartExercise
}) => {
  const [testStep, setTestStep] = useState(0);

  // Only show in development mode
  // Check both __DEV__ and NODE_ENV for broader compatibility
  const isDevelopment = __DEV__ || process.env.NODE_ENV === 'development';
  
  if (!isDevelopment) {
    return null;
  }

  const handleQuickTest = () => {
    if (isThinkingPatternReflection) {
      // Auto-respond for thinking pattern reflection
      const responses = THINKING_PATTERN_TEST_DATA.sampleResponses;
      if (testStep < responses.length) {
        onSendMessage(responses[testStep]);
        setTestStep(testStep + 1);
      }
    } else if (isValueReflection) {
      // Auto-respond for value reflection
      const responses = VALUE_REFLECTION_TEST_DATA.sampleResponses;
      if (testStep < responses.length) {
        onSendMessage(responses[testStep]);
        setTestStep(testStep + 1);
      }
    } else if (exerciseMode && exerciseData?.type) {
      // Auto-respond for regular exercises
      const exerciseType = exerciseData.type;
      if (hasTestData(exerciseType)) {
        const answer = getNextSampleAnswer(exerciseType, exerciseStep);
        onSendMessage(answer);
      }
    } else {
      // Not in an exercise - show options
      Alert.alert(
        'Test Exercise',
        'Choose an exercise to test:',
        [
          { text: 'Breathing', onPress: () => onStartExercise?.('breathing') },
          { text: 'Automatic Thoughts', onPress: () => onStartExercise?.('automatic-thoughts') },
          { text: 'Gratitude', onPress: () => onStartExercise?.('gratitude') },
          { text: 'Vision Exercise', onPress: () => onStartExercise?.('vision-of-future') },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }
  };

  const getButtonText = () => {
    if (isThinkingPatternReflection) {
      return `Test Step ${testStep + 1}/5`;
    }
    if (isValueReflection) {
      return `Test Step ${testStep + 1}/5`;
    }
    if (exerciseMode) {
      return `Test Step ${exerciseStep + 1}`;
    }
    return 'Quick Test';
  };

  return (
    <View style={{
      position: 'absolute',
      bottom: 100,
      right: 20,
      zIndex: 1000
    }}>
      <TouchableOpacity
        onPress={handleQuickTest}
        style={{
          backgroundColor: '#FF6B6B',
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 20,
          flexDirection: 'row',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5
        }}
      >
        <Zap size={16} color="white" />
        <Text style={{
          color: 'white',
          marginLeft: 6,
          fontSize: 12,
          fontWeight: '600'
        }}>
          {getButtonText()}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TestButton;