import React, { useState, useMemo, useEffect } from 'react';
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
import { getExerciseEmojis } from '../utils/emojiUtils';
import { useUserProfile } from '../hooks/useUserProfile';
import SlidableExerciseCard from '../components/SlidableExerciseCard';
import { CardHidingService } from '../services/cardHidingService';
import ExerciseSummaryCard from '../components/ExerciseSummaryCard';
import { useExercisePreview } from '../hooks/useExercisePreview';

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
  const [hiddenCardIds, setHiddenCardIds] = useState<string[]>([]);

  // Apply dynamic navigation bar styling
  const { statusBarStyle } = useNavigationBarStyle(navigationBarConfigs.exerciseLibrary);

  // Exercise preview functionality
  const { showPreview, previewExercise, showExercisePreview, hideExercisePreview, confirmExerciseStart } = useExercisePreview();

  // Enhanced exercise click handler that shows preview first
  const handleExerciseClickWithPreview = (exercise: any) => {
    if (exercise) {
      showExercisePreview(exercise, () => {
        onExerciseClick(exercise);
      });
    } else {
      onExerciseClick(exercise);
    }
  };
  
  // Load hidden card IDs on mount
  useEffect(() => {
    const loadHiddenCards = async () => {
      const hiddenIds = await CardHidingService.getHiddenCardIds();
      setHiddenCardIds(hiddenIds);
    };
    loadHiddenCards();
  }, []);
  
  // Get user profile for emoji preferences
  const { profile } = useUserProfile();
  const emojis = getExerciseEmojis(profile?.emojiPreference || 'neutral');
  
  // Use unified exercises from exerciseLibrary.ts
  const exercises = exercisesArray;

  // Filter options
  const timeFilters = ['All', '1-5 min', '5-15 min', '15-30 min', '30+ min'];
  const benefitFilters = ['All', 'Anxiety', 'Mood', 'Self-Discovery', 'Mental Clarity', 'Stress Relief', 'Focus', 'Emotional Balance'];
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

  // Extract benefit from exercise description or category
  const getBenefitFromExercise = (exercise: any) => {
    const description = exercise.description.toLowerCase();
    const name = exercise.name.toLowerCase();
    
    if (description.includes('anxiety') || description.includes('anxious')) return 'Anxiety';
    if (description.includes('depression') || description.includes('mood') || description.includes('happiness')) return 'Mood';
    if (description.includes('discover') || description.includes('explore') || description.includes('journey') || description.includes('story') || name.includes('story')) return 'Self-Discovery';
    if (description.includes('clarity') || description.includes('clear') || description.includes('organize') || description.includes('clutter')) return 'Mental Clarity';
    if (description.includes('stress') || description.includes('tension') || description.includes('calm') || description.includes('relax')) return 'Stress Relief';
    if (description.includes('focus') || description.includes('concentration') || description.includes('attention')) return 'Focus';
    if (description.includes('balance') || description.includes('compassion') || description.includes('kindness') || description.includes('emotional')) return 'Emotional Balance';
    
    // Category-based mapping
    if (exercise.category.toLowerCase() === 'breathing') return 'Stress Relief';
    if (exercise.category.toLowerCase() === 'cbt') return 'Mental Clarity';
    if (exercise.category.toLowerCase() === 'mindfulness') return 'Focus';
    if (exercise.category.toLowerCase() === 'self-care') return 'Emotional Balance';
    if (exercise.category.toLowerCase() === 'act') return 'Self-Discovery';
    if (exercise.category.toLowerCase() === 'self-discovery') return 'Self-Discovery';
    if (exercise.category.toLowerCase() === 'self-growth') return 'Self-Discovery';
    
    // Default fallback
    return 'Focus';
  };

  // Handle card hiding
  const handleHideCard = async (exerciseId: string, hideType: 'permanent' | 'temporary') => {
    await CardHidingService.hideCard(exerciseId, hideType);
    const updatedHiddenIds = await CardHidingService.getHiddenCardIds();
    setHiddenCardIds(updatedHiddenIds);
  };

  // Filter exercises based on all criteria
  const filteredExercises = useMemo(() => {
    let filtered = exercises;

    // Filter out hidden cards first
    filtered = filtered.filter(exercise => !hiddenCardIds.includes(exercise.id));

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
  }, [searchText, selectedTimeFilter, selectedBenefitFilter, selectedStyleFilter, hiddenCardIds]);


  const FilterChip = ({ label, selected, onPress, filterType }: {
    label: string;
    selected: boolean;
    onPress: () => void;
    filterType: 'duration' | 'benefits' | 'approach';
  }) => {
    // Get background color based on filter type
    const getBackgroundColor = () => {
      switch (filterType) {
        case 'duration': return '#DBEDF4'; // Same as tag background
        case 'benefits': return '#C6E2F0'; // Slightly darker blue
        case 'approach': return '#B1D6EB'; // Even darker blue
        default: return '#DBEDF4';
      }
    };

    return (
      <TouchableOpacity
        style={[
          exerciseLibraryStyles.filterChipSolid,
          {
            backgroundColor: selected ? '#2B475E' : getBackgroundColor(),
          }
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={[
          exerciseLibraryStyles.filterChipText,
          { color: selected ? '#FFFFFF' : '#2B475E' }
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const ExerciseCard = ({ exercise, index }: { exercise: any; index: number }) => {
    const benefit = getBenefitFromExercise(exercise);
    
    // Choose button image based on benefit name length
    const getButtonImage = (benefitName: string, cardIndex: number) => {
      if (benefitName.length > 8) {
        // Use larger buttons for longer names
        return cardIndex % 2 === 0 
          ? require('../../assets/images/Buttons/3.png')
          : require('../../assets/images/Buttons/4.png');
      } else {
        // Use smaller buttons for shorter names
        return cardIndex % 2 === 0 
          ? require('../../assets/images/Buttons/1.png')
          : require('../../assets/images/Buttons/2.png');
      }
    };
    
    const buttonImage = getButtonImage(benefit, index);
    const isLargeButton = benefit.length > 8;
    
    return (
      <SlidableExerciseCard
        exercise={exercise}
        index={index}
        benefit={benefit}
        isLargeButton={isLargeButton}
        buttonImage={buttonImage}
        onExerciseClick={handleExerciseClickWithPreview}
        onHideCard={handleHideCard}
      />
    );
  };

  return (
    <SafeAreaWrapper style={exerciseLibraryStyles.container}>
      <StatusBar style={statusBarStyle} backgroundColor="transparent" translucent />
      
      {/* Persistent Solid Background - Same as HomeScreen */}
      <View
        style={[exerciseLibraryStyles.backgroundGradient, { backgroundColor: '#ebf5f9' }]}
        pointerEvents="none"
      />

      {/* Main Scrollable Content */}
      <ScrollView
        style={exerciseLibraryStyles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={exerciseLibraryStyles.scrollContent}
      >
        {/* Header */}
        <View style={exerciseLibraryStyles.header}>
          <View style={exerciseLibraryStyles.headerContent}>
            <View style={exerciseLibraryStyles.headerTitleContainer}>
              <Image
                source={require('../../assets/new-design/Turtle Hero Section/turtle-hero-5.png')}
                style={exerciseLibraryStyles.headerTurtleIcon}
                contentFit="contain"
              />
              <View style={exerciseLibraryStyles.titleAndSubtitleContainer}>
                <Text style={exerciseLibraryStyles.headerTitle}>Exercises</Text>
                <Text style={exerciseLibraryStyles.headerSubtitle}>{emojis.subtitle} For your well-being</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={exerciseLibraryStyles.searchSection}>
          <View style={exerciseLibraryStyles.searchRow}>
            <View style={exerciseLibraryStyles.searchBar}>
              <Search size={20} color={colors.text.secondary} />
              <TextInput
                style={[exerciseLibraryStyles.searchInput, { color: '#000000' }]}
                placeholder="Search exercises..."
                value={searchText}
                onChangeText={setSearchText}
                placeholderTextColor="#6B7280"
                selectionColor="#000000"
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
            
          </View>
        </View>

        {/* Show All Filters Button - Below search bar */}
        <View style={{
          paddingHorizontal: spacing.layout.screenPadding,
          marginBottom: spacing[8],
        }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 12,
              paddingVertical: 8,
              gap: 6,
              alignSelf: 'flex-start',
            }}
            onPress={() => setShowFilters(!showFilters)}
            activeOpacity={0.7}
          >
            <Image
              source={require('../../assets/new-design/Homescreen/Icons/filter.png')}
              style={{ width: 16, height: 16 }}
              contentFit="contain"
            />
            <Text style={{
              fontSize: 14,
              fontWeight: '500',
              color: '#6B7280',
            }}>
              Show all filters
            </Text>
            {activeFiltersCount > 0 && (
              <View style={[exerciseLibraryStyles.filterBadge, { position: 'relative', top: 0, right: 0 }]}>
                <Text style={exerciseLibraryStyles.filterBadgeText}>{activeFiltersCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Benefits Filter - Always visible, aligned under search bar */}
        <View style={{
          paddingHorizontal: spacing.layout.screenPadding, // Aligned with search bar
          marginBottom: spacing[8],
        }}>
          <View style={exerciseLibraryStyles.filterRowCompact}>
            {benefitFilters.map((filter) => (
              <FilterChip
                key={filter}
                label={filter}
                selected={selectedBenefitFilter === filter}
                onPress={() => setSelectedBenefitFilter(filter)}
                filterType="benefits"
              />
            ))}
          </View>
        </View>

        {/* Additional Filters - No background, same spacing as Benefits */}
        {showFilters && (
          <View style={{
            paddingHorizontal: spacing.layout.screenPadding, // Same as Benefits filter
            marginBottom: spacing[8],
          }}>
            {/* Filters Header */}
            {activeFiltersCount > 0 && (
              <View style={{
                marginBottom: spacing[8],
                alignItems: 'flex-start',
              }}>
                <TouchableOpacity
                  style={exerciseLibraryStyles.clearFiltersButton}
                  onPress={clearAllFilters}
                  activeOpacity={0.7}
                >
                  <Text style={exerciseLibraryStyles.clearFiltersText}>Clear All</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Duration Filter - Compact */}
            <View style={exerciseLibraryStyles.filterGroupCompact}>
              <Text style={exerciseLibraryStyles.filterGroupTitleCompact}>{emojis.duration} Duration</Text>
              <View style={exerciseLibraryStyles.filterRowCompact}>
                {timeFilters.map((filter) => (
                  <FilterChip
                    key={filter}
                    label={filter}
                    selected={selectedTimeFilter === filter}
                    onPress={() => setSelectedTimeFilter(filter)}
                    filterType="duration"
                  />
                ))}
              </View>
            </View>

            {/* Style Filter - Compact */}
            <View style={exerciseLibraryStyles.filterGroupCompact}>
              <Text style={exerciseLibraryStyles.filterGroupTitleCompact}>{emojis.approach} Approach</Text>
              <View style={exerciseLibraryStyles.filterRowCompact}>
                {styleFilters.map((filter) => (
                  <FilterChip
                    key={filter}
                    label={filter}
                    selected={selectedStyleFilter === filter}
                    onPress={() => setSelectedStyleFilter(filter)}
                    filterType="approach"
                  />
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Results Header */}
        <View style={exerciseLibraryStyles.resultsHeader}>
          <Text style={exerciseLibraryStyles.resultsCount}>
            {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''} found
          </Text>
        </View>

        {/* Exercise Cards */}
        <View style={exerciseLibraryStyles.exercisesGrid}>
          {filteredExercises.map((exercise, index) => (
            <View key={`exercise-${exercise.id}-${exercise.type}-${index}`} style={exerciseLibraryStyles.exerciseCardWrapper}>
              <ExerciseCard exercise={exercise} index={index} />
            </View>
          ))}
        </View>

        {/* Empty State */}
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

      {/* Exercise Preview Card */}
      {previewExercise && (
        <ExerciseSummaryCard
          visible={showPreview}
          exercise={previewExercise}
          onStart={confirmExerciseStart}
          onClose={hideExercisePreview}
        />
      )}
    </SafeAreaWrapper>
  );
};


export default ExerciseLibrary;