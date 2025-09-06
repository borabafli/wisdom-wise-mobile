import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaWrapper } from '../SafeAreaWrapper';
import { ArrowLeft, ArrowRight, BookOpen, Heart, Lightbulb, CheckCircle, Clock, Users, Briefcase } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { storytellingStyles as styles } from '../../styles/components/Storytelling.styles';

interface StorytellingExerciseProps {
  onComplete: (storyData: any) => void;
  onBack: () => void;
}

type Step = 'intro' | 'timeline' | 'sharing' | 'deepening' | 'reflection';
type TimelineType = 'childhood-today' | 'recent-years' | 'specific-theme';
type ThemeType = 'relationships' | 'work' | 'health' | 'personal-growth' | 'family' | 'challenges' | 'achievements';

const TIMELINE_OPTIONS = [
  {
    id: 'childhood-today' as TimelineType,
    title: 'Childhood → Today',
    subtitle: 'Your whole life journey',
    icon: Clock,
    color: ['#dbeafe', '#93c5fd']
  },
  {
    id: 'recent-years' as TimelineType,
    title: 'Last 1–5 Years',
    subtitle: 'Recent chapters of your story',
    icon: ArrowRight,
    color: ['#dcfdf4', '#86efac']
  },
  {
    id: 'specific-theme' as TimelineType,
    title: 'A Specific Theme',
    subtitle: 'Focus on one area of life',
    icon: Lightbulb,
    color: ['#fef3c7', '#fbbf24']
  }
];

const THEME_OPTIONS = [
  { id: 'relationships' as ThemeType, title: 'Relationships', subtitle: 'Connections with others', icon: Heart },
  { id: 'work' as ThemeType, title: 'Work & Career', subtitle: 'Professional journey', icon: Briefcase },
  { id: 'health' as ThemeType, title: 'Health & Wellness', subtitle: 'Physical and mental wellbeing', icon: Heart },
  { id: 'personal-growth' as ThemeType, title: 'Personal Growth', subtitle: 'Learning and self-discovery', icon: Lightbulb },
  { id: 'family' as ThemeType, title: 'Family', subtitle: 'Family relationships and dynamics', icon: Users },
  { id: 'challenges' as ThemeType, title: 'Overcoming Challenges', subtitle: 'Difficult times and resilience', icon: CheckCircle }
];

const GUIDING_HINTS = [
  'Important events or turning points',
  'Challenges you faced and overcame',
  'Moments of growth, joy, or discovery',
  'People who influenced your journey',
  'Decisions that shaped your path',
  'Times when you surprised yourself'
];

export const StorytellingExercise: React.FC<StorytellingExerciseProps> = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState<Step>('intro');
  const [storyData, setStoryData] = useState({
    timeline: '' as TimelineType,
    theme: '' as ThemeType,
    mainStory: '',
    deepeningAnswers: [] as string[],
    reflectionComplete: false
  });

  const handleNext = () => {
    const steps: Step[] = ['intro', 'timeline', 'sharing', 'deepening', 'reflection'];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const steps: Step[] = ['intro', 'timeline', 'sharing', 'deepening', 'reflection'];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'intro':
        return true;
      case 'timeline':
        return storyData.timeline !== '' && (storyData.timeline !== 'specific-theme' || storyData.theme !== '');
      case 'sharing':
        return storyData.mainStory.trim().length > 50;
      case 'deepening':
        return true; // Optional step
      case 'reflection':
        return true;
      default:
        return false;
    }
  };

  const generateReflection = async () => {
    if (isGeneratingReflection) return;
    
    setIsGeneratingReflection(true);
    setReflectionError(null);
    
    try {
      const themes = storyData.timeline === 'specific-theme' && storyData.theme 
        ? [storyData.theme] 
        : [storyData.timeline];
      
      const deepeningAnswers = storyData.deepeningAnswers
        .map((answer, index) => {
          const questions = [
            "What emotions come up for you when you reflect on this part of your story?",
            "What did you learn about yourself during this time?",
            "How did that time in your life change you?",
            "What strengths did you discover in yourself?",
            "If you could summarize this chapter of your story in one sentence, what would it be?"
          ];
          return answer.trim() ? { question: questions[index], answer } : null;
        })
        .filter(Boolean) as { question: string; answer: string }[];
      
      const reflectionData: StoryData = {
        timeline: storyData.timeline,
        mainStory: storyData.mainStory,
        themes,
        deepeningAnswers: deepeningAnswers.length > 0 ? deepeningAnswers : undefined
      };
      
      const reflection = await storyReflectionService.generateReflection(reflectionData);
      setAiReflection(reflection);
    } catch (error) {
      console.error('Error generating reflection:', error);
      setReflectionError('Unable to generate personalized reflection');
      // Use fallback reflection
      const fallbackReflection = storyReflectionService.generateFallbackReflection({
        timeline: storyData.timeline,
        mainStory: storyData.mainStory,
        themes: [storyData.theme || storyData.timeline]
      });
      setAiReflection(fallbackReflection);
    } finally {
      setIsGeneratingReflection(false);
    }
  };

  const getTimelineDescription = () => {
    const option = TIMELINE_OPTIONS.find(t => t.id === storyData.timeline);
    if (!option) return '';
    
    if (storyData.timeline === 'specific-theme' && storyData.theme) {
      const theme = THEME_OPTIONS.find(t => t.id === storyData.theme);
      return `${option.title}: ${theme?.title}`;
    }
    
    return option.title;
  };

  const renderProgressBar = () => {
    const steps = ['intro', 'timeline', 'sharing', 'deepening', 'reflection'];
    const currentIndex = steps.indexOf(currentStep);
    const progress = ((currentIndex + 1) / steps.length) * 100;

    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Step {currentIndex + 1} of {steps.length}
        </Text>
      </View>
    );
  };

  const renderIntroStep = () => (
    <View style={styles.stepContainer}>
      <LinearGradient
        colors={['#fef3c7', '#fbbf24']}
        style={styles.iconContainer}
      >
        <BookOpen size={32} color="#d97706" />
      </LinearGradient>
      
      <Text style={styles.stepTitle}>📝 Tell Me Your Story</Text>
      <Text style={styles.stepDescription}>
        Our stories shape who we are. By telling yours, you can reflect on your journey, notice your strengths, and understand yourself better.
      </Text>
      
      <View style={styles.turtleMessage}>
        <Text style={styles.turtleText}>
          💭 <Text style={styles.turtleName}>Anu says:</Text> "There's no right or wrong way — just share what feels important to you. This is your space to reflect on what has made you who you are today."
        </Text>
      </View>

      <View style={styles.benefitsList}>
        <View style={styles.benefitItem}>
          <CheckCircle size={20} color="#059669" />
          <Text style={styles.benefitText}>Reflect on your personal journey</Text>
        </View>
        <View style={styles.benefitItem}>
          <CheckCircle size={20} color="#059669" />
          <Text style={styles.benefitText}>Identify your strengths and resilience</Text>
        </View>
        <View style={styles.benefitItem}>
          <CheckCircle size={20} color="#059669" />
          <Text style={styles.benefitText}>Gain deeper self-understanding</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.skipButton}
        onPress={onBack}
        activeOpacity={0.7}
      >
        <Text style={styles.skipButtonText}>Not ready right now</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTimelineStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>How would you like to frame your story?</Text>
      <Text style={styles.stepDescription}>
        Choose a timeframe that feels right for your reflection today.
      </Text>
      
      <View style={styles.optionsContainer}>
        {TIMELINE_OPTIONS.map((option) => {
          const Icon = option.icon;
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                storyData.timeline === option.id && styles.optionCardSelected
              ]}
              onPress={() => setStoryData(prev => ({ ...prev, timeline: option.id }))}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={option.color}
                style={styles.optionIcon}
              >
                <Icon size={24} color="#374151" />
              </LinearGradient>
              <View style={styles.optionContent}>
                <Text style={[
                  styles.optionTitle,
                  storyData.timeline === option.id && styles.optionTitleSelected
                ]}>
                  {option.title}
                </Text>
                <Text style={[
                  styles.optionSubtitle,
                  storyData.timeline === option.id && styles.optionSubtitleSelected
                ]}>
                  {option.subtitle}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {storyData.timeline === 'specific-theme' && (
        <View style={styles.themesContainer}>
          <Text style={styles.themesTitle}>Which theme would you like to explore?</Text>
          <View style={styles.themesGrid}>
            {THEME_OPTIONS.map((theme) => {
              const Icon = theme.icon;
              return (
                <TouchableOpacity
                  key={theme.id}
                  style={[
                    styles.themeCard,
                    storyData.theme === theme.id && styles.themeCardSelected
                  ]}
                  onPress={() => setStoryData(prev => ({ ...prev, theme: theme.id }))}
                  activeOpacity={0.7}
                >
                  <Icon 
                    size={20} 
                    color={storyData.theme === theme.id ? "#d97706" : "#6b7280"} 
                  />
                  <Text style={[
                    styles.themeTitle,
                    storyData.theme === theme.id && styles.themeTitleSelected
                  ]}>
                    {theme.title}
                  </Text>
                  <Text style={styles.themeSubtitle}>
                    {theme.subtitle}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );

  const renderSharingStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Tell me your story</Text>
      <Text style={styles.stepDescription}>
        {getTimelineDescription()}: Share what feels important in your own words.
      </Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.storyTextArea}
          value={storyData.mainStory}
          onChangeText={(text) => setStoryData(prev => ({ ...prev, mainStory: text }))}
          placeholder="Tell me your story in your own words. What has shaped you the most?"
          multiline
          textAlignVertical="top"
          numberOfLines={8}
        />
        <Text style={styles.characterCount}>
          {storyData.mainStory.length} characters
        </Text>
      </View>

      <View style={styles.hintsContainer}>
        <Text style={styles.hintsTitle}>
          <Lightbulb size={16} color="#d97706" /> Optional guiding hints:
        </Text>
        <View style={styles.hintsList}>
          {GUIDING_HINTS.map((hint, index) => (
            <Text key={index} style={styles.hintText}>
              • {hint}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );

  const renderDeepeningStep = () => {
    const questions = [
      "How did that time in your life change you?",
      "What strengths did you discover in yourself?",
      "If you could summarize this chapter of your story in one sentence, what would it be?"
    ];

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Let's go a little deeper</Text>
        <Text style={styles.stepDescription}>
          These questions are optional, but they might help you reflect more deeply on your story.
        </Text>

        <View style={styles.deepeningQuestions}>
          {questions.map((question, index) => (
            <View key={index} style={styles.questionContainer}>
              <Text style={styles.questionText}>{question}</Text>
              <TextInput
                style={styles.questionInput}
                value={storyData.deepeningAnswers[index] || ''}
                onChangeText={(text) => {
                  const newAnswers = [...storyData.deepeningAnswers];
                  newAnswers[index] = text;
                  setStoryData(prev => ({ ...prev, deepeningAnswers: newAnswers }));
                }}
                placeholder="Your thoughts..."
                multiline
                textAlignVertical="top"
                numberOfLines={3}
              />
            </View>
          ))}
        </View>

        <View style={styles.optionalNote}>
          <Text style={styles.optionalNoteText}>
            💡 These questions are completely optional. Feel free to answer any, all, or none of them.
          </Text>
        </View>
      </View>
    );
  };

  const renderReflectionStep = () => {
    if (isGeneratingReflection) {
      return (
        <View style={styles.stepContainer}>
          <LinearGradient
            colors={['#dcfdf4', '#86efac']}
            style={styles.iconContainer}
          >
            <Loader2 size={32} color="#059669" />
          </LinearGradient>
          
          <Text style={styles.stepTitle}>Creating your reflection...</Text>
          <Text style={styles.stepDescription}>
            I'm taking a moment to thoughtfully reflect on your story. This won't take long.
          </Text>
          
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#059669" />
          </View>
        </View>
      );
    }

    return (
      <View style={styles.stepContainer}>
        <LinearGradient
          colors={['#dcfdf4', '#86efac']}
          style={styles.iconContainer}
        >
          <Heart size={32} color="#059669" />
        </LinearGradient>
        
        <Text style={styles.stepTitle}>Thank you for sharing your story</Text>
        
        {reflectionError && (
          <View style={styles.turtleMessage}>
            <Text style={styles.turtleText}>
              <Text style={styles.turtleName}>Anu: </Text>
              I'm having some technical difficulties creating a personalized reflection, but I still want to acknowledge the courage it took to share your story with me.
            </Text>
          </View>
        )}
        
        <View style={styles.reflectionCard}>
          <Text style={styles.reflectionText}>
            {aiReflection?.compassionateMessage || 
             "Thank you for sharing your story with me. It takes courage to reflect on our experiences and share them, and I'm honored that you trusted me with this part of your journey."}
          </Text>
          
          {aiReflection?.strengthsIdentified && aiReflection.strengthsIdentified.length > 0 && (
            <>
              <Text style={styles.reflectionText}>
                What I notice about your story:
              </Text>
              {aiReflection.strengthsIdentified.map((strength, index) => (
                <Text key={index} style={styles.reflectionText}>
                  • {strength}
                </Text>
              ))}
            </>
          )}
          
          {aiReflection?.resiliencePatterns && aiReflection.resiliencePatterns.length > 0 && (
            <>
              <Text style={styles.reflectionText}>
                Resilience patterns I see:
              </Text>
              {aiReflection.resiliencePatterns.map((pattern, index) => (
                <Text key={index} style={styles.reflectionText}>
                  • {pattern}
                </Text>
              ))}
            </>
          )}
          
          {aiReflection?.growthOpportunities && aiReflection.growthOpportunities.length > 0 && (
            <>
              <Text style={styles.reflectionText}>
                Opportunities for continued growth:
              </Text>
              {aiReflection.growthOpportunities.map((opportunity, index) => (
                <Text key={index} style={styles.reflectionText}>
                  • {opportunity}
                </Text>
              ))}
            </>
          )}
          
          <Text style={styles.reflectionHighlight}>
            {aiReflection?.encouragement || 
             "Your story matters, and the strength you've shown in sharing it reflects the same courage that has carried you through your journey."}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => {
            setStoryData(prev => ({ ...prev, reflectionComplete: true }));
            onComplete({
              ...storyData,
              aiReflection,
              reflectionComplete: true,
              completedAt: new Date().toISOString()
            });
          }}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#059669', '#047857']}
            style={styles.completeGradient}
          >
            <CheckCircle size={20} color="white" />
            <Text style={styles.completeButtonText}>Complete Exercise</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'intro': return renderIntroStep();
      case 'timeline': return renderTimelineStep();
      case 'sharing': return renderSharingStep();
      case 'deepening': return renderDeepeningStep();
      case 'reflection': return renderReflectionStep();
      default: return renderIntroStep();
    }
  };

  const renderNavigationButtons = () => {
    if (currentStep === 'reflection') return null;
    
    return (
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, styles.backButton]}
          onPress={currentStep === 'intro' ? onBack : handlePrevious}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#6b7280" />
          <Text style={styles.backButtonText}>
            {currentStep === 'intro' ? 'Cancel' : 'Back'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            styles.nextButton,
            !canProceed() && styles.nextButtonDisabled
          ]}
          onPress={handleNext}
          activeOpacity={0.7}
          disabled={!canProceed()}
        >
          {isGeneratingReflection && currentStep === 'deepening' ? (
            <ActivityIndicator size="small" color={canProceed() ? "white" : "#9ca3af"} />
          ) : (
            <Text style={[
              styles.nextButtonText,
              !canProceed() && styles.nextButtonTextDisabled
            ]}>
              {currentStep === 'deepening' ? 'Continue to Reflection' : 'Continue'}
            </Text>
          )}
          <ArrowRight size={20} color={canProceed() ? "white" : "#9ca3af"} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaWrapper style={styles.container}>
      <LinearGradient
        colors={['#fefbf3', '#fef3c7', '#fde68a']}
        style={styles.backgroundGradient}
      />
      
      {renderProgressBar()}
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderCurrentStep()}
      </ScrollView>

      {renderNavigationButtons()}
    </SafeAreaWrapper>
  );
};