import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { chatInterfaceStyles as styles } from '../../styles/components/ChatInterface.styles';

interface SuggestionChipsProps {
  suggestions: string[];
  onSuggestionPress: (suggestion: string) => void;
  isVisible: boolean;
}

export const SuggestionChips: React.FC<SuggestionChipsProps> = ({
  suggestions,
  onSuggestionPress,
  isVisible
}) => {
  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  return (
    <View style={styles.suggestionsContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.suggestionsScroll}
      >
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
      </ScrollView>
    </View>
  );
};

export default SuggestionChips;