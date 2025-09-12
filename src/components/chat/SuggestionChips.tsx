import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Brain } from 'lucide-react-native';
import { chatInterfaceStyles as styles } from '../../styles/components/ChatInterface.styles';

// Function to add appropriate emojis based on suggestion content
const getSuggestionWithEmoji = (suggestion: string): string => {
  const text = suggestion.toLowerCase();
  
  // Stress and anxiety
  if (text.includes('overwhelm') || text.includes('too much') || text.includes('stress')) return '😓 ' + suggestion;
  if (text.includes('anxious') || text.includes('anxiety') || text.includes('worry') || text.includes('panic')) return '😰 ' + suggestion;
  if (text.includes('racing') || text.includes('can\'t stop')) return '🌀 ' + suggestion;
  
  // Emotions and feelings
  if (text.includes('sad') || text.includes('down') || text.includes('depressed')) return '😔 ' + suggestion;
  if (text.includes('confused') || text.includes('conflicted') || text.includes('not sure')) return '🤔 ' + suggestion;
  if (text.includes('angry') || text.includes('frustrated') || text.includes('mad')) return '😤 ' + suggestion;
  if (text.includes('lonely') || text.includes('alone') || text.includes('isolated')) return '😞 ' + suggestion;
  if (text.includes('tired') || text.includes('exhausted') || text.includes('energy')) return '😴 ' + suggestion;
  
  // Positive responses
  if (text.includes('grateful') || text.includes('thankful') || text.includes('appreciate')) return '🙏 ' + suggestion;
  if (text.includes('better') || text.includes('good') || text.includes('positive')) return '✨ ' + suggestion;
  if (text.includes('understand') || text.includes('makes sense') || text.includes('resonates')) return '💡 ' + suggestion;
  if (text.includes('safe') || text.includes('heard') || text.includes('support')) return '🤗 ' + suggestion;
  if (text.includes('progress') || text.includes('forward') || text.includes('change')) return '🌱 ' + suggestion;
  
  // Questions and exploration
  if (text.includes('help me') || text.includes('guide me') || text.includes('show me')) return '🤝 ' + suggestion;
  if (text.includes('how') || text.includes('what') || text.includes('why') || text.includes('?')) return '❓ ' + suggestion;
  if (text.includes('explore') || text.includes('learn') || text.includes('understand')) return '🔍 ' + suggestion;
  if (text.includes('try') || text.includes('practice') || text.includes('ready')) return '💪 ' + suggestion;
  
  // Work and life
  if (text.includes('work') || text.includes('job') || text.includes('balance')) return '💼 ' + suggestion;
  if (text.includes('sleep') || text.includes('rest') || text.includes('night')) return '🌙 ' + suggestion;
  if (text.includes('relationship') || text.includes('family') || text.includes('friend')) return '👥 ' + suggestion;
  
  // Thoughts and mind
  if (text.includes('thoughts') || text.includes('thinking') || text.includes('mind')) return '🧠 ' + suggestion;
  if (text.includes('inner critic') || text.includes('hard on myself') || text.includes('judge')) return '🔇 ' + suggestion;
  
  // Breathing and mindfulness
  if (text.includes('breath') || text.includes('breathe') || text.includes('calm')) return '🌬️ ' + suggestion;
  if (text.includes('present') || text.includes('moment') || text.includes('mindful')) return '🧘' + suggestion;
  if (text.includes('body') || text.includes('tension') || text.includes('relax')) return '💆' + suggestion;
  
  // Values and purpose
  if (text.includes('purpose') || text.includes('meaning') || text.includes('direction')) return '🎯 ' + suggestion;
  if (text.includes('values') || text.includes('important') || text.includes('matter')) return '⭐ ' + suggestion;
  
  // Default fallback - use a gentle reflection emoji
  return '💭 ' + suggestion;
};

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
      {/* Regular suggestion chips in horizontal scroll */}
      {suggestions.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestionsScrollContent}
          style={styles.suggestionsScroll}
        >
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
                {getSuggestionWithEmoji(suggestion)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
            <Brain size={16} color={isTyping ? "#9CA3AF" : "#475569"} style={{ marginRight: 6 }} />
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