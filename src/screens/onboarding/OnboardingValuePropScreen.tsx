import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, Dimensions, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, ResizeMode } from 'expo-av';
import * as NavigationBar from 'expo-navigation-bar';
import { onboardingValuePropStyles as styles } from '../../styles/components/onboarding/OnboardingValueProp.styles';

const { width, height } = Dimensions.get('window');

interface OnboardingPage {
  id: number;
  icon: any; // Image source for PNG icons
  title: string;
  description: string;
  isMainPage?: boolean;
}

const onboardingPages: OnboardingPage[] = [
  {
    id: 1,
    icon: require('../../../assets/images/onboarding/calm-icon-1.png'),
    title: 'Think Clearer, Feel Better',
    description: 'Learn to spot unhelpful thoughts and reframe them with science-backed CBT techniques',
  },
  {
    id: 2,
    icon: require('../../../assets/images/onboarding/understand-icon-2.png'),
    title: 'Understand yourself better',
    description: 'Discover patterns in your thoughts and feelings. Insights help you understand yourself—and how to grow.',
  },
  {
    id: 3,
    icon: require('../../../assets/images/onboarding/guided-icon-4.png'),
    title: 'Guided Growth, Made Simple',
    description: 'Anu always knows the next step and suggests exercises designed just for you.',
  },
  {
    id: 4,
    icon: require('../../../assets/images/onboarding/growth-icon-3.png'),
    title: 'Your Progress, Made Visible',
    description: 'See your journey unfold with saved exercises, insights, and milestones.',
  },
];

interface OnboardingValuePropScreenProps {
  onContinue: () => void;
}

const OnboardingValuePropScreen: React.FC<OnboardingValuePropScreenProps> = ({ onContinue }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const overlayFadeAnim = useRef(new Animated.Value(1)).current;
  const buttonFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Set Android navigation bar color to match background
    NavigationBar.setBackgroundColorAsync('#EDF8F8');

    // Elements appear one after the other
    Animated.sequence([
      // Short delay first
      Animated.delay(200),
      // Text content appears first
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Much shorter delay before button - wait for overlay to disappear first
      Animated.delay(800), // Wait for overlay to finish disappearing (1000ms + 600ms fade = 1600ms, start button at 1800ms)
      // Button appears after overlay is gone
      Animated.timing(buttonFadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    // Show video with slight delay - 0.4 second delay (increased from 0.2 second)
    setTimeout(() => {
      setShowVideo(true);
    }, 800);

    // Fade out overlay even earlier - 1 second delay (reduced from 1.5 seconds)
    setTimeout(() => {
      Animated.timing(overlayFadeAnim, {
        toValue: 0,
        duration: 600, // Even faster fade (reduced from 800ms)
        useNativeDriver: true,
      }).start(() => {
        setOverlayVisible(false); // Remove overlay completely after fade
      });
    }, 1000);
  }, []);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(scrollPosition / width);
    setCurrentPage(pageIndex);
  };

  const handleVideoLoad = () => {
    console.log('Video loaded, starting fade animation');
  };



  const renderPage = (page: OnboardingPage) => (
    <View key={page.id} style={styles.pageContainer}>
      {/* Text Content with Icon */}
      <View style={styles.textContent}>
        <Text style={styles.pageTitle}>
          {page.title}
        </Text>
        {/* Icon between heading and subtext */}
        <Image
          source={page.icon}
          style={styles.pageIcon}
          resizeMode="contain"
        />
        <Text style={styles.pageDescription}>
          {page.description}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#EDF8F8" translucent={false} />
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

          {/* Page Indicators - Above video */}
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

          {/* Static Anu Video - With overlay */}
          <View style={styles.staticAnuContainer}>
            <View style={styles.videoContainer}>
              {/* Static overlay that only animates when fading out */}
              {overlayVisible && (
                <Animated.View
                  style={[
                    styles.backgroundOverlay,
                    {
                      opacity: overlayFadeAnim,
                    }
                  ]}
                />
              )}
              {/* Video - only render after 0.5s delay */}
              {showVideo && (
                <Video
                  source={require('../../../assets/images/onboarding/videos/meditating-turtle.mp4')}
                  style={styles.staticAnuImage}
                  resizeMode={ResizeMode.CONTAIN}
                  shouldPlay={true}
                  isLooping={true}
                  isMuted={true}
                  useNativeControls={false}
                  onLoad={handleVideoLoad}
                />
              )}
            </View>
          </View>

          {/* Action Button - INSIDE animated container for consistency */}
          <Animated.View
            style={[
              styles.actionContainer,
              {
                opacity: buttonFadeAnim,
              }
            ]}
          >
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>
                {currentPage === onboardingPages.length - 1 ? "Let's begin" : "Continue"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

export default OnboardingValuePropScreen;