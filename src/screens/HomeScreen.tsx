import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, ImageBackground } from 'react-native';
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';
import { MessageCircle, Clock, Heart, Zap, BookOpen, Brain, Mic, User, Leaf, Play, Circle } from 'lucide-react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { homeScreenStyles as styles } from '../styles/components/HomeScreen.styles';
import { colors, gradients } from '../styles/tokens';
import { HomeScreenProps } from '../types/app';
import { useQuote } from '../hooks/useQuote';

const HomeScreen: React.FC<HomeScreenProps> = ({ onStartSession, onExerciseClick, onInsightClick, onNavigateToExercises, onNavigateToInsights }) => {
  const { currentQuote } = useQuote();
  const { width, height } = Dimensions.get('window');

  // Static welcome message
  const welcomeMessage = {
    title: "Begin your journey",
    subtitle: "How are you feeling today?"
  };


  return (
    <SafeAreaWrapper style={styles.container}>
      <LinearGradient
        colors={['#A1D6F2', '#B8E0F5', '#E3F4FD']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.backgroundGradient}
      />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* Header Text and Chat Input */}
        <View style={styles.headerSection}>
          <View style={styles.headerText}>
            <Text style={styles.ctaTitle}>{welcomeMessage.title}</Text>
            <Text style={styles.ctaSubtitle}>{welcomeMessage.subtitle}</Text>
          </View>
          
          {/* Container for turtle and input bar */}
          <TouchableOpacity
            onPress={() => onStartSession()}
            style={styles.inputWithTurtleWrapper}
            activeOpacity={0.9}
          >
            {/* Minimalist turtle positioned at top edge of input bar */}
            <View style={styles.turtleAtBarContainer}>
              <Image 
                source={require('../../assets/images/turtle-simple-3d.png')}
                style={styles.turtleAtBarImage}
                contentFit="contain"
              />
            </View>
            
            {/* Input area */}
            <View style={styles.inputContainer}>
              <View style={styles.micButton}>
                <Mic size={32} color="#29BDE0" strokeWidth={1.5} />
              </View>
              <Text style={styles.inputText}>Type or talk to start...</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* For You Today Section */}
        <View style={styles.exercisesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>For You Today</Text>
            <TouchableOpacity 
              onPress={onNavigateToExercises}
              style={styles.seeAllButton}
            >
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          {/* Exercise Cards */}
          <View style={styles.exercisesList}>
            {/* Morning Mindfulness */}
            <TouchableOpacity
              onPress={() => onStartSession({ type: 'mindfulness', name: 'Morning Mindfulness', duration: '8 min', description: 'Start your day with gentle awareness and presence' })}
              style={styles.exerciseCard}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.85)', 'rgba(248, 250, 252, 0.75)']}
                style={styles.exerciseCardGradient}
              >
                <View style={styles.exerciseCardContent}>
                  <View style={styles.exerciseIcon}>
                    <Image 
                      source={require('../../assets/images/new-icon1.png')}
                      style={styles.exerciseIconImage}
                      contentFit="contain"
                    />
                  </View>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>Morning Mindfulness</Text>
                    <Text style={styles.exerciseDescription}>Start your day with gentle awareness</Text>
                    <Text style={styles.exerciseTime}>8 min session</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Stress Relief */}
            <TouchableOpacity
              onPress={() => onStartSession({ type: 'stress-relief', name: 'Stress Relief', duration: '3 min', description: 'Progressive relaxation for immediate relief' })}
              style={styles.exerciseCard}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.85)', 'rgba(248, 250, 252, 0.75)']}
                style={styles.exerciseCardGradient}
              >
                <View style={styles.exerciseCardContent}>
                  <View style={styles.exerciseIcon}>
                    <Image 
                      source={require('../../assets/images/new-icon2.png')}
                      style={styles.exerciseIconImage}
                      contentFit="contain"
                    />
                  </View>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>Stress Relief</Text>
                    <Text style={styles.exerciseDescription}>Release tension and find calm</Text>
                    <Text style={styles.exerciseTime}>3 min relaxation</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Gratitude Practice */}
            <TouchableOpacity
              onPress={() => onStartSession({ type: 'gratitude', name: 'Gratitude Practice', duration: '2 min', description: 'Cultivate appreciation and positive mindset' })}
              style={styles.exerciseCard}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.85)', 'rgba(248, 250, 252, 0.75)']}
                style={styles.exerciseCardGradient}
              >
                <View style={styles.exerciseCardContent}>
                  <View style={styles.exerciseIcon}>
                    <Image 
                      source={require('../../assets/images/new-icon3.png')}
                      style={styles.exerciseIconImage}
                      contentFit="contain"
                    />
                  </View>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>Gratitude Practice</Text>
                    <Text style={styles.exerciseDescription}>Cultivate appreciation and positivity</Text>
                    <Text style={styles.exerciseTime}>2 min reflection</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Quick Actions - Modern Style */}
        <View style={styles.quickActions}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              onPress={onNavigateToExercises}
              style={styles.quickActionButton}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['rgba(186, 230, 253, 0.8)', 'rgba(147, 197, 253, 0.7)']}
                style={styles.quickActionGradient}
              >
                <Image 
                  source={require('../../assets/images/new-icon6.png')}
                  style={styles.quickActionIconImage}
                  contentFit="contain"
                />
                <Text style={styles.quickActionText}>Browse Exercises</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={onNavigateToInsights}
              style={styles.quickActionButton}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['rgba(147, 197, 253, 0.8)', 'rgba(96, 165, 250, 0.7)']}
                style={styles.quickActionGradient}
              >
                <Image 
                  source={require('../../assets/images/new-icon7.png')}
                  style={styles.quickActionIconImage}
                  contentFit="contain"
                />
                <Text style={styles.quickActionText}>View Insights</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Motivational Quote - Modern Style */}
        <View style={styles.quoteSection}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.9)', 'rgba(248, 250, 252, 0.8)']}
            style={styles.quoteCard}
          >
            <ImageBackground
              source={require('../../assets/images/6.jpg')}
              style={styles.quoteBackgroundImage}
              imageStyle={styles.quoteBackgroundImageStyle}
              resizeMode="cover"
            >
            <View style={styles.quoteIcon}>
              <Image 
                source={require('../../assets/images/new-icon5.png')}
                style={styles.quoteIconImage}
                contentFit="contain"
              />
            </View>
            <Text style={styles.quoteText}>
              {currentQuote?.text || 'Progress is progress, no matter how small'}
            </Text>
            <Text style={styles.quoteAuthor}>— {currentQuote?.author || 'Daily Mindfulness'}</Text>
            </ImageBackground>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default HomeScreen;