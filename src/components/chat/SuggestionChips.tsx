import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Brain } from 'lucide-react-native';
import { chatInterfaceStyles as styles } from '../../styles/components/ChatInterface.styles';

interface SuggestionChipsProps {
  suggestions: string[];
  onSuggestionPress: (suggestion: string) => void;
  onSuggestExercise?: () => void;
  showExerciseButton?: boolean;
  isVisible: boolean;
  isTyping?: boolean;
}

export const SuggestionChips: React.FC<SuggestionChipsProps> = ({
  suggestions,
  onSuggestionPress,
  onSuggestExercise,
  showExerciseButton = false,
  isVisible,
  isTyping = false
}) => {
  if (!isVisible || (suggestions.length === 0 && !showExerciseButton)) {
    return null;
  }

  return (
    <View style={styles.suggestionsContainer}>
      {/* Regular suggestion chips displayed all together */}
      {suggestions.length > 0 && (
        <View style={styles.suggestionsStack}>
          {suggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => !isTyping && onSuggestionPress(suggestion)}
              style={[
                styles.suggestionChip,
                isTyping && { opacity: 0.5 }
              ]}
              activeOpacity={isTyping ? 1 : 0.7}
              disabled={isTyping}
            >
              <Text style={[
                styles.suggestionText,
                isTyping && { color: '#9CA3AF' }
              ]}>
                {suggestion}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      {/* Exercise suggestion button in separate row */}
      {showExerciseButton && onSuggestExercise && (
        <View style={styles.exerciseButtonContainer}>
          <TouchableOpacity
            onPress={() => !isTyping && onSuggestExercise()}
            style={[
              styles.suggestionChip,
              styles.exerciseSuggestionButton,
              isTyping && { opacity: 0.5 }
            ]}
            activeOpacity={isTyping ? 1 : 0.7}
            disabled={isTyping}
          >
            <Brain size={16} color={isTyping ? "#9CA3AF" : "#6B46C1"} style={{ marginRight: 6 }} />
            <Text style={[
              styles.suggestionText,
              styles.exerciseSuggestionText,
              isTyping && { color: '#9CA3AF' }
            ]}>
              Suggest an exercise
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default SuggestionChips;