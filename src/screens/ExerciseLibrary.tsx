import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Brain, BookOpen, Clock, Star, Wind, Eye } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';

const { width, height } = Dimensions.get('window');

const ExerciseLibrary: React.FC = () => {
  const exercises = [
    {
      id: 1,
      type: 'cbt',
      name: 'Thought Challenge',
      duration: '15 min',
      description: 'Identify and reframe negative thought patterns',
      category: 'CBT',
      difficulty: 'Intermediate',
      icon: Brain,
      color: ['#B5A7C6', '#D4B5D0'],
      image: require('../../assets/images/4.jpeg')
    },
    {
      id: 2,
      type: 'breathing',
      name: '4-7-8 Breathing',
      duration: '5 min',
      description: 'Calm your nervous system with rhythmic breathing',
      category: 'Breathing',
      difficulty: 'Beginner',
      icon: Wind,
      color: ['#8FA5B3', '#C3D9E6'],
      image: require('../../assets/images/5.jpeg')
    },
    {
      id: 3,
      type: 'mindfulness',
      name: 'Body Scan',
      duration: '10 min',
      description: 'Release tension through mindful awareness',
      category: 'Mindfulness',
      difficulty: 'Beginner',
      icon: Eye,
      color: ['#95B99C', '#B8C5A6'],
      image: require('../../assets/images/7.jpeg')
    },
    {
      id: 4,
      type: 'journaling',
      name: 'Gratitude Journal',
      duration: '10 min',
      description: 'Shift focus to positive moments in your day',
      category: 'Journaling',
      difficulty: 'Beginner',
      icon: BookOpen,
      color: ['#FFD4BA', '#FFE5D4'],
      image: require('../../assets/images/8.jpeg')
    },
    {
      id: 5,
      type: 'self-compassion',
      name: 'Self-Compassion Break',
      duration: '5 min',
      description: 'Practice kindness towards yourself',
      category: 'Self-Care',
      difficulty: 'Beginner',
      icon: Heart,
      color: ['#E8B5A6', '#F5E6D3'],
      image: require('../../assets/images/9.jpeg')
    },
    {
      id: 6,
      type: 'cbt',
      name: 'Values Clarification',
      duration: '20 min',
      description: 'Connect with what matters most to you',
      category: 'CBT',
      difficulty: 'Advanced',
      icon: Star,
      color: ['#D4C5B9', '#E5E5E5'],
      image: require('../../assets/images/2.jpeg')
    }
  ];

  const categories = ['All', 'CBT', 'Mindfulness', 'Breathing', 'Journaling', 'Self-Care'];

  return (
    <SafeAreaView style={styles.container}>
      {/* Background */}
      <LinearGradient
        colors={['#dbeafe', '#f0f9ff', '#bfdbfe']}
        style={styles.backgroundGradient}
      />
      
      {/* Background watercolor blobs */}
      <View style={[styles.watercolorBlob, styles.blob1]} />
      <View style={[styles.watercolorBlob, styles.blob2]} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Exercise Library</Text>
        <Text style={styles.subtitle}>Guided practices for wellbeing</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Categories */}
        <View style={styles.categoriesSection}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category, index) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  index === 0 && styles.categoryButtonActive
                ]}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.categoryText,
                  index === 0 && styles.categoryTextActive
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Exercises */}
        <View style={styles.exercisesSection}>
          {exercises.map((exercise) => {
            const Icon = exercise.icon;
            return (
              <TouchableOpacity
                key={exercise.id}
                style={styles.exerciseCard}
                activeOpacity={0.9}
              >
                {/* Background Image Section */}
                <View style={styles.exerciseImageSection}>
                  <Image 
                    source={exercise.image}
                    style={styles.exerciseBackgroundImage}
                    contentFit="cover"
                  />
                  <LinearGradient
                    colors={[...exercise.color, `${exercise.color[1]}80`]}
                    style={styles.exerciseImageOverlay}
                  />
                  <View style={styles.exerciseImageIcon}>
                    <LinearGradient
                      colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.95)']}
                      style={styles.exerciseIconContainer}
                    >
                      <Icon size={24} color={exercise.color[1]} />
                    </LinearGradient>
                  </View>
                </View>

                {/* Content Section */}
                <View style={styles.exerciseCardContent}>
                  <View style={styles.exerciseHeader}>
                    <Text style={styles.exerciseName}>
                      {exercise.name}
                    </Text>
                    <View style={styles.difficultyBadge}>
                      <Text style={styles.difficultyText}>
                        {exercise.difficulty}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.exerciseDescription}>
                    {exercise.description}
                  </Text>
                  
                  <View style={styles.exerciseMeta}>
                    <View style={styles.metaItem}>
                      <Clock size={12} color="#9b9b9b" />
                      <Text style={styles.metaText}>
                        {exercise.duration}
                      </Text>
                    </View>
                    <View style={styles.categoryTag}>
                      <Text style={styles.categoryTagText}>
                        {exercise.category}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.95)', 'rgba(239, 246, 255, 0.9)']}
            style={styles.statsCard}
          >
            <Text style={styles.statsTitle}>
              Your Practice Stats
            </Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>47</Text>
                <Text style={styles.statLabel}>Minutes</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>5</Text>
                <Text style={styles.statLabel}>Streak</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  watercolorBlob: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.3,
  },
  blob1: {
    top: 0,
    right: -80,
    width: 256,
    height: 256,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  blob2: {
    bottom: 0,
    left: -96,
    width: 384,
    height: 384,
    backgroundColor: 'rgba(125, 211, 252, 0.15)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 8,
  },
  categoriesSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  categoriesContainer: {
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(186, 230, 253, 0.6)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  categoryButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  categoryText: {
    fontWeight: '500',
    color: '#1d4ed8',
  },
  categoryTextActive: {
    color: 'white',
  },
  exercisesSection: {
    paddingHorizontal: 24,
    gap: 16,
  },
  exerciseCard: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(191, 219, 254, 0.6)',
    overflow: 'hidden',
  },
  exerciseImageSection: {
    height: 140,
    overflow: 'hidden',
  },
  exerciseBackgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  exerciseImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.4,
  },
  exerciseImageIcon: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  exerciseIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseCardContent: {
    padding: 20,
  },
  exerciseIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
    marginRight: 8,
  },
  difficultyBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 14,
    color: '#1d4ed8',
    fontWeight: '500',
  },
  exerciseDescription: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 22,
    marginBottom: 12,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  categoryTag: {
    backgroundColor: 'rgba(226, 232, 240, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryTagText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
  },
  statsSection: {
    paddingHorizontal: 24,
    marginTop: 32,
    marginBottom: 24,
  },
  statsCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(191, 219, 254, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    marginTop: 4,
  },
});

export default ExerciseLibrary;