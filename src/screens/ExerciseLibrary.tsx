import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';
import { Search, Filter, Clock, Heart, Brain, Wind, Eye, Sparkles, X, Bug } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { exercisesArray } from '../data/exerciseLibrary';
import { colors, gradients, shadows } from '../styles/tokens';
import { MoodSlider } from '../components/chat/MoodSlider';

const { width, height } = Dimensions.get('window');

interface ExerciseLibraryProps {
  onExerciseClick: (exercise: any) => void;
}

const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({ onExerciseClick }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('All');
  const [selectedBenefitFilter, setSelectedBenefitFilter] = useState('All');
  const [selectedStyleFilter, setSelectedStyleFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(true);
  const [showDevSlider, setShowDevSlider] = useState(false);
  
  // Use unified exercises from exerciseLibrary.ts
  const exercises = exercisesArray;

  // Filter options
  const timeFilters = ['All', '1-5 min', '5-15 min', '15-30 min', '30+ min'];
  const benefitFilters = ['All', 'Anxiety', 'Mood', 'Self-exploration', 'Clarity', 'Stress', 'Focus', 'Sleep'];
  const styleFilters = ['All', 'CBT', 'Breathing', 'Meditation', 'Journaling', 'Mindfulness', 'ACT'];

  // Helper function to get duration in minutes
  const getDurationInMinutes = (duration: string) => {
    const match = duration.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  // Filter exercises based on all criteria
  const filteredExercises = useMemo(() => {
    let filtered = exercises;

    // Search filter
    if (searchText) {
      filtered = filtered.filter(exercise =>
        exercise.name.toLowerCase().includes(searchText.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchText.toLowerCase()) ||
        exercise.category.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Time filter
    if (selectedTimeFilter !== 'All') {
      filtered = filtered.filter(exercise => {
        const duration = getDurationInMinutes(exercise.duration);
        switch (selectedTimeFilter) {
          case '1-5 min': return duration >= 1 && duration <= 5;
          case '5-15 min': return duration > 5 && duration <= 15;
          case '15-30 min': return duration > 15 && duration <= 30;
          case '30+ min': return duration > 30;
          default: return true;
        }
      });
    }

    // Benefit filter (based on category and keywords)
    if (selectedBenefitFilter !== 'All') {
      filtered = filtered.filter(exercise => {
        const benefit = selectedBenefitFilter.toLowerCase();
        return exercise.category.toLowerCase().includes(benefit) ||
               exercise.description.toLowerCase().includes(benefit) ||
               exercise.name.toLowerCase().includes(benefit);
      });
    }

    // Style filter
    if (selectedStyleFilter !== 'All') {
      filtered = filtered.filter(exercise => 
        exercise.category.toLowerCase().includes(selectedStyleFilter.toLowerCase())
      );
    }

    return filtered;
  }, [searchText, selectedTimeFilter, selectedBenefitFilter, selectedStyleFilter]);

  // Tag colors similar to home screen
  const getTagColor = (category: string) => {
    const tagColors = {
      'CBT': { bg: 'rgba(161, 214, 242, 0.8)', text: '#002244' },
      'Breathing': { bg: 'rgba(184, 224, 245, 0.8)', text: '#002244' },
      'Meditation': { bg: 'rgba(227, 244, 253, 0.8)', text: '#002244' },
      'Mindfulness': { bg: 'rgba(186, 230, 253, 0.8)', text: '#002244' },
      'Journaling': { bg: 'rgba(203, 213, 225, 0.8)', text: '#002244' },
      'ACT': { bg: 'rgba(147, 197, 253, 0.8)', text: '#002244' },
      'Self-Care': { bg: 'rgba(96, 165, 250, 0.8)', text: '#FFFFFF' },
    };
    return tagColors[category] || { bg: 'rgba(161, 214, 242, 0.8)', text: '#002244' };
  };

  const FilterChip = ({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) => (
    <TouchableOpacity
      style={[styles.filterChip, selected && styles.filterChipSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.filterChipText, selected && styles.filterChipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const ExerciseCard = ({ exercise }: { exercise: any }) => {
    const tagColor = getTagColor(exercise.category);
    
    return (
      <TouchableOpacity
        style={styles.exerciseCard}
        onPress={() => onExerciseClick(exercise)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['rgba(161, 214, 242, 0.5)', 'rgba(184, 224, 245, 0.4)']}
          style={styles.exerciseCardGradient}
        >
          {/* Left side image */}
          <View style={styles.exerciseImageContainer}>
            <Image 
              source={exercise.image || require('../../assets/images/new-icon1.png')}
              style={styles.exerciseImage}
              contentFit="cover"
            />
          </View>
          
          {/* Right side content */}
          <View style={styles.exerciseContent}>
            {/* Category tag */}
            <View style={[styles.categoryTag, { backgroundColor: tagColor.bg }]}>
              <Text style={[styles.categoryTagText, { color: tagColor.text }]}>
                {exercise.category}
              </Text>
            </View>
            
            <Text style={styles.exerciseTitle} numberOfLines={2}>
              {exercise.name}
            </Text>
            
            <View style={styles.exerciseMeta}>
              <View style={styles.durationContainer}>
                <Clock size={12} color="#002244" />
                <Text style={styles.exerciseDuration}>{exercise.duration}</Text>
              </View>
            </View>
            
            <Text style={styles.exerciseDescription} numberOfLines={2}>
              {exercise.description}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaWrapper style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Exercise Library</Text>
        <View style={styles.headerButtons}>
          {/* Dev Test Button */}
          <TouchableOpacity
            style={styles.devButton}
            onPress={() => setShowDevSlider(!showDevSlider)}
            activeOpacity={0.7}
          >
            <Bug size={16} color={colors.primary[400]} />
            <Text style={styles.devButtonText}>Test Slider</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
            activeOpacity={0.7}
          >
            <Filter size={20} color={colors.primary[400]} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={20} color={colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor={colors.text.secondary}
          />
          {searchText ? (
            <TouchableOpacity onPress={() => setSearchText('')} activeOpacity={0.7}>
              <X size={18} color={colors.text.secondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Dev Slider Test */}
      {showDevSlider && (
        <View style={styles.devSliderSection}>
          <View style={styles.devSliderContainer}>
            <MoodSlider
              title="Dev Test: Mood Slider"
              subtitle="Testing the slider component"
              onRatingChange={(rating) => console.log('Rating changed:', rating)}
              onComplete={(rating) => {
                console.log('Rating completed:', rating);
                // Auto-hide after completion for better UX
                setTimeout(() => setShowDevSlider(false), 2000);
              }}
              type="mood"
              initialValue={2.5}
            />
          </View>
        </View>
      )}

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersSection}>
          {/* Time Filter */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterGroupTitle}>Duration</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScrollView}>
              <View style={styles.filterRow}>
                {timeFilters.map((filter) => (
                  <FilterChip
                    key={filter}
                    label={filter}
                    selected={selectedTimeFilter === filter}
                    onPress={() => setSelectedTimeFilter(filter)}
                  />
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Benefit Filter */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterGroupTitle}>Benefits</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScrollView}>
              <View style={styles.filterRow}>
                {benefitFilters.map((filter) => (
                  <FilterChip
                    key={filter}
                    label={filter}
                    selected={selectedBenefitFilter === filter}
                    onPress={() => setSelectedBenefitFilter(filter)}
                  />
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Style Filter */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterGroupTitle}>Approach</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScrollView}>
              <View style={styles.filterRow}>
                {styleFilters.map((filter) => (
                  <FilterChip
                    key={filter}
                    label={filter}
                    selected={selectedStyleFilter === filter}
                    onPress={() => setSelectedStyleFilter(filter)}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      )}

      {/* Results */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''} found
          </Text>
        </View>

        <View style={styles.exercisesGrid}>
          {filteredExercises.reduce((rows, exercise, index) => {
            if (index % 2 === 0) {
              rows.push([exercise]);
            } else {
              rows[rows.length - 1].push(exercise);
            }
            return rows;
          }, [] as any[][]).map((row, rowIndex) => (
            <View key={rowIndex} style={styles.exerciseRow}>
              {row.map((exercise, index) => (
                <View key={exercise.id || index} style={styles.exerciseCardWrapper}>
                  <ExerciseCard exercise={exercise} />
                </View>
              ))}
              {row.length === 1 && <View style={styles.exerciseCardWrapper} />}
            </View>
          ))}
        </View>

        {filteredExercises.length === 0 && (
          <View style={styles.emptyState}>
            <Sparkles size={48} color={colors.text.tertiary} />
            <Text style={styles.emptyStateTitle}>No exercises found</Text>
            <Text style={styles.emptyStateDescription}>
              Try adjusting your filters or search terms
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  devButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFE4B5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DEB887',
  },
  devButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary[400],
  },
  filterButton: {
    padding: 8,
    backgroundColor: colors.background.card,
    borderRadius: 12,
  },

  // Search
  searchSection: {
    paddingHorizontal: 20,
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
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '400',
  },

  // Dev Slider
  devSliderSection: {
    backgroundColor: '#FFF9E6',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#FFE4B5',
    shadowColor: shadows.sm.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  devSliderContainer: {
    alignItems: 'center',
  },

  // Filters
  filtersSection: {
    backgroundColor: colors.background.secondary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 16,
  },
  filterGroup: {
    gap: 8,
  },
  filterGroupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  filterScrollView: {
    flexGrow: 0,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#C9E8F8',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#9ED0DD',
  },
  filterChipSelected: {
    backgroundColor: '#4999BB',
    borderColor: '#4999BB',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#002244',
  },
  filterChipTextSelected: {
    color: '#FFFFFF',
  },

  // Results
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  resultsHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  resultsCount: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },

  // Exercise Cards
  exercisesGrid: {
    paddingHorizontal: 20,
    gap: 12,
  },
  exerciseRow: {
    flexDirection: 'row',
    gap: 12,
  },
  exerciseCardWrapper: {
    flex: 1,
  },
  exerciseCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: shadows.sm.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 160,
  },
  exerciseCardGradient: {
    flexDirection: 'row',
    padding: 12,
    height: '100%',
  },
  exerciseImageContainer: {
    width: 60,
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
  },
  exerciseContent: {
    flex: 1,
    gap: 8,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryTagText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#002244',
    lineHeight: 20,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  exerciseDuration: {
    fontSize: 12,
    color: '#002244',
    fontWeight: '500',
  },
  exerciseDescription: {
    fontSize: 12,
    color: '#003366',
    lineHeight: 16,
    opacity: 0.8,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default ExerciseLibrary;