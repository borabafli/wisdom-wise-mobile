import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, ImageBackground, Modal, Platform, Alert, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
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
import { getTopExercises, ExerciseProgress, Exercise } from '../utils/exercisePriority';
import SlidableHomeExerciseCard from '../components/SlidableHomeExerciseCard';
import { CardHidingService } from '../services/cardHidingService';
import { ExerciseCompletionService } from '../services/exerciseCompletionService';
import ExerciseSummaryCard from '../components/ExerciseSummaryCard';
import { useExercisePreview } from '../hooks/useExercisePreview';
import DailyPromptCard from '../components/DailyPromptCard';
import JournalPromptService from '../services/journalPromptService';
import streakService from '../services/streakService';

const HomeScreen: React.FC<HomeScreenProps> = ({ onStartSession, onExerciseClick, onInsightClick, onNavigateToExercises, onNavigateToInsights, navigation, onActionSelect }) => {
  const { t } = useTranslation();
  const { currentQuote } = useQuote();
  const { width, height } = Dimensions.get('window');
  const [showWaveformDemo, setShowWaveformDemo] = useState(false);
  const insets = useSafeAreaInsets();

  // Ref for check-in button to get its position
  const checkInButtonRef = useRef<TouchableOpacity>(null);

  // Animation for button shrink on press
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Exercise progress state - in real app, this would come from storage/API
  const [exerciseProgress, setExerciseProgress] = useState<ExerciseProgress>({});
  const [showTestButtons, setShowTestButtons] = useState(false);
  const [hiddenCardIds, setHiddenCardIds] = useState<string[]>([]);
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>([]);
  const [dailyPrompt, setDailyPrompt] = useState<string>('');
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [hasCheckedInToday, setHasCheckedInToday] = useState<boolean>(false);

  // Apply dynamic navigation bar styling
  const { statusBarStyle } = useNavigationBarStyle(navigationBarConfigs.homeScreen);

  // Exercise preview functionality
  const { showPreview, previewExercise, showExercisePreview, hideExercisePreview, confirmExerciseStart } = useExercisePreview(t);

  // Enhanced exercise click handler that shows preview first
  const handleExerciseClickWithPreview = (exercise?: Exercise) => {
    if (exercise) {
      showExercisePreview(exercise, () => {
        onExerciseClick?.(exercise);
      });
    } else {
      onExerciseClick?.(exercise);
    }
  };

  // Enhanced start session handler that shows preview first
  const handleStartSessionWithPreview = (exercise: any) => {
    if (exercise) {
      showExercisePreview(exercise, () => {
        onStartSession(exercise);
      });
    } else {
      onStartSession(exercise);
    }
  };
  
  // Load hidden card IDs and completed exercises on mount
  useEffect(() => {
          const loadData = async () => {
            const hiddenIds = await CardHidingService.getHiddenCardIds();
            setHiddenCardIds(hiddenIds);
    
            const completedIds = await ExerciseCompletionService.getCompletedExerciseIds();
            setCompletedExerciseIds(completedIds);
    
            // Load daily prompt
            const prompt = await JournalPromptService.getTodaysMainPrompt();
            setDailyPrompt(prompt);
    
            // Load streak data
            const streak = await streakService.getStreak();
            setCurrentStreak(streak);
            const checkedIn = await streakService.hasCheckedInToday();
            setHasCheckedInToday(checkedIn);
    
            // Update exercise progress with completion status
            const newProgress: ExerciseProgress = {};
            completedIds.forEach(id => {
              newProgress[id] = {
                completed: true,
                completedCount: 1,
                rating: Math.floor(Math.random() * 5) + 1,
                moodImprovement: Math.floor(Math.random() * 8) + 2,
                lastCompleted: new Date(),
              };
            });
            setExerciseProgress(newProgress);
          };
          loadData();
        }, []);
  // Static welcome message
  const welcomeMessage = {
    title: t('home.moodCheck'),
    subtitle: "" // Removed subtitle
  };

  // Handle card hiding
  const handleHideCard = async (exerciseId: string, hideType: 'permanent' | 'temporary') => {
    await CardHidingService.hideCard(exerciseId, hideType);
    const updatedHiddenIds = await CardHidingService.getHiddenCardIds();
    setHiddenCardIds(updatedHiddenIds);
  };

  // Get prioritized exercises and filter out hidden ones
  const topExercises = useMemo(() => {
    // Pass hidden IDs to getTopExercises so it can provide alternatives automatically
    return getTopExercises(exerciseProgress, hiddenCardIds, t);
  }, [exerciseProgress, hiddenCardIds, t]);

  // Test function to simulate exercise completion
  const simulateExerciseCompletion = async (exerciseId: string, completed: boolean) => {
    if (completed) {
      await ExerciseCompletionService.markExerciseCompleted(exerciseId);
      const updatedCompletedIds = await ExerciseCompletionService.getCompletedExerciseIds();
      setCompletedExerciseIds(updatedCompletedIds);
    } else {
      await ExerciseCompletionService.removeCompletion(exerciseId);
      const updatedCompletedIds = await ExerciseCompletionService.getCompletedExerciseIds();
      setCompletedExerciseIds(updatedCompletedIds);
    }

    setExerciseProgress(prev => ({
      ...prev,
      [exerciseId]: {
        completed,
        completedCount: completed ? 1 : 0,
        rating: completed ? Math.floor(Math.random() * 5) + 1 : undefined,
        moodImprovement: completed ? Math.floor(Math.random() * 8) + 2 : undefined,
        lastCompleted: completed ? new Date() : undefined,
      }
    }));
  };

  // Test function to generate daily prompts using existing insights
  const handleGeneratePromptsTest = async () => {
    try {
      // Force regeneration by using the service method
      await JournalPromptService.forceRegeneratePrompts();

      // Generate new prompts using existing insights
      const newPrompts = await JournalPromptService.generateDailyPrompts();

      // Update the main prompt
      if (newPrompts.length > 0) {
        setDailyPrompt(newPrompts[0].text);
      }

      console.log('Generated', newPrompts.length, 'prompts for today using existing insights');

      // Show success message
      Alert.alert(
        t('alerts.promptsGenerated.title', 'Prompts Generated!'),
        t('alerts.promptsGenerated.message', { count: newPrompts.length }),
        [{ text: t('common.ok') }]
      );
    } catch (error) {
      console.error('Error generating test prompts:', error);
      Alert.alert(t('common.error'), t('errors.promptGenerationFailed', 'Failed to generate prompts. Please try again.'));
    }
  };

  return (
    <SafeAreaWrapper style={styles.container}>
      <StatusBar style={statusBarStyle} backgroundColor="transparent" translucent />

      {/* Persistent Solid Background */}
      <View
        style={[styles.backgroundGradient, { backgroundColor: '#e9eff1' }]}
        pointerEvents="none"
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          Platform.OS === 'android' && { paddingBottom: insets.bottom }
        ]}
      >
        <View style={styles.scrollableContainer}>
          {/* Background Image */}
          <Image
            source={require('../../assets/new-design/Homescreen/background-wider-4.png')}
            style={styles.backgroundImageScrollable}
            contentFit="contain"
          />

          {/* Header Text and Chat Input */}
          <View style={styles.headerSection}>
          <View style={styles.headerText}>
            <Text style={styles.ctaTitle}>{t('home.moodCheck')}</Text>
            {welcomeMessage.subtitle && <Text style={styles.ctaSubtitle}>{welcomeMessage.subtitle}</Text>}
          </View>

          {/* Turtle Hero Image - positioned after text */}
          <View style={styles.turtleHeroContainer}>
            <Image
              source={require('../../assets/new-design/Turtle Hero Section/turtle-hero-7.png')}
              style={styles.turtleHeroImage}
              contentFit="contain"
            />
          </View>

          {/* Start Check-In Button */}
          {hasCheckedInToday ? (
            <View style={styles.checkedInMessageContainer}>
              <Text style={styles.checkedInMessageText}>{t('home.checkedInToday')}</Text>
              <Text style={styles.currentStreakText}>{t('home.currentStreak', { count: currentStreak })}</Text>
            </View>
          ) : (
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                ref={checkInButtonRef}
                onPressIn={() => {
                  Animated.spring(buttonScale, {
                    toValue: 0.95,
                    tension: 300,
                    friction: 10,
                    useNativeDriver: true,
                  }).start();
                }}
                onPressOut={() => {
                  Animated.spring(buttonScale, {
                    toValue: 1,
                    tension: 300,
                    friction: 10,
                    useNativeDriver: true,
                  }).start();
                }}
                onPress={async () => {
                  const newStreak = await streakService.recordCheckIn();
                  setCurrentStreak(newStreak);
                  setHasCheckedInToday(true);
                  checkInButtonRef.current?.measure((x, y, width, height, pageX, pageY) => {
                    onStartSession({ x: pageX, y: pageY, width, height });
                  });
                }}
                activeOpacity={1}
              >
                <ImageBackground
                  source={require('../../assets/new-design/Homescreen/Cards/check-in-card.png')}
                  style={styles.checkInButton}
                  imageStyle={{ borderRadius: 10 }}
                  resizeMode="cover"
                >
                  <Text style={styles.checkInButtonText}>{t('home.checkInNow')}</Text>
                  <View style={styles.checkInButtonIcons}>
                    <View style={styles.iconCircle}>
                      <MessageCircle size={18} color="#7d9db6" />
                      <Text style={styles.iconLabel}>{t('home.type')}</Text>
                    </View>
                    <View style={styles.iconCircle}>
                      <Mic size={18} color="#7d9db6" />
                      <Text style={styles.iconLabel}>{t('home.talk')}</Text>
                    </View>
                  </View>
                  {currentStreak > 0 && (
                    <View style={styles.streakDisplayContainer}>
                      <Text style={styles.streakDisplayText}>{currentStreak} {t('home.dayStreak')}</Text>
                    </View>
                  )}
                </ImageBackground>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>

        {/* For You Today Section */}
        <View style={styles.exercisesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.yourNextSteps')}</Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                onPress={onNavigateToExercises}
                style={styles.seeAllButton}
              >
                <Text style={styles.seeAllText}>{t('home.seeAll')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Exercise Cards */}
          {/* Exercise Cards with background line */}
<View style={styles.exercisesWrapper}>

            {/* Dynamic Exercise Cards */}
          <View style={styles.exercisesList}>
            {topExercises.map((exercise, index) => (
              <SlidableHomeExerciseCard
                key={exercise.id}
                exercise={exercise}
                index={index}
                exerciseProgress={exerciseProgress}
                showTestButtons={showTestButtons}
                onStartSession={handleStartSessionWithPreview}
                onHideCard={handleHideCard}
                simulateExerciseCompletion={simulateExerciseCompletion}
                isLast={index === topExercises.length - 1}
              />
            ))}
          </View>
          </View>
        </View>

        {/* Daily Reflection Section */}
        {dailyPrompt && (
          <View style={styles.dailyReflectionSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('home.dailyReflection')}</Text>
              <TouchableOpacity
                onPress={handleGeneratePromptsTest}
                style={[styles.testButton, styles.promptTestButton]}
              >
                <Text style={styles.promptTestButtonText}>
                  {t('home.generateTest')}
                </Text>
              </TouchableOpacity>
            </View>
            <DailyPromptCard
              prompt={dailyPrompt}
              onStartWriting={() => navigation?.navigate('Journal', {
                screen: 'GuidedJournal',
                params: { initialPrompt: dailyPrompt }
              })}
            />
          </View>
        )}

        {/* Quick Actions - Modern Style */}
        <View style={styles.quickActions}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.quickActions')}</Text>
          </View>



          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              onPress={onNavigateToExercises}
              style={styles.quickActionButton}
              activeOpacity={0.9}
            >
              <ImageBackground
                source={require('../../assets/new-design/Homescreen/Cards/blue-card-high.png')}
                style={styles.quickActionGradient}
                imageStyle={styles.quickActionBackgroundImage}
                resizeMode="contain"
              >
                <Image
                  source={require('../../assets/images/New Icons/new-1.png')}
                  style={styles.quickActionIconImage}
                  contentFit="contain"
                />
                <Text style={styles.quickActionText} numberOfLines={2} adjustsFontSizeToFit>{t('home.browseExercises')}</Text>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onNavigateToInsights}
              style={styles.quickActionButton}
              activeOpacity={0.9}
            >
              <ImageBackground
                source={require('../../assets/new-design/Homescreen/Cards/blue-card-high-shade-1.png')}
                style={styles.quickActionGradient}
                imageStyle={styles.quickActionBackgroundImage}
                resizeMode="contain"
              >
                <Image
                  source={require('../../assets/images/New Icons/new-2.png')}
                  style={styles.quickActionIconImage}
                  contentFit="contain"
                />
                <Text style={styles.quickActionText} numberOfLines={2} adjustsFontSizeToFit>{t('home.viewInsights')}</Text>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onActionSelect?.('breathing')}
              style={styles.quickActionButton}
              activeOpacity={0.9}
            >
              <ImageBackground
                source={require('../../assets/new-design/Homescreen/Cards/blue-card-high.png')}
                style={styles.quickActionGradient}
                imageStyle={styles.quickActionBackgroundImage}
                resizeMode="contain"
              >
                <Image
                  source={require('../../assets/images/New Icons/new-3.png')}
                  style={styles.quickActionIconImage}
                  contentFit="contain"
                />
                <Text style={styles.quickActionText} numberOfLines={2} adjustsFontSizeToFit>{t('home.startBreathing')}</Text>
              </ImageBackground>
            </TouchableOpacity>

          </View>
        </View>

        {/* Motivational Quote - Modern Style */}
        <View style={styles.quoteSection}>
          <View style={styles.quoteCard}>
            <ImageBackground
              source={require('../../assets/new-design/Turtle Hero Section/turtle-hero-3.png')}
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
        </View>
      </ScrollView>

      {/* Audio Waveform Demo Modal */}
      <Modal
        visible={showWaveformDemo}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowWaveformDemo(false)}
      >
        <SafeAreaWrapper style={{ flex: 1, backgroundColor: '#e9eff1' }}>
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
              {t('home.realTimeAudioWaves')}
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

export default HomeScreen;