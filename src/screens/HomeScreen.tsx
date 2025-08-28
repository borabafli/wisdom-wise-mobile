import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle, Clock, Heart, Zap, BookOpen, Brain, Mic } from 'lucide-react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { homeScreenStyles as styles } from '../styles/components/HomeScreen.styles';
import { colors, gradients } from '../styles/tokens';

interface HomeScreenProps {
  onStartSession: (exercise?: any) => void;
  onExerciseClick: (exercise?: any) => void;
  onInsightClick: (type: string, insight?: any) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onStartSession, onExerciseClick, onInsightClick }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Background watercolor effects */}
      <LinearGradient
        colors={gradients.background.calm}
        style={styles.backgroundGradient}
      />
      
      {/* Background watercolor blobs */}
      <View style={[styles.watercolorBlob, styles.blob1]} />
      <View style={[styles.watercolorBlob, styles.blob2]} />
      <View style={[styles.watercolorBlob, styles.blob3]} />
      <View style={[styles.watercolorBlob, styles.blob4]} />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerText}>
              <Text style={styles.welcomeTitle}>Welcome back</Text>
              <Text style={styles.welcomeSubtitle}>How are you feeling today?</Text>
            </View>
            
            {/* Turtle Companion */}
            <View style={styles.turtleContainer}>
              <LinearGradient
                colors={gradients.card.subtle}
                style={styles.turtleGradient}
              />
              <Image 
                source={require('../../assets/images/turtle11.png')}
                style={styles.turtleImage}
                contentFit="contain"
              />
            </View>
          </View>
        </View>

        {/* Main CTA - Start Guided Session */}
        <View style={styles.ctaSection}>
          <TouchableOpacity
            onPress={() => onStartSession()}
            style={styles.ctaButton}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={gradients.card.glass}
              style={styles.ctaGradient}
            >
              <View style={styles.ctaContent}>
                <Text style={styles.ctaTitle}>Begin your journey</Text>
                <Text style={styles.ctaSubtitle}>Let's start a guided session</Text>
                
                {/* Minimalist input area */}
                <View style={styles.inputContainer}>
                  <MessageCircle size={18} color={colors.text.primary} />
                  <Text style={styles.inputText}>Type or talk to start...</Text>
                  <View style={styles.micButton}>
                    <Mic size={16} color={colors.text.primary} />
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
              onPress={() => onExerciseClick()}
              style={styles.seeAllButton}
            >
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          {/* Exercise Cards */}
          <View style={styles.exercisesList}>
            {/* Morning Mindfulness */}
            <TouchableOpacity
              onPress={() => onStartSession({ type: 'mindfulness', name: 'Morning Mindfulness', duration: '5 min', description: 'breathing' })}
              style={styles.exerciseCard}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={gradients.card.primary}
                style={styles.exerciseCardGradient}
              >
                <View style={styles.exerciseCardContent}>
                  <LinearGradient
                    colors={gradients.icon.blue}
                    style={styles.exerciseIcon}
                  >
                    <Heart size={20} color={colors.blue[700]} />
                  </LinearGradient>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>Morning Mindfulness</Text>
                    <View style={styles.exerciseMeta}>
                      <Clock size={12} color="#6b7280" />
                      <Text style={styles.exerciseTime}>5 min breathing</Text>
                    </View>
                  </View>
                  <View style={styles.exerciseAction}>
                    <LinearGradient
                      colors={gradients.button.subtle}
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
                colors={gradients.card.primary}
                style={styles.exerciseCardGradient}
              >
                <View style={styles.exerciseCardContent}>
                  <LinearGradient
                    colors={gradients.icon.blue}
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
                colors={gradients.card.primary}
                style={styles.exerciseCardGradient}
              >
                <View style={styles.exerciseCardContent}>
                  <LinearGradient
                    colors={gradients.icon.blue}
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
              onPress={() => onExerciseClick()}
              style={styles.quickActionButton}
              activeOpacity={0.9}
            >
              <Image 
                source={require('../../assets/images/13.png')}
                style={styles.quickActionBackgroundImage}
                contentFit="cover"
              />
              <LinearGradient
                colors={gradients.button.primary}
                style={styles.quickActionGradient}
              >
                <BookOpen size={24} color={colors.blue[600]} />
                <Text style={styles.quickActionText}>Browse Exercises</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => onInsightClick('insights')}
              style={styles.quickActionButton}
              activeOpacity={0.9}
            >
              <Image 
                source={require('../../assets/images/15.png')}
                style={styles.quickActionBackgroundImage}
                contentFit="cover"
              />
              <LinearGradient
                colors={gradients.button.primary}
                style={styles.quickActionGradient}
              >
                <Brain size={24} color={colors.blue[600]} />
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
              colors={gradients.hero.primary}
              style={styles.quoteGradient}
            >
              <View style={styles.quoteIcon}>
                <Text style={styles.quoteSymbol}>"</Text>
              </View>
              <Text style={styles.quoteText}>
                Progress is progress, no matter how small
              </Text>
              <Text style={styles.quoteAuthor}>— Daily Mindfulness</Text>
            </LinearGradient>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


export default HomeScreen;