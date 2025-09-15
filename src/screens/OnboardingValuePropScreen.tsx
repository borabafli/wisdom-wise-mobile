import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle, Target, BarChart3, Brain, ChevronRight } from 'lucide-react-native';
import { onboardingValuePropStyles as styles } from '../styles/components/OnboardingValueProp.styles';

const { width, height } = Dimensions.get('window');

interface ValueCard {
  id: number;
  icon: any;
  title: string;
  description: string;
  gradient: string[];
  iconColor: string;
  backgroundImage: any;
}

const valueCards: ValueCard[] = [
  {
    id: 1,
    icon: MessageCircle,
    title: "Therapeutic Conversations",
    description: "I'll help you untangle complex thoughts and emotions through evidence-based techniques",
    gradient: ['rgba(255, 255, 255, 0.75)', 'rgba(91, 163, 184, 0.15)'],
    iconColor: '#5BA3B8',
    backgroundImage: require('../../assets/images/8.jpeg')
  },
  {
    id: 2,
    icon: Target,
    title: "14+ Therapeutic Exercises",
    description: "From breathing techniques to CBT tools, all tailored to your specific needs",
    gradient: ['rgba(255, 255, 255, 0.75)', 'rgba(181, 167, 230, 0.15)'],
    iconColor: '#B5A7E6',
    backgroundImage: require('../../assets/images/9.jpeg')
  },
  {
    id: 3,
    icon: BarChart3,
    title: "Personal Insights Dashboard",
    description: "Discover patterns in your thinking, track your growth, and celebrate progress",
    gradient: ['rgba(255, 255, 255, 0.75)', 'rgba(160, 213, 211, 0.15)'],
    iconColor: '#A0D5D3',
    backgroundImage: require('../../assets/images/10.jpeg')
  },
  {
    id: 4,
    icon: Brain,
    title: "AI That Remembers You",
    description: "I learn from our conversations to provide increasingly personalized support",
    gradient: ['rgba(255, 255, 255, 0.75)', 'rgba(255, 196, 176, 0.15)'],
    iconColor: '#FFC4B0',
    backgroundImage: require('../../assets/images/1.jpeg')
  }
];

interface OnboardingValuePropScreenProps {
  onContinue: () => void;
}

const OnboardingValuePropScreen: React.FC<OnboardingValuePropScreenProps> = ({ onContinue }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const cardAnimations = useRef(valueCards.map(() => new Animated.Value(0))).current;
  const dotAnimations = useRef(valueCards.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Initial card animation
    animateCard(0);
  }, []);

  const animateCard = (index: number) => {
    // Reset all card animations
    cardAnimations.forEach((anim, i) => {
      if (i !== index) {
        Animated.timing(anim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    });

    // Animate current card
    Animated.sequence([
      Animated.timing(cardAnimations[index], {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate dots
    dotAnimations.forEach((anim, i) => {
      Animated.timing(anim, {
        toValue: i === index ? 1 : 0,
        duration: 400,
        useNativeDriver: false,
      }).start();
    });
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const cardWidth = width - 48; // Account for padding
    const index = Math.round(contentOffset / cardWidth);
    
    if (index !== currentIndex && index >= 0 && index < valueCards.length) {
      setCurrentIndex(index);
      animateCard(index);
    }
  };

  const scrollToCard = (index: number) => {
    const cardWidth = width - 48;
    scrollViewRef.current?.scrollTo({
      x: index * cardWidth,
      animated: true,
    });
    setCurrentIndex(index);
    animateCard(index);
  };

  const renderCard = (card: ValueCard, index: number) => {
    const Icon = card.icon;
    
    const cardScale = cardAnimations[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0.95, 1],
    });

    const cardOpacity = cardAnimations[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0.7, 1],
    });

    return (
      <Animated.View
        key={card.id}
        style={[
          styles.card,
          {
            width: width - 48,
            transform: [{ scale: cardScale }],
            opacity: cardOpacity,
          }
        ]}
      >
        <ImageBackground
          source={card.backgroundImage}
          style={styles.cardBackground}
          imageStyle={styles.cardBackgroundImage}
        >
          <LinearGradient
            colors={card.gradient}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardContent}>
            {/* Content */}
            <View style={styles.textContent}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardDescription}>{card.description}</Text>
            </View>

            {/* Subtle Decorative Element */}
            <View style={[styles.decorativeAccent, { backgroundColor: card.iconColor }]} />
            </View>
          </LinearGradient>
        </ImageBackground>
      </Animated.View>
    );
  };

  return (
    <LinearGradient
      colors={['#f0fdfa', '#e6fffa', '#ccfbf1']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
        <SafeAreaView style={styles.safeArea}>
          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
            <Text style={styles.progressText}>4/10</Text>
          </View>

          {/* Main Content */}
          <Animated.View 
            style={[
              styles.contentContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            {/* Header */}
            <View style={styles.headerContainer}>
              <Text style={styles.headline}>Here's how Anu helps you grow</Text>
            </View>

            {/* Cards ScrollView */}
            <View style={styles.cardsContainer}>
              <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleScroll}
                decelerationRate="fast"
                contentContainerStyle={styles.scrollContent}
                style={styles.cardScrollView}
              >
                {valueCards.map((card, index) => renderCard(card, index))}
              </ScrollView>
            </View>

            {/* Dots Indicator */}
            <View style={styles.dotsContainer}>
              {valueCards.map((_, index) => {
                const dotScale = dotAnimations[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.3],
                });

                const dotOpacity = dotAnimations[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                });

                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => scrollToCard(index)}
                    style={styles.dotTouchable}
                    activeOpacity={0.7}
                  >
                    <Animated.View
                      style={[
                        styles.dot,
                        index === currentIndex && styles.activeDot,
                        {
                          transform: [{ scale: dotScale }],
                          opacity: dotOpacity,
                        }
                      ]}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Action Button */}
            <View style={styles.actionContainer}>
              <TouchableOpacity 
                style={styles.primaryButton} 
                onPress={onContinue}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#5BA3B8', '#357A8A']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.primaryButtonText}>Let's get started</Text>
                  <ChevronRight size={20} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </SafeAreaView>
    </LinearGradient>
  );
};

export default OnboardingValuePropScreen;