import React from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { dailyPromptCardStyles as styles } from '../styles/components/DailyPromptCard.styles';

interface DailyPromptCardProps {
  prompt: string;
  onStartWriting: () => void;
}

const DailyPromptCard: React.FC<DailyPromptCardProps> = ({ prompt, onStartWriting }) => {
  const { t } = useTranslation();
  // Calculate dynamic font size based on text length
  const getDynamicFontSize = (text: string) => {
    const baseSize = 18; // Increased from 16 to 18
    const length = text.length;

    if (length < 50) {
      return baseSize + 4; // 22px for very short text
    } else if (length < 100) {
      return baseSize + 2; // 20px for short text
    } else if (length < 150) {
      return baseSize; // 18px for medium text
    } else {
      return baseSize - 2; // 16px for longer text
    }
  };

  const dynamicTextStyle = {
    ...styles.promptText,
    fontSize: getDynamicFontSize(prompt),
  };

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
            <Text style={dynamicTextStyle}>{prompt}</Text>
          </View>

          <TouchableOpacity
            style={styles.startButtonContainer}
            onPress={onStartWriting}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#4A6B7C', '#1A2B36']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.startButton}
            >
              <Text style={styles.startButtonText}>{t('home.startWriting')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default DailyPromptCard;