import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaWrapper } from '../SafeAreaWrapper';
import { ArrowLeft, ArrowRight, Target, CheckCircle, Lightbulb, Heart, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { goalService, FOCUS_AREAS, TIMELINE_OPTIONS, TherapyGoal } from '../../services/goalService';
import { goalSettingStyles as styles } from '../../styles/components/GoalSetting.styles';

interface GoalSettingExerciseProps {
  onComplete: (goal: TherapyGoal) => void;
  onBack: () => void;
}

type Step = 'intro' | 'focus-area' | 'clarify-goal' | 'practical-step' | 'motivation' | 'timeline' | 'summary';

export const GoalSettingExercise: React.FC<GoalSettingExerciseProps> = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState<Step>('intro');
  const [goalData, setGoalData] = useState({
    focusArea: '',
    customFocusArea: '',
    mainGoal: '',
    practicalStep: '',
    motivation: '',
    timeline: '' as 'short' | 'medium' | 'long' | '',
    timelineText: ''
  });
  
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [stepSuggestions, setStepSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (goalData.focusArea && goalData.focusArea !== 'other') {
      setSuggestions(goalService.getGoalSuggestions(goalData.focusArea));
    }
  }, [goalData.focusArea]);

  useEffect(() => {
    if (goalData.mainGoal && goalData.focusArea) {
      setStepSuggestions(goalService.getPracticalStepSuggestions(goalData.mainGoal, goalData.focusArea));
    }
  }, [goalData.mainGoal, goalData.focusArea]);

  const handleNext = () => {
    const steps: Step[] = ['intro', 'focus-area', 'clarify-goal', 'practical-step', 'motivation', 'timeline', 'summary'];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const steps: Step[] = ['intro', 'focus-area', 'clarify-goal', 'practical-step', 'motivation', 'timeline', 'summary'];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'intro':
        return true;
      case 'focus-area':
        return goalData.focusArea !== '';
      case 'clarify-goal':
        return goalData.mainGoal.trim().length > 0;
      case 'practical-step':
        return goalData.practicalStep.trim().length > 0;
      case 'motivation':
        return goalData.motivation.trim().length > 0;
      case 'timeline':
        return goalData.timeline !== '';
      default:
        return true;
    }
  };

  const handleSaveGoal = async () => {
    try {
      const timelineOption = TIMELINE_OPTIONS.find(t => t.id === goalData.timeline);
      
      const goal = await goalService.saveGoal({
        focusArea: goalData.focusArea,
        customFocusArea: goalData.focusArea === 'other' ? goalData.customFocusArea : undefined,
        mainGoal: goalData.mainGoal,
        practicalStep: goalData.practicalStep,
        motivation: goalData.motivation,
        timeline: goalData.timeline,
        timelineText: timelineOption?.label || '',
        linkedExercises: []
      });

      onComplete(goal);
    } catch (error) {
      Alert.alert('Error', 'Failed to save your goal. Please try again.');
      console.error('Failed to save goal:', error);
    }
  };

  const renderProgressBar = () => {
    const steps = ['intro', 'focus-area', 'clarify-goal', 'practical-step', 'motivation', 'timeline', 'summary'];
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
        colors={['#bfdbfe', '#7dd3fc']}
        style={styles.iconContainer}
      >
        <Target size={32} color="#1e40af" />
      </LinearGradient>
      
      <Text style={styles.stepTitle}>🧩 Therapy Goal-Setting</Text>
      <Text style={styles.stepDescription}>
        Setting therapy goals can give direction and motivation to your healing journey. 
        Let's explore what matters to you and how you'd like to grow.
      </Text>
      
      <View style={styles.benefitsList}>
        <View style={styles.benefitItem}>
          <CheckCircle size={20} color="#059669" />
          <Text style={styles.benefitText}>Clear direction for your therapy</Text>
        </View>
        <View style={styles.benefitItem}>
          <CheckCircle size={20} color="#059669" />
          <Text style={styles.benefitText}>Trackable progress over time</Text>
        </View>
        <View style={styles.benefitItem}>
          <CheckCircle size={20} color="#059669" />
          <Text style={styles.benefitText}>Personalized exercise recommendations</Text>
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

  const renderFocusAreaStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What would you like to focus on?</Text>
      <Text style={styles.stepDescription}>
        Choose an area where you'd like to see growth or change.
      </Text>
      
      <View style={styles.optionsContainer}>
        {FOCUS_AREAS.map((area) => (
          <TouchableOpacity
            key={area.id}
            style={[
              styles.optionCard,
              goalData.focusArea === area.id && styles.optionCardSelected
            ]}
            onPress={() => setGoalData(prev => ({ ...prev, focusArea: area.id }))}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.optionTitle,
              goalData.focusArea === area.id && styles.optionTitleSelected
            ]}>
              {area.title}
            </Text>
            <Text style={[
              styles.optionSubtitle,
              goalData.focusArea === area.id && styles.optionSubtitleSelected
            ]}>
              {area.subtitle}
            </Text>
            
            {area.examples.length > 0 && (
              <View style={styles.examplesContainer}>
                {area.examples.slice(0, 2).map((example, index) => (
                  <Text key={index} style={styles.exampleText}>• {example}</Text>
                ))}
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {goalData.focusArea === 'other' && (
        <View style={styles.customInputContainer}>
          <Text style={styles.inputLabel}>What's important to you?</Text>
          <TextInput
            style={styles.textInput}
            value={goalData.customFocusArea}
            onChangeText={(text) => setGoalData(prev => ({ ...prev, customFocusArea: text }))}
            placeholder="Describe your focus area..."
            multiline
            textAlignVertical="top"
          />
        </View>
      )}
    </View>
  );

  const renderClarifyGoalStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What would you like to be different?</Text>
      <Text style={styles.stepDescription}>
        Describe your goal in a positive way - what you want to feel, do, or experience.
      </Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textArea}
          value={goalData.mainGoal}
          onChangeText={(text) => setGoalData(prev => ({ ...prev, mainGoal: text }))}
          placeholder="I want to..."
          multiline
          textAlignVertical="top"
          numberOfLines={4}
        />
      </View>

      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>
            <Lightbulb size={16} color="#d97706" /> Need inspiration?
          </Text>
          {suggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionChip}
              onPress={() => setGoalData(prev => ({ ...prev, mainGoal: suggestion }))}
              activeOpacity={0.7}
            >
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderPracticalStepStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What's one small step you could take?</Text>
      <Text style={styles.stepDescription}>
        Break your goal into something doable. What's one small action you could take this week?
      </Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textArea}
          value={goalData.practicalStep}
          onChangeText={(text) => setGoalData(prev => ({ ...prev, practicalStep: text }))}
          placeholder="This week, I will..."
          multiline
          textAlignVertical="top"
          numberOfLines={3}
        />
      </View>

      {stepSuggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>
            <Lightbulb size={16} color="#d97706" /> Small step ideas:
          </Text>
          {stepSuggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionChip}
              onPress={() => setGoalData(prev => ({ ...prev, practicalStep: suggestion }))}
              activeOpacity={0.7}
            >
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderMotivationStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Direction and Focus</Text>
      <Text style={styles.stepDescription}>
        Without clear goals, therapy can feel vague or endless. This helps you know what you're working toward and provides a scientific way to measure progress.
      </Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textArea}
          value={goalData.motivation}
          onChangeText={(text) => setGoalData(prev => ({ ...prev, motivation: text }))}
          placeholder="This goal gives me direction because... Having this focus will help me..."
          multiline
          textAlignVertical="top"
          numberOfLines={4}
        />
      </View>

      <View style={styles.motivationTips}>
        <Text style={styles.tipsTitle}>
          <Heart size={16} color="#dc2626" /> Benefits of Clear Goals:
        </Text>
        <Text style={styles.tipText}>• **Direction**: Know exactly what you're working toward</Text>
        <Text style={styles.tipText}>• **Motivation**: Each step feels meaningful and connected</Text>
        <Text style={styles.tipText}>• **Measurement**: Track concrete progress over time</Text>
        <Text style={styles.tipText}>• **Engagement**: Clear purpose keeps you coming back</Text>
        <Text style={styles.tipText}>• **Scientific Method**: Objective way to assess therapeutic growth</Text>
      </View>
    </View>
  );

  const renderTimelineStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What's a realistic timeline?</Text>
      <Text style={styles.stepDescription}>
        Choose a timeframe that feels achievable and motivating.
      </Text>
      
      <View style={styles.timelineContainer}>
        {TIMELINE_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.timelineCard,
              goalData.timeline === option.id && styles.timelineCardSelected
            ]}
            onPress={() => setGoalData(prev => ({ ...prev, timeline: option.id as any, timelineText: option.label }))}
            activeOpacity={0.7}
          >
            <Clock size={24} color={goalData.timeline === option.id ? "#1e40af" : "#6b7280"} />
            <Text style={[
              styles.timelineTitle,
              goalData.timeline === option.id && styles.timelineTitleSelected
            ]}>
              {option.label}
            </Text>
            <Text style={[
              styles.timelineDescription,
              goalData.timeline === option.id && styles.timelineDescriptionSelected
            ]}>
              {option.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSummaryStep = () => {
    const focusAreaObj = FOCUS_AREAS.find(area => area.id === goalData.focusArea);
    const timelineObj = TIMELINE_OPTIONS.find(t => t.id === goalData.timeline);
    
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Your therapy goal is ready! 🎯</Text>
        <Text style={styles.stepDescription}>
          Here's what you've created together:
        </Text>
        
        <View style={styles.summaryCard}>
          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Focus Area</Text>
            <Text style={styles.summaryValue}>
              {goalData.focusArea === 'other' ? goalData.customFocusArea : focusAreaObj?.title}
            </Text>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Main Goal</Text>
            <Text style={styles.summaryValue}>{goalData.mainGoal}</Text>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Small Step</Text>
            <Text style={styles.summaryValue}>{goalData.practicalStep}</Text>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Why It Matters</Text>
            <Text style={styles.summaryValue}>{goalData.motivation}</Text>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Timeline</Text>
            <Text style={styles.summaryValue}>{timelineObj?.label}</Text>
          </View>
        </View>

        <View style={styles.nextStepsCard}>
          <Text style={styles.nextStepsTitle}>What happens next?</Text>
          <Text style={styles.nextStepsText}>
            • Your goal will be saved to "My Goals" in the Insights tab
          </Text>
          <Text style={styles.nextStepsText}>
            • You'll get gentle reminders to check in on your progress
          </Text>
          <Text style={styles.nextStepsText}>
            • Relevant exercises will be recommended to support this goal
          </Text>
        </View>

        <TouchableOpacity
          style={styles.saveGoalButton}
          onPress={handleSaveGoal}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#3b82f6', '#1e40af']}
            style={styles.saveGoalGradient}
          >
            <CheckCircle size={20} color="white" />
            <Text style={styles.saveGoalButtonText}>Save My Goal</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'intro': return renderIntroStep();
      case 'focus-area': return renderFocusAreaStep();
      case 'clarify-goal': return renderClarifyGoalStep();
      case 'practical-step': return renderPracticalStepStep();
      case 'motivation': return renderMotivationStep();
      case 'timeline': return renderTimelineStep();
      case 'summary': return renderSummaryStep();
      default: return renderIntroStep();
    }
  };

  const renderNavigationButtons = () => {
    if (currentStep === 'summary') return null;
    
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
          <Text style={[
            styles.nextButtonText,
            !canProceed() && styles.nextButtonTextDisabled
          ]}>
            Continue
          </Text>
          <ArrowRight size={20} color={canProceed() ? "white" : "#9ca3af"} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaWrapper style={styles.container}>
      <LinearGradient
        colors={['#f0f9ff', '#e0f2fe', '#bae6fd']}
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