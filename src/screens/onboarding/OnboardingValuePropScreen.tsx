import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight } from 'lucide-react-native';
import { Image } from 'expo-image';
// import WatercolorBackdrop from '../../components/WatercolorBackdrop';
import { onboardingValuePropStyles as styles } from '../../styles/components/onboarding/OnboardingValueProp.styles';

const { width, height } = Dimensions.get('window');

interface ValueCard {
  id: number;
  iconImage: any;
  title: string;
  description: string;
}

const valueCards: ValueCard[] = [
  {
    id: 1,
    iconImage: require('../../../assets/images/Teal watercolor single element/teal-icon-2.png'),
    title: 'Therapeutic Conversations',
    description: "I'll help you untangle complex thoughts and emotions",
  },
  {
    id: 2,
    iconImage: require('../../../assets/images/Teal watercolor single element/teal-icon-5.png'),
    title: '14+ Therapeutic Exercises',
    description: 'From breathing techniques to CBT tools, all tailored to your needs',
  },
  {
    id: 3,
    iconImage: require('../../../assets/images/Teal watercolor single element/teal-icon-12.png'),
    title: 'Personal Insights Dashboard',
    description: 'Discover patterns in your thinking and celebrate progress',
  },
  {
    id: 4,
    iconImage: require('../../../assets/images/Teal watercolor single element/teal-icon-14.png'),
    title: 'AI That Remembers You',
    description: 'I learn from our conversations to provide personalized support',
  },
];

interface OnboardingValuePropScreenProps {
  onContinue: () => void;
}

const OnboardingValuePropScreen: React.FC<OnboardingValuePropScreenProps> = ({ onContinue }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const cardAnimations = useRef(valueCards.map(() => new Animated.Value(0))).current;

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

    // Staggered card animations
    const animateCards = () => {
      const animations = cardAnimations.map((anim, index) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 600,
          delay: index * 200,
          useNativeDriver: true,
        })
      );
      Animated.parallel(animations).start();
    };

    animateCards();
  }, []);


  const renderCard = (card: ValueCard, index: number) => {
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
            transform: [{ scale: cardScale }],
            opacity: cardOpacity,
          }
        ]}
      >
        <TouchableOpacity activeOpacity={0.85} style={styles.cardInner}>
          <View style={styles.cardContent}>
            <View style={styles.textContent}>
              <Image source={card.iconImage} style={styles.iconImage as any} contentFit="contain" />
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardDescription}>{card.description}</Text>
            </View>
          </View>
        </TouchableOpacity>
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
        {/* <WatercolorBackdrop style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} /> */}
        
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
        </View>

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
            <Text style={styles.headline}>How can Anu help you?</Text>
          </View>

          {/* Cards Grid */}
          <ScrollView 
            style={styles.cardsScrollView}
            contentContainerStyle={styles.cardsContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.cardsGrid}>
              {valueCards.map((card, index) => (
                <View key={card.id} style={styles.cardWrapper}>
                  {renderCard(card, index)}
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Action Button */}
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={onContinue}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#14b8a6', '#0d9488']}
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