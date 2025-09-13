import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Dimensions } from 'react-native';
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';
import { Search, Filter, Clock, Heart, Brain, Wind, Eye, Sparkles, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { exercisesArray } from '../data/exerciseLibrary';
import { colors, gradients, shadows, spacing } from '../styles/tokens';
import { exerciseLibraryStyles, getTagColor, getExerciseCardGradient } from '../styles/components/ExerciseLibrary.styles';
import { useNavigationBarStyle, navigationBarConfigs } from '../hooks/useNavigationBarStyle';

const { width, height } = Dimensions.get('window');

interface ExerciseLibraryProps {
  onExerciseClick: (exercise: any) => void;
}

const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({ onExerciseClick }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('All');
  const [selectedBenefitFilter, setSelectedBenefitFilter] = useState('All');
  const [selectedStyleFilter, setSelectedStyleFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // Apply dynamic navigation bar styling
  const { statusBarStyle } = useNavigationBarStyle(navigationBarConfigs.exerciseLibrary);
  
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

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedTimeFilter !== 'All') count++;
    if (selectedBenefitFilter !== 'All') count++;
    if (selectedStyleFilter !== 'All') count++;
    return count;
  }, [selectedTimeFilter, selectedBenefitFilter, selectedStyleFilter]);

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedTimeFilter('All');
    setSelectedBenefitFilter('All');
    setSelectedStyleFilter('All');
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


  const FilterChip = ({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) => (
    <TouchableOpacity
      style={[exerciseLibraryStyles.filterChip, selected && exerciseLibraryStyles.filterChipSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[exerciseLibraryStyles.filterChipText, selected && exerciseLibraryStyles.filterChipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const ExerciseCard = ({ exercise }: { exercise: any }) => {
    const tagColor = getTagColor(exercise.category);
    
    return (
      <TouchableOpacity
        style={exerciseLibraryStyles.exerciseCard}
        onPress={() => onExerciseClick(exercise)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={getExerciseCardGradient()}
          style={exerciseLibraryStyles.exerciseCardGradient}
        >
          {/* Left side image */}
          <View style={exerciseLibraryStyles.exerciseImageContainer}>
            <Image 
              source={exercise.image || require('../../assets/images/new-icon1.png')}
              style={exerciseLibraryStyles.exerciseImage}
              contentFit="cover"
            />
          </View>
          
          {/* Right side content */}
          <View style={exerciseLibraryStyles.exerciseContent}>
            {/* Category tag */}
            <View style={[exerciseLibraryStyles.categoryTag, { backgroundColor: tagColor.bg }]}>
              <Text style={[exerciseLibraryStyles.categoryTagText, { color: tagColor.text }]}>
                {exercise.category}
              </Text>
            </View>
            
            <Text style={exerciseLibraryStyles.exerciseTitle} numberOfLines={2}>
              {exercise.name}
            </Text>
            
            <View style={exerciseLibraryStyles.exerciseMeta}>
              <View style={exerciseLibraryStyles.durationContainer}>
                <Clock size={12} color="#002244" />
                <Text style={exerciseLibraryStyles.exerciseDuration}>{exercise.duration}</Text>
              </View>
            </View>
            
            <Text style={exerciseLibraryStyles.exerciseDescription} numberOfLines={1}>
              {exercise.description.length > 50 ? `${exercise.description.substring(0, 50)}...` : exercise.description}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaWrapper style={exerciseLibraryStyles.container}>
      <StatusBar style={statusBarStyle} backgroundColor="transparent" translucent />
      
      {/* Background Gradient - Consistent with HomeScreen */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.8)', '#F8FAFC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={exerciseLibraryStyles.backgroundGradient}
      />

      {/* Header */}
      <View style={exerciseLibraryStyles.header}>
        <Text style={exerciseLibraryStyles.headerTitle}>Exercise Library</Text>
      </View>

      {/* Search Bar */}
      <View style={exerciseLibraryStyles.searchSection}>
        <View style={exerciseLibraryStyles.searchRow}>
          <View style={exerciseLibraryStyles.searchBar}>
            <Search size={20} color={colors.text.secondary} />
            <TextInput
              style={exerciseLibraryStyles.searchInput}
              placeholder="Search exercises..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor={colors.text.secondary}
            />
            {searchText ? (
              <TouchableOpacity 
                onPress={() => setSearchText('')} 
                activeOpacity={0.7}
                style={{
                  padding: spacing[8], // Add padding for better touch target
                  borderRadius: 16,
                  minWidth: 44, // Ensure minimum touch target
                  minHeight: 44,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={18} color={colors.text.secondary} />
              </TouchableOpacity>
            ) : null}
          </View>
          
          {/* Filter Button */}
          <TouchableOpacity
            style={[exerciseLibraryStyles.filterButton, activeFiltersCount > 0 && exerciseLibraryStyles.filterButtonActive]}
            onPress={() => setShowFilters(!showFilters)}
            activeOpacity={0.7}
          >
            <Filter size={20} color={colors.primary[400]} />
            {activeFiltersCount > 0 && (
              <View style={exerciseLibraryStyles.filterBadge}>
                <Text style={exerciseLibraryStyles.filterBadgeText}>{activeFiltersCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>


      {/* Filters */}
      {showFilters && (
        <View style={exerciseLibraryStyles.filtersSection}>
          {/* Filters Header */}
          <View style={exerciseLibraryStyles.filtersHeader}>
            <Text style={exerciseLibraryStyles.filtersTitle}>Filters</Text>
            {activeFiltersCount > 0 && (
              <TouchableOpacity
                style={exerciseLibraryStyles.clearFiltersButton}
                onPress={clearAllFilters}
                activeOpacity={0.7}
              >
                <Text style={exerciseLibraryStyles.clearFiltersText}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>
          {/* Time Filter */}
          <View style={exerciseLibraryStyles.filterGroup}>
            <Text style={exerciseLibraryStyles.filterGroupTitle}>Duration</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={exerciseLibraryStyles.filterScrollView}>
              <View style={exerciseLibraryStyles.filterRow}>
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
          <View style={exerciseLibraryStyles.filterGroup}>
            <Text style={exerciseLibraryStyles.filterGroupTitle}>Benefits</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={exerciseLibraryStyles.filterScrollView}>
              <View style={exerciseLibraryStyles.filterRow}>
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
          <View style={exerciseLibraryStyles.filterGroup}>
            <Text style={exerciseLibraryStyles.filterGroupTitle}>Approach</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={exerciseLibraryStyles.filterScrollView}>
              <View style={exerciseLibraryStyles.filterRow}>
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
        style={exerciseLibraryStyles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={exerciseLibraryStyles.scrollContent}
      >
        <View style={exerciseLibraryStyles.resultsHeader}>
          <Text style={exerciseLibraryStyles.resultsCount}>
            {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''} found
          </Text>
        </View>

        <View style={exerciseLibraryStyles.exercisesGrid}>
          {filteredExercises.map((exercise, index) => (
            <View key={`exercise-${exercise.id}-${exercise.type}-${index}`} style={exerciseLibraryStyles.exerciseCardWrapper}>
              <ExerciseCard exercise={exercise} />
            </View>
          ))}
        </View>

        {filteredExercises.length === 0 && (
          <View style={exerciseLibraryStyles.emptyState}>
            <Sparkles size={48} color={colors.text.tertiary} />
            <Text style={exerciseLibraryStyles.emptyStateTitle}>No exercises found</Text>
            <Text style={exerciseLibraryStyles.emptyStateDescription}>
              Try adjusting your filters or search terms
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaWrapper>
  );
};


export default ExerciseLibrary;