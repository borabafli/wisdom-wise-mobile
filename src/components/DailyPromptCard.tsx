import React from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { dailyPromptCardStyles as styles } from '../styles/components/DailyPromptCard.styles';

interface DailyPromptCardProps {
  prompt: string;
  onStartWriting: () => void;
}

const DailyPromptCard: React.FC<DailyPromptCardProps> = ({ prompt, onStartWriting }) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/daily-journal-prompt-card.png')}
        style={styles.cardBackground}
        imageStyle={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.contentContainer}>
          <View style={styles.promptContainer}>
            <Text style={styles.promptText}>{prompt}</Text>
          </View>

          <TouchableOpacity
            style={styles.startButton}
            onPress={onStartWriting}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>Start Writing</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default DailyPromptCard;