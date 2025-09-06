import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';
import { Heart, Brain, BookOpen, Clock, Star, Wind, Eye } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { exercisesArray } from '../data/exerciseLibrary';

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
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonActive
                ]}
                activeOpacity={0.8}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Exercises */}
        <View style={styles.exercisesSection}>
          {filteredExercises.map((exercise) => {
            const Icon = exercise.icon;
            return (
              <TouchableOpacity
                key={exercise.id}
                style={styles.exerciseCard}
                activeOpacity={0.9}
                onPress={() => onExerciseClick(exercise)}
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
    </SafeAreaWrapper>
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