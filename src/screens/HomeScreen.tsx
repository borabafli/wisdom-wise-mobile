import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';
import { MessageCircle, Clock, Heart, Zap, BookOpen, Brain, Mic } from 'lucide-react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { homeScreenStyles as styles } from '../styles/components/HomeScreen.styles';
import { colors, gradients } from '../styles/tokens';
import { HomeScreenProps } from '../types';
import { useQuote } from '../hooks/useQuote';

const HomeScreen: React.FC<HomeScreenProps> = ({ onStartSession, onExerciseClick, onInsightClick, onNavigateToExercises, onNavigateToInsights }) => {
  const { currentQuote } = useQuote();
  return (
    <SafeAreaWrapper style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/background2.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(187, 242, 255, 0.85)', 'rgba(255, 255, 255, 0.85)']} // Gradient from #BBF2FF to white
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.backgroundOverlay}
        />
        
        {/* Background watercolor effects - keeping for subtle overlay */}
        <LinearGradient
          colors={[...gradients.background.calm]}
          style={[styles.backgroundGradient, { opacity: 0.1 }]}
        />
        
        {/* Background watercolor blobs - reduced opacity */}
        <View style={[styles.watercolorBlob, styles.blob1, { opacity: 0.1 }]} />
        <View style={[styles.watercolorBlob, styles.blob2, { opacity: 0.1 }]} />
        <View style={[styles.watercolorBlob, styles.blob3, { opacity: 0.1 }]} />
        <View style={[styles.watercolorBlob, styles.blob4, { opacity: 0.1 }]} />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* Main CTA - Start Guided Session with Turtle at Input Bar Edge */}
        <View style={styles.ctaSection}>
          <TouchableOpacity
            onPress={() => onStartSession()}
            style={styles.ctaButton}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[...gradients.card.glass]}
              style={styles.ctaGradient}
            >
              <View style={styles.ctaContent}>
                <Text style={styles.ctaTitle}>Begin your journey</Text>
                <Text style={styles.ctaSubtitle}>How are you feeling today?</Text>
                
                {/* Container for turtle and input bar */}
                <View style={styles.inputWithTurtleWrapper}>
                  {/* Turtle positioned at top edge of input bar */}
                  <View style={styles.turtleAtBarContainer}>
                    <Image 
                      source={require('../../assets/images/turtle-simple-3d.png')}
                      style={styles.turtleAtBarImage}
                      contentFit="contain"
                    />
                  </View>
                  
                  {/* Input area (slightly longer) */}
                  <View style={styles.inputContainer}>
                    <MessageCircle size={22} color={colors.text.primary} />
                    <Text style={styles.inputText}>Type or talk to start...</Text>
                    <View style={styles.micButton}>
                      <Mic size={22} color={colors.text.primary} />
                    </View>
                  </View>
                </View>
              </View>
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
              onPress={() => onStartSession({ type: 'morning-mindfulness', name: 'Morning Mindfulness', duration: '8 min', description: 'Start your day with gentle awareness and presence' })}
              style={styles.exerciseCard}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={[...gradients.card.primary]}
                style={styles.exerciseCardGradient}
              >
                <View style={styles.exerciseCardContent}>
                  <LinearGradient
                    colors={[...gradients.icon.blue]}
                    style={styles.exerciseIcon}
                  >
                    <Heart size={20} color={colors.blue[700]} />
                  </LinearGradient>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>Morning Mindfulness</Text>
                    <View style={styles.exerciseMeta}>
                      <Clock size={12} color="#6b7280" />
                      <Text style={styles.exerciseTime}>8 min mindfulness</Text>
                    </View>
                  </View>
                  <View style={styles.exerciseAction}>
                    <LinearGradient
                      colors={[...gradients.button.subtle]}
                      style={styles.actionIcon}
                    >
                      <Zap size={14} color={colors.blue[700]} />
                    </LinearGradient>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Stress Relief */}
            <TouchableOpacity
              onPress={() => onStartSession({ type: 'stress-relief', name: 'Stress Relief', duration: '3 min', description: 'progressive relaxation' })}
              style={styles.exerciseCard}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={[...gradients.card.primary]}
                style={styles.exerciseCardGradient}
              >
                <View style={styles.exerciseCardContent}>
                  <LinearGradient
                    colors={[...gradients.icon.blue]}
                    style={styles.exerciseIcon}
                  >
                    <Brain size={20} color={colors.blue[600]} />
                  </LinearGradient>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>Stress Relief</Text>
                    <View style={styles.exerciseMeta}>
                      <Clock size={12} color="#6b7280" />
                      <Text style={styles.exerciseTime}>3 min progressive relaxation</Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Gratitude Practice */}
            <TouchableOpacity
              onPress={() => onStartSession({ type: 'gratitude', name: 'Gratitude Practice', duration: '2 min', description: 'reflection' })}
              style={styles.exerciseCard}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={[...gradients.card.primary]}
                style={styles.exerciseCardGradient}
              >
                <View style={styles.exerciseCardContent}>
                  <LinearGradient
                    colors={[...gradients.icon.blue]}
                    style={styles.exerciseIcon}
                  >
                    <BookOpen size={20} color={colors.blue[700]} />
                  </LinearGradient>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>Gratitude Practice</Text>
                    <View style={styles.exerciseMeta}>
                      <Clock size={12} color="#6b7280" />
                      <Text style={styles.exerciseTime}>2 min reflection</Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              onPress={onNavigateToExercises}
              style={styles.quickActionButton}
              activeOpacity={0.9}
            >
              <Image 
                source={require('../../assets/images/13.png')}
                style={styles.quickActionBackgroundImage}
                contentFit="cover"
              />
              <LinearGradient
                colors={[...gradients.button.primary]}
                style={styles.quickActionGradient}
              >
                <BookOpen size={24} color="#1f2937" />
                <Text style={styles.quickActionText}>Browse Exercises</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={onNavigateToInsights}
              style={styles.quickActionButton}
              activeOpacity={0.9}
            >
              <Image 
                source={require('../../assets/images/15.png')}
                style={styles.quickActionBackgroundImage}
                contentFit="cover"
              />
              <LinearGradient
                colors={[...gradients.button.primary]}
                style={styles.quickActionGradient}
              >
                <Brain size={24} color="#1f2937" />
                <Text style={styles.quickActionText}>View Insights</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Motivational Quote */}
        <View style={styles.quoteSection}>
          <View style={styles.quoteCard}>
            <Image 
              source={require('../../assets/images/4.jpeg')}
              style={styles.quoteBackgroundImage}
              contentFit="cover"
            />
            <LinearGradient
              colors={[...gradients.hero.primary]}
              style={styles.quoteGradient}
            >
              <View style={styles.quoteIcon}>
                <Text style={styles.quoteSymbol}>"</Text>
              </View>
              <Text style={styles.quoteText}>
                {currentQuote?.text || 'Progress is progress, no matter how small'}
              </Text>
              <Text style={styles.quoteAuthor}>— {currentQuote?.author || 'Daily Mindfulness'}</Text>
            </LinearGradient>
          </View>
        </View>
      </ScrollView>
      
      </ImageBackground>
    </SafeAreaWrapper>
  );
};


export default HomeScreen;