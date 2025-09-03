import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';
import { Heart, Brain, BookOpen, Clock, Star, Wind, Eye, Search, X, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { exercisesArray } from '../data/exerciseLibrary';
import { colors, gradients, shadows } from '../styles/tokens';

const { width, height } = Dimensions.get('window');

interface ExerciseLibraryProps {
  onExerciseClick: (exercise: any) => void;
}

const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({ onExerciseClick }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Use unified exercises from exerciseLibrary.ts
  const exercises = exercisesArray;

  const categories = ['All', 'CBT', 'ACT', 'Mindfulness', 'Breathing', 'Journaling', 'Self-Care'];

  // Filter exercises based on selected category
  const filteredExercises = useMemo(() => {
    if (selectedCategory === 'All') {
      return exercises;
    }
    return exercises.filter(exercise => exercise.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <SafeAreaWrapper style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchSection}>
        <TouchableOpacity style={styles.searchBar} activeOpacity={0.8}>
          <Search size={20} color={colors.text.secondary} />
          <Text style={styles.searchText}>Exercises, quotes and your entries...</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Featured & For You Section */}
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Featured & For You</Text>
          
          {/* Featured Card */}
          <TouchableOpacity 
            style={styles.featuredCard}
            onPress={() => onExerciseClick(exercises[0])}
            activeOpacity={0.8}
          >
            <View style={styles.featuredCardLeft}>
              <View style={styles.featuredCardGradient}>
                <Image 
                  source={exercises[0]?.image || require('../../assets/images/icons-1.png')}
                  style={styles.featuredCardImage}
                  contentFit="contain"
                />
              </View>
            </View>
            <View style={styles.featuredCardRight}>
              <Text style={styles.featuredCardLabel}>Upcoming Exercise</Text>
              <Text style={styles.featuredCardTitle}>Daily Mindfulness!</Text>
              <Text style={styles.featuredCardDescription}>
                Today is the perfect time to practice mindfulness and inner peace.
              </Text>
              <View style={styles.featuredCardBadge}>
                <Text style={styles.featuredCardBadgeText}>in 1 week</Text>
              </View>
            </View>
          </TouchableOpacity>
          
          {/* Quick Exercise Cards Grid */}
          <View style={styles.exerciseGrid}>
            <TouchableOpacity 
              style={styles.exerciseGridCard}
              onPress={() => onExerciseClick(exercises[1])}
              activeOpacity={0.8}
            >
              <View style={styles.exerciseGridBadge}>
                <Text style={styles.exerciseGridBadgeText}>NEW</Text>
              </View>
              <Text style={styles.exerciseGridCategory}>Journaling</Text>
              <Text style={styles.exerciseGridTitle}>Well-Being Check-Up</Text>
              <Text style={styles.exerciseGridDescription}>
                A journal to track your mental and emotional w...
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.exerciseGridCard}
              onPress={() => onExerciseClick(exercises[2])}
              activeOpacity={0.8}
            >
              <View style={[styles.exerciseGridBadge, styles.featuredBadge]}>
                <Text style={[styles.exerciseGridBadgeText, { color: colors.text.primary }]}>FEATURED</Text>
              </View>
              <Text style={styles.exerciseGridCategory}>Journaling</Text>
              <Text style={styles.exerciseGridTitle}>Moment of Gratitude</Text>
              <Text style={styles.exerciseGridDescription}>
                A short guided journal to practice gratitude in yo...
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Your Mindful Library Section */}
        <View style={styles.librarySection}>
          <Text style={styles.sectionTitle}>Your Mindful Library, Organized</Text>
          
          {/* Library Grid */}
          <View style={styles.libraryGrid}>
            {/* Collections Card */}
            <TouchableOpacity style={styles.libraryCard} activeOpacity={0.8}>
              <Text style={styles.libraryCardTitle}>Collections</Text>
              <Text style={styles.libraryCardDescription}>
                Deep dive into important topics.
              </Text>
              <ChevronRight size={20} color={colors.text.primary} style={styles.libraryCardIcon} />
            </TouchableOpacity>
            
            {/* Weekly Themes Card */}
            <TouchableOpacity style={[styles.libraryCard, styles.darkCard]} activeOpacity={0.8}>
              <Text style={styles.libraryCardTitleDark}>Weekly Themes</Text>
              <Text style={styles.libraryCardDescriptionDark}>
                Browse topics from past weeks.
              </Text>
              <ChevronRight size={20} color={colors.background.card} style={styles.libraryCardIcon} />
            </TouchableOpacity>
            
            {/* Daily Essentials Card */}
            <TouchableOpacity style={[styles.libraryCard, styles.darkCard]} activeOpacity={0.8}>
              <Text style={styles.libraryCardTitleDark}>Daily Essentials</Text>
              <ChevronRight size={20} color={colors.background.card} style={styles.libraryCardIcon} />
            </TouchableOpacity>
            
            {/* Well-Being SOS Card */}
            <TouchableOpacity style={[styles.libraryCard, styles.darkCard]} activeOpacity={0.8}>
              <Text style={styles.libraryCardTitleDark}>Well-Being SOS</Text>
              <Text style={styles.libraryCardDescriptionDark}>
                Your emotional emergency toolkit for stress relief.
              </Text>
              <View style={styles.sosIllustration}>
                <View style={styles.sosCircle} />
                <View style={[styles.sosCircle, styles.sosCircle2]} />
                <View style={[styles.sosCircle, styles.sosCircle3]} />
              </View>
              <ChevronRight size={20} color={colors.background.card} style={styles.libraryCardIcon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Practice Cards */}
        <View style={styles.quickPracticeSection}>
          <View style={styles.quickPracticeGrid}>
            <TouchableOpacity style={styles.quickPracticeCard} activeOpacity={0.8}>
              <Text style={styles.quickPracticeTitle}>breathing.</Text>
              <Text style={styles.quickPracticeDescription}>Breathe in, breathe out.</Text>
              <View style={styles.quickPracticeIcon}>
                <View
                  style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Image 
                    source={require('../../assets/images/icons-4.png')}
                    style={styles.quickPracticeIconImage}
                    contentFit="contain"
                  />
                </View>
              </View>
              <ChevronRight size={20} color={colors.text.primary} style={styles.quickPracticeArrow} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickPracticeCard} activeOpacity={0.8}>
              <Text style={styles.quickPracticeTitle}>meditation.</Text>
              <Text style={styles.quickPracticeDescription}>Wind down and relax.</Text>
              <View style={styles.quickPracticeIcon}>
                <View
                  style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Image 
                    source={require('../../assets/images/icons-5.png')}
                    style={styles.quickPracticeIconImage}
                    contentFit="contain"
                  />
                </View>
              </View>
              <ChevronRight size={20} color={colors.text.primary} style={styles.quickPracticeArrow} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  
  // Search Section
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: shadows.sm.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchText: {
    flex: 1,
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: '400',
  },
  
  // Featured Section
  featuredSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 20,
  },
  featuredCard: {
    flexDirection: 'row',
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: shadows.sm.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  featuredCardLeft: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
  },
  featuredCardGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredCardImage: {
    width: 50,
    height: 50,
  },
  featuredCardRight: {
    flex: 1,
  },
  featuredCardLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  featuredCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  featuredCardDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  featuredCardBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  featuredCardBadgeText: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  
  // Exercise Grid
  exerciseGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  exerciseGridCard: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: 16,
    minHeight: 180,
    shadowColor: shadows.sm.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  exerciseGridBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary.main,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  featuredBadge: {
    backgroundColor: colors.background.card,
  },
  exerciseGridBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  exerciseGridCategory: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
    marginBottom: 8,
  },
  exerciseGridTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  exerciseGridDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  
  // Library Section
  librarySection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  libraryGrid: {
    gap: 12,
  },
  libraryCard: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: shadows.sm.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  darkCard: {
    backgroundColor: colors.text.primary,
  },
  libraryCardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  libraryCardTitleDark: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.background.card,
    marginBottom: 8,
  },
  libraryCardDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  libraryCardDescriptionDark: {
    fontSize: 14,
    color: colors.text.tertiary,
    lineHeight: 20,
  },
  libraryCardIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  sosIllustration: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 40,
  },
  sosCircle: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.background.card,
  },
  sosCircle2: {
    left: 15,
    top: 5,
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  sosCircle3: {
    left: 30,
    top: 15,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  
  // Quick Practice Section
  quickPracticeSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  quickPracticeGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickPracticeCard: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: 16,
    minHeight: 160,
    shadowColor: shadows.sm.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  quickPracticeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  quickPracticeDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  quickPracticeIcon: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  quickPracticeIconImage: {
    width: 28,
    height: 28,
  },
  quickPracticeArrow: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
});

export default ExerciseLibrary;