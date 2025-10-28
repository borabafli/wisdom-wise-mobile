import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Animated, ImageBackground, Keyboard, TouchableWithoutFeedback, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import * as NavigationBar from 'expo-navigation-bar';
import * as Clipboard from 'expo-clipboard';
import { useNavigationBarStyle, navigationBarConfigs } from '../hooks/useNavigationBarStyle';
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';
import { useFonts, Caveat_400Regular } from '@expo-google-fonts/caveat';
import { ChevronLeft, AlertCircle } from 'lucide-react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

// Import new components and hooks
import { 
  MessageItem, 
  AnimatedTypingCursor, 
  AnimatedTypingDots,
  TranscribingIndicator,
  SuggestionChips, 
  ChatInput, 
  ExerciseCard 
} from '../components/chat';
import { MoodRatingCard } from '../components/chat/MoodRatingCard';
import { PreExerciseMoodCard } from '../components/chat/PreExerciseMoodCard';
import { ValueReflectionSummaryCard } from '../components/chat/ValueReflectionSummaryCard';
import { ThinkingPatternSummaryCard } from '../components/chat/ThinkingPatternSummaryCard';
import { VisionSummaryCard } from '../components/chat/VisionSummaryCard';
import { TherapyGoalSummaryCard } from '../components/chat/TherapyGoalSummaryCard';
import {
  useTypewriterAnimation,
  useVoiceRecording,
  useChatSession,
  useTTSControls
} from '../hooks/chat';
import { useExerciseFlow } from '../hooks';

// Import services and utilities
import { storageService, Message } from '../services/storageService';

// Import styles
import { chatInterfaceStyles as styles } from '../styles/components/ChatInterface.styles';
import { colors } from '../styles/tokens';

// Import types
import { ChatInterfaceProps } from '../types';

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onBack,
  currentExercise,
  initialMessage,
  onActionSelect,
  onExerciseClick
}) => {
  const { t } = useTranslation();
  const [fontsLoaded] = useFonts({
    Caveat_400Regular,
  });

  // Apply dynamic navigation bar styling
  const { statusBarStyle } = useNavigationBarStyle(navigationBarConfigs.chatInterface);

  // Safe fallback for when SafeAreaProvider context is not available
  let insets;
  try {
    insets = useSafeAreaInsets();
  } catch (error) {
    console.warn('SafeAreaProvider context not available in ChatInterface, using fallback values:', error);
    // Fallback insets for when context is not available
    insets = {
      top: Platform.OS === 'ios' ? 44 : 0,
      bottom: Platform.OS === 'ios' ? 34 : 0,
      left: 0,
      right: 0,
    };
  }

  // Set navigation bar color to match chat background - modern approach
  useEffect(() => {
    const setupNavigationBar = async () => {
      if (Platform.OS === 'android') {
        try {
          // Set navigation bar to match screen background
          await NavigationBar.setBackgroundColorAsync('#FFFFFE');
          await NavigationBar.setButtonStyleAsync('dark');
          // Use standard positioning for better compatibility
          await NavigationBar.setPositionAsync('relative');
        } catch (error) {
          console.warn('Failed to set navigation bar styling:', error);
        }
      }
    };

    setupNavigationBar();

    // Note: Cleanup is handled in handleBackFromChat for immediate color change
  }, []);

  // Basic state
  const [inputText, setInputText] = useState('');
  const textBeforeVoiceRef = useRef(''); // Store text that was typed before voice recording
  
  // Animation refs
  const backgroundAnimation = useRef(new Animated.Value(0)).current;
  const headerAnimation = useRef(new Animated.Value(0)).current;
  const endReflectionButtonAnimation = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  // Custom hooks
  const chatSession = useChatSession(currentExercise, t);
  const ttsControls = useTTSControls();
  const typewriterAnimation = useTypewriterAnimation(
    chatSession.setMessages,
    scrollViewRef
  );
  const voiceRecording = useVoiceRecording((transcript: string) => {
    // For final results, append transcript to text that existed before recording
    // This prevents accumulation of partial results while preserving typed text
    const finalText = textBeforeVoiceRef.current + (textBeforeVoiceRef.current ? ' ' : '') + transcript;
    setInputText(finalText);
  });

  const {
    exerciseMode,
    exerciseStep, 
    exerciseData,
    showMoodRating,
    showPreExerciseMoodSlider,
    isValueReflection,
    isThinkingPatternReflection,
    showValueReflectionSummary,
    valueReflectionSummary,
    showThinkingPatternSummary,
    thinkingPatternSummary,
    showVisionSummary,
    visionSummary,
    showTherapyGoalSummary,
    therapyGoalSummary,
    reflectionMessageCount,
    canEndReflection,
    startDynamicAIGuidedExercise,
    handleDynamicAIGuidedExerciseResponse,
    startValueReflection,
    handleValueReflectionResponse,
    endValueReflection,
    saveValueReflectionSummary,
    cancelValueReflectionSummary,
    startThinkingPatternReflection,
    handleThinkingPatternReflectionResponse,
    endThinkingPatternReflection,
    saveThinkingPatternSummary,
    cancelThinkingPatternSummary,
    saveVisionSummary,
    cancelVisionSummary,
    saveTherapyGoalSummary,
    cancelTherapyGoalSummary,
    handleMoodRatingComplete,
    handleMoodRatingSkip,
    handlePreExerciseMoodComplete,
    enterExerciseMode,
    exitExerciseMode,
  } = useExerciseFlow(undefined, t);

  // Track initialization
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize on mount
  useEffect(() => {
    if (isInitialized) return;

    if (currentExercise) {
      console.log('Initializing chat with exercise:', currentExercise.type);

      if (currentExercise.type === 'value_reflection') {
        console.log('Starting value reflection with context:', currentExercise.context);
        startValueReflection(
          currentExercise.context,
          chatSession.setMessages,
          chatSession.setIsTyping,
          chatSession.setSuggestions
        );
      } else if (currentExercise.type === 'thinking_pattern_reflection') {
        console.log('Starting thinking pattern reflection with context:', currentExercise.context);
        startThinkingPatternReflection(
          currentExercise.context,
          chatSession.setMessages,
          chatSession.setIsTyping,
          chatSession.setSuggestions
        );
      } else {
        enterExerciseMode();
        startDynamicAIGuidedExercise(
          currentExercise,
          chatSession.setMessages,
          chatSession.setIsTyping,
          chatSession.setSuggestions
        );
      }

      setIsInitialized(true);
      return;
    }

    chatSession.initializeChatSession();
    setIsInitialized(true);
  }, [currentExercise]);

  // Handle initial message from notification
  useEffect(() => {
    if (initialMessage && isInitialized && chatSession.messages.length === 1) {
      // Only send if chat is initialized and we're still at the welcome message
      console.log('Sending initial message from notification:', initialMessage);
      chatSession.sendMessage(initialMessage);
    }
  }, [initialMessage, isInitialized, chatSession.messages.length]);

  // Handle input text changes
  const handleInputTextChange = (text: string) => {
    setInputText(text);
  };

  // Handle keyboard dismiss
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Handle sending messages
  const handleSend = async (text = inputText) => {
    if (!text.trim()) return;
    setInputText('');

    if (isValueReflection) {
      await handleValueReflectionResponse(
        text,
        chatSession.setMessages,
        chatSession.setIsTyping,
        chatSession.setSuggestions
      );
      return;
    }

    if (isThinkingPatternReflection) {
      await handleThinkingPatternReflectionResponse(
        text,
        chatSession.setMessages,
        chatSession.setIsTyping,
        chatSession.setSuggestions
      );
      return;
    }

    if (exerciseMode && exerciseData.dynamicFlow) {
      await handleDynamicAIGuidedExerciseResponse(
        text, 
        exerciseData.dynamicFlow, 
        exerciseData.currentExercise,   // ✅ use currentExercise from exerciseData
        chatSession.setMessages,
        chatSession.setIsTyping,
        chatSession.setSuggestions
      );
      return;
    }
    
    await chatSession.handleSendMessage(text);
  };

  // Handle message actions
  const handleCopyMessage = async (content: string) => {
    try {
      await Clipboard.setStringAsync(content);
    } catch (error) {
      console.error('Error copying message:', error);
    }
  };

  const handlePromptSuggestion = (text: string) => {
    setInputText(text);
    handleSend(text);
  };

    // Handle exercise card actions
const handleExerciseCardStart = (exerciseInfo: any) => {
  console.log("=== EXERCISE CARD CLICKED FROM CHAT ===", exerciseInfo);

  // Clear the card from the chat interface
  chatSession.setShowExerciseCard(null);

  // Check if the exercise is a breathing exercise
  const isBreathingExercise = exerciseInfo.category === t('exerciseLibrary.categories.breathing') || exerciseInfo.type.includes('breathing');
  if (isBreathingExercise) {
    // If it is, call the onExerciseClick handler passed in props.
    // This handler, defined in useAppState.ts, will show the BreathingScreen.
    if (onExerciseClick) {
      onExerciseClick(exerciseInfo);
    } else {
      console.warn("onExerciseClick is not defined in ChatInterface props");
    }
  } else {
    // For all other exercises, start the dynamic AI-guided exercise flow
    // which happens within the chat interface.
    startDynamicAIGuidedExercise(
      exerciseInfo,
      chatSession.setMessages,
      chatSession.setIsTyping,
      chatSession.setSuggestions
    );
  }
};


    // Helper function to add AI messages with typewriter animation
    const addAIMessageWithTypewriter = async (message: Message) => {
      const fullText = message.content || message.text || '';
      const messageWithEmptyContent = { ...message, content: '', text: '' };
      
      chatSession.setMessages((prev: Message[]) => [...prev, messageWithEmptyContent]);
      typewriterAnimation.startTypewriterAnimation(messageWithEmptyContent, fullText);
      await storageService.addMessage(message);
      
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    };

    // Animations
    const startExerciseAnimations = () => {
      Animated.timing(backgroundAnimation, { toValue: 1, duration: 600, useNativeDriver: false }).start();
      Animated.timing(headerAnimation, { toValue: 1, duration: 400, useNativeDriver: false }).start();
    };

    const stopExerciseAnimations = () => {
      Animated.timing(backgroundAnimation, { toValue: 0, duration: 600, useNativeDriver: false }).start();
      Animated.timing(headerAnimation, { toValue: 0, duration: 400, useNativeDriver: false }).start();
    };

    useEffect(() => {
      const isInExerciseMode = exerciseMode && exerciseData.dynamicFlow;
      if (isInExerciseMode) startExerciseAnimations();
      else stopExerciseAnimations();
    }, [exerciseMode, exerciseData]);

    // Animate end reflection button
    useEffect(() => {
      if (canEndReflection) {
        Animated.spring(endReflectionButtonAnimation, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();
      } else {
        endReflectionButtonAnimation.setValue(0);
      }
    }, [canEndReflection]);

    const normalGradient = ['rgba(255, 255, 254, 0.9)', '#FFFFFE']; // Even closer to white
    const exerciseGradient = ['rgba(255, 255, 254, 0.9)', '#FFFFFE']; // Same subtle gradient for exercises

    const renderMessage = (message: Message) => (
      <MessageItem
        key={message.id}
        message={message}
        isTypewriting={typewriterAnimation.isTypewriting}
        currentTypewriterMessage={typewriterAnimation.currentTypewriterMessage}
        typewriterText={typewriterAnimation.typewriterText}
        playingMessageId={ttsControls.playingMessageId}
        ttsStatus={ttsControls.ttsStatus}
        onSkipTypewriter={typewriterAnimation.skipTypewriterAnimation}
        onPlayTTS={ttsControls.handlePlayTTS}
        onStopTTS={ttsControls.handleStopTTS}
        onCopyMessage={handleCopyMessage}
        onPromptSuggestion={handlePromptSuggestion}
        AnimatedTypingCursor={() => <AnimatedTypingCursor isActive={typewriterAnimation.isTypewriting} />}
      />
    );

  return (
    <>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor="#ffffff"
        translucent={false}
      />
      <SafeAreaWrapper style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.backgroundImage}>
        <LinearGradient
          colors={['rgba(255, 255, 254, 0.9)', 'rgba(255, 255, 254, 1.0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.backgroundOverlay}
        />
        <View style={styles.backgroundGradient}>
          <Animated.View style={[
            styles.backgroundGradient,
            { opacity: backgroundAnimation.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }
          ]}>
            <LinearGradient colors={normalGradient as any} style={styles.backgroundGradient} />
          </Animated.View>
          <Animated.View style={[
            styles.backgroundGradient,
            { opacity: backgroundAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }) }
          ]}>
            <LinearGradient colors={exerciseGradient as any} style={styles.backgroundGradient} />
          </Animated.View>
        </View>

        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}

        >
          {/* Header */}
          <Animated.View style={[
            styles.header,
            { backgroundColor: headerAnimation.interpolate({ inputRange: [0, 1], outputRange: ['rgba(255,255,255,0)', 'rgba(248,250,252,0.85)'] }) }
          ]}>
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <TouchableOpacity 
                  onPress={() => {
                    const exerciseContext = {
                      exerciseMode,
                      exerciseType: exerciseData.currentExercise?.type,
                      isValueReflection,
                      isThinkingPatternReflection,
                      isVisionExercise: showVisionSummary || exerciseData.currentExercise?.type === 'vision-of-future'
                    };
                    chatSession.handleEndSession(onBack, exerciseContext);
                  }}
                  style={styles.backButton}
                  activeOpacity={0.7}
                >
                  <ChevronLeft size={20} color="#475569" />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                  <View style={styles.sessionDetails}>
                    <Text style={[styles.sessionTitle, (currentExercise || exerciseData.currentExercise) && styles.exerciseTitle]}>
                      {exerciseMode && exerciseData.dynamicFlow
                        ? exerciseData.currentExercise?.name || t('chat.exercise')
                        : currentExercise
                          ? currentExercise.name
                          : t('chat.reflectionSpace')}
                    </Text>
                    <Text style={styles.sessionSubtitle}>
                      {exerciseMode && exerciseData.dynamicFlow
                        ? t('chat.exerciseProgress', {
                            current: exerciseStep + 1,
                            total: exerciseData.dynamicFlow.steps.length,
                            title: exerciseData.dynamicFlow.steps[exerciseStep]?.title ? t(exerciseData.dynamicFlow.steps[exerciseStep].title) : t('chat.inProgress')
                          })
                        : currentExercise
                          ? t('chat.therapeuticExercise', { duration: currentExercise.duration || '5 min' })
                          : chatSession.isLoading
                            ? t('chat.loadingSpace')
                            : t('chat.safeSpace')}
                    </Text>
                    
                    {!currentExercise && typeof chatSession.rateLimitStatus?.percentage === 'number' && chatSession.rateLimitStatus.percentage >= 80 && (
                      <View style={styles.warningContainer}>
                        <AlertCircle size={14} color="#f59e0b" />
                        <Text style={styles.warningText}>
                          {chatSession.rateLimitStatus.percentage >= 90 
                            ? t('chat.almostAtLimit', { remaining: Math.max(0, (chatSession.rateLimitStatus.total || 0) - (chatSession.rateLimitStatus.used || 0)) })
                            : t('chat.limitUsed', { percentage: chatSession.rateLimitStatus.percentage })}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>


          {/* Messages Area */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesArea}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
          >

            
            {chatSession.messages.map(renderMessage)}
            
            {chatSession.showExerciseCard && (
              <ExerciseCard
                exercise={chatSession.showExerciseCard}
                onStart={handleExerciseCardStart}
                onDismiss={() => chatSession.setShowExerciseCard(null)}
              />
            )}

            {(chatSession.isTyping || chatSession.isLoading) && (
              <View style={styles.typingContainer}>
                <View style={styles.typingBubble}>
                  <View style={styles.typingContent}>
                    <View style={styles.typingAvatar}>
                      <Image
                        source={require('../../assets/images/onboarding/chat-avatar-image.png')}
                        style={styles.typingTurtleAvatar}
                        contentFit="contain"
                      />
                    </View>
                    <View style={styles.typingTextContainer}>
                      <AnimatedTypingDots isVisible={chatSession.isTyping || chatSession.isLoading} />
                    </View>
                  </View>
                </View>

              </View>
            )}


            {showPreExerciseMoodSlider && exerciseData.currentExercise && (
              <PreExerciseMoodCard
                exerciseName={exerciseData.currentExercise.name}
                onComplete={(rating) => handlePreExerciseMoodComplete(
                  rating,
                  chatSession.setMessages,
                  chatSession.setIsTyping,
                  chatSession.setSuggestions
                )}
                onSkip={() => handlePreExerciseMoodComplete(
                  2.5,
                  chatSession.setMessages,
                  chatSession.setIsTyping,
                  chatSession.setSuggestions
                )}
              />
            )}

            {showMoodRating && exerciseData.currentExercise && (
              <MoodRatingCard
                exerciseType={exerciseData.currentExercise.type}
                exerciseName={exerciseData.currentExercise.name}
                sessionId={Date.now().toString()}
                onComplete={handleMoodRatingComplete}
                onSkip={handleMoodRatingSkip}
              />
            )}

            {showValueReflectionSummary && valueReflectionSummary && (
              <ValueReflectionSummaryCard
                valueContext={exerciseData.valueContext}
                summary={valueReflectionSummary}
                onSave={saveValueReflectionSummary}
                onCancel={cancelValueReflectionSummary}
              />
            )}

            {showThinkingPatternSummary && thinkingPatternSummary && (
              <ThinkingPatternSummaryCard
                patternContext={exerciseData.patternContext}
                summary={thinkingPatternSummary}
                onSave={saveThinkingPatternSummary}
                onCancel={cancelThinkingPatternSummary}
              />
            )}

            {showVisionSummary && visionSummary && (
              <VisionSummaryCard
                summary={visionSummary}
                onSave={saveVisionSummary}
                onCancel={cancelVisionSummary}
              />
            )}

            {showTherapyGoalSummary && therapyGoalSummary && (
              <TherapyGoalSummaryCard
                summary={therapyGoalSummary}
                onSave={saveTherapyGoalSummary}
                onCancel={cancelTherapyGoalSummary}
              />
            )}
          </ScrollView>
          <View>

          {/* Suggestion Chips */}
          <SuggestionChips
            suggestions={chatSession.suggestions}
            onSuggestionPress={(suggestion) => handleSend(suggestion)}
            onSuggestExercise={() => chatSession.handleSuggestExercise()}
            showExerciseButton={
              chatSession.messages.filter(msg => msg.type === 'user').length >= 2 &&
              !chatSession.showExerciseCard &&
              !(exerciseMode && exerciseData.dynamicFlow) &&
              !isValueReflection &&
              !isThinkingPatternReflection
            }
            isVisible={chatSession.suggestions.length > 0}
            isTyping={chatSession.isTyping}
          />

          {/* End Reflection Button - Positioned after suggestion chips */}
          {(isValueReflection || isThinkingPatternReflection) && !showValueReflectionSummary && !showThinkingPatternSummary && canEndReflection && (
            <Animated.View 
              style={[
                styles.endReflectionContainer,
                {
                  opacity: endReflectionButtonAnimation,
                  transform: [{
                    scale: endReflectionButtonAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1]
                    })
                  }]
                }
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  if (isValueReflection) {
                    endValueReflection(
                      chatSession.setMessages,
                      chatSession.setIsTyping,
                      chatSession.setSuggestions
                    );
                  } else {
                    endThinkingPatternReflection(
                      chatSession.setMessages,
                      chatSession.setIsTyping,
                      chatSession.setSuggestions
                    );
                  }
                }}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#5DA4CD', '#7FC4C4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.endReflectionButton}
                >
                  <Text style={styles.endReflectionButtonText}>{t('chat.endReflection')}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Input Area */}
          <ChatInput
            inputText={inputText}
            onInputTextChange={handleInputTextChange}
            onSend={handleSend}
            isRecording={voiceRecording.isRecording}
            isTranscribing={voiceRecording.isTranscribing}
            audioLevel={voiceRecording.audioLevel}
            partialTranscript={voiceRecording.partialTranscript}
            onMicPressIn={async () => {
              // Store current text before starting voice recording
              textBeforeVoiceRef.current = inputText.trim();
              await voiceRecording.startRecording();
            }}
            onMicPressOut={async () => {
              if (voiceRecording.isRecording) {
                await voiceRecording.stopRecording();
              }
            }}
            onStopRecording={voiceRecording.stopRecording}
            onCancelRecording={async () => {
              await voiceRecording.cancelRecording();
              // Restore text that was there before recording started
              setInputText(textBeforeVoiceRef.current);
            }}
            simpleRecordingLayout={
              // Use simple layout only for specific guided journal types
              currentExercise?.type === 'gratitude' ||
              currentExercise?.type === 'journaling' ||
              currentExercise?.type === 'daily-reflection'
            }
          />
</View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaWrapper>
    </>
  );
};

export default ChatInterface;


