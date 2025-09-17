import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, ImageBackground, Modal, Platform, Alert } from 'react-native';
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

const HomeScreen: React.FC<HomeScreenProps> = ({ onStartSession, onExerciseClick, onInsightClick, onNavigateToExercises, onNavigateToInsights, navigation }) => {
  const { currentQuote } = useQuote();
  const { width, height } = Dimensions.get('window');
  const [showWaveformDemo, setShowWaveformDemo] = useState(false);
  const insets = useSafeAreaInsets();

  // Exercise progress state - in real app, this would come from storage/API
  const [exerciseProgress, setExerciseProgress] = useState<ExerciseProgress>({});
  const [showTestButtons, setShowTestButtons] = useState(false);
  const [hiddenCardIds, setHiddenCardIds] = useState<string[]>([]);
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>([]);
  const [dailyPrompt, setDailyPrompt] = useState<string>('');

  // Apply dynamic navigation bar styling
  const { statusBarStyle } = useNavigationBarStyle(navigationBarConfigs.homeScreen);

  // Exercise preview functionality
  const { showPreview, previewExercise, showExercisePreview, hideExercisePreview, confirmExerciseStart } = useExercisePreview();

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
    title: "How are you\nfeeling?",
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
    return getTopExercises(exerciseProgress, hiddenCardIds);
  }, [exerciseProgress, hiddenCardIds]);

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
        'Prompts Generated!',
        `Generated ${newPrompts.length} new writing prompts using your existing insights. Check the Journal tab to see all prompts in the "Writing Prompts" section.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error generating test prompts:', error);
      Alert.alert('Error', 'Failed to generate prompts. Please try again.');
    }
  };

  return (
    <SafeAreaWrapper style={styles.container}>
      <StatusBar style={statusBarStyle} backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.8)', '#F8FAFC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.backgroundGradient}
      />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          Platform.OS === 'android' && { paddingBottom: insets.bottom }
        ]}
      >
        {/* Header Text and Chat Input */}
        <View style={styles.headerSection}>
          <View style={styles.headerText}>
            <Text style={styles.ctaTitle}>How are you</Text>
            <Text style={[styles.ctaTitle, styles.ctaTitleSecondLine]}>feeling?</Text>
            {welcomeMessage.subtitle && <Text style={styles.ctaSubtitle}>{welcomeMessage.subtitle}</Text>}
          </View>
          
          {/* Scrollable Turtle Background - positioned between text and chatbar */}
          <View style={styles.scrollableTurtleContainer}>
            <Image 
              source={require('../../assets/images/Teal watercolor single element/home-background.png')}
              style={styles.scrollableTurtleImage}
              contentFit="contain"
            />
          </View>
          
          {/* Container for turtle and input bar */}
          <TouchableOpacity
            onPress={() => onStartSession()}
            style={styles.inputWithTurtleWrapper}
            activeOpacity={0.9}
          >
            
            {/* Input area - Just the image */}
            <Image
              source={require('../../assets/images/Buttons/chatbar.png')}
              style={styles.chatbarImage}
              contentFit="contain"
            />
            
            {/* Grey text overlay on chatbar */}
            <Text style={styles.chatbarText}>Tap to Share...</Text>
          </TouchableOpacity>
        </View>

        {/* For You Today Section */}
        <View style={styles.exercisesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Next Steps</Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                onPress={() => setShowTestButtons(!showTestButtons)}
                style={[styles.testButton, showTestButtons && styles.testButtonActive]}
              >
                <Text style={[styles.testButtonText, showTestButtons && styles.testButtonTextActive]}>
                  {showTestButtons ? 'Hide Test' : 'Test'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={onNavigateToExercises}
                style={styles.seeAllButton}
              >
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Exercise Cards */}
          {/* Exercise Cards with background line */}
<View style={styles.exercisesWrapper}>
  {/* Decorative background line */}
  <Image 
    source={require('../../assets/images/line.png')}
    style={styles.exercisesLineBackground}
  />

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
              />
            ))}
          </View>
          </View>
        </View>
        
        {/* Quick Actions - Modern Style */}
        <View style={styles.quickActions}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              onPress={onNavigateToExercises}
              style={styles.quickActionButton}
              activeOpacity={0.9}
            >
              <ImageBackground
                source={require('../../assets/images/Buttons/background-5.png')}
                style={styles.quickActionGradient}
                imageStyle={styles.quickActionBackgroundImage}
                resizeMode="cover"
              >
                <Image 
                  source={require('../../assets/images/New Icons/icon-4.png')}
                  style={styles.quickActionIconImage}
                  contentFit="contain"
                />
                <Text style={styles.quickActionText} numberOfLines={2} adjustsFontSizeToFit>Browse{"\n"}Exercises</Text>
              </ImageBackground>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={onNavigateToInsights}
              style={styles.quickActionButton}
              activeOpacity={0.9}
            >
              <ImageBackground
                source={require('../../assets/images/Buttons/background-5.png')}
                style={styles.quickActionGradient}
                imageStyle={styles.quickActionBackgroundImage}
                resizeMode="cover"
              >
                <Image 
                  source={require('../../assets/images/New Icons/icon-5.png')}
                  style={styles.quickActionIconImage}
                  contentFit="contain"
                />
                <Text style={styles.quickActionText} numberOfLines={2} adjustsFontSizeToFit>View{"\n"}Insights</Text>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onStartSession({ type: 'breathing', name: 'Deep Breathing', duration: '5 min', description: 'Calm your mind with guided breathing' })}
              style={styles.quickActionButton}
              activeOpacity={0.9}
            >
              <ImageBackground
                source={require('../../assets/images/Buttons/background-5.png')}
                style={styles.quickActionGradient}
                imageStyle={styles.quickActionBackgroundImage}
                resizeMode="cover"
              >
                <Image 
                  source={require('../../assets/images/New Icons/icon-6.png')}
                  style={styles.quickActionIconImage}
                  contentFit="contain"
                />
                <Text style={styles.quickActionText} numberOfLines={2} adjustsFontSizeToFit>Start{"\n"}Breathing</Text>
              </ImageBackground>
            </TouchableOpacity>

          </View>
        </View>

        {/* Motivational Quote - Modern Style */}
        <View style={styles.quoteSection}>
          <View style={styles.quoteCard}>
            <ImageBackground
              source={require('../../assets/images/Teal watercolor single element/home-background.png')}
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

        {/* Daily Reflection Section */}
        {dailyPrompt && (
          <View style={styles.dailyReflectionSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Daily Reflection</Text>
              <TouchableOpacity
                onPress={handleGeneratePromptsTest}
                style={[styles.testButton, styles.promptTestButton]}
              >
                <Text style={styles.testButtonText}>
                  Generate Test
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
      </ScrollView>

      {/* Audio Waveform Demo Modal */}
      <Modal
        visible={showWaveformDemo}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowWaveformDemo(false)}
      >
        <SafeAreaWrapper style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
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
              Real-Time Audio Waves
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