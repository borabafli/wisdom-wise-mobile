/**
 * HomeScreen - Cross-platform optimized version
 * Demonstrates proper responsive design and typography
 */
import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MessageCircle, Clock, Heart, Mic } from 'lucide-react-native';

// New responsive components
import { ScreenWrapper } from '../components/SafeAreaWrapper';
import { ResponsiveText, Heading, BodyText } from '../components/ResponsiveText';
import { ResponsiveButton, PrimaryButton } from '../components/ResponsiveButton';

// Design system
import { homeScreenResponsiveStyles as styles } from '../styles/components/HomeScreen.responsive.styles';
import { colors, gradients } from '../styles/tokens';
import { screenDimensions, responsiveSpacing, touchTargets } from '../utils/crossPlatform';
import { HomeScreenProps } from '../types/app';
import { useQuote } from '../hooks/useQuote';

const HomeScreenOptimized: React.FC<HomeScreenProps> = ({ 
  onStartSession, 
  onExerciseClick, 
  onInsightClick, 
  onNavigateToExercises, 
  onNavigateToInsights 
}) => {
  const { currentQuote } = useQuote();

  const welcomeMessage = {
    title: "Begin your journey",
    subtitle: "How are you feeling today?"
  };

  return (
    <ScreenWrapper style={styles.container}>
      {/* Wave Header - Keep existing component */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0)', '#FFFFFF', '#F8FAFC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.backgroundGradient}
      />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section with Responsive Text */}
        <View style={styles.headerSection}>
          <View style={styles.headerText}>
            <Heading level={1} style={styles.ctaTitle}>
              {welcomeMessage.title}
            </Heading>
            <BodyText size="large" style={styles.ctaSubtitle}>
              {welcomeMessage.subtitle}
            </BodyText>
          </View>
          
          {/* Chat Input with Proper Touch Targets */}
          <TouchableOpacity
            onPress={() => onStartSession()}
            style={styles.inputWithTurtleWrapper}
            activeOpacity={0.7}
          >
            {/* Turtle Image */}
            <View style={styles.turtleAtBarContainer}>
              <Image
                source={require('../../assets/images/turtle-chat.png')}
                style={styles.turtleAtBarImage}
                contentFit="contain"
              />
            </View>

            {/* Input Container */}
            <View style={styles.inputContainer}>
              <BodyText style={styles.placeholderText}>
                Share what's on your mind...
              </BodyText>
              
              <TouchableOpacity
                style={styles.micButton}
                onPress={() => onStartSession()}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Mic
                  size={20}
                  color="#ffffff"
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quote Section with Responsive Layout */}
        {currentQuote && (
          <View style={styles.quoteSection}>
            <ResponsiveText variant="quote" style={styles.quoteText}>
              "{currentQuote.text}"
            </ResponsiveText>
            <ResponsiveText variant="caption" style={styles.quoteAuthor}>
              — {currentQuote.author}
            </ResponsiveText>
          </View>
        )}

        {/* Action Cards with Responsive Grid */}
        <View style={styles.actionCardsContainer}>
          <View style={styles.actionCardsGrid}>
            
            {/* Exercises Card */}
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => onNavigateToExercises()}
              activeOpacity={0.7}
            >
              <View style={styles.actionCardIcon}>
                <Heart
                  size={screenDimensions.isTablet ? 32 : 28}
                  color={colors.primary[500]}
                />
              </View>
              <ResponsiveText variant="actionTitle" style={styles.actionCardTitle}>
                Exercises
              </ResponsiveText>
              <ResponsiveText variant="actionDescription" style={styles.actionCardDescription}>
                Guided mindfulness activities
              </ResponsiveText>
            </TouchableOpacity>

            {/* Insights Card */}
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => onNavigateToInsights()}
              activeOpacity={0.7}
            >
              <View style={styles.actionCardIcon}>
                <Clock
                  size={screenDimensions.isTablet ? 32 : 28}
                  color={colors.primary[500]}
                />
              </View>
              <ResponsiveText variant="actionTitle" style={styles.actionCardTitle}>
                Insights
              </ResponsiveText>
              <ResponsiveText variant="actionDescription" style={styles.actionCardDescription}>
                Track your progress
              </ResponsiveText>
            </TouchableOpacity>

          </View>
        </View>

        {/* Quick Start Button */}
        <View style={{ paddingHorizontal: responsiveSpacing(20), marginTop: responsiveSpacing(24) }}>
          <PrimaryButton
            title="Start New Session"
            size="large"
            fullWidth
            onPress={() => onStartSession()}
            leftIcon={
              <MessageCircle
                size={20}
                color="#ffffff"
              />
            }
          />
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
};

export default HomeScreenOptimized;