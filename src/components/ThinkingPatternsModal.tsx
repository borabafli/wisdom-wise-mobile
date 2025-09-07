import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Animated,
  Dimensions,
  ImageBackground,
  Modal,
  StatusBar,
  ScrollView,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { X, ArrowLeft, ArrowRight, Brain, Lightbulb, TrendingUp, Target, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ValuesReflectButton } from './ReflectButton';
import { ThoughtPattern } from '../services/storageService';
import { thinkingPatternsModalStyles as styles } from '../styles/components/ThinkingPatternsModal.styles';

const { width, height } = Dimensions.get('window');

interface ThinkingPatternsModalProps {
  visible: boolean;
  onClose: () => void;
  patterns: ThoughtPattern[];
  onPatternPress?: (pattern: ThoughtPattern) => void;
  onStartReflection?: (pattern: ThoughtPattern, prompt: string) => void;
}

// Background images - we'll randomly select one
const BACKGROUND_IMAGES = [
  require('../../assets/images/1.jpeg'),
  require('../../assets/images/2.jpeg'),
  require('../../assets/images/3.jpeg'),
  require('../../assets/images/4.jpeg'),
  require('../../assets/images/5.jpeg'),
  require('../../assets/images/6.jpg'),
  require('../../assets/images/7.jpeg'),
  require('../../assets/images/8.jpeg'),
  require('../../assets/images/9.jpeg'),
  require('../../assets/images/10.jpeg'),
  require('../../assets/images/11.jpeg'),
];

// Distortion education data (without emojis)
const DISTORTION_INFO: Record<string, { explanation: string; tip: string }> = {
  'All-or-Nothing Thinking': {
    explanation: 'You see things as completely good or bad, with no middle ground.',
    tip: 'Try listing at least one "middle ground" option.'
  },
  'Catastrophizing': {
    explanation: 'You imagine the worst possible outcome will happen.',
    tip: 'Ask yourself: what\'s the most likely outcome, not the worst one?'
  },
  'Mind Reading': {
    explanation: 'You assume you know what others are thinking about you.',
    tip: 'Consider: What evidence do I actually have for this assumption?'
  },
  'Fortune Telling': {
    explanation: 'You predict negative outcomes without evidence.',
    tip: 'Focus on what you can control right now, not future fears.'
  },
  'Emotional Reasoning': {
    explanation: 'You believe your feelings reflect reality ("I feel it, so it must be true").',
    tip: 'Ask: Are my emotions giving me facts or just feelings?'
  },
  'Personalization': {
    explanation: 'You blame yourself for things outside your control.',
    tip: 'Consider all the factors involved, not just your role.'
  },
  'Mental Filter': {
    explanation: 'You focus only on negatives while ignoring positives.',
    tip: 'Deliberately look for at least one positive in the situation.'
  }
};

// Function to generate personalized thought shifts based on the actual thought content
const generatePersonalizedThoughtShift = (originalThought: string, distortionType: string): string => {
  // Extract key elements from the thought to personalize the response
  const thought = originalThought.toLowerCase();
  
  if (distortionType === 'All-or-Nothing Thinking') {
    if (thought.includes('always') || thought.includes('never') || thought.includes('completely')) {
      return "This moment doesn't define everything. I can find some middle ground in this situation.";
    }
    return "Instead of 'all' or 'nothing', what's one small step I could consider?";
  }
  
  if (distortionType === 'Catastrophizing') {
    if (thought.includes('terrible') || thought.includes('disaster') || thought.includes('ruin')) {
      return "I struggle today, but tomorrow can be different. What's one realistic outcome?";
    }
    return "What would I tell a friend having this same worry right now?";
  }
  
  if (distortionType === 'Mind Reading') {
    if (thought.includes('think') || thought.includes('judging') || thought.includes('notice')) {
      return "I can't read minds. Most people are focused on their own concerns.";
    }
    return "What actual evidence do I have about what others are thinking?";
  }
  
  if (distortionType === 'Fortune Telling') {
    if (thought.includes('will') || thought.includes('going to') || thought.includes('definitely')) {
      return "I'm predicting the future, but I can only control this present moment.";
    }
    return "Instead of predicting problems, what's one thing I can do right now?";
  }
  
  if (distortionType === 'Emotional Reasoning') {
    if (thought.includes('feel like') || thought.includes('seems like')) {
      return "My feelings are valid, but they're not always facts. What do I actually know?";
    }
    return "This feeling will pass. What evidence exists beyond how I feel right now?";
  }
  
  if (distortionType === 'Personalization') {
    if (thought.includes('my fault') || thought.includes('because of me')) {
      return "I'm not responsible for everything. What other factors might be involved?";
    }
    return "I can only control my own actions, not outcomes or other people's reactions.";
  }
  
  if (distortionType === 'Mental Filter') {
    if (thought.includes('only') || thought.includes('just') || thought.includes('nothing but')) {
      return "I'm focusing on one negative detail. What's one neutral or positive aspect I'm missing?";
    }
    return "This difficult moment is real, but it's not the whole picture of my situation.";
  }
  
  // Default personalized response
  return "This thought is understandable, but it may not be serving me well right now.";
};

const ThinkingPatternsModal: React.FC<ThinkingPatternsModalProps> = ({
  visible,
  onClose,
  patterns,
  onPatternPress,
  onStartReflection,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState(require('../../assets/images/8.jpeg'));
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Mock data for demonstration - in real app this would come from analytics
  const getPatternStats = () => {
    const patternCounts: Record<string, number> = {};
    patterns.forEach(pattern => {
      pattern.distortionTypes.forEach(distortion => {
        patternCounts[distortion] = (patternCounts[distortion] || 0) + 1;
      });
    });
    
    return Object.entries(patternCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
  };

  const mockMoodImprovements = [72, 68, 85, 79, 91]; // Percentage improvements
  const averageMoodImprovement = Math.round(mockMoodImprovements.reduce((a, b) => a + b, 0) / mockMoodImprovements.length);

  // Animate modal entrance/exit
  useEffect(() => {
    if (visible) {
      // Animate modal entrance
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset animation values when closing
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.95);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handlePatternPress = (pattern: ThoughtPattern) => {
    if (onPatternPress) {
      onPatternPress(pattern);
    }
  };

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }, []);

  const renderPatternCard = ({ item: pattern, index }: { item: ThoughtPattern; index: number }) => {
    const primaryDistortion = pattern.distortionTypes[0] || 'Thought Pattern';
    const distortionInfo = DISTORTION_INFO[primaryDistortion];
    const currentMoodImprovement = mockMoodImprovements[index % mockMoodImprovements.length];
    
    return (
      <View style={styles.patternCard}>
        <BlurView intensity={40} style={styles.cardBlurContainer}>
          <ScrollView 
            style={styles.cardScrollView}
            contentContainerStyle={styles.cardContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* 1. Distortion Pattern Header */}
            <View style={styles.cardHeader}>
              <Text style={styles.patternType}>
                {primaryDistortion}
              </Text>
            </View>

            {/* 2. Pattern Explanation - Simple text with icon */}
            <View style={styles.educationSection}>
              <Brain size={16} color="#3b82f6" style={styles.educationIcon} />
              <Text style={styles.educationText}>
                {distortionInfo?.explanation || 'A common thinking pattern that may not serve you well.'}
              </Text>
            </View>

            {/* 3. Distorted & Balanced Thoughts - Priority Section */}
            <View style={styles.thoughtsContainer}>
              <View style={styles.originalThought}>
                <Text style={styles.thoughtLabel}>Distorted thought:</Text>
                <Text style={styles.thoughtText}>"{pattern.originalThought}"</Text>
              </View>

              <View style={styles.reframedThought}>
                <Text style={styles.thoughtLabel}>More balanced thought:</Text>
                <Text style={styles.reframedText}>"{pattern.reframedThought}"</Text>
              </View>
              
              {/* Personalized Thought Shift - Below balanced thought */}
              <View style={styles.thoughtShiftSection}>
                <View style={styles.thoughtShiftHeader}>
                  <Lightbulb size={14} color="#f59e0b" />
                  <Text style={styles.thoughtShiftTitle}>Your personalized shift:</Text>
                </View>
                <Text style={styles.thoughtShiftText}>
                  {generatePersonalizedThoughtShift(pattern.originalThought, primaryDistortion)}
                </Text>
              </View>
            </View>

            {/* 4. Progress - Connected to thoughts */}
            <View style={styles.compactEffectSection}>
              <View style={styles.progressHeader}>
                <TrendingUp size={12} color="#8b5cf6" />
                <Text style={styles.progressTitle}>Mood improvement: +{currentMoodImprovement}%</Text>
              </View>
              <View style={styles.progressBar}>
                <LinearGradient
                  colors={['#8b5cf6', '#a78bfa']}
                  style={[styles.progressFill, { width: `${currentMoodImprovement}%` }]}
                />
              </View>
            </View>

            {/* Additional distortion tags - Compact */}
            {pattern.distortionTypes.length > 1 && (
              <View style={styles.compactDistortionTags}>
                {pattern.distortionTypes.slice(1, 2).map((distortion, idx) => (
                  <View key={idx} style={styles.compactDistortionTag}>
                    <Text style={styles.compactDistortionTagText}>+{distortion}</Text>
                  </View>
                ))}
              </View>
            )}

            {pattern.context && (
              <Text style={styles.contextText}>{pattern.context}</Text>
            )}

            {/* Reflect on This Button */}
            {onStartReflection && (
              <ValuesReflectButton
                onPress={() => {
                  const prompt = `I noticed that your thought "${pattern.originalThought}" might show a pattern of ${primaryDistortion.toLowerCase()}. Sometimes when we experience ${primaryDistortion.toLowerCase()}, it can make situations feel more challenging than they might actually be. Would you like to explore this specific thought pattern with me?`;
                  if (onStartReflection) {
                    onStartReflection(pattern, prompt);
                    // Close modal when starting reflection
                    handleClose();
                  } else {
                    console.log('onStartReflection not provided');
                  }
                }}
                style={{ marginTop: 12 }}
              />
            )}
          </ScrollView>
        </BlurView>
      </View>
    );
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={false}
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
        <View style={styles.overlay} />
        
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color="white" />
            </TouchableOpacity>
            
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Thinking Patterns</Text>
              <Text style={styles.headerSubtitle}>
                {currentIndex + 1} of {patterns.length}
              </Text>
            </View>
            
            <View style={styles.headerRight} />
          </View>


          {/* Patterns List */}
          {patterns.length > 0 ? (
            <FlatList
              ref={flatListRef}
              data={patterns}
              renderItem={renderPatternCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              decelerationRate="fast"
              snapToInterval={width - 40}
              snapToAlignment="start"
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={{
                itemVisiblePercentThreshold: 50,
              }}
              contentContainerStyle={styles.listContainer}
              style={styles.flatList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No thinking patterns found.{'\n'}Start a conversation to discover your thought patterns!
              </Text>
            </View>
          )}

          {/* Fixed Top Thinking Patterns - Higher position */}
          {patterns.length > 1 && (
            <View style={styles.fixedTopPatternsSection}>
              <LinearGradient
                colors={['rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.6)']}
                style={styles.fixedTopPatternsContainer}
              >
                <View style={styles.fixedTopPatternsHeader}>
                  <Brain size={14} color="#22c55e" />
                  <Text style={styles.fixedTopPatternsTitle}>Your Most Common Patterns</Text>
                </View>
                <View style={styles.fixedTopPatternsContent}>
                  {getPatternStats().slice(0, 3).map(([patternName, count], idx) => (
                    <View key={patternName} style={styles.fixedPatternStatItem}>
                      <Text style={styles.fixedPatternStatName}>{patternName}</Text>
                      <Text style={styles.fixedPatternStatCount}>{count}×</Text>
                    </View>
                  ))}
                </View>
              </LinearGradient>
            </View>
          )}


          {/* Navigation indicators */}
          {patterns.length > 1 && (
            <View style={styles.indicators}>
              {patterns.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    index === currentIndex && styles.activeIndicator,
                  ]}
                />
              ))}
            </View>
          )}
        </Animated.View>
      </ImageBackground>
    </Modal>
  );
};

export default ThinkingPatternsModal;