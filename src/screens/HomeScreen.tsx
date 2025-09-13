import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, ImageBackground, Modal, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';
import { MessageCircle, Clock, Heart, Zap, BookOpen, Brain, Mic, User, Leaf, Play, Circle, Waves, X } from 'lucide-react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { homeScreenStyles as styles } from '../styles/components/HomeScreen.styles';
import { colors, gradients } from '../styles/tokens';
import { HomeScreenProps } from '../types/app';
import { useQuote } from '../hooks/useQuote';
import { useNavigationBarStyle, navigationBarConfigs } from '../hooks/useNavigationBarStyle';
import { AudioWaveformDemo } from '../components/audio/AudioWaveformDemo';

const HomeScreen: React.FC<HomeScreenProps> = ({ onStartSession, onExerciseClick, onInsightClick, onNavigateToExercises, onNavigateToInsights }) => {
  const { currentQuote } = useQuote();
  const { width, height } = Dimensions.get('window');
  const [showWaveformDemo, setShowWaveformDemo] = useState(false);
  const insets = useSafeAreaInsets();

  // Apply dynamic navigation bar styling
  const { statusBarStyle } = useNavigationBarStyle(navigationBarConfigs.homeScreen);

  // Static welcome message
  const welcomeMessage = {
    title: "Let's begin with you",
    subtitle: "How are you right now?"
  };


  return (
    <SafeAreaWrapper style={styles.container}>
      <StatusBar style={statusBarStyle} backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.8)', '#F8FAFC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.backgroundGradient}
      />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          Platform.OS === 'android' && { paddingBottom: insets.bottom }
        ]}
      >
        {/* Header Text and Chat Input */}
        <View style={styles.headerSection}>
          <View style={styles.headerText}>
            <Text style={styles.ctaTitle}>{welcomeMessage.title}</Text>
            <Text style={styles.ctaSubtitle}>{welcomeMessage.subtitle}</Text>
          </View>
          
          {/* Scrollable Turtle Background - positioned between text and chatbar */}
          <View style={styles.scrollableTurtleContainer}>
            <Image 
              source={require('../../assets/images/Teal watercolor single element/home-background.png')}
              style={styles.scrollableTurtleImage}
              contentFit="contain"
            />
          </View>
          
          {/* Container for turtle and input bar */}
          <TouchableOpacity
            onPress={() => onStartSession()}
            style={styles.inputWithTurtleWrapper}
            activeOpacity={0.9}
          >
            
            {/* Input area */}
            <LinearGradient
              colors={['rgba(248, 250, 252, 0.7)', 'rgba(241, 245, 249, 0.8)', 'rgba(255, 255, 255, 0.9)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.inputContainer}
            >
              <View style={styles.micButton}>
                <Mic size={28} color="#374151" strokeWidth={1.5} />
              </View>
              <Text style={styles.inputText} numberOfLines={1}>Share how you feel...</Text>
            </LinearGradient>
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
                colors={['#ECFAF8', '#EDF8F8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.exerciseCardGradient}
              >
                <View style={styles.exerciseCardContent}>
                  <View style={styles.exerciseIcon}>
                    <Image 
                      source={require('../../assets/images/Teal watercolor single element/green-icon-2.png')}
                      style={styles.exerciseIconImage}
                      contentFit="contain"
                    />
                  </View>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName} numberOfLines={1}>Morning Mindfulness</Text>
                    <Text style={styles.exerciseDescription}>Gentle awareness</Text>
                    <Text style={styles.exerciseTime}>8 min</Text>
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
                colors={['#ECFAF8', '#EDF8F8']}
                start={{ x: 0, y: 0.3 }}
                end={{ x: 1, y: 0.8 }}
                style={styles.exerciseCardGradient}
              >
                <View style={styles.exerciseCardContent}>
                  <View style={styles.exerciseIcon}>
                    <Image 
                      source={require('../../assets/images/Teal watercolor single element/green-icon-7.png')}
                      style={styles.exerciseIconImage}
                      contentFit="contain"
                    />
                  </View>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName} numberOfLines={1}>Stress Relief</Text>
                    <Text style={styles.exerciseDescription}>Release tension</Text>
                    <Text style={styles.exerciseTime}>3 min</Text>
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
                colors={['#ECFAF8', '#EDF8F8']}
                start={{ x: 0.2, y: 0 }}
                end={{ x: 0.8, y: 1 }}
                style={styles.exerciseCardGradient}
              >
                <View style={styles.exerciseCardContent}>
                  <View style={styles.exerciseIcon}>
                    <Image 
                      source={require('../../assets/images/Teal watercolor single element/green-icon-8.png')}
                      style={styles.exerciseIconImage}
                      contentFit="contain"
                    />
                  </View>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName} numberOfLines={1}>Gratitude Practice</Text>
                    <Text style={styles.exerciseDescription}>Cultivate positivity</Text>
                    <Text style={styles.exerciseTime}>2 min</Text>
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
                colors={['rgba(161, 214, 242, 0.25)', 'rgba(184, 224, 245, 0.15)', 'rgba(255, 255, 255, 0.8)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quickActionGradient}
              >
                <Image 
                  source={require('../../assets/images/Teal watercolor single element/green-icon-9.png')}
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
                colors={['rgba(147, 197, 253, 0.25)', 'rgba(186, 230, 253, 0.15)', 'rgba(255, 255, 255, 0.8)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quickActionGradient}
              >
                <Image 
                  source={require('../../assets/images/Teal watercolor single element/green-icon-10.png')}
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
          <View style={styles.quoteCard}>
            <ImageBackground
              source={require('../../assets/images/Teal watercolor single element/home-background.png')}
              style={styles.quoteBackgroundImage}
              imageStyle={styles.quoteBackgroundImageStyle}
              resizeMode="cover"
            >
              <LinearGradient
                colors={['rgba(161, 214, 242, 0.4)', 'rgba(186, 230, 253, 0.3)', 'rgba(255, 255, 255, 0.6)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quoteOverlayGradient}
              >
                <Text style={styles.quoteText}>
                  {currentQuote?.text || 'Progress is progress, no matter how small'}
                </Text>
                <Text style={styles.quoteAuthor}>— {currentQuote?.author || 'Daily Mindfulness'}</Text>
              </LinearGradient>
            </ImageBackground>
          </View>
        </View>
      </ScrollView>

      {/* Audio Waveform Demo Modal */}
      <Modal
        visible={showWaveformDemo}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowWaveformDemo(false)}
      >
        <SafeAreaWrapper style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            paddingHorizontal: 20, 
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#E2E8F0',
            backgroundColor: 'white'
          }}>
            <Text style={{ 
              fontSize: 18, 
              fontFamily: 'Inter-SemiBold', 
              color: '#1E293B' 
            }}>
              Real-Time Audio Waves
            </Text>
            <TouchableOpacity 
              onPress={() => setShowWaveformDemo(false)}
              style={{ 
                width: 32, 
                height: 32, 
                borderRadius: 16, 
                backgroundColor: '#F1F5F9',
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              <X size={18} color="#64748B" />
            </TouchableOpacity>
          </View>
          
          {/* <AudioWaveformDemo /> */}
        </SafeAreaWrapper>
      </Modal>
    </SafeAreaWrapper>
  );
};

export default HomeScreen;