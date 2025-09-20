import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle, Brain, BookOpen } from 'lucide-react-native';
import { onboardingValuePropStyles as styles } from '../../styles/components/onboarding/OnboardingValueProp.styles';

const { width, height } = Dimensions.get('window');

interface OnboardingPage {
  id: number;
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  isMainPage?: boolean;
}

const onboardingPages: OnboardingPage[] = [
  {
    id: 1,
    icon: MessageCircle,
    title: 'Chat with a Guide Who Remembers',
    description: 'Our conversations build on each other. I\'ll remember your insights and progress to provide truly personal support.',
  },
  {
    id: 2,
    icon: Brain,
    title: 'Uncover Your Thinking Patterns',
    description: 'We\'ll go beyond simple mood tracking to gently identify and reframe unhelpful thoughts on your personal Insights Dashboard.',
  },
  {
    id: 3,
    icon: BookOpen,
    title: 'Build Real Skills with Proven Tools',
    description: 'Practice and grow with a library of guided exercises rooted in proven methods like CBT and Mindfulness.',
  },
];

interface OnboardingValuePropScreenProps {
  onContinue: () => void;
}

const OnboardingValuePropScreen: React.FC<OnboardingValuePropScreenProps> = ({ onContinue }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(scrollPosition / width);
    setCurrentPage(pageIndex);
  };


  const renderPage = (page: OnboardingPage) => (
    <View key={page.id} style={styles.pageContainer}>
      {/* Text Content Only */}
      <View style={styles.textContent}>
        <Text style={styles.pageTitle}>
          {page.title}
        </Text>
        <Text style={styles.pageDescription}>
          {page.description}
        </Text>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={['#F8FAFB', '#E8F4F1']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <Animated.View 
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          {/* Swipable Text Content */}
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={styles.swipeContainer}
          >
            {/* All Pages */}
            {onboardingPages.map((page) => renderPage(page))}
          </ScrollView>

          {/* Page Indicators - Right below text */}
          <View style={styles.pageIndicators}>
            {onboardingPages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.pageIndicator,
                  currentPage === index && styles.activePageIndicator
                ]}
              />
            ))}
          </View>

          {/* Static Anu Image - Never moves */}
          <View style={styles.staticAnuContainer}>
            <Image
              source={require('../../../assets/images/turtle-hero-3.png')}
              style={styles.staticAnuImage}
              resizeMode="contain"
            />
          </View>

          {/* Action Button */}
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={onContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>
                {currentPage === onboardingPages.length - 1 ? "Let's begin" : "Continue"}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default OnboardingValuePropScreen;