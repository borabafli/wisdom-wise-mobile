import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';
import { Search, Sparkles, X } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { getExercisesArray } from '../data/exerciseLibrary';
import { colors, spacing } from '../styles/tokens';
import { exerciseLibraryStyles } from '../styles/components/ExerciseLibrary.styles';
import { useNavigationBarStyle, navigationBarConfigs } from '../hooks/useNavigationBarStyle';
import { getExerciseEmojis } from '../utils/emojiUtils';
import { useUserProfile } from '../hooks/useUserProfile';
import SlidableExerciseCard from '../components/SlidableExerciseCard';
import { CardHidingService } from '../services/cardHidingService';
import ExerciseSummaryCard from '../components/ExerciseSummaryCard';
import { useExercisePreview } from '../hooks/useExercisePreview';

const { width, height } = Dimensions.get('window');
const ALL_FILTER_KEY = 'all';

interface ExerciseLibraryProps {
  onExerciseClick: (exercise: any) => void;
}

const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({ onExerciseClick }) => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<string>(ALL_FILTER_KEY);
  const [selectedBenefitFilter, setSelectedBenefitFilter] = useState<string>(ALL_FILTER_KEY);
  const [selectedStyleFilter, setSelectedStyleFilter] = useState<string>(ALL_FILTER_KEY);
  const [showFilters, setShowFilters] = useState(false);
  const [hiddenCardIds, setHiddenCardIds] = useState<string[]>([]);

  // Apply dynamic navigation bar styling
  const { statusBarStyle } = useNavigationBarStyle(navigationBarConfigs.exerciseLibrary);

  // Exercise preview functionality
  const { showPreview, previewExercise, showExercisePreview, hideExercisePreview, confirmExerciseStart } = useExercisePreview(t);

  // Enhanced exercise click handler that shows preview first
  const handleExerciseClickWithPreview = (exercise: any) => {
    if (exercise) {
      // Check if it's a breathing exercise - route directly without preview
      if (exercise.type === 'breathing') {
        onExerciseClick(exercise);
      } else {
        showExercisePreview(exercise, () => {
          onExerciseClick(exercise);
        });
      }
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
  const exercises = getExercisesArray(t);

  const categoryTranslations = useMemo(() => ({
    cbt: t('exerciseLibrary.categories.cbt'),
    breathing: t('exerciseLibrary.categories.breathing'),
    mindfulness: t('exerciseLibrary.categories.mindfulness'),
    selfCare: t('exerciseLibrary.categories.selfCare'),
    act: t('exerciseLibrary.categories.act'),
    selfDiscovery: t('exerciseLibrary.categories.selfDiscovery'),
    selfGrowth: t('exerciseLibrary.categories.selfGrowth'),
  }), [t]);

  const categoryLabelToKey = useMemo(() => {
    const map: Record<string, string> = {};
    Object.entries(categoryTranslations).forEach(([key, label]) => {
      map[label] = key;
    });
    return map;
  }, [categoryTranslations]);

  const getCategoryKey = useCallback((categoryLabel: string) => {
    if (!categoryLabel) {
      return '';
    }
    return categoryLabelToKey[categoryLabel] ?? categoryLabel;
  }, [categoryLabelToKey]);

  const getBenefitKeyFromExercise = useCallback((exercise: any) => {
    const name = typeof exercise.name === 'string' ? exercise.name.toLowerCase() : '';
    const description = typeof exercise.description === 'string' ? exercise.description.toLowerCase() : '';
    const keywords = Array.isArray(exercise.keywords)
      ? exercise.keywords
          .map((keyword: string) => (typeof keyword === 'string' ? keyword.toLowerCase() : ''))
          .filter(Boolean)
      : [];

    const matches = (...terms: string[]) =>
      terms.some((term) =>
        !!term && (
          name.includes(term) ||
          description.includes(term) ||
          keywords.some((keyword) => keyword.includes(term))
        )
      );

    if (matches('anxiety', 'anxious', 'panic')) return 'anxiety';
    if (matches('depression', 'mood', 'happiness')) return 'depressionMood';
    if (matches('discover', 'explore', 'journey', 'story', 'value', 'identity', 'future', 'vision')) return 'selfDiscovery';
    if (matches('clarity', 'organize', 'clear', 'clutter', 'structure', 'thought')) return 'mentalClarity';
    if (matches('stress', 'tension', 'calm', 'relax', 'relief', 'breath')) return 'stressRelief';
    if (matches('focus', 'concentration', 'attention', 'mindful')) return 'focus';
    if (matches('balance', 'compassion', 'kindness', 'emotional', 'care')) return 'emotionalBalance';

    const categoryKey = getCategoryKey(exercise.category);
    if (categoryKey === 'breathing') return 'stressRelief';
    if (categoryKey === 'cbt') return 'mentalClarity';
    if (categoryKey === 'mindfulness') return 'focus';
    if (categoryKey === 'selfCare') return 'emotionalBalance';
    if (categoryKey === 'act' || categoryKey === 'selfDiscovery' || categoryKey === 'selfGrowth') return 'selfDiscovery';

    return 'focus';
  }, [getCategoryKey]);

  const getBenefitLabel = useCallback(
    (benefitKey: string) => {
      const label = t(`exercises.filters.benefits.${benefitKey}`);
      return label.includes('exercises.filters') ? benefitKey : label;
    },
    [t]
  );

  // Helper function to get duration in minutes
  const getDurationInMinutes = (duration: string) => {
    const match = /(\d+)/.exec(duration);
    return match ? Number.parseInt(match[1], 10) : 0;
  };

  // Filter options - time filters use translations
  const timeFilters = useMemo(() => ([
    { key: ALL_FILTER_KEY, label: t('exercises.filters.all') },
    { key: '1-5', label: t('exercises.filters.durations.1-5') },
    { key: '5-15', label: t('exercises.filters.durations.5-15') },
    { key: '15-30', label: t('exercises.filters.durations.15-30') },
    { key: '30+', label: t('exercises.filters.durations.30+') },
  ]), [t]);
  
  // Dynamically generate style filters from available exercises
  const styleFilters = useMemo(() => {
    const categories = new Set<string>();
    for (const exercise of exercises) {
      if (exercise.category) {
        const categoryKey = getCategoryKey(exercise.category);
        categories.add(categoryKey);
      }
    }

    const sortedCategoryKeys = Array.from(categories).sort((a, b) => {
      const labelA = categoryTranslations[a] ?? a;
      const labelB = categoryTranslations[b] ?? b;
      return labelA.localeCompare(labelB);
    });

    return [
      { key: ALL_FILTER_KEY, label: t('exercises.filters.all') },
      ...sortedCategoryKeys.map((key) => ({
        key,
        label: categoryTranslations[key] ?? key,
      })),
    ];
  }, [exercises, t, categoryTranslations, getCategoryKey]);

  // Dynamically generate benefit filters from available exercises
  const benefitFilters = useMemo(() => {
    const benefitKeys = new Set<string>();
    for (const exercise of exercises) {
      const benefitKey = getBenefitKeyFromExercise(exercise);
      if (benefitKey) {
        benefitKeys.add(benefitKey);
      }
    }

    const sortedBenefitKeys = Array.from(benefitKeys).sort((a, b) => {
      const labelA = getBenefitLabel(a);
      const labelB = getBenefitLabel(b);
      return labelA.localeCompare(labelB);
    });

    const filters: Array<{ key: string; label: string; group: 'primary' | 'breathing' }> = [
      { key: ALL_FILTER_KEY, label: t('exercises.filters.all'), group: 'primary' },
      ...sortedBenefitKeys.map((key) => ({
        key,
        label: getBenefitLabel(key),
        group: 'primary',
      })),
    ];

    const hasBreathing = exercises.some((exercise) => getCategoryKey(exercise.category) === 'breathing');
    if (hasBreathing) {
      filters.push(
        {
          key: 'breathing',
          label: getBenefitLabel('breathing'),
          group: 'breathing',
        },
        {
          key: 'withoutBreathing',
          label: getBenefitLabel('withoutBreathing'),
          group: 'breathing',
        }
      );
    }

    return filters;
  }, [exercises, t, getBenefitKeyFromExercise, getCategoryKey, getBenefitLabel]);

  const primaryBenefitFilters = useMemo(
    () => benefitFilters.filter((filter) => filter.group === 'primary'),
    [benefitFilters]
  );

  const breathingBenefitFilters = useMemo(
    () => benefitFilters.filter((filter) => filter.group === 'breathing'),
    [benefitFilters]
  );

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedTimeFilter !== ALL_FILTER_KEY) count++;
    if (selectedBenefitFilter !== ALL_FILTER_KEY) count++;
    if (selectedStyleFilter !== ALL_FILTER_KEY) count++;
    return count;
  }, [selectedTimeFilter, selectedBenefitFilter, selectedStyleFilter]);

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedTimeFilter(ALL_FILTER_KEY);
    setSelectedBenefitFilter(ALL_FILTER_KEY);
    setSelectedStyleFilter(ALL_FILTER_KEY);
  };

  // Handle card hiding
  const handleHideCard = async (exerciseId: string, hideType: 'permanent' | 'temporary') => {
    await CardHidingService.hideCard(exerciseId, hideType);
    const updatedHiddenIds = await CardHidingService.getHiddenCardIds();
    setHiddenCardIds(updatedHiddenIds);
  };

  // Filter exercises based on all criteria
  const filteredExercises = useMemo(() => {
    let filtered = exercises.filter((exercise) => !hiddenCardIds.includes(exercise.id));

    if (searchText) {
      const loweredSearch = searchText.toLowerCase();
      filtered = filtered.filter((exercise) => {
        const name = typeof exercise.name === 'string' ? exercise.name.toLowerCase() : '';
        const description = typeof exercise.description === 'string' ? exercise.description.toLowerCase() : '';
        const category = typeof exercise.category === 'string' ? exercise.category.toLowerCase() : '';
        return (
          name.includes(loweredSearch) ||
          description.includes(loweredSearch) ||
          category.includes(loweredSearch)
        );
      });
    }

    if (selectedTimeFilter !== ALL_FILTER_KEY) {
      filtered = filtered.filter((exercise) => {
        const duration = getDurationInMinutes(exercise.duration);
        if (selectedTimeFilter === '1-5') return duration >= 1 && duration <= 5;
        if (selectedTimeFilter === '5-15') return duration > 5 && duration <= 15;
        if (selectedTimeFilter === '15-30') return duration > 15 && duration <= 30;
        if (selectedTimeFilter === '30+') return duration > 30;
        return true;
      });
    }

    if (selectedBenefitFilter !== ALL_FILTER_KEY) {
      filtered = filtered.filter((exercise) => {
        const categoryKey = getCategoryKey(exercise.category);
        if (selectedBenefitFilter === 'breathing') {
          return categoryKey === 'breathing';
        }
        if (selectedBenefitFilter === 'withoutBreathing') {
          return categoryKey !== 'breathing';
        }

        const benefitKey = getBenefitKeyFromExercise(exercise);
        return selectedBenefitFilter === benefitKey;
      });
    }

    if (selectedStyleFilter !== ALL_FILTER_KEY) {
      filtered = filtered.filter((exercise) => {
        const categoryKey = getCategoryKey(exercise.category);
        return categoryKey === selectedStyleFilter;
      });
    }

    return filtered;
  }, [
    exercises,
    hiddenCardIds,
    searchText,
    selectedTimeFilter,
    selectedBenefitFilter,
    selectedStyleFilter,
    getCategoryKey,
    getBenefitKeyFromExercise,
  ]);


  const FilterChip = ({ label, selected, onPress, filterType }: {
    label: string;
    selected: boolean;
    onPress: () => void;
    filterType: 'duration' | 'benefits' | 'approach';
  }) => {
    // Get background color based on filter type
    const getBackgroundColor = () => {
      // Check for translated breathing filters
      if (label === t('exercises.filters.benefits.breathing') || label === t('exercises.filters.benefits.withoutBreathing')) {
        return '#A9CDC3'; // A lighter, more subtle shade for these specific filters
      }
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
    const benefitKey = getBenefitKeyFromExercise(exercise);
    const resolvedBenefit = getBenefitLabel(benefitKey);
    
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
    
    const buttonImage = getButtonImage(resolvedBenefit, index);
    const isLargeButton = resolvedBenefit.length > 8;
    
    return (
      <SlidableExerciseCard
        exercise={exercise}
        index={index}
        benefit={resolvedBenefit}
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
        style={[exerciseLibraryStyles.backgroundGradient, { backgroundColor: '#e9eff1' }]}
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
                <Text style={exerciseLibraryStyles.headerTitle}>{t('exercises.title')}</Text>
                <Text style={exerciseLibraryStyles.headerSubtitle}>{emojis.subtitle} {t('exercises.subtitle')}</Text>
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
                placeholder={t('exercises.searchPlaceholder')}
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
              {t('exercises.showAllFilters')}
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
            {primaryBenefitFilters.map((filter) => (
              <FilterChip
                key={filter.key}
                label={filter.label}
                selected={selectedBenefitFilter === filter.key}
                onPress={() => setSelectedBenefitFilter(selectedBenefitFilter === filter.key ? ALL_FILTER_KEY : filter.key)}
                filterType="benefits"
              />
            ))}
          </View>
          <View style={{ borderTopWidth: 1, borderColor: '#E0E0E0', width: '80%', alignSelf: 'center', paddingTop: spacing[1], marginTop: 0 }} />
          <View style={[exerciseLibraryStyles.filterRowCompact, { marginTop: spacing[4] }]}>
            {breathingBenefitFilters.map((filter) => (
              <FilterChip
                key={filter.key}
                label={filter.label}
                selected={selectedBenefitFilter === filter.key}
                onPress={() => setSelectedBenefitFilter(selectedBenefitFilter === filter.key ? ALL_FILTER_KEY : filter.key)}
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
                  <Text style={exerciseLibraryStyles.clearFiltersText}>{t('exercises.clearAll')}</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Duration Filter - Compact */}
            <View style={exerciseLibraryStyles.filterGroupCompact}>
              <Text style={exerciseLibraryStyles.filterGroupTitleCompact}>{emojis.duration} {t('exercises.duration')}</Text>
              <View style={exerciseLibraryStyles.filterRowCompact}>
                {timeFilters.map((filter) => (
                  <FilterChip
                    key={filter.key}
                    label={filter.label}
                    selected={selectedTimeFilter === filter.key}
                    onPress={() => setSelectedTimeFilter(selectedTimeFilter === filter.key ? ALL_FILTER_KEY : filter.key)}
                    filterType="duration"
                  />
                ))}
              </View>
            </View>

            {/* Style Filter - Compact */}
            <View style={exerciseLibraryStyles.filterGroupCompact}>
              <Text style={exerciseLibraryStyles.filterGroupTitleCompact}>{emojis.approach} {t('exercises.approach')}</Text>
              <View style={exerciseLibraryStyles.filterRowCompact}>
                {styleFilters.map((filter) => (
                  <FilterChip
                    key={filter.key}
                    label={filter.label}
                    selected={selectedStyleFilter === filter.key}
                    onPress={() => setSelectedStyleFilter(selectedStyleFilter === filter.key ? ALL_FILTER_KEY : filter.key)}
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
            {t('exercises.exercisesFound', { count: filteredExercises.length })}
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
            <Text style={exerciseLibraryStyles.emptyStateTitle}>{t('exercises.noExercisesFound')}</Text>
            <Text style={exerciseLibraryStyles.emptyStateDescription}>
              {t('exercises.adjustFilters')}
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