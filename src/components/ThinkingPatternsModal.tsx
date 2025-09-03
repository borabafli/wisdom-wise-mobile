import React, { useState, useRef, useEffect } from 'react';
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
} from 'react-native';
import { BlurView } from 'expo-blur';
import { X, ArrowLeft, ArrowRight } from 'lucide-react-native';
import { ThoughtPattern } from '../services/storageService';
import { thinkingPatternsModalStyles as styles } from '../styles/components/ThinkingPatternsModal.styles';

const { width, height } = Dimensions.get('window');

interface ThinkingPatternsModalProps {
  visible: boolean;
  onClose: () => void;
  patterns: ThoughtPattern[];
  onPatternPress?: (pattern: ThoughtPattern) => void;
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

const ThinkingPatternsModal: React.FC<ThinkingPatternsModalProps> = ({
  visible,
  onClose,
  patterns,
  onPatternPress,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState(BACKGROUND_IMAGES[0]);
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Select random background image when modal opens
  useEffect(() => {
    if (visible) {
      const randomIndex = Math.floor(Math.random() * BACKGROUND_IMAGES.length);
      setBackgroundImage(BACKGROUND_IMAGES[randomIndex]);
      
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

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const renderPatternCard = ({ item: pattern, index }: { item: ThoughtPattern; index: number }) => (
    <TouchableOpacity
      style={styles.patternCard}
      onPress={() => handlePatternPress(pattern)}
      activeOpacity={0.9}
    >
      <BlurView intensity={35} style={styles.cardBlurContainer}>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.patternType}>
              {pattern.distortionTypes[0] || 'Thought Pattern'}
            </Text>
            <Text style={styles.confidenceText}>
              {Math.round(pattern.confidence * 100)}% confident
            </Text>
          </View>

          <View style={styles.thoughtsContainer}>
            <View style={styles.originalThought}>
              <Text style={styles.thoughtLabel}>Original thought:</Text>
              <Text style={styles.thoughtText}>"{pattern.originalThought}"</Text>
            </View>

            <View style={styles.reframedThought}>
              <Text style={styles.thoughtLabel}>Reframed thought:</Text>
              <Text style={styles.reframedText}>"{pattern.reframedThought}"</Text>
            </View>
          </View>

          {pattern.distortionTypes.length > 1 && (
            <View style={styles.distortionTags}>
              {pattern.distortionTypes.slice(1, 3).map((distortion, idx) => (
                <View key={idx} style={styles.distortionTag}>
                  <Text style={styles.distortionTagText}>{distortion}</Text>
                </View>
              ))}
            </View>
          )}

          {pattern.context && (
            <Text style={styles.contextText}>{pattern.context}</Text>
          )}
        </View>
      </BlurView>
    </TouchableOpacity>
  );

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