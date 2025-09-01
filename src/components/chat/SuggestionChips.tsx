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
}

export const SuggestionChips: React.FC<SuggestionChipsProps> = ({
  suggestions,
  onSuggestionPress,
  onSuggestExercise,
  showExerciseButton = false,
  isVisible
}) => {
  if (!isVisible || (suggestions.length === 0 && !showExerciseButton)) {
    return null;
  }

  return (
    <View style={styles.suggestionsContainer}>
      <View style={styles.suggestionsStack}>
        {/* Regular suggestion chips */}
        {suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onSuggestionPress(suggestion)}
            style={styles.suggestionChip}
            activeOpacity={0.7}
          >
            <Text style={styles.suggestionText}>
              {suggestion}
            </Text>
          </TouchableOpacity>
        ))}
        
        {/* Exercise suggestion button */}
        {showExerciseButton && onSuggestExercise && (
          <TouchableOpacity
            onPress={onSuggestExercise}
            style={[styles.suggestionChip, styles.exerciseSuggestionButton]}
            activeOpacity={0.7}
          >
            <Brain size={16} color="#6B46C1" style={{ marginRight: 6 }} />
            <Text style={[styles.suggestionText, styles.exerciseSuggestionText]}>
              Suggest an exercise
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default SuggestionChips;